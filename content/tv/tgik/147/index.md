---
aliases:
- '0147'
date: '2021-03-05 21:00:00'
description: 'TGI Kubernetes 147: CoreDNS'
draft: 'False'
episode: '147'
lastmod: '2021-03-10'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'TGI Kubernetes 147: CoreDNS'
type: tv-episode
youtube: 44wv-d7H-HE
---

Come hang out with Luke Short (@ekultails) and learn about CoreDNS. Luke works with a lot of customers directly to make Kubernetes work for them. Over the past week he has been going down a deep rabbit hole around CoreDNS and will share those experiences and learnings with you! Come along for the ride!

Show notes: https://github.com/vmware-tanzu/tgik/tree/master/episodes/147

Timestamps:

- 00:00:40 - Welcome to TGIK!
- 00:06:03 - Week in Review
- 00:24:55 - Katacoda Kubernetes Playground
- 00:26:33 - CoreDNS Introduction
- 00:30:56 - CoreDNS Plugins
- 00:32:38 - CoreDNS Internal Plugin: File
- 00:34:28 - CoreDNS DNS Records
- 00:37:19 - Story time! Luke's first container was a DNS server
- 00:38:44 - Kubernetes at Scale: https://openai.com/blog/scaling-kubernetes-to-7500-nodes/
- 00:39:34 - Chat - What DNS servers do you use?
- 00:41:38 - CoreDNS Pods on Kubernetes
- 00:43:57 - Luke making spelling mistakes :-)
    - Luke thought he was being trolled by him resizing the window. Sometimes that will move the cursor around in the Kubernetes Playground in unpredictable ways.
- 00:45:10 - Moving to Luke's home Kubernetes cluster
    - Configuring CoreDNS in Kubernetes
- 00:49:28 - Load balancing with DNS
- 00:51:48 - View all CoreDNS plugins 
    - Preview the "records" and "unbound" plugins
    - Authoritative vs recursive
- 00:54:32 - CoreDNS external plugins require recompilation
- 00:55:55 coredns-unbound project
- 00:56:24 Public container registries
- 00:59:29 How to compile CoreDNS with plugins
- 01:01:22 CoreDNS demo of customizing Corefile on Kubernetes
- 01:21:18 CoreDNS demo of adding customized DNS records
- 01:40:09 Documentation for customizing CoreDNS in Kubernetes
- 01:43:29 Outro