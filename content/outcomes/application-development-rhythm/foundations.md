---
title: Foundations
weight: 10
layout: single
team:
  - VMware Tanzu Labs
---
This article is the first in a five-part series.

Before you explore this series,
it is necessary you understand the context of
*modern application principles* and *practices*.

This article outlines the context,
as well as the core building blocks necessary to sustain a product or
project using modern application development practices.

![Foundations](/images/outcomes/application-development-rhythm/foundations-building.jpg)

## What you will learn

In this article you will be able to:

-   Explain the context of modern application development.
-   Describe the types of building blocks that comprise modern
    application development.
-   Describe how modern application developer must continually
    consider trade offs and technical debt.

## Modern Application Principles and Practices

The context for Modern Application Development is that your organization
is maintaining,
planning to build,
or modernizing existing software products that:

-   Achieve a market fit.
    The systems provide value to your organization and customers for a
    long time.
-   Are subject to continual change.
-   Allow changes to be done *quickly*, *safely* and *sustainably*.
-   Persistent product teams can build, evolve and maintain.

If none of these apply to you, you can stop reading now.

Still here?

Great!

Older legacy application development practices included a lot of formal
processes,
bureaucracy,
and separation of skill sets with the logic that it is necessary to use
formalized structure to *force discipline top-down* to deliver software.

Modern application development practices require just as much,
if not more discipline as the legacy processes.
The difference is the way discipline is instilled from a
*bottom-up collaborative approach* instead of the top-down bureaucratic
approach.

Now that you have an idea about the context,
let us discuss the major types of building blocks that form the
foundation of modern application development.

## Building blocks

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

You will see example of building blocks in the upcoming articles:

-   [Development Building Blocks, Part 1](../dev-building-blocks-1/)

-   [Development Building Blocks, Part 2](../dev-building-blocks-2/)

## Principles

A *Principle* is a fundamental rule that guides the modern application
development practitioners' discipline and selection of
*practices in the appropriate context*.
There are lots of principles,
including those that build on each other,
or have related contexts.
Principles also:

-   Provide context including *why* you might use any combination of the
    remaining building block types in this article.
-   Serve  as the light that guides you in the right direction.
-   Are tied to proven success factors,
    and tend to be relevant for long periods of time.

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
make sure you are asking about *why* you are working in a specific way,
and what principles are important in guiding your work.

![Principles](/images/outcomes/application-development-rhythm/principles.jpg)

## Practices

A *practice* is a specific way the developer works as guided from the
*principles* of their work context to accomplish a goal.
Think of *practices* as a high level of *how* work is done that does not
specify the exact steps.

Like *principles*,
*practices* are relevant longer than the items lower in the list,
but their lifetime is tied to the relevance of the context in which they
live.
The modern application development practitioner may use multiple
practices during their daily workflow to solve problems efficiently and
safely.

Some of the practices you will learn about in this series are:

-   [Pair Programming](../../application-development/pair-programming/)

-   [Test Driven Development](../../application-development/test-driven-development/)

### Methods and Techniques

*Methods and Techniques* are processes or procedures that facilitate the
performance of the relevant *practices*.

They are not broad enough to be considered practices,
but form the detailed *how* in the practitioners' work in very specific
scenarios that support the relevant *practices*.

Some methods/techniques you will see in this series:

- [Refactoring](https://refactoring.com)
- Red/Green/Refactor

## Patterns

Patterns are known solutions in the appropriate problem context.

Think of patterns as one of the high level *whats* of building software.

![Patterns](/images/outcomes/application-development-rhythm/patterns.jpg)

*Patterns* are not “invented”.
They are typically noticed across projects when developers use similar
coding patterns,
and are formally published after to communicate and collaborate across a
large number of developers.

*Patterns* also tend to be long-lived,
similar to *practices*.

When you have specific types of problems to solve,
there may be patterns that you can use to solve your problem,
and make your code easier to understand for others to maintain later.

*Anti-patterns* are solutions shown *not* to work in a specific problem
context.
Similar to  patterns,
they are mined over time.

## Tools and Technologies

*Tools* and *Technologies* facilitate the use of methods and practices,
as well as implementation of solution patterns where appropriate.

It is important to be careful about selection of tools,
technologies and frameworks,
as some today may be obsolete tomorrow.

For this reason it is important not to over fit to any particular tool or
technology,
and their selection criteria should be based on support for standards.

It is important to select and gain proficiency with the appropriate
tools that will remove unnecessary friction in the modern apps
practitioner workflow.

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
-   Trade offs, Costs and Technical Debt
