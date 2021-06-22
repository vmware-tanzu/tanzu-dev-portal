---
title: Configuration
weight: 110
layout: single
team:
 - VMware Tanzu Labs
---

Every non-trivial application has some sort of configuration, including how to connect to its data sources, how to change its behavior based on the target deployment environment, or even just logging configuration. And there are a million ways you might be configuring your application now - through xml files on your server cluster, through properties files embedded in your application deployable artifact, or even hardcoded into your application itself (no shame here and we’ve all run into it in older codebases that have grown beyond their original scope, but this is going to make agile cloud deployment much harder so we’ll look to refactor away from this).

The trick to make an application super quick to deploy and change in the cloud is to externalize the configuration from that app and make it part of the environment in which it runs. In the traditional cloud-native perspective, the simplest way to do this is to read them from environment variables, since this is a way to change behavior without have to recompile or change the application deployable itself.

We’ll do this in two phases - the first will pull out and standardize app configuration into Spring Boot’s application.yml file. If you’re new to YAML syntax, CircleCI provides a super quick read on [the basic building blocks of the format](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/) . It’s a lot like JSON, but uses indentation to reduce duplication and provide more readable files.

While moving configuration to a YAML file externalizes it from the code, it still gets packaged up and deployed along with your app. The second phase of externalizing application configuration will move these application files to their own repository and expose them using Spring Cloud’s config server. You’ve already read through some of the basics here when you looked at Spring Cloud, but feel free to explore the config server section in more depth if modernizing your application’s configuration will play a big role in getting it ready for PCF.

#### Homework

- [x] Brush up on YAML syntax with the [CircleCI guide](https://circleci.com/blog/what-is-yaml-a-beginner-s-guide/) 
- [x] Read the introduction to [Externalizing Configuration with Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) 

#### Additional resources

- [ ] Take a look at the full Externalizing Configuration documentation to get an understanding of the many ways Boot exposes configuration to your application.
