---
title: Messaging
weight: 170
layout: single
team:
 - VMware Tanzu Labs
---

Event-driven applications are a natural fit for microservices, reducing the coupling between services even further and allowing the whole system to move from central orchestration to distributed choreography. If your application currently uses a messaging solution such as IBM MQ, RabbitMQ, or AMQP, the first step will be to update your application to connect to these services using Spring beans similar to working with database connections. When possible, we’ll also look to simplify the messaging aspects of the application codebase using Spring Cloud Stream.
Even when your application doesn’t currently use some form of pub/sub, we’ll often modernize towards this kind of communication between your microservices using Spring Cloud Stream and RabbitMQ. With the RabbitMQ tile available in PCF, this becomes a straightforward way to introduce a messaging layer of communication and there are a lot of benefits to doing so. Read through the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.RELEASE/reference/htmlsingle/#spring-cloud-stream-overview-introducing) and [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.RELEASE/reference/htmlsingle/#_quick_start) guide for SCS to get a feel for working with the library.


#### Homework

- [x] Read the [Introduction](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.RELEASE/reference/htmlsingle/#spring-cloud-stream-overview-introducing)

- [x] Read the [Quick Start](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.RELEASE/reference/htmlsingle/#_quick_start) guide for Spring Cloud Stream

