---
aliases:
- '0027'
date: '2018-02-23T22:42:18Z'
description: 'TGI Kubernetes 027: Securing the k8s dashboard and beyond!'
episode: '0027'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 027: Securing the k8s dashboard and beyond!'
type: tv-episode
youtube: od8TnIvuADg
---

Index:
00:03:20 - Thank you Unsplash!
00:04:56 - Tesla k8s dashboard cryptojacking
00:09:21 - img container image builder from JessFraz
00:13:40 - ksync from vapor.io
00:15:24 - Hacking and Hardening k8s clusters from Brad Geesaman
00:17:34 - Sealed Secrets
00:19:36 - Blog post tease: Contour&#43;Let&#39;s Encrypt&#43;cert-manager
00:23:31 - Accessing dashboard with kubectl proxy
00:28:54 - Dashboard without credentials
00:30:01 - Giving the dashboard root (don&#39;t do this!)
00:35:24 - Creating a service account token for dashboard access
00:45:18 - Running oauth2_proxy in front of dashboard
00:48:45 - Aside: using RBAC as allow list for users at proxy?
01:02:04 - First try at logging in with proxy
01:03:26 - Relaxing dashboard network policy
01:05:42 - Exposing HTTP from dashboard service
01:08:50 - Didn&#39;t take for some reason. Debugging...
01:12:43 - Getting the dashboard to listen on unsecured port
01:19:20 - Logging into worker node to confirm flags
01:22:14 - Success! We are hitting the dashboard through oauth2 proxy. Now about that auth header...
01:25:35 - Back to the dashboard login screen!
01:29:23 - Wrapping up! Thanks!
01:32:49 - Aside: Episode on cluster autoscaling?

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

With the recent report of Tesla being compromised by having an open kubernetes dashboard, it seems like a good time to review best practices for both the dashboard and other similar services. We&#39;ll look at the current security model of the Kubernetes dashboard and explore using an authenticating proxy to secure any internal facing web service.

Links:
* Files from the episode: https://gist.github.com/jbeda/53a7c6c81359054eacc1608f5211150c
* Images for title cards from Unspash. Thanks Unsplash! https://unsplash.com/
* Details on the Tesla k8s dashboard cryptojack: https://blog.redlock.io/cryptojacking-tesla
* Jess&#39; awesome image builder: https://github.com/jessfraz/img
* ksync from vapor.io: https://github.com/vapor-ware/ksync
* Securing k8s talk from Brad Geesaman: https://www.youtube.com/watch?v=vTgQLzeBfRU
* Sealed Secrets: https://github.com/bitnami-labs/sealed-secrets
* Dashboard access wiki page: https://github.com/kubernetes/dashboard/wiki/Access-control