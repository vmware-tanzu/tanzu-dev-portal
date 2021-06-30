---
title: Batch Processing
weight: 150
layout: single
team:
 - VMware Tanzu Labs
---

The Java ecosystem provides a variety of libraries and standards helping you to define and launch batch processes: [Java EE batch processing](https://www.baeldung.com/java-ee-7-batch-processing), [Quartz Job Scheduler](http://www.quartz-scheduler.org/), [Cron Utils](https://github.com/jmrozanec/cron-utils), [Easy Batch](https://github.com/j-easy/easy-batch) ... Alone using Spring, there are numerous lightweight ways to schedule and run batch jobs. 

For simple, scheduled activity tightly coupled to the app itself, [Spring Scheduler](https://spring.io/guides/gs/scheduling-tasks/) provides the simplest solution to set up a method for performing periodic work.

If a job needs more control or will benefit from moving it into its own atomic deployable unit to leverage the platform, we will look to Spring Batch and Spring Cloud Task (SCT) to work at a higher level of abstraction. Both of these work great with Spring Cloud Data Flow (SCDF), so we will gradually move towards that as we introduce more and more batch jobs that require oversight and orchestration. Spring Cloud Task provides a "[Getting Started](https://docs.spring.io/spring-cloud-task/docs/current/reference/htmlsingle/#getting-started)" guide in the docs, so if managing multiple jobs sounds like a part of your application, go ahead and run through that section, so you are prepared to talk through using Task and SCDF during the engagement.

#### Homework

- Run through the [Spring Scheduler guide](https://spring.io/guides/gs/scheduling-tasks/) 

- Run through the [Spring Cloud Task Getting Started guide](https://docs.spring.io/spring-cloud-task/docs/current/reference/htmlsingle/#getting-started) 


