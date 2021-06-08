---
title: Request/Response Logging in a Spring Boot Application
linkTitle: Request/Response Logging
parent: Spring Boot
weight: 2
topics:
- Spring
tags:
- Logging
- Spring Boot
- Observability
patterns:
- Observability
oldPath: "/content/guides/spring/request-response-logging.md"
aliases:
- "/guides/spring/request-response-logging"
---

Logging is essential for monitoring and troubleshooting running applications. This guide explains how to utilize `logback` to collect full request/response payloads in a Spring Boot application. 

## Getting Started
To begin, you create a Maven Project Object Model to enable `logback`. A Project Object Model or `POM` is an XML file that contains information about the project and configuration details. Below is a sample specifying the required dependencies.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
    <logback.version>1.2.3</logback.version>
</properties>
<dependencies>
    <dependency>
        <groupId>net.rakugakibox.spring.boot</groupId>
        <artifactId>logback-access-spring-boot-starter</artifactId>
        <version>2.7.1</version>
    </dependency>
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-access</artifactId>
        <version>${logback.version}</version>
    </dependency>
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>${logback.version}</version>
    </dependency>
</dependencies>   	 
```

Next create a `logback-access.xml` under `src/main/resources`.You can change the fields displayed in an access log. For a full list of available fields refer to the [logback documentation](http://logback.qos.ch/access.html). 

```xml
<configuration>
	<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    	<encoder>
        	<pattern>logging uri: %requestURL | status code: %statusCode | bytes: %bytesSent | elapsed time: %elapsedTime | request-log: %magenta(%requestContent) | response-log: %cyan(%responseContent)</pattern>
    	</encoder>
	</appender>
	<appender-ref ref="STDOUT"/>
</configuration>
```

## Capturing Request/Response 
It is often useful to capture both the client's request and the server's response when diagnosing bugs. The `TeeFilter` servlet filter accomplishes this. 

```java
import ch.qos.logback.access.servlet.TeeFilter;

@Configuration
public class FilterConfiguration {

	@Autowired
	@Bean
	public FilterRegistrationBean requestResponseFilter() {

    	final FilterRegistrationBean filterRegBean = new FilterRegistrationBean();
    	TeeFilter filter = new TeeFilter();
    	filterRegBean.setFilter(filter);
    	filterRegBean.setUrlPatterns("/rest/path");
    	filterRegBean.setName("Request Response Filter");
    	filterRegBean.setAsyncSupported(Boolean.TRUE);
    	return filterRegBean;
	}
}
```

Once this is configured, every request/response payload is logged to your default appender. 

## Enabling or Disabling Logging

There are potential impacts to application performance when this filter is activated. Every request/response payload is copied to an in-memory buffer, creating additional garbage collection and CPU overhead. To reduce overhead or to avoid logging sensitive data, add the following to your `application.properties` to disable access logging by default:

`logback.access.enabled=false`

## Keep Learning

You can find out more by reading the [Spring Boot documentation on logging](https://docs.spring.io/spring-boot/docs/2.1.8.RELEASE/reference/html/boot-features-logging.html) or the full [logback manual](http://logback.qos.ch/manual/index.html).  

Logging has three elements: collection, indexing, and visualization. This guide explains the first element, collection. For indexing and visualization, there’s a wide ecosystem of open-source technologies that can be used. For example, the “EFK stack” (Elasticsearch, Fluentd, and Kibana) is popular for solving this problem. 

Two open-source tools that help with logging and visualization are Prometheus and Grafana. Prometheus excels at gathering metrics from a wide array of sources, while Grafana is the go-to tool for visualizing complex time-series data. The following guides explain how to use these tools in Kubernetes environments:

* [Prometheus and Grafana: Gathering Metrics from Spring Boot on Kubernetes](/guides/spring/spring-prometheus/)
* [Prometheus and Grafana: Gathering Metrics from Kubernetes](/guides/kubernetes/observability-prometheus-grafana-p1/)
 
Spring Boot also provides health checks for application monitoring in addition to logging. Learn how to [enable health checks using Spring Boot Actuator](/guides/spring/spring-boot-actuator). 