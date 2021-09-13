---
aliases:
- '0031'
date: '2018-04-08T00:50:33Z'
description: 'TGI Kubernetes 031: Connecting with Telepresence'
episode: '0031'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 031: Connecting with Telepresence'
type: tv-episode
youtube: zezeBAJ_3w8
---

(Sorry the stream was choppy. I think this was a YouTube issue.)

0:02:01 Intro to topic - 3 ways
0:06:00 Go Kris!
0:08:10 Kubernetes Application Survey
0:09:44 ksonnet TGIK8s?
0:11:05 EKS conformance
0:13:45 Oracle MySQL Operator
0:15:35 SSO series from Joel Speed
0:18:02 Awesome Kubernetes for finding operators
0:19:35 Quick digression on volumes and stability and storage
0:23:30 VS Code extension for Kubernetes
0:24:06 Telepresence introduction
0:26:45 Different Telepresence modes
0:29:45 Installing Telepresence
0:33:15 sshuttle for VPNing
0:33:58 Running a first example
0:34:48 Accessing a service with port-forward (no Telepresence)
0:36:34 telepresence --docker-run
0:38:17 Stumbling over osxfuse
0:39:59 Running curl from inside telepresence    
0:41:48 Looking under the covers for --docker-run
0:45:57 vpn-tcp mode
0:51:06 Kubernetes context used?
0:51:44 Exposing local services to cluster
0:53:05 local dev of kuard with telepresence
0:57:02 Running kuard backend under telepresence
0:59:05 Reviewing batch job setup
1:02:51 Figuring out --expose
1:05:30 Running kuard client
1:08:05 Creating kuard queue (struggling with curl flags)
1:14:02 Setting up kuard client correctly
1:16:30 debugging with exec -- user permission issues!
1:18:15 Best practice: don&#39;t run as root in containers
1:22:28 Fixing the port I was using
1:24:21 Success! Working on cluster is dequeuing items from local queue
1:26:48 Summary and feedback on telepresence
1:31:33 Thank you and goodbye!

* Telepresence: https://www.telepresence.io/
  * github: https://github.com/datawire/telepresence
  * sshuttle: https://sshuttle.readthedocs.io/en/stable/#
  * TGIK 024 for workqueue example: https://www.youtube.com/watch?v=-gLMTm85R3M&amp;t=3174s
    * Loop to create work items:  for i in work-item-{0..99}; do curl -X POST localhost:8080/memq/server/queues/tgik/enqueue -d &#34;$i&#34;; done

* Good luck Kris! https://twitter.com/krisnova/status/981748166339985408
* Take the Kubernetes Application Survey! https://groups.google.com/forum/#!msg/kubernetes-sig-apps/AjB_lFdILY8/NskxVxdvCQAJ
* AWS EKS passes conformance. https://github.com/cncf/k8s-conformance/pull/184
* Oracle MySQL operator: https://medium.com/oracledevs/introducing-the-oracle-mysql-operator-for-kubernetes-b06bd0608726
* Kubernetes SSO series:
  * Intro: https://thenewstack.io/kubernetes-single-sign-one-less-identity/
  * CLI: https://thenewstack.io/single-sign-kubernetes-command-line-experience/
  * Dashboard: https://thenewstack.io/single-sign-on-for-kubernetes-dashboard-experience/
* Awesome Kubernetes (Operators): https://github.com/ramitsurana/awesome-kubernetes#operators
* VSCode k8s tools: https://github.com/Azure/vscode-kubernetes-tools

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Deploying applications to Kubernetes is one thing. But what about developing on Kubernetes? How do you use Kubernetes to run your application in an environment that is similar to production?

Continuing on our series on developer tools for working with Kubernetes, we are looking at Telepresence from Datawire.  https://www.telepresence.io/.  It allows you to run locally but connect to your remote Kubernetes cluster.