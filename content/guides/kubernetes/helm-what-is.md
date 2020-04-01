---
title:  "What is  Helm?"
date:   2020-02-17
---

## What is  Helm?

[### What is  Helm?

[Helm](https://helm.sh) is a tool to help you define, install, and upgrade applications running on Kubernetes. At its most basic, Helm is a templating engine that creates Kubernetes manifests. What makes Helm more than that is it can upgrade and scale applications as well. It's why an instance of a chart running on a kubernetes cluster is called a _Release_. If you need three different installs of a web server, each ones is its own release. The helm docs explain this as [_The Three Big Concepts_](https://helm.sh/docs/intro/using_helm/):  

>Helm installs _charts_ into Kubernetes, creating a new _release_ for each installation. And to find new charts, you can search Helm chart _repositories_.

### How does Helm work

Helm combines the templates and default values in the chart with values you've supplied, along with information from your cluster to deploy and update applications. You can use charts directly from repos, charts you've downloaded, or ones you've created yourself. It uses the [Go templating engine](https://golang.org/pkg/text/template/) so if you're familiar with that, you'll understand how the charts work.

Helm leverages your local Kubernetes context to operate, so it will have whatever permissions the account you're using for `kubectl` does.

_If you read about Helm and come across references for `tiller`, previous versions (before version 3) required an extra component installed on the Kubernetes cluster._

You can read more about the [Helm architecture here.](https://helm.sh/docs/topics/architecture/)
