---
title: Deploy a Spring Boot Application
weight: 11
layout: single
team:
  - VMware Tanzu Labs
---

This lab will walk you through the process of deploying an application
to
[*Tanzu Application Service* (*Tanzu Application Service*)](https://pivotal.io/platform).
This is known as "pushing an app to *Tanzu Application Service*".

## Learning outcomes

After completing the lab, you will be able to:

- Use the *Tanzu Application Service* CLI to push an app

## Getting started

1.  You must have completed (or fast-forwarded to) the
    [Building a Spring Boot Application lab](../spring-boot-app-build/).

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Make sure you view the
    [*Tanzu Application Service* Push](https://docs.google.com/presentation/d/1J5pgV7DvHMcdTzg_ndIXtS-NgIXF-nreTDefjHSOlyY/present#slide=id.gb53c81140d_0_61)
    slides after completing this lab for more information about how
    the push process works.

If you get stuck during this lab and need a little more help, please
see the [Hints](#hints) section at the end.

## Deploy

In order to deploy a JVM application to *Tanzu Application Service* you
will first need to create a standalone executable jar file.
This will be a "fat jar" &mdash; a single jar file that contains
all of its dependent libraries as well as your application code.

### Assemble the jar file

Use Gradle to build the jar file for your application using the
`bootJar` task.

### Push the jar file

1.  Use the `cf push` command to push your code to an application named
    `pal-tracker` while making sure that you:

    -   Use the `-p` flag to specify the jar file to push.
    -   Add the appropriate option to generate a random route.
    -   Add another option so that it does not start immediately when
        you push it for the first time.

    Use the help for the `push` command if you need to find the right
    options to use.

1.  Watch the `cf push` command output closely.
    You will see the CF CLI upload the jar file.

1.  When the command completes,
    look closely at the output after the
    `Waiting for API to complete processing files...` line.

    It will look similar (but not identical) to this:

    ```no-highlight
    name:              pal-tracker
    requested state:   stopped
    routes:            pal-tracker-thankful-wolverine-vv.apps.evans.pal.pivotal.io
    last uploaded:
    stack:
    buildpacks:

    type:           web
    instances:      0/1
    memory usage:   1024M
        state   since                  cpu    memory   disk     details
    #0   down    2021-08-13T19:46:20Z   0.0%   0 of 0   0 of 0
    ```

1.  Notice the `routes` list contains a single route.
    This is also the DNS host name for your application.
    The URL for your application will be `https://<ROUTE>`
    Remember it,
    you will need it later in the lab.

1.  Also notice the application is created on
    *Tanzu Application Service*,
    but it is in a `down` state with no `instances`
    (processes) running.

### Setting the Java version

Set an environment variable to tell the buildpack to use Java 11.

  ```bash
  cf set-env pal-tracker JBP_CONFIG_OPEN_JDK_JRE '{ jre: { version: 11.+ } }'
  ```

### Start the application

1.  Start the application now that the environment variable is
    set.

    ```bash
    cf start pal-tracker
    ```

1.  *Tanzu Application Service* begins the staging process.
    Once staging finishes, *Tanzu Application Service* will start your
    application.

    When the command completes,
    look close at the output after the
    `Waiting for app to start...` line.

    ```no-highlight
    name:              pal-tracker
    requested state:   started
    routes:            pal-tracker-thankful-wolverine-vv.apps.evans.pal.pivotal.io
    last uploaded:     Fri 13 Aug 14:59:06 CDT 2021
    stack:             cflinuxfs3
    buildpacks:        java

    type:            web
    instances:       1/1
    memory usage:    1024M
    start command:   JAVA_OPTS="-agentpath:$PWD/.java-buildpack/open_jdk_jre/bin/jvmkill-1.16.0_RELEASE=printHeapHistogram=1 -Djava.io.tmpdir=$TMPDIR
                    -XX:ActiveProcessorCount=$(nproc) -Djava.ext.dirs= -Djava.security.properties=$PWD/.java-buildpack/java_security/java.security $JAVA_OPTS" &&
                    CALCULATED_MEMORY=$($PWD/.java-buildpack/open_jdk_jre/bin/java-buildpack-memory-calculator-3.13.0_RELEASE -totMemory=$MEMORY_LIMIT -loadedClasses=19129
                    -poolType=metaspace -stackThreads=250 -vmOptions="$JAVA_OPTS") && echo JVM Memory Configuration: $CALCULATED_MEMORY && JAVA_OPTS="$JAVA_OPTS
                    $CALCULATED_MEMORY" && MALLOC_ARENA_MAX=2 SERVER_PORT=$PORT eval exec $PWD/.java-buildpack/open_jdk_jre/bin/java $JAVA_OPTS -cp
                    $PWD/.:$PWD/.java-buildpack/container_security_provider/container_security_provider-1.18.0_RELEASE.jar org.springframework.boot.loader.JarLauncher
        state     since                  cpu    memory         disk           details
    #0   running   2021-08-13T19:59:22Z   0.0%   131.9M of 1G   160.9M of 1G
    ```

    You should now see your application is running one `instance`
    (web process),
    and is in an `up` state.
    You can also see the command that *Tanzu Application Service*
    executed to run your `pal-tracker` application,
    and it is not the same one you used to run locally.

    You will see more details in the wrap up section.

### What if you forgot to suppress the start?

Note that if you accidentally set your application to start
when you initially pushed it,
it would have failed to start.

You would have to use the `restage` command instead of
`start` after setting the Java Build Pack environment
variable to start the application.

You should be able to explain why this is the case after
completing the next module.

### Verify your app on *Tanzu Application Service*

Check that the application is running by visiting its URL
in a browser and verifying that you see the correct message.

The application that you have built up to now is minimal,
but there is now a solid foundation to build upon.

## Learning outcomes

Now that you have completed the lab, you should be able to:

- Use the *Tanzu Application Service* CLI to push an app

## Wrap up

-   Review the
    [Push an App](https://docs.google.com/presentation/d/1J5pgV7DvHMcdTzg_ndIXtS-NgIXF-nreTDefjHSOlyY/present#slide=id.gb53c81140d_0_61)
    slides for details of the interactions between the CLI and the
    *Tanzu Application Service* foundation components during the push
    process.
-   Review the
    [Staging an App](https://docs.google.com/presentation/d/1gWulATqi0WvV7SUEbAK3qVbNW80Y2pplsCD4NGy-fFE/present#slide=id.ge70b517444_0_0)
    slides for details about the staging process and the role of
    buildpacks.

## Hints

### Where can you find the "fat jar" file?

Run the following commands:

```bash
cd ~/workspace/pal-tracker

./gradlew bootJar

ls build/libs
```

You should see a `pal-tracker.jar` file,
and you can run this locally using:

```bash
java -jar build/libs/pal-tracker.jar
```

This is the file that you need to give to `cf push`.

### What happens if the `cf push` command fails?

First check that you have provided all of the options described in the
instructions.

If you see a message something like "An app was not successfully
detected by any available buildpack" then you probably omitted the `-p`
option or gave it the wrong argument.

If you saw a message something like "Routes cannot be mapped" then
you have probably missed the `--random-route` option.

If the command hangs with "Instances starting" or fails to start
(before setting the `JBP_CONFIG_OPEN_JDK_JRE` environment variable)
then, as described above, you probably forgot the `--no-start` option.

Your command should look something like this:

```bash
cf push pal-tracker -p build/libs/pal-tracker.jar --random-route --no-start
```

If you are not certain what state your application is in and want
to try the push again, it is safe to delete your app first:

```bash
cf delete pal-tracker
```
