---
title: Caching
weight: 120
layout: single
team:
 - VMware Tanzu Labs
---

Caching can be made available in many forms, from large vendor-specific externalized clusters to caching libraries that cache in-memory within the application itself. While moving to a platform such as Cloud Foundry (TAS) or Kubernetes, caching's most prominent interaction is with the elastic and ephemeral nature of the application deployment. Application deployments can come and go at random and scale from zero to hundreds of instances. It conditions the way applications cache data.

Suppose the app using the cache assumes that it is the only one to read or write from it, or the particular caching solution cannot handle the coming and going of individual clients easily. In that case, we will look to move a more straightforward solution using Redis and Spring Caching.

If your app does not currently use a caching layer, we might introduce one to mitigate the app's assumption that it is the only one ever doing this job. Caching can be an easy way to share a simple state between app instances, replacing global application state or session data with a more robust cloud-native solution.

If your app interacts with a caching layer now, take a look through the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide to get an idea how we will use Spring Boot's abstraction layer over the various solution during the engagement.


#### Homework

- [x] Run through the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide
