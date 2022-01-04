---
aliases:
- 0039
date: '2018-06-15T21:45:29Z'
description: 'TGI Kubernetes 039: Cluster auth with GitHub, Dex and Gangway'
episode: 0039
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 039: Cluster auth with GitHub, Dex and Gangway'
type: tv-episode
youtube: xYMA-S75_9U
---

Lots more details on this episode (including the YAML used) at https://github.com/heptio/tgik/tree/master/episodes/039.

Come hang out with Joe Beda as he does a bit of hands on hacking of Kubernetes and related topics. Some of this will be Joe talking about the things he knows. Some of this will be Joe exploring something new with the audience. Come join the fun, ask questions, comment, and participate in the live chat!

This week we&#39;ll be exploring setting up cluster auth with a combination of GitHub, Dex (from CoreOS/Red Hat) and Heptio Gangway.  We&#39;ll also mix in a little Contour and Cert Manager.  The end result will be a secure auth framework as a building block for a multi-team cluster.

Timestamps for the episode

[06:24] News from Around the Community - k8s 1.11, Ark .9
[14:05] https://aws.amazon.com/eks/
[20:43] https://github.com/negz/kuberos
[21:01] https://medium.com/@mrbobbytables/kubernetes-day-2-operations-authn-authz-with-oidc-and-a-little-help-from-keycloak-de4ea1bdbbe 
[22:14] https://github.com/appscode/guard
[24:07] Joe will be covering adding github authentication to a kubernetes cluster in this episode using openid with dex.
[00:24] Let&#39;s start configuring and theory-crafting 
[28:22] A primer of how does OAuth works 
[53:53] Setting up an OAuth in github
[1:00:19] Jim Angel asks &#34;Do you think Dex will die out as RH merges Tectonic, Dex&#39;s main driving force, with OpenShift (since OpenShift already has auth using OCP cli &#43; poor Dex documentation)?&#34;
[01:18:44] Application is stood up and working
[01:23:40] The server= line is empty!
[01:25:55] Logged in, and Joe can&#39;t `get pods` because .... RBAC! (This is a good thing)
[01:28:00] Jose and Simon can log in, but have no permissions to do anything
[01:30:52] Let&#39;s try to give Simon access to Joe&#39;s cluster
[01:32:35] Simon crushes Joe&#39;s wallet and launches a 100 instances.
[01:34:29] Simon terminates the pods