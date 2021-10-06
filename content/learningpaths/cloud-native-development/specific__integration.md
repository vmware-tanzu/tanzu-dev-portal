---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Enterprise Integration
weight: 140
oldPath: "/content/outcomes/cloud-native-development/specific__integration.md"
aliases:
- "/outcomes/cloud-native-development/specific__integration"
tags: []
---

Enterprise integration middleware are software systems that offer services to link and integrate separate applications. They cover many use cases and domains like transaction processing, distributed computing, message broker, data access systems, or Enterprise Service Buses (ESB).

Enterprise Service Buses provide an orchestration layer for the many moving parts of an application portfolio. Aimed at enabling separation of concerns through a service orientated architecture along with a feature-rich stack of integrations, this well-intentioned technology often becomes a monolith layer with apps tightly coupled to a specific ESB implementation and difficult-to-test paths through the whole system.

Replacing an ESB is less common in a [replatforming project](https://tanzu.vmware.com/replatforming) unless you are explicitly trying to replatform away from a given vendor. When this occurs, Spring provides [Spring Integration](https://spring.io/projects/spring-integration) a mature lower-level library of common integration patterns and adapters. Spring integration is a large, complex library to understand. Working through the bits that are important to solve your problems is key to find the right tools for the job. Read the [Integrating Data](https://spring.io/guides/gs/integration/) guide for an idea of how the project fits into the overall Spring ecosystem.

Another, newer option builds on top of [Spring Integration](https://spring.io/projects/spring-integration) and [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) to provide a high-level abstraction for weaving multiple microservices and batch processes together. As it provides more extensive functionalities and covers a range of data processing use cases, [Spring Cloud Data Flow](https://spring.io/projects/spring-cloud-dataflow) is often the best choice to replace an ESB. However, it is more complex to get running and requires additional components to manage the state of your pipelines. Read [this Baeldung guide](https://www.baeldung.com/spring-cloud-data-flow-stream-processing) to understand how it addresses similar use cases but differs in its execution from Spring Integration.


## Homework

- Read the [Integrating Data](https://spring.io/guides/gs/integration/) guide to getting some experience with Spring integration.
- Read the [Baeldung guide to Spring Cloud Data Flow](https://www.baeldung.com/spring-cloud-data-flow-stream-processing).