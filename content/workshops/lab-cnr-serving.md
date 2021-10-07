---
date: '2021-09-13'
description: Get started with serverless on Kubernetes using Cloud Native Runtimes.
lab: lab-cnr-serving
lastmod: '2021-10-03'
length: 15
logo: "/images/workshops/logo-tanzu.png"
summary:
- Get started with serverless on Kubernetes using the open source backed, Knative-based
  Cloud Native Runtimes to simplify deploying microservices on Kubernetes.
tags:
- Spring
- Microservices
- Kubernetes
- Spring Boot
- Knative
- Tanzu
title: Getting Started with Tanzu Cloud Native Runtimes
level1: Building Modern Applications
team:
- Boskey Savla
weight: 4
badge: Tanzu Cloud Native Runtimes
---
 
VMware Tanzu Cloud Native Runtimes is a serverless solution for running applications on top of Kubernetes based on the open source project Knative. Cloud Native Runtimes can automatically scale-to-zero, scale-from-zero, and respond to demand with event triggers. You can use events and triggers for an incredible amount of customization with all kinds of events and sources. You can easily perform blue-green deployments and upgrade apps seamlessly and much more!

What you will do in the lab:

- Deploy a Spring Boot app to Kubernetes with Cloud Native Runtimes
- Understand what you did to deploy your Spring Boot app
- Install another version (v2) of the Spring Boot app
- Update the service such that incoming traffic is split between both apps by 50%-50%
- Observe the traffic being split between your applications
- Next, move all the traffic coming to the new app version 2