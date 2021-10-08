---
title: Application Observability
weight: 2
featured: true
featuredspot: 4
layout: intro
duration: 60
experience: Beginner
description: |
  Reliability is one of the most important features of any application.
  Here we discus various tools and techniques that can be used to ensure
  that the state of your application can be quickly understood, no matter
  how complex it may be.
aliases:
- "/patterns/observability/"
- "/outcomes/application-observability/"
oldPath: "/content/outcomes/application-observability/_index.md"
tags: []
---

## Key Concepts

- A strong observability culture is essential in order to reliably deliver new
  features at today’s pace.
- It’s critical to know your user and measure what matters to them.
- When it comes to monitoring and alerting, a relentless focus on simplicity
  will keep your team as effective as possible during incidents.

## Outcomes

What we’ve heard from customers:

- “We don’t want to find out about issues from our customers.”
- “We need to reduce the cost of delivering our service.”
- “Our monitoring often indicates that there may be an issue, but we are unsure
  what, if any, customer impact there may be.”

## Summary

In today’s connected world, application development teams are under increasing
pressure to deliver new features faster than ever before. In addition to
expecting new features on a continuous basis, end-users are accustomed to high
levels of reliability and will quickly look for alternative products and
services if their expectations are not met.

Satisfying these ever-increasing demands is no short order. Software systems
commonly consist of a multitude of microservices spanning a variety of cloud and
on-premise environments, with dependencies on external services and tools. These
systems require constant change in order to accommodate new features and keep up
with critical security patches, but change introduces risk. A strong
observability culture is essential to manage this risk and make sense of these
complex systems.

## The Three Pillars of Observability

When we say observability, we're often referring to one or more of:

- logging
- metrics
- tracing

### Logging

It's easy to generate logs from your applications. In fact, it's so easy that
one of the most common challenges when collecting and analyzing logs is that
there is just way too much data to sift through. This is further complicated
with the ephemeral nature of today's container-based workloads that can start or
stop in a matter of moments, taking the local logs with them.

In order for your logs to be of use, you need to ensure that they are collected
and retained for an appropriate amount of time, easy to find, and easy to
visualize. There are many ways to solve for these concerns, including logging
services from cloud providers or application platforms as well as maintaining
your own logging infrastructure. If you do need to stand up your own solution,
there is a wide ecosystem of open-source technologies that can be used. For
example, the "EFK stack" ([Elasticsearch](https://www.elastic.co),
[Fluentd](https://www.fluentd.org), and
[Kibana](https://www.elastic.co/kibana)) is a popular option.

### Metrics

Metrics allow you to measure the performance of your applications and
infrastructure over time. In tools like [Prometheus](https://prometheus.io)
and [Tanzu Observability](https://tanzu.vmware.com/observability), metrics
are represented as _time series_ with a unique name and a series of labels
or tags.

Metrics often require less storage and processing resources than logs, since the
resources required to collect a single time series are constant and do not scale
with the utilization of the system. Additionally, since they are numerical and
more structured it is easier to generate visualizations and alerts to understand
the health of the system.

### Tracing

Many applications today are made up of several smaller services, and communicate
with a variety of external dependencies. As a result, one request from a user's
perspective may result in a series of separate requests to distinct services.
Tracing is a technique that allows you to follow these related requests through
the system, and is especially useful for identifying where performance problems
lie.

For many teams, tracing is the most difficult aspect to implement, as all of the
various components of the system need to instrumented to propagate traces. There
are a number of popular open source solutions in this space, including
[Zipkin](https://zipkin.io) and [Jaeger](https://www.jaegertracing.io).
Additionally,
[VMware Tanzu Observability](https://tanzu.vmware.com/content/vmware-tanzu-observability-features/microservices-observability-with-distributed-tracing)
supports any traces compatible with the
[OpenTelemetry](https://tanzu.vmware.com/content/vmware-tanzu-observability-features/microservices-observability-with-distributed-tracing)
framework.

## Getting Started on your Observability Journey

While it can be tempting to jump straight into the world of dashboards, metrics,
and alerts, we think it’s important to take a step back and focus on a few key
areas as you execute on your observability strategy.

The first area of focus is identifying what to measure and how you'll measure
it. The quality of the data you collect is significantly more important than the
overall quantity. The best way to reason about a system’s availability is to
identify a small set of Service Level Indicators (SLIs) that closely map to the
user’s experience, and set appropriate Service Level Objectives (SLOs) for each
of these indicators. Getting this part right ensures that any future alerts you
build will be actionable and backed by data that clearly indicates the
user-facing impact.

Next, you’ll want to spend some time “refactoring” your alerting setup. Just
like source code, alerting configuration has a tendency to become overly
complicated and hard to understand. If your alerts are to serve you well, they
need to be simple, well understood, and easy to act on. Having too many alerts
can be worse than not having enough, as a team can quickly become desensitized
and conditioned to ignore alerts they don’t understand or need anymore.
Additionally, your observability tools should be as easy as possible for you to
maintain - you don’t want to spend too much time worrying about scaling or
having sufficient disk space, you want to trust that the data you need will be
there for you when you need it.

Lastly, focus on building out a well-defined incident response procedure. Good
alerts can help you detect issues sooner, but observability done well should
provide the tooling and data needed to troubleshoot and resolve incidents. In
other words, a strong observability culture can help reduce both mean time to
detect (MTTD) an issue, and mean time to recover (MTTR), but only if your team
knows how to effectively respond to the incident after receiving an alert. This
includes everything from defining roles, responsibilities, and communications
protocols to ensuring that your team is able to effectively use your tools to
troubleshoot issues.
