---
date: '2021-01-29'
lastmod: '2021-03-26'
linkTitle: Spring Batch
patterns:
- API
tags:
- Spring Batch
- Spring
- Microservices
title: Creating Batch Microservices with Spring Batch
weight: 1
oldPath: "/content/guides/spring/spring-batch.md"
aliases:
- "/guides/spring/spring-batch"
level1: Building Modern Applications
level2: Frameworks and Languages
---

A batch microservice is a short-lived process that launches as the result of some trigger (typically a clock), or that is executed on demand. While *batch processing* may seem like a holdover from another era, it is still used widely for all kinds of asynchronous transaction and file processing workloads such as extract, transform, and load (ETL). Data science makes use of batch processing for the training of AI models and other asynchronous tasks.

This article highlights how three Spring projects (along with Spring Boot) support building batch microservices: Spring Batch, Spring Cloud Task, and Spring Cloud Data Flow.

* **Spring Batch** is a minimalistic framework to run batch processing applications.
* **Spring Cloud** Task is a wrapper allowing you to run short-lived microservices using Spring Cloud along with Spring Boot.
* **Spring Cloud Data Flow** allows you to build composed tasks orchestrating Spring Batch jobs as Spring Cloud Tasks. This allows the decomposition of a batch job into reusable parts that can be independently tested, deployed, and orchestrated at a level higher than a single job and reused in different workflows.

All three frameworks are complementary.

## Spring Batch

[Spring Batch](https://spring.io/projects/spring-batch) provides reusable functions that are essential in processing large volumes of records, including logging/tracing, transaction management, job processing statistics, job restart, skip, and resource management. It also provides more advanced technical services and features that will enable extremely high-volume and high-performance batch jobs through optimization and partitioning techniques. Simple as well as complex, high-volume batch jobs can leverage the framework in a highly scalable manner to process significant volumes of information. 

For more details, see also:

* [Cloud Native Batch Processing](/tv/spring-live/0007/) (video)
* [The Domain Language of Batch](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html) 

## Spring Cloud Task 

[Spring Cloud Task](https://docs.spring.io/spring-cloud-task/docs/2.3.0-M1/reference/)  supports the development of short-lived microservices. In general, these perform simple tasks on demand and then terminate. Batch applications are one example where short-lived processes are useful. 

Spring Cloud Task allows a user to develop and run short-lived microservices using Spring Cloud and run them locally, in the cloud, or with Spring Cloud Data Flow. Just add `@EnableTask` and run your app as a Spring Boot app (single application context). 

Spring Cloud Task records the lifecycle events of a given task. The lifecycle consists of a single task execution. This is a physical execution of a Spring Boot application configured to be a task (annotated with the `@EnableTask` annotation).

Spring Cloud Task requires a SQL database, for a `TaskRepository`, similar to the Spring Batch `JobRepository`. The following databases are supported:

 * H2
 * HSQLDB
 * MySql
 * Oracle
 * Postgres
 * SqlServer

If you are new to Spring Cloud Task:
* Read the [Getting Started](https://docs.spring.io/spring-cloud-task/docs/current/reference/#getting-started) docs. 
* Review [Code Samples](https://github.com/spring-cloud/spring-cloud-task/tree/master/spring-cloud-task-samples)

## Spring Cloud Data Flow 

[Spring Cloud Data Flow](https://spring.io/projects/spring-cloud-dataflow) (SCDF) supports microservice-based Streaming and Batch data processing for Cloud Foundry and Kubernetes. It provides tools to create complex topologies for streaming and batch data pipelines. The data pipelines consist of Spring Boot apps, built using the Spring Cloud Stream or Spring Cloud Task microservice frameworks. Spring Cloud Data Flow supports a range of data processing use cases, from ETL to import/export, event streaming, and predictive analytics. SCDF’s [BatchScheduler](https://dataflow.spring.io/docs/feature-guides/batch/scheduling/) supports scheduling batch jobs at a set time or in response to an event. 

## Learn More 

Along with the links in this guide, the following videos provide a good introduction to batch processing and related topics:

* [Cloud Native Batch Processing](/tv/spring-live/0007/) 
* [Data Processing With Spring - Day 1](/tv/springone-tour/0007/)
* [Data Processing With Spring - Day 2](/tv/springone-tour/0008/)