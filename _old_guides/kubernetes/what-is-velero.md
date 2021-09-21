---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: Velero
subsection: Velero
tags:
- Backup
- Disaster Recovery
- Velero
title: Backing Up, Restoring, and Migrating Resources with Velero
topics:
- Kubernetes
weight: 77
oldPath: "/content/guides/kubernetes/what-is-velero.md"
aliases:
- "/guides/kubernetes/what-is-velero"
level1: Managing and Operating Kubernetes
level2: Backup and Restore
faqs:
  faq:
   - question: What is Velero?
     answer: Velero is an open source data protection tool for backing up and restoring resources in a Kubernetes cluster, disaster recovery, and resource and persistent volume migrations.
   - question: What are the main components of Velero?
     answer: The main components of Velero are a server that runs on your cluster and a command line utility that runs locally. Through these components, Velero supports plug-ins to work with different Kubernetes platforms and storage systems in clusters on the cloud or on premise.
   - question: What is Velero used for?
     answer: Velero is a data protection tool used to backup and restore clusters, recover data from a disaster, replicate a production environment, migrate k8 clusters, or take a snapshot of your application's state before upgrading a cluster.
   - question: How does Velero backup work?
     answer: Velero provides data protection capabilities through custom resource backups and restorations. Controllers process these Kubernetes custom resource definitions to backup and restore resources, either in whole or by object filter.
---

Velero is an open source tool for safely backing up and restoring resources in a Kubernetes cluster, performing disaster recovery, and migrating resources and persistent volumes to another Kubernetes cluster.

Velero offers key data protection features, such as scheduled backups, retention schedules, and pre- or post-backup hooks for custom actions. Velero can help protect data stored in persistent volumes and makes your entire Kubernetes cluster more resilient. 

# Velero Use Cases

Here are some of the things Velero can do:

* Back up your cluster and restore it in case of loss.
* Recover from disaster.
* Copy cluster resources to other clusters.
* Replicate your production environment to create development and testing environments.
* Take a snapshot of your application's state before upgrading a cluster.

# Velero Components and Architecture

Velero consists of two main components:

* A server that runs on your cluster
* A command-line utility that runs locally

Velero supports plug-ins to enable it to work with different storage systems and Kubernetes platforms. You can run Velero in clusters on a cloud provider or on premises.

# How Velero Works

Each Velero operation--on-demand backup, scheduled backup, restoration--is a custom resource that is defined with a Kubernetes custom resource definition, or CRD, and stored in `etcd`. Velero includes controllers that process the CRDs to back up and restore resources. You can back up or restore all objects in your cluster, or you can filter objects by type, namespace, or label.

Data protection is a chief concern for application owners who want to make sure that they can restore a cluster to a known good state, recover from a crashed cluster, or migrate to a new environment. Velero provides those capabilities.

### Keep Learning

On the [Velero home page](https://velero.io/) you can get information on the latest release and download Velero from Github. 

To get started using Velero read our guide, [Getting Started with Velero](/guides/kubernetes/velero-gs), and watch these videos covering two of Velero’s useful features, [Backup and Restore](https://kube.academy/courses/cluster-operations/lessons/backuprestore), and [Migration](https://www.youtube.com/watch?v=q2FCxheA8VI&list=PL7bmigfV0EqQRysvqvqOtRNk4L5S7uqwM&index=5&t=0s).