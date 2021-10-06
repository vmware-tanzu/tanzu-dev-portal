---
aliases:
- '0035'
date: '2018-05-11T22:19:13Z'
description: 'TGI Kubernetes 035: WeaveWorks Flux and GitOps'
episode: '0035'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 035: WeaveWorks Flux and GitOps'
type: tv-episode
youtube: aQz3H9bIH8Y
---

0:00:00 Hello and Welcome
0:02:20 Plan for the episode
0:03:00 Recent Kubernetes news review
0:03:25 New swag! Heptio and Kubernetes keycaps
0:06:35 Heptio is hiring!
0:07:34 Heptio in NYC
0:08:44 Kubernetes Discourse!
    https://discuss.kubernetes.io
0:10:26 CoreOS/Red Hat integration plans
    https://www.redhat.com/en/about/press-releases/red-hat-unveils-roadmap-coreos-integration-red-hat-openshift
0:12:14 Flatcar Linux (fork of CoreOS)
    https://www.flatcar-linux.org/
0:13:46 Operator Framework
    https://coreos.com/blog/introducing-operator-framework
0:15:10 Envoy Operator
    https://medium.com/solo-io/introducing-the-envoy-operator-for-kubernetes-d59dc75e6d8c
0:17:45 gVisor
    https://cloudplatform.googleblog.com/2018/05/Open-sourcing-gVisor-a-sandboxed-container-runtime.html
    https://github.com/google/gvisor
    Microsoft Drawbridge: https://www.microsoft.com/en-us/research/project/drawbridge/
0:21:30 CNCF Certified Kubernetes Application Developer (CKAD) exam
    https://www.cncf.io/announcement/2018/05/02/cloud-native-computing-foundation-announces-launch-of-certified-kubernetes-application-developer-ckad-exam/
0:22:12 Defining GitOps
    https://www.weave.works/blog/gitops-operations-by-pull-request
0:29:41 GitOps compared to Spinnaker
0:30:49 Layering w/ GitOps, App def vs. app def manipulation vs. app def application
0:33:40 kubediff for diffing local config vs. cluster config
    https://github.com/weaveworks/kubediff
0:34:07 Sealed secrets from Bitnami
    https://github.com/bitnami-labs/sealed-secrets
0:35:49 Helm and GitOps?
    https://www.weave.works/blog/helmflux
0:37:30 Weave Cloud and Weave Flux
    https://www.weave.works/features/continuous-delivery/
0:38:40 Replica scaling and GitOps
0:39:20 Installing Weave Flux
0:41:13 Looking at install YAML
0:42:48 Setting the git repo
0:44:04 Flux RBAC
0:48:01 Actually deploying Flux
0:49:43 Flux &#34;Big Red Button&#34;?
0:51:15 Connecting to Flux/installing fluxctl
0:59:09 Connecting Flux to our git repo
1:02:05 Looking at flux secrets
1:06:36 Flux terminology: Controllers
1:09:00 List images
1:10:00 Updating image (release) on controller
1:12:45 Flux and templating systems?
1:13:54 Connecting to Hello World application
1:14:53 Automating updates when new images pushed
1:17:14 Rolling back an update
1:20:10 Deautomate
1:22:23 Semver for image tags?
1:23:50 Locking a controller
1:25:23 Editing files in git directly
1:34:14 More features! Changing git author, image tag filtering
1:35:59 Wrapping up!
1:38:50 Kris taking on more TGIKs

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

In this post-KubeCon episode we&#39;ll cover some impressions from the conference and announcements from other CoreOS/Redhat, Microsoft and beyond. Then we&#39;ll dive into the idea of &#34;GitOps&#34; and how those ideas are used in WeaveWorks Flux.