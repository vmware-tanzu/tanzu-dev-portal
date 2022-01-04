---
aliases:
- '0030'
date: '2018-03-30T22:07:28Z'
description: 'TGI Kubernetes 030: Exploring Skaffold'
episode: '0030'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 030: Exploring Skaffold'
type: tv-episode
youtube: McwwWhCXMxc
---

0:00:45 - Hi everyone!
0:02:42 - Heptio sponsors Cloud Native Infrastructure
0:03:55 - SPIFFE
0:05:37 - Amazon IOT Kubernetes Quickstart Button (Tim Carr)
0:06:29 - Comparisons of dev tool blog
0:07:40 - kubed-sh (Bash for Kubernetes)
0:08:21 - Click from Databricks 
0:09:40 - Working group around dev tools in Kubernetes upstream
0:11:50 - Gloo toolset
0:14:30 - Introduction of skaffold
0:17:35 - Comparing to Flux
0:22:08 - Getting started with skaffold
0:23:00 - Installing Skaffold
0:24:00 - Goreleaser (awesome tool for managing Go releases)
0:28:06 - Joe uses GoLand
0:32:50 - Inspecting the Dockerfile
0:35:00 - Inspecting the Skaffold YAML
0:37:00 - Porting the YAML to Amazon
0:42:14 - First skaffold dev command
0:43:09 - Hello world
0:47:09 - Skaffold vs Ksync latency  
0:48:10 - Inspecting the container registry
0:48:50 - Skaffold run
0:53:00 - Exploring helm
0:54:00 - Possible integration with ksonnet
0:56:45 - Looking at tagging strategies for the container images
1:01:03 - Going beyond Dockerfiles
1:05:22 - How skaffold detects deltas
1:06:00 - Microservices example
1:06:44 - Kubernauts Parameterizer
1:08:30 - Creating new repository in ECR
1:10:35 - Running the microservice example
1:12:04 - Fixing the leeroy app
1:12:27 - Learning how skaffold manages YAML delta
1:16:36 - Launching a kuard
1:18:20 - Examining the service and round robin DNS
1:19:10 - Port forwarding 
1:20:50 - Tweaking the HTTP get request in Go (Turning of Keepalive)
1:28:20 - Working example!
1:31:00 - Looking at CRDs with skaffold
1:32:00 - What&#39;s next?


* Skaffold: https://github.com/GoogleCloudPlatform/skaffold/tree/master/docs
    * v0.3: https://github.com/GoogleCloudPlatform/skaffold/blob/v0.3.0/CHANGELOG.md

* Cloud Native Infrastructure e-book: http://go.heptio.com/cloud-native-infrastructure
* SPIFFE joins the CNCF: https://www.cncf.io/blog/2018/03/29/cncf-to-host-the-spiffe-project/
* Heptio Quick Start for Kubernetes IoT button: https://twitter.com/timmycarr/status/979393239429107718
* Comparison for dev tools: https://blog.hasura.io/draft-vs-gitkube-vs-helm-vs-ksonnet-vs-metaparticle-vs-skaffold-f5aa9561f948
* kubed-sh: https://github.com/mhausenblas/kubed-sh
* Click from databricks: https://databricks.com/blog/2018/03/27/introducing-click-the-command-line-interactive-controller-for-kubernetes.html
* K8s WG around Dev Tools? https://groups.google.com/forum/?utm_medium=email&amp;utm_source=footer#!msg/kubernetes-dev/YcjXRDrCdbI/msPgV3tBBgAJ
* Draft v0.12 released: https://github.com/Azure/draft/releases/tag/v0.12.0
* solo.io Gloo function gateway: https://www.solo.io/
* Weave Flux for gitops deployment: https://github.com/weaveworks/flux
* Goreleaser: https://goreleaser.com/
* Kail -- Kubernetes tail: https://github.com/boz/kail
* Kubernauts Parameterizer: https://github.com/kubernauts/parameterizer

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Deploying applications to Kubernetes is one thing. But what about developing on Kubernetes? How do you use Kubernetes to run your application in an environment that is similar to production?

Last week we looked at ksync.  This week we are taking on Skaffold from Google.  We&#39;ll follow up in coming weeks with Draft and Telepresence.

https://github.com/GoogleCloudPlatform/skaffold