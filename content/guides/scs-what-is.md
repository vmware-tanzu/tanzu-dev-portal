---
date: '2020-05-06'
description: Discover how to use Spring Cloud Stream, a framework for building highly
  scalable, event-driven microservices connected with shared messaging systems.
lastmod: '2021-03-07'
linkTitle: Spring Cloud Stream
patterns:
- Eventing
subsection: Spring Cloud Stream
tags:
- Spring Cloud Stream
team:
- Brian McClain
title: What is Spring Cloud Stream?
topics:
- Spring
- Microservices
- Messaging and Integration
oldPath: "/content/guides/event-streaming/scs-what-is.md"
aliases:
- "/guides/event-streaming/scs-what-is"
level1: Modern App Basics
level2: Modern Development Concepts
---

Spring Cloud Stream is a framework for building highly scalable, event-driven microservices connected with shared messaging systems. Spring Cloud Stream provides components that abstract the communication with many message brokers away from the code.

## Why Is It Important?

The components that abstract away the communication with message brokers, referred to as “binders,” allow developers to focus on code that emits and consumes messages without having to write code for a specific broker. Because of this, that also means migrating from one message broker to another can be as simple as the dependencies of your code.

Since Spring Cloud Stream is a part of the Spring framework, you can easily test your code as well. Spring provides methods for running tests without the need to specifically connect to a message broker, which allows it to fit in nicely with your current CI process.

## How Does It Work?

Spring Cloud Stream introduces three main components that allow developers to utilize messaging in their code:

1. **Binder** - The component that implements communication with a specific message broker. For example, there is a RabbitMQ Binder, a Kafka Binder, and so on.
2. **Binding** - The interface for sending and receiving messages. This component links the abstract channels in your code with a topic or queue that’s handled by the binder.
3. **Message** - The data structure used to communicate with the bindings between your code and your message broker. How this data is packaged and communicated over the message broker is determined by the binder.

Consider the following scenario of an application that has one input and one output:

![img](/images/guides/spring/diagrams/scs-what-is-01.png)

In this scenario, you can see that there are two logical bindings—one for input and another for output—that communicate with the binder. The binder then handles communication with the message broker directly. All of this happens outside of your code, so rather than connecting to the broker, creating the channels, and defining how everything gets routed, Spring will abstract away as much as possible.

Out of the box, Spring Cloud Stream will automatically create channels if they don’t already exist and use auto-generated names if they aren’t provided, and will serialize your data the best it can. This is all configurable and customizable, however, and as is the case with much of Spring, it makes the best decisions that it can given the data it has.  

## How Can I Use It?

Make sure to check out [Getting Started with Spring Cloud Stream](../scs-gs) for a more in-depth walkthrough of Spring Cloud Stream, as well as this great [Quick Start doc on Spring.io](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/current/reference/html/spring-cloud-stream.html#_quick_start). Finally, you can find many code examples in the [Spring Cloud GitHub](https://github.com/spring-cloud/spring-cloud-stream-samples/).