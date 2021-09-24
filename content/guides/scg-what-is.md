---
date: '2020-04-16'
description: Discover the basics and importance of Spring Cloud Gateway, a library
  for building API gateways on top of Spring and Java.
lastmod: '2021-03-23'
linkTitle: Spring Cloud Gateway
patterns:
- API
subsection: Spring Cloud Gateway
tags:
- Spring Cloud Gateway
- Spring
- Microservices
- Messaging and Integration
team:
- Brian McClain
title: What is Spring Cloud Gateway?
oldPath: "/content/guides/spring/scg-what-is.md"
aliases:
- "/guides/spring/scg-what-is"
level1: Building Modern Applications
level2: Frameworks and Languages
---

Spring Cloud Gateway provides a library for building API gateways on top of Spring and Java. It provides a flexible way of routing requests based on a number of criteria, as well as focuses on cross-cutting concerns such as security, resiliency, and monitoring.

## Why Is It Important? 

An API gateway can help simplify the communication between a client and a service, whether that be between a user's web browser and a server miles away, or between a frontend application and the backend services that it relies on.

Consider a scenario in which you have a web application that relies on three backend services. As each of those services are updated, experience instability, or have the network between them become unstable, your web application will need to know where all three services are and what to do if those services move or go down.

An API gateway allows you to implement the complexity separately from the client, moving that responsibility from user side to server side. All the client needs to know is how to talk to the gateway. It doesn't matter if the backend services move, go offline, or become unstable so long as the gateway knows how to handle these situations.

As luck would have it, [Spring Cloud Gateway](https://tanzu.vmware.com/content/blog/microservices-essentials-getting-started-with-spring-cloud-gateway) benefits from the entirety of the Spring ecosystem. Even better, the Spring ecosystem has done a lot of work to handle this sort of complexity. From security to stability to monitoring, the Spring ecosystem can do a lot for you and your API gateway.

## How Does It Work? 

Spring Cloud Gateway is a library for building an API gateway, so it looks like any another Spring Boot application. If you're a Spring developer, you'll find it's very easy to [get started with Spring Cloud Gateway](../scg-gs) with just a few lines of code.

Spring Cloud Gateway is intended to sit between a requester and a resource that's being requested, where it intercepts, analyzes, and modifies every request. That means you can route requests based on their context. Did a developer include a header indicating an API version? We can route that request to the appropriately versioned backend. Does the request require sticky sessions? The gateway can keep track of each user's session, even if your backend can't.

Since every request is going through your gateway, you get a few extras on top of simple routing. In fact, since your gateway is just another Spring Boot application, you have access to the entire Spring ecosystem. 

[Spring Cloud](https://spring.io/projects/spring-cloud) allows developers to implement things such as distributed configuration, service registration, load balancing, the circuit breaker pattern, and more. It provides these tools to implement many common patterns in distributed systems.

[Spring Cloud Security](https://cloud.spring.io/spring-cloud-security) allows you to lock down access to your backend services. Since all requests are going through your gateway, that security propagates to all of your services that are sitting behind that gateway. For example, you can enable single sign-on (SSO) with your gateway and then control which role each route requires a user to have. This can be as granular as it needs to be, including requiring different roles for different scenarios such as GET vs POST requests, different paths, or even different parameters within the request itself.

[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html) allows developers to easily emit metrics to their monitoring platform of choice. Out of the box, Spring ships with a variety of actuators that you can use to monitor any Java application. Additionally, it's easy to create your own metrics to keep an eye on specific cases as needed. For example, you could record each time a route is hit to see trends over time, or measure the latency of each request.

## How Can I Use It?

Check out our guide on [Getting Started With Spring Cloud Gateway](../scg-gs), as well as the [great content on spring.io](https://spring.io/projects/spring-cloud-gateway).