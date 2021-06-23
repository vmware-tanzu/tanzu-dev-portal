---
title: API Gateway
weight: 150
layout: single
team:
 - VMware Tanzu Labs
---

An API gateway provides a way to route all traffic to one service before it reaches a different one, allowing you to create a central service that provides cross-cutting functionality like authentication and authorization, policy enforcement, or data transformation. It is also a great way to provide an aggregation service that collects data from a bunch of lower-level services and transforms the data into something needed by a particular client (say, a bandwidth-constrained mobile app). Combined with TAS’s route services, these can be powerful ways to add layered functionality across many of your apps, and that power increases as you break up your apps into individual microservices - you gain the benefit of centrally implemented functionalities while leveraging the benefits of decoupled independent systems.

There are many commercial and open-source options for this - the former includes Apigee and the public cloud IaaS native solutions. The latter includes options such as Netflix Zuul and Spring Cloud Gateway (SCG). If your company has not standardized on a commercial option, we will introduce Spring Cloud Gateway in use cases that make sense to implement at this layer. Run through the "[Building a Gateway](https://spring.io/guides/gs/gateway/)" guide to craft your first API gateway with SCG.


#### Homework

- <input type="checkbox"> Run through the [Building a Gateway](https://spring.io/guides/gs/gateway/) guide
