---
title: Building Blocks, Part 1
weight: 30
layout: single
team:
  - VMware Tanzu Labs
---
This article is the third in a five-part series.
It provides a set of building blocks upon which the modern app developer
can follow a structured and disciplined workflow.

A healthy *Developer Rhythm* uses a disciplined workflow,
and the workflow requires a set of building blocks to facilitate that
flow.
The order reflects the more general building blocks,
to the more specific.

![Principles, Practices](/images/outcomes/application-development-rhythm/dev-building-blocks.jpg)

*Note:*
For the remainder of this article,
the term *developer* either refers to a *single developer*,
or a *single pair* of developers working on a single workflow.

## What you will learn

By the end of this article you will be able to:

-   List and describe the development *practices* you will use in your
    day-to-day development flow.

-   List and describe the development flow *techniques and methods* in
    your day-to-day development flow.

## Coding and Architectural Design Principles and Practices

Building a brand-new application can be relatively easy.
There is nothing existing to change to accommodate new features,
and nothing existing to break.

Most of the developer work will be adding and modifying code of
*an existing codebase*.
This could imply frequent change.
Frequent change can be difficult.

Modern app developers must gain knowledge and experience applying
principles and practices on a continual basis that help solve the
problem they are trying to solve,
while also keeping the codebase *flexible to change*.

There are many development principles.
The following is a good principle that is universal for software,
regardless of the language or technology.

***Code must be easy for any developer to read, adapt and extend.***

NOTE:
There are other, specific principles to support this broad one,
but they are outside the scope of this article.

### Pair Programming Practices

Pair programming addresses many of the challenges of modern application
development,
and is listed as a top level practice for your team to adopt.

You can read more about it [here](https://tanzu.vmware.com/developer/outcomes/application-development/pair-programming/).

If you work on a distributed or remote team,
or if you work in an outsourcing arrangement,
pairing may be a challenge.

For cohesive product teams that work on similar time zones,
the inherent benefits of pairing often outweigh the tradeoffs that
cross-cut many of the challenges a developer will encounter during the
modern app developer workflow.

### Test-first practices

Test-first practices have a wide range of acceptance and are supported
through mature techniques and tools.

*Test-Driven development* is such a practice.
You can read more about it
[here](https://tanzu.vmware.com/developer/outcomes/application-development/test-driven-development/).

It gives several benefits contributing to speed,
safety and sustainability:

-   Tests specify the implementation design,
    reducing need for explicit design documentation.
-   Test coverage.
-   Test-first separates the hypothesis and experiment phases and is a
    natural fit to drive a feedback loop.

## Continuous Integration practices

Read about
[Continuous Integration here](https://tanzu.vmware.com/developer/guides/ci-cd/ci-cd-what-is/#what-is-ci).

Developers may associate this with merging (*pushing*) their work to the
team’s repository,
and having an automation tool verify the integration works.

With a *pull* based model,
the modern app developer *pulls the latest* changes into a local
development environment and verifies integration *locally* before
merging their changes back to the shared repository.
Integrating locally should prevent the automated test and build from
failing due to integration conflicts.

## Trunk-based Development method

[Trunk-based development](https://trunkbaseddevelopment.com/) is the
method of a team’s developers integrating on a *trunk* or *mainline* of
a source control repository.

Some examples of trunk naming in various source control systems:

-   **Git**:
    *main* is the preferred branch name.
    Although the branch name of *master* may be found in older projects,
    its use is deprecated.
-   **Mercurial**:
    *default*
-   **Subversion (SVN)**:
    *trunk*
-   **Concurrent Version Systems (CVS)**:
    *HEAD*

For small,
cohesive modern application product teams this model works well.
This model also scales well when combined with
[short-lived feature branches](https://trunkbaseddevelopment.com/#scaled-trunk-based-development).

Trunk-based development facilitates
*Continuous Integration* and *Continuous Delivery* practices.
If you are working on products that support multiple concurrent release
versions used by different customers,
or if you have a significant number of contributors that are external to
the product team,
this model probably is not work best for you.

Example scenarios include:

- A large-scale supported open source or *OSS product*.
- A commercial-off-the-shelf or *COTS product*.

## Timeboxing method

Timeboxing is a general technique to govern cadence of your day-to-day
work.

Timeboxing is agreeing in advance that if the work is not done in a
certain amount of time,
the team should assess whether it is worthwhile to continue.

It is most often applied to research tasks as done in
*[Spikes](https://www.leadingagile.com/2016/09/whats-a-spike-who-should-enter-it-how-to-word-it/)*.

A characteristic of modern app development is the achievement of
consistency,
and sustainability.
A good analogy is that of a modern app team running a marathon at a
consistent pace,
versus a sprint.

Timeboxing is a technique to chunk specific times for work and specific
times to rest so that the workflow cadence is more consistent and
sustainable.

The
[Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro*Technique)
is a good tool to help the developer timebox.

## Summary

In this article,
you discovered how to:

-   List and describe the development *practices* you will use in your
    day-to-day development flow.

-   List and describe the development flow *techniques and methods* in
    your day-to-day development flow.

This article also introduced the major building blocks that you will use
every day.
There are a lot more building blocks for you to learn about that are not
included here.

The building blocks covered in this article also influence use of other
techniques and tools that are covered in the *Building Blocks, Part 2*
article.

## Keep Learning

- [Pair Programming](../../application-development/pair-programming/)
- [Test-Driven Development](../../application-development/test-driven-development/)
- [Cloud Native Development](../../application-development/cloud-native-development/)
- [Trunk-based Development](https://trunkbaseddevelopment.com)
