---
date: '2020-04-16'
description: Explore this Spring Cloud Gateway guide to look at the code that goes
  around defining a gateway and running a gateway with a Spring Boot application.
lastmod: '2021-03-07'
parent: Spring Cloud Gateway
patterns:
- API
tags:
- Spring Cloud Gateway
team:
- Brian McClain
title: Getting Started with Spring Cloud Gateway
topics:
- Spring
- Microservices
- Messaging and Integration
oldPath: "/content/guides/spring/scg-gs.md"
aliases:
- "/guides/spring/scg-gs"
level1: Building Modern Applications
level2: Frameworks and Languages
---

Spring Cloud Gateway provides a library for building API gateways on top of Spring and Java. It provides a flexible way of routing requests based on a number of criteria, as well as focuses on cross-cutting concerns such as security, resiliency, and monitoring. For more information, make sure to check out [What is Spring Cloud Gateway?](../scg-what-is)

In this guide, you'll stand up a bare-bones gateway using Spring Cloud Gateway, which will do some light request modification. You'll see the basics of Spring Cloud Gateway, which will serve as a great foundation for those just starting out.

## Before You Begin

There are a few things you need to do before getting started with Spring Cloud Gateway:

- About 15 minutes
- Your text editor or IDE of choice
- [JDK 1.8](https://www.oracle.com/java/technologies/javase-downloads.html) or newer
- [Gradle 4+](https://gradle.org/install/) or [Maven 3.2+](https://maven.apache.org/download.cgi)

## Using Spring Cloud Gateway

Since Spring Cloud Gateway is a library built for Spring, there's no infrastructure to set up and no networking to configure. Instead, this guide will be looking at the code that goes around defining your gateway.

### Generating a New Spring Application

The easiest way to get started with a new Spring application is at [start.spring.io](https://start.spring.io/). There are a few personal choices here—such as if you'd like to use Maven or Gradle—but for the sake of consistency, here are the settings used in this guide:

**Project**: Maven Project  
**Language**: Java  
**Spring Boot**: 2.2.5  
**Project Group**: com.vmware  
**Project Artifact**: scg-getting-started

Finally, you'll just need one dependency for our application:

- Gateway

Click "Generate" and you'll download a zip file of the generated code.

### Building Your Gateway

You can configure a basic route by creating a method that takes in a `RouteLocatorBuilder` and returns a `RouteLocator`. Here's an example of `src/main/java/com/vmware/scgettingstarted/ScgGettingStartedApplication.java` complete with a custom route:

```java
package com.vmware.scggettingstarted;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ScgGettingStartedApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScgGettingStartedApplication.class, args);
	}

	@Bean
	public RouteLocator myRoutes(RouteLocatorBuilder builder) {
		return builder.routes()
			.route(p -> p
				.path("/get")
				.filters(f -> f.addRequestHeader("Hello", "World"))
				.uri("http://httpbin.org:80"))
			.build();
	}
}
```

Take note of the `myRoutes` method. This code will create a route that will take any `GET` request, add a header named `Hello` and a value of `World`, then forward your request to httpbin.org.

### Run Your Gateway

You can run this as a normal Spring Boot application:

`./mvnw spring-boot:run`

Once running, you can send a request to your application to ensure it's running at [http://localhost:8080/get](http://localhost:8080/get). Say your request looks like the following:

```
> GET /get HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.65.3
> Accept: */*
> MyHeader: MyValue
```

You've sent a `GET` request to your application, adding a custom header of `MyHeader` with a value of `MyValue`. Spring Cloud Gateway will return the following response (note that the body of the response is from httpbin.org, which is providing a breakdown of the request that it received):

```
< HTTP/1.1 200 OK
< Date: Fri, 06 Mar 2020 14:22:54 GMT
< Content-Type: application/json
< Content-Length: 471
< Server: gunicorn/19.9.0
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Credentials: true

{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "0", 
    "Forwarded": "proto=http;host=\"localhost:8080\";for=\"127.0.0.1:58158\"", 
    "Hello": "World", 
    "Host": "httpbin.org", 
    "Myheader": "MyValue", 
    "User-Agent": "curl/7.65.3", 
    "X-Forwarded-Host": "localhost:8080"
  }, 
  "origin": "127.0.0.1", 
  "url": "http://localhost:8080/get"
}
```

Here you can see the response from httpbin.org, including the `MyHeader` header that you sent in your request, as well as the `Hello` header that Spring Cloud Gateway added to your request.

## Keep Learning

Check out some of the great guides on the Spring website to learn how you can leverage the amazing Spring ecosystem to accomplish things like [hiding your backend services](https://spring.io/blog/2019/07/01/hiding-services-runtime-discovery-with-spring-cloud-gateway) as well as how you can [secure your services using Spring Cloud Security](https://spring.io/blog/2019/08/16/securing-services-with-spring-cloud-gateway).