---
title: Harden your app
weight: 80
layout: single
team:
  - VMware Tanzu Labs
---

You will demonstrate how to harden your `pal-tracker` application
running on *Tanzu Application Service* for scaling and availability
characteristics.

## Learning outcomes

After completing the lab, you will be able to:

-   Tune your application for disposability.

-   Tune your application to run optimally in a container

## Getting started

### Codebase and manifest

1.  You must have completed (or fast-forwarded to) the
    [Health Monitoring lab](../health-monitoring/).
    You must have your `pal-tracker` application associated with the
    `actuator-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Cherry-pick the start point of this lab:

    ```bash
    git cherry-pick scaling-availability-start
    ```

    **Note:**
    **You will likely receive a git merge conflict message after**
    **executing the `cherry-pick`,**
    **either on the `route` you defined,**
    **or the `JBP_CONFIG_OPEN_JDK_JRE` environment variable change**
    **with the explicit `memory_calcuator` `stack_threads` configuration,**
    **or with the YAML indentation.**
    **Make sure to clean the up the merge conflicts,**
    **and pick the updated `JBP_CONFIG_OPEN_JDK_JRE` configuration.**
    **After that,**
    **stage your change and complete the cherry-pick operation:**

    ```bash
    git add manifest.yml
    git cherry-pick --continue
    ```

1.  This will pull in updates for the following:

    -   `pal-tracker` manifest file with the desired initial state of
        your app.
    -   Scripts you will use to enable and tear down the autoscaling
        [in a later lab](../scaling/).

1.  Ensure you have the latest code built on your local machine
    that includes all the updates from the previous labs,
    or as of the `actuator-solution` point:

    ```bash
    ./gradlew clean build
    ```

1.  Assuming you are running `pal-tracker` now,
    delete it:

    ```bash
    cf delete pal-tracker -f
    ```

    You will push it with the desired start configuration later in the
    lab.

### Monitoring

In this lab you will exercise your `pal-tracker` application under load,
monitor it,
and tune it.

You can monitor the `pal-tracker` application through the following:

-   Command line via the following `cf` commands:

    - `cf app pal-tracker`
    - `cf events pal-tracker`

-   [*Apps Manager*](https://docs.pivotal.io/application-service/2-11/console/dev-console.html)
    user interface.

If you choose to monitor via the command line you will need a minimum of
four terminal windows open.

If you choose to monitor with *Apps Manager* you will need only one.

## Review the current state of your application

### Manifest

Review the `pal-tracker` manifest file.

```bash
git show scaling-availability-start:manifest.yml
```

Notice the new parameters added,
they reflect the defaults the *Tanzu Application Service* sets on your
behalf:

1.  [`java_buildpack_offline`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#buildpack):
    Given that the `pal-tracker` app is a Java app,
    this buildpack is the one that would automatically be detected and
    used to build the app's droplet.
    From here on, it is explicitly set in the manifest, which will
    speed up the staging process.

1.  [`stack`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#stack):
    `cflinuxfs3` is the default Linux file system stack from which the
    droplet and associated containers will derive.

1.  [`memory`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#memory):
    `1G` is the default container memory allocation quota.
    This is *not* the Java heap size.
    You will see shortly the *Memory Calculator* will configure your
    Java options for you automatically.

1.  [`disk_quota`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#disk-quota):
    `1G` is the default allocated disk quota.

1.  [`instances`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#instances):
    `1` is the default number of `pal-tracker` app instances and
    associated containers.

1.  [`health-check-type`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#health-check-type):
    `port` is the default mode of Diego to check the health of the
    `pal-tracker` application.
    Diego will attempt to connect to the `pal-tracker` application on
    port `8080`.

1.  [`timeout`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#timeout):
    `60` seconds is the default time interval that Diego will wait for
    the health check to succeed on start up before giving up and
    retrying.

1.  [`JBP_CONFIG_OPEN_JDK_JRE`](https://github.com/cloudfoundry/java-buildpack):
    `'{ jre: { version: 11.+ }, memory_calculator: { stack_threads: 250 } }'`
    is the environment variable that sets the buildpack Java version,
    and optionally
    [memory calculator](https://github.com/cloudfoundry/java-buildpack-memory-calculator/blob/main/README.md)
    tuning.
    The `stack_threads` value of 250 is the default.

1.  `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE` environment variable is
    set for you.
    This is added to expose the default and `palTrackerFailure` actuator
    endpoint you will use in this lab.

You can see the entire list of
[*Tanzu Application Service* manifest attributes](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html).

### Push and monitor the state of your app

1.  Push your `pal-tracker` application.

    ```bash
    cf push
    ```

1.  Wait for your app to complete startup:

    ```nohighlight
    name:              pal-tracker
    requested state:   started
    ...
    ...
         state     since                  cpu    memory    disk      details
    #0   running   2020-12-01T00:42:33Z   0.0%   0 of 1G   0 of 1G
    ```

For the remainder of the lab you will monitor the state of the
`pal-tracker` application.

You can navigate to the `pal-tracker` application overview page in
*Apps Manager*,
or you can monitor from command line:

1.  In a separate terminal window, run the following command,

    ```bash
    watch cf app pal-tracker
    ```

    You will see in the later instructions this is referred to as the
    **`cf app` watch window**.

1.  In a separate terminal window,
    run a watch for `pal-tracker` events:

    ```bash
    watch cf events pal-tracker
    ```

    Notice that the events are ordered from the most recent at the top
    to the oldest at the bottom.

    You will see in the later instructions this is referred to as the
    **`cf events` watch window**.

Keep both these windows open and running for the rest of the lab.

#### Startup time

1.  After the application completes its startup,
    review the logs since startup:

    ```bash
    cf logs pal-tracker --recent
    ```

1.  Review the time stamp of the line that contains the following
    message:

    `Starting health monitoring of container`

    It should look something like:

    ```nohighlight
    2020-11-30T18:42:26.37-0600 [CELL/0] OUT Starting health monitoring of container
    ```

1.  Review the time stamp of the line that contains the following
    message:

    `Container became healthy`

    It should look something like:

    ```nohighlight
    2020-11-30T18:42:33.06-0600 [CELL/0] OUT Container became healthy
    ```

1.  What is the elapsed time it took for the health monitoring to start,
    and when Diego cell detected the healthy `pal-tracker` application
    instance?

#### Container resources

1.  Dedicate one of your open terminal windows to run some load against
    your application.
    You will use the
    [`docker-loadtest`](https://hub.docker.com/r/pivotaleducation/loadtest)
    tool as follows,
    using your review environment url you configured in your manifest:

    ```bash
    docker run -i -t --rm -e DURATION=300 -e NUM_USERS=10 -e REQUESTS_PER_SECOND=5 -e URL=http://pal-tracker-${UNIQUE_IDENTIFIER}.${DOMAIN}  pivotaleducation/loadtest
    ```

    where the

    -   `NUM_USERS` option value is number of simulated users/threads
    -   `DURATION` option value is the max duration of the test
        (seconds)
    -   `REQUESTS_PER_SECOND` option value is the number of requests per
        second.

1.  In either *Apps Manager* or the `cf app` Watch window,
    monitor the amount of CPU, memory and disk resources taken for the
    test.

1.  Let your load test complete,
    or terminate it by `Ctrl+C`.

#### Questions for production hardening

Based on what you have seen with your `pal-tracker` application so far,
is it optimally tuned for production?

1.  Are the resources allocated by the `pal-tracker` instance really
    needed?
    Can you perhaps tune down the memory and disk resources allocated
    to the `pal-tracker` application instance?

1.  Is the 60-second startup interval really needed by Diego based on
    the startup time characteristic of the `pal-tracker` application?
    Can you perhaps tune it down,
    such that a misbehaving `pal-tracker` instance can fail faster for
    better
    [disposability](https://12factor.net/disposability)
    characteristics?

1.  Do you have enough instances to make your `pal-tracker` application
    available?
    What if a platform operator is doing daily planned maintenance that
    would take down the cell in which your application instance is
    running?
    What if your application instance crashes?
    How many instances should you run at a minimum to
    account for concurrent planned and unplanned outage of individual
    instances?

1.  Is the port health check optimal for a request/response (blocking)
    Java web application?
    What if your `pal-tracker` application stalls on Java garbage
    collection?
    What if it runs out of threads?
    What type of health check would be optimal,
    and which Spring Boot Actuator feature could you use for that
    health check?

1.  What about CPU resources?
    How does *Tanzu Application Service* handle that?

## Production hardening

You will now configure your application to improve its production
characteristics.

### Configuration

Configure the following in the `manifest.yml` file:

1.  Configure the disk quota for 256M.

1.  Configure the memory quota for 512M.

1.  Configure the `JBP_CONFIG_OPEN_JDK_JRE` environment variable,
    `memory_calculator` &rarr; `stack_threads` to `100`.

    **The app will not start with the container memory quota reduced to 512M**
    **and the default stack thread configuration.**

1.  Configure 3 instances.

1.  Configure a `http` health check type:
    -   Change the `health-check-type` from `port` to `http`
    -   Add a new manifest attribute `health-check-http-endpoint` with
        a value configured to the associated endpoint of the
        `pal-tracker` Spring Boot application's liveness probe endpoint.
    -   Configure the `MANAGEMENT_HEALTH_PROBES_ENABLED` environment
        variable with a value of `true` to enable the liveness probe.

1.  Tune down the startup health check `timeout` to roughly twice
    the start up time of your `pal-tracker` application that you
    measured in the
    [Startup time](#startup-time) section
    step 4 (and round up to next 10 second interval).

1.  Push your updated configuration:

    ```bash
    cf push
    ```

1.  Wait until all the `pal-tracker` instances start.

If you get stuck,
you can look at the solution here:

```bash
git show scaling-availability-solution:manifest.yml
```

Notice that you are not configuring CPU resource allocation.
[Read about how *Tanzu Application Service* works with CPU](https://www.cloudfoundry.org/blog/better-way-split-cake-cpu-entitlements/).

## Wrap up

Review the
[Scaling slides](https://docs.google.com/presentation/d/1CAHQc2DPZHGGoS7cyYkzSchQgDQsd4UKg_olQs6LpUk/present#slide=id.ge9cac6b4b4_0_0)
about how scaling is handled on *Tanzu Application Service*.

Now that you have completed the lab, you should be able to:

-   Tune your application for disposability.

-   Tune your application to run optimally in a container.
