---
title: References
weight: 200
layout: single
team:
  - VMware Tanzu Labs
---

Useful supporting documentation for students learning about cloud native
applications.

## Architecture

-   **[The app continuum](http://appcontinuum.io)** &mdash;
    Architecture to show the evolution of a distributed system starting
    from a single application and evolving into several applications and
    services.
    Also check out the [slides](http://deck.appcontinuum.io) and [code](https://github.com/barinek/appcontinuum).

-   **[Microservices](https://www.martinfowler.com/microservices/)** &mdash;
    Martin Fowler's guide of useful resources on microservices.
    Provides information on when to use microservices and how to build a
    robust distributed system.

-   **[Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)** &mdash;
    Advice on how to start and evolve a new project.

-   **[Building Microservices](https://www.amazon.com/gp/product/1491950358)** &mdash;
    Sam Newman's book on building distributed systems.

-   **[Monoliths to Microservices](https://samnewman.io/books/monolith-to-microservices/)** &mdash;
    Sam Newman's book on building distributed systems.

-   **[Bounded context](https://martinfowler.com/bliki/BoundedContext.html)** &mdash;
    Martin Fowler's take on bounded contexts with useful links to other
    sources.

-   **[Beyond the 12 Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app)** &mdash;
    This book takes you through the original [12 factors](https://12factor.net) and proposes additional guidelines to accommodate modern thinking on
    building cloud apps.

### .NET

-   **[Steeltoe Web-site](https://steeltoe.io/docs/)** &mdash;
    Open source libraries that enable .NET Core and .NET Framework apps
    to easily leverage Netflix Eureka, Hystrix, Spring Cloud Config
    Server, and Cloud Foundry services.

-   **[Evolve](https://github.com/lecaillon/Evolve)** &mdash;
    Open source migration tool that uses plain old SQL scripts.
    Its purpose is to automate your database changes, and help keep
    those changes synchronized through all your environments and
    development teams,
    making it an ideal tool for continuous integration / delivery.

-   **[Modernizing .NET Applications](https://content.pivotal.io/dotnet/modernizing-net-applications)**

-   **[Steeltoe 1.1 and the .NET Renaissance](https://content.pivotal.io/blog/steeltoe-1-1-and-the-net-cloud-native-renaissance)**

-   **[Steeltoe Turns 2.0](https://content.pivotal.io/blog/steeltoe-turns-2-0-adds-support-for-asp-net-core-2-0-credhub-and-a-sql-server-connector)**

### Open source Java frameworks

-   **[Play Framework](https://www.playframework.com/)** &mdash;
    Play is based on a lightweight, stateless, web-friendly architecture.

    Built on Akka, Play provides predictable and minimal resource
    consumption (CPU, memory, threads) for highly scalable applications.

-   **[Akka](http://akka.io/)** &mdash;
    Akka is a toolkit for building highly concurrent, distributed, and
    resilient message-driven applications for Java and Scala.

-   **[Dropwizard](http://www.dropwizard.io/)** &mdash;
    Dropwizard pulls together stable, mature libraries from the Java
    ecosystem into a simple, light-weight package that lets you focus on
    getting things done.

-   **[Metrics](http://metrics.dropwizard.io/)** &mdash;
    Metrics is a Java library which gives you unparalleled insight into
    what your code does in production.
    Metrics provides a powerful toolkit of ways to measure the behavior of
    critical components in your production environment.

-   **[Netflix OSS](https://netflix.github.io/)** &mdash;
    Spring Cloud uses components Netflix OSS to help us build robust
    distributed systems.

## Cloud Foundry

-   **[CF Developer talk](http://mjfreedman.com/assets/talk.html)** &mdash;
    Practical talk by pivot [Mik Freedman](http://mjfreedman.com)
    for app developers on Cloud Foundry.
    Served with just a touch of salt.

-   **[Diego Architecture](https://docs.cloudfoundry.org/concepts/diego/diego-architecture.html)** &mdash;
    Overview of the structure and components of Diego, the container
    management system for Cloud Foundry.

-   **[Cloud Foundry Overview](https://www.youtube.com/watch?v=7APZD0me1nU)** &mdash;
    Presentation by [Onsi Fakhouri](https://pivotal.io/team/fakhouri),
    Pivotal's VP of R&D for Cloud, on Cloud Foundry.

-   **[Diego design notes](https://github.com/cloudfoundry/diego-design-notes)** &mdash;
    Diego design notes that describe how the various components of Diego
    communicate and interrelate.

-   **[Diego Talk](https://www.youtube.com/watch?v=SSxI9eonBVs)** &mdash;
    Presentation by [Onsi Fakhouri](https://pivotal.io/team/fakhouri),
    Pivotal's VP of R&D for Cloud, about the Diego architecture.

-   **[Reenvisioning the elastic runtime](https://www.youtube.com/watch?v=1OkmVTFhfLY)** &mdash;
    Presentation by [Onsi Fakhouri](https://pivotal.io/team/fakhouri),
    Pivotal's VP of R&D for Cloud, about the new elastic runtime for Cloud
    Foundry.

-   **[Buildpacks](https://github.com/cloudfoundry-community/cf-docs-contrib/wiki/Buildpacks)** &mdash;
    Extensive list of built-in and community created buildpacks for Cloud
    Foundry.

-   **[Autoscaling](http://docs.pivotal.io/pivotalcf/appsman-services/autoscaler/using-autoscaler.html)** &mdash;
    How to use and configure the PCF autoscaler.

## Spring

-   **[Understanding Spring Boot](https://geowarin.github.io/understanding-spring-boot.html)** &mdash;
    A top-down overview of Spring Boot autoconfiguration.

-   **[Spring Boot Autoconfiguration](http://sivalabs.in/2016/03/how-springboot-autoconfiguration-magic/)** &mdash;
    A bottom-up overview of Spring Boot autoconfiguration.

-   **[Configuration Order](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config)** &mdash;
    A list of each of the ways that Spring Boot can be configured,
    ordered by precedence.

-   **[Managing Spring dependencies](https://cloudnative.tips/spring-dependency-management-539e02c306bd)** &mdash;
    A method for managing dependency versions in a distributed system
    using Spring Boot and Spring Cloud.

-   **[Spring Cloud dependency chart](https://docs.pivotal.io/spring-cloud-services/common/client-dependencies.html)** &mdash;
    Shows which versions of Spring Boot, Spring Cloud, and Spring Cloud
    Services play nicely together.
    This is vital to consult before starting or upgrading a project
    using Spring Cloud.

-   **[Local configuration](https://cloudnative.tips/configuring-a-java-application-for-local-development-60e2c9794ca7)** &mdash;
    How to configure a Java application for local development while
    ensuring that your configuration does not leak into production.

-   **[Common application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html)** &mdash;
    Overview of the various Spring properties which can be configured
    via `application.properties` or `application.yml`

## Databases

-   **[Database refactoring](http://databaserefactoring.com/)** &mdash;
    A collection of database refactoring patterns and database development
    practices to enable evolutionary database development.

-   **[SQL TDD](http://engineering.pivotal.io/post/oracle-sql-tdd/)** &mdash;
    A case study detailing how Oracle's SQL testing features were used to
    make sense of a legacy database on a Pivotal project.

-   **[SQL testing framework](http://engineering.pivotal.io/post/trilogy-the-sql-testing-framework/)** &mdash;
    SQL testing framework developed by Pivots.
    Helpful for breaking apart monolithic databases with lots of
    stored procedures, triggers, and views.
    Also see the code on [Github](https://github.com/pivotal/trilogy).

## Gradle

-   **[Gradle Java plugin](https://docs.gradle.org/current/userguide/java_plugin.html)** &mdash;
    This plugin is used on almost all Java projects build by Gradle.
    This guide contains a helpful task dependency diagram.

-   **[IntelliJ Gradle support](https://www.jetbrains.com/help/idea/gradle.html)** &mdash;
    Outlines configuration for a new Gradle project and how to preform
    common actions in an existing Gradle project.

## Git

-   **[Explain Git with d3](http://onlywei.github.io/explain-git-with-d3/)** &mdash;
    Interactive diagrams explaining many of the common actions in Git.

-   **[Try Git](http://try.github.io)** &mdash;
    Git mini-course and tutorial.

## Shell/Bash

-   **[Shell explained](https://explainshell.com/)** &mdash;
    Interactive explanations of shell commands.

## Reading list

-   **The Pragmatic Programmer: From Journeyman to Master** &mdash;
    _Andrew Hunt and David Thomas_

-   **Test Driven Development: By Example** &mdash;
    _Kent Beck_

-   **Extreme Programming Explained: Embrace Change (2nd Edition)** &mdash;
    _Kent Beck and Cynthia Andres_

-   **Design Patterns: Elements of Reusable Object-Oriented Software** &mdash;
    _Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides_

-   **Refactoring: Improving the Design of Existing Code** &mdash;
    _Martin Fowler, Kent Beck, John Brant and William Opdyke_

-   **Refactoring to Patterns** &mdash;
    _Joshua Kerievsky_

-   **Patterns of Enterprise Application Architecture** &mdash;
    _Martin Fowler_

-   **Implementing Domain-Driven Design** (1st Edition) &mdash;
    _Vaughn Vernon_

-   **Domain-Driven Design: Tackling Complexity in the Heart of Software** (1st Edition) &mdash;
    _Eric Evans_

-   **[Even more](http://www.builtincolorado.com/blog/developer-reading-list)** &mdash;
    Comprehensive reading list of software engineering books.
