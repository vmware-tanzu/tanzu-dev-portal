---
title: Messaging
weight: 170
layout: single
team:
 - VMware Tanzu Labs
---

Event-driven applications are a natural fit for microservices as they reduce the coupling between services even further and allow for the whole system to move from central orchestration to distributed asynchronous choreography. 

If your application currently uses a messaging solution such as IBM MQ, RabbitMQ, Apache ActiveMQ, or Apache Kafka, the first step is to update your application to connect to these services using Spring beans that are similar to working with database connections. We'll also simplify the messaging aspects of the application codebase using Spring Cloud Stream (SCS) whenever possible.

Even if your application currently does not use some form of pub/sub, we'll often modernize towards asynchronous communication between your microservices using Spring Cloud Stream and RabbitMQ. With the RabbitMQ tile available in TAS, it is straightforward to introduce a messaging layer of communication. There are many benefits for doing it this way. 

Read the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) and [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) guide for SCS to get a feel for working with the library.


#### Homework

- Read the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing).

- Read the [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) guide for Spring Cloud Stream.

