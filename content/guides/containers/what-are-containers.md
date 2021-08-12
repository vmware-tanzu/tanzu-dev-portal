---
date: '2021-02-26'
lastmod: '2021-02-26'
tags:
- Containers
- Microservices
title: What are Containers?
topics:
- Containers
weight: 1
oldPath: "/content/guides/containers/what-are-containers.md"
aliases:
- "/guides/containers/what-are-containers"
level1: Modern App Basics
level2: Kubernetes Platform
---

Containers are logical constructs that contain the binaries for an application. Container binaries run at a higher level of infrastructure abstraction than virtual machines. In contrast to a virtual machine, which provides an entire operating system to provide a runtime environment for an application's binaries, a container bundles only an application's binaries and its required libraries. 

It’s important to note that VMs and containers are not mutually exclusive.  The infrastructure (networks, servers, and storage) required to support containers can often be more easily managed using virtualization, and therefore the two technologies are complementary.

In general, the term **container** is used to refer to either a container image or an instance of a running container. When you run a container, an abstraction layer, the container runtime, schedules access to a shared operating system. Container standards are being developed by the [Open Container Initiative](https://opencontainers.org/), which currently has specifications for both the container runtime and the container image. 

## The Container Runtime

Although Docker is the most popular example of a container runtime, there are others, such as containerd, rkt etc. 

Similar to how a Linux kernel helps run application processes by providing hardware resources, a container runtime helps partition the Linux kernel to run isolated Linux processes with specific resource limits around CPU, memory, etc. The runtime also helps isolate application processes using two Linux kernel primitives: [control groups \(cgroups\)](https://man7.org/linux/man-pages/man7/cgroups.7.html) and [namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html). Cgroups limit resources to a set of processes running on a Linux host, and namespaces isolate processes from one another. 

![Linux Kernel Without Containers](/images/guides/containers/linux-kernel-without-containers.png)

A running container is the set of processes (typically an application) that the container runtime supports, ensuring the necessary constructs in the kernel are created to limit resource consumption and provide isolation.

![Linux Kernel With Containers](/images/guides/containers/linux-kernel-with-containers.png)

## How Do Containers Help?

Because containers operate at a higher level of abstraction than VMs, they improve **application portability, server elasticity, and server resource utilization**. A container runtime can schedule multiple containers on a shared operating system, benefitting both infrastructure operators and application developers.

**Benefits for Operations, Infrastructure, and IT Teams**

* Lowers the operating system footprint that has to be managed across servers
* Reduces an application's dependencies on an operating system
* Eases maintenance and shortens maintenance windows

**Benefits for Application Development Teams**

* Because containers decouple an application and its dependencies from the operating system, development teams can skip creating multiple test environments with various operating systems for validating application behavior
* Streamlines the development pipeline to reduce the time to build and ship applications

All of these benefits produce a compelling result: Containers shorten the time it takes to build, test, and ship applications.

Containers help accelerate development pipelines by streamlining dev/test cycles and reducing the effort needed to deploy applications. They execute consistently in each deployment, providing portability between platforms and between clouds. Containers increase the efficiency and agility of an organization. 

## Keep Learning

Containers enable consistent deployment and execution of applications across development and test environments and across multiple clouds. See our [Containers topic page](/topics/containers/) for more container-related content. You may also want to check out our [Container Basics Workshop](/workshops/lab-container-basics/) to keep learning about containers, as well as [KubeAcademy](https://kube.academy) that has an excellent series on [Containers 101](https://kube.academy/courses/containers-101).

To get started learning about container orchestration with Kubernetes, see [What is Kubernetes?](/guides/kubernetes/what-is-kubernetes).