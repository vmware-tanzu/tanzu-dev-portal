---
title: Deploy a Distributed System
weight: 110
layout: single
team:
  - VMware Tanzu Labs
---

In this lab you will see an evolution of the `pal-tracker`
codebase, structured according to the principles described in
the
[App Continuum](https://courses.education.pivotal.io/appcontinuum).
You will then use
[GitHub Actions](https://github.com/features/actions) to
deploy that system of four applications to *Tanzu Application Service*.

## Learning outcomes

After completing the lab, you will be able to:

-   Outline the reasons to keep the source code for multiple
    applications under one repository
-   Explain the directory structure and dependencies defined in the
    build files
-   Describe how to run a microservice application locally
-   Use an HTTP client to manually test API endpoints
-   Explain how to configure CI to test and deploy multiple applications
-   Outline the reasons to deploy all the applications at the same time

## Get started

1.  Prepare a new `pal-tracker-distributed` codebase by following
    [the introduction codebase preparation](../intro/#project-structure-and-codebase)
    steps 3 and 4 using the
    [`pal-tracker-distributed` codebase link](https://github.com/platform-acceleration-lab/pal-tracker-distributed/releases/download/platform-acceleration-release-12.3.74/pal-tracker-distributed.zip).

1.  Prepare a new remote GitHub repository for your
    `pal-tracker-distributed` codebase according to the
    [Introduction lab instructions](../intro/#github).

1.  Prepare new GitHub repository secrets for your
    `pal-tracker-distributed` codebase according to the
    [Pipelines lab instructions](../pipelines/#configure-environment-variables).

1.  Review the
    [Overview](https://docs.google.com/presentation/d/1IFXGBBBHKGJcS9mEWHaPodUXYq9hVEjiUXPSv6MTWyg/present#slide=id.ge9cac6b4e4_0_0)
    slides.
    These provide a view of the main elements of the new system
    and how they interact.

## Set up services

You will now create databases for your applications.
You create them now because the MySQL service instances take time to
provision.

Create a MySQL service instance for each application.
Call them `tracker-allocations-database`, `tracker-backlog-database`,
`tracker-registration-database` and `tracker-timesheets-database`.

## Explore the codebase

Open the code in your IDE and take a look around.
Make sure that the project is set up to use Java 11.

Pay special attention to the new directory structure of
your codebase.

```no-highlight
.
├── applications
│   ├── allocations-server
│   ├── backlog-server
│   ├── registration-server
│   └── timesheets-server
├── components
│   ├── accounts
│   ├── allocations
│   ├── backlog
│   ├── projects
│   ├── rest-support
│   ├── test-support
│   ├── timesheets
│   └── users
├── databases
│   ├── allocations-database
│   ├── backlog-database
│   ├── registration-database
│   └── timesheets-database
├── integration-test
└── buildSrc
```

-   The `applications` directory contains four Spring Boot applications.
-   The `components` directory contains components of the application
    domains and support libraries.
-   The `databases` directory contains migration information for the
    different database schemas.
-   The `buildSrc` directory is a standard Gradle directory that gets
    built before the rest of the build is loaded.
    This is where code for some custom Gradle plugins is stored.

### A note on other tags

You may see that the `pal-tracker-distributed` codebase contains a
number of tags for code versions that are not referenced in these
materials.
They are used in other materials beyond the current scope of this
learning path.

## Explore locally

### Build

First, make sure that you can test and build the project locally.
Create the databases, migrate, then run the build.

```bash
mysql -uroot < databases/create_databases.sql
./gradlew devMigrate testMigrate
./gradlew clean build
```

You will notice that there unit tests for each of the components as
well as basic tests for individual applications.
However, there are also a set of integration tests that exercise
all of the microservices, working together.
This ability to test the system as a whole is greatly helped by
having all the code, for all applications, together in a single
repository.
It also makes it easier to extract and share common code.

### Run

Next, make sure that you can run the project locally.

You can run each application individually in a separate terminal window
by targeting the `bootRun` task for a specific Gradle subproject.
For example, you can run the *registration service* with the following
command:

```bash
./gradlew applications:registration-server:bootRun
```

Managing many terminal windows can be cumbersome,
so you can use the Gradle
[parallel execution](https://guides.gradle.org/performance/#parallel_execution)
feature to make things a bit easier.
The following command finds all `bootRun` tasks in a Gradle project and
executes them in parallel.

```bash
./gradlew bootRun --parallel
```

Beware that running all applications in parallel will send the log
output of all applications to the same terminal, which can make
debugging difficult.
Also, pressing `Ctrl+C` will interrupt all applications at once.
If you need to stop one application you can use the
[JVM process status tool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jps.html)
to list Java processes by running:

```bash
jps -l
```

You can then find the process ID of the specific application and stop
just that one.

### Exercise endpoints

Exercise the `curl` commands below to make sure that you understand the
system.
Keep these commands handy, as they will be useful to test your system in
future labs.

Note that (on UNIX/Linux) if you define shell variables
*USER_ID, PROJECT_ID* and *ACCOUNT_ID* with the values that you receive
back at different stages then you will be able to cut and paste these
commands directly.
For example, the first `curl` command will produce something like this:

```json
{"id":1,"name":"Pete","info":"registration info"}
```

From this you can see that the generated user ID is 1,
and you can then set the shell variable *USER_ID* as follows:

```bash
USER_ID=1
```

__Users__

```bash
curl -v -XPOST -H"Content-Type: application/json" localhost:8083/registration -d'{"name": "Pete"}'
curl -v localhost:8083/users/${USER_ID}
```

__Accounts__

```bash
curl -v localhost:8083/accounts?ownerId=${USER_ID}
```

__Projects__

```bash
curl -v -XPOST -H"Content-Type: application/json" localhost:8083/projects -d"{\"name\": \"Basket Weaving\", \"accountId\": ${ACCOUNT_ID}}"
curl -v localhost:8083/projects?accountId=${ACCOUNT_ID}
```

__Allocations__

```bash
curl -v -XPOST -H"Content-Type: application/json" localhost:8081/allocations -d"{\"projectId\": ${PROJECT_ID}, \"userId\": ${USER_ID}, \"firstDay\": \"2015-05-17\", \"lastDay\": \"2015-05-18\"}"
curl -v localhost:8081/allocations?projectId=${PROJECT_ID}
```

__Stories__

```bash
curl -v -XPOST -H"Content-Type: application/json" localhost:8082/stories -d"{\"projectId\": ${PROJECT_ID}, \"name\": \"Find some reeds\"}"
curl -v localhost:8082/stories?projectId=${PROJECT_ID}
```

__Time Entries__

```bash
curl -v -XPOST -H"Content-Type: application/json" localhost:8084/time-entries/ -d"{\"projectId\": ${PROJECT_ID}, \"userId\": ${USER_ID}, \"date\": \"2015-05-17\", \"hours\": 6}"
curl -v localhost:8084/time-entries?userId=${USER_ID}
```

## Set up *GitHub Actions* for continuous integration

### Get the pipeline

You are provided a pipeline file as part of the `pipeline` tag.

Cherry-pick this into your `pal-tracker-distributed` workspace:

```bash
git cherry-pick pipeline
```

Your new `.github/workflows/pipeline.yml` file configures the pipeline
to build all four applications,
deploy them to *Tanzu Application Service*,
and migrate all four databases.

Take a few minutes to review the pipeline.
Notice the `build-and-publish` and `migrate-databases` jobs method of
executing the Flyway migrations.
Take a look at the `buildSrc` project and associated Gradle migration
tasks.

## Confirm service creation

Confirm that all of the MySQL instances you created earlier have been
fully provisioned using the `cf services` or `cf service` command.
The instances will be bound via an entry in the manifest.

## Choose routes

The root directory contains a deployment manifest for each application
in our distributed system.
Familiarize yourself with a manifest, below.

```bash
git show pipeline:manifest-allocations.yml
```

Each application needs a unique route so that it does not collide with
other people's applications.

1.  Replace the `${UNIQUE_IDENTIFIER}` and `${DOMAIN}` placeholders
    in the `route` value in each manifest to make it unique.
    Follow the same approach used for `pal-tracker`, as described in the
    [Route Naming](../route-naming/) guide.

1.  Once you have chosen routes, update the value for
    `REGISTRATION_SERVER_ENDPOINT` in each manifest.
    You are given the following configuration in the manifest files:

    ```no-highlight
    env:
      REGISTRATION_SERVER_ENDPOINT: http://${REGISTRATION_SERVER_ROUTE}
    ```

    You need to fill-in the proper route instead of the placeholder
    `${REGISTRATION_SERVER_ROUTE}`.

1.  Commit your changes and push them to GitHub.

    This will trigger a build on GitHub Actions,
    given that you have added the workflow pipeline.
    Expect the build and deploy to succeed this time.

1.  For each application, visit its root page on
    *Tanzu Application Service* and test manually.
    Each one should display `Noop!`.

1.  Manually trigger a few requests to the various controllers to verify
    that the applications are working as expected.

    The `allocations`, `backlog`, and `timesheets` applications all
    integrate with the `registration` application, so make sure to
    exercise API endpoints that integrate with `registration`.

You will note that a code change to any part of the codebase will cause
all of the applications to be rebuilt, tested and pushed to
*Tanzu Application Service*.
This means that you have the highest degree of confidence that all
the microservices will continue to work together,
without having to worry about issues such as API compatibility between
different deployed versions.

## Wrap up

Now that you have completed the lab, you should be able to:

-   Outline the reasons to keep the source code for multiple
    applications under one repository
-   Explain the directory structure and dependencies defined in the
    build files
-   Describe how to run a microservice application locally
-   Use an HTTP client to manually test API endpoints
-   Explain how to configure CI to test and deploy multiple applications
-   Outline the reasons to deploy all the applications at the same time

## Extra

If you have additional time, run a few requests that will test the
limits of your distributed system.

In a Bash shell you can use the [`siege`](https://github.com/JoeDog/siege)
command to generate many requests. First, generate some data with the
curl commands in the [run section](#run).
Next, create a `urls.txt` file with the following content:

```no-highlight
https://registration-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/users/${USER_ID}
https://registration-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/accounts?ownerId=${USER_ID}
https://registration-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/projects?accountId=${ACCOUNT_ID}
https://allocations-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/allocations?projectId=${PROJECT_ID}
https://backlog-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/stories?projectId=${PROJECT_ID}
https://timesheets-pal-${UNIQUE_IDENTIFIER}.${DOMAIN}/time-entries?userId=${USER_ID}
```

Run the following command to generate lots of traffic:

```bash
siege -c255 -f urls.txt
```

Play around with stopping, scaling, and starting your applications to
see what effect these actions have on your generated traffic and
response times.
