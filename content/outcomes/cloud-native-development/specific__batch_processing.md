---
title: Batch Processing
weight: 150
layout: single
team:
 - VMware Tanzu Labs
---

There are many reasons your app might be running batch jobs, so there’s a number of ways we might tackle this during the engagement. For simple scheduled activity tightly-coupled to the app itself, [Spring Scheduler](https://spring.io/guides/gs/scheduling-tasks/) provides the simplest solution to set up a method for performing periodic work.

If a job needs more control or will benefit from moving it into its own atomic deployable unit to leverage the platform, we’ll look to Spring Batch and Spring Cloud Task to work at a higher level of abstract. Both of these work great with Spring Cloud Data Flow, so we’ll gradually move towards that as we introduce more and more batch jobs that require oversight and orchestration. Spring Cloud Task provides a [Getting Started](https://docs.spring.io/spring-cloud-task/docs/2.0.0.RELEASE/reference/htmlsingle/#getting-started) guide in the docs, so if managing multiple jobs sounds like a part of your application go ahead and run through that section so you’re prepared to talk through using Task and SCDF during the engagement.


#### Homework

- [x] Run through the [Spring Scheduler guide](https://spring.io/guides/gs/scheduling-tasks/) 

- [x] Run through the [Spring Cloud Task Getting Started guide](https://docs.spring.io/spring-cloud-task/docs/2.0.0.RELEASE/reference/htmlsingle/#getting-started) 


