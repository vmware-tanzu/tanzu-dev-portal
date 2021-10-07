---
date: '2021-02-26'
lastmod: '2021-02-26'
parent: Platform Observability
patterns:
- Observability
tags:
- Kubernetes
- Observability
- Prometheus
- Grafana
- Wavefront
- Microservices
title: Kubernetes Monitoring Overview
weight: 1
oldPath: "/content/guides/kubernetes/observability-kubernetes-monitoring-overview.md"
aliases:
- "/guides/kubernetes/observability-kubernetes-monitoring-overview"
level1: Managing and Operating Kubernetes
level2: Monitoring and Observing Kubernetes
---

Observability is a key element of cloud native application architectures. Most modern applications are distributed in nature, with a collection of multiple modules that communicate with each other via APIs. Anytime a problem occurs you need to be able to see when and where failures happened. And you need to measure failures to establish a profile or baseline against which deviations from normal operation can be identified and addressed. As such, monitoring, feature-rich metrics, alerting tools, and data visualization frameworks are a key element of successful cloud native applications.

This guide provides an overview of monitoring tools for Kubernetes environments.

## How Is Monitoring Apps on Kubernetes Different?

Containerized systems such as Kubernetes present new monitoring challenges versus virtual-machine-based compute environments. These differences include:

* The ephemeral nature of containers
* An increased density of objects, services, and metrics within a given node
* A focus on services, rather than machines
* More diverse consumers of monitoring data 
* Changes in the software development lifecycle

As monolithic apps are refactored into microservices and orchestrated with Kubernetes, requirements for monitoring those apps change. To start, instrumentation to capture application data needs to be at a container level, at scale, across thousands of endpoints. Because Kubernetes workloads are ephemeral by default and can start or stop at any time, application monitoring must be dynamic and aware of Kubernetes labels and namespaces. A consistent set of rules or alerts must be applied to all pods, new and old.

Observability should always be a consideration when you’re developing new apps or refactoring existing ones. Maintaining a common layer of baseline metrics that applies to all apps and infrastructure while incorporating custom metrics is extremely desirable. Adding a new metric based on user feedback should NOT trigger a major replumb of your monitoring stack.

## Monitoring Resource Consumption and Preventing Infiltration

How can you protect your Kubernetes system from hijackers and infiltrators? Here are some suggestions:

* Monitor cluster and network utilization
* Monitor for suspicious activity and analyze failed login and RBAC events
* Monitor configurations, such as dashboard access, for risks and vulnerabilities

The NIST document, [Security Assurance Requirements for Linux Application Container Deployments](https://nvlpubs.nist.gov/nistpubs/ir/2017/NIST.IR.8176.pdf) sets forth security requirements and countermeasures to help meet the recommendations of the [NIST Application Container Security Guide](https://csrc.nist.gov/publications/detail/sp/800-190/final) when containerized applications are deployed in production environments. According to NIST, you should log and monitor resource consumption of containers to ensure availability of critical resources.

### Security monitoring and auditing

The proper security monitoring for your cluster depends largely on the amount of time and staffing you have to respond to alerts and keep an eye on things. As a general rule, you shouldn't spend time building security monitoring systems that you don't have the time to maintain and tune. Start with the real-time \(alert-based\) and periodic \(audit review\) analyst or operator workflows you want to enable, and build the monitoring platform you need to enable those workflows.

### Logging

The bedrock of security monitoring is logging. You should generally capture application logs, host-level logs, Kubernetes API audit logs, and cloud-provider logs \(if applicable\). There are well-established patterns for implementing log aggregation on common cluster configurations.

Centralized logging is an essential part of any enterprise Kubernetes deployment. Configuring and maintaining a real-time high-performance central repository for log collection can ease the day-to-day operations of tracking what went wrong and its impact. Effective central logging also helps development teams quickly observe application logs to characterize application performance. Security compliance and auditing often require a company to maintain digital trails of who did what and when. In most cases, a robust logging solution is the most efficient way to satisfy these requirements

For security auditing purposes, consider streaming your logs to an external location with append-only access from within your cluster. For example, on AWS, you can create an S3 bucket in an isolated AWS account and give append-only access to your cluster log aggregator. This ensures your logs cannot be tampered with, even in the case of a total cluster compromise.

##### Log Aggregation

An effective log aggregator must support the processing of events from thousands of endpoints, the ability to accommodate real-time queries, and a superior analytics engine to provide intelligent metrics to solve complex technical and business problems. You have the option to implement log aggregation using a number of popular open source or commercial logging analytics solutions, such as Elasticsearch, Fluentd, Kibana, or Splunk. Each solution has a set of strengths and weaknesses. 

[Fluentd](https://www.fluentd.org) is an open-source data collector for unified logging. [Fluent Bit](https://fluentbit.io) is a lightweight data forwarder for Fluentd. Fluentd is used to create a unified logging layer to collect and process data. Fluent Bit is for forwarding data from the edge to Fluentd aggregators. Fluentd and Fluent Bit can collect logging data and push it to an output destination, such as [Elasticsearch](https://www.elastic.co), which is a distributed search and analytics engine that lets data engineers query unstructured, structured, and time-series data.

### Network monitoring

Network-based security monitoring tools, such as a network intrusion detection system \(IDS\) and web application firewalls, may work nearly out of the box, but making them work well takes some effort. The biggest hurdle is that many tools expect IP addresses to be a useful context for events. To integrate these tools with Kubernetes, consider enriching the collected events with Kubernetes `namespace`, `pod name`, and `pod label` metadata. This adds valuable context to the event that you can use for alerting or manual review and can make these traditional tools even more powerful in a Kubernetes cluster than in a traditional environment. Some monitoring tools can collect Kubernetes metadata, but you can also write custom event enrichment code to add this kind of metadata integration to those that don't. 

### Host event monitoring

It's also possible to run a host-based IDS, such as file integrity monitoring and Linux system call logging \(for example, auditd\), directly with Kubernetes, but the results are hard to manage because the workload running on any particular node varies from hour to hour as applications deploy and Kubernetes orchestrates pods.

To make sense of host-based events, you'll again want to consider extending your existing tools to include Kubernetes pod or container metadata in the context of captured events. Systems such as [Sysdig Falco](https://sysdig.com/opensource/falco/) include this context out of the box.

### Prometheus and Grafana

The open-source community is converging on [Prometheus](https://prometheus.io) as a preferred solution for Kubernetes monitoring. The ability to address evolving requirements of Kubernetes while including a rich set of language-specific client libraries gives Prometheus an advantage.

Prometheus excels at monitoring multidimensional data, including time-series data, and it is hosted by the Cloud Native Computing Foundation, of which VMware is a member. [Grafana](https://grafana.com) is an open-source metrics dashboard commonly used with Prometheus to display data. 

### Wavefront

Kubernetes can be integrated with Wavefront (VMware Tanzu Observability) to efficiently monitor containers at enterprise scale. Wavefront delivers monitoring and analytics throughout a cloud native stack for always-on metrics as a service.Wavefront gives developers and DevOps real-time visibility into the operations and performance of containerized workloads and Kubernetes clusters.

## Keep Learning

KubeAcademy offers a course on [Kubernetes observability](https://kube.academy/courses/introduction-to-observability) where you can learn more about many of the topics mentioned above. For a practical guide on how to get started with Prometheus and Grafana, be sure to read [Prometheus and Grafana: Gathering Metrics from Kubernetes](/guides/kubernetes/prometheus-grafana-p1/). Spring Boot users will also want to check out [Prometheus and Grafana: Gathering Metrics from Spring Boot on Kubernetes](/guides/spring/spring-prometheus/) to learn how to gather metrics from Spring applications. The guides [Implementing Distributed Tracing](/guides/microservices/distributed-tracing) and [Getting Started with Zipkin and Spring Boot](/guides/spring/spring-zipkin/) can help you improve observability for microservices applications.

If you’re considering Wavefront, be sure and read [Monitoring Containers at Scale with Wavefront](/guides/kubernetes/monitoring-at-scale-wavefront) and [Wavefront for Spring Boot: Getting Started](/guides/spring/spring-wavefront-gs/).