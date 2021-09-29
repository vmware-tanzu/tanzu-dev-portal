---
type: "tv-episode"
title: "TGI Kubernetes 165: Pod Accoutrements ~ Start/Stop Hooks, HostProcesses, and CGroups"
description: "TGI Kubernetes 165: Pod Accoutrements ~ Start/Stop Hooks, HostProcesses, and CGroups"
episode: "165"
aliases: ["0165"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "2021-09-03 20:00:00"
minutes: 120
youtube: "VIOkk_jIGS8"
draft: "False"
---

Join Jay Vyas and Nishad Mathur as we look at
the evolving data model for pods: container lifecycle events, hooks, init pods, hostProcess containers, and other heebie-geebies in the "what's a container" domain.

- 0:00 week in review
- 1:00 surprise guest , tgik Vet mauilion from Isovalent joins us!
- 5:00 HostProcess container blog post by perithompson
- 5:31 Kubernets on Windows book
- 7:00 Ebpf summit, netns cookies, routing improvments
- 11:00 Nishad introduces his nested docker+celery problem
- 12:20 "Its friday were gonna do things right, said nobody ever"
- 15:30 PIDs inside a kind cluster is weird
- 19:15 Kernel tasks have weird names
- 23:00 containerd shim synthetic parent to the pause/runsvcdir startups,
- 24:00 pause container holding namespaces for sharing
- 25:00 containers sharing PID namespaces
- 32:00 runc creating the process for containerd/dockershim
- 33:00 containerd-shim as the holder for runc's process
- 48:00 After TerminationGracePeriods, SIGKILL 
- 49:30 SIGTERM sent first before the Kill happens
- 56:00 Init pods, pods, processes, postStart, preStop hooks
- 58:00 no gaurantee that the preStop will finish
- 1:01:00 container lifecycle hooks docs page 
- 1:07:00 kind cluster became a zombie, killing mirror pods is meaningless
- 1:08:00 "Shadow pods" oops mirror pod
- 1:09:00 trying to fix my borked kind cluster
- 1:14:00 Fei joins us 
- 1:17:00 kindnet , dualstack
- 1:20:00 systemctl -flu 
- 1:23:00 cillium port ranges pleeease so we can graduate networkpolicy API improvements to GA !
- 1:32:00 containers in the same pod have DIFFERENT pid namespaces normally unless you configure explicitly
- 1:35:00 CGroupFS vs Systemd allocator 
- 1:39:00 CgroupFS controller doesnt know about space allocated by others