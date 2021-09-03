---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Configuration
weight: 110
---

Even quite trivial applications have some form of configuration, such as how to connect to its data sources, how to change behavior based on the target deployment environment, or how to log. There are plenty of ways to configure your application.

For example, you can configure your application through:
- XML files on your server cluster.
- Properties files embedded in your application deployable artifact.
- Hardcoded variables in your application. (No shame here. We have all done this! We typically refactor away from this to make your deployments more agile and cloud-friendly.)

The trick to making an application deploy and change in the cloud super quick is to externalize the configuration from that app and make it part of the environment in which it runs. The simplest way to do this is to read the configuration from environment variables directly, as this induces a change of behavior without having to recompile or change the application deployable itself.

We do this in two phases. 

* Phase 1: We pull out and standardize app configuration into Spring Boot's `application.yml` file. If you are new to YAML syntax, CircleCI provides a quick read on [the basic building blocks of the format](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/). It is a lot like JSON, but uses indentation to reduce duplication, and provides more readable files. While moving configuration to a YAML file externalizes it from the code, it still gets packaged up and deployed along with your app.
* Phase 2: Externalizing application configuration moves these application files to their own repository and exposes them using Spring Cloud's config server. You already read some of the basics here when you looked at Spring Cloud, but feel free to explore the config server section further, if modernizing your application's configuration is going to be crucial to getting it ready for TAS.

## Homework

- Brush up on YAML syntax with the [CircleCI guide](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/). 
- Read the introduction to [Externalizing Configuration with Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config). 

## Additional resources

- Refer to the [Externalizing Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config) documentation to get an understanding of the many ways Boot exposes configuration to your application.