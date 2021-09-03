---
date: '2021-02-26'
lastmod: '2021-02-26'
parent: What are Microservices?
tags:
- Cloud Native
- Microservices
title: What is Cloud Native?
topics:
- Kubernetes
- Containers
- Microservices
- CI-CD
oldPath: "/content/guides/microservices/what-is-cloud-native.md"
aliases:
- "/guides/microservices/what-is-cloud-native"
level1: Modern App Basics
level2: DevOps Practices
---

Cloud native is an approach to building and running applications that exploit the advantages of the cloud computing delivery model. Cloud native development—also increasingly referred to as modern application development—is appropriate for public, hybrid, and private clouds; it’s about how applications are created and deployed, not where.

The more important thing is the ability to offer on-demand access to computing power along with modern data and application services for developers. Cloud native development incorporates the concepts of DevOps, continuous delivery, [microservices](/guides/microservices/what-is-microservices-architecture), and [containers](/guides/containers/what-are-containers). At its root, cloud native is about structuring teams, culture, and technology to utilize automation and architectures to manage complexity and unlock velocity.

>*Cloud native technologies empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Containers, service meshes, microservices, immutable infrastructure, and declarative APIs exemplify this approach. These techniques enable loosely coupled systems that are resilient, manageable, and observable. Combined with robust automation, they allow engineers to make high-impact changes frequently and predictably with minimal toil.* --[CNCF Definition of Cloud Native](https://github.com/cncf/toc/blob/master/DEFINITION.md)

## Cloud Native Applications

Cloud native applications are developed and optimized to run in a cloud as distributed applications. According to the CNCF, cloud-native applications should have the following characteristics; 

**They are containerized.** Each part \(applications, processes, etc.\) is packaged in its own container. This facilitates reproducibility, transparency, and resource isolation.

**They are dynamically orchestrated.** Containers are actively scheduled and managed to optimize resource utilization.

**They are microservices-oriented.** Applications are segmented into microservices. This segmentation significantly increases the overall agility and maintainability of applications.

Some additional characteristics common to cloud native architectures are identified in [“Migrating to Cloud-Native Application Architectures”](https://download3.vmware.com/vmworld/2015/downloads/oreilly-cloud-native-archx.pdf):

**They are twelve-factor-app oriented.** They use a set of patterns that optimize application design for speed, safety, and scale.

**They have a self-service, agile infrastructure.** Cloud platforms abstract application and service operation, providing infrastructure-level speed, safety, and scale.

**They use API-based collaboration.** The architecture defines service-to-service interaction as automatically verifiable contracts, enabling speed and safety through simplified integration work.

**They exhibit antifragility.** The system gets stronger when subjected to stressors, improving robustness to deliver speed and scale.

## Better Tooling, Better Systems

Cloud native is defined by better tooling and better systems. Without automated tooling, each new service in production will have a high operational cost. It becomes a separate thing that has to be monitored, tracked, provisioned, and so on. That overhead is one of the main reasons why sizing of microservices must be done in an appropriate way. 

Automation is the key to reducing the operational costs associated with building and running new services. Systems such as [Kubernetes](/guides/kubernetes/what-is-kubernetes), [containers](/guides/containers/what-are-containers), continuous integration and continuous delivery [\(CI/CD\)](/guides/ci-cd/ci-cd-what-is/), and monitoring all have the same overarching goal of making application development and operations teams more efficient so they can move faster and build more reliable products.

The newest generation of tools and systems are better able to deliver on the promise of cloud native compared to traditional configuration management tools because the new tools help break a problem down so that it can be easily distributed across teams. Newer tools generally empower individual development and ops teams to retain ownership and be more productive.

## Cloud Native Outcomes

Organizations that adopt cloud native practices and technology generally report the following outcomes:

**More efficient and happier teams.** Cloud native tooling allows big problems to be broken down into smaller pieces for more focused and nimble teams.

**Reduced drudgery.**  Accomplished by automating much of the manual work that causes operations pain and downtime, this takes the form of self-healing and self-managing infrastructure. Modern systems can do more.

**More reliable infrastructure and applications.** Automation to handle expected churn often results in better failure modes for unexpected events and failures. When a single command or button click deploys an application for development, testing, or production, it is much easier to automate deployment in a disaster recovery scenario \(either automatically or manually\).

**Auditable, visible, and debuggable.** Complex applications can be opaque. The tools used for cloud native applications, by necessity, usually provide much more insight into what is happening within an application.

**Deep security.** Many IT systems today have a hard outer shell and a soft gooey center. Modern systems are secure and least-trust by default. Cloud native enables application developers to have an active role in creating application security.

**More efficient usage of resources.** Automated deployment and management of applications and services open up opportunities to apply algorithmic automation. For instance, Kubernetes can automate placement of workloads on machines instead of having an ops team manage the placement via a spreadsheet.

## Keep Learning
A cloud native platform helps take care of Day 1 and Day 2 operations, automatically monitoring and remediating issues that previously would have needed manual intervention. 
Find out more from Kubernetes founders **Craig McLuckie** and **Joe Beda** discussing the difference between Cloud and Cloud Native:

{{< youtube I0p8MIezKkE >}}