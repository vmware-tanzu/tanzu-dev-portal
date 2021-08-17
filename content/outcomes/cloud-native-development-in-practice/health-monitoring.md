---
title: Health Monitoring
weight: 70
layout: single
team:
  - VMware Tanzu Labs
---

This lab introduces the concepts of Observability,
Health Monitoring and Probes.

You will use
[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html)
to add production-ready monitoring features to your `pal-tracker`
application.

## Learning Outcomes

After completing the lab, you will be able to:

-   Explain how to set up Actuator for a Spring boot app
-   Explain uses for health indicators and availability probes

## Get started

1.  Check out the
    [App Ops](https://docs.google.com/presentation/d/142gpNZqTNHT3YcaOB3pJeXUM9Q8BrwULmoKwJ344RuM/present#slide=id.ge9cac6b3d8_0_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Data Access lab](../jdbc-template/).
    You must have your `pal-tracker` application associated with the
    `jdbc-solution` codebase deployed and running on TAS.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Before starting the lab, pull in some failing tests using Git:

    ```bash
    git cherry-pick actuator-start
    ```

    This added a `PalTrackerFailure` class, which you will use in the
    *Liveness* section of the lab to demonstrate Spring Boot
    `AvailabilityState`.

1.  Attempt to compile:

    ```bash
    ./gradlew compileJava
    ```

    It should fail.
    You will get it to compile in the next section.

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-file-from-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `actuator-solution` tag.

## Actuator

### Dependency and configuration

1.  Add the Actuator dependency to your `build.gradle` file:

    ```groovy
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    ```

1.  Attempt to compile again:

    ```bash
    ./gradlew compileJava
    ```

    It should now pass.

1.  Expose all Actuator endpoints by adding the following to the
    `bootRun` and `test` environments in your `build.gradle` file.

    ```groovy
    "MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE": "*",
    ```

1.  Start your application locally.

### Actuator diagnostic endpoints

Spring Boot Actuator exposes various developer diagnostic
[endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html)
that show useful information about your application.
This lab will walk you through the more interesting and important ones.

1.  Visit the
    [`/actuator/mappings`](http://localhost:8080/actuator/mappings)
    endpoint.

    Here you will see all the controller endpoints that you have
    defined, as well as any endpoints that are brought in from
    dependencies.

1.  Visit the
    [`/actuator/env`](http://localhost:8080/actuator/env) endpoint.

    This endpoint shows the state of the environment that your
    application is running in, including environment variables and
    system properties.

1.  Visit the
    [`/actuator/beans`](http://localhost:8080/actuator/beans) endpoint.

    This endpoint shows the beans that are being used within your
    application.

1.  Visit the
    [`/actuator/metrics`](http://localhost:8080/actuator/metrics)
    endpoint.

    This endpoint shows all the metrics that Actuator has collected by
    default, such as system information like uptime, load, memory, etc.
    Take one of the values listed here and append it to the end of the
    [`/actuator/metrics`](http://localhost:8080/actuator/metrics) URL to
    see the data collected for that metric.

    Custom metrics will also be shown here.
    There are several types of custom metrics that can be collected:

    - *Gauge* - gives a real time measurement of a metric.
    - *Counter* - counts the number of times an event has occurred.
    - *DistributionSummary* - tracks distribution of events
    - *Timer* - tracks large number of short running events

1.  Visit the [`/actuator/info`](http://localhost:8080/actuator/info)
    endpoint.
    By default, you will not see any information here.

    -   Add the following to your `build.gradle` file:

        ```gradle
        springBoot {
            buildInfo()
        }
        ```

        This adds a `META-INF/build-info.properties` file to your jar.
        When Actuator sees this file it exposes a `BuildInfoContributor`
        bean which adds build information to the `/info` endpoint.

    -   Restart your application.

    -   Visit the
        [`/actuator/info`](http://localhost:8080/actuator/info) endpoint
        again to see the build information.

        You can add your own information to this endpoint by creating a
        bean that implements `InfoContributor`.

## Health Indicators

When you enable your Spring Boot applications to talk to external
*backing services* using auto configuration,
such as relational databases or *Message Oriented Middleware*,
Spring Boot will automatically provide health indicators
that you may monitor for the ability of the application to
connect to them.

Actuator provides an endpoint for this:

Visit the
[`/actuator/health`](http://localhost:8080/actuator/health)
endpoint.

1.  This endpoint shows the application status (*up* or *down*) for
    anonymous users.

    -   Add the following to the `bootRun` environment in
        your `build.gradle` file.

        ```groovy
        "MANAGEMENT_ENDPOINT_HEALTH_SHOWDETAILS": "always",
        ```

        It currently provides additional information such as disk space
        and web container health status.

    -   Restart your application and visit the
        [`/actuator/health`](http://localhost:8080/actuator/health)
        endpoint again to see the more detailed health status.


1.  View the various components of the health status:

    -   `diskSpace`:
        Provided as a native health indicator to show health
        status of the disk space available to your app.

    -   `ping`:
        Provided as part of Spring Web MVC to show health
        of the web container.

    -   `db`:
        Provided as part of JDBC configured resources,
        showing health of the database connection pool.

## Uses for Health Indicators

Actuator Health Indicators have several uses in modern applications.
They can be used for:

### Application monitoring

The actuator health endpoint is one of the various data points that
may be streamed to monitoring systems:

1.  Near realtime monitoring systems

    These systems tell application operators the current state of the
    application.
    These systems can alert operators if an application becomes
    unhealthy and allow them to take actions to heal the application.

2.  Time-series collection

    These systems allow application operators to report on historical
    performance of their workloads.
    For example, mean time to recovery or application
    uptime/availability are metrics that can be calculated from
    time-series data.

### Platform automation/self healing

Another use is that of special types of Health Indicators called
*Availability Probes*.

Modern application platforms support a contract with the applications
that it will monitor for the application instance health.
This contract allows the platform to dispose of unhealthy application
instances,
and recover them according to the instructions given to it by application
operators.

Workloads can support the platform contract by exposing endpoints
that allow the platform to answer the following questions:

1. Is the application ready to do work?
1. Is the application healthy?

The platform can block work being routed to a newly started applications
until it tells the platform it is ready.

The platform can also dispose of applications that know that they may be
trending to a state where they may not be able to reliably service
request.

## Availability Probes

An availability probe is contract between an application and a runtime
platform.

The application instances expose different availability types to the
platform, and the platform can take a specific actions based on those
types.

The two most common types are:

- readiness probe
- liveness probe

Spring Boot 2.3.x and above allow your application to:

- Define rules for availability types
- Expose availability probe endpoints via actuator health endpoints

### Enable probes locally

When running locally on a development workstation, availability probes
are not enabled.
You will need to enable them.

1.  Add the following environment variable to the `bootRun.environment()`
    in the `build.gradle` file:

    `"MANAGEMENT_HEALTH_PROBES_ENABLED": true`

1.  Restart the `pal-tracker` application on your development workstation.

1.  Verify a request to the `actuator/health` endpoint has a 200 HTTP
    response and an *up* status:

    ```bash
    curl -v localhost:8080/actuator/health
    ```

1.  Verify the `readinessState` and `livenessState` entries are both
    present in the response of the `health` endpoint with *up* status.

1.  Verify a request to the `actuator/health/liveness` endpoint has a
    200 HTTP response and an *up* status:

    ```bash
    curl -v localhost:8080/actuator/health/liveness
    ```

    This is the `liveness` probe endpoint.

**Note:**
**Tanzu Application Services currently supports use of the liveness probe with the**
**`health-check` feature.**

**It does not formally support use of readiness checks,**
**but does support the use of liveness checks that you will demonstrate**
**in the next lab.**

### Liveness

The liveness state, the ability to answer requests in a timely fashion
or the signal that the application is not having issue, is published by
your application through a liveness probe endpoint.
The platform can use the state of the liveness probe to destroy and
re-create application instances that can not adequately service requests.

Spring Boot exposes the probe via the `actuator/health/liveness`
endpoint.
By default the liveness probe defaults to the Spring web container
being up.

Let's pretend that our application can no longer service the requests
reliably.
Perhaps the app encounters a fatal exception from which it cannot recover,
or there is a *persistent* failure of a backing service.

Unfortunately backing services health indicators are not suitable to
use for the liveness probe because it also includes *transient* failures
of the backing service.
We will talk about this further in
[Special Considerations](#special-considerations).

The cherry-picked code provided a new tool that you will use to
demonstrate a broken liveness state in your `pal-tracker` application:

1.  Review the `PalTrackerFailure` actuator management endpoint:

    ```bash
    git show actuator-start:src/main/java/io/pivotal/pal/tracker/PalTrackerFailure.java
    ```

    Notice that it publishes events to simulate breaking the liveness
    state, and how it allows us to simulate a recovery.

1.  Restart `pal-tracker` application on your development workstation.

1.  Verify a request against the liveness endpoint with a 200 HTTP
    response and an *up* status:

    ```bash
    curl -v localhost:8080/actuator/health/liveness
    ```

1.  Simulate your application becoming unhealthy:

    ```bash
    curl -v -XPOST -H "Content-Length:0" localhost:8080/actuator/palTrackerFailure
    ```

1.  Verify a request against the liveness endpoint with a 503 HTTP
    response and a *down* status:

    ```bash
    curl -v localhost:8080/actuator/health/liveness
    ```

    The liveness endpoint will reflect the current availability state
    of your application.

1.  Simulate your application becoming healthy:

    ```bash
    curl -v -XDELETE localhost:8080/actuator/palTrackerFailure
    ```

### Special Considerations

It may be tempting to use the auto-configured backing service Health
Indicators to override the liveness probe of your application.

[*Do not do this!*](https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/html/spring-boot-features.html#boot-features-application-availability-liveness-state)

Be aware that the health indicators for most backing services show a
near realtime state of connections to a resource, and as such, may
capture *transient* and *persistent* failure events.

You should generally not use transient failures alone to calculate
the liveness state of your application, as this may cause the platform
to mistakenly destroy and re-create application instances.
This can lead to cascading failures in your system as application
instances are destroyed and re-created due to transient failures
of backing services.

You should think deeply about what defines the rules of your application
to announce to the platform that it gives up, and define those rules in
code, or a dedicated health indicator.

The code example in the `PalTrackerFailure` is an example of one way to
define a Liveness failure event;
however,
it is not a realistic one.

Designing proper liveness state calculation may require significant load
testing or production experience to understand the "cracks" in the
application characteristics to properly design and tune around the
availability probes.

You can also define those rules in a custom Health Indicator,
and an associated liveness health group override like we did with the
readiness probe example.

## Monitoring tools

The majority of the actuator endpoints discussed in the
[*Actuator diagnostic endpoints* section](#actuator-diagnostic-endpoints)
are used in context of *developer diagnostics*.
Much of the information exposed through these endpoints,
and especially the JVM information exposed through the metrics endpoint,
is likely to be available through Application Performance Monitoring
tools such as
[*Dynatrace*](https://www.dynatrace.com/),
[*AppDynamics*](https://www.appdynamics.com/) or
[*New Relic*](https://newrelic.com/).

## Actuator security considerations

Earlier in this lab you saw all the exposed actuator endpoints.
The
[diagnostic endpoints](#actuator-diagnostic-endpoints)
can expose sensitive information about your application that bad actors
could use to explore ways to compromise your application.

For this reason,
none of the endpoints other than info and health are exposed by default.

The `health` endpoint does not show details by default.
It merely shows the resolved status and returns either a 200 or 503
http status code.

As you saw earlier in this lab the
`MANAGEMENT_ENDPOINT_HEALTH_SHOWDETAILS`
parameter can be used to show details,
but if you choose to do so,
be careful.

Consider the following guidelines:

1.  Leave all endpoints you do not want to explicitly expose turned off.
    In most cases this means leaving only the defaults
    (`info` and `health`) exposed for build or git diagnostic information,
    and availability probes.

1.  If you need any of the other diagnostic endpoints exposed,
    consider doing so under a dedicated security role using Spring
    Security configuration.

1.  Commit and push your changes to Github.

## Wrap up

Now that you have completed the lab, you should be able to:

-   Explain how to set up Actuator for a Spring boot app
-   Explain uses for health indicators and availability probes

## Extra

If you have additional time, explore the many
[Actuator endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html).
Expose your project's git information
[through the info endpoint](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html#production-ready-application-info-git).

## Resources

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html)
- [Health Indicators](https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/html/production-ready-features.html#production-ready-health)