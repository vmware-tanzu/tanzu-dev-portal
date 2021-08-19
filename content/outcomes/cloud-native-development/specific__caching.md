---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Caching
weight: 120
---

Caching is available in many forms, ranging from large vendor-specific externalized clusters to caching libraries that cache in-memory within the application itself. There are so many choices, including (sorted alphabetically): [Caffeine](https://github.com/ben-manes/caffeine), [Ehcache](https://www.ehcache.org), [GemFire](https://tanzu.vmware.com/gemfire), [Hazelcast](https://hazelcast.com/), [Infinispan](https://infinispan.org/), [Java Caching System (JCS)](https://commons.apache.org/proper/commons-jcs/), [JCache](https://www.baeldung.com/jcache), [JetCache](https://github.com/alibaba/jetcache), [Memcached](https://memcached.org/), [Redis](https://redis.io/), [Spring Cache](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache), and many more.

While moving to a platform such as Tanzu Application Services (TAS) or Kubernetes, caching's most prominent interaction is with the elastic and ephemeral nature of the application deployment. Application deployments can come and go at random, and scale from zero to hundreds of instances. It conditions the way applications cache data to become truly stateless.

If your app does not currently use a dedicated caching layer, we might introduce an external cache to turn the application stateless. Caching can be an easy way to share a simple state between app instances, centralizing a global application state or session data in a cloud native ecosystem.

In cases where the caching solution assumes it has only one client (read and write) or cannot handle multiple clients, we could consider moving to [Redis](https://redis.io/) and [Spring Caching](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache) to scale efficiently.

If your app already interacts with a caching layer, refer to the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide to get an idea of how you could use Spring Boot's abstraction layer.

## Homework

- Read the [Caching Data with Spring](https://spring.io/guides/gs/caching/) guide.