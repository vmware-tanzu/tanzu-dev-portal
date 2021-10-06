---
date: '2021-04-22'
description: 'Using Spring Cloud Gateway to manage API requests rate. '
lastmod: '2021-04-22'
tags:
- API
- Spring
- Spring Cloud Gateway
- Spring Boot
- Spring Cloud
- Rate Limiting
team:
- Haytham Mohamed
title: API Rate Limiting with Spring Cloud Gateway
---

One of the imperative architectural concerns for software architects is to protect APIs and service endpoints from harmful events such as denial-of-service attacks, cascading failures, or overuse of resources. Rate limiting is a technique used to control the rate by which an API or a service is consumed, which in turn can protect you from these events that can bring your services to a screeching halt. In a distributed system, no better option exists than to centralize configuring and managing the rate at which consumers can interact with APIs. Only those requests within a defined rate would make it to the API. Any more would return an HTTP 429 (“Too Many Requests”) error.

![An example how a gateway between the consumer and an API can help limit the number of requests the API is serving](images/rate-limit-1.svg#diagram)

[Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) is a simple and lightweight component that can be used to limit API consumption rates. In this post, I am going to demonstrate how easily that can be accomplished using a configuration method. As shown in the figure below, the demonstration consists of both a front- and backend service, with a Spring Cloud Gateway service in between.

![The gateway can sit between the frontend and the backend to help manage the traffic between the two](images/backend-gateway-frontend.svg#diagram)

No code whatsoever is needed to include the Spring Cloud Gateway in the architecture. You need instead to include the Spring Boot Cloud dependency `org.springframework.cloud:spring-cloud-starter-gateway` in a vanilla Spring Boot application, then you’ll be set to go with the appropriate configuration settings.

Requests received by Spring Cloud Gateway from a frontend service can be routed to a backend service based on a configured route definition, which makes clear to the gateway how a request should be routed to a backend endpoint. A route configuration usually defines conditions based on information that can be extracted from HTTP requests, such as paths and headers.

For example, the snippet below lists a YAML stanza to configure the condition under which requests should be routed to a backend service; it shows that requests should target the backend service when the gateway is hit with “/backend” in the path. In the configuration, the route is given an identifier and the backend service URL.

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route1
          uri: http://localhost:8081
          predicates:
            - Path=/backend
```

`RequestRateLimiter` is one of the many gateway filters offered by Spring Cloud Gateway; it determines whether a request is allowed to proceed or has exceeded its limit. It also lets you (optionally) plug in a key to limit the number of requests to different services. While implementing how to resolve a key is customizable, the gateway comes with one that leverages a user’s `Principal` name. A secured gateway is needed to resolve a user’s principal name, but you have the option to implement the `KeyResolver` interface to instead resolve a different key from the `ServerWebExchange`. You can point to a custom `KeyResolver` bean (e.g., named `customKeyResolver`) in the configuration by using a `SPEL #{@customKeyResolver}` expression. The following listing shows the `KeyResolver` interface:

```java
public interface KeyResolver {
    Mono<String> resolve(ServerWebExchange exchange);
}
```

The gateway would deny requests if no key was resolved. To let the gateway accept a missing resolved key, you can set the following property:

```
spring.cloud.gateway.filter.request-rate-limiter.deny-empty-key=false
```

You can also specify a status code that the gateway should report when it cannot figure out a key by setting the following property:

```
spring.cloud.gateway.filter.request-rate-limiter.empty-key-status-code=
```

Consider a blueprint architecture in which a gateway controls the limiting of API consumption by using Redis. The provided Redis implementation uses the token bucket algorithm. To enable its use, you need to include the `spring-boot-starter-data-redis` Spring Boot starter dependency in the gateway application. Basically, the token bucket algorithm uses balance tokens as a way to maintain an accumulating budget of utilization. The algorithm assumes tokens will be added to a bucket at a certain rate while calls to an API consume the tokens from the bucket. One API invocation may perform many operations in order to compose a response so that it fulfills a request (think of GraphQL-based APIs). In such cases, the algorithm helps Spring Cloud Gateway recognize that one invocation may cost an API more than one token.

![An example of how Redis can be used to keep track of how many requests are being sent to the backend, which can work together with the gateway](images/redis-rate-limiting.svg#diagram)

The provided Redis implementation lets you define the request rate at which users can make calls within a certain time period. It also makes it possible to accommodate sporadic demands while constrained by the defined consumption rate. For example, a configuration can define a replenish rate of 500 requests per second by setting the `redis-rate-limiter.replenishRate=500` property and a burst capacity of 1,000 requests per second by setting the `redis-rate-limiter.burstCapacity=1000` property. Doing so limits consumption to 500 requests every second. If a burst in the number of requests occurs, only 1,000 requests are allowed. However, since this exceeds our defined limit of 500 requests per second, the gateway won’t route the other 500 requests until the next second. The configuration also lets you define how many tokens a request would cost by setting the property `redis-rate-limiter.requestedTokens`. Typically, it is set to one.

To use a gateway with a request limiting feature, it needs to be configured with the `RequestRateLimiter` gateway filter. The configuration can specify arguments to define a replenish rate, burst capacity, and the number of tokens that a request costs. The example below illustrates how to configure a gateway with these arguments:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route1
          uri: http://localhost:8081
          predicates:
            - Path=/backend
          filters:
          - name: RequestRateLimiter
            args:
              redis-rate-limiter.replenishRate: 500
              redis-rate-limiter.burstCapacity: 1000
              redis-rate-limiter.requestedTokens: 1
```

Spring Cloud Gateway provides the flexibility to define your own custom rate limiter implementation; it offers a `RateLimiter` interface to implement and define a bean. The rate limiter bean can be configured by using a [SPEL](https://docs.spring.io/spring-integration/reference/html/spel.html) expression, as in the case of a custom key resolver. For instance, you can define a custom rate limiter bean named `customRateLimiter` and a custom key resolver named `customKeyResolver` and configure a route like this:

```java
@Bean
public KeyResolver customKeyResolver {
	return exchange -> ....  // returns a Mono of String
}
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: route1
          uri: http://localhost:8081
          predicates:
            - Path=/backend
          filters:
          - name: RequestRateLimiter
            args:
              rate-limiter: "#{customRateLimiter}"
              key-resolver: "#{customKeyResolver}"
```

You can find the code to try it yourself on [GitHub](https://github.com/Haybu/blog-spring-cloud-gateway/tree/rate-limiting). If you’re interested in learning more about Spring Cloud Gateway, make sure to check out our [What is Spring Cloud Gateway](/guides/spring/scg-what-is/) and [Getting Started with Spring Cloud Gateway](/guides/spring/scg-gs/) guides!