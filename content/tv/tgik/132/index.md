---
aliases:
- '0132'
date: '2020-09-18 20:00:00'
description: 'TGI Kubernetes 132: Sealed Secrets'
draft: 'False'
episode: '132'
lastmod: '2020-10-02'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'TGI Kubernetes 132: Sealed Secrets'
type: tv-episode
youtube: x-cDk8DIvwE
---

- 00:00:00 - Welcome to TGIK!
- 00:04:31 - Week in Review
- 00:23:15 - Sealed Secret Overview & Install
- 00:37:21 - Sealing a Secret
- 00:52:49 - Retrieving the Public Key
- 00:55:28 - Exploring SealedSecret Scope
- 01:00:00 - Rotation: Secrets and Keys
- 01:15:37 - Multi-Cluster Sealed Secrets
- 01:30:28 - Wrap-up

Show notes up at https://github.com/vmware-tanzu/tgik/blob/master/episodes/132/README.md.

Come hang out with Joe as he does a bit of hands on hacking of Kubernetes and related topics. Some of this will be Joe talking about the things he knows. Some of this will be Joe exploring something new with the audience. Come join the fun, ask questions, comment, and participate in the live chat!

This week we are going to do a deep(er) dive on Sealed Secrets (https://github.com/bitnami-labs/sealed-secrets).  This is a way to encrypt secrets in a way where you can check them in and manage them with the rest of your gitops-ish workflow.  In this deeper dive where we plan to peek under the cover and look at some of the day 2 things like key rotation.