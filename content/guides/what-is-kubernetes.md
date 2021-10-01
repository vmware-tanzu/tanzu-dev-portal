---
date: '2021-02-26'
lastmod: '2021-06-03'
subsection: What is Kubernetes?
title: What is Kubernetes?
tags:
- Kubernetes
- Getting Started
- Containers
- Microservices
weight: 1
oldPath: "/content/guides/kubernetes/what-is-kubernetes.md"
aliases:
- "/guides/kubernetes/what-is-kubernetes"
level1: Modern App Basics
level2: Kubernetes Platform
description: Learn what it means to orchestrate your containerized workloads
---

Containers accelerate development pipelines by removing the need to build, test and validate application code across multiple operating systems. They also help simplify application operations by being portable across multiple hosts and cloud platforms. However, an application running in a container still needs management. For example:

* What happens if a running container has a problem or dies?
* How do you expose containers running on host to external/ingress traffic?
* How do you determine AND scale the number of containers when application workloads increase?
* How can you isolate two containers on the same host such that they cannot talk to each other?
* How do you migrate containers from one host to another for host maintenance?
* How can containers share common config data?

A microservices application may be spread across multiple services backed by multiple containers, increasing complexity. A platform that can orchestrate, manage and define dependencies and configs for containerized applications becomes necessary for production systems.

## Introduction to Kubernetes

Kubernetes helps orchestrate containerized applications to run on a cluster of hosts. It's a system that automates the deployment and management of containerized applications on a given cloud platform or on-premises infrastructure. Kubernetes manages workload distribution for containerized applications across a cluster of hosts and will dynamically roll out the container networking, routing and ingress needed for applications running in containers. It can also allocate storage and persistent volumes to running containers, provides a way to inject global config variables, implements auto-scaling, and maintains the desired state for applications.

The Kubernetes API lets users define the desired end state of their applications via logical constructs like deployments, replicasets, config-maps, services etc. Kubernetes is highly extensible and portable, meaning it can run in a wide range of environments and can be used in conjunction with other technologies. There is a rapidly expanding Kubernetes ecosystem with projects that provide a wide range of different functionality. 

The Cloud Native Computing Foundation (CNCF) maintains an [Interactive Landscape](https://landscape.cncf.io) to keep track of everything going on. VMware Tanzu is an active sponsor and contributor for many [open source projects](https://tanzu.vmware.com/open-source).

## Solving Container Challenges

Kubernetes solves these challenges by automating the deployment and management of containerized applications. It manages everything necessary to optimize the use of computing resources and scales containers on demand. 

Kubernetes coordinates clusters of nodes to provide integration, orchestration, scaling, fault tolerance, and communications for running containers. It operates using the concept of pods, which are scheduling units that can include one or more containers and are distributed among nodes to provide high availability.

In addition to scheduling deployment and automating the management of containerized applications, a key benefit of Kubernetes is that it maintains the desired state of an application as specified by an administrator. It does this using a declarative text file (YAML) that defines the desired state for a containerized application. If a container/pod dies it is automatically restarted, providing a built in level of resilience.

Kubernetes uses various resource constructs to work with containers. These resources help define simple tasks such as how many instances of a container to run at all times, how to trigger auto-scaling, how to route ingress traffic to a set of container images, or how to define a [load balancer](https://tanzu.vmware.com/content/blog/exploring-kube-apiserver-load-balancers-for-on-premises-kubernetes-clusters) to distribute traffic between multiple container images. 

## Keep Learning

If you haven’t already, check out our [introduction to containers](/guides/containers/what-are-containers), and refer to the guides and resources on our [Kubernetes topic page](/topics/managing-and-operating-kubernetes) to go deeper. The [Kubernetes Fundamentals workshop](/workshops/lab-k8s-fundamentals/) provides a quick, hands-on introduction, as well as the [Getting Started with Kubernetes](https://kube.academy/courses/getting-started) course on [KubeAcademy](https://kube.academy/).