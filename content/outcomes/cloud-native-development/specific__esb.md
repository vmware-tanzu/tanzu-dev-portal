---
title: Enterprise Service Bus
weight: 140
layout: single
team:
 - VMware Tanzu Labs
---

Enterprise Service Buses (ESB) provide an orchestration layer for the many moving parts of an application portfolio. Aimed at enabling separation of concerns through a service orientated architecture along with a feature-rich stack of integrations, this well-intentioned technology often became a monolith layer itself with apps tightly coupled to a specific ESB implementation and difficult-to-test paths through the whole system.

Replacing an ESB is less common in a replatforming engagement unless you are explicitly trying to replatform away from a given vendor. When this comes up, Spring provides [Spring Integration](https://spring.io/projects/spring-integration) as a mature lower-level library of common integration patterns and adapters. Spring integration is a large and complex library to understand, and we will help you work through the bits that are important to solve your problems if we find it is the right tool for the job. You can run through the [Integrating Data](https://spring.io/guides/gs/integration/) guide to getting a quick idea of how the project fits into the overall Spring ecosystem.

Another newer option builds on top of [Spring Integration](https://spring.io/projects/spring-integration) and [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) to provide a high-level abstraction for weaving multiple microservices and batch processes together. As it provides more extensive functionalities and covers a range of data processing use cases, [Spring Cloud Data Flow](https://spring.io/projects/spring-cloud-dataflow) is often the best choice to outright replace an ESB. However, it is more complex to get running and requires some additional components to manage the state of your pipelines. You can run through [this Baeldung guide](https://www.baeldung.com/spring-cloud-data-flow-stream-processing) to understand how it addresses similar use cases but differs in its execution from Spring Integration.


#### Homework

- Run through the [Integrating Data](https://spring.io/guides/gs/integration/) guide to getting some experience with Spring integration.

- Run through the [Baeldung guide to Spring Cloud Data Flow](https://www.baeldung.com/spring-cloud-data-flow-stream-processing).

