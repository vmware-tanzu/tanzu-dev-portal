---
title: "Spring Boot Probes on Kubernetes"
description: >
  Add liveness and readiness probes to a Spring Boot application in Kubernetes.
summary:
  - Add liveness and readiness probes to a Spring Boot application in Kubernetes.
type: workshop
topics:
  - Spring
  - Microservices
  - Kubernetes
tags:
  - Spring
  - Microservices
  - Kubernetes
  - Spring Boot
  - Probes
length: 30
lab: lab-spring-boot-k8s-probes
logo: "/images/workshops/logo-spring-boot.svg"
---

This lab shows you how to add liveness and readiness probes to a Spring Boot application in Kubernetes. This lab will cover the following tasks:


  1. Add some endpoints to a Spring Boot application and build and push a Docker image
  
  2. Configure the probes in a few lines of YAML
  
  3. Deploy the image as a container in Kubernetes