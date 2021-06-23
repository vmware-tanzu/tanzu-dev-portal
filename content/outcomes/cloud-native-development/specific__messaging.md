---
title: Messaging
weight: 170
layout: single
team:
 - VMware Tanzu Labs
---

Event-driven applications are a natural fit for microservices, reducing the coupling between services even further and allowing the whole system to move from central orchestration to distributed asynchronous choreography. If your application currently uses a messaging solution such as IBM MQ, RabbitMQ, Apache ActiveMQ, or Apache Kafka, the first step will be to update your application to connect to these services using Spring beans similar to working with database connections. When possible, we will also look to simplify the messaging aspects of the application codebase using Spring Cloud Stream (SCS).

Even when your application does not currently use some form of pub/sub, we will often modernize towards asynchronous communication between your microservices using Spring Cloud Stream and RabbitMQ. With the RabbitMQ tile available in TAS, it is straightforward to introduce a messaging layer of communication and there many benefits to doing so. Read through the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) and [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) guide for SCS to get a feel for working with the library.


#### Homework

- Read the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing)

- Read the [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-introducing) guide for Spring Cloud Stream

