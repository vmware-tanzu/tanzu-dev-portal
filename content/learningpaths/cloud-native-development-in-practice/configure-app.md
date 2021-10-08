---
title: Configure a Spring Boot Application
weight: 20
layout: single
team:
  - VMware Tanzu Labs
---

Gain more understanding on how to build cloud native applications.

## Learning outcomes

After completing the lab, you will be able to:

-   Summarize some of the ways to configure a Spring application
-   Use environment variables to configure an application running
    locally
-   Use `cf logs` to view the logs of an application running on
    *Tanzu Application Service*
-   Use environment variables to configure an application running on
    *Tanzu Application Service*
-   Explain when to use the CLI versus a manifest for
    application configuration

# 12 factor applications

If you completed the
[Cloud Native Development learning path](../../cloud-native-development/general__twelve-factor-apps/),
you should already be familiar with [12 factors](https://12factor.net)
guidelines.

In practice, you will have to decide which ones to use and if it makes
sense to adhere to all of them.

In the previous lab, you covered the first two factors by setting up
your codebase in GitHub and using Gradle to explicitly declare your
dependencies.

This lab will focus on the third factor:
storing configuration in
the environment.

There are many options for how to externalize configuration for a cloud
native application.
Our first choice is to use environment variables.

Another choice, externalizing configuration using a Config Server,
will be introduced in later lessons.

## Get started

1.  Review the
    [Environment](https://docs.google.com/presentation/d/1Sy5EvqCLPHSv1zJ8NyPyza4oAANn1qxYCeiyJclQgZ0/present#slide=id.ge9c860dbf9_0_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Deploying a Spring Boot Application lab](../spring-boot-app-deploy/).
    You must have your `pal-tracker` application associated with the
    `spring-boot-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Pull in pre-authored tests to your codebase:

    ```bash
    git cherry-pick configuration-start
    ```

    You will see the following tests:

    ```no-highlight
    [main 95c54c1] Add tests for configuration lab
    Author: <redacted>
    Date: Wed Jan 8 11:09:04 2020 -0500
    3 files changed, 67 insertions(+)
    create mode 100644 src/test/java/test/pivotal/pal/tracker/EnvControllerTest.java
    create mode 100644 src/test/java/test/pivotal/pal/tracker/WelcomeControllerTest.java
    create mode 100644 src/test/java/test/pivotal/pal/trackerapi/WelcomeApiTest.java
    ```

    Your goal is to get your tests to pass by the end of the lab,
    as well as deploy the updated code to *Tanzu Application Service*.

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward)
to the `configuration-solution` tag.

## Add test dependencies

Since you now have added tests to your codebase,
you need to set up the build to use a testing framework.
You will use Junit 5.

Add the following to your `build.gradle` file:

1.  Add the following line to the `dependencies` closure in your
    `build.gradle` file to enable the necessary test dependencies:

    ```groovy
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    ```

1.  Add the following closure to the end of the `build.gradle`
    file:

    ```groovy
    test {
        useJUnitPlatform()
    }
    ```

1.  Take a look at the solution if you get stuck

    ```bash
    git show configuration-solution:build.gradle
    ```

## Environment variables

You will use the environment variable mechanism to provide configuration
to a process.

It does not matter if your application is written in
[Java](https://en.wikipedia.org/wiki/Java_(programming_language)),
[Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)),
[Golang](https://en.wikipedia.org/wiki/Go_(programming_language)), or
some other language,
they all have the capability of accessing environment variables during
their process start up time.

*Tanzu Application Service* can be configured to provide your application
with environment variables when it is executed.
In fact, it provides
[several environment variables](http://docs.run.pivotal.io/devguide/deploy-apps/environment-variable.html)
that your application can use to uniquely identify its execution
environment.

You will extend your application to:

-   Configure the "hello" message from the environment.
-   Add a RESTful endpoint that returns some of the system-provided
    variables.

## Externalize configuration

Spring Boot includes a mechanism to get configuration values.

1.  Extract the `hello` message to a field in the controller.
1.  Create a constructor that accepts a `message` parameter and assigns
    it to the field.
1.  Annotate that constructor parameter with `@Value`.

    `@Value` takes a specific format to reference an environment
    variable, for example:

    ```java
    @Value("${welcome.message}")
    ```

    Take time to read about [annotation-based configuration](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-annotation-config)
    if you are new to Spring or if you need a refresher.
    There is more
    [detailed documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions-beandef)
    on using Spring expressions in bean definitions and annotations,
    if you are interested.

1.  If you get stuck,
    review the solution:

    ```bash
    git show configuration-solution:src/main/java/io/pivotal/pal/tracker/WelcomeController.java
    ```

## Verify it works

Run your app with the `bootRun` Gradle task.
It will fail to start because Spring Boot is unable to find a value for
the requested variable.

From now on the `WELCOME_MESSAGE` environment variable must be set to
run your app.
One way to do this is to add the environment variable assignment before
the *Gradle* command.

```bash
WELCOME_MESSAGE=howdy ./gradlew bootRun
```

Notice you are using a different welcome message than the previous
statically configured message.

### Why is the `@Value` name `welcome.message`?

You may be wondering why the name given in the `@Value` annotation
is `welcome.message` and not the name of the environment variable,
`WELCOME_MESSAGE`.

Spring can take configuration information from
[many different sources](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config).
In order to support this, and to have a consistent way of naming
configuration items from different sources, Spring uses what is known as
[relaxed binding](https://github.com/spring-projects/spring-boot/wiki/Relaxed-Binding-2.0).
Among other things, this defines the rules that convert environment
variable names, such as `WELCOME_MESSAGE`,
to the common format represented by `welcome.message`.
This means that you could later change the source of the welcome message
text to, for example, a Java property without having to modify the code.

## Manage local configuration

Running your application like this with environment variables in the
command line every time is tedious.

You can [configure your Gradle build](https://cloudnative.tips/configuring-a-java-application-for-local-development-60e2c9794ca7)
to make this easier.

1.  Extend the `bootRun` and `test` tasks to set the required
    environment variable by adding the following to the end of your
    `build.gradle` file:

    ```groovy
    bootRun.environment([
        "WELCOME_MESSAGE": "howdy",
    ])

    test.environment([
        "WELCOME_MESSAGE": "Hello from test",
    ])
    ```

1.  You can review the solution here:

    ```bash
    git show configuration-solution:build.gradle
    ```

1.  This will instruct Gradle to set that environment variable for you
    when you run the `bootRun` task, so you can go back to just using:

    ```bash
    ./gradlew bootRun
    ```

This has the added benefit of documenting required environment variables
and supporting multiple operating systems.

## *Tanzu Application Service* environment variables

When *Tanzu Application Service* starts your application,
it will be running with a port provided by the runtime environment.
It will also have an instance ID set which will be distinct for
each instance, if the app has multiple instances.

Create an endpoint to see some of that information.

1.  Create another controller called `EnvController`.
1.  Annotate it with `@RestController`.
1.  Implement a method called `getEnv` as described in the
    `EnvControllerTest`.
1.  Annotate the `getEnv` method with `@GetMapping("/env")`.
1.  Declare `@Value` annotated constructor arguments to be populated
    with values of the following environment variables:

    - `PORT`
    - `MEMORY_LIMIT`
    - `CF_INSTANCE_INDEX`
    - `CF_INSTANCE_ADDR`

1.  Add a default value to the variables above so that the app will
    still run correctly locally.
    For example:

    ```java
    @Value("${cf.instance.index:NOT SET}") String cfInstanceIndex,
    ```

1.  Implement `getEnv` so that the test passes.

    Take a look at our solution if you get stuck:

    ```bash
    git show configuration-solution:src/main/java/io/pivotal/pal/tracker/EnvController.java
    ```

1.  Run your app and navigate to
    [localhost:8080/env](http://localhost:8080/env).
    Make sure you are getting a response.
    The variables will show `NOT SET`,
    which ensures the controller is valid.

1.  Navigate to [localhost:8080/](http://localhost:8080/).
    Make sure the root route still has the welcome message you set above.

1.  Make sure all your tests pass before moving on by running the
    *Gradle* `build` task.

## Deploy

1.  Push the app to *Tanzu Application Service*.
    The app will fail to start and will be reported as a crash.

    To see what the problem is, use the `cf logs` command.
    Logging in *Tanzu Application Service* works by taking everything
    from standard output and error
    (`System.out` and `System.err` in Java)
    and storing it in a small buffer.

1.  View the logs from your app through the `cf logs`
    command.
    By default, this will show you a stream of logs.
    To see logs from the recent past, use the `--recent` flag.

1.  Check the output and find the problem.
    You will see something about Spring not having a value for the
    welcome message.

1.  To fix this issue, use the `cf set-env` command to set the
    `WELCOME_MESSAGE` environment variable to
    __Howdy from Tanzu Application Service__ in your app's container on
    *Tanzu Application Service*.
    The CLI will give you a helpful tip:

    ```no-highlight
    TIP: Use 'cf restage pal-tracker' to ensure your env variable changes take effect
    ```

    Actually, the CLI does not know whether you need to restage,
    or simply restart.
    Restaging is necessary if the environment variable is used in the
    buildpack's compile stage.
    Restarting is sufficient if the environment variable is only used by
    the application at runtime.
    Restarting is usually faster,
    since the droplet does not need to be re-created.
    In this case, restarting is sufficient, so save yourself some time:

    ```bash
    cf restart pal-tracker
    ```

1.  Once your app is running on *Tanzu Application Service*,
    navigate to the root endpoint and check that it displays
    __Howdy from Tanzu Application Service__.

1.  Navigate to the `/env` endpoint and verify actual values are
    displayed instead of __NOT SET__.

## Manifest

The initial deployment failure could have been avoided by using a
[`manifest.yml`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html).

This file documents requirements for the application and configures
variables in the
[environment](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#env-block)
such as the `WELCOME_MESSAGE` and setting the JDK version to use when
running the application.

A *Tanzu Application Service* manifest is also an appropriate place to
describe *Backing Services* dependencies that your app requires.
You will see more about backing services in the
[Backing Services and Database Migrations](../database-migrations/) and
[Data Access](../jdbc-template/) labs.

1.  Checkout the solution `manifest.yml` file:

    ```bash
    git checkout configuration-solution manifest.yml
    ```

1.  Notice the `WELCOME_MESSAGE` must be
    `Hello from Tanzu Application Service`.

To see the effect of using a manifest:

1.  Delete your app with the `cf delete` command.

1.  Push your app using your new manifest with `push`.
    The `push` command will automatically use your manifest file if you
    push from the same directory.

1.  Visit the root endpoint and `/env` endpoint.
    Be aware that the app URL has changed as a result of the
    `random-route: true` line in the manifest.

1.  Make a commit and push your code to GitHub once you are sure
    everything is working.

## Wrap up

Review the
[*Tanzu Application Service* Environment](https://docs.google.com/presentation/d/1s8bT9cpfMWXluYkCZHVUB9jKUmfG-ODzj2P1nZsBVaY/present#slide=id.ge9c860dc14_0_0)
slides about environment variable configuration on
*Tanzu Application Service*.

Now that you have completed the lab, you should be able to:

-   Summarize some of the ways to configure a Spring application
-   Use environment variables to configure an application running
    locally
-   Use `cf logs` to view the logs of an application running on Cloud
    Foundry
-   Use environment variables to configure an application running on
    *Tanzu Application Service*
-   Explain when to use the command line interface (CLI)
    versus a manifest for application configuration

## Extras

### *Tanzu Application Service* command line interface (CLI)

If you have additional time, explore the `cf` CLI by reading the
[documentation](https://docs.run.pivotal.io/cf-cli/cf-help.html) or by
running `cf help` and `cf <command> --help`.

### Explore the *pal-tracker* application environment

1.  Review the
    [`cf env`](http://cli.cloudfoundry.org/en-US/cf/ssh.html) command.

1.  Run the `cf env` command for the `pal-tracker` application.
    Review the system provided environment variables,
    as well as the user provided environment variables.

### Explore the *pal-tracker* container

1.  Review the
    [`cf ssh`](http://cli.cloudfoundry.org/en-US/cf/ssh.html) command.

1.  Run the `cf ssh` command to create a secure shell connection to the
    only running instance (index `0`) of your `pal-tracker`.

1.  Run the following and review the running `pal-tracker` container:

    -   [*Tanzu Application Service* environment variables](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html):

        `env | grep CF_`

        Notice that *Tanzu Application Service* sets the IP address,
        ports,
        and host name (GUID) of the containers for you.

    -   Review the running processes in the container:

        `ps -ef`

        Notice the Java process,
        how did *Tanzu Application Service* know what the run command is
        for the `pal-tracker` application?

        Notice the `envoy` and `healthcheck` processes.
        You will see discussion of these in later labs.

    -   Review the following directory and its subdirectories:

        `ll app/`

        Where did the directory and files originate from?
