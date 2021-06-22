---
title: Caching
weight: 120
layout: single
team:
 - VMware Tanzu Labs
---

Caching can come in many forms, from big vendor-specific externalized clusters to caching libraries that cache in-memory within the application itself. During a move to a platform such as PCF, caching’s biggest interaction is with the elastic and ephemeral nature of the app - because an application instance can come and go at random, and include one or a hundred instances, the application has to interact with the cache with that knowledge in place. If the app uses the cache assuming its the only one to read or write from it, or the particular caching solution can’t handle the coming and going of individual clients easily, we’ll look to move a more straightforward solution using Redis and Spring Caching.

If your app doesn’t currently use a caching layer, we might introduce one in order to mitigate the app’s assumption that it’s the only one ever doing its job. A cache can be an easy way to share simple state between app instances, replacing global application state or session data with a more robust cloud-native solution.
If your app interacts with a caching layer now, take a look through the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide to get an idea of how we’ll use Spring Boot’s abstraction layer over the various solution during the engagement.


#### Homework

- [x] Run through the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide
