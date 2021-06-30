---
title: File Access
weight: 160
layout: single
team:
 - VMware Tanzu Labs
---

Applications running in VMware Tanzu Application Service live inside a temporary container with an ephemeral virtual machine, so you cannot depend on anything sitting around on the file system permanently. This is a good thing because dependencies on shared file access can induce unintentional shared state and coupling. Most of the time, we will look to refactor your application away from any dependence on the underlying filesystem, passing shared data around via web service calls, publish/subscribe events, or shared caches and databases. However, if file access is required (as an integration pattern with an external tool or team outside of your control), TAS provides “volume services” to map network folders to the twelve-factor concept of bound services. The [volume services documentation](https://docs.pivotal.io/application-service/2-11/devguide/services/using-vol-services.html) provides an overview, and a demo app, so try to run through that example to make sure volume services are available to you in your TAS environment.


#### Homework

- Run through the [example to use an external file system](https://docs.pivotal.io/application-service/2-11/devguide/services/using-vol-services.html).

