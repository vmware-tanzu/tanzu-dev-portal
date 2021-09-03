---
date: '2021-01-29'
lastmod: '2021-01-29'
linkTitle: Spring Boot Actuator
parent: Spring Boot
patterns:
- Observability
tags:
- Spring Boot Actuator
title: Custom Health Checks Using Spring Boot Actuator
topics:
- Spring
weight: 1
oldPath: "/content/guides/spring/spring-boot-actuator.md"
aliases:
- "/guides/spring/spring-boot-actuator"
level1: Managing and Operating Applications
level2: Metrics, Tracing, and Monitoring
---

[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html) provides insight into the Spring environment for applications running in production. Actuator includes a number of built-in endpoints allowing you to monitor and interact with your application. 

One important endpoint is `/health`.  It provides an indication of the general health of your application and will check the health of each of the `@Component` classes that implement the `HealthIndicator` interface. All standard components (such as `DataSource`) implement this interface by default.  

## Adding a Custom Check

You can create a custom health check for app components that Spring does not cover by creating a class that uses the `HealthIndicator` interface and annotating it with `@Component` to pull it into the Spring context.  The following code includes examples that do health checks against a cache, a data source, and a remote (SOAP or REST) service:

```java
@Override
public Health health() {
    // check cache is available
    Cache cache = cacheManager.getCache("mycache");
    if (cache == null) {
        LOG.warn("Cache not available");
        return Health.down().withDetail("smoke test", "cache not available").build();
    }

    // check db available
    try (Connection connection = dataSource.getConnection()) {
    } catch (SQLException e) {
        LOG.warn("DB not available");
        return Health.down().withDetail("smoke test", e.getMessage()).build();
    }

    // check some service url is reachable
    try {
        URL url = new URL(resUrl);
        int port = url.getPort();
        if (port == -1) {
            port = url.getDefaultPort();
        }

        try (Socket socket = new Socket(url.getHost(), port)) {
        } catch (IOException e) {
            LOG.warn("Failed to open socket to " + resUrl);
            return Health.down().withDetail("smoke test", e.getMessage()).build();
        }
    } catch (MalformedURLException e1) {
        LOG.warn("Malformed URL: " + resUrl);
        return Health.down().withDetail("smoke test", e1.getMessage()).build();
    }

    return Health.up().build();
}
```

Implementing a custom health check class this way is preferred to adding code directly to a smoke test controller, as it takes full advantage of the Actuator framework. Spring Boot Actuator’s health check functionality allows you to monitor the status of your running applications. It can be integrated with monitoring software to alert you when a production system misbehaves or goes down. 

## Learn More
To find out more about Spring Boot Actuator’s production monitoring capabilities, refer to the following resources:

* [Prometheus and Grafana: Gathering Metrics from Spring Boot on Kubernetes](/guides/spring/spring-prometheus/)

* [Production Ready Spring Boot Applications (video)](/tv/spring-live/0041/)

* [Save Your Stack: Build Cloud Native Apps with Spring, Kubernetes and Cassandra (blog)](/blog/save-your-stack-build-cloud-native-apps-with-spring-kubernetes-and-cassandra/)