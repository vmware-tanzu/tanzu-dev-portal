---
title:  "What is  Helm?"
date:   2020-02-17
---

## What is  Helm?

[Helm](https://helm.sh) is a tool to help you define, install, and upgrade applications running on Kubernetes. At its most basic, Helm is a templating engine that creates Kubernetes manifests. What makes Helm more than that is it can upgrade and scale applications as well.

### Why is it important?

Helm reduces the amount of work you need to do to deploy, upgrade, and manage an application to Kubernetes. This helps limit human error and also creates a more declarative configuration to enable workflows like [GitOps](https://www.weave.works/blog/what-is-gitops-really).

This capability really stands out when you have a large, complex application. Your app may contain dozens of Kubernetes objects that need to be configured and changed during upgrades. 
It also applies if you're deploying the same app multiple times. Find and replace in multiple manifests is a recipe for disaster. Helm can make that easy and repeatable.

 It's why an instance of a chart running on a Kubernetes cluster is called a _Release_. If you need three different installs of a web server, each ones is its own release. The helm docs explain this as [_The Three Big Concepts_](https://helm.sh/docs/intro/using_helm/):  

>Helm installs _charts_ into Kubernetes, creating a new _release_ for each installation. And to find new charts, you can search Helm chart _repositories_.

You can read more about the [Helm architecture here.](https://helm.sh/docs/topics/architecture/)

### How does Helm work?

Helm combines the templates and default values in the chart with values you've supplied, along with information from your cluster to deploy and update applications. You can use charts directly from repos, charts you've downloaded, or ones you've created yourself. It uses the [Go templating engine](https://golang.org/pkg/text/template/) so if you're familiar with that, you'll understand how the charts work.

As of Helm 3, all of the necessary data is stored locally in your helm client config or in the cluster where the releases are installed. In previous versions of Helm, it required a component called `tiller` installed on the cluster. This is no longer needed and simplifies Helm install and use.

## How Can I Use It?

If you're ready to start using helm, check out our guide on [Getting Started With Helm](/guides/containers/kubernetes/gs-with-helm).