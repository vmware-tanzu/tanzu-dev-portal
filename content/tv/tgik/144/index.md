---
aliases:
- '0144'
date: '2021-01-29 21:00:00'
description: 'TGI Kubernetes 144: Exploring The State of K8s on Windows'
draft: 'False'
episode: '144'
lastmod: '2021-02-03'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'TGI Kubernetes 144: Exploring The State of K8s on Windows'
type: tv-episode
youtube: WnXnO97tsNo
---

Come hang out with Jay Vyas (jayunit100) and hack around w/ windows and various CNI providers in EKS, VSphere, and beyond.  We'll also look at what running containerd in windows looks like, and go through the basics of  "omg, im so used to linux, how do i do this stuff in windows?' for those of you in the K8s community that are just getting started with Kubernetes on Windows !

Show notes available at https://github.com/vmware-tanzu/tgik/blob/master/episodes/144/README.md

- 00:00:00 - Welcome to TGIK and introductions
- 00:00:10 - Week in Review
- 00:15:18 - Looking at how NetworkPolicy Truth tables work on unsupported clusters
- 00:32:29 - Viewing working NetworkPolicies in Windows with Calico 3.16
- 00:45:01 - Lookint at CAPI on Windows
- 00:55:40 - How CNIs are installed with post-kubeadm/preBootstrap commands on Windows
- 01:02:15 - How runtimeClasses, taints, nodeSelectors work together to schedule Windows pods
- 01:13:53 - How Cluster API works on NSX for windows with VSphere and NSX as the network plane
- 01:15:34 - How to use hub.docker.com to lookup windows images matching your OS
- 01:19:07 - Looking at CSI Proxy, briefly
- 01:26:45 - The most interesting problem in containerd and windows networking : The CNI ADD Codepath!