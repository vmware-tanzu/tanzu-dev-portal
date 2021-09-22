---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Security
weight: 200
oldPath: "/content/outcomes/cloud-native-development/specific__security.md"
aliases:
- "/outcomes/cloud-native-development/specific__security"
tags: []
---

Security in a distributed system can be a daunting task since you cannot rely on a large centralized security module on a monolithic web server. Spring Boot provides the Spring Security package to offer a general abstraction layer for configuring your application security without relying on the specific container or deployment environment.

We typically wire up security for newly created or modernized services using this module. The Spring team has a great [guide to securing web applications](https://spring.io/guides/gs/securing-web/) to walk you through the basic configuration via Java beans and the domain-specific language. 

It's a good idea to complete this exercise to be comfortable applying the technology to your applications. You'll learn the specifics of more advanced configurations over time. In the meantime, this exercise will help you recognize the get-go basics.

## Homework

- Read the [Securing Web Services](https://spring.io/guides/gs/securing-web/) guide.