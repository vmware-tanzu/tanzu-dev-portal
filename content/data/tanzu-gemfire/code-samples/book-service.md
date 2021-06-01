---
title:  "Node.js - Book Service"
description: >
    Provides a simple book-serving app which uses the data service as a system of record. 

repo: https://github.com/gemfire/node-examples
type: samples
---

This Node.js example provides a simple book-serving app which uses the data service as a system of record. REST endpoints allow an app user to look up books by ISBN or put new books into the service.

This app can be run with a local Apache Geode or Tanzu GemFire cluster, or with a Tanzu GemFire for VMs service instance. A common development path runs locally first to iterate quickly on feature development prior to pushing the app to a TAS environment to run with Tanzu GemFire for VMs cluster. This app has been tested with Tanzu GemFire for VMs version 1.8.1.