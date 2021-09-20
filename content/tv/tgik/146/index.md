---
aliases:
- '0146'
date: '2021-02-26 21:00:00'
description: 'TGI Kubernetes 146: Crossplane'
draft: 'False'
episode: '146'
lastmod: '2021-03-02'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'TGI Kubernetes 146: Crossplane'
type: tv-episode
youtube: r4JUZQMW2go
---

Full notes up at https://github.com/vmware-tanzu/tgik/tree/master/episodes/146

- 00:00:25 - Welcome to TGIK!
- 00:03:36 - Week in Review
- 00:11:11 - Welcome to Crossplane
- 00:13:40 - Brief OAM digression
- 00:18:50 - Crossplane install
- 00:24:20 - Install Crossplane kubectl extension
- 00:29:50 - Exploring Crossplane RBAC-manager
- 00:34:45 - Installing the AWS provider
- 00:43:30 - Diving into Crossplane packaging
- 00:46:00 - Mention of dependency confusion attacks: https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610
- 00:49:25 - Using https://github.com/wagoodman/dive to view package contents
- 00:50:20 - Creating a PostgreSQL instance
- 00:56:20 - Diving in to how a PostgreSQL db backed by RDS is represented in Crossplane
- 01:02:40 - Resource parameters, patches and resource sizing
- 01:09:00 - Trying to figure out how to say "database with 8GB RAM" at different cloud providers
- 01:13:00 - Investigating patch options
- 01:16:10 - Got the RDS instance running!
- 01:19:20 - Crossplane resource category list
- 01:23:00 - Discussion about cluster-level Crossplane Providers and Compositions (vs namespace level)
- 01:25:10 - Dependencies / building your own Compositions

Come hang out with Evan Anderson (@e_k_anderson) and learn about Crossplane as he does so. Evan's familiar with Kubernetes and operators, but what can he build with Crossplane?