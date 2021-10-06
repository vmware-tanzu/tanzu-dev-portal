---
date: '2021-02-24'
lastmod: '2021-02-24'
linkTitle: Spring Cloud Connectors and Datasources
parent: Spring Cloud Connectors
patterns:
- API
tags:
- Spring Cloud Connectors
- Spring
- Messaging and Integration
title: Spring Cloud Connectors and Datasources
oldPath: "/content/guides/spring/spring-cloud-connectors-datasources.md"
aliases:
- "/guides/spring/spring-cloud-connectors-datasources"
level1: Building Modern Applications
level2: Frameworks and Languages
---

[Spring Cloud Connectors](https://cloud.spring.io/spring-cloud-connectors/) simplifies the process of connecting Spring applications to services in cloud platforms. If you aren’t familiar with the project, you might want to refer to the guide [What Are Spring Cloud Connectors?](/guides/spring/spring-cloud-connectors).

This guide examines the scenario where you are migrating a Spring Boot application that has two datasources, both of which are configured as Spring datasources. This means that the application has a `DataSourceConfig` class that is hosting *bean factories* responsible for dispensing both `DataSource` and `JdbcTemplate` objects. The configuration for the datasources comes from an `application.properties` file that resides on the application's classpath.

In order to migrate such an application to a cloud platform such as Cloud Foundry, the configuration needs to be externalized so that the data source bindings can come from user-provided services stored in a Cloud Foundry space. However, you also still want to be able to run the application locally and maintain the easy means of configuring the data sources when running locally.

## Maven Dependencies

If you are familiar with Spring Boot, then you already know that the proper use of dependencies is absolutely critical. Spring Boot works by adding *starter kits* to your application simply by declaring a dependency on them. Once the starter kit is in the class path of your final app, Spring's dependency injection and robust auto-configuration system kicks in and rigs up all of the starter kits you've included by setting up reasonable defaults. This can cause problems, as well, because if you specify incompatible versions of Spring Boot and other supporting libraries like *spring cloud core*, then you can end up with strange errors at runtime like "class not found" errors.

It is *vital* that you ensure all of your Spring Boot and Spring Cloud dependencies are correct and we highly recommend explicitly controlling the version numbers of dependencies whenever possible.

You can find the list of current Maven dependencies required for *spring cloud* on the [Spring Cloud Home Page](http://projects.spring.io/spring-cloud/)

## Spring Boot Profiles

Spring Boot Profiles are a feature that allow for some classes to be instantiated/participate in dependency injection at runtime based on the concept of *active profiles*. If you annotate a class with the `@Profile("...")` annotation, you are essentially indicating a profile or category for that class. If that profile is *active* at runtime, then the annotations and beans and all other Spring machinery for that class will also be active. Conversely, a class marked with a profile that is not active will not supply beans or be injected.

While this is a handy feature and allows for some interesting possibilities while programming, it has some very real consequences when trying to use configuration classes to expose beans configured either via **application.properties** or via *Spring Cloud Connectors*. The most important things to remember are:

* The Java buildpack will automatically enable the **cloud** profile when your application is pushed to Cloud Foundry
* Spring Boot Profiles are not inherently mutually exclusive. You can have multiple active profiles at once.
* If you need to disable local configuration while running under the cloud profile, the local configuration class should have an annotation that looks like this: `@Profile("!cloud")` and the cloud configuration class should be annotated as `@Profile("cloud")`

If multiple profiles are active, and you have multiple classes serving up beans of the same data type with the same qualifier, you run into situations where it may not be entirely obvious as to the source of objects being injected into your Data Access Objects (DAOs) or other classes receiving spring injections. This gets even more complicated if you have two classes, both with active profiles, and one class actually provides more beans than the other. You could very easily end up with *some* of your classes being fed hard-coded "local" configuration while others receive legitimate cloud configuration from bound user-provided services.

To keep things clean, and to preserve the sanity of developers as much as possible, we *strongly* recommend that if you are using Spring Profiles as a toggle for local and cloud configuration, that you ensure they are mutually exclusive and never active at the same time.

## Cloud Foundry Connectors

Spring Cloud Connectors work on a tiered model. At the bottom level, there is a *Cloud Connector* which detects the platform being used (e.g. Cloud Foundry, Heroku, etc.). Above that, you have service connectors which detect bound services and expose `ServiceInfo` objects. You can interact with the cloud connector system programmatically if you so choose, but it also slots in directly with Spring Boot.

The key thing to remember about the service connectors is that they all perform dynamic detection of the service info type based on patterns detected within the *credentials* field of the user-provided service. For example, if the scheme **sqlserver://** is detected within the **jdbcUrl** field of **credentials**, then the SQL Server service connector will be used, and the appropriate plumbing will be slotted in. Refer to the documentation for a list of the ways in which detection takes place, the supported types, and how to use the connectors programmatically.

As an example, here's what it might look like to create a user-provided service that can be detected as a SQL Server binding with Spring Cloud connectors:

```
cf cups sqlDataSource1 -p '{\"jdbcUrl\":\"jdbc:sqlserver://host:port;DatabaseName=theDb;user=user;password=password;\"}'
```

We typically have to escape the quotes when creating these from the command line to allow the CLI to parse the entire string.

{{% callout %}}
**Note**: If you do an **update-user-provided-service** on a service that is already bound to an application, you **must** unbind and then rebind the service. Simply restaging the application **will not** be sufficient.
{{% /callout %}}


## Example Source Code

Here are two code samples. The first is an example of configuring datasources when the application is not running in the cloud and the second when it is.
The following is a sample class that exposes some bean factories for data sources and JDBC templates. Dependent classes can simply expect to have datasources or templates injected, and use the `@Qualifier` annotation to determine which bean to use. The configuration data used by a class such as this would be found in an **application.yml** or **application.properties** file, with properties like **myapp.first.spring.datasource.url**, etc.

```java
package com.sample.app;

// .. imports ..

@Configuration
@Profile("!cloud")
public class DataSourceConfig {

    @Bean(name= "data-source-1")
    @Primary
    @Qualifier("data-source-1")
    @ConfigurationProperties(prefix = "myapp.first.spring.datasource")
    public DataSource firstDataSource() {        
        return DataSourceBuilder.create().build();
    }

    @Bean(name="data-source-2")
    @Qualifier("data-source-2")
    @ConfigurationProperties(prefix = "myapp.second.spring.datasource")
    public DataSource secondDataSource() {        
        return DataSourceBuilder.create().build();
    }

    @Bean @Qualifier("firstJdbcTemplate")
    public JdbcTemplate getFirstJdbcTemplate() {
        return new JdbcTemplate(firstDataSource());
    }

    @Bean @Qualifier("secondJdbcTemplate")
    public JdbcTemplate getSecondJdbcTemplate() {
        return new JdbcTemplate(secondDataSource());
    }
}
```

The following is an example of a class that exposes the same beans as the previous class, but the configuration comes from Spring Cloud Connectors and not from local or hard-coded values:

```java
package com.sample.app;

// .. imports ...

@Configuration
@Profile("cloud")
public class CloudConfig {
    @Bean
    public CloudFactory cloudFactory() {
        return new CloudFactory();
    }

    private DataSource createDataSource(CloudFactory cloudFactory, String serviceId) {
        return cloudFactory.getCloud().getServiceConnector(serviceId, DataSource.class, null);
    }

    @Bean(name = "data-source-1")
    @Primary
    @Qualifier("data-source-1")
    public DataSource firstDataSource(CloudFactory cloudFactory) {        
        return createDataSource(factory, "data-source-1");     
    }

    @Bean(name = "data-source-2")
    @Qualifier("data-source-2")
    public DataSource secondDataSource(CloudFactory cloudFactory) {
        return createDataSource(factory, "data-source-2");
    }

    @Bean
    @Qualifier("firstJdbcTemplate")
    public JdbcTemplate getFirstJdbcTemplate(CloudFactory cloudFactory) {
        return new JdbcTemplate(createDataSource(cloudFactory, "data-source-1"));
    }

    @Bean
    @Qualifier("secondJdbcTemplate")
    public JdbcTemplate getSecondJdbcTemplate(CloudFactory cloudFactory) {
        return new JdbcTemplate(createDataSource(cloudFactory, "data-source-2"));
    }
}
```

## Keep Learning

If you aren’t already familiar with Spring Cloud Connectors, you may want to refer to our [introductory guide](/guides/spring/spring-cloud-connectors) as well as the [Spring Cloud Connectors - Reference Documentation](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html). a The [Spring Cloud Connectors page on Spring.io](https://cloud.spring.io/spring-cloud-connectors/) also includes a Quick Start tutorial that may be a useful starting point.

If you aren’t familiar with the intricacies of Spring profiles or need a refresher, see the [Spring Profiles - Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html), this [One-Stop Guide](https://reflectoring.io/spring-boot-profiles/) and this [tutorial on the Baeldung site](https://www.baeldung.com/spring-profiles).