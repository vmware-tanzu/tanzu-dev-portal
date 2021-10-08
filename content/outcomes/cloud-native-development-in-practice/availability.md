---
title: Availability
weight: 85
layout: single
team:
  - VMware Tanzu Labs
---

You will demonstrate how `pal-tracker` application
works with *Tanzu Application Service* availability characteristics.

## Learning outcomes

After completing the lab, you will be able to:

- Demonstrate how *Tanzu Application Service* handles availability.

## Getting started

Review the
[Availability](https://docs.google.com/presentation/d/1FmUnMpbKKqnIH0y4CxDjB7Vzn7nY0hiGaWngYN6F1oU/present#slide=id.ge9cac6b40d_0_0)
slides.

### Codebase and manifest

1.  You must have completed (or fast-forwarded to) the
    [Hardening lab](../harden/).
    You must have your `pal-tracker` application associated with the
    `scaling-availability-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

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

## Verify availability characteristics

1.  In a dedicated terminal window,
    run a load test:

    ```bash
    docker run -i -t --rm -e DURATION=300 -e NUM_USERS=10 -e REQUESTS_PER_SECOND=5 -e URL=http://pal-tracker-${UNIQUE_IDENTIFIER}.${DOMAIN} pivotaleducation/loadtest
    ```

    Watch for 30 seconds or more to verify no errors.

1.  In a separate terminal window,
    invoke a failure:

    ```bash
    curl -v -XPOST -H "Content-Length:0"  http://${APP_URL}/actuator/palTrackerFailure
    ```

1.  Verify that a crash and restart occurs.
    You can see this either in *Apps Manager* or
    the window in which you are watching `cf events` output.
    This restart may occur very quickly, which demonstrates
    [disposability](https://12factor.net/disposability)
    characteristics of your application.

1.  Verify whether or not you see errors in your load test output.

    Notice that you may see some transient failures during the disposal
    and recovery of the failed instance.
    Keep in mind the Diego subsystem coordinates with the Gorouter to
    remove instances from its IP table during disposal,
    but there might be some requests in flight during the shutdown
    event.

    Your application design should accommodate such transient
    failures.

1.  Let your load test complete,
    or terminate it by `Ctrl+C`.

## Wrap up

Review the
[Availability](https://docs.google.com/presentation/d/1FmUnMpbKKqnIH0y4CxDjB7Vzn7nY0hiGaWngYN6F1oU/present#slide=id.ge9cac6b40d_0_0)
slides about how processes are monitored and recovered in
*Tanzu Application Service*.

Now that you have completed the lab, you should be able to:

- Demonstrate how *Tanzu Application Service* handles availability.

## Extras
