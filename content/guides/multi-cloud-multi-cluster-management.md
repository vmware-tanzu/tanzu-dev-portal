---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: Multi-Cluster Management
tags:
- Cluster API
title: Challenges Managing Multiple Clusters Across Multiple Clouds
topics:
- Kubernetes
weight: 47
oldPath: "/content/guides/kubernetes/multi-cloud-multi-cluster-management.md"
aliases:
- "/guides/kubernetes/multi-cloud-multi-cluster-management"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
---

While Kubernetes provides a rich and capable environment for modern applications, it introduces a lot of moving parts and day 2 operating issues. How do you create and enforce security policy in a highly fluid environment? How do you make sure that your identity and access control systems are configured? How do you make certain that everything stays properly configured?

These challenges are hard enough to get right in a single Kubernetes cluster, but we don’t live in a world of single Kubernetes clusters. In the marketplace of ideas, multi-cluster has won. Rather than creating one giant Kubernetes cluster for everyone to share, there’s a clear need to have many small clusters. It makes sense from a security perspective, and can improve resilience and stability, as well. But that brings with it new management challenges.

## Taming Multi-Cluster Management 

While many cloud providers offer managed Kubernetes services, the control planes for these services only work for a particular provider. Several vendors are working to address the issue of multi-cloud cluster management with solutions to unify and simplify cross-cloud management in public clouds and on premises. 

For example, VMware [introduced Tanzu Mission Control](https://tanzu.vmware.com/content/tanzu-mission-control/introducing-vmware-tanzu-mission-control-to-bring-order-to-cluster-chaos) in 2019 to allow operators to apply policy to individual clusters or groups of clusters and establish guardrails, freeing developers to work more freely within defined boundaries. Under the covers, VMware Tanzu Mission Control leverages [Cluster API](https://github.com/kubernetes-sigs/cluster-api) for lifecycle management. 

## Introducing Cluster API

The Cluster API is an open-source, cross-vendor effort to simplify cluster lifecycle management. It’s a member of a set of tools and emerging projects that help create/curate/update base virtual machine images, tackling the problem in a Kubernetes-native way, bringing control and consistency across clouds or on-premises, on virtualized or bare metal infrastructure. 

Extensibility is important and a diverse provider universe already exists. You’ll find provider implementations for a host of clouds, including AWS, Microsoft Azure, Baidu Cloud, Digital Ocean, Google Cloud Platform, IBM Cloud, vSphere, Packet, and more. 

VMware is investing heavily in the Cluster API effort, including baking a supervisor cluster into [vSphere 7](https://tanzu.vmware.com/content/blog/vsphere-7-and-tanzu-kubernetes-grid-powerful-platform-for-architecting-modern-apps).

## Keep Learning

If you want to learn more about Cluster API or get started using it, [The Cluster API Book](https://cluster-api.sigs.k8s.io/) provides a deep dive that will help you get started. 

Two recent Tanzu blogs, [Cluster API is a Big Deal](https://tanzu.vmware.com/content/blog/cluster-api-is-a-big-deal-joe-beda-craig-mcluckie-tell-you-why) and [Cluster API Provider for Azure](https://tanzu.vmware.com/content/blog/cluster-api-provider-for-azure-is-another-giant-leap-for-the-community) provide more context to help you understand what’s happening in multi-cloud, multi-cluster management.