---
aliases:
- '0112'
date: '2020-04-03T22:07:17Z'
description: 'TGI Kubernetes 112: Deep dive into Admission Controllers'
episode: '0112'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 112: Deep dive into Admission Controllers'
type: tv-episode
youtube: fEvOzL_eosg
---

Episode notes at https://github.com/vmware-tanzu/tgik/blob/master/episodes/112/README.md

- 00:00:00 - Welcome to TGIK!
- 00:19:07 - Start digging into Admission Controllers
- 00:28:47 - Start looking at code
- 00:32:53 - Start trying to use ko for deploy
- 00:47:04 - Give up on ko and use a plain old Dockerfile
- 00:50:33 - Get deployment with TLS
- 01:10:46 - Configure webhook admission controller
- 01:19:35 - Start testing admission controller
- 01:21:51 - why isn&#39;t stuff logging?
- 01:29:12 - Working! Playing with admission controller

Come hang out with Joe Beda as he does a bit of hands on hacking of Kubernetes and related topics. Some of this will be Joe talking about the things he knows. Some of this will be Joe exploring something new with the audience. Come join the fun, ask questions, comment, and participate in the live chat!

This week we&#39;ll be digging into webhook admission controllers! We&#39;ll dive into the code and code up a new one (based on the upstream test image) install it and see how it works.