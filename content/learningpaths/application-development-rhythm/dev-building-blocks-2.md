---
title: Building Blocks, Part 2
weight: 40
layout: single
team:
- VMware Tanzu Labs
oldPath: "/content/outcomes/application-development-rhythm/dev-building-blocks-2.md"
aliases:
- "/outcomes/application-development-rhythm/dev-building-blocks-2"
tags: []
---
This article is the fourth in a five-part series.

A healthy *Developer Rhythm* starts with a disciplined workflow.
The only way you can successfully achieve this type of workflow
is to learn how to use modern developer tools much in the same
way that a carpenter has to learn how to use the tools of their trade.

Developers who implement features or fixes in software
like to move quickly, safely, and sustainably.
The methods, techniques and tools in this article ensure
that new developers are also able to accomplish these
goals.

![Methods, Tools, Techniques](/images/outcomes/application-development-rhythm/dev-building-blocks-tools.jpg)

## What You Will Learn

In this article, you will learn to:

- List and describe techniques and methods that facilitate the developer flow.
- List and describe general tools that facilitate the developer flow.

## Methods and Techniques

### Private Branch Method

Distributed Source Code Version Systems like *Git* or *Mercurial*
allow you to work independently from the team source control repository.

To get started, copy the complete repository,
including the full commit history to your workstation.

Next, create a new local history.
Update the local history,
then merge it back to the team source control repository.

Now, create private (local) branches using the distributed source control local
branching feature.

Private branches make it easy for you to track new
and updated work in feedback loops that are not yet
merged in your team source control repository.

If there is a file in your local branch that you do
not want to keep, you can remove it.
For example, you can take out an experiment that did not work from the
local branch,
before merging the local branch to the team source control repository.

Update the version history at the end of the
feedback loop phase of the workflow so that it is a single,
curated,
well described commit that specifies the purpose of the
change,
that is merged to the team source control repository.

### Refactoring Technique

As previously mentioned,
a main principle of software development is making code easy to change.
As a codebase becomes more complex,
developers will have to restructure it to accommodate new features.

[Refactoring](https://www.refactoring.com/) is the process of changing
the structure of a codebase without changing its behavior.
Refactoring is a technique that is straightforward but also
extremely complex.

### Mikado Method

The
[Mikado Method](https://www.methodsandtools.com/archive/mikado.php)
is a formal implementation of a feedback loop that is well-suited for
complex work requiring discovery of the next step.
It contains a distinct process of setting a goal,
performing experiments,
visualizing the goal,
and achieving the goal.
It also includes the steps for *undoing* or reverting from failed
experiments.

The Mikado Method is commonly used in combination with refactoring and
test-first practices.

### Rubber Duck Debugging Technique

If you work on a remote team or in an organization where you cannot pair,
you might be lonely,
especially *when you get stuck*.
Sometimes,
you will get stuck in a problem,
with no other developers to consult.

Should this happen to you, try using the
[Rubber Duck Debugging](https://rubberduckdebugging.com/)
method to see if you can get unstuck.

## Middleware, Databases, Platforms

You need a place to run your software applications,
and a place to store the software applications data.
This is necessary for your production apps,
but not necessary for your development environments.

As of the authoring of this article, there are
two popular learning trends that support the
modern platforms where most new applications
run today.

- Virtualization technologies
- Container technologies (like Docker)

## Developer Tools

These are the class of tools developers can choose that best fit their
projects and work.
Notice that there are no specific tools recommended.
You will need to figure that out based on your team needs.

One suggestion is to start with the most minimal possible toolset,
and add more sophisticated tools, as needed.

It's always a good idea to start with a minimal developer
toolset because:

-   It is more important for you to focus on solving problems
    than on using tools.
    It's up to you to keep the tools you are not using
    out of the way.

-   More complex tools may hide key details that you are
    unaware of, but need to know as a developer.

### Languages, Compilers, Build tools

These tools are the root, technical, building blocks upon which
your software is built.

You may work in an organization that lets you pick the
technologies for your products.
If not, your choice could be restricted by:

- The platforms where your software is run.
- The tools your organization chooses for you.

### Frameworks

*[Software Frameworks](https://en.wikipedia.org/wiki/Software*framework)*
are common tools in a developer's toolkit that sheds some of the burden of
software development.
When you use a framework,
it is important to understand the mechanics and workings
of the framework during software runtime.
One area to be aware of is a particular framework hiding
implementation or software runtime details.

See [Spring Framework](https://spring.io/projects/spring-framework) for an example in the Java ecosystem.

### Interactive Development Environment

*Interactive Development Environment* (IDE) is a popular
developer tool for writing software that you can also use to.

- Debug software.
- Integrate source control system clients.
- Write documentation.
- Orchestrate a developer’s workflow (in some cases).

Some IDEs are modular,
meaning they can be extended and customized for a particular developer
workflow.
As a developer, always keep your development environments streamlined and
clean.
Take the time to understand how the IDEs work,
and how they interact with the language interpreters,
compilers and build systems.

[Visual Studio Code](https://code.visualstudio.com/)
is an example of a lightweight,
cross language IDE,
but there are many best-in-breed tools to choose from in your language
ecosystem.

### Accelerators

*Accelerators* are specialized tools used at specific points in the
development workflow,
typically at the beginning of a new project.

Accelerators provide cross-cutting concerns to codebases
that are standards for your organization,
frameworks you choose,
or perhaps to facilitate working in a secure path to production.

See [Spring Initializr](https://start.spring.io/)
as an example of a new project accelerator in the
Java/Spring ecosystem.

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
refactoring or the Mikado Method.

Or,
you can use it  to become proficient with the features of your IDEs,
source control or other tooling.

## Summary

After reading this article, you can now:

-   List and describe techniques and methods that facilitate the
    developer flow.
-   List and describe general tools that facilitate the developer
    flow.

If you have followed the *Modern Application Development* series this
far,
you now have a high level idea of what a daily developer workflow
might look like,
as well as the types of principles,
practices,
methods and tools a developer might use.

## Keep Learning

- [Refactoring Large Software Systems](http://www.methodsandtools.com/archive/archive.php?id=98)
- [Docker](https://docker.io)
