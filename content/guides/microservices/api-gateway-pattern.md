---
date: '2021-01-29'
lastmod: '2021-02-05'
linkTitle: API Gateway Pattern
patterns:
- API
tags:
- API
title: Applying the API Gateway Pattern
topics:
- Spring
- Microservices
oldPath: "/content/guides/microservices/api-gateway-pattern.md"
aliases:
- "/guides/microservices/api-gateway-pattern"
level1: Building Modern Applications
level2: Microservice Patterns
---

In a microservices architecture, you may have multiple types of front-end clients communicating with back-end services. These clients could include mobile applications, web applications, or third-party applications. The back end may be composed of many different services exposed over various protocols (SOAP+XML, REST+HTTP, JMS, AMQP, WebSocket, etc.). Clients may collect data from multiple services. In some cases, these services may come from legacy applications,  and each application may have its own way of handling security.

The question is, how do you minimize the number of client requests to the back end and how do you secure requests  for services that may have been originally designed for a different type of client?


## API Gateway Pattern

In many microservices implementations, public services are exposed to clients through an API gateway. Internal microservice endpoints are not exposed to clients, they are kept private.
There are a number of reasons for this approach:

1. Only a select set of microservices are required by clients.
2. It is difficult to implement client-specific transformations at the service endpoint.
3. To avoid multiple client calls in a bandwidth-restricted environment, a gateway can perform data aggregation on behalf of the client. 
4. The number of service instances and their locations may change dynamically.

The API gateway pattern (sometimes referred to as “backend for frontend” or BFF) offers client-specific APIs (e.g. mobile, tablet, etc.) with protocol translation between a web-friendly client front-end and back-end services—such as a message queue or database—with a single point of entry (and control) into the set of exposed services. In other words, the client communicates with one or more API gateways that broker services for the client, rather than communicating directly with the services.


## Strengths and Weakness of the API Gateway Pattern
With the API Gateway pattern, the client only has to know the URL of one server, and the backend can be refactored at will with no change to the client, a significant advantage. 

There are other advantages in terms of centralization and control: rate limiting, authentication, auditing, and logging can all be implemented in the gateway. The API Gateway can also act as a simple routing layer to deal with canary-based deployments or A/B testing scenarios.

### Strengths
* Clients are isolated from the partitioning of the microservice architecture behind the gateway.
* Clients do not have to know the locations of specific services.
* If there are client-specific policies to be applied, it is easy to apply them in a single place rather than in multiple places. An example of such a scenario is the cross-origin access policy.
* The optimal API is provided for each client.
* The number of requests/round-trips is reduced.
* It simplifies the client implementation by moving the aggregation logic into the API gateway.

### Drawbacks
* The API gateway is one more moving part to be managed in your microservices architecture, increasing complexity.
* Response time is increased compared to direct calls, because of the additional network hop through the API gateway.
* There is a danger of implementing too much logic in the aggregation layer, slowing performance.
* The gateway is a potential single point of failure and has to be managed accordingly. An alternative is to create multiple API gateways, one for each front end, reducing the size of the failure domain.

## Keep Learning
An API Gateway allows you to tailor microservices to client needs while simplifying communications between client and service, keeping the client separated from the complexity involved in service delivery. 

For Java and Spring developers, Spring Cloud Gateway makes it simple to implement an API gateway. Based on the Spring Cloud Gateway project, it provides a simple, effective way to route API traffic.  See the guides: [What is Spring Cloud Gateway?](/guides/spring/scg-what-is/) and [Getting Started with Spring Cloud Gateway](/guides/spring/scg-gs/) to learn more. Also, be sure and check out [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) and [Spring Cloud Security](http://cloud.spring.io/spring-cloud-security/spring-cloud-security.html) on Spring.io for more related information.

To learn about APIs in the Spring environment, check out [Building an API with Spring Boot](/guides/spring/spring-build-api/).