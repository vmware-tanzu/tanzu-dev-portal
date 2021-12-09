---
Date: '2021-11-09T12:00:00-08:00'
PublishDate: '2020-09-24T00:00:00-07:00'
Description: "Carvel support in Kubeapps - New pluggable gRPC-based architecture"
aliases:
- /tv/tanzu-tuesdays/74
draft: false
episode: '74'
explicit: 'no'
guests:
- Miguel Martinez
- Antonio Gámez Díaz
hosts:
- Tiffany Jernigan
- Whitney Lee
- Leigh Capili
lastmod: '2021-11-09'
minutes: 60
title: "Carvel support in Kubeapps - New pluggable gRPC-based architecture"
truncate: ''
twitch: vmwaretanzu
youtube: "rS2AhcIPQEs"
type: tv-episode
---

At conception, Kubeapps was created as a Kubernetes application dashboard designed with the only packaging format of the time in mind: Helm charts. As the Kubernetes landscape for packages has grown, we needed an extensible way to expand Kubeapps to support new packaging formats such as declarative Flux resources, Carvel bundles and other future packaging formats.  In this session you'll learn about current technical limitations and how the team is overcoming them by designing a plugins-based, extensible, clear API boundary.