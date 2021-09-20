---
aliases:
- 0083
date: '2019-07-19T23:01:43Z'
description: 'TGI Kubernetes 083: Minecraft Controller with Kubebuilder'
episode: 0083
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 083: Minecraft Controller with Kubebuilder'
type: tv-episode
youtube: tv-HJuwC4yI
---

Full notes for this episode: https://github.com/heptio/tgik/tree/master/episodes/083

- 00:00:00 - Welcome to TGIK!
- 00:04:29 - Week in Review
- 00:17:42 - Putting Kubebuilder in context
- 00:22:56 - Minecraft image we&#39;ll be using
- 00:26:07 - Running Minecraft on k8s manually
- 00:34:10 - Ingress for Minecraft?
- 00:39:17 - Starting with kubebuilder
- 00:47:46 - Adding our first API type
- 00:53:43 - Aside: Operators vs. Controllers
- 01:02:18 - First run of controller!
- 01:04:11 - Leaders election and HA in k8s controllers
- 01:14:32 - Starting our reconciler
- 01:16:00 - RBAC requirements via annotations
- 01:29:47 - Aside: `generatedName` and its history
- 01:52:33 - Bug: reversed objects in `SetControllerReference` (James Munnelly caught it but I missed it in the chat!)
- 01:58:00 - First run with reconciler!
- 01:59:44 - Debugging first errors
- 02:08:20 - Almost there! CrashLoopBackoff
- 02:13:48 - Success!
- 02:14:00 - Wrapping up

Come hang out with Joe Beda as he does a bit of hands on hacking of Kubernetes and related topics. Some of this will be Joe talking about the things he knows. Some of this will be Joe exploring something new with the audience. Come join the fun, ask questions, comment, and participate in the live chat!

This week I&#39;ll be doing some programming! We&#39;ll crack open kubebuilder and see what it takes to build a Minecraft controller.  I don&#39;t know how far we&#39;ll get but it&#39;ll be fun!