---
title: "Kubernetes Monitoring Checklist"
linkTitle: "Kubernetes Monitoring Checklist"
description: "A list of components that platform operators should monitor"
parent: "Observability"
weight: 1600
keywords:
- Kubernetes
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

- _Threshold_: The magnitude that must be exceeded to generate an alert.
- _Severity_: The severity of the condition, given the threshold is met.
- _Metrics_: The available metrics to monitor.
- _Notes_: Additional information applicable to the condition.

If the condition is true and above the given threshold, the monitoring system
should generate an alert with the given severity.

It is important to keep in mind that thresholds and the severity of alerts will
vary for each environment. Platform operators can use this guide as a starting
point for their monitoring implementation.

## Etcd

### Member Down

- _Threshold_: 3 minutes
- _Severity_: Critical
- _Notes_: A single member failure does not have a direct impact on the
  Kubernetes cluster. However, it increases the risk of experiencing etcd quorum
  loss if additional members fail.  

### Majority of Members Down

- _Threshold_: 3 minutes
- _Severity_: Critical
- _Notes_: When the majority of members are down, the cluster loses quorum and
  cannot accept writes. Existing workloads on the Kubernetes cluster continue to
  function, but any operations that require writing to etcd are not possible.
  These operations include deploying new applications, scaling existing
  workloads, adding new nodes, etc.

### No Leader

- _Threshold_: 1 minute
- _Severity_: Critical
- _Metrics_: `etcd_server_has_leader`
- _Notes_: The cluster cannot accept writes without a leader. Existing workloads
  on the Kubernetes cluster continue to function, but any operations that
  require writing to etcd are not possible. These operations include deploying
  new applications, scaling existing workloads, adding new nodes, etc.

### Increased GRPC Request Failures

- _Threshold_: >5% failure reate for 5 minutes 
- _Severity_: Critical
- _Metrics_: `grpc_server_handled_total`
- _Notes_: An increase in the number of GRPC request failures can impact the
  operation of the Kubernetes cluster. The `--metrics` etcd command line flag
  must be set to `extensive` for etcd to generate request-related metrics.

### Slow GRPC Requests

- _Threshold_: 99th percentile response time >150 milliseconds for 10 minutes
- _Severity_: Critical
- _Metrics_: `grpc_server_handling_seconds_bucket`
- _Notes_: An increase in latency of GRPC requests can impact the operation of
  the Kubernetes cluster. The `--metrics` etcd command line flag must be set to
  `extensive` for etcd to generate latency-related metrics.

## Kubernetes API Server

### API Server Down

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Notes_: The loss of a single API server does not have an immediate impact on
  the cluster’s operations. However, it increases the risk of a control plane
  outage if additional API servers fail.

### API Server Pod Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: Assumes the API server runs as a pod. A single API server pod that is
  not ready does not have an impact on the cluster’s operations. However, it
  increases the risk of a control plane outage if additional API servers fail.

### High Request Latency

- _Threshold_: 99th percentile response time >4 seconds for 10 minutes
- _Severity_: Critical
- _Metrics_: `apiserver_request_duration_seconds_sum`,
  `apiserver_request_duration_seconds_count`,
  `apiserver_request_duration_seconds_bucket`
- _Notes_: An increase in the request latency can impact the operation of the
  Kubernetes cluster. This abnormal increase should be investigated and
  remediated.

### High Error Rate

- _Threshold_: >3% failure rate for 10 minutes
- _Severity_: Critical
- _Metrics_: `apiserver_request_total`
- _Notes_: An increase in the request error rate can impact the operation of the
  Kubernetes cluster. This abnormal increase should be investigated and
  remediated.

### Client Certificate Expiring

- _Threshold_: Expiration within 24 hours
- _Severity_: Critical
- _Metrics_: `apiserver_client_certificate_expiration_seconds_count`
- _Notes_:

## Kubernetes Controller Manager

Monitoring the Controller Manager is critical to ensure the cluster can
reconcile the current state of the cluster with the users' desired state.

If the cluster has multiple control plane nodes, the loss of a single controller
manager does not have an immediate impact on the cluster's operations. However,
it increases the risk of losing reconciliation loops if additional controller
managers fail.

### Controller Manager Down

- _Threshold_: 15 minutes
- _Severity_: Critical

### Controller Manager Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total` (via [kube-state-metrics](#kube-state-metrics))

### Controller Manager Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics))

## Kubernetes Scheduler

Monitoring the scheduler is critical to ensure the cluster can place new
workloads and move existing workloads to other nodes.

If the cluster has multiple control plane nodes, the loss of a single scheduler
does not have an immediate impact on cluster's operations. However, it increases
the risk of losing scheduling functionality if additional schedulers fail.

### Scheduler Down

- _Threshold_: 15 minutes
- _Severity_: Critical

### Scheduler Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total` (via [kube-state-metrics](#kube-state-metrics))

### Scheduler Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics))

## Node

### Kubelet Down

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Notes_: If the kubelet is down, it is deemed not ready. Nodes that are not
  ready cannot accept pods. The platform evicts Pods running on a not-ready Node
  if the Node remains in that condition for longer than the pod eviction
  timeout.


### Node Not Ready

- _Threshold_: 15 minutes
- _Severity_: Warning
- _Metrics_: `kube_node_status_condition`
- _Notes_: Nodes that are not ready cannot accept pods. The platform evicts Pods
  running on a not-ready Node if the Node remains in that condition for longer
  than the pod eviction timeout.


### Node Unreachable

- _Threshold_: 15 minutes
- _Severity_: Warning
- _Metrics_: `kube_node_spec_taint` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: Nodes that are unreachable cannot accept pods. The platform evicts
  Pods running on an unreachable Node if the Node remains in that condition for
  longer than the pod eviction timeout.


### Too Many Pods

- _Threshold_: 95% pod count capacity
- _Severity_: Warning
- _Metrics_: `kubelet_running_pod_count`, `kube_node_status_capacity_pods`

### File System Utilization

- _Severity_: Critical
- _Metrics_: `node_filesystem_avail_bytes` and `node_filesystem_size_bytes` (via [kube-state-metrics](#kube-state-metrics))
  kube-state-metrics), `node_filesystem_files_free` (via [kube-state-metrics](#kube-state-metrics))

### Persistent Volume Usage

- _Threshold_: <3% available
- _Severity_: Critical
- _Metrics_: `kubelet_volume_stats_available_bytes`, `kubelet_volume_stats_capacity_bytes`

### Clock Skew Detected

- _Threshold_: Clock Skew >50 milliseconds
- _Severity_: Critical
- _Metrics_: `node_timex_offset_seconds` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: Kubernetes does not tolerate clock skew between nodes in the cluster.

### AppArmor Disabled

- _Severity_: Critical

### SELinux Disabled (for RHEL nodes)

- _Severity_: Critical

## Kube-proxy

Monitoring kube-proxy is critical to ensure workloads can access Pods and
Services running on other nodes.

When kube-proxy is unavailable, Services are not reflected on a node's IPtables
or IPVS configuration. Thus, applications running on the affected node cannot
communicate with other pods using Service IPs.

### kube-proxy Down

- _Threshold_: 15 minutes
- _Severity_: Critical

### kube-proxy Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total` (via [kube-state-metrics](#kube-state-metrics))

### kube-proxy Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via [kube-state-metrics](#kube-state-metrics))

## kube-state-metrics

kube-state-metrics exposes metrics about the state of the objects within a
Kubernetes cluster. The metrics cover, but are not limited to, Deployments,
ReplicaSets, Pods and Nodes.

kube-state-metrics is not built into Kubernetes. It is an extra component that
platform operators must deploy onto the cluster. For more information, see the
kube-state-metrics [GitHub
repository](https://github.com/kubernetes/kube-state-metrics).


### Pod Crash Looping

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total`
- _Notes_: Pods stuck in a crash-loop for extended periods of time indicate an
  issue with the application.

### Pod Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase`
- _Notes_: Pods stuck in the not-ready condition for extended periods of time
  indicate an issue with the application.

### Deployment Rollout Stuck

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_deployment_spec_replicas`,
  `kube_deployment_status_replicas_available` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: The number of ready pods of a given Deployment does not match the
  number of desired replicas.

### DaemonSet Rollout Stuck

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_daemonset_status_number_ready`,
  `kube_daemonset_status_desired_number_scheduled` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: The number of ready pods of a given DaemonSet does not match the
  number of nodes in the cluster.

### StatefulSet Rollout Stuck

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_statefulset_status_replicas_ready`,
  `kube_statefulset_status_replicas` (via [kube-state-metrics](#kube-state-metrics))
- _Notes_: The number of ready pods of a given StatefulSet does not match the
  number of desired replicas.

### Elevated List Errors

- _Threshold_: >10% error rate for 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_state_metrics_list_total`
- _Notes_: If kube-state-metrics is experiencing an elevated error rate in list
  operations, it will not be able to expose metrics about Kubernetes objects
  correctly.


### Elevated Watch Errors

- _Threshold_: >10% error rate for 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_state_metrics_watch_total`
- _Notes_: If kube-state-metrics is experiencing an elevated error rate in watch
  operations, it will not be able to expose metrics about Kubernetes objects
  correctly.

## CoreDNS

Monitoring CoreDNS is important to ensure that applications running in the
cluster can perform service discovery using DNS. CoreDNS is essential for the
proper functioning of the Service resource in Kubernetes.

### CoreDNS is Down

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_:
- _Notes_: When CoreDNS is down, applications are unable to use DNS for service
  discovery.

### High Response Latency

- _Threshold_: >20ms latency
- _Severity_: Critical
- _Metrics_: `coredns_dns_request_duration_seconds`
- _Notes_: An increase in the response latency of DNS queries can impact
  application performance. The increase in latency might indicate the need to
  scale out the CoreDNS deployment.

## CNI Plugin

### Pod Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via kube-state-metrics)
- _Notes_: Nodes with a not-ready CNI plugin are unable to start new pods.
  Network connectivity of existing pods might also be impacted.

### Pod Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: kube_pod_container_status_restarts_total (via kube-state-metrics)
- _Notes_: Nodes with a not-ready CNI plugin are unable to start new pods.
  Network connectivity of existing pods might also be impacted.

## Ingress Controller

### Pod Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via kube-state-metrics)
- _Notes_: Applications exposed via the Ingress API are not accessible if
  Ingress controller pods are unavailable.

### Pod Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total` (via kube-state-metrics)
- _Notes_: Applications exposed via the Ingress API are not accessible if
  Ingress controller pods are unavailable.

### Count of Healthy Pods not equal to number of ingress nodes

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Notes_: Only applicable if deploying Ingress Controller as a DaemonSet that
  selects specific nodes.

## Log Forwarder

### Pod Not Ready

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_status_phase` (via kube-state-metrics)
- _Notes_: Application and platform logs are not forwarded to the centralized
  logging system if the log forwarding pods are unavailable.

### Pod Crash Loop

- _Threshold_: 15 minutes
- _Severity_: Critical
- _Metrics_: `kube_pod_container_status_restarts_total` (via kube-state-metrics)
- _Notes_: Application and platform logs are not forwarded to the centralized
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
