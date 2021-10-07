---
title: Backing Services and Database Migrations
weight: 50
layout: single
team:
  - VMware Tanzu Labs
---

You will create [MySQL](https://www.mysql.com/) databases for the
**pal-tracker** project.
MySQL is a good choice for a data store because it is a well-tested
relational database.
Relational databases are a good fit for almost any data store need.

This lab introduces a tool called
[Flyway](https://flywaydb.org/documentation/)
which performs database
[schema migrations](https://en.wikipedia.org/wiki/Schema_migration).
Migration tools such as Flyway work by tracking changes to the database
schema alongside the codebase.
This has many benefits:

-   Migrations can be applied to different environments in a
    reproducible way.
-   The schema is versioned in lock-step with the code.
-   The last-run migration is readily apparent.
-   Schema changes are performed easily.

### Schema migration not data migration

This lab focuses on migrating a database **schema** &mdash; the table
and column structure &mdash; from one version to another.
It is not about migrating **data** from one database to another.

The problem of
[data migration](https://en.wikipedia.org/wiki/Data_migration)
may be related to schema migration.
For example, some schema changes may so large that they require data
to be transformed and transferred to a new database.
However, you would address this using a different set of technologies,
such as [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load)
tools.

## Learning outcomes

After completing the lab, you will be able to:

-   Define database schema migrations
-   Describe why versioning schema changes with the codebase in source
    control is beneficial
-   Describe how to create and run a script for setting up databases
    on your development machine
-   Use the command-line to create services from the marketplace

## Get started

1.  Review the
    [Services](https://docs.google.com/presentation/d/1I0PCgsBnsbz_EOfWSpNhcdb73xCd-Zj1g-h3IGe3ox4/present#slide=id.gae083b4822_0_215)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Spring MVC with REST Endpoints lab](../spring-mvc/).
    You must have your `pal-tracker` application associated with the
    `mvc-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Pull in the CI migration task.

    ```bash
    git cherry-pick migration-start
    ```

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `migrations-solution` tag.

You may also refer to the [Hints](#hints) section at the end of the lab
if you need more assistance.

## Create a database on *Tanzu Application Service*

Create the database service on *Tanzu Application Service*
that you will use later in the lab.
You do this here because the MySQL service takes a while to create
instances.

1.  Use the `cf marketplace` command to find a MySQL database service on
    your *Tanzu Application Service* installation.
    use the `cf create-service` command to create an instance of this
    service named _tracker-database_.

1.  Confirm that the service instance is being created via
    `cf service tracker-database`.

## Create the database DDL

1.  Create a folder in the root of your project called `databases`.
1.  Create a folder inside the `databases` folder called `tracker`.
1.  Create a Database Definition Language (DDL) file called
    `create_databases.sql` with content from the following command:

    ```bash
    git show migration-solution:databases/tracker/create_databases.sql
    ```

    This file will be used to perform the following actions during local
    development.

    -   Drop old databases.
    -   Create a development version of the database.
    -   Create a test version of the database.
    -   Create a `tracker` user in the database that has access to the
        databases.

## Create migrations

1.  Create a file called `V1__initial_schema.sql` in
    `databases/tracker/migrations/` with content from the following
    command:

    ```bash
    git show migration-solution:databases/tracker/migrations/V1__initial_schema.sql
    ```

1.  This file holds the instructions to create the time
    entries table with the following columns:

    -   `id` (integer, primary key)
    -   `project_id` (integer)
    -   `user_id` (integer)
    -   `date` (date)

        You will use a date type here because you do not need
        to track time information.
        This decision depends on the requirements of the
        software.

    -   `hours` (integer)

1.  Flyway helps keep track of database versions as a project
    progresses.

1.  Flyway will automatically run our migrations to the latest version
    assuming that the migration file names follow a certain convention.
    The convention is `V##__` where the hashes are digits corresponding
    to the migration's order in the list of migrations.

    **Beware that there two underscores as the delimiter between**
    **the version number and the migration description.**

Read more about flyway naming conventions
[here](https://flywaydb.org/documentation/migrations#sql-based-migrations).

## Migrate local database

1.  Run the DDL file from the earlier step with:

    ```bash
    mysql -uroot < databases/tracker/create_databases.sql
    ```

    This creates the development and test versions of the tracker
    database, but they do not have any tables or columns yet.

1.  Run the migrations on the development database.

    ```bash
    flyway -url="jdbc:mysql://localhost:3306/tracker_dev" -locations=filesystem:databases/tracker clean migrate
    ```

    User will be `tracker` with no password, if you have set up MySQL in
    a standard way.
    Refer to [the Flyway documentation](https://flywaydb.org/documentation/commandline/)
    for alternative installation instructions.

1.  Do the same on the test database.

    ```bash
    flyway -url="jdbc:mysql://localhost:3306/tracker_test" -locations=filesystem:databases/tracker clean migrate
    ```

1.  Inspect the databases with your favorite MySQL tool and verify that
    the new `time_entries` table looks correct.
    For example:

    ```bash
    mysql -u tracker
    ```

    ```sql
    use tracker_dev;
    describe time_entries;
    ```

    ```no-highlight
    +------------+--------------+------+-----+---------+----------------+
    | Field      | Type         | Null | Key | Default | Extra          |
    +------------+--------------+------+-----+---------+----------------+
    | id         | bigint(20)   | NO   | PRI | NULL    | auto_increment |
    | project_id | bigint(20)   | YES  |     | NULL    |                |
    | user_id    | bigint(20)   | YES  |     | NULL    |                |
    | date       | date         | YES  |     | NULL    |                |
    | hours      | int(11)      | YES  |     | NULL    |                |
    +------------+--------------+------+-----+---------+----------------+
    ```

## Migrate on *Tanzu Application Service*

You are building a cloud native application which assumes that backing
services (like a database) are provided by the platform.
Since the **pal-tracker** application now needs a database,
you must create the database service and bind your application to it.
This instructs the platform to reserve the instance of the service and
then provide the connection information to your application.

1.  Use the `cf service` or `cf services` command to confirm that your
    service instance has been created.

1.  Bind the service instance to your application with the
    `cf bind-service` command.

    This instructs *Tanzu Application Service* to provide your
    application with the connection information for the MySQL database
    you created earlier.
    This is given to your application in the `VCAP_SERVICES`
    environment variable.

    Verify the `pal-tracker` application environment variable is set by
    running `cf env pal-tracker`.
    Do you see the `VCAP_SERVICES` environment variable set in the
    Cloud Controller?

1.  Take a look at the updated `.github/workflows/pipeline.yml` file

    The cherry-pick you performed at the beginning of this lab brought
    in changes to your `.github/workflows/pipeline.yml` file which run a
    `migrate-databases.sh` script.
    This script opens an SSH tunnel to your *Tanzu Application Service*
    database and performs migrations.

    The database instance that your application has access to is
    protected by a firewall so you will not be able to connect to it
    directly.
    Instead, you can open an SSH tunnel which will use your application
    as a proxy so that the Flyway CLI running on your CI server can
    migrate the database managed by *Tanzu Application Service*.

    This functionality does assume you have SSH access on the
    *Tanzu Application Service* instance you are working with.
    This may not be possible in your environment.
    In this case you should take a look at the [Extras](#extras)
    section for some ideas as to how you might handle this.
    You can also look in the [Hints](#hints) for suggestions
    on how you could use an external database that you
    have direct access to.

1.  Commit and push your changes.

    This will trigger a rebuild and re-deployment to the staging
    environment that will also perform the migrations on your
    *Tanzu Application Service* database.

## Wrap up

Review the
[Migrations](https://docs.google.com/presentation/d/15DO2A_raKVbPh7qGjXQ9Hi79NFwZdsImHu04jNlsC54/present#slide=id.gae083b4822_0_14)
slides about database migrations.

Now that you have completed the lab, you should be able to:

-   Define database schema migrations
-   Describe why versioning schema changes with the codebase in source
    control is beneficial
-   Describe how to create and run a script for setting up databases
    on your development machine
-   Use the command-line to create services from the marketplace

## Extras

### Verify container service binding

-   Verify whether or not the `VCAP_SERVICES` environment variable is
    set in the current running `pal-tracker` container:

    -   SSH to the running `pal-tracker`:

        `cf ssh pal-tracker -i 0`

    -   Determine if `VCAP_SERVICES` is set:

        `env |grep VCAP_SERVICES`

-   Do you see the environment variable set in the running container?
    Why, or why not?

### Write and execute some additional migrations

-   Write a few other migrations if you have additional time.
-   Explore some of the other
    [Flyway commands](https://flywaydb.org/documentation/)
    and investigate how you can use them to manipulate the database.

-   Next,
    implement your migrations using a different
    [versioning scheme](https://flywaydb.org/documentation/migrations#versioned-migrations).

### Implement a migration that operates on-platform

The migration in this lab runs off-platform &mdash;
it runs on either a developer workstation,
or on the CI/CD server infrastructure.
It does *not* run on the *Tanzu Application Service* platform.

It is problematic for two reasons:

-   It requires a tunnel to execute the migration against the managed
    and brokered MySQL database.
    Your platform operators will likely not allow and enable tunneling
    on your *Tanzu Application Service* platform.

-   It requires the `pal-tracker` application to be pushed *before* the
    migration can be executed,
    because the design requires a running container on the platform that
    the Flyway migration can tunnel to its network.
    That implies you must design into your release workflow to block
    traffic to your application until the migration is successfully
    complete.

You can improve upon this design by the following:

-   Implement a process/job whose sole function is to run a Flyway
    migration,
    *that is not the same application that consumes the migrated database.*
    It will run on the *Tanzu Application Service* platform as a
    [*Task*](https://docs.pivotal.io/application-service/2-9/devguide/using-tasks.html),
    or as a *Tanzu Application Service*
    [*Scheduled Job*](https://docs.pivotal.io/scheduler/1-4/using-jobs.html).

-   Ensure the migration job is run *before* the release of the
    next application version that depends on it.
    For zero downtime,
    rolling upgrades,
    this means your database changes must be backward compatible.

Implement the *improved* migration:

1.  Create a new Spring boot app named `pal-tracker-migrations`.
    Use Spring Boot with Flyway Integration to run the Flyway
    migrations.
    You can simplify the solution by bundling the Flyway migrations
    inside the application *resources* and reference from the
    classpath instead of the file system.
    See the following links for help:

    - [Spring Boot migrations](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-a-higher-level-database-migration-tool)
    - [Flyway](https://flywaydb.org/documentation/usage/plugins/springboot)
    - [Baeldung migration tutorial](https://www.baeldung.com/database-migrations-with-flyway)
    - [*Tanzu Application Service* Overview - a better migration approach](https://docs.google.com/presentation/d/17NxY9m73TDW2aiXvCDMeV7y74ox2F4bnV8ye921c0VQ/view#slide=id.gb9790c5b4b_0_329)

1.  [Create a Cloud task](https://docs.pivotal.io/application-service/2-9/devguide/using-tasks.html)
    for your new migration and run it on *Tanzu Application Service*
    platform.

## Hints

### How do you create a database instance in *Tanzu Application Service*?

This lab assumes that you have some kind of MySQL service available in
your foundation, as shown through the `cf marketplace` command.
It is possible that there may be more than one or, perhaps, none at all.
If you have access to the
[Apps Manager](https://docs.pivotal.io/application-service/2-11/console/dev-console.html)
application, it may be easier to browse
the services marketplace there as the output from `cf marketplace` can
be a little hard to read when there are many services.
You will need to find the name of the service and at least one
"service plan" name.
Plans represent a specific configuration of the service,
for example, a particular database size or quality of service.

Here is and edited version of the output from `cf marketplace`:

```no-highlight
$ cf marketplace
Getting services from marketplace in org neil / space sandbox as neil...
OK

service         plans                  description                    broker
...
p.mysql         db-small, db-medium    Dedicated instances of MySQL   dedicated-mysql-broker
...
```

The service name here is `p.mysql` and there are two plans available, `db-small` and
`db-medium`.

Using that information a possible command to create the `tracker-database` instance
might be:

```bash
cf create-service p.mysql db-small tracker-database
```

### What about using an external database?

If you can not, or do not want to, create a database service instance
within your foundation, you can use a database available outside the
foundation.

You can create a
[user-provided service](https://docs.cloudfoundry.org/devguide/services/user-provided.html)
and bind it to your application, in the same way that you bind a service
created from the service catalog.
However, the simplest mechanism may be the same that you will see used
in [next lab](../jdbc-template/)
for accessing the local database.
That is by setting the `SPRING_DATASOURCE_URL` environment variable.

Please be aware, however, that using either method you will need to
modify the `migrate-databases.sh` script to work with that configuration.
