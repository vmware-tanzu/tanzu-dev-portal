---
date: '2020-04-16'
description: Learn the basics of Helm, a tool to help you define, install, and upgrade
  applications running on Kubernetes, and explore how it works.
lastmod: '2021-03-07'
parent: Packaging
patterns:
- Deployment
tags:
- Helm
team:
- Tyler Britten
title: What Is Helm?
topics:
- Kubernetes
weight: 1
oldPath: "/content/guides/kubernetes/helm-what-is.md"
aliases:
- "/guides/kubernetes/helm-what-is"
level1: Modern App Basics
level2: Kubernetes Platform
---

[Helm](https://helm.sh) is a tool to help you define, install, and upgrade applications running on Kubernetes. At its most basic, Helm is a templating engine that creates Kubernetes manifests. What makes Helm more than that is it can upgrade and scale applications as well.

## Why Is It Important?

Helm reduces the amount of work you need to do to deploy, upgrade, and manage an application to Kubernetes. This helps limit human error and also creates a more declarative configuration to enable workflows like [GitOps](https://www.weave.works/blog/what-is-gitops-really).

This capability really stands out when you have a large, complex application; your app may contain dozens of Kubernetes objects that need to be configured and changed during upgrades. 
It also applies if you're deploying the same app multiple times. Using find-and-replace in multiple manifests is a recipe for disaster. Helm can make the process easy and repeatable.

It's why an instance of a chart running on a Kubernetes cluster is called a _release_. If you need three different installs of a web server, each one is its own release. The Helm docs includes releases as one of [_three important concepts_](https://helm.sh/docs/intro/using_helm/):  

{{% callout %}}
Helm installs _charts_ into Kubernetes, creating a new _release_ for each installation. And to find new charts, you can search Helm chart _repositories_.
{{% /callout %}}


You can read more about the [Helm architecture here.](https://helm.sh/docs/topics/architecture/)

## How Does Helm Work?

Helm combines the templates and default values in a chart with values you've supplied, along with information from your cluster to deploy and update applications. You can use charts directly from repos, charts you've downloaded, or charts you've created yourself. Helm uses the [Go templating engine](https://golang.org/pkg/text/template/), so if you're familiar with that, you'll understand how the charts work.

As of Helm 3, all of the necessary data is stored locally in your Helm client config or in the cluster where the releases are installed. In previous versions of Helm, it required a component called `tiller` installed on the cluster. That component is no longer needed so Helm is now easier to install and use.

## How Can I Use It?

If you're ready to start using Helm, check out our guide on [Getting Started With Helm](../helm-gs).