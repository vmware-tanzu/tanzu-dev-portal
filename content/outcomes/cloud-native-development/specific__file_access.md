---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: File Access
weight: 160
---

Applications running in VMware Tanzu Application Service live inside a temporary container with an ephemeral virtual machine. This means items are not permanently kept by the file system. This is good because dependencies on shared file access can induce unintentional shared state and coupling. Most of the time, we aim to refactor an application away from any dependence on the underlying filesystem, passing shared data around via web service calls, publish/subscribe events, or shared caches and databases.

However, if file access is required (as an integration pattern with an external tool or team outside of your control), TAS provides "volume services" to map network folders to the twelve-factor concept of bound services. The [volume services documentation](https://docs.pivotal.io/application-service/2-11/devguide/services/using-vol-services.html) provides an overview, and a demo app for you to review to ensure volume services are available to you in your TAS environment.


#### Homework

- Read the [example to use an external file system](https://docs.pivotal.io/application-service/2-11/devguide/services/using-vol-services.html).