---
title: Containers as the Artifact
weight: 3
layout: single
team:
- Craig Tracey
---
Traditional models of software delivery often view software artifacts from the
lens of the stack that the code has been developed in. The language used
typically dictates how code is packaged. Java has JARs, Python wheels, and Ruby
gems. But, the list goes on an on, each framework bringing with it it's own type
of artifact.

Unforunately, each of these package types does not encompass the full colelction
of dependencies for an application. To execute Java, Python, or Ruby code, a
server must be equipped, minimally, with the runtime that will launch the
application. In the case of other languages (ie. Go), we may be able to get much
closer to a complete software artifact because these this code is [statically
linked](https://en.wikipedia.org/wiki/Static_library). But, still, this does not
include all of the components necessary to run this application. For example,
statically linkedin Go binaries still have a dependency on glibc.

One of the goals of a secure software supply chain is to ensure that we can
reproduce our builds with ease. Another is that we have a complete understanding
of the application's dependency graph. That includes all of the
language-specific libraries and modules, transitive dependencies, as well as any
system-level requirements.

In order to solve for this need, many organizations turned to
application-specific virtual machines. In this case, application teams would be
allocated a collection of virtual machines that would then be configured to run
their code. Often this involved levaraging infrastrcuture-as-code frameworks
such as Ansible, Chef, or Puppet. While these tools helped to achieve this goal,
they introduced a number of drawbacks as well.

First, while configuration management makes the job of configuring systems
trivial, it becomes far more difficult when you'd like to host multiple
applications on a single virtual machine. How can we ensure that the dependency
requirements for application A do not collide with application B? When
application A changes, or its deployment is somehow altered, what effect with
that have on the other applications colocated on the same virtual machine?
Sometimes this is trvial, but more often it becomes a difficult web of
dependencies to untangle. This eventually yields a complex system that is hard
to manage.

## Containers As the Artifact

If we, again, consider some of the problems we need to solve for when
implementing a secure supply chain, we will land on a few hard requirements:
- Dependencies are well understood, and are specific to the application's needs
- Different applications will have different dependency needs and these /needs
  should remain isolated from other applications
- Ideally, the application has no dependencies from external sources (ie. the
  host, network, etc)

Under this lens, containers represent a solution for these needs. They allow us
to deliver code to an unknown, and perhaps even unmanaged host, complete with
all of the dependencies required to operate the application. There is no
requirement that a specific Python version is installed on the host, or even a
concern that this code may not be able to operate colocated with other
applications. The container image contains all that is needed to operate this
application, and we have very good assurances that this code will run
irrespective of the machine that it is launched from.

Given that containers seem to meet many of the requirements for a secure
software supply chain, the container should become the new software artifact for
your pipelines. By focusing on the container over the application-specifc
artifact, we will be enabled to build more a more robust software pipeline.  The
container will provide adequate dependency isolation and allow us to maintain a
standard auditable artifact across all appliction types. With this audit
capability we will be able to have full assurance reagrding what has made it to
production, whether the application is susceptible to security concerns, and if
there are security concerns, a clear mechanism by which to remediate these
problems.