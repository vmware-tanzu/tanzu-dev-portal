---
date: '2021-02-24'
lastmod: '2021-04-28'
linkTitle: Bootifying Java Applications
tags:
- Spring Boot
- Getting Started
- Spring
- Microservices
featured: true
team:
- Marc Zottner
title: Bootifying Java Applications
weight: 3
oldPath: "/content/guides/spring/bootifying-java-apps.md"
aliases:
- "/guides/spring/bootifying-java-apps"
level1: Modernizing Legacy Applications
level2: Packaging, Operating, and Outside Enhancements
description: Transform your Java code into a full-fledged Spring Boot application
---

Spring Boot is a convention-over-configuration solution to create standalone, production-grade Spring-based applications that you can "just run". It is pre-configured with an opinionated view of the best configuration of the Spring platform, including third-party libraries, so that you can get started with minimum fuss. The Spring framework provides hundreds of features and modules, but knowing where to start and configure them can be challenging.

Not every existing Java application can be deployed and operated as a Spring Boot application without modification. In particular, Java applications that leverage Java EE APIs (see [examples](https://github.com/javaee-samples)) or vendor-specific APIs may require some effort to migrate to Spring Boot. 

## Guide

Bootification is the process of changing the code and configuration of an application to transform it into a full-fledged [Spring Boot](https://spring.io/projects/spring-boot) application. Several factors impact the bootification journey that your applications should follow. For example:

* Dependency and build management tools (i.e., Ant, Maven, Gradle)
* Desired packaging (executable JAR/WAR or standalone WAR)
* The acceptable amount of configuration refactoring (XML versus Java configuration)
* Library version upgrade strategy
* Nature of the application (frontend/backend/monolithic)

This step-by-step guide walks you through the process of transforming existing Java applications into first-class Spring Boot citizens.

![img](images/spring-bootification-process.png#diagram)

### 1. Learn about Spring Boot

To learn more about what Spring Boot is and what you can do with it, see the official [Spring Boot home page](https://spring.io/projects/spring-boot) and [Getting Started Guides](https://spring.io/guides#getting-started-guides). The [references](#references) section provides more learning resources.

### 2. Setup your local development environment

Spring Boot can be used with a classic Java development toolset or installed as a command-line tool. Either way, you need the [Java SDK](https://www.java.com/) v1.8 or higher.

If you want to experiment with Spring Boot or are new to Java development, you might want to try the [Spring Boot CLI](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started-installing-the-cli) (Command Line Interface) first. Otherwise, follow the [traditional installation instructions](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started-installation-instructions-for-java).

For seamless integration and native support in your favorite coding environment, try the latest [Spring Tools](https://spring.io/tools) distribution for Eclipse, Visual Studio Code, or Theia. Some [plugins](https://www.jetbrains.com/help/idea/spring-boot.html) are also available for IntelliJ IDEA.

### 3. Check out, build, and back up your project

You can now check out your application from its source control system and make sure that you can build and run it without any change. Back up this project locally to be able to run the initial application at any later point in the process and validate its behavior.

Before changing anything in your application, you should also create a separate bootification branch within your version control system (e.g., Git). This way, you will be capable of tracking and viewing differences between the original application and the bootified one and rolling back your changes if necessary.

### 4. Adjust application dependencies, packaging, and code structure

Now it is time to update your application dependencies, packaging and create a Spring Boot application class.

If you want to use either Maven or Gradle, [Spring Initializr](http://start.spring.io/) is the recommended approach for generating a new Spring Boot application. Spring Initializr is like a shopping cart for all of the dependencies you might need for your application. It offers a fast way to pull in all of the dependencies you need for an application and does a lot of the setup for you. Just Navigate to [Spring Initializr](http://start.spring.io/), fill in the metadata, add the dependencies relevant to your application, and generate the new project. Make sure to carefully pick the right Spring Boot starters for your application.

Initializr will automatically generate the main Spring Boot application class for you. Feel free to adjust it to your needs.

At this stage, make sure you understand Spring Boot auto-configuration and [how to adjust it](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-auto-configuration.html).

### 5. (Optional) Configure remote deployment

It typically makes sense to start working locally on your developer machine. Once you want to connect your application to external resources (e.g., database, messaging middleware, external services) or test it in a more realistic environment, deploying your Spring Boot application to a remote runtime environment or server is an excellent idea.

For this reason, from this point on you can consider deploying the application on [VMware Tanzu Application Service](https://tanzu.vmware.com/application-service) (TAS) or a remote testing server. TAS is based on the Cloud Foundry open-source project. It is built to be the best runtime for Spring and Spring Boot applications, providing a lean, integrated, and efficient user experience. If you want to deploy your application there, follow the corresponding "[getting started](https://docs.cloudfoundry.org/buildpacks/java/getting-started-deploying-apps/gsg-spring.html)" deployment guide.

### 6. Prepare your application to work with Spring Boot

Now, you can begin modifying your application code and configuration. From here on, you want to make as few changes as possible -- just enough to get your application running as a standalone Spring Boot application. We recommend that you do _not_ combine this work with any other changes to your application's inner workings or business logic for better visibility.

The majority of the changes required to get your application running are tied to the usage of Java EE APIs. You will have to remove and replace dependencies to Java EE and the application server in use. (e.g., [GlassFish](https://javaee.github.io/glassfish/), [Apache TomEE](https://tomee.apache.org/), [IBM WebSphere Application Server](https://www.ibm.com/cloud/websphere-application-server), [Red Hat JBoss Application Server / Wildfly](https://github.com/wildfly), [Oracle WebLogic Server](https://www.oracle.com/middleware/technologies/weblogic.html), [SAP NetWeaver Application Server](https://www.sap.com/germany/products/netweaver-platform.html)...).

You will need to modify the application depending on the Java EE specification it currently uses: annotations, EJBs, JAX-WS, JAX-RS, JAXB, JMS, JSF, JPA...

{{% callout %}}
**Note**: Expect detailed future guides covering what needs to be done for each specification.
{{% /callout %}}

### 7. Modify and deploy your application iteratively until it runs

After making the preparatory adjustments identified in the previous step, you can try to run your application. The chances are that the deployment will not work correctly the first time and that you will encounter problems while starting the application.

If it is not working as expected, keep a cool head. Examine the application log to understand the root cause of the _first_ issue that pops up. Start checking existing solutions documented as recipes in your local cookbook or on the Internet before digging deeper into the issue.

You might have to adjust log levels or further instrument and debug your Spring Boot application to gain deeper insights into what is wrong. Reaching out to a colleague or Spring Boot expert early can help you to adopt a different perspective, see the obvious, and save yourself time. If you spend significant time resolving an issue, document what you have done to help your peers in similar situations, and consider writing a cookbook article about it.

From here on, continue to progress step by step, making as few changes as possible, and fixing and documenting any issues encountered. It may take several iterations for your application to start without error and provide the same functionality as the one you started with.

### 8. (Optional) Optimize your application for Spring Boot

At this point, your application should be running as a standalone Spring Boot application. Ensure that this stable state is properly persisted and flagged in your version control system, for example, using a tag or an additional branch.

Moving forward, you might want to consider additional optimizations to your codebase to transform your application into a first-class Spring Boot citizen. These may encompass some of the following topics:

* Externalizing environment variables
* Optimizing logging with Spring Boot
* Configuring actuator endpoints
* Externalizing and caching state
* Moving from Maven to Gradle
* Removing Spring XML configuration
* Converting legacy classes to Spring stereotypes
* Integrating with Spring Cloud Data Flow (SCDF)
* Removing boilerplate code using [Project Lombok](https://projectlombok.org/)
* Tidying up unused components and dependencies

If any of the options are relevant to your application, perform them one at a time. Validate that your application is running appropriately after each change.

### 9. Finalize the Bootification Process

After your application is working and thoroughly tested, commit your code changes and put the application through the formal testing procedures along the (automated) path to production. You might have to collaborate with operations engineers to adjust your application's configuration and CI/CD pipelines.

## Keep Learning
The Tanzu Developer Portal has a [series of guides](/topics/building-modern-applications/) on topics related to building modern applications using Spring and Spring Boot that can help you learn more and address a variety of needs. 

### References
In addition to the links included in the text, the list below provides additional useful guides and tutorials related to the topics discussed. 

* [Spring Boot](https://spring.io/projects/spring-boot) --- official landing page for Spring Boot
* [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/) --- complete Spring Boot reference documentation
* [Spring Guides](https://spring.io/guides) --- designed to get you productive as quickly as possible using the latest Spring project releases and techniques as recommended by the Spring team
* [Spring Bootification Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-traditional-deployment.html#howto-convert-an-existing-application-to-spring-boot) --- how to convert an existing application to Spring Boot
* [Baeldung | Java, Spring and Web Development tutorials](http://www.baeldung.com/) --- useful tutorials, including many Spring and Spring Boot topics
* [Mkyong Spring Boot Tutorials](http://www.mkyong.com/tutorials/spring-boot-tutorials/) --- tutorials covering many aspects of Spring Boot
* [VMware Tanzu Developer Spring guides](/guides/spring/) --- hands-on guides from the VMware Tanzu Developer site

### Videos

* [Spring Developer YouTube channel](https://www.youtube.com/user/SpringSourceDev)
* [Spring Accelerates Cloud-Native Java Application Development | Tanzu](https://tanzu.vmware.com/spring-app-framework)
* [Building Microservices with Spring Boot LiveLessons (Video Training)](https://www.safaribooksonline.com/library/view/building-microservices-with/9780134192468/)

### Books

* [_Learning Spring Boot 2.0_](https://www.amazon.com/dp/B01LPRN0Z8)
* [_Spring Boot in Action_](https://www.safaribooksonline.com/library/view/spring-boot-in/9781617292545/)
* [_Cloud Native Java_](https://www.safaribooksonline.com/library/view/cloud-native-java/9781449374631/)

### Tools

* [Spring Initializr](https://start.spring.io/) --- generate a Spring Boot project with just what you need to start quickly
* [Spring Boot Starters](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters) --- one-stop-shop for convenient dependency descriptors that include all of the Spring and related technology that you need in your application
* [Spring Tools](https://spring.io/tools) --- next-generation Spring tooling for your favorite coding environment