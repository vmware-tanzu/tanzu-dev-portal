---
date: '2021-02-24'
lastmod: '2021-02-24'
linkTitle: Spring Session
tags:
- Spring Session
- Spring
title: Offload HTTP Sessions with Spring Session and Redis
oldPath: "/content/guides/spring/offload-http-sessions-spring-session.md"
aliases:
- "/guides/spring/offload-http-sessions-spring-session"
level1: Building Modern Applications
level2: Frameworks and Languages
---

[Spring Session](https://spring.io/projects/spring-session) frees session management from the limitations of HTTP data stored in server memory. Session data can be shared between services in a cloud without being tied to a single container, multiple sessions can be supported in the same browser, and session ids can be included and sent in a header.

Spring Session allows the replacement of `HttpSession` in an application container neutral way, with support for providing session IDs in headers to work with RESTful APIs. Spring Session offers multiple mechanisms to persist data such as JDBC, GemFire, MongoDB, and Redis. This guide illustrates the use of Redis to persist session data in a Cloud Foundry environment, but the same approach will work in any cloud environment.

By persisting sessions, multiple application instances can serve the same sessions and individual instances can crash without impacting other application instances or user workflows.

## Configure the Service to Bind to the Application

By default, an [Apache Tomcat](http://tomcat.apache.org) web server instance is configured to store all sessions and associated data in memory. Under certain circumstances it is desirable to persist sessions using a repository. You can configure Tomcat to do so by binding an appropriate service.

The Tanzu Application Service GO Router uses the `jsessionid` plus a `vcap_id` to establish sticky sessions. Session replication breaks with sticky sessions at the GO router which is one of the reasons Spring Session is used. By default Spring Session creates a custom `SESSION` cookie to house an application’s HTTP session. See the [documentation](https://docs.pivotal.io/pivotalcf/concepts/http-routing.html)).


{{% callout %}}
**Note**: Ensure your session object implements [java.io.Serializable](https://docs.oracle.com/javase/tutorial/jndi/objects/serial.html).
{{% /callout %}}

{{% callout %}}
**Note**: This guide was customized for Spring 3.2.18 and XML Configuration. It is highly recommended to [bootify your application](/guides/spring/bootifying-java-apps) and leverage the Spring Boot Starter modules to help stay current with Spring versions.
{{% /callout %}}


### Cloud Foundry Platform and Redis Service Creation

To enable *Redis-based session replication*, simply bind a Redis service containing a name, label, or tag that has `session-replication` as a substring in Cloud Foundry. To utilize the Redis service [follow the corresponding instructions](https://docs.pivotal.io/redis/2-2/using.html).


### Manual Definition for Session Replication with Redis

Spring Session can better handle the object’s marshalling/unmarshalling than the Tomcat HttpSession. This requires the following dependencies.


```xml
<dependency>
	<groupId>org.springframework.session</groupId>
	<artifactId>spring-session-data-redis</artifactId>
	<version>Corn-SR2</version>
</dependency>
```

**1. Define the session configuration in your `web.xml`**

```xml
  <filter>
	<filter-name>springSessionRepositoryFilter</filter-name>
	<filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
  </filter>
  <filter-mapping>
	<filter-name>springSessionRepositoryFilter</filter-name>
	<url-pattern>/*</url-pattern>
	<dispatcher>REQUEST</dispatcher>
	<dispatcher>ERROR</dispatcher>
  </filter-mapping>
```

{{% callout %}}
**Note**: For the session replication to work with spring security, you need to place the spring session filter above the spring security filter.

For the session replication to work with Apache Struts, you need to place the spring session filter above the Struts filter.
{{% /callout %}}


**2. Define the following in your Spring `application-context.xml`:**

```xml
  ...
  <context:annotation-config/>
  <bean class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration"/>
  <bean class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" />
  <util:constant static-field="org.springframework.session.data.redis.config.ConfigureRedisAction.NO_OP"/>
```

That’s it. With the Redis service bound and session replication defined, sessions are automatically persisted in Redis. 


## Keep Learning
The Spring Session documentation provides a number of [sample applications](https://docs.spring.io/spring-session/docs/current/reference/html5/#samples) showing how to use Spring Session with Redis and JDBC as well as other use cases. Several more examples, including an HttpSession Quick Start guide, can be found [here](https://spring.io/projects/spring-session-data-redis#samples).

Baeldung’s [Guide to Spring Session](https://www.baeldung.com/spring-session) provides an additional example combining the use of Spring Session and Redis in Spring Boot and Spring environments.