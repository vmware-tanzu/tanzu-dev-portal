---
aliases:
- '0033'
date: '2018-04-22T01:04:28Z'
description: 'TGI Kubernetes 033: Developing with Draft'
episode: '0033'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 033: Developing with Draft'
type: tv-episode
youtube: 8B1D7cTMPgA
---

0:00:55 Hello and talking Grand Canyon
0:01:50 Kris is heading to Toronto and doesn&#39;t know what Tim Horton&#39;s is.
0:02:55 Setting topic as Draft
0:06:11 News: HashiCorp Vault Operator from CoreOS/Red Hat
0:08:22 News: Heptio Ark v0.8.0
0:11:36 Bug I hit in k8s VS Code extension
0:13:00 Naming kube-deploy tool
0:14:55 Digression and thoughts on Kubernetes Federation
0:20:35 Starting look at Draft
0:21:45 Draft is MIT licensed (vs. Apache 2)
0:23:15 Installing Draft
0:27:20 Draft init
0:29:24 Helm with RBAC cluster
0:31:37 Looking forward to Helm v3
0:33:50 Continuing installing Helm
0:40:27 Configure Registry (ECR) with draft
0:46:21 Take draft for a spin (python example)
0:48:10 draft create
0:53:55 draft up (including creating ECR repo)
0:57:43 Why is ECR different?
0:59:15 Decoding helm params that draft sets
1:02:25 draft up with no changes a no-op?
1:04:50 draft connect (including port-forward details)
1:15:12 Customizing local ports for `draft connect`
1:16:53 draft connect utility outside of draft?
1:19:33 Language auto detect and packs
1:27:20 Multiple microservices and draft?
1:28:30 Docker &#34;onbuild&#34; images
1:32:38 Filesystem watch?
1:34:10 Wrap up and goodbye!

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Deploying applications to Kubernetes is one thing. But what about developing on Kubernetes? How do you use Kubernetes to run your application in an environment that is similar to production?

Finishing our our series on developer tools for working with Kubernetes, we are looking at Draft from Microsoft.  https://draft.sh/.  Draft automates creating/rebuilding and launching apps on Kubernetes.

Links:
* Draft: https://draft.sh/
* Vault Operator: https://coreos.com/blog/introducing-vault-operator-project
* Heptio Ark 0.8.0: https://github.com/heptio/ark/releases/tag/v0.8.0
* Issue I&#39;m hitting with k8s extension for VS Code: https://github.com/Azure/vscode-kubernetes-tools/issues/69
* Vote on the kube-deploy client tool name! https://github.com/kubernetes/kube-deploy/issues/689
* Go port of linguist: https://github.com/generaltso/linguist
* Helm v3 design proposal: https://github.com/kubernetes-helm/community/blob/master/helm-v3/000-helm-v3.md