---
aliases:
- '0024'
date: '2018-02-02T22:20:20Z'
description: 'TGI Kubernetes 024: Kubernetes Job objects'
episode: '0024'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 024: Kubernetes Job objects'
type: tv-episode
youtube: -gLMTm85R3M
---

Index:
0:02:58 - CoreOS and Red Hat
0:10:39 - Heptio Kubernetes Subscription (HKS)
0:12:07 - KubeCon EU contributor summit
0:13:14 - New k8s.io docs experience
0:14:00 - Removing the term &#34;Master&#34; from k8s
0:16:52 - Job object: intro
0:21:03 - Job object: one shot
0:38:46 - Job object: failures
0:43:42 - kubectl run semantics
0:47:34 - Job object: parallelism
0:52:54 - Job object: work queue
1:07:11 - Job object: sidecar gotcha

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

This week we&#39;ll dig into the Kubernetes &#34;Job&#34; primitive. We&#39;ll look at how it works, how it compares to other controllers like Deployments and common usage patterns.

Jobs object links:
* KUAR excerpt link (unfortunately doesn&#39;t have Jobs chapter): http://go.heptio.com/kubernetes-up-and-running
* k8s.io docs on Jobs: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
* Issue around sidecars and jobs: https://github.com/kubernetes/kubernetes/issues/25908
* kubectl run behavior based on flags: https://kubernetes.io/docs/reference/kubectl/conventions/#generators
* KUAR org with kuard and examples: https://github.com/kubernetes-up-and-running

Weekly review of k8s land:
* CoreOS joins RedHat: https://coreos.com/blog/coreos-agrees-to-join-red-hat
* Container Linux lives: https://groups.google.com/forum/m/#!topic/coreos-user/GR4YlF2c1dM
* CoreOS/Red Hat FAQ: https://www.redhat.com/en/blog/faq-red-hat-acquire-coreos
* Brandon is a dad! https://twitter.com/BrandonPhilips/status/958809760299565056
* Brian shaves his beard! https://twitter.com/brianredbeard/status/958455929694953473
* Heptio Kubernetes Subscription. The Undistro: https://blog.heptio.com/introducing-heptio-kubernetes-subscription-5415052ef374
* KubeCon EU Contributor Summit: https://github.com/kubernetes/community/tree/master/events/2018/05-contributor-summit
* New k8s.io docs experience! https://kubernetes.io/docs/home/
* Rename Master in Kubernetes: https://github.com/kubernetes/website/issues/6525