---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: Service Mesh
title: What is a Service Mesh?
topics:
- Kubernetes
- Containers
- Microservices
weight:
oldPath: "/content/guides/microservices/what-is-service-mesh.md"
aliases:
- "/guides/microservices/what-is-service-mesh"
level1: Modern App Basics
level2: DevOps Practices
---

Microservices are the key to building applications that scale to meet changing business demands. A microservices architecture breaks up the functions of an application into a set of small, discrete, decentralized, goal-oriented processes, each of which can be independently developed, tested, deployed, replaced, and scaled. 

However, when an application has many discrete services that need to communicate with one another, communication pathways can quickly become complex. A *service mesh* decouples a service from having to know about the network, managing the interactions of microservices at the application layer (rather than at the level of virtual IP addresses and ports). 

A service mesh provides a dedicated infrastructure layer that enables communication between microservices and typically also has mechanisms to more gracefully deal with communications problems and network congestion. 

Separate sidecar proxies are often used in a service mesh. Sidecars sit alongside each service, and all the sidecars interconnect, creating a mesh that allows you to  more easily connect, secure, control, and observe services. A service mesh may also provide service discovery, forwarding, monitoring, and service-to-service authentication.

There are a large number of open source service mesh offerings, so choosing can be a challenge, but two of the most well known are Istio and Linkerd. 

* [Istio](https://istio.io/) “layers transparently onto existing distributed applications. It is also a platform, including APIs that let it integrate into any logging platform, or telemetry or policy system. Istio’s diverse feature set lets you successfully, and efficiently, run a distributed microservice architecture, and provides a uniform way to secure, connect, and monitor microservices.” 

 * [Linkerd](https://linkerd.io) “makes running services easier and safer by giving you runtime debugging, observability, reliability, and security—all without requiring any changes to your code.” 

(If you are working in a VMware Cloud environment, you may want to consider  [VMware Tanzu Service Mesh](https://tanzu.vmware.com/service-mesh).)

Given the proliferation of service mesh offerings, it’s good news that some standards are starting to emerge:

* [Service Mesh Interface or SMI](https://smi-spec.io) is a specification for service meshes that run on Kubernetes. It defines a common standard that can be implemented by a variety of providers. This allows for both standardization for end-users and innovation by providers. [SMI github](https://github.com/servicemeshinterface/smi-spec)

* [Open Service Mesh](https://openservicemesh.io)is a lightweight, extensible, service mesh that allows you to uniformly manage, secure, and get out-of-the-box observability features. “The OSM project builds on the ideas and implementations of many cloud native ecosystem projects including Linkerd, Istio, Consul, Envoy, Kuma, Helm, and the SMI specification.” This project is still under development and not ready for production workloads.

## Keep Learning
If you want to learn more about service mesh, what it is, and when to use it, the article [The Service Mesh: What Every Software Engineer Needs to Know about the World's Most Over-Hyped Technology](https://buoyant.io/service-mesh-manifesto/) from one of the creators of Linkerd will probably help fill in a lot of the gaps in your knowledge.

If you’re intrigued by Open Service Mesh and SMI, [Josh Rosso digs into the details in TGI Kubernetes #136](https://github.com/vmware-tanzu/tgik/tree/master/episodes/136). The SMI and OSM Overview start at about minute 31 in the video. 

Learn more about VMware Tanzu Service Mesh in the [product documentation](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/index.html).