---
title: "Declarative Deployments in Kubernetes: What Options do I have"
featured: false

description: >
    Compare various options for declarative deployment of microservices in Kubernetes.
date: 2020-07-22
topics:
- Kubernetes
tags:
- Kubernetes
patterns:
- Deployment
# Author(s)
team: 
- Dan Dobrin
---

## Context
Your cloud-native application has been designed, built, tested locally and you're taking the next step: deployment to Kubernetes. 

Isolated environments can be provisioned as namespaces in a self-service manner with minimal human intervention through the Kubernetes scheduler, however, as the number of microservices increases, continually updating and replacing applications with newer versions, observing and monitoring the success/failure of deployments becomes an increasing burden.

Deployment processes are performed while allowing for zero or some downtime, at the expense of increased resource consumption or support of concurrent app versions. 

What options do you have to turn deployments into a predictable, repeatable, consistent, easy to observe process? Kubernetes to the rescue ... with **Declarative Deployments**...

## What are Declarative Deployments in Kubernetes?

The concept of Deployment in Kubernetes encapsulates the upgrade and rollback processes of a group of containers and makes its execution a repeatable and automated activity.

The declarative nature of a Kubernetes Deployment allows you to specify how the deployed state should look, rather than the steps to get there.
Declarative deployments allow us to describe how an application should be updated, leveraging different strategies, while allowing for the fine-tuning of the various aspects of the deployment process.

The core of the Deployment is centered around its ability to start and stop Pods in a predictable manner. 
In turn, containers respect cloud best practices and listen to and honor lifecycle events or provide health-check endpoints.

## How do you pick the optimal deployment option for your app?

As the number of microservices in the organization increases, so does the number of clients of a microservice and the complexity of the interconnected services. 
The approach to be taken centers primarily on a couple of discriminating factors:
* can your application allow for any downtime?
* can the clients of your application handle concurrent provider application versions?

Let's introduce a simple decision matrix for declarative deployments, then look at each of the patterns individually.

![Deployment options
](/images/blogs/declarative-deployment-kubernetes/summary.png)

**Note:** The code and configurations for all of the deployment options can be found on [GitHub](https://github.com/ddobrin/declarative-deployments-k8s). 

