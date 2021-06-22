---
title: File Access
weight: 160
layout: single
team:
 - VMware Tanzu Labs
---

Applications running in Pivotal Cloud Foundry are running inside an ephemeral container with an ephemeral virtual machine, so you can’t depend on anything sitting around on the file system permanently. This is actually a good thing because depending on shared file access can introduce unintentional shared state and coupling. Most of the time we’ll look to refactor your application away from any dependence on the underlying filesystem, passing shared data around via web service calls, publish/subscribe events, or shared caches and databases. If file access is required (as an integration pattern with an external tool or team outside of your control), PCF provides “volume services” to map network folders to the twelve-factor concept of bound services. The [volume services documentation](https://docs.pivotal.io/pivotalcf/2-2/devguide/services/using-vol-services.html) provides an overview and a demonstration app, so try running through that example to make sure volume services are available to you in your PCF environment.


