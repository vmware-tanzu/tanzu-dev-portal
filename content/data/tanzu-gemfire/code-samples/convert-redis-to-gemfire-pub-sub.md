---
title:  "Spring - Convert Spring Data Redis Pub-Sub to Tanzu GemFire"
description: >
    This example highlights the changes necessary for switching to SBDG for a Spring Data Redis publish/subscribe app.

repo: https://github.com/gemfire/spring-for-apache-geode-examples
type: samples
weight: 5
---

The projects in this directory illustrate a Spring Boot application that creates a publish and subscribe channel with either Redis or Tanzu GemFire. In this guide, we will highlight the changes necessary for switching from Spring Data Redis to Spring Boot for Apache Geode using a publish/subscribe application.

In the Tanzu GemFire example, a `Region` will represent the equivalent of a `PatternTopic` as defined in the Redis example.