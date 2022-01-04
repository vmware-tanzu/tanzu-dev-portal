---
aliases:
- 0028
date: '2018-03-02T22:51:20Z'
description: 'TGI Kubernetes 028: Exploring CockroachDB on Kubernetes'
episode: 0028
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 028: Exploring CockroachDB on Kubernetes'
type: tv-episode
youtube: JMCCeAb9eY4
---

Index

0:00:00 - Intros
0:02:50 - Container World
0:04:00 - How to deploy web applications on K8s with Countour &#43; LetsEncrypt
0:07:28 - Kubernetes in CNCF incubation
0:09:40 - Debugging scratch containers
0:13:19 - Stateful Sets and Stateful Workloads in Kubernetes
0:14:20 - Defining Stateful Workloads
0:20:15 - Understanding StatefulSets
0:20:00 - Jetstack Navigator
0:39:06 - Launching CockroachDB
0:40:04 - Inspecting the Cockroach Manifests
0:50:30 - Applying CockroachDB
0:51:18 - Readiness checks with CockroachDB
0:55:15 - Observing CockroachDB coming up in Kubernetes
0:56:39 - Approving the CSR
0:59:27 - Secrets
1:02:27 - Common name &#34;root&#34; with CSRs in CockroachDB
1:05:04 - Creating a database called &#34;bank&#34;
1:06:24 - Port forwarding and accessing the UI
1:11:33 - Getting kuard running
1:12:45 - DNS with CockroachDB
1:14:35 - Advanced features of the CockroachDB UI
1:16:49 - CockroachDB and etcd
1:20:30 - Taking down an instance of the cluster
1:28:02 - Debugging pods and pvcs after an outage
1:34:06 - Tearing down the cluster
1:40:16 - Q&amp;A


Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Stateful service and applications are a hot topic in the Kubernetes world. In this episode I&#39;ll talk in general about how I view state on Kubernetes and then we&#39;ll explore a system built for a dynamic Kubernetes like environment -- CockroachDB

Links:
* Dave&#39;s guide to HTTPS Ingress. Contour &#43; Let&#39;s Encrypt &#43; cert-manager: https://blog.heptio.com/how-to-deploy-web-applications-on-kubernetes-with-heptio-contour-and-lets-encrypt-d58efbad9f56
* Blog post based TGIK 027 on securing the k8s dashboard: https://blog.heptio.com/on-securing-the-kubernetes-dashboard-16b09b1b7aca
* Kubernetes is graduating! https://lists.cncf.io/g/cncf-toc/topic/vote_kubernetes_moving_to/12935280?p=,,,20,0,0,0::recentpostdate%2Fsticky,,,20,2,0,12935280
* Debugging &#34;From Scratch&#34; containers: https://ahmet.im/blog/debugging-scratch/
* StatefulSet basics: https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/#writing-to-stable-storage
* Jetstack Navigator for managing Cassandra and Elasticsearch: https://github.com/jetstack/navigator
* Metacontroller catset: https://github.com/kstmp/metacontroller/tree/master/examples/catset
* Secure install of Cockroachdb: https://www.cockroachlabs.com/docs/stable/orchestrate-cockroachdb-with-kubernetes.html
* &#34;Scaling Raft&#34; talks about raft in Cockroachdb (from 2015 -- may be out of date?) https://www.cockroachlabs.com/blog/scaling-raft/