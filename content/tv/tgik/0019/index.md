---
aliases:
- 0019
date: '2017-12-22T23:21:34Z'
description: 'TGI Kubernetes 019: Prometheus as a noob'
episode: 0019
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 019: Prometheus as a noob'
type: tv-episode
youtube: pDb2psNcvKU
---

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

This week we will be exploring monitoring with Prometheus. Joe hasn&#39;t used Prometheus before (but has used similar systems inside of Google).  We&#39;ll install it and try to get some simple metrics connected.  Let&#39;s see how far we can get in ~1.5 hours.

Links:
* Prometheus: https://prometheus.io/
* Prometheus Operator: https://github.com/coreos/prometheus-operator
* kube-prometheus config: https://github.com/coreos/prometheus-operator/tree/master/contrib/kube-prometheus
* jrnt30&#39;s patch to kuard adding metrics: https://github.com/kubernetes-up-and-running/kuard/pull/14
* Example of scraping pods directly instead of via service (thanks jrnt30!): https://github.com/prometheus/prometheus/blob/70f3d1e9f95ad6611be2e76fad44f07b0a2579ca/documentation/examples/prometheus-kubernetes.yml#L248
* Honeycomb for high cardinality observability: https://honeycomb.io/
* Scripts I used in the episode: https://gist.github.com/jbeda/50ce424c318a1862e5c619ea649f7c53

K8s weekly update links:
* KubeCon videos: https://www.youtube.com/playlist?list=PLj6h78yzYM2P-3-xqvmWaZbbI1sW-ulZb
* Joe&#39;s KubeCon talk: https://www.youtube.com/watch?v=QQsq2Ny5a4A&amp;index=58&amp;list=PLj6h78yzYM2P-3-xqvmWaZbbI1sW-ulZb
* Kubernetes 1.9 changelog: https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md
* kubeflow: https://github.com/google/kubeflow