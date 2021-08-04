---
title: Building Blocks, Part 2
weight: 40
layout: single
team:
  - VMware Tanzu Labs
---
This article is the fourth in a five-part series.

A healthy *Developer Rhythm* uses a disciplined workflow,
and the workflow requires a set of tools,
much like carpenters.

Developers implementing features or fixes in software use modern methods
and tooling with the objective of moving quickly,
safely,
and sustainably.

![Methods, Tools, Techniques](/images/outcomes/application-development-rhythm/dev-building-blocks-tools.jpg)

Note:
For brevity,
during the remainder of this article,
the term *developer* refers to either a *single* developer,
or a *single pair* of developers working on a single work element.

## What you will learn

By the end of this article, you will be able to:

- List and describe techniques and methods that facilitate the developer flow.
- List and describe general tools that facilitate the developer flow.

## Methods and Techniques

### Private Branch method

Distributed Source Code Version Systems like *Git* or *Mercurial*
allow you to work independently from the team source control repository.

The mechanics include copying the complete repository to the developer
workstation,
including the full commit history.

The developer has the capability to create a *new local history*,
and *revise that history* before merging it back to the team shared
repository trunk.

The developer uses the distributed source control local branching
feature to track work in the feedback loops,
making it easy to throw out experiments that did not work without having
to merge the team shared repository.

At the end of the feedback loop phase of the workflow,
the developer can update the version history so that it is a single,
curated,
well described commit that communicates concisely the purpose of the
change,
that is merged to the shared repository mainline.

### Refactoring technique

As previously mentioned,
a main principle of software development is making code easy to change.
As a codebase becomes more complex,
developers will have to restructure it to accommodate new features.

[Refactoring](https://www.refactoring.com/) is the process of changing
the structure of a codebase without changing its behavior.
While refactoring is a technique,
its use can range from straightforward to extremely complex.

### Mikado method

The
[Mikado method](https://www.methodsandtools.com/archive/mikado.php)
is a formal implementation of a feedback loop that is well suited for
complex work requiring discovery of the next step.
It contains a distinct process of setting a goal,
performing experiments,
visualizing the goal,
and achieving the goal.
It also includes the steps for *undoing* or reverting from failed
experiments.

The Mikado method is commonly used in combination with refactoring and
test-first practices.

### Rubber Duck Debugging technique

If you work on a remote team or in an organization where you cannot pair,
you might be lonely.
Especially *when you get stuck*.
Sometimes,
you will get stuck in a problem,
with no others to consult.

Use the
[Rubber Duck Debugging](https://rubberduckdebugging.com/)
method to see if you can get unstuck.

## Middleware, Databases, Platforms

You need a place to run your software applications,
and a place to store their data
(persistent for your production apps,
but not necessary for your development environments).

There are two current trends that are popular as of the authoring of
this article:

- Learning Virtualization technologies
- Learning container technologies (like Docker)

Both underpin much of the modern platforms where most new applications
run today.

## Developer Tools

These are the class of tools developers can choose that best fit their
projects and work.
Notice that there are no specific tools recommended -- you will need to
figure that out based on your team needs.

One suggestion is to start with the most minimal possible toolset,
and add more sophisticated tools as needed.

Some reasons to keep it simple:

-   It is more important for the developer to focus on solving problems
    than on using tools.
    The tools must stay out of your way.

-   More complex tools may hide key details the developer needs to know.

### Languages, Compilers, Build tools

This segment of tools are the root technical building blocks upon which
your software is built.

You may work in an organization that lets you pick the appropriate
technologies for your products.
If not, your choice could be restricted by:

- The platforms where you run your software.
- The tools your organization has chosen for you.

### Frameworks

*[Software Frameworks](https://en.wikipedia.org/wiki/Software*framework)*
are common tools in the developers toolkit to shed some of the burden of
software development.
One area to be aware of is a particular framework hiding of
implementation or software runtime details.
When the developer uses a framework,
they must understand the mechanics and workings of the framework during
software runtime.
One such example in the Java ecosystem is the
[Spring Framework](https://spring.io/projects/spring-framework).

### Interactive Development Environment

*Interactive Development Environment* (IDE) is one of the best known
developer tools to write software.

IDEs can also be used for debugging software,
integrated source control system clients,
writing documentation,
and in some cases orchestrating a developer’s workflow.

Some IDEs are modular,
meaning they can be extended and customized for a particular developer
workflow.
Developers should keep their development environments streamlined and
clean.
They should also understand how the IDEs work,
and interact with the language interpreters,
compiler and build system.

[Visual Studio Code](https://code.visualstudio.com/)
is an example of a lightweight,
cross language IDE,
but there are many best-in-breed tools to choose from in your language
ecosystem.

### Accelerators

*Accelerators* are specialized tools used at specific points in the
development workflow,
typically at the beginning of a new project.

They are typically used to provide cross-cutting concerns to codebases
that are standards for your organization,
frameworks you choose,
or perhaps to facilitate working in a secure path to production.

In the Java/Spring ecosystem,
the
[Spring Initializr](https://start.spring.io/)
is an example of a new project accelerator.

### Code Katas

If you are a new software developer,
and have gotten this far in the article,
you might be apprehensive about everything you’ll have to learn to
become a proficient and competent modern app developer.

The good news is that you can practice on your own to gain efficiency
and proficiency,
even before working on a real project.

You can use
[Code Kata](http://codekata.com/kata/codekata-intro/)
as a technique for focused practice on methods or techniques in an
isolated or sandbox environment.

This is especially useful for gaining proficiency with test-driven
development,
refactoring or Mikado methods.

Or,
you can use it  to become proficient with the features of your IDEs,
source control or other tooling.

## Summary

During this article, you have:

-   Listed and described techniques and methods that facilitate the
    developer flow.
-   Listed and described general tools that facilitate the developer
    flow.

If you have followed the *Modern Application Development* series this
far,
you should have a high level idea of what a daily developer workflow
might look like,
as well as the types of principles,
practices,
methods and tools a developer might use.

## Keep Learning

- [Refactoring Large Software Systems](http://www.methodsandtools.com/archive/archive.php?id=98)
- [Docker](https://docker.io)
