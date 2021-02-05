---
title:  "What are Containers?"
weight: 1
topics:
- Containers
tags:
- Containers
- Microservices
---

Containers are logical constructs that package together the binaries for an application along with  configuration files, libraries, and the required dependencies. This allows applications to run more easily and reliably across environments. The container image uses a standard format to port a running container from one host to another.

Containers are an abstraction of the application layer, while virtual machines (VMs) are an abstraction of physical hardware, turning one compute environment into many. In contrast to a virtual machine, which includes an operating system to provide a runtime environment for an application's binaries, multiple containers can share a single operating system instance. When you run a container, the container runtime schedules access to the shared operating system.

To increase security and isolation, containers can run in lightweight virtual machines. The infrastructure (networks, servers, and storage) required to support containers is more easily managed using virtualization, and therefore the two technologies are complementary.

Container standards are controlled by the [Open Container Initiative](https://opencontainers.org/). The OCI currently has specifications for the container runtime and the container image. 

## The Container Runtime

The container runtime is software that executes containers and manages running container images. It partitions a Linux (or other) kernel to run isolated processes with specific resource limits for CPU, memory, etc. A runtime also helps isolate application processes by using two Linux kernel primitives: [control groups \(cgroups\)](http://man7.org/linux/man-pages/man7/cgroups.7.html) and [namespaces](http://man7.org/linux/man-pages/man7/namespaces.7.html). It is cgroups that limit resources to a set of processes running on a Linux host, while namespaces isolate these processes from one another. Although Docker is the most popular example of a container runtime, there are others, such as rkt.

A running container is the set of processes \(typically an application\) that the container runtime supports, ensuring the necessary constructs in the kernel are created to limit resource consumption and provide isolation.

## How Do Containers Help?

Containers operate at a higher level of abstraction than VMs. They improve **application portability, server elasticity, and server resource utilization**. A container runtime can schedule multiple containers on a shared operating system, benefiting both infrastructure operators and application developers.

**Benefits for Operations, Infrastructure, and IT Teams**

* Lowers the operating system footprint that needs to be managed across servers
* Reduces an application's dependencies on an operating system
* Eases maintenance and shortens maintenance windows

**Benefits for Application Development Teams**

* Because containers decouple an application and its dependencies from the operating system, development teams can skip creating multiple test environments with various operating systems for validating application behavior
* Streamlines the development pipeline to reduce the time to build and ship applications

All of these benefits produce a compelling result: Containers shorten the time it takes to build, test, and ship applications.

Containers help accelerate development pipelines by streamlining the dev and test cycle and reducing the effort needed to deploy applications. They execute consistently in each deployment providing portability between platforms and between clouds. Containers increase the efficiency and agility of an organization. 

## Keep Learning
Containers enable consistent deployment and execution of applications across development and test environments and across multiple clouds. See our [Containers topic page](/topics/containers/) for more container-related content. You may also want to check out our [Container Basics Workshop](/workshops/lab-container-basics/) to keep learning about containers, as well as [KubeAcademy](https://kube.academy) that has an excellent series on [Containers 101](https://kube.academy/courses/containers-101).

To get started learning about container orchestration with Kubernetes, see [What is Kubernetes?](/guides/kubernetes/what-is-kubernetes)

