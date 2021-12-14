---
title: Building Blocks, Part 1
weight: 30
layout: single
team:
- VMware Tanzu Labs
oldPath: "/content/outcomes/application-development-rhythm/dev-building-blocks-1.md"
aliases:
- "/outcomes/application-development-rhythm/dev-building-blocks-1"
tags: []
---
This article is the third in a five-part series.

A healthy *Developer Rhythm* uses a disciplined workflow.
This type of workflow requires you to use a set of
building blocks to facilitate that flow.

![Principles, Practices](/images/outcomes/application-development-rhythm/dev-building-blocks.jpg)

## What You will Learn

In this article, you will learn to:

-   List and describe the development *practices* to use in your
    day-to-day development flow.

-   List and describe the development flow *techniques and methods*
    to use in your day-to-day development flow.

## Coding and Architectural Design Principles and Practices

Building a new application is easier than you might think.
This is because there is nothing existing to change
and nothing existing to break when adding new features.

Much of the work you do as a developer centers around
adding and modifying code to *an existing codebase*.
This implies frequent change.
Frequent change can be difficult.

You can gain knowledge and experience using
principles and practices by continually applying
them to the problems you are trying to solve, while
also ensuring the codebase is *flexible to change*.

There are many good development principles.
The following principle is universal for software,
regardless of the language or technology:

***Code must be easy for any developer to read, adapt and extend.***

### Pair Programming Practices

Pair programming addresses many of the challenges of modern application
development,
and is a top-level practice for your team to adopt.

You can read more about it [here](https://tanzu.vmware.com/developer/outcomes/application-development/pair-programming/).

If you work on a distributed team, a remote team,
or work on an outsourcing arrangement,
pairing may be a challenge.

For cohesive product teams that work on similar time zones,
the inherent benefits of pairing often outweigh the tradeoffs that
a developer working alone might experience during the
modern app developer workflow.

### Test-first Practices

Test-first practices have a wide range of acceptance and are supported
through mature techniques and tools.

*Test-Driven development* is a test-first practice.
You can read more about it
[here](https://tanzu.vmware.com/developer/outcomes/application-development/test-driven-development/).

Test-first practices ultimately improve speed,
safety and sustainability because they let you:

-   Specify the implementation design that
    reduces the need for explicit design documentation.
-   Test coverage.
-   Separate the hypothesis phase and the experiment phase
    that provides a natural fit to drive a feedback loop.

## Continuous Integration Practices

Read about
[Continuous Integration here](https://tanzu.vmware.com/developer/guides/ci-cd/ci-cd-what-is/#what-is-ci).

You may associate this with merging (*pushing*) your work to the
team’s repository,
and having an automation tool verify that   the integration works.

With a *pull* based model,
the you *pull the latest* changes into a local
development environment and verify integration *locally* before
merging the changes back to a shared repository.
Integrating locally prevents the automated test and build from
failing due to integration conflicts.

## Trunk-based Development Method

[Trunk-based development](https://trunkbaseddevelopment.com/) is the
method of a team’s developers integrating on a *trunk* or *mainline* of
a source control repository.

![Trunk](/images/outcomes/application-development-rhythm/trunk.jpg)

Examples of trunk naming in various source control systems, include:

-   **Git**:
    *main* is the preferred branch name.
-   **Mercurial**:
    *default*
-   **Subversion (SVN)**:
    *trunk*
-   **Concurrent Version Systems (CVS)**:
    *HEAD*

For small,
cohesive modern application product teams this model works well.
It also scales well when combined with
[short-lived feature branches](https://trunkbaseddevelopment.com/#scaled-trunk-based-development).

Trunk-based development facilitates
*Continuous Integration* and *Continuous Delivery* practices.
If you are working on products that support multiple,
release versions used by different customers,
or if you have a significant number of contributors that are outside
the product team,
this model is not the best for you.

Example scenarios include:

- A large-scale supported open source or *OSS product*.
- A commercial-off-the-shelf or *COTS product*.

## Timeboxing Technique

Timeboxing is a general technique to govern cadence of your day-to-day
work.

Timeboxing is agreeing in advance that if the work is not done in a
specific amount of time,
the team should assess whether it is worthwhile to continue the work.

Timeboxing is often applied to research activities, as done in
*[Spikes](https://www.leadingagile.com/2016/09/whats-a-spike-who-should-enter-it-how-to-word-it/)*.

Two characteristics of modern app development are the achievement of
consistency,
and sustainability in your day-to-day workflow.
A good analogy is that of a modern app team running a marathon at a
consistent pace,
instead of running at a sprint pace.

Timeboxing lets you chunk specific times for work
and specific times to rest in so that
the workflow cadence is more consistent and sustainable.

The
[Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro*Technique)
is a good tool to help you timebox.

## Summary

After reading this article, you can now:

-   List and describe the development *practices* in your
    day-to-day development flow.

-   List and describe the development flow *techniques and methods* in
    your day-to-day development flow.

You were also introduced to the major building blocks to use
in your daily workflow.
There are many more building blocks for you to learn about.

The building blocks described here, influence use of
other techniques and tools that you can read about
in the article, *Building Blocks, Part 2*.

## Keep Learning

- [Pair Programming](../../application-development/pair-programming/)
- [Test-Driven Development](../../application-development/test-driven-development/)
- [Cloud Native Development](../../application-development/cloud-native-development/)
- [Trunk-based Development](https://trunkbaseddevelopment.com)
