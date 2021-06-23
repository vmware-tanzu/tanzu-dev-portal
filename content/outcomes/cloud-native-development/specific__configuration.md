---
title: Configuration
weight: 110
layout: single
team:
 - VMware Tanzu Labs
---

Every non-trivial application has some form of configuration, including how to connect to its data sources, how to change its behavior based on the target deployment environment, or even just logging configuration. There are plenty of ways you might be configuring your application now, for example, through:
- XML files on your server cluster
- properties files embedded in your application deployable artifact
- hardcoded variables in your application (No shame here, we have all done this! We will refactor away from this to make your deployments more agile and cloud-friendly.)

The trick to making an application super quick to deploy and change in the cloud is to externalize the configuration from that app and make it part of the environment in which it runs. The simplest way to do this is to read configuration from environment variables directly. It induces a change of behavior without having to recompile or change the application deployable itself.

We will do this in two phases - the first will pull out and standardize app configuration into Spring Boot's `application.yml` file. If you are new to YAML syntax, CircleCI provides a super quick read on [the basic building blocks of the format](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/). It is a lot like JSON but using indentation to reduce duplication and provide more readable files. While moving configuration to a YAML file externalizes it from the code, it still gets packaged up and deployed along with your app.

The second phase of externalizing application configuration will move these application files to their own repository and expose them using Spring Cloud's config server. You already read through some of the basics here when you looked at Spring Cloud, but feel free to explore the config server section in more depth if modernizing your application's configuration will be crucial to getting it ready for TAS.

#### Homework

- Brush up on YAML syntax with the [CircleCI guide](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/) 
- Read the introduction to [Externalizing Configuration with Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config) 

#### Additional resources

- Take a look at the  [Externalizing Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config) documentation to get an understanding of the many ways Boot exposes configuration to your application.