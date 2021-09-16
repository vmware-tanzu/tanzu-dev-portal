---
aliases:
- 0029
date: '2018-03-23T21:16:52Z'
description: 'TGI Kubernetes 029: Developing Apps with Ksync'
episode: 0029
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 029: Developing Apps with Ksync'
type: tv-episode
youtube: QW85Y0Ug3KY
---

0:00:30 Talking about YouTube problems last time
0:02:50 Intro to series on Dev workflow
0:03:41 Kubernetes 1.10
0:08:18 Apache Spark on Kubernetes
0:08:59 Jenkins X
0:09:52 Untrusted Container Building from JessFraz
0:13:56 Why do development with Kubernetes Clusters
0:19:55 Quick question on distributed monoliths
0:21:18 Factoring layers of dev/deploy workflows
0:23:15 Approaches to development in cluster
0:29:22 Looking at ksync
0:30:38 Prior art w/ docker-sync and unison
0:32:16 Other ways to pronounce of Kubernetes
0:33:16 Installing ksync
0:37:29 Aside: Fun spinners and lolgopher
0:39:37 Demo app with ksync
0:47:12 Syncing a directory
0:52:38 Syncing is working!
0:53:40 Is bidirectional sync a good idea?
0:56:41 Exec to container that is sync&#39;d
0:58:10 Compiled languages and reload?
1:03:45 Architecture docs
1:04:25 Alternate approaches?
1:08:30 Wrapping up

(Last try was aborted due to technical problems. Hopefully this week we won&#39;t have the same issues!)

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Deploying applications to Kubernetes is one thing. But what about developing on Kubernetes? How do you use Kubernetes to run your application in an environment that is similar to production?

This is a super active space with a lot of interesting tools including things like Draft or newer projects like Skaffold.  In this episode we&#39;ll start to break down ways to approach this problem and look at a tool called ksync from vapor.io.

Notes/Links

* Gap between local and cluster dev experiences
  * Why run dev on cluster?
  * Languages/tools drive decisions
* Approaches
  * Auto rebuild and deploy
    * Draft - https://github.com/Azure/draft
    * Skaffold - https://github.com/GoogleCloudPlatform/skaffold
    * Questions around moving data/source?
      * Cloud builds
      * Container registry
      * Non-priv builders (img, orca-build, buildah, Bazel?)
  * Run on cluster, sync file system
    * ksync - https://github.com/vapor-ware/ksync
    * Adapt docker host volume solutions
      * http://docker-sync.io/
      * Unison -- https://www.cis.upenn.edu/~bcpierce/unison/
  * Run locally, bridge network
    * How to run locally?
      * Minikube?
      * Local container
      * Local native
      * Local node attached to remote cluster
    * Telepresence https://www.telepresence.io/
* Other stuff that came up in episode:
  * Kubernetes 1.10: http://blog.kubernetes.io/2018/03/first-beta-version-of-kubernetes-1-10.html
  * Apache Spark on K8s: http://blog.kubernetes.io/2018/03/apache-spark-23-with-native-kubernetes.html
  * Jenkins X: https://jenkins.io/blog/2018/03/19/introducing-jenkins-x/
  * Jessie&#39;s work on untrusted container builds: https://blog.jessfraz.com/post/building-container-images-securely-on-kubernetes/
  * docker-sync: http://docker-sync.io/
  * Unison: https://www.cis.upenn.edu/~bcpierce/unison/
  * Syncthing: https://syncthing.net/
  * lolgopher: https://github.com/kris-nova/lolgopher