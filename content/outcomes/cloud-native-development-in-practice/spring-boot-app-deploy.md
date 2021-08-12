---
title: Deploy a Spring Boot Application
weight: 11
layout: single
team:
  - VMware Tanzu Labs
---

This lab will walk you deploying the application to
[Tanzu Application Service](https://pivotal.io/platform).

## Learning Outcomes

After completing the lab, you will be able to:

- Use the Tanzu Application Services CLI to push an app

## Getting started

1.  Make sure you check out the
    [TAS Push](https://docs.google.com/presentation/d/1J5pgV7DvHMcdTzg_ndIXtS-NgIXF-nreTDefjHSOlyY/present#slide=id.gb53c81140d_0_61) slides.

1.  You must have completed (or fast-forwarded to) the
    [Building a Spring Boot Application lab](../spring-boot-app-build/).

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

## Deploy

In order to push a JVM application to Tanzu Application Service you will
use an executable jar file.

### Assemble the Spring Boot Fat Jar

Use gradle to build the jar file for your application using the
`bootJar` task.

### Push the Spring Boot Fat Jar

1.  Use the `push` command to push your code to an application named
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
    look close at the output after the
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

1.  Also notice the application is created on TAS,
    but it is in a `down` state with no `instances`
    (processes) running.

### Setting the Java Version

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

1.  Tanzu Application Services begins the staging process.
    Once staging finishes, Tanzu Application Services will start your application.

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
    You can also see the command that TAS executed to run
    your `pal-tracker` application,
    and it is not the same one you used to run locally.

    You will see more discussion during the wrap up.

### What if you forgot to suppress the start?

Note that if you accidentally set your application to start
when you initially pushed it,
it would have failed to start.

You would have to use the `restage` command instead of
`start` after setting the Java Build Pack environment
variable to start the application.

You should be able to explain why this is the case after
completing the next module.

### Verify your app on TAS

Check that the application is running by visiting its URL
in a browser and verifying that you see the correct message.

The application that you have built up to now is minimal,
but there is now a solid foundation to build upon.

## Learning Outcomes

Now that you have completed the lab, you should be able to:

- Use the Tanzu Application Services CLI to push an app

## Wrap up

Checkout the
[TAS Staging slides](https://docs.google.com/presentation/d/1gWulATqi0WvV7SUEbAK3qVbNW80Y2pplsCD4NGy-fFE/present#slide=id.ge70b517444_0_0) about how cloud foundry deployment works.
