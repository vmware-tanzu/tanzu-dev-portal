---
title: API Gateway
weight: 150
layout: single
team:
 - VMware Tanzu Labs
---

An API gateway provides a way to route all traffic to one service before it reaches a different one. This allows you to create a central service that provides cross-cutting functionality like authentication and authorization, policy enforcement, or data transformation. The API gateway also provides an aggregation service that collects and transforms data from lower-level services into something needed by a particular client (for example, a bandwidth-constrained mobile app). 

When combined with TAS [route services](https://docs.pivotal.io/application-service/2-11/services/route-services.html), an API gateway is a powerful way to add layered functionality across many of your apps. As you break up apps into individual microservices, the power increases and you gain the benefit of centrally implemented functionalities while leveraging the benefits of decoupled independent systems.

There are many commercial and open-source options for this - the former includes Apigee and the public cloud IaaS native solutions. The latter includes options such as [Netflix Zuul](https://github.com/Netflix/zuul) and [Spring Cloud Gateway (SCG)](https://spring.io/projects/spring-cloud-gateway). Unless your company is using a different commercial option, we're going to use Spring Cloud Gateway in this engagement, for use cases that make sense to implement at this layer. 

Go to the "[Building a Gateway](https://spring.io/guides/gs/gateway/)" guide to learn how to craft your first API gateway with SCG.


#### Homework

- Read the [Building a Gateway](https://spring.io/guides/gs/gateway/) guide.
