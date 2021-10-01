---
date: 2020-11-11
description: Here is a curated list of some talks to watch at KubeCon NA 2020
lastmod: '2020-11-11'
tags:
- Containers
- Kubernetes
team:
- Tiffany Jernigan
title: 'KubeCon NA 2020: For the Modern App Developer'
---

[KubeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) is coming up soon! It will take place virtually November 17th-20th.

The [schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/) is chock-full of very interesting talks,from introductory overviews to advanced deep dives. When I first saw it, I ended up copying down as many talks as possible to share here because they are all just so good. But I figured I should probably curate a bit, so below you will find a list of my top recommendations, broken down, for the most part, by their respective [Special Interest Group (SIG)](https://github.com/kubernetes/community/blob/master/sig-list.md) names.

Talks with a 🌱 next to them are introductory/deep dive talks, and each SIG section header links to its respective SIG page.

### Keynotes
If you can, definitely watch all of the keynotes. There is a [complimentary pass](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/register/)  just for the keynotes if you’re unable to attend the rest of the conference.

### Sponsored
If you’re interested in seeing what cool things different companies are working on and/or are interested in, check out the sponsored sessions on [Day 1](https://kccncna20.sched.com/2020-11-17/overview/?iframe=no).

### [API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)
##### Day 2
🌱 [Admission Control, We Have a Problem - Ryan Jarvinen, Red Hat](https://kccncna20.sched.com/event/ekBb/admission-control-we-have-a-problem-ryan-jarvinen-red-hat?iframe=yes&w=100%&sidebar=yes&bg=no)

This is an interactive session that will teach you how Admission Controllers play a critical role in securing Kubernetes APIs. You will be able to “implement basic input validation and testing of webhooks for the Admission Controller.” 

##### Day 4
[Into the Deep Waters of API Machinery - Federico Bongiovanni & Daniel Smith, Google, & David Eads, Stefan Schimanski, Red Hat](https://kccncna20.sched.com/event/ekGp/into-the-deep-waters-of-api-machinery-federico-bongiovanni-daniel-smith-google-david-eads-stefan-schimanski-red-hat?iframe=yes&w=&sidebar=yes&bg=no)

### [Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
##### Day 4
🌱 [SIG Architecture Intro and Update - John Belamaric, Google & Derek Carr, Red Hat](https://kccncna20.sched.com/event/ekGs/sig-architecture-intro-and-update-john-belamaric-google-derek-carr-red-hat)

### [Autoscaling](https://github.com/kubernetes/community/blob/master/sig-autoscaling/README.md)
##### Day 2
🌱 [Introduction to Autoscaling - Guy Templeton, Skyscanner & Joe Burnett, Google](https://kccncna20.sched.com/event/ekGm/introduction-to-autoscaling-guy-templeton-skyscanner-joe-burnett-google?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk covers different types of autoscaling, how they work, and why you should use them. Best practices and gotchas will also be discussed.

### [Cluster Lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md)
##### Day 4
🌱 [Introduction to SIG Cluster Lifecycle - Lubomir I. Ivanov, VMware & Justin Santa Barbara, Google](https://kccncna20.sched.com/event/ekH4/introduction-to-sig-cluster-lifecycle-lubomir-i-ivanov-vmware-justin-santa-barbara-google?iframe=yes&w=100%&sidebar=yes&bg=no)

### Logging
##### Day 3
[Kubernetes and Logging: Do It Right - Eduardo Silva, Arm Treasure Data](https://kccncna20.sched.com/event/ekA9/kubernetes-and-logging-do-it-right-eduardo-silva-arm-treasure-data)

This talk dives into logging for distributed systems, specifically for Kubernetes environments, best practices, and available open-source tools.

### [Network](https://github.com/kubernetes/community/blob/master/sig-network/README.md)
##### Day 2
[Contour, A High Performance Multitenant Ingress Controller for Kubernetes - Michael Michael, Steve Sloka, Nick Young, & James Peach, VMware](https://kccncna20.sched.com/event/ekGX/contour-a-high-performance-multitenant-ingress-controller-for-kubernetes-michael-michael-steve-sloka-nick-young-james-peach-vmware?iframe=yes&w=100%&sidebar=yes&bg=no)

##### Day 3
🌱 [Kubernetes SIG-Network: Intro and Deep-Dive - Tim Hockin & Bowei Du, Google & Rich Renner, Sunder Networks](https://kccncna20.sched.com/event/ekHt/kubernetes-sig-network-intro-and-deep-dive-tim-hockin-bowei-du-google-rich-renner-sunder-networks?iframe=yes&w=100%&sidebar=yes&bg=no)

### Registry
##### Day 1
[Simplify Application Deployment at the Edge with Harbor - Michael Michael, Harbor](https://kccncna20.sched.com/event/fGWK/simplify-application-deployment-at-the-edge-with-harbor-michael-michael-harbor?iframe=yes&w=100%&sidebar=yes&bg=no)

In order to operate Kubernetes at the Edge, a container registry is required. This is where Harbor comes in.

##### Day 2
[Harbor- Enterprise Cloud Native Artifact Registry - Steven Zou, Daniel Jiang, Alex Xu, & Steven Ren, VMware](https://kccncna20.sched.com/event/ekI5/harbor-enterprise-cloud-native-artifact-registry-steven-zou-daniel-jiang-alex-xu-steven-ren-vmware?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk goes into detail about Project Harbor, a container registry, and its roadmap.

### [Runtime](https://github.com/cncf/sig-runtime)
##### Day 1
🌱 [Introduction and Deep Dive into containerd - Michael Crosby & Derek McGowan, Apple, Phil Estes, IBM, & Wei Fu, Alibaba](https://kccncna20.sched.com/event/ekGF/introduction-and-deep-dive-into-containerd-michael-crosby-derek-mcgowan-apple-phil-estes-ibm-wei-fu-alibaba?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk will be a combined intro to and deep dive into containerd, a container runtime.

##### Day 3
🌱 [Intro: CNCF SIG-Runtime - Ricardo Aravena, Rakuten & Renaud Gaubert , NVIDIA](https://kccncna20.sched.com/event/ekG6/intro-cncf-sig-runtime-ricardo-aravena-rakuten-renaud-gaubert-nvidia?iframe=yes&w=100%&sidebar=yes&bg=no)

In this talk, there will be an overview of current projects and future technologies that fall into the SIG-Runtime scope.

### [Security](https://github.com/kubernetes/community/blob/master/sig-security/README.md)
##### Day 2
[Open Policy Agent Intro - Patrick East, Styra & Max Smythe, Google](https://kccncna20.sched.com/event/ekI2/open-policy-agent-intro-patrick-east-styra-max-smythe-google?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk will give an intro to Open Policy Agent (OPA), which provides policy-based control for cloud native environments. To see an instance of how OPA has been used, scroll down to Day 4.

[Detecting Security Policies Violation Using Falco: A Practical Introduction - Leonardo Grasso, Sysdig](https://kccncna20.sched.com/event/ekGI/detecting-security-policies-violation-using-falco-a-practical-introduction-leonardo-grasso-sysdig?iframe=no&w=100%25&sidebar=yes&bg=no)

This talk will provide an intro to and tutorial of Falco, a runtime security tool designed to detect anomalous activity and security breaches.

##### Day 3
[A Special Interest in Cloud Native Security - Emily Fox, National Security Agency (NSA) & Brandon Lum, IBM](https://kccncna20.sched.com/event/ekG3/a-special-interest-in-cloud-native-security-emily-fox-national-security-agency-nsa-brandon-lum-ibm?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk will be about SIG-Security efforts and projects.

[Kubernetes-native Security with Starboard - Liz Rice & Daniel Pacak, Aqua Security](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)

“Starboard is an open source project that gathers security information from various different tools into Kubernetes CRDs, so users can manage & access security reports through familiar Kubernetes interfaces, like kubectl or Octant.” This talk will include multiple demos.

##### Day 4
[Using Open Policy Agent to Meet Evolving Policy Requirements - Jeremy Rickard, VMware](https://kccncna20.sched.com/event/ekEP/using-open-policy-agent-to-meet-evolving-policy-requirements-jeremy-rickard-vmware) 

This talk will cover concrete examples of how VMware has used Open Policy Agent (OPA) to implement evolving Kubernetes policy requirements and more.

### [Storage](https://github.com/kubernetes/community/blob/master/sig-storage/README.md)
##### Day 4
🌱 [Intro & Deep Dive: Kubernetes SIG-Storage - Xing Yang, VMware & Michelle Au, Google](https://kccncna20.sched.com/event/ekHD/intro-deep-dive-kubernetes-sig-storage-xing-yang-vmware-michelle-au-google?iframe=yes&w=&sidebar=yes&bg=no)

### [Usability](https://github.com/kubernetes/community/blob/master/sig-usability/README.md)
##### Day 3
[Kubernetes: Putting the Focus on Upstream Usability with SIG Usability - Tasha Drew, VMware & Gabby Moreno Cesar, IBM](https://kccncna20.sched.com/event/ekHY/kubernetes-putting-the-focus-on-upstream-usability-with-sig-usability-tasha-drew-vmware-gabby-moreno-cesar-ibm?iframe=yes&w=100%&sidebar=yes&bg=no)

This talk will focus on Kubernetes end users and how Kubernetes can help.

[Five Hundred Twenty-five Thousand Six Hundred K8s CLI’s - Phillip Wittrock & Gabbi Fisher, Apple](https://kccncna20.sched.com/event/ek9o/five-hundred-twenty-five-thousand-six-hundred-k8s-clis-phillip-wittrock-gabbi-fisher-apple)

This talk will go into a number of very useful Kubernetes-related CLIs.

### [Windows](https://github.com/kubernetes/community/blob/master/sig-windows/README.md)
##### Day 4
[Simplifying Windows Runtime and Deployment in Kubernetes - Michael Michael, VMware, Mark Rossetti & Muzz Imam, Microsoft, & Deep Debroy, Docker](https://kccncna20.sched.com/event/ekFu/simplifying-windows-runtime-and-deployment-in-kubernetes-michael-michael-vmware-mark-rossetti-muzz-imam-microsoft-deep-debroy-docker?iframe=yes&w=100%&sidebar=yes&bg=no)

When talking about containers, people often think about Linux. This talk will instead dive into Windows and Kubernetes.