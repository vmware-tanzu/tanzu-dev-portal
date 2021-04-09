---
title: Application Observability
description: Some description of app observability
weight: 2
layout: single
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

When most people think of observability, they often immediately think of
dashboards, metrics, and alerts. We think it’s important to take a step back and
focus on a few key areas as you execute on your observability strategy.

The first area of focus is identifying what to measure. The quality of the data
you collect is significantly more important than the overall quantity. The best
way to reason about a system’s availability is to identify a small set of
Service Level Indicators (SLIs) that closely map to the user’s experience, and
set appropriate Service Level Objectives (SLOs) for each of these indicators.
Getting this part right ensures that any future alerts you build will be
actionable and backed by data that clearly indicates the user-facing impact.

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
