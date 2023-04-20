---
Date: '2023-04-27T11:00:00-07:00'
Description: "Distributed Systems Patterns – What is Possible with eBPF Compared to Spring Cloud, Kubernetes, and Service Meshes"
PublishDate: '2023-01-18T00:00:00-08:00'
date: '2023-04-27'
episode: '26'
explicit: 'no'
calendar: true
guests:
- Matthias Haeussler
hosts:
- Nate Schutta
lastmod: '2020-10-09'
title: "Distributed Systems Patterns – What is Possible with eBPF Compared to Spring Cloud, Kubernetes, and Service Meshes"
twitch: vmwaretanzu
youtube: r0jpL76EZ_A
type: tv-episode
---

Software development based on a distributed (microservice) architecture provides both several advantages and new challenges. In order to take advantage of the distribution it requires implementation of service discovery, routing, load-balancing, resilience mechanisms and more. In the ecosystem of Spring there is Spring Cloud, which provides dedicated libraries to address exactly those challenges. If the distributed architecture is running on top of Kubernetes there are alternative ways directly built in the platform. So-called service mesh implementations extend Kubernetes for advanced network control. They are not part of the actual application code, but interact as a side-car of the container. A fairly new approach is emerging with the eBPF technology, which runs as part of the Linux kernel. This approach claims to enable service meshes functionality with minimal overhead. With this talk I want to compare the different options and outline which solution or combination is beneficial. The talk is split into a theoretical and a live-demo part.