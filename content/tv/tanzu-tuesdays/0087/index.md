---
Date: '2022-03-01T12:00:00-08:00'
PublishDate: '2020-09-24T00:00:00-07:00'
Description: "Supply Chain Choreography with Cartographer"
aliases:
- /tv/tanzu-tuesdays/87
draft: false
episode: '87'
explicit: 'no'
guests:
- David Espejo
- Cora Iberkleid
hosts:
- Whitney Lee
- Tiffany Jernigan
lastmod: '2021-02-02'
minutes: 90
title: "Supply Chain Choreography with Cartographer"
truncate: ''
twitch: vmwaretanzu
youtube: "Qr-DO0E9R1Y"
type: tv-episode
---

The Kubernetes ecosystem has a rich set of solutions for various stages of CI/CD. Tools like Flux,
Tekton, kpack, Knative, ArgoCD, and more each enable big steps forward in establishing a modern 
path to production. And yet, the teams and organizations that adopt these tools still struggle 
with complex, DIY snowflake pipelines. The challenge can be creating and maintaining imperative 
scripts; orchestrating the flow of information between tools; driving reusability; adopting 
GitOps practices; and enabling proper separation of concerns.

[Cartographer](https://cartographer.sh/) is an exciting new OSS project that elegantly addresses these challenges, providing 
the backbone for a modern application platform built on top of Kubernetes. Rooted in the concept 
of declarative supply chain choreography, it focuses on creating composable, reusable roadmaps to 
drive source code to production. It provides an abstraction layer that facilitates the adoption 
and integration of existing and emerging CI/CD tools, while clearly delineating developer and 
operator ownership. It complements the existing ecosystem, filling an important gap to ease use, 
maintenance, and scalability.

In this talk, we will discuss Supply Chain Choreography as a model for CI/CD and use Cartographer
to explore how you can create secure and comprehensive pipelines, sustainably and at scale.
