---
date: '2021-02-24'
description: A list of components that platform operators should monitor
keywords:
- Kubernetes
lastmod: '2021-03-15'
linkTitle: Kubernetes Monitoring Checklist
parent: Platform Observability
title: Kubernetes Monitoring Checklist
weight: 1600
oldPath: "/content/guides/kubernetes/observability-k8s-monitoring-checklist.md"
aliases:
- "/guides/kubernetes/observability-k8s-monitoring-checklist"
level1: Managing and Operating Kubernetes
level2: Monitoring and Observing Kubernetes
---

To run a Kubernetes platform effectively, cluster administrators need visibility
into the behavior of the system. Furthermore, platform administrator need to be
alerted when any of the critical platform components are unavailable or behaving
erratically.

This guide provides a list of components that platform operators should monitor.
More importantly, it lists important conditions that operators should use to
generate alerts. The guide does not prescribe a specific monitoring or alerting
tool. Instead, it focuses on _what_ to monitor.

## How to Use This Guide

The sections below outline _conditions_ that platform operators must monitor when
operating Kubernetes. For each condition, the guide provides the following:

- _Threshold:_ The magnitude that must be exceeded to generate an alert.
- _Severity:_ The severity of the condition, given the threshold is met.
- _Metrics:_ The available metrics to monitor.
- _Notes:_ Additional information applicable to the condition.

If the condition is true and above the given threshold, the monitoring system
should generate an alert with the given severity. To keep things simple, we use
two severities in this guide: _Warning_ and _Critical_. We advise treating
critical alerts as urgent, and alerting via a pager or equivalent. Warnings are
less severe and can typically be tied to an asynchronous notification such as
email, Slack, or a ticketing system.

It is important to keep in mind that thresholds and the severity of alerts will
vary for each environment. Platform operators can use this guide as a starting
point for their monitoring implementation.

## etcd

### Member Down

- _Threshold:_ 3 minutes
- _Severity:_ Warning
- _Metrics:_ `up`
- _Notes:_ A single member failure does not have a direct impact on the
  Kubernetes cluster. However, it increases the risk of experiencing etcd quorum
  loss if additional members fail.

### Majority of Members Down

- _Threshold:_ 3 minutes
- _Severity:_ Critical
- _Metrics:_ `up`
- _Notes:_ When the majority of members are down, the cluster loses quorum and
  cannot accept writes. Existing workloads on the Kubernetes cluster continue to
  function, but any operations that require writing to etcd are not possible.
  These operations include deploying new applications, scaling existing
  workloads, adding new nodes, etc.

### No Leader

- _Threshold:_ 1 minute
- _Severity:_ Critical
- _Metrics:_ `etcd_server_has_leader`
- _Notes:_ The cluster cannot accept writes without a leader. Existing workloads
  on the Kubernetes cluster continue to function, but any operations that
  require writing to etcd are not possible. These operations include deploying
  new applications, scaling existing workloads, adding new nodes, etc.

### Increased gRPC Request Failures

- _Threshold:_ >5% failure rate for 5 minutes
- _Severity:_ Critical
- _Metrics:_ `grpc_server_handled_total`
- _Notes:_ An increase in the number of gRPC request failures can impact the
  operation of the Kubernetes cluster. The `--metrics` etcd command line flag
  must be set to `extensive` for etcd to generate request-related metrics.

### Slow gRPC Requests

- _Threshold:_ 99th percentile response time >150 milliseconds for 10 minutes
- _Severity:_ Critical
- _Metrics:_ `grpc_server_handling_seconds_bucket`
- _Notes:_ An increase in latency of gRPC requests can impact the operation of
  the Kubernetes cluster. The `--metrics` etcd command line flag must be set to
  `extensive` for etcd to generate latency-related metrics.

## Kubernetes API Server

### API Server Down

- _Threshold:_ 15 minutes
- _Severity:_ Warning
- _Metrics:_ `kube_pod_status_phase` (via
  [kube-state-metrics](#kube-state-metrics)) (when the API server is running as
  a pod)
- _Notes:_ The loss of a single API server does not have an immediate impact on
  the cluster’s operations. However, it increases the risk of a control plane
  outage if additional API servers fail.

### High Request Latency

- _Threshold:_ 99th percentile response time >4 seconds for 10 minutes
- _Severity:_ Critical
- _Metrics:_ `apiserver_request_duration_seconds_sum`,
  `apiserver_request_duration_seconds_count`,
  `apiserver_request_duration_seconds_bucket`
- _Notes:_ An increase in the request latency can impact the operation of the
  Kubernetes cluster. This abnormal increase should be investigated and
  remediated.

### High Error Rate

- _Threshold:_ >3% failure rate for 10 minutes
- _Severity:_ Critical
- _Metrics:_ `apiserver_request_total`
- _Notes:_ An increase in the request error rate can impact the operation of the
  Kubernetes cluster. This abnormal increase should be investigated and
  remediated.

### Client Certificate Expiring

- _Threshold:_ Expiration within 24 hours
- _Severity:_ Critical
- _Metrics:_ `apiserver_client_certificate_expiration_seconds_count`
- _Notes:_ A client certificate expiration will prevent cluster components from
  authenticating with each other, rendering them unable to carry out their
  function.

## Kubernetes Controller Manager

Monitoring the Controller Manager is critical to ensure the cluster can
reconcile the current state of the cluster with the users' desired state.

### Controller Manager Down

- _Threshold:_ 15 minutes
- _Severity:_ Warning
- _Metrics:_ `kube_pod_container_status_restarts_total` and
  `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics)) (when
  the Controller Manager is running as a pod)
- _Notes:_ If the cluster has multiple control plane nodes, the loss of a single
  controller manager does not have an immediate impact on the cluster's
  operations. However, it increases the risk of losing reconciliation loops if
  additional controller managers fail.

## Kubernetes Scheduler

Monitoring the scheduler is critical to ensure the cluster can place new
workloads and move existing workloads to other nodes.

### Scheduler Down

- _Threshold:_ 15 minutes
- _Severity:_ Warning
- _Metrics:_ `kube_pod_container_status_restarts_total` and
  `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics)) (when
  the scheduler is running as a pod)
- _Notes:_ If the cluster has multiple control plane nodes, the loss of a single
  scheduler does not have an immediate impact on cluster's operations. However,
  it increases the risk of losing scheduling functionality if additional
  schedulers fail.

## Node

### Kubelet Down

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `up`
- _Notes:_ If the kubelet is down, it is deemed not ready. Nodes that are not
  ready cannot accept pods. The platform evicts Pods running on a not-ready Node
  if the Node remains in that condition for longer than the pod eviction
  timeout.

### Node Not Ready

- _Threshold:_ 15 minutes
- _Severity:_ Warning
- _Metrics:_ `kube_node_status_condition`
- _Notes:_ Nodes that are not ready cannot accept pods. The platform evicts Pods
  running on a not-ready Node if the Node remains in that condition for longer
  than the pod eviction timeout.

### Node Unreachable

- _Threshold:_ 15 minutes
- _Severity:_ Warning
- _Metrics:_ `kube_node_spec_taint` (via [kube-state-metrics](#kube-state-metrics))
- _Notes:_ Nodes that are unreachable cannot accept pods. The platform evicts
  Pods running on an unreachable Node if the Node remains in that condition for
  longer than the pod eviction timeout.

### Too Many Pods

- _Threshold:_ 95% pod count capacity
- _Severity:_ Warning
- _Metrics:_ `kubelet_running_pod_count`, `kube_node_status_capacity_pods`

### File System Utilization

- _Severity:_ Critical
- _Metrics:_ `node_filesystem_avail_bytes` and `node_filesystem_size_bytes` (via
  [kube-state-metrics](#kube-state-metrics)) kube-state-metrics),
  `node_filesystem_files_free` (via [kube-state-metrics](#kube-state-metrics))

### Persistent Volume Usage

- _Threshold:_ <3% available
- _Severity:_ Critical
- _Metrics:_ `kubelet_volume_stats_available_bytes`, `kubelet_volume_stats_capacity_bytes`

### Clock Skew Detected

- _Threshold:_ Clock Skew >50 milliseconds
- _Severity:_ Critical
- _Metrics:_ `node_timex_offset_seconds` (via [kube-state-metrics](#kube-state-metrics))
- _Notes:_ Kubernetes does not tolerate clock skew between nodes in the cluster.

## kube-proxy

Monitoring kube-proxy is critical to ensure workloads can access Pods and
Services running on other nodes.

### kube-proxy Down

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_container_status_restarts_total` and
  `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics)) (when
  kube-proxy is running as a pod)
- _Notes:_ When kube-proxy is unavailable, Services are not reflected on a
  node's IPtables or IPVS configuration. Thus, applications running on the
  affected node cannot communicate with other pods using Service IPs.

## kube-state-metrics

kube-state-metrics exposes metrics about the state of the objects within a
Kubernetes cluster. The metrics cover, but are not limited to, Deployments,
ReplicaSets, Pods and Nodes.

kube-state-metrics is not built into Kubernetes. It is an extra component that
platform operators must deploy onto the cluster. For more information, see the
kube-state-metrics [GitHub
repository](https://github.com/kubernetes/kube-state-metrics).

### Pod Crash Looping

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_container_status_restarts_total`
- _Notes:_ Pods stuck in a crash-loop for extended periods of time indicate an
  issue with the application.

### Pod Not Ready

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_status_phase`
- _Notes:_ Pods stuck in the not-ready condition for extended periods of time
  indicate an issue with the application.

### Deployment Rollout Stuck

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_deployment_spec_replicas`,
  `kube_deployment_status_replicas_available` (via [kube-state-metrics](#kube-state-metrics))
- _Notes:_ The number of ready pods of a given Deployment does not match the
  number of desired replicas.

### DaemonSet Rollout Stuck

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_daemonset_status_number_ready`,
  `kube_daemonset_status_desired_number_scheduled` (via [kube-state-metrics](#kube-state-metrics))
- _Notes:_ The number of ready pods of a given DaemonSet does not match the
  number of nodes in the cluster.

### StatefulSet Rollout Stuck

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_statefulset_status_replicas_ready`,
  `kube_statefulset_status_replicas` (via [kube-state-metrics](#kube-state-metrics))
- _Notes:_ The number of ready pods of a given StatefulSet does not match the
  number of desired replicas.

### Elevated List Errors

- _Threshold:_ >10% error rate for 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_state_metrics_list_total`
- _Notes:_ If kube-state-metrics is experiencing an elevated error rate in list
  operations, it will not be able to expose metrics about Kubernetes objects
  correctly.

### Elevated Watch Errors

- _Threshold:_ >10% error rate for 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_state_metrics_watch_total`
- _Notes:_ If kube-state-metrics is experiencing an elevated error rate in watch
  operations, it will not be able to expose metrics about Kubernetes objects
  correctly.

## CoreDNS

Monitoring CoreDNS is important to ensure that applications running in the
cluster can perform service discovery using DNS. CoreDNS is essential for the
proper functioning of the Service resource in Kubernetes.

### CoreDNS is Down

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `up`
- _Notes:_ When CoreDNS is down, applications are unable to use DNS for service
  discovery.

### High Response Latency

- _Threshold:_ >20ms latency
- _Severity:_ Critical
- _Metrics:_ `coredns_dns_request_duration_seconds`
- _Notes:_ An increase in the response latency of DNS queries can impact
  application performance. The increase in latency might indicate the need to
  scale out the CoreDNS deployment.

## CNI Plugin

### Pod Not Ready

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_status_phase` and
  `kube_pod_container_status_restarts_total` (via kube-state-metrics)
- _Notes:_ Nodes with a not-ready or crashing CNI plugin are unable to start new
  pods. Network connectivity of existing pods might also be impacted.

## Ingress Controller

### Pod Down

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_status_phase` and
  `kube_pod_container_status_restarts_total` (via kube-state-metrics)
- _Notes:_ Applications exposed via the Ingress API are not accessible if
  Ingress controller pods are unavailable.

### Count of Healthy Pods not equal to number of ingress nodes

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Notes:_ Only applicable if deploying Ingress Controller as a DaemonSet that
  selects specific nodes.

## Log Forwarder

### Pod Down

- _Threshold:_ 15 minutes
- _Severity:_ Critical
- _Metrics:_ `kube_pod_status_phase` and
  `kube_pod_container_status_restarts_total` (via kube-state-metrics)
- _Notes:_ Application and platform logs are not forwarded to the centralized
  logging system if the log forwarding pods are unavailable.

## Monitoring System

In addition to monitoring the platform components mentioned above, it is of
critical importance that platform operators monitor their monitoring system. To
achieve this, operators typically implement a ["Dead man's
switch"](https://en.wikipedia.org/wiki/Dead_man%27s_switch).

Implementations can vary across monitoring systems. But typically, the Dead
man's switch is implemented as an alert that is always triggering. The alert is
delivered to an external system that expects the alert to be triggering
constantly. In the case that the alert stops, the external system alerts the
platform operator to let them know the monitoring system is down.

Another approach is to implement a watchdog pattern, where a test alert is
generated every N seconds and sent to an external system. If the alert does not
flow through the system, then platform operators know there is an issue.

[kube-state-metrics]: https://github.com/kubernetes/kube-state-metrics
[node-exporter]: https://github.com/prometheus/node_exporter