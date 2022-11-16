---
date: '2021-04-07'
description: Utilizing the auto-configuration of Spring Boot with VMware GemFire and
  Apache Geode.
lastmod: '2021-05-28'
subsection: Spring for VMware GemFire
subsection-parent-page: true
title: Spring for VMware GemFire
type: data-guides
weight: 1
aliases:
  - spring-for-apache-geode/
---

Utilizing the auto-configuration of Spring Boot with VMware GemFire.  The [Spring Boot for Apache Geode documentation](https://docs.spring.io/spring-boot-data-geode-build/current/reference/html5/) further discusses the details of many of these topics.

## Version Compatibility
The best way to determine the correct version of Spring Boot for Apache Geode for your project, is to use [start.spring.io](https://start.spring.io/).

After selecting your project settings, click on 'Add Dependencies'. Search for 'Geode' and add it to your project. Then select either ‘Generate’ which create a zip file to import into your IDE or ‘Explore’ which will open a build file based on your Project selection (Maven or Gradle)

You can also refer to the [Spring Boot for Apache Geode compatibility matrix](https://github.com/spring-projects/spring-boot-data-geode/wiki/Spring-Boot-for-Apache-Geode-and-Pivotal-GemFire-Version-Compatibility-Matrix#version-compatibility-matrix). 

## Guides

- [Getting Started Locally](/data/gemfire/guides/get-started-locally-sbdg/): A guide to help get your local development environment up and running.
- [Getting Started with VMware GemFire for TAS](/data/gemfire/guides/get-started-tgf4vms-sbdg/): A guide to help set up a VMware GemFire for Tanzu Application Service service instance on the Tanzu Application Service.
- [Getting Started with VMware GemFire for Kubernetes](/data/gemfire/guides/get-started-tgf4k8s-sbdg/): A guide to help set up a  VMware GemFire instance on Kubernetes.
- [Session State Caching](/data/gemfire/guides/session-state-cache-sbdg): This guide walks you through how to implement a session state cache using VMware GemFire, Spring Boot for Apache Geode, and Spring Session.