---
title:  "Spring Cloud Gateway: What Is It?"
sortTitle: "Spring Cloud Gateway"
weight: 1
featured: true
topics:
- spring
- microservices
- messaging-and-integration
tags:
- spring-cloud-gateway
patterns:
- api
---

Spring Cloud Gateway provides a library for building API Gateways on top of Spring and Java. It provides a flexible way of routing requests based on a number of criteria, as well as focuses on cross cutting concerns such as security, resiliency, and monitoring.

## Why Is It Important? 

An API Gateway can help simplify the communication between a client and a service, whether that be between a user's web browser and a server miles away, or between a frontend application and the backend services that it relies on.

Consider the scenario where you have a web application that relies on three backend services. As each of those services are updated, experience instability, or even have the network between them becomes unstable, your web application will need to know where all three services are and what to do if those services move or go down.

An API Gateway allows you to implement the complexity separately from the client, moving that responsibility from user-side to server-side. All the client needs to know is how to talk to the gateway. It doesn't matter if the backend services move, go offline, or become unstable so long as the gateway knows how to handle these situations.

As luck would have it, Spring Cloud Gateway benefits from the entirety of the Spring ecosystem. Even better, the Spring ecosystem has done a lot of work to handle this sort of complexity. From security to stability to monitoring, the Spring ecosystem can do a lot for you and your API Gateway.

## How Does It Work? 

As mentioned, Spring Cloud Gateway is a library for building an API Gateway, so it just looks like another Spring Boot application. If you're a Spring developer today, you'll find that it's very easy to [get started with Spring Cloud Gateway](/guides/spring/spring-cloud-gateway/scg-gs) in as little as just a few lines of code.

Spring Cloud Gateway is intended to sit between a requester and a resource that's being requested, intercepting, analyzing, and modifying every request. First this means that you can route requests based on their context. Did a developer include a header indicating an API version? We can route that request to the appropriately versioned backend. Does the request require sticky sessions? The gateway can keep track of each user's session, even if your backend can't.

Since every request is going through your gateway, this means that you get a few extras on top of simple routing. In fact, since your gateway is just another Spring Boot application, you have access to the entire Spring ecosystem. 

[Spring Cloud](https://spring.io/projects/spring-cloud) allows developers to implement things such as distributed configuration, service registration, load balancing, the circuit breaker pattern, and much more. It provides these tools to implement many common patterns in distributed systems.

[Spring Cloud Security](https://cloud.spring.io/spring-cloud-security) allows you to lock down access to your backend services. Since all requests are going through your gateway, that security propagates to all of your services sitting behind that gateway. For example, you can enable Single Sign-On with your gateway and then control which role each route requires a user to have. This can be as granular as needed, requiring different roles for different scenarios such as GET vs POST requests, different paths, or even different parameters in the request.

[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html) allows developers to easily emit metrics to their monitoring platform of choice. Out of the box, Spring ships with many actuators that you can use to monitor any Java application. Additionally, it's easy to create your own metrics to keep an eye on specific cases as needed. For example, you could record each time a route is hit to see trends over time, or measure the latency of each request.

## How Can I Use It?

Check out our guide on [Getting Started With Spring Cloud Gateway](/guides/spring/spring-cloud-gateway/scg-gs), as well as the [great content on spring.io](https://spring.io/projects/spring-cloud-gateway).
