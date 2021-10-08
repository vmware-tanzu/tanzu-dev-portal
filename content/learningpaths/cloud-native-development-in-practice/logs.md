---
title: Logs
weight: 75
layout: single
team:
  - VMware Tanzu Labs
---

This lab introduces the concepts around logging.

## Learning outcomes

After completing the lab, you will be able to:

-   Explain how *Tanzu Application Service* helps with logging of cloud
    native applications

## Get started

1.  Review the
    [Logs](https://docs.google.com/presentation/d/1XiqxrGlLZ-OccP7HX7DoLn39xvq86NhWbBvgTrAyGRw/present#slide=id.ge9cac6b442_0_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Health Monitoring lab](../health-monitoring/).
    You must have your `pal-tracker` application associated with the
    `actuator-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

There are no code changes for this lab.
It is discussion and demo only.

## Logs

Logs are a crucial part of monitoring and observability in a modern
cloud native application.

*Tanzu Application Service* (TAS) has rich support for handling logs in
the following ways:

### Log aggregation

*Tanzu Application Service* has a rich log aggregation subsystem that
supports cloud native applications
[writing to log streams](https://12factor.net/logs).

1.  The Diego subsystem takes care of capturing your application
    instance log streams and putting them into a single
    log stream for the application.

1.  The Loggregator subsystem manages the aggregation of the log stream,
    including:

    - Application instance logs
    - Diego Cell events
    - Go Router access logs
    - Cloud controller events

1.  Loggregator is also used to stream *Tanzu Application Service*
    system metrics.
    You can read more about the
    [architecture](https://docs.pivotal.io/application-service/2-7/loggregator/architecture.html#system-metrics-agents).

### Agnostic to downstream monitoring collection tools

*Tanzu Application Service* does not perform the roles of log collection
or analytics tools.
It supports the ability to configure "drains" to output to a log
collection or analytics tool of your choice,
such as
[Splunk](https://docs.cloudfoundry.org/devguide/services/integrate-splunk.html)
or
[Fluentd](https://docs.cloudfoundry.org/devguide/services/fluentd.html#drain).

You can read more about the
[*Tanzu Application Service* Loggregator Architecture](https://docs.cloudfoundry.org/loggregator/architecture.html).

## Wrap up

Review the
[Logs slides](https://docs.google.com/presentation/d/1tvXFgvV27bGYRVB3eqUIA8CcqdwjQc_HLt-0k-LrK0Y/present#slide=id.gae083b4822_0_18)
about how logging is handled on *Tanzu Application Service*.

Now that you have completed the lab, you should be able to:

-   Explain how *Tanzu Application Service* help with logging of cloud
    native applications

## Resources

- [*Tanzu Application Service* Logging and Metrics](https://docs.cloudfoundry.org/loggregator/data-sources.html)