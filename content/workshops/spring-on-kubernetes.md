---
date: '2021-03-09'
description:
  Create a Spring Boot application. Containerize it, and push the container
  to a registry. Deploy it to Kubernetes.
draft: false
logo: /images/workshops/logo-spring.svg
lab: spring-on-kubernetes
lastmod: '2021-05-03'
length: 120
summary:
  - Create a Spring Boot application. Containerize it, and push the container to a registry.
    Deploy it to Kubernetes.
tags:
  - Spring
  - Microservices
  - Kubernetes
  - Spring Boot
title: Spring on Kubernetes
level1: Deploying Modern Applications
---

During this workshop you will learn the finer details of how to create, build, run, and debug a basic Spring Boot app on
Kubernetes by doing the following:

- Create a basic Spring Boot app
- Build a Docker image for the app
- Push the image to a Docker registry
- Deploy and run the app on Kubernetes
- Test the app using port-forwarding and ingress
- Use skaffold to iterate easily as you work on your app
- Use kustomize to manage configurations across environments
- Externalize application configuration using ConfigMaps
- Use service discovery for app-to-app communication
- Deploy the Spring PetClinic App with MySQL
