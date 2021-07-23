---
date: '2021-05-25'
lastmod: '2021-06-15'
layout: single
team:
- Marc Zottner
title: Exposing Prometheus Metrics from Java
weight: 3
---

The [Micrometer](https://micrometer.io/) library is a popular way to expose
application metrics to a service like Prometheus.

## Adding Dependencies

To add the Micrometer dependency for Prometheus with Maven:

```xml
<dependencies>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <version>${micrometer.version}</version>
    </dependency>
</dependencies>
```

If you're using Gradle instead:

```gradle
dependencies {
    implementation 'io.micrometer:micrometer-registry-prometheus:latest.release'
}
```

{{% aside title="Dependencies" %}}
See the
[releases page](https://github.com/micrometer-metrics/micrometer/releases) for
the latest version.
{{% /aside %}}

With the correct dependencies in place, you're ready to expose metrics.

## Exposing Metrics

For exposing application metrics, you have two options:

- if you're writing a Java application without using a framework, you must
  expose the endpoint yourself
- if you're using Spring Boot, you can ad the
  [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready)
  dependency to your application

### Using Vanilla Java

The following example uses the JDK's `com.sun.net.httpserver.HttpServer` to
expose a `/prometheus` endpoint. The `PrometheusMeterRegistry` contains a
`scrape()` function, which can supply the metric data to Prometheus. All you
need to do is wire the function to an endpoint.

```java
PrometheusMeterRegistry prometheusRegistry =
    new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);

try {
    HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
    server.createContext("/prometheus", httpExchange -> {
        String response = prometheusRegistry.scrape(); (1)
        httpExchange.sendResponseHeaders(200, response.getBytes().length);
        try (OutputStream os = httpExchange.getResponseBody()) {
            os.write(response.getBytes());
        }
    });

    new Thread(server::start).start();
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

### Using Spring Boot

First, update the scope and remove the version of the
`micrometer-registry-prometheus` dependency. Then add the
`spring-boot-starter-actuator` dependency to your project.

Maven:

```xml
<dependencies>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

Gradle:

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    runtimeOnly 'io.micrometer:micrometer-registry-prometheus'
}
```

Next, enable the Prometheus actuator endpoint. At the time of writing, you must
add `prometheus` to the list of exposed Spring Boot Actuator endpoints. Your
endpoint configuration might look like the following:

```
management.endpoints.web.exposure.include: info, health, prometheus
```

This exposes metrics at the `/actuator/prometheus` endpoint.

## References

- [Spring Boot Actuator: Production-ready Features](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready)
  — Spring Boot reference documentation about Actuator
- [Exposing Actuator Endpoints](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-exposing-endpoints)
  — provides more information about exposing Spring Boot actuator endpoints