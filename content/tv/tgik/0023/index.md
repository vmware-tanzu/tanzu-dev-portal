---
aliases:
- '0023'
date: '2018-01-26T22:52:38Z'
description: 'TGI Kubernetes 023: Using private registries'
episode: '0023'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 023: Using private registries'
type: tv-episode
youtube: -JN8NSUnVgM
---

0:00:00 - New stuff with k8s this week
0:12:53 - Cluster configuration
0:19:20 - Registry terminology
0:20:28 - Docker Hub
0:36:54 - Discover and debug misconfigured cluster
0:39:41 - Docker Hub continued
0:51:06 - Azure
1:02:00 - ImagePullPolicy questions/advice
1:05:14 - Azure continued
1:09:25 - AWS
1:20:58 - registry-creds helper
1:23:54 - Google
1:40:47 - Note on issue with kubectl 1.9.0
1:42:49 - Docker version validation/compatibility
1:45:08 - Goodbye and thanks!

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

This week we&#39;ll look at how to use private/custom registries with Kubernetes.  I&#39;m going to try to cover major cloud providers and the Docker Hub.  We&#39;ll look at how registries interact with Kubernetes secrets and service accounts.

Links:
* Notes I was using during the video: https://gist.github.com/jbeda/71b85764187dcd3434ee921ff0baae3a
* k8s.io docs on private registries: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
* k8s.io docs on service accounts (and imagePullSecrets): https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
* ECR re-registerer: https://github.com/upmc-enterprises/registry-creds (Thanks Steve!)
* Applatix joins Intuit: https://blog.argoproj.io/applatix-joins-intuit-7ab587270573
* Nuclio hackathon: https://nuclio.devpost.com/
* Nuclio 0.2.4: https://github.com/nuclio/nuclio/releases/tag/0.2.4
* 99pi Scott McCloud episode: https://99percentinvisible.org/episode/speech-bubbles-understanding-comics-scott-mccloud/
* Scott&#39;s k8s comic: https://cloud.google.com/kubernetes-engine/kubernetes-comic/
* OpenCensus: http://opencensus.io/
* kubed-sh: https://github.com/mhausenblas/kubed-sh
* Telepresence: https://github.com/datawire/telepresence
* Heptio Labs wardroom: https://github.com/heptiolabs/wardroom
* Node validation code for docker version: https://github.com/kubernetes/kubernetes/blob/master/test/e2e_node/system/docker_validator.go