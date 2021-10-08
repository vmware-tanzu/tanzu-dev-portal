---
title: Build a Spring Boot Application
weight: 10
layout: single
team:
  - VMware Tanzu Labs
---

This lab will walk you through setting up a Java application using
[Spring Boot](https://projects.spring.io/spring-boot/).
At the end of this learning path you will have evolved this
from a single application to a distributed application consisting of
multiple microservices.
In the spirit of the history of
[Pivotal Tracker](https://www.pivotaltracker.com/),
the suite of applications will include the microservices supporting
a software project management tool, an application for tracking time,
and an application for allocating people to projects.

## Learning outcomes

After completing the lab, you will be able to:

- Describe how to create runnable Spring Boot application
- Describe how to create a controller that responds to HTTP requests
- Use `gradle` to run Gradle tasks

## Getting started

1.  Check out the
    [Introduction Lab](../intro/).

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Review the state of your Git repository:

    ```bash
    git log --oneline --decorate --graph
    ```

    You will notice that `HEAD` is at second commit.

    ```no-highlight
    * bc868bf (HEAD -> main) added gradle wrapper to initial project
    * 0ac8b7f (tag: spring-boot-start, origin/main, origin/HEAD) Initial commit
    ```

    You have nothing in your codebase yet except for the Gradle wrapper
    you generated during the
    [Introduction lab](../intro/).

1.  Verify the state of your Git workspace:

    ```bash
    git status
    ```

    You will notice that your local repository is ahead of your
    remote by one commit.
    That is expected:

    ```no-highlight
    On branch main
    Your branch is ahead of 'origin/main' by 1 commit.
    (use "git push" to publish your local commits)

    nothing to commit, working tree clean
    ```

## If you get stuck

If you get stuck during this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `spring-boot-solution` tag.

## Bootstrap the application

Now that the plumbing of your application is set up,
you can begin building a Spring Boot _Hello World_ application.

1.  Import the `pal-tracker` project in your IDE.

1.  If you are familiar with Gradle, make the following additions to
    your `build.gradle` file:

    -   Add a `plugins` closure:

        -   Apply the `2.5.3.RELEASE` version of the
            [Spring Boot Gradle plugin](https://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins-gradle-plugin.html).

        -   Apply the `1.0.11.RELEASE` version of the
            [Spring Dependency Management plugin](https://plugins.gradle.org/plugin/io.spring.dependency-management)

        -   Apply the
            [Java plugin](https://docs.gradle.org/current/userguide/java_plugin.html).

    -   Create a `repositories` closure adding Maven Central to your
        `build.gradle` file.

    -   Add a `dependencies` closure,
        and add a Java implementation dependency on the
        `org.springframework.boot:spring-boot-starter-web` package.

1.  If you are unfamiliar with Gradle at this point, or want to check
    the changes that you have made, you can see what the resulting
    `build.gradle` file should look like:

    ```bash
    git show spring-boot-solution:build.gradle
    ```

    Make sure that your `build.gradle` has all of the necessary elements
    before moving on.

1.  Add a `settings.gradle` file with the following contents:

    ```groovy
    rootProject.name = "pal-tracker"
    ```

    This will configure the name of your Gradle project which ensures
    that your jar file has the correct filename.

1.  Refresh the Gradle project in your IDE so that it picks up
    your changes.

1.  Create a standard
    [Maven directory layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html).

    Specifically, create a `src/main/java` directory structure within
    the `pal-tracker` directory.

1.  Inside of the source directory, all of your code will go into
    the `io.pivotal.pal.tracker` package.
    Create this package now.

    If you are creating this manually
    (without the help of an IDE),
    make sure you are creating a directory structure that mirrors
    the package specification:

    ```bash
    mkdir -p src/main/java/io/pivotal/pal/tracker
    ```

1.  Create a class in the `tracker` package called
    `PalTrackerApplication` and annotate it with
    [`@SpringBootApplication`](https://docs.spring.io/autorepo/docs/spring-boot/current/api/org/springframework/boot/autoconfigure/SpringBootApplication.html).

    This annotation enables component scanning, auto configuration, and
    declares that the class is a configuration class.

1.  Add a `main` method to the `PalTrackerApplication` class that will
    tell Spring to run.

    This `main` method executes the Spring Boot
    [`SpringApplication.run`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/SpringApplication.html)
    method which bootstraps the
    [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
    container, scans the classpath for
    [beans](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans),
    and starts the application.

    You can view the solution:

    ```bash
    git show spring-boot-solution:src/main/java/io/pivotal/pal/tracker/PalTrackerApplication.java
    ```

1.  Verify the application is set up correctly by running your
    application.

    Using your Gradle wrapper, run the `tasks` command to find which
    task to use to run your application locally.
    This will be the task with a description that says:
    "Runs this project as a Spring Boot application".
    Once you find the task, use it to run your application.

    Make sure that you run the Gradle wrapper command, `gradlew`,
    rather than the `gradle` command itself.
    You can do this from the command-line like this:

    ```bash
    ./gradlew tasks
    ```

    You may also find that your IDE provides integration to run
    the Gradle wrapper tasks directly.

    If all is well, you will see log output from Spring Boot and a
    line that says it is listening on port 8080.
    Navigate to [localhost:8080](http://localhost:8080) and see that the
    application responds.
    You will see a "whitelabel" error page with a status code of 404.
    The application is running but it does not have any controllers.
    Stop the application with `Ctrl+C`.

## Create a controller

In the same package you will now create a controller class that returns
`hello` when the app receives a __GET__ request at `/`.

Following labs will go in to more detail about what is happening here,
but for now, just follow along.

1.  Create a class called `WelcomeController` in the `tracker` package,
    alongside the main application class .

1.  Annotate `WelcomeController` with `@RestController` and write a
    method that returns the string `hello`.

    The name of the method is not important to Spring, but call it
    `sayHello`.
    Finally, annotate the method with `@GetMapping("/")`.

    You can view the solution if you get stuck:

    ```bash
    git show spring-boot-solution:src/main/java/io/pivotal/pal/tracker/WelcomeController.java
    ```

1.  Verify the controller is working correctly by starting the
    application.

    Now visit [localhost:8080](http://localhost:8080) to see the `hello`
    message.

1.  Make a commit with your new changes and push your work to your
    repository on GitHub.

    You now have a small working web application.
    In the next lab,
    you will push this application to *Tanzu Application Service*.

## Wrap up

Now that you have completed the lab, you should be able to:

- Describe how to create runnable Spring Boot application
- Describe how to create a controller that responds to HTTP requests
- Use the Gradle wrapper to run Gradle tasks

## Extra

If you have additional time, explore the dependencies included in the
`spring-boot-starter-web` library.
Go to the main Maven repository for
[Spring Boot web starter](https://search.maven.org/artifact/org.springframework.boot/spring-boot-starter-web),
find the version you are using, and navigate to its page.
You will see the Maven [POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
file (in XML format).
The `<dependencies>` section of the file shows the immediate
dependencies of the starter, for example:

```xml
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
      <version>2.5.3.RELEASE</version>
      <scope>compile</scope>
    </dependency>
      ...
  </dependencies>
```

In Gradle syntax that corresponds to:

```groovy
  implementation 'org.springframework.boot:spring-boot-starter:2.5.3.RELEASE'
```

There is a link to the pages for each of these dependencies at the
bottom of the scrolling panel at the right of the screen.

Try to write the dependencies closure in the `build.gradle` file so that
your application runs without using any starters.
