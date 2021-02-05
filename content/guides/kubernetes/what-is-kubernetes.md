---
title:  "What is Kubernetes?"
subsection: "What is Kubernetes?"
weight: 1
topics:
- Kubernetes
- Containers
- Microservices
---

*Container orchestration* is the automation of much of the operational effort required to run containerized workloads and services. This includes a wide range of things you need to manage a container’s lifecycle, including provisioning, deployment, scaling (up and down), networking, load balancing and more.

Because containers are lightweight and ephemeral by nature, running them in production can quickly become a massive effort, particularly when paired with [microservices](/topics/microservices)—which typically each run in their own containers—a containerized application might translate into operating hundreds or thousands of containers.

## Introduction to Kubernetes

Kubernetes is a popular open source platform for container orchestration. Over the last several years, it has become a de facto standard. Kubernetes enables your team to easily scale, schedule and monitor containerized applications. Kubernetes is highly extensible and portable, meaning it can run in a wide range of environments and can be used in conjunction with other technologies. There is a rapidly expanding Kubernetes ecosystem with projects that provide a wide range of different functionality. 

The Cloud Native Computing Foundation (CNCF) maintains an [Interactive Landscape](https://landscape.cncf.io) to keep track of everything going on. VMware Tanzu is an active sponsor and contributor for many [open source projects](https://tanzu.vmware.com/open-source).

Kubernetes addresses the challenges associated with running containers such as:

* What happens if a running container has a problem/dies?
* How do you expose containers running on a host to external/ingress traffic?
* How do you determine AND scale  the number of containers when application workloads increase?
* How do you isolate two containers sitting on the same host such that they do not talk to each other?
* How do you migrate containers from one host to another for host maintenance?

## Solving Container Challenges

Kubernetes solves these challenges by automating the deployment and management of containerized applications. It manages everything necessary to optimize the use of computing resources and scales containers on demand. 

Kubernetes coordinates clusters of nodes to provide integration, orchestration, scaling, fault tolerance, and communications for running containers. It operates using the concept of pods, which are scheduling units that can include one or more containers and are distributed among nodes to provide high availability.

In addition to scheduling deployment and automating the management of containerized applications, a key benefit of Kubernetes is that it maintains the desired state of an application as specified by an administrator. It does this using a declarative text file \(YAML\) that defines the desired state for a containerized application. If a container/pod dies it is automatically restarted, providing a built in level of resilience.

Kubernetes uses various resource constructs to work with containers. These resources help define simple tasks such as how many instances of a container to run at all times, how to trigger auto-scaling, how to route ingress traffic to a set of container images, or how to define a load balancer to distribute traffic between multiple container images. 

## Keep learning
If you haven’t already, check out our [introduction to containers](/guides/containers/what-are-containers), and refer to the guides and resources on our [Kubernetes topic page](https://tanzu.vmware.com/developer/guides/kubernetes/) to go deeper. The [Kubernetes Fundamentals workshop](/workshops/lab-k8s-fundamentals/) provides a quick, hands-on introduction, as well as the [Kubernetes 101](https://kube.academy/courses/kubernetes-101) course on [KubeAcademy](https://kube.academy/).

After you feel comfortable with Kubernetes concepts, you can also learn about combining the Docker container platform with Kubernetes to develop [microservices](/topics/microservices).








