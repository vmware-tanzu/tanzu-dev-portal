---
date: '2021-05-28'
description: 'Provides a simple book-serving app which uses the data service as a
  system of record. '
lastmod: '2021-05-28'
repo: https://github.com/gemfire/node-examples
title: Node.js - Book Service
type: samples
---

This Node.js example provides a simple book-serving app which uses the data service as a system of record. REST endpoints allow an app user to look up books by ISBN or put new books into the service.

This app can be run with a local Apache Geode or VMware GemFire cluster, or with a VMware GemFire for Tanzu Application Service service instance. A common development path runs locally first to iterate quickly on feature development prior to pushing the app to a TAS environment to run with VMware GemFire for Tanzu Application Service cluster. This app has been tested with VMware GemFire for Tanzu Application Service version 1.8.1.