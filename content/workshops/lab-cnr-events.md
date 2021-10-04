---
date: '2021-09-13'
description: An introduction to Knative Eventing for users of VMware Tanzu Cloud Native Runtimes.
lab: lab-cnr-eventing
lastmod: '2021-10-03'
length: 15
logo: "/images/workshops/logo-tanzu.png"
summary: An introduction to Knative Eventing for users of VMware Tanzu Cloud Native Runtimes.
tags:
- Spring
- Microservices
- Kubernetes
- Spring Boot
- Eventing
- Knative
- Tanzu
title: Build Event Driven Apps with Tanzu Cloud Native Runtimes
level1: Building Modern Applications
team:
- Myles Gray
weight: 5
badge: Tanzu Cloud Native Runtimes
---

VMware Tanzu Cloud Native Runtimes is a serverless solution to running applications on top of Kubernetes. Cloud Native Runtimes is based on the open source project Knative. Cloud Native Runtimes simplifies deploying microservices on Kubernetes. With a single command, you can build services based on your containerized applications without having to learn or build various Kubernetes objects. Cloud Native Runtimes automates the backend objects needed to run microservices on top of Kubernetes.

Knative is made up of two major projects:

- Serving is responsible for deploying, upgrading, routing
- Eventing is responsible for connecting disparate systems

This workshop is intended for folks who want to learn the fundamental components and capabilities of Knative Eventing in more detail. A basic understanding of Kubernetes concepts is recommended to be able to understand the full workshop.

What you will do in the lab:

- Gain an understanding of Knative Eventing
- Understand CloudEvents and why they are used
- Set up Brokers, Sources, Sinks and Triggers
- View events being sent and received through the Knative Eventing system