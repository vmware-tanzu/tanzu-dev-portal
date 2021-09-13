---
type: "tv-episode"
title: "TGI Kubernetes Episode 162 : CNI code surfing !!!"
description: "TGI Kubernetes Episode 162 : CNI code surfing !!!"
episode: "162"
aliases: ["0162"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "2021-07-30 20:00:00"
minutes: 120
youtube: "tEIx8h76BQE"
draft: "False"
---

Join us as we surf through the design and architecture of different CNI providers. (Antrea, Calico, and maybe some others if we have time), looking at how they bootstrap themselves in different OS's, how they reuse core CNI logic and library components,  and how they setup daemonsets (agents) as well as CNI controllers for integrating NetworkPolicy information.

- 1:00 - introduction
- 4:00 - kpng, 
- 22:00 - oops need helm3 for cilium
- 25:00 - cilium installation, ebpf and xdp
- 30:00 - cilium ~ needs Kernel 4.17 !
- 34:00 - tigera operator, controllers
- 38:00 - calico controller vs cillium controller
- 40:00 - calico node and felix
- 44:00 - calico apiserver and lib-calico
- 50:00 - conversion.go and lib-calico
- 52:00 - casey davenport arrives !
- 53:00 - the calico controller - non-critical
- 54:00 - calico 3.20 on the way, iptables + ebpf modes, and how ipam is managed
- 1:10:00 - trying out multus
- 1:13:00 - /etc/cni and containerd CNI Add
- 1:20:00 - trying to install flannel / antrea as secondary CNIs
- 1:30:00 - intro to antrea 
- 1:34:00 - calico-node vs antrea node on windows