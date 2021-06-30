---
title: Telemetry
weight: 190
layout: single
team:
 - VMware Tanzu Labs
---

One of the additional three factors introduced in "[Beyond the Twelve-Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app)" includes telemetry. Developing your application is only the first aspect of a cloud native developer's job. Feedback from real users hitting your app deployed in production is where you can learn and improve your app.

Spring Boot provides a bunch of automatic health monitoring and metrics through the [Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html) and [Micrometer](https://micrometer.io/) projects. 

With these included in your Spring Boot app, you get automatic embedded monitoring and reporting in the application, with many extension points for adding custom health indicators and other metrics. Run through the [Spring Actuator guide to build a RESTful web service](https://spring.io/guides/gs/actuator-service/), or add actuators to one of the applications you have already crafted as part of this guide.

#### Homework

- Run through the [Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/) guide.

