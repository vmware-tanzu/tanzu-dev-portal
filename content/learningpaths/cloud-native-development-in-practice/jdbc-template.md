---
title: Data Access
weight: 60
layout: single
team:
  - VMware Tanzu Labs
---

In this lab you will implement the database version of the Time Entry
Repository using
[Spring JDBC Template](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/jdbc/core/JdbcTemplate.html).

## Learning outcomes

After completing the lab, you will be able to:

-   Recall why *Object Relational Mappers* encourage circular
    dependencies
-   Describe how to set up a Spring Boot app to connect to a MySQL
    database locally
-   Describe how to set up a Spring Boot app running on
    *Tanzu Application Service* to connect to a MySQL Service
-   Use JDBC Template to perform CRUD database operations

## Get started

1.  You must have completed (or fast-forwarded to) the
    [Backing Services and Database Migrations lab](../database-migrations/).
    You must have your `pal-tracker` application associated with the
    `migrations-solution` codebase deployed and running on
    *Tanzu Application Service*,
    and your local and *Tanzu Application Service* databases must have
    been migrated.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Pull in unit and integration tests:

    ```bash
    git cherry-pick jdbc-start
    ```

The goal is to get your tests passing by the end of the lab.

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `jdbc-solution` tag.

You can also look at the [Hints](#hints) for some more assistance.

## Configure datasource dependencies

Add the following dependencies to the `build.gradle` file:

```diff
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
+   implementation 'org.springframework.boot:spring-boot-starter-jdbc'
+   implementation 'mysql:mysql-connector-java'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

## Configure migration dependencies

Review the `.github/workflows/pipeline.yml` pipeline declaration
additions from the `jdbc-start` cherry-pick.
You will see a `Create test database` section has been added to the
`build-and-publish` job to set up the CI test database.

It uses a new Flyway task you will add next to run it
through Gradle instead of the command line.

Configure Flyway in your `build.gradle` file as follows:

1.  Add import for Flyway as the first line in the `build.gradle` file:

    ```diff
    + import org.flywaydb.gradle.task.FlywayMigrateTask
    ```

1.  Add the `flyway` plugin to the `plugins` closure:

    ```diff
      plugins {
          id 'org.springframework.boot' version '2.5.3'
          id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    +     id "org.flywaydb.flyway" version "7.13.0"
          id 'java'
      }
    ```

1.  Define connection details you can use within the build system to
    connect to the local databases you created earlier.

    ```diff
      test {
          useJUnitPlatform()
      }

    + def developmentDbUrl = "jdbc:mysql://localhost:3306/tracker_dev?user=tracker&useSSL=false&useTimezone=true&serverTimezone=UTC&useLegacyDatetimeCode=false"
      bootRun.environment([
        "WELCOME_MESSAGE": "howdy",
    +   "SPRING_DATASOURCE_URL": developmentDbUrl,
      ])

    + def testDbUrl = "jdbc:mysql://localhost:3306/tracker_test?user=tracker&useSSL=false&useTimezone=true&serverTimezone=UTC&useLegacyDatetimeCode=false"
      test.environment([
        "WELCOME_MESSAGE": "Hello from test",
    +   "SPRING_DATASOURCE_URL": testDbUrl,
      ])
    ```

1.  Configure the `flyway` task:

    ```diff
    + flyway {
    +   url = developmentDbUrl
    +   user = "tracker"
    +   password = ""
    +   locations = ["filesystem:databases/tracker/migrations"]
    + }
    ```

1.  Configure the `testMigrate` task to derive from the `flyway` task,
    but override the `url` with the `testDbUrl` you configured in
    previous step:

    ```diff
    + task testMigrate(type: FlywayMigrateTask) {
    +   url = testDbUrl
    + }
    ```

    This is the Gradle task executed by the pipeline to migrate
    your test database.

1.  Review the `build.gradle` file below to verify your datasource
    and migration build configuration.

    ```bash
    git show jdbc-solution:build.gradle
    ```

## Add the service binding to the manifest

In the previous lab you manually bound the new `tracker-database`
service to the application.
Add the following lines to the `manifest.yml` to capture
the information about that binding so that it is not lost if
you re-create the application:

```yaml
  services:
  - tracker-database
```

The `services` label should be at the same level of indentation
as the `routes` and `env` labels.

## Create the repository

1.  Create a new class called `JdbcTimeEntryRepository` that:
    -   Implements the `TimeEntryRepository` interface.
    -   Takes a `DataSource` as a constructor argument.
        Make sure to use the `DataSource` interface type,
        not the concrete `MysqlDataSource` class type.

    Use the `JdbcTimeEntryRepositoryTest` to guide your
    implementation.
    Keep the following tips in mind:

    -   Use the `DataSource` to construct a `JdbcTemplate` object and
        store the `JdbcTemplate` object to a private field.

    -   In the `create` method use the `JDBCTemplate#update()` method
        to persist the `TimeEntry` object to the database.
        Retrieve the newly created record from the database using the
        generated ID (the ID can be retrieved using a
        [`GeneratedKeyHolder`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/support/GeneratedKeyHolder.html))

    Take a look at our solution if you need help:

    ```bash
    git show jdbc-solution:src/main/java/io/pivotal/pal/tracker/JdbcTimeEntryRepository.java
    ```

1.  In `PalTrackerApplication` modify the method that returns a
    `TimeEntryRepository` bean to return an instance of
    `JdbcTimeEntryRepository`.

1.  Add a set-up method to `TimeEntryApiTest`.

    ```java
    @BeforeEach
    public void setUp() throws Exception {
        MysqlDataSource dataSource = new MysqlDataSource();
        dataSource.setUrl(System.getenv("SPRING_DATASOURCE_URL"));

        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("TRUNCATE time_entries");

        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
    ```

    ```bash
    git show jdbc-solution:src/test/java/test/pivotal/pal/trackerapi/TimeEntryApiTest.java
    ```

1.  Run the build to make sure everything still passes.

    ```bash
    ./gradlew clean build
    ```

1.  Commit and push your code to GitHub, then let your pipeline deploy
    the new application.

## Wrap up

Now that you have completed the lab, you should be able to:

-   Recall why *Object Relational Mappers* encourage circular
    dependencies
-   Describe how to set up a Spring Boot app to connect to a MySQL
    database locally
-   Describe how to set up a Spring Boot app running on
    *Tanzu Application Service* to connect to a MySQL Service
-   Use JDBC Template to perform CRUD database operations

## Extras

### Verify container service binding

-   Verify whether or not the `VCAP_SERVICES` environment variable is
    set in the current running `pal-tracker` container:

    -   SSH to the running `pal-tracker`:

        `cf ssh pal-tracker -i 0`

    -   Determine if `VCAP_SERVICES` is set:

        `env | grep VCAP_SERVICES`

-   Do you see the environment variable set in the running container?
    Why, or why not?

### Java buildpack auto-reconfiguration

In this lab you saw the *Java buildpack auto-reconfiguration* feature
in work.
It replaces the Spring Boot auto-configured `DataSource` with one it
creates from the service binding found in `VCAP_SERVICES`.

One issue you may have noticed if you reviewed the app logs after
deploying your JDBC code changes is this warning:

```nohighlight
2020-12-18T13:03:59.98-0600 [APP/PROC/WEB/0] OUT 2020-12-18 19:03:59.988  INFO 14 --- [           main] o.c.reconfiguration.CloudServiceUtils    : 'dataSource' bean of type with 'javax.sql.DataSource' reconfigured with 'tracker-database' bean
2020-12-18T13:04:00.02-0600 [APP/PROC/WEB/2] ERR Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
```

But you did not see this when you ran this locally as a Spring Boot app!

A trade-off of using the default *Tanzu Application Service* Java
buildpack auto-reconfiguration behavior is that it hijacks backing
service configuration,
and replaces with the associated Spring beans configured separately by
the auto-reconfiguration plugin.
This includes any `DataSource` configuration you
(the application developer or application operator) may have provided.

The reconfiguration behavior is scanning and picking up the deprecated
driver instead of the newer driver that is supplied in the
`mysql-connector-java` dependency.

See
[here](https://github.com/cloudfoundry/java-buildpack-auto-reconfiguration#what-is-auto-reconfiguration)
for more information.

There are a couple of scenarios under which you may choose to suppress
the auto-reconfiguration:

1. Your app has multiple datasources to configure.
1. You want to replace the auto-reconfigured datasource.

You can turn off the auto-reconfiguration behavior as follows:

`cf set-env pal-tracker JBP_CONFIG_SPRING_AUTO_RECONFIGURATION '{ enabled: false }'`

This will suppress auto-configuration of your datasource via
`VCAP_SERVICES` during the next push and staging of your application.

You will also need to configure your datasource or datasources by
parsing `VCAP_SERVICES` for the associated service binding credentials,
or you can also use the
[VCAP processor provided by Spring Boot](https://github.com/spring-projects/spring-boot/blob/v1.3.3.RELEASE/spring-boot/src/main/java/org/springframework/boot/cloud/CloudFoundryVcapEnvironmentPostProcessor.java).

### Spring Data JDBC

1.  Try out reimplementing time entry persistence with *Spring Data JDBC*.

1.  Read through the
    [Spring Data JDBC reference](https://docs.spring.io/spring-data/jdbc/docs/2.1.3/reference/html/#preface)
    for help getting started.

### JPA

1.  Try out reimplementing time entry persistence with *JPA*.

1.  Read through the
    [Spring JPA guide](https://spring.io/guides/gs/accessing-data-jpa/)
    for help getting started.

If you completed both of the *Spring Data JDBC* and *JPA* extras,
how did both of the solution compare to the *JDBC Template* solution?

## Hints

### Where do you get the `DataSource` from?

It is obvious that, ultimately,
the application will need a `DataSource` instance,
connected to a real database.
It is much less obvious how to create that.
The good news is that you, the developer,
do not need to create the datasource at all &mdash;
Spring Boot will do that for you!
In order to do that it needs several things to be true:

-   Spring Boot auto-configuration is enabled, which it is by default.

-   There is a valid value for the configuration property
    `spring.datasource.url` (in this case provided via the environment),
    or the app is running in a cloud environment
    (such as *Tanzu Application Service*) where information on bound
    database instances is available.

-   There is an appropriate JDBC driver available on the classpath.

If these conditions are true,
Spring Boot will create a datasource bean and place it in the
application context.

### How do you inject the `DataSource` into the `JdbcTimeEntryRepository`?

As well as Spring auto-wiring parameters into bean class constructors,
it will also auto-wire the parameters of methods annotated with `@Bean`.
