---
hidden: true
title: Spring on Kubernetes
description: Create a Spring Boot application. Containerize it, and push the container to a registry. Deploy it to Kubernetes.
summary: Create a Spring Boot application. Containerize it, and push the container to a registry. Deploy it to Kubernetes.
lab: lab-spring-on-kubernetes
length: 120
logo: /images/workshops/logo-spring.svg
tags:
  - Spring
  - Microservices
  - Kubernetes
  - Spring Boot
---

During this workshop you will learn the finer details of how to create, build, run, and debug a basic Spring Boot app on Kubernetes by doing the following:

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