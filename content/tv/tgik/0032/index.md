---
aliases:
- '0032'
date: '2018-04-13T22:39:34Z'
description: 'TGI Kubernetes 032: kubicorn and the cluster-api'
episode: '0032'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 032: kubicorn and the cluster-api'
type: tv-episode
youtube: oLGaWktrB60
---

Come hang out with Kris Nova as she does a bit of hands on hacking of Kubernetes and related topics. Some of this will be Kris talking about the things she knows. Some of this will be Kris exploring something new with the audience. Come join the fun, ask questions, comment, and participate in the live chat!

This week we will be exploring Kris Nova’s project Kubicorn and discovering the future of cloud native infrastructure with the cluster API work going on in upstream kubernetes.

0:00:00 - Intro
0:00:40 - Starting TGIK and updates
0:02:15 - YouTube event explanation 
0:03:40 - Hello and welcome everyone!
0:04:30 - Reddit AMA
0:06:37 - New CNCF open source project landscape
0:07:55 - Shoutout to release team
0:08:53 - Kubernetes mentoring update
0:09:47 - Increasing diversity contributions at Kubecon (Panel)
0:11:00 - The history of kops and kubicorn
0:12:45 - Shoutout to Kubicorn contributors
0:13:45 - Updating on the next (first release) of Kubicorn
0:15:28 - Compile the binary
0:17:03 - Kubicorn commands
0:17:27 - Kubicorn and declaring infrastructure
0:18:53 - Kubicorn state interface and state stores
0:19:55 - Inspecting a kubicorn declaration 
0:23:18 - Kubicorn bootstrap scripts with Kubeadm
0:24:23 - Inspecting Kubernetes master bootstrap script (Amazon, Ubuntu)
0:26:14 - Bootstrapping a cluster with Kubicorn in Amazon
0:27:28 - Using --set with Kubicorn profiles
0:32:00 - Race conditions in the Amazon API
0:36:00 - Explaining the Kubicorn resource graph
0:37:55 - Kubicorn reconciling and object hashes
0:38:31 - Cluster names with kubeadm
0:38:50 - Kubicorn SSH (in the works)
0:39:53 - Inspecting the Kubicorn control plane nodes
0:41:20 - Where the rubber meets the road with kubeadm
0:43:00 - Inspecting the Kubicorn worker nodes
0:44:49 - The kube-deploy repository and the cluster API work
0:45:55 - Fragmented user interfaces in the wild
0:46:44 - Common controller code with the cluster API
0:47:45 - New proposal for community driven cluster API tooling
0:49:07 - The new cluster API repository
0:50:25 - Kubicorn running the cluster API
0:51:35 - Creating a controller driven kubicorn cluster
0:53:45 - Controllers with Kubicorn
0:57:00 - Apply the controller type of cluster
0:59:50 - kubectl get machines
1:01:20 - Looking at the kubicorn controller code
1:05:40 - Compiling the kubicorn controller
1:07:10 - Hacking on the kubicorn controller
1:11:30 - How to learn more about the cluster API and contribute upstream
1:20:30 - Thanks and goodbye!





Links:

Reddit AMA
https://www.reddit.com/r/kubernetes/comments/8a2e2f/ama_with_kubernetes_developers_on_tuesday_april_10/

CNCF interactive landscape
https://landscape.cncf.io/

Kubernetes 1.10.1 released
https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md#v1101

Diversity panel for Kubecon
http://sched.co/E8bW

Mentoring / meet our contributors
https://github.com/kubernetes/community/blob/master/mentoring/meet-our-contributors.md

Cluster API Tooling Proposal
https://docs.google.com/document/d/1-sYb3EdkRga49nULH1kSwuQFf1o6GvAw_POrsNo5d8c/edit#heading=h.mhd2l21c5f2l