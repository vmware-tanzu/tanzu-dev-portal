---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: What are Microservices?
subsection: What are Microservices?
tags:
- Microservices
- Spring
- Kubernetes
featured: true
title: What is Microservices Architecture?
weight: 1
oldPath: "/content/guides/microservices/what-is-microservices-architecture.md"
aliases:
- "/guides/microservices/what-is-microservices-architecture"
level1: Modern App Basics
level2: DevOps Practices
description: What it means to build modern applications
---

Microservices are a modern architectural pattern for building an application. A microservices architecture breaks up the functions of an application into a set of small, discrete, decentralized, goal-oriented processes, each of which can be independently developed, tested, deployed, replaced, and scaled.

## The Value of Microservices

Because microservices are small, discrete application components linked together through lightweight, well-defined APIs, they can be linked together in various ways to create modern applications with independently scalable modules. A major advantage of this application architecture is that discrete components can be updated independently, which enables developers to efficiently deliver new features and fix issues with existing ones. The business value of this approach is clear; you can deliver new digital applications and services with greater speed and efficiency.

### Simple Microservices Example

Consider a three-tier app that has a front end, a middle app tier, and a database. Traditionally, this app might be deployed in three different virtual machines. In a microservices architecture, the same app is broken into multiple components. For example, the front end could be broken into separate `services` that individually handle _login, catalog, services, feedback,_ etc.

The middle tier might be broken into `services` that handle _authorization, database connections, metering,_ etc.

With this modular approach, you can push an update to the _Catalog Page_  without having to touch or update any of the login or database functionality.

### Key Characteristics of Microservices

Here are some of the key technical aspects of microservices:

* __Strong and clear interfaces__ – Tight coupling between services should be avoided. Documented and versioned interfaces provide a certain degree of freedom for both the consumers and producers of services.
* __Independently deployed and managed__ – It should be possible for a single microservice to be updated without synchronizing with all the other services. It is also desirable to be able to roll back a version of a microservice easily. This means the binaries that are deployed must be forward and backward compatible both in terms of API and any data schemas. 
* __Built-in resilience__ – Microservices should be built and tested to be independently resilient. If one microservice requires a response from another, it  should strive to continue working and do something reasonable in the event the other microservice is down or misbehaving. Similarly, every microservice should have defenses with respect to unanticipated load and bad inputs.

Dividing a new or existing application into the right set of microservices can be a tricky thing to get right. Natural boundaries such as languages, async queues, and scaling requirements can serve as useful dividers.

## Keep Learning

Microservices, coupled with containers, are becoming the architectural pattern of choice for developing new applications. The architecture breaks up the functions of an application into a set of small, discrete, decentralized, goal-oriented processes, each of which can be independently developed, tested, deployed, replaced, and scaled. 

Here's a video by a former Netflix architect that gives you the lowdown on using a microservices architecture for building next-generation applications. 

{{< youtube 4ClmJxVz1SM >}}

The guide [Deconstructing the Monolith](/guides/microservices/deconstructing-the-monolith/) discusses how to break a monolithic application down into microservices. After you are comfortable with the concepts, our [microservices workshop](/workshops/lab-microservice/) can help you get started [building microservices](/topics/building-modern-applications) using Spring.