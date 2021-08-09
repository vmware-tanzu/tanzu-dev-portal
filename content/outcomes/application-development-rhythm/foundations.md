---
title: Foundations
weight: 10
layout: single
team:
  - VMware Tanzu Labs
---
**This article is the first in a five-part series.**

This article outlines the context,
and the core building blocks necessary to sustain a product or
project using modern application development practices.

![Foundations](/images/outcomes/application-development-rhythm/foundations-building.jpg)

Before you explore this series,
you're going to need to understand 
*modern application principles* and *practices*.


## What you will learn

In this article, you will learn how to:

-   Explain the context of modern application development.
-   Describe the types of building blocks that comprise modern
    application development.
-   Describe how a modern application developer must continually
    consider trade offs and technical debt.

## Modern Application Principles and Practices

Modern Application Development enhances your organization's
ability to maintain, plan to build,
or modernize existing software products that:

-   Achieve a market fit.
    Provide long-term value to your organization and customers.
-   Are subject to continual change.
-   Allow changes to be done *quickly*, *safely*, and *sustainably*.
-   Allow persistent product teams to build, evolve and maintain software.

If none of these apply, you can stop reading now.

Still here?

Great!

Older legacy application development practices include a lot of formal
processes,
bureaucracy,
and a separation of skill sets with the logic that it is necessary to use
formalized structure to *force discipline top-down* to deliver software.

Modern application development practices require just as much,
if not more discipline, than legacy processes.
The difference is the way discipline is instilled from a
*bottom-up collaborative approach* instead of the *top-down bureaucratic
approach*.

Now that you have an idea about the context,
let us discuss the major types of building blocks that form the
foundation of modern application development.

## Building Blocks

The following ordered list provides five categories of building blocks
that support *Modern Application Development* and the associated modern
application development processes:

1.  Principles
1.  Practices
1.  Patterns
1.  Methods,
    Techniques
1.  Tools,
    Technologies

There are examples of building blocks in the upcoming articles:

-   [Development Building Blocks, Part 1](../dev-building-blocks-1/)

-   [Development Building Blocks, Part 2](../dev-building-blocks-2/)

## Principles

A *Principle* is a fundamental rule that guides the modern application
development practitioners' discipline and selection of
*practices in the appropriate context*.
There are lots of principles that build on each other,
or have related contexts.
Principles also:

-   Provide context such as *why* you might use any combination of the
    remaining building block types in this article.
-   Serve as a light that guides you in the right direction.
-   Are tied to proven success factors,
    and are relevant for long periods of time.

Tanzu Labs's foundational principles are to:

- ⚡️ Empower Teams.
- 🌱 Start Simple.
- 🦋 Embrace Change.
- 🚀 Deliver Early and Often.
- 🔬 Improve Continuously.
- ❤️ Give Back.

Learn more about our foundational principles
[here](/outcomes/application-development-how-we-work/principles/).

Some of the engineering principles are:

- [SOLID design principles](https://en.wikipedia.org/wiki/SOLID)
- [12 Factor guidelines](https://12factor.net)

As you collaborate with other experienced modern application development
practitioners,
make sure to ask *why* they work in a specific way,
and what principles they follow to guide their work.

![Principles](/images/outcomes/application-development-rhythm/principles.jpg)

## Practices

A *practice* is a specific way the developer works to accomplish a goal, according to their work context
*principles*.
Think of *practices* as a high level method of *how* work is done without
specifying the exact steps.

Like principles,
practices are relevant longer than the items lower in the list.
The lifetime of principles is tied to the relevance of the context in which they
live.
The modern application development practitioner may use multiple
practices during their daily workflow to solve problems efficiently and
safely.

Some of the practices you will learn about in this series include:

-   [Pair Programming](../../application-development/pair-programming/)

-   [Test Driven Development](../../application-development/test-driven-development/)

### Methods and Techniques

*Methods and Techniques* are processes or procedures that facilitate the
performance of the relevant practices.

Though not broad enough to be considered practices, methods and techniques
form the detailed *how* in the practitioners' work in very specific
scenarios that support the relevant *practices*.

Some of the methods and techniques you will see in this series includes:

- [Refactoring](https://refactoring.com)
- Red/Green/Refactor

## Code Patterns

Code patterns are traceable events that happen when a developer codes.
They are an excellent resource for providing solutions to new and 
recurring software problems. 

*Patterns* are also long-lived,
similar to *practices*.

Think of patterns as one of the high level *whats* of building software.

Developers whose share common coding techniques are quick to recognize 
similar code patterns, across projects. Today, code patterns are 
often published so that other developers may also share 
and collaborate their findings.

![Patterns](/images/outcomes/application-development-rhythm/patterns.jpg)

*Anti-patterns* are code patterns that do not provide a solution to fix 
a new or recurring software problem.

## Tools and Technologies

*Tools* and *Technologies* facilitate the use of solution pattern methods and practices,
as well as the implementation of solution patterns, where appropriate.

As you know, the most popular tools, technologies and frameworks
available on the market today, can quickly be replaced and considered 
outdated tomorrow. One way to ensure the tools and technologies that you select  
are going to be the most productive is to refer to your organization's 
support for standards to collect tool selection criteria.

It's also a good idea to become proficient in how each of the tools and
technologies work, as this is the best ways to prevent
friction in the Modern Apps Practitioner Workflow.

## Trade offs, Costs and Technical Debt

So far in this article you have been exposed to the major types of
building blocks you will use to run your daily work.
Selecting which ones to use,
and when to use them,
can be a challenge.

**Every activity you do,**
**and every building block you select and use,**
**will have trade offs,**
**and associated costs.**
The costs may be measured in time, money or opportunities lost.

You can think of managing your costs from three perspectives:

- Upfront Costs
- Taxes
- Debt

![Trade offs, Costs and Technical Debt](/images/outcomes/application-development-rhythm/foundations-bank.jpg)

### Upfront Costs

When software product teams are planning,
estimating and building new features,
or fixing defects,
there are clear costs:

-   Team's time spent on doing the activities

-   Resource costs,
    including compute,
    storage and other infrastructure costs
    specific to the activities

Modern App Developers will keep to minimal designs to keep the upfront
costs low,
but that may lead to
[*Technical Debt*](#technical-debt).

### Taxes

The term *tax* is a useful one when describing ongoing costs of
authoring and maintenance of software products.

*Taxes* are *compulsory charges* imposed to fund activities over time,
with negative consequences when avoiding to pay them.

Some examples of such software *taxes*:

-   Software maintenance,
    keeping application codebases clean

-   Use of *Platforms* or *Middleware*

-   Tools licensing or subscription costs

-   3rd party dependency upgrades

-   Developer continual learning

Attempting to avoid paying any of these will have serious ramifications
to the associated software product team.

### Technical Debt

*Technical Debt* is the concept where:

-   A software product team,
    or developer,
    chooses to take a shortcut,
    perhaps in a feature or design implementation,
    for an immediate term benefit.

    It is expected the team or developer will remediate,
    or repay,
    the shortcut at some later time.

-   The more such shortcuts that are taken without remediating,
    or replaying,
    them,
    the more accumulation of "debt" will have negative ramifications for
    the product team.
    Most of the time this will translate to slowing the team down.

A common example of accumulation of technical debt is where:

-   A developer chooses to deviate from software development principles
    as a short cut to move faster in the moment.

-   A developer should remediate that deviation as part of an ongoing
    code maintenance activity.

-   Development teams that continually deviate from development
    principles will put the software codebase in a state that
    becomes hard to maintain and change.

Make sure you repay your technical debt!

## Summary

This article primed you with the context of:

-   Modern application development
-   The types of building blocks that comprise modern application
    development
-    offs, Costs and Technical Debt
