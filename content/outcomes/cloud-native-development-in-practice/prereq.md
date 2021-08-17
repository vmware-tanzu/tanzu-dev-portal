---
title: Prerequisites
weight: 4
layout: single
team:
  - VMware Tanzu Labs
---

Before you start,
you need to decide how you will use this course:

1.  You want to review the contents,
    but not do the labs.
    If this is the case,
    proceed to the
    [Introduction](../intro/).

1.  You want to do the labs

If you want to do the labs,
it will be up to you to set up or acquire environments in which to
run the labs.

This section lists the prerequisites and caveats.

## Practitioner

While this course is designed at a 200 level,
it requires you to implement solutions with a minimum level of
prescribed instructions.

If you choose to do the labs,
the following knowledge is required:

- Java Development
- Bash shell navigation
- Navigating a Java IDE
- Ability to search the web to find technical answers

If you are coming from Windows and are PowerShell literate,
you will likely be able to navigate the Bash shell commands,
or translate to PowerShell if you choose to run the labs on Windows
PowerShell rather than Bash.

If you have no experience with terminals or Java,
you will struggle to get through the labs.

## Tanzu Application Services Foundation

You will need a Tanzu Application Services (TAS)
Foundation where you will deploy your applications.

If you work for an organization that runs TAS foundations,
reach out to the Platform Operations Teams that maintain them to get
access to a foundation used for development or training use only.

The following are requirements you can communicate to your operations
team:

Bare Minimum:

-   Java build pack that supports Java version 11
-   TAS *user*.
-   A dedicated *space*,
    where the *user* has *space developer* role for that *space*,
    with ability to push, scale and delete applications,
    as well as ability to reserve, map, unmap, and delete routes within
    that *space*.

Desired:

-   MySQL Tile (MySQL Service broker) for the labs including and after
    the [Backing Services and Database Migrations lab](../database-migrations/).
    If the service broker is not available,
    inquire about how your organizations platforms consume databases.
    You may be able to use
    [User Provided Services](https://docs.cloudfoundry.org/devguide/services/user-provided.html)
    method instead.
-   SSH tunneling enabled for the *Configure a Spring Boot App* and
    *Database Migrations* labs
-   Container-to-container networking enabled - for the
    *Service Discovery* lab.

## Development Workstation

Following are the tools you need to run the labs:

-   Git command line client:
    If you are using GUI clients,
    beware the lab instructions will use the command line.

-   Bash shell:
    MacOS or Linux preferred,
    but Windows Subsystem for Linux (WSL) should work OK too.

-   A Java Interactive Development Environment (IDE):
    IntelliJ is preferred, but Eclipse and Visual Studio Code with
    Java and Spring extensions should work fine too.

-   Java Development Kit version 11

-   Docker:
    Will be used to run a load injector,
    and may also be used to run MySQL on local workstation.

-   MySQL Server 8+:
    You can run MySQL locally,
    but running via docker will likely be more convenient installation.

-   TAS command line client `cf` cli

-   Flyway command line

## Workstation image

You can also run a Linux desktop from a virtual machine using
Virtual Box,
Vagrant,
or even run on Amazon via a published *Amazon Machine Image*.