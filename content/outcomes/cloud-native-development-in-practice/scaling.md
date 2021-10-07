---
title: Scaling
weight: 90
layout: single
team:
  - VMware Tanzu Labs
---

You will demonstrate how to scale your `pal-tracker` application
running on *Tanzu Application Service*.

## Learning outcomes

After completing the lab, you will be able to:

-   Demonstrate the ability to use autoscaling for an application on
    *Tanzu Application Service*.

## Getting started

Review the
[Scaling](https://docs.google.com/presentation/d/1CAHQc2DPZHGGoS7cyYkzSchQgDQsd4UKg_olQs6LpUk/present#slide=id.ge9cac6b4b4_0_0)
slides.

### Codebase

1.  You must have completed (or fast-forwarded to) the
    [Availability lab](../availability/).
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

## Scaling `pal-tracker`

*Tanzu Application Service* supports scaling the number of application
instances in 3 ways:

1.  Command line through the `cf scale -i <number of instances>` command.
1.  Setting in the manifest `instances` parameter,
    and pushing it.
1.  Through the
    [*Tanzu Application Service* Autoscaler](https://docs.pivotal.io/application-service/2-11/appsman-services/autoscaler/about-app-autoscaler.html).

You have already used the second option to achieve better availability
characteristics of your application.

Scaling up the number of `pal-tracker` instances requires two
characteristics of the ` application:

-   [Each `pal-tracker` application instance cannot persist state within its container](https://12factor.net/processes).
-   The `pal-tracker` application supports a
    [concurrent scale out model](https://12factor.net/concurrency),
    meaning that it can run multiple application instances concurrently.

Now you will use the autoscaler to accommodate increased workload
for the `pal-tracker` application.

### Scenario

Pretend that you have been running your `pal-tracker` application in
production for a while,
and you have good insights into the runtime characteristics:

1.  You know from experience you can run 10 requests-per-second (rps)
    comfortably on a given `pal-tracker` application instance.

1.  You have stress tested your application, and you know the maximum
    work rate per instance when it may become unstable is 20 rps.

1.  The current `pal-tracker` application has a relatively consistent
    workload of 10 rps throughout the day.

1.  You forecast in the next release you will have occasional daily
    peaks where the `pal-tracker` application may have to handle between
    40 and 50 rps.
    How many instances will you need to run at peak periods,
    without factoring in availability?

    ```nohighlight
    (target rps) / (rps/instance) = number of instances
    ```

    Or

    ```nohighlight
    (50 rps) / (10 rps/instance) = 5 instances
    ```

    Factoring in the need for availability, you have learned in
    production that under normal conditions you have sufficient
    redundancy with 2 extra instances.
    So, you never want to run fewer than 3 instances.

    You now know based on your stress testing that planned and/or
    unplanned outage of individual instances will be sufficiently
    tolerated with a total of 5 instances at 50 rps.
    You can see this by considering that even if 2 of the 5 instances
    become unavailable, the overall throughput would be:

    ```nohighlight
    (maximum rps/instance) * (number of instances) = max throughput
    ```

    or

    ```nohighlight
    (20 rps) * (3 instances) = 60 rps
    ```

    This still greater than the maximum required throughput of 50 rps.

### Enable application autoscaling

*Tanzu Application Service* supports automatic horizontal scaling based
on either pre-defined or custom rules.

For request/response (blocking) web applications,
HTTP throughput is a good choice assuming you have a solid grasp of the
performance, stability, and scaling characteristics of your app.

1.  If you are running the labs on your own development machine,
    you will need to
    [install the *Tanzu Application Service* Autoscaler CLI plugin](https://docs.pivotal.io/application-service/2-9/appsman-services/autoscaler/using-autoscaler-cli.html#install-the-app-autoscaler-cli-plugin).

1.  You have been supplied with a set up script that will configure an
    autoscaling rule for you with the following characteristics:

    -   Minimum number of instances:
        3
    -   Maximum number of instances:
        5
    -   Threshold when to scale up:
        10 rps
    -   Threshold when to scale down:
        5 rps

1.  You can review the set up script to see how the autoscaler CLI
    works:

    ```bash
    git show scaling-availability-start:scripts/setup-auto-scaling.sh
    ```

1.  Run the setup to enable the autoscaler:

    ```bash
    ./scripts/setup-auto-scaling.sh
    ```

1.  Run the following *autoscaler watch* command:

    ```bash
    watch cf autoscaling-events pal-tracker
    ```

### Observe autoscaling

1.  From a separate terminal window,
    run a load test:

    **Note that the `NUMBER_USERS` is now set for 100 users,**
    **and `REQUEST_PER_SECOND` is set for 50 rps.**

    **It is critical to run with these new settings instead of the**
    **previous load test runs,**
    **otherwise the autoscaler will not work in line with the**
    **expectations of this lab.**

    ```bash
    docker run -i -t --rm -e DURATION=300 -e NUM_USERS=100 -e REQUESTS_PER_SECOND=50 -e URL=http://pal-tracker-${UNIQUE_IDENTIFIER}.${DOMAIN} pivotaleducation/loadtest

1.  Observe both the *pal-tracker watch* and *autoscaler watch*
    terminal windows.

    How long does it take before the autoscaler scales up to the
    5 instance limit?

1.  Let your load test complete,
    or terminate it by `Ctrl+C`.

### Turn off autoscaling

1.  Observe both the *pal-tracker watch* and *autoscaler watch*
    terminal windows.

    How long does it take before the autoscaler scales down to the
    minimum 3 instances?

1.  Turn off the autoscaler:

    ```bash
    ./scripts/turn-off-autoscaling.sh
    ```

1.  Terminate the `cf app` and `cf events` watch windows.

### Autoscaling limitations

You saw that the autoscaling behavior is not instantaneous.
It is designed conservatively using a concept of a *Governor*,
an algorithm that limits rate of change within the autoscaler to
prevent potential outages if it is not tuned or used
correctly.

The [Scenario](#scenario) assumed that you have significant knowledge
about the performance, stability, scaling and capacity usage of your
application.
The scenario in this lab is actually quite naive,
it is up to you to gain familiarity with your production application
characteristics using your observability tools,
and also to do empirical testing to verify behaviors that you
anticipate to encounter in production.

**If you do not have this background and knowledge,**
**do not use the autoscaler!**.

See the
[Reddit outage postmortem announcement related to autoscaling](https://www.reddit.com/r/announcements/comments/4y0m56/why_reddit_was_down_on_aug_11/).

It is a sobering read that should give you pause when choosing to run an
autoscaler, as well as operate it.

Another good read on the subject is
[Release It! Second Edition](https://pragprog.com/titles/mnee2/release-it-second-edition/),
*Chapter 4 - Stability Antipatterns &rarr; Force Multiplier* and
*Chapter 5 - Stability Patterns &rarr; Governor*

A specific limitation for the *Tanzu Application Service* autoscaler
is that the CPU rules are not reliable.
See
[this advisory](https://pvtl.force.com/s/article/PCF-Autoscaler-Advisory-for-Scaling-Apps-Based-on-the-CPU-utilization?language=en_US)
for more information.

## Wrap up

Now that you have completed the lab, you should be able to:

-   Demonstrate the ability to use autoscaling for an application on
    *Tanzu Application Service*.
