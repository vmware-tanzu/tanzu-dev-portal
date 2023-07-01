---
title: Getting Started with Knative
description: Get started with serverless on Kubernetes using Knative.
summary: Get started with serverless on Kubernetes using Knative, an open source tool to simplify deploying microservices on Kubernetes.
lab: lab-cnr-serving
length: 15
logo: "images/workshops/logo-knative.png"
tags:
- Spring
- Microservices
- Kubernetes
- Spring Boot
- Knative
weight: 3
archive: true
---
 
VMware Tanzu Cloud Native Runtimes is a serverless solution for running applications on top of Kubernetes based on the open source project Knative. Cloud Native Runtimes can automatically scale-to-zero, scale-from-zero, and respond to demand with event triggers. You can use events and triggers for an incredible amount of customization with all kinds of events and sources. You can easily perform blue-green deployments and upgrade apps seamlessly and much more!

What you will do in the lab:

- Deploy a Spring Boot app to Kubernetes with Cloud Native Runtimes
- Understand what you did to deploy your Spring Boot app
- Install another version (v2) of the Spring Boot app
- Update the service such that incoming traffic is split between both apps by 50%-50%
- Observe the traffic being split between your applications
- Next, move all the traffic coming to the new app version 2