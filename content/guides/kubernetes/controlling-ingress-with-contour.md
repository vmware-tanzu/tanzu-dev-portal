---
date: '2021-02-26'
lastmod: '2021-02-26'
parent: Service Routing
tags:
- Contour
- Envoy
title: Controlling Ingress with Contour
topics:
- Kubernetes
weight: 1
oldPath: "/content/guides/kubernetes/controlling-ingress-with-contour.md"
aliases:
- "/guides/kubernetes/controlling-ingress-with-contour"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
---

In Kubernetes, Ingress is a set of routing rules that define how external traffic is routed to an application inside a Kubernetes cluster. An Ingress controller watches for changes to objects in the cluster and then wires together a data path for each request to be resolved. An Ingress controller processes the requests for resources, provides transport layer security (TLS) termination, and performs other functions.

Ingress is an important component of Kubernetes because it cleanly separates an application from how it is accessed. A cluster administrator enables access to the application through the Ingress controller, while the application developer focuses on the application itself. Ingress, and the Ingress Controller, provide the glue that tie the two together. 

[Contour](https://projectcontour.io/) is an open source Kubernetes [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) that acts as a control plane for the Envoy edge and service proxy (see below).​ Contour supports dynamic configuration updates and multi-team ingress delegation while maintaining a lightweight profile.

Contour is built for Kubernetes to empower you to quickly deploy cloud native applications by using the flexible IngressRoute API. Contour deploys the Envoy proxy as a reverse proxy and load balancer.

### What Is Envoy?
[Envoy](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy) is a Layer 7 (application layer) bus for proxy and communication in modern service-oriented architectures, such as Kubernetes clusters. Envoy strives to make the network transparent to applications while maximizing observability to ease troubleshooting.

## What Problems Does Contour Solve?

One of the most critical needs when running workloads at scale on Kubernetes is efficient and smooth traffic Ingress management at the application layer. Getting an application up and running is not the entire story; the app still needs a way for users to access it. Contour was designed to fill this operational gap.

## Benefits of Using Contour

Here are some of the benefits of using Contour:
* Quickly deploy and integrate Envoy with a simple installation mechanism
* Safely support Ingress in multi-team Kubernetes clusters
* Cleanly integrate with the Kubernetes object model
* Dynamically update the Ingress configuration without dropped connections

## Keep Learning
Ingress and Ingress controllers remain an active topic in Kubernetes. Watch this short video for an [Introduction to Ingress](https://kube.academy/lessons/introduction-to-ingress). 

The Contour Ingress controller has become popular because of features such as the ability to do blue-green deployments using [Contour’s IngressRoute](https://tanzu.vmware.com/content/blog/deploying-new-app-versions-by-using-blue-green-deployments-with-contour-s-ingressroute). This [video](https://www.youtube.com/watch?v=xUJbTnN3Dmw) also explains blue-green deployments. This [guide](/guides/kubernetes/harbor-gs/) provides an example of deploying Contour in conjunction with Harbor, an open source registry for containers and Helm charts.