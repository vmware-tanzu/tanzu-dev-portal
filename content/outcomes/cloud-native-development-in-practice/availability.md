---
title: Availability
weight: 85
layout: single
team:
  - VMware Tanzu Labs
---

You will demonstrate how `pal-tracker` application
works with Tanzu Application Services Availability characteristics.

## Learning Outcomes

After completing the lab, you will be able to:

-   Demonstrate how Tanzu Application Services handles availability.

## Getting started

1.  Check out the
    [Availability](https://docs.google.com/presentation/d/1FmUnMpbKKqnIH0y4CxDjB7Vzn7nY0hiGaWngYN6F1oU/present#slide=id.ge9cac6b40d_0_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Hardening lab](../harden/).
    You must have your `pal-tracker` application associated with the
    `scaling-availability-solution` codebase deployed and running on TAS.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

## Verify availability characteristics

1.  From a separate terminal window,
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

1.  Verify in your `pal-tracker` and events watch windows a crash and
    restart occurs.
    This may occur very quickly,
    which demonstrates
    [disposability](https://12factor.net/disposability)
    characteristics of your application.

1.  Verify whether or not you see errors in your load test output.

    Notice that you may see some transient failures during the disposal
    and recovery of the failed instance.
    Keep in mind the Diego subsystem coordinates with the Gorouter to
    remove instances from its IP table during disposal,
    but there might be some requests in flight during the shutdown
    event.

    Your application design should accomodate for such transient
    failures.

1.  Let your load test complete,
    or terminate it by `Ctrl+C`.

## Wrap up

Checkout the
[Scaling slides](https://docs.google.com/presentation/d/1tvXFgvV27bGYRVB3eqUIA8CcqdwjQc_HLt-0k-LrK0Y/present#slide=id.gb53c81140d_0_55)
about how logging is handled on TAS.

Now that you have completed the lab, you should be able to:
-   Demonstrate how Tanzu Application Services handles availability.

## Extras
