---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Spring Ecosystem
weight: 30
---

We rely heavily on the [open-source ecosystem of Spring projects](https://spring.io/) to replace vendor- or container-specific technologies or proprietary solutions for Java-based applications. There are many specific tools and frameworks under that banner. For development projects, we leverage two prerequisite frameworks providing us a lightweight core with standard functionalities: [Spring Boot](https://spring.io/projects/spring-boot) and [Spring Cloud](http://projects.spring.io/spring-cloud/).

## Spring Boot

Spring Boot provides a "convention over configuration" foundation for Spring-based applications. Follow [this guide](https://spring.io/guides/gs/spring-boot/) to build a simple, RESTful web service using Spring Boot and minimal configuration.

## Spring Cloud

[Spring Cloud](http://projects.spring.io/spring-cloud/) provides a set of abstractions and integrations that enable best practice cloud native behavior. Later, we will cover the actual implementation details for common tasks like externalizing configuration in a [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/reference/html/#_spring_cloud_config_server), using service discovery, API gateways, and other route services.

To better understand what you have in your tool belt before we get started, take some time to become familiar with the basic concepts of each framework, found in the introductions of the following documentation.

* [Part 1: Cloud Native Applications](https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_cloud_native_applications)
* [Part 2: Spring Cloud Config](https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_spring_cloud_config)
* [Part 3: Spring Cloud Netflix](https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_spring_cloud_netflix) 
* [Part 4: Spring Cloud Stream](https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_spring_cloud_stream)

#### Homework

- Use [this guide](https://spring.io/guides/gs/spring-boot/) to build a simple RESTful web service using Spring Boot and minimal configuration.
- Read through the introductions for the most common Spring Cloud components.