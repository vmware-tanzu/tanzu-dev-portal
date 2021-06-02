---
title:  "Spring for Apache Geode"
subsection: Spring for Apache Geode
subsection-parent-page: true
type: data-guides

description: Utilizing the auto-configuration of Spring Boot with Tanzu GemFire and Apache Geode.
weight: 1


---

Utilizing the auto-configuration of Spring Boot with Tanzu GemFire/Apache Geode.  The [Spring Boot for Apache Geode documentation](https://docs.spring.io/spring-boot-data-geode-build/current/reference/html5/) further discusses the details of many of these topics.

## Version Compatibility
The best way to determine the correct version of Spring Boot for Apache Geode for your project, is to use [start.spring.io](https://start.spring.io/).

After selecting your project settings, click on 'Add Dependencies'. Search for 'Geode' and add it to your project. Then select either ‘Generate’ which create a zip file to import into your IDE or ‘Explore’ which will open a build file based on your Project selection (Maven or Gradle)

You can also refer to the [Spring Boot for Apache Geode compatibility matrix](https://github.com/spring-projects/spring-boot-data-geode/wiki/Spring-Boot-for-Apache-Geode-and-Pivotal-GemFire-Version-Compatibility-Matrix#version-compatibility-matrix). 

## Guides

- [Getting Started Locally](/data/tanzu-gemfire/guides/get-started-locally-sbdg/): A guide to help get your local development environment up and running.
- [Getting Started with Tanzu GemFire on TAS](/data/tanzu-gemfire/guides/get-started-tgf4vms-sbdg/): A guide to help set up a Tanzu GemFire for VMs service instance on the Tanzu Application Service.
- [Getting Started with Tanzu GemFire for Kubernetes](/data/tanzu-gemfire/guides/get-started-tgf4k8s-sbdg/): A guide to help set up a  Tanzu GemFire instance on Kubernetes.
- [Cache-Aside Pattern](/data/tanzu-gemfire/guides/cache-aside-pattern-sbdg): Use the Cache Aside pattern with your Spring Boot application to improve your applications performance.
- [Session State Caching](/data/tanzu-gemfire/guides/session-state-cache-sbdg): This guide walks you through how to implement a session state cache using Tanzu GemFire, Spring Boot for Apache Geode, and Spring Session.

  