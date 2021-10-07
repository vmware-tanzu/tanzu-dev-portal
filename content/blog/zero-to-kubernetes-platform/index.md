---
title: "Zero to Kubernetes Platform"
description: An introduction to the primary concerns organizations should consider when building a Kubernetes application platform.
date: "2021-10-06"
level1: Building a Kubernetes Runtime
level2: Building Your Kubernetes Platform
tags:
- Kubernetes
# Author(s)
team:
- Rich Lander
---

Are you thinking about building an application platform with Kubernetes?  If so, this article is for you.  It discusses the major platform elements that you should consider. To some degree, every use case is different. You likely have your own edge cases and unique requirements, but by the time you solve the necessary items in this article, you will be familiar enough with the topic to get the job done.

![Photo by Mohammad Bagher Adib Behrooz on Unsplash](images/mohammad-bagher-adib-behrooz-XHI-S_xWK28-unsplash.jpg "There are a lot of steps to building a Kubernetes platfrom.")

The first thing to recognize is that Kubernetes is a container orchestrator. Scheduling and running containerized workloads across clusters of machines is a complex concern. Kubernetes uses sophisticated systems to achieve these ends but it’s purpose is fairly narrow. Kubernetes provides interfaces for container networking, persistent storage and container runtime, but it does not solve them directly, or provide enterprise-grade authentication for it's API.  Instead, Kubernetes allows you to configure a webhook to implement this functionality. It does not provide comprehensive tenancy, observability, service routing or policy control systems. Platform services must be installed to provide these.

Therein lies the first pattern to familiarize yourself with when using Kubernetes: it is a supremely extensible and composable system. Kubernetes provides the foundation upon which to build an application platform that meets your organization's specific needs. It does incur the burden of composing a solution to meet your requirements but that added work provides the opportunity and reward of incredible flexibility.  And the benefit of customized cloud native systems that are autoscaling, self-healing and highly automated have proven to be massively beneficial.

## Cost Benefit Analysis

Before we dive into the specifics, let’s double-check that Kubernetes is the best solution for your organization. For example, if you have a single website to deploy, it is unlikely that such a powerful container orchestrator like Kubernetes is necessary for your requirements. On the other hand, if you are a global enterprise with an army of developers and hundreds of distinct workloads to run, Kubernetes is likely to be the best choice for your organization. In fact, it's a safe bet you're already using it. Most prospective Kubernetes users are somewhere in between and will have to evaluate the cost of implementing a Kubernetes platform against the expected benefits.

By the end of this article, you will have a sense of the engineering cost to expect. When you weigh the benefits, consider the time savings gained through automation and the innovation that will be possible due to those savings. And, assuming you expect this effort to be profitable, continue to re-evaluate these costs and benefits as you progress to ensure each decision is rooted in valid business outcomes.

Next, think about how you're going to deploy Kubernetes. Broadly speaking, there are three options to tackle deployment.

* **Option 1**: A managed service from a cloud provider, such as Amazon EKS, Azure AKS or Google GKE. This method requires the least platform engineering effort, but also has the least flexibility and customizability.

* **Option 2**: A Kubernetes distribution such as VMware Tanzu, Red Hat OpenShift, Rancher RKE or other open source, community-supported equivalent. This method provides a balance between engineering cost and flexibility, but also either comes with the dollar cost of enterprise support or the engineering cost of in-house support.

* **Option 3**: A custom-built Kubernetes platform. This method requires the most engineering effort but also provides complete flexibility and customizability. This option should only be tackled by teams with deep experience and unique requirements.

The correct answer for your organization depends on your budget, the expertise and size of the team you can devote to platform engineering, and the requirements your tenant applications and teams have for the platform.

For the purposes of this article, we will assume Options 1 or 2.  These are the common options.  If you are tackling Option 3, the scope of your project will not be adequately covered by this article.

## What to Include?

Now, let's get to the point. What do you need to add to Kubernetes to get from zero to a production-ready application platform? In this article, we’re going to reference open source projects as examples to illustrate the functionality required. We’re also going to skip a few low level necessities like container networking and container runtime plugins because these are almost certainly determined by the Kubernetes distribution or managed service you are using. They may offer alternative solutions for some of the platform services we're discussing here that you may want to also consider.

### Storage Integration

You can skip this section if your initial release does not host stateful workloads. Some organizations identify stateless workloads as the first adopters of a Kubernetes platform to simplify the requirements of the platform. This is a valid strategy. Get all the sharp edges filed down with less complicated use cases, then add more features as you go.

If persistent storage is a requirement, you must first identify a storage provider. If you are using a cloud provider, you can use Amazon EBS or Azure Disk Storage, for example. Where applicable, you may use an on-prem solution like NetApp, VMware vSAN, or your own storage appliances managed by an open source project like Ceph. Whatever the case, your storage vendor or system must offer a Container Storage Interface (CSI) implementation that allows the storage to be exposed to containerized workloads in your Kubernetes clusters. These CSI implementations will be workloads that run in your cluster, watch for storage requests and satisfy them with integrations into the underlying storage systems. Each of the examples mentioned here have CSI implementations, but there are many others that you can find in the [CNCF storage landscape](https://landscape.cncf.io/card-mode?category=cloud-native-storage&grouping=category).

![Storage Integration](images/storage-integration.jpg)

### Service Routing

It is very likely your platform will host workloads that receive requests coming into your Kubernetes clusters from external clients. There are ways to solve this without using an ingress layer. For example, you can use a Kubernetes Service of type `LoadBalancer` if you have an infrastructure provider that will dynamically spin up a load balancer such as an elastic load balancing (ELB) in Amazon Web Services (AWS). However, if you do this for every distinct workload that needs to handle requests coming from external clients, you can quickly run up a significant bill on load balancers alone.

![Load Balancer per Workload](images/lb-per-workload.jpg)

Usually, it is preferable to connect one of these load balancers to an ingress layer. In this scenario, all requests into the cluster are routed to an ingress controller which proxies requests to the appropriate services in the cluster based on ingress resource configurations. There are popular open source projects such as the [NGINX ingress controller](https://github.com/kubernetes/ingress-nginx) and [Contour](https://github.com/projectcontour/contour) that can provide this functionality. There are several more in the [CNCF service proxy landscape](https://landscape.cncf.io/card-mode?category=service-proxy&grouping=category).

![Ingress Controller](images/ingress-controller.jpg)

On the topic of service routing, questions around service mesh often come up that extend beyond mere ingress concerns and include more sophisticated features for layer 7 traffic routing. If you have compelling requirements for features like mutual transport layer security (TLS) or traffic control based on request contents or weighting, check out the projects in the [CNCF service mesh landscape](https://landscape.cncf.io/card-mode?category=service-mesh&grouping=category). It’s important to note that these systems are necessarily complex. Unless you _really_ need these features in your MVP, postpone this to a later release of your application platform.

### Observability

You will need to capture workload logs that you aggregate and forward to a logging back end. Most organizations already have a back end like Splunk or Elasticsearch that stores and exposes logs to those that need to access them. Your platform engineering team will need to install platform services to aggregate and forward them to this back end. 

[Fluentd](https://github.com/fluent/fluentd) and [Fluent Bit](https://github.com/fluent/fluent-bit) are two popular projects in this space, with good reason. Fluent Bit is written in C, is fast and efficient. Fluentd has a larger resource footprint but has a richer ecosystem of plugins for different data sources and outputs. A common logging solution for Kubernetes is to use Fluent Bit as the node forwarding agent. The logs are either forwarded directly to the back end or to an in-cluster Fluentd aggregator that processes the logs and, in turn, forwards them to the back end.

Another essential is the collection and processing of application metrics. If you already use a service like Data Dog, Dynatrace, New Relic or Tanzu Observability, this may be an easy question to answer. If not, you will want to give [Prometheus](https://github.com/prometheus/prometheus) a look. Prometheus is Kubernetes-native in that the Kubernetes components expose Prometheus metrics. Even if your tenant workloads don't expose Prometheus metrics, you will be able to get a good number of basic metrics like CPU and memory usage for your workloads out of the box. Add on Kibana for visualization and Alertmanager (another Prometheus project) for alert management and you have accounted for a few of the essentials. 

If you go down this path, strongly consider using the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) to help manage your metrics systems. However, be warned: managing metrics is complex. Even with the essential ingredients in place, you will inevitably have to tackle long term storage and federation of metrics from various different clusters. These are not trivial challenges. There are some wonderful projects such as [cortex](https://github.com/cortexproject/cortex) and [Thanos](https://github.com/thanos-io/thanos) to help in these endeavors, but be prepared for a considerable engineering investment. 

Because Prometheus is the de facto standard for metrics in Kubernetes, most vendors support Prometheus metrics. So, if managing a Prometheus stack seems daunting, check with your preferred monitoring vendor to see what they offer for Kubernetes platforms.

Tracing is another observability concern that is commonly required. If your organization uses service-oriented software systems with a lot of distinct workloads, this will be an important concern. Many monitoring vendors, such as those mentioned above, offer features for distributed tracing so that your teams can better evaluate and troubleshoot distributed systems. There are also some open source projects such as [Jaeger](https://github.com/jaegertracing/jaeger) and [Zipkin](https://github.com/openzipkin/zipkin) that can be leveraged to provide tracing as a platform service.

### Platform Security

Your requirements in this area will depend on the nature of the data you manage. For example, if you process credit card payments, your requirements will be stricter than that of a message board. It is important to consult with your organization's security team to identify the measures you should take. Here are a few essentials that almost everyone will need to take into account.

It's fair to say everyone needs to manage TLS assets. Rotating TLS certificates can be a pain. But if you let them expire, you have a code red emergency. Strongly consider using [cert-manager](https://github.com/jetstack/cert-manager) to help automate the process of cert rotation. It integrates with several issuers, including [Let's Encrypt](https://letsencrypt.org/), [Venafi](https://www.venafi.com/) and [Vault](https://github.com/hashicorp/vault).

Speaking of HashiCorp Vault, it is a general purpose secret management solution that you should consider if the use of native Kubernetes Secrets,even when encrypted in transit and at rest,are insufficient. Regardless of which secret management system you use, give careful thought to how the secrets are generated, stored, rotated and accessed by your applications. Plan this out with your security team to ensure sensitive data isn't inadvertently exposed.

You will almost certainly want to tie your Kubernetes API servers to your organization's identity systems, whether that be an Lightweight Directory Access Protocol (LDAP), Active Directory server, or perhaps some OAuth provider. [Dex](https://github.com/dexidp/dex) is an OpenID Connect provider that integrates the Kubernetes API with your identity provider. Another project to emerge more recently is [Pinniped](https://github.com/vmware-tanzu/pinniped) which is worth evaluating, too.

Network policies will be another important consideration in this area. This is a concern that hinges largely on the systems you implement to manage the rules you need. Assuming the Container Networking Interface (CNI) plugin you employ implements network policies, you will need a declarative, reliable way to lay down the Kubernetes NetworkPolicy resources to enforce your rules. This is often accomplished through the deployment pipelines that create clusters, namespaces and/or workloads. Some CNI solutions employ custom resources in addition to, or as an alternative to, Kubernetes NetworkPolicy resources. In these cases, weigh the value of the enhanced features against the dependency lock-in for that project or product.

Policy management through admission control is an area that is relevant to security but also extends beyond that, into tenancy and general platform user experience. Custom policy implementation will be essential to production-readiness. They allow your platform administrators to place important controls on the creation, mutation and deletion of Kubernetes resources. [Open Policy Agent](https://github.com/open-policy-agent/opa) (OPA) is a mature and widely adopted solution which has a policy controller called [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) for Kubernetes. OPA uses a purpose-built policy language called Rego. If learning a new language for policy implementation is distasteful, check out [Kyverno](https://github.com/kyverno/kyverno) which uses custom Kubernetes resources to configure policies.

Kubernetes has a capable role-based access control system using Role, RoleBinding and ServiceAccount resources, but you will need a cohesive method for implementing these resources. If the developers of your tenant applications are left to their own devices in this area, you risk giving them a bad experience with the tedium of constructing these resources and you run the liability of the platform tenants creating overly permissive roles as a workaround to that tedium. Getting the Role-Based Access Control (RBAC) systems right is tricky. One project that can help provide useful abstractions is [RBAC Manager](https://github.com/FairwindsOps/rbac-manager).

One other important consideration is runtime security. Each of the security concerns above will help prevent your systems from being compromised. However, if those preventative measures fail, you will want to be alerted.  Runtime security monitors your platform for violations of security rules and alerts your platform operators if violations occur. There are numerous vendors that offer services in this area. [Falco](https://github.com/falcosecurity/falco) is a popular open source project that may fulfill this function for your organization.

### Tenancy

Namespaces are the primary Kubernetes mechanism for managing tenancy. However, just creating namespaces is insufficient. Namespaced roles and role bindings for various users and service accounts are also needed. Resource quotas and limit ranges will also usually be a requirement. You'll likely want network policies for network controls. Additionally, you will likely need image pull secrets to access container images for the workloads that will run there. The bottom line is that systems for installing _all_ the various resources for a namespace will need to be implemented. This can be done through supply chain systems whereby a CI/CD pipeline installs all the resources that have been created in version control, or can be managed with a custom Kubernetes operator whereby a custom resource contains the important configuration information and the operator understands what resources to create based on the specification in the custom resource.

Suffice to say, smooth operation of your tenancy systems is critical to gaining a happy adoption of your app platform among your organization's development teams.

## Summary

The topics covered in this article cover the common essential platform components you will need. However, there is one essential component not addressed: the tenant applications. Don't build these platforms in isolation. Identify the tenant workload/s that will use the first release of your platform and ensure the platform meets their requirements. Make pre-release versions of it available for testing and maintain a healthy feedback loop with the teams that develop and manage these workloads. They are the entire reason for the platform, after all.  
