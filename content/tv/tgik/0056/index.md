---
aliases:
- '0056'
date: '2018-11-02T22:17:11Z'
description: 'TGI Kubernetes 056: Heptio Contour and IngressRoute'
episode: '0056'
lastmod: '2021-04-20'
publishdate: '2020-08-10'
title: 'TGI Kubernetes 056: Heptio Contour and IngressRoute'
type: tv-episode
youtube: BSKU6QHOvVE
---

Come hang out with Joe Beda as he does a bit of hands on exploration of Kubernetes and related topics. Some of this will be Joe talking about the things he knows well. Some of this will be Joe exploring something new with the audience. Ask questions, comment and help decide where things go.

Heptio Contour is an &#34;ingress controller&#34; that uses Kubernetes objects to configure Envoy. With Contour v0.6 and v0.7, it has introduced a new CRD called the &#34;IngressRoute&#34;. We are going to dig into what this is, how it works and why Contour went this direction.

Show notes: https://github.com/heptio/tgik/tree/master/episodes/056

Partial index:
- 00:22 Load Balancers and Ingress 
- Network traffic comes the user, goes to a software load balancer, say ELB.
- ELB routes into a software load balancer in your cluster, say nginx.
    - 00:34 Question from the audience: Is there a performance hit? In AWS the NLB is transparent to the network. 
- nginx picks a service in a cluster to route traffic to. If you say foo.com, go to service 1. That service is considered the _upstream_. It&#39;s very confusing. &#34;Down is upstream&#34;
- 00:29 Limitations in Ingress protecting namespaces from stepping on each other
- 00:31 Clarifying what we mean by upstream
- 00:34 Installing Contour
    - [Deploying on AWS with NLB](https://github.com/heptio/contour/blob/master/docs/deploy-aws-nlb.md)
    - [Documentation](https://github.com/heptio/contour/tree/master/docs)
- 00:37 Investigating the yaml we use to install Contour
    - Pro tip to new listeners: Joe will typically spend time going through yaml files before deployment to see exactly what something does on your cluster before applying. Good habit to get in to!
- 00:50 We&#39;re up and running!