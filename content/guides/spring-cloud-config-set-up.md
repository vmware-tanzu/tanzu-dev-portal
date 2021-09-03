---
date: '2021-01-29'
lastmod: '2021-02-24'
linkTitle: Spring Cloud Config Server
patterns:
- API
subsection: Spring Cloud Config Server
tags:
- Spring Cloud Config Server
title: Setting Up Spring Cloud Config Server
topics:
- Spring
- Microservices
weight: 4
oldPath: "/content/guides/spring/spring-cloud-config-set-up.md"
aliases:
- "/guides/spring/spring-cloud-config-set-up"
level1: Building Modern Applications
level2: Frameworks and Languages
---

As an application moves through the deployment pipeline from dev to test to production, you may need a centralized way to manage the configuration across environments to make certain that each application has access to everything it needs to run as it moves and always uses the right configuration. [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/reference/html/) provides server-side and client-side support for managing and using external configuration information. 

This can have significant advantages with microservices applications where multiple instances of a microservice may be running at one time. Using a centralized config server makes it possible to ensure that all instances are configured the same way, and if you need to change a setting, like a timeout value, you only have to do it in one place (assuming your application encode includes a refresh mechanism).

The Spring Cloud Config Server provides a central place to manage external properties for multiple applications across multiple environments, superseding or supplementing the environment variables and system properties used in most applications. 

This guide explains some important considerations for setting up and using a Spring Config Server. [Securing Spring Cloud Config Server](/guides/spring/spring-cloud-config-security/) digs into some security mechanisms that can be used with Spring Config Server.

## Creating a Config Server 
Spring Cloud Config Server acts as an intermediary between your Spring applications and a repository of configuration files. Creating a Config Server is straightforward. Use Spring Cloud’s `@EnableConfigServer` to create a config server capable of communicating with your applications. This is a regular Spring Boot application with an annotation added to enable the config server:

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServer {
  public static void main(String[] args) {
    SpringApplication.run(ConfigServer.class, args);
  }
}

```
You should switch the Config Server from the default port (8080) to the more conventional port (8888). This can be achieved by launching the Config Server with `spring.config.name=configserver` (there is a `configserver.yml` in the Config Server jar).


### Spring Config Server repositories
A Spring Config Server instance needs a place to store configuration information. A centralized repository is used for this information.The location of the repository is controlled by the `EnvironmentRepository`, serving `Environment` objects. `Environment` resources have three parameters:

*`{application}`, which maps to `spring.application.name` on the client side.

*`{profile}`, which maps to `spring.profiles.active` on the client (comma-separated list).

*`{label}`, which is a server side feature labeling a "versioned" set of config files.

A repository loads configuration files from a `spring.config.name` based on the `{application}` parameter, and `spring.profiles.active` based on the `{profiles}` parameter. Active profiles take precedence over defaults.

#### Repository types
Spring Config Server supports a wide range of different [repository types](https://cloud.spring.io/spring-cloud-config/reference/html/#_environment_repository), making it appropriate to address almost any need from simple to complex:

* **Git backend.** Uses a local, git-based file system repository, GitHub, GitLab, or other.
* **File system backend.** Stores config information in a local file system without version control.
* **Vault backend.** Uses Vault by HashiCorp to create a secure repository. (Described in [Securing Spring Cloud Config Server](/guides/spring/spring-cloud-config-security/).)
* **JDBC backend.** Uses the Java Database Connector (JDBC) to connect to a relational database.
* **Redis backend.** Uses the [Redis](https://redis.io/) in-memory database.
* **AWS S3 backend.** Uses an [AWS S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html) as a repository.
* **CredHub backend.** Uses Cloud Foundry’s [CredHub](https://docs.cloudfoundry.org/credhub/) as a repository.

The default is a Git-based backend. This is convenient for managing upgrades, physical environments and for auditing changes, but you’re free to choose whichever backend fits your organization’s needs based on which options you’re familiar with or already using, where your environments are running, and what your security needs are. [Securing Spring Cloud Config Server](/guides/spring/spring-cloud-config-security/) focuses on security, and explains how to use Vault as a secure backend.

All the options are explained in detail in the [Spring Cloud Config Reference documentation](https://cloud.spring.io/spring-cloud-config/reference/html/#_environment_repository). 

#### Using multiple repositories
You may wish to keep configuration data in [multiple environment repositories](https://cloud.spring.io/spring-cloud-config/reference/html/#composite-environment-repositories). To do so, you can enable the `composite` profile in your configuration server’s application properties or YAML file.

### Sharing Configuration Information with All Applications
You can share a set of configuration information with all your applications. 

* With file-based repositories, resources with file names application.properties, application.yml, application-*.properties, and so on) are shared with all client applications. You can use resources with these file names to configure global defaults and have them be overridden by application-specific files if necessary.

* When using Vault as a backend, you can share configuration with all applications by placing configurations in `secret/application`.

### Property Overrides
The Spring Config Server includes an [overrides feature](https://cloud.spring.io/spring-cloud-config/reference/html/#property-overrides) that lets an operator provide configuration properties to all applications. The overridden properties cannot be accidentally changed by the application with the normal Spring Boot hooks.

## Client-Side Usage
To make use of [Spring Config Server in a client application](https://cloud.spring.io/spring-cloud-config/reference/html/#_client_side_usage), you build your Spring Boot application so it depends on `spring-cloud-config-client`. The easiest way to add the dependency is with a Spring Boot starter `org.springframework.cloud:spring-cloud-starter-config`. There is also a parent POM and BOM (spring-cloud-starter-parent) for Maven users and a Spring IO version management properties file for Gradle and Spring CLI users.

## Keep Learning
A great way to get started learning about and using Spring Cloud Config is the [Centralized Configuration Guide](https://spring.io/guides/gs/centralized-configuration/). This guide takes about 15 minutes, stepping through the process of setting up a Config Server and consuming configuration information from a client. It also illustrates how to refresh configuration without restarting the client.

In a recent [Spring Tips video](/tv/springone-tour/0006/) from the 2020 SpringOne tour, Developer Advocate Josh Long goes deep on configuration methods, including Spring Cloud Config.

[Securing Spring Cloud Config Server](/guides/spring/spring-cloud-config-security/) explains how to implement several security options in conjunction with Spring Cloud Config.