---
date: '2021-09-13'
description: Look at different technologies that help with the technical complexity
  and technical debt when building and running microservices at scale.
lab: lab-booternetes
lastmod: '2021-09-13'
length: 30
summary: Look at different technologies that help with the technical complexity and
  technical debt when building and running microservices at scale.
tags:
- Spring
- Microservices
- Kubernetes
- Spring Boot
title: Spring Booternetes
team:
- Josh Long
weight: 3
---

When we talk about cloud native computing, it refers not to any single technology but more to an approach that optimizes for frequent and fast releases, and the speed of iteration. Faster organizations learn and grow faster. There are many work queues for each new production release, which must be done and take wall-clock time. Some things like integration and integration testing must happen serially, after all the contributions to the codebase settle, while other work may be done concurrently. The smaller the size of the codebase, the more quickly all the serialized work finishes. The goal is to do as much work in parallel and reduce the amount of serialized work to reduce wall-clock time between releases. Microservices, with their smaller codebases and smaller teams, reduce the wall-clock time between having an idea and seeing it deployed into production.

Microservices are not without costs.

In the world of microservices, the rare work (tedium!) of addressing nonfunctional requirements like security, rate limiting, observability, routing, containers, virtual machines, and cloud infrastructure has become an ongoing struggle that bedevils every new microservice.

Microservices introduce a lot of the complexity implied in building any distributed system. Things will fail in production at sufficient scale. In this workshop, you're going to look at different technologies that let us pay down some of the technical complexity and technical debt of scale:

- Reading and writing data to a SQL database
- Reactive Streams, a standard for asynchronous stream processing with nonblocking backpressure
- An edge service—the first port-of-call, the first stop en route to the final destination—for requests destined for the downstream endpoint
- Spring Cloud Gateway to build an API gateway with
- Micrometer for observability
- Spring Boot Actuator for checking application health
- Buildpacks to transform application source code into images that can run on any cloud
- Deploying and running in Kubernetes


