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

The tables below outlines _conditions_ that platform operators must monitor when
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

{{< table "table" >}}
| Condition                       | Threshold                                        | Severity | Metrics                               | Notes                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------ | -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Member down                     | 3 minutes                                        | Critical |                                       | A single member failure does not have a direct impact on the Kubernetes cluster. However, it increases the risk of experiencing etcd quorum loss if additional members fail.                                                                                                                                                           |
| Majority of members down        | 3 minutes                                        | Critical |                                       | When the majority of members are down, the cluster loses quorum and cannot accept writes. Existing workloads on the Kubernetes cluster continue to function, but any operations that require writing to etcd are not possible. These operations include deploying new applications, scaling existing workloads, adding new nodes, etc. |
| No leader                       | 1 minute                                         | Critical | `etcd_server_has_leader`              | The cluster cannot accept writes without a leader. Existing workloads on the Kubernetes cluster continue to function, but any operations that require writing to etcd are not possible. These operations include deploying new applications, scaling existing workloads, adding new nodes, etc.                                        |
| High # of GRPC request failures | > 5% failure rate for 5 minutes                  | Critical | `grpc_server_handled_total`           | An increase in the number of GRPC request failures can impact the operation of the Kubernetes cluster. Note: The `--metrics` etcd command line flag must be set to `extensive` for etcd to generate request-related metrics.                                                                                                           |
| GRPC requests slow              | 99% percentile > 150 milliseconds for 10 minutes | Critical | `grpc_server_handling_seconds_bucket` | An increase in latency of GRPC requests can impact the operation of the Kubernetes cluster. Note: The `--metrics` etcd command line flag must be set to `extensive` for etcd to generate latency-related metrics.                                                                                                                      |
{{</ table >}}

## Kubernetes API Server

{{< table "table" >}}
| Condition                             | Threshold                                  | Severity | Metrics                                                                                                                           | Notes                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API server down                       | 15 minutes                                 | Critical |                                                                                                                                   | The loss of a single API server does not have an immediate impact on the cluster's operations. However, it increases the risk of a control plane outage if additional API servers fail.                                       |
| API server pod not ready              | 15 minutes                                 | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                                                                                | Assumes the API server runs as a pod. A single API server pod that is not ready does not have an impact on the cluster's operations. However, it increases the risk of a control plane outage if additional API servers fail. |
| High request latency                  | 99th percentile > 4 seconds for 10 minutes | Critical | `apiserver_request_duration_seconds_sum`, `apiserver_request_duration_seconds_count`, `apiserver_request_duration_seconds_bucket` | An increase in the request latency can impact the operation of the Kubernetes cluster. This abnormal increase should be investigated and remediated.                                                                          |
| High request error rate               | > 3% failure rate for 10 minutes           | Critical | `apiserver_request_total`                                                                                                         | An increase in the request error rate can impact the operation of the Kubernetes cluster. This abnormal increase should be investigated and remediated.                                                                       |
| Client certificate nearing expiration | Expiration within 24 hours                 | Critical | `apiserver_client_certificate_expiration_seconds_count`                                                                           |                                                                                                                                                                                                                               |
{{</ table >}}

## Kubernetes Controller Manager

Monitoring the Controller Manager is critical to ensure the cluster can
reconcile the current state of the cluster with the users' desired state.

If the cluster has multiple control plane nodes, the loss of a single controller
manager does not have an immediate impact on the cluster's operations. However,
it increases the risk of losing reconciliation loops if additional controller
managers fail.

{{< table "table" >}}
| Condition                        | Threshold  | Severity | Metrics                                                               | Notes |
| -------------------------------- | ---------- | -------- | --------------------------------------------------------------------- | ----- |
| Controller manager down          | 15 minutes | Critical |                                                                       |       |
| Controller manager crash-looping | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) |       |
| Controller manager not ready     | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    |       |
{{</ table >}}

## Kubernetes Scheduler

Monitoring the Scheduler is critical to ensure the cluster can place new
workloads and move existing workloads to other nodes.

If the cluster has multiple control plane nodes, the loss of a single scheduler
does not have an immediate impact on cluster's operations. However, it increases
the risk of losing scheduling functionality if additional schedulers fail.

{{< table "table" >}}
| Condition               | Threshold  | Severity | Metrics                                                               | Notes |
| ----------------------- | ---------- | -------- | --------------------------------------------------------------------- | ----- |
| Scheduler down          | 15 minutes | Critical |                                                                       |       |
| Scheduler crash-looping | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) |       |
| Scheduler not ready     | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    |       |
{{</ table >}}

## Node

{{< table "table" >}}
| Condition                                 | Threshold                         | Severity | Metrics                                                                              | Notes                                                                                                                                                                                                                             |
| ----------------------------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kubelet is down                           | 15 minutes                        | Critical |                                                                                      | If the kubelet is down, it is deemed not ready. Nodes that are not ready cannot accept pods. The platform evicts Pods running on a not-ready Node if the Node remains in that condition for longer than the pod eviction timeout. |
| Node not ready                            | 15 minutes                        | Warning  | `kube_node_status_condition`                                                         | Nodes that are not ready cannot accept pods. The platform evicts Pods running on a not-ready Node if the Node remains in that condition for longer than the pod eviction timeout.                                                 |
| Node unreachable                          | 15 minutes                        | Warning  | `kube_node_spec_taint` (via [kube-state-metrics])                                    | Nodes that are unreachable cannot accept pods. The platform evicts Pods running on an unreachable Node if the Node remains in that condition for longer than the pod eviction timeout.                                            |
| Node has too many pods                    | Node is at 95% pod count capacity | Warning  | `kubelet_running_pod_count` and `kube_node_status_capacity_pods`                     |                                                                                                                                                                                                                                   |
| File system filling up                    |                                   | Critical | `node_filesystem_avail_bytes` and `node_filesystem_size_bytes` (via [node-exporter]) |                                                                                                                                                                                                                                   |
| File system low on available inodes       |                                   | Critical | `node_filesystem_files_free` (via [node-exporter])                                   |                                                                                                                                                                                                                                   |
| Persistent volume usage is critical       | < 3% available                    | Critical | `kubelet_volume_stats_available_bytes` and `kubelet_volume_stats_capacity_bytes`     |                                                                                                                                                                                                                                   |
| Clock skew detected                       | Clock skew > 50 milliseconds      | Critical | `node_timex_offset_seconds` (via [node-exporter])                                    | Kubernetes does not tolerate clock skew between nodes in the cluster.                                                                                                                                                             |
| AppArmor is disabled                      |                                   | Critical |                                                                                      |                                                                                                                                                                                                                                   |
| SELinux is disabled (RHEL-flavored nodes) |                                   | Critical |                                                                                      |                                                                                                                                                                                                                                   |
{{</ table >}}

## Kube-proxy

Monitoring kube-proxy is critical to ensure workloads can access Pods and
Services running on other nodes.

When kube-proxy is unavailable, Services are not reflected on a node's IPtables
or IPVS configuration. Thus, applications running on the affected node cannot
communicate with other pods using Service IPs.

{{< table "table" >}}
| Condition                | Threshold  | Severity | Metrics                                                               | Notes |
| ------------------------ | ---------- | -------- | --------------------------------------------------------------------- | ----- |
| Kube-proxy down          | 15 minutes | Critical |                                                                       |       |
| Kube-proxy crash-looping | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) |       |
| Kube-proxy not ready     | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    |       |
{{</ table >}}

## Kube-state-metrics

Kube-state-metrics exposes metrics about the state of the objects within a
Kubernetes cluster. The metrics cover, but are not limited to, Deployments,
ReplicaSets, Pods and Nodes.

Kube-state-metrics is not built into Kubernetes. It is an extra component that
platform operators must deploy onto the cluster. For more information, see the
kube-state-metrics [GitHub
repository](https://github.com/kubernetes/kube-state-metrics).

{{< table "table" >}}
| Condition                 | Threshold                       | Severity | Metrics                                                                                                              | Notes                                                                                                                                                       |
| ------------------------- | ------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod is crash-looping      | 15 minutes                      | Critical | `kube_pod_container_status_restarts_total`                                                                           | Pods stuck in a crash-loop for extended periods of time indicate an issue with the application.                                                             |
| Pod is not ready          | 15 minutes                      | Critical | `kube_pod_status_phase`                                                                                              | Pods stuck in the not-ready condition for extended periods of time indicate an issue with the application.                                                  |
| Deployment rollout stuck  | 15 minutes                      | Critical | `kube_deployment_spec_replicas` and `kube_deployment_status_replicas_available` (via [kube-state-metrics])           | The number of ready pods of a given Deployment does not match the number of desired replicas.                                                               |
| DaemonSet rollout stuck   | 15 minutes                      | Critical | `kube_daemonset_status_number_ready` and `kube_daemonset_status_desired_number_scheduled` (via [kube-state-metrics]) | The number of ready pods of a given DaemonSet does not match the number of nodes in the cluster.                                                            |
| StatefulSet rollout stuck | 15 minutes                      | Critical | `kube_statefulset_status_replicas_ready` and `kube_statefulset_status_replicas` (via [kube-state-metrics])           | The number of ready pods of a given StatefulSet does not match the number of desired replicas.                                                              |
| Elevated List errors      | > 10% error rate for 15 minutes | Critical | `kube_state_metrics_list_total`                                                                                      | If kube-state-metrics is experiencing an elevated error rate in list operations, it will not be able to expose metrics about Kubernetes objects correctly.  |
| Elevated Watch errors     | > 10% error rate for 15 minutes | Critical | `kube_state_metrics_watch_total`                                                                                     | If kube-state-metrics is experiencing an elevated error rate in watch operations, it will not be able to expose metrics about Kubernetes objects correctly. |
{{</ table >}}

## CoreDNS

Monitoring CoreDNS is important to ensure that applications running in the
cluster can perform service discovery using DNS. CoreDNS is essential for the
proper functioning of the Service resource in Kubernetes.

{{< table "table" >}}
| Condition             | Threshold                | Severity | Metrics                                | Notes                                                                                                                                                                       |
| --------------------- | ------------------------ | -------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CoreDNS is down       | 15 minutes               | Critical |                                        | When CoreDNS is down, applications are unable to use DNS for service discovery.                                                                                             |
| High response latency | > 20 millisecond latency | Critical | `coredns_dns_request_duration_seconds` | An increase in the response latency of DNS queries can impact application performance. The increase in latency might indicate the need to scale out the CoreDNS deployment. |
{{</ table >}}

## CNI Plugin

{{< table "table" >}}
| Condition                    | Threshold  | Severity | Metrics                                                               | Notes                                                                                                                         |
| ---------------------------- | ---------- | -------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| CNI plugin pod not ready     | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    | Nodes with a not-ready CNI plugin are unable to start new pods. Network connectivity of existing pods might also be impacted. |
| CNI plugin pod crash-looping | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) | Nodes with a not-ready CNI plugin are unable to start new pods. Network connectivity of existing pods might also be impacted. |
{{</ table >}}

## Ingress Controller

{{< table "table" >}}
| Condition                                                | Threshold  | Severity | Metrics                                                               | Notes                                                                                                   |
| -------------------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Ingress controller pod not ready                         | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    | Applications exposed via the Ingress API are not accessible if Ingress controller pods are unavailable. |
| Ingress controller pod crash-looping                     | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) | Applications exposed via the Ingress API are not accessible if Ingress controller pods are unavailable. |
| Number of healthy pods not equal number of ingress nodes | 15 minutes | Critical |                                                                       | Only applicable if deploying Ingress Controller as a DaemonSet that selects specific nodes.             |
{{</ table >}}

## Log Forwarder

{{< table "table" >}}
| Condition                       | Threshold  | Severity | Metrics                                                               | Notes                                                                                                                         |
| ------------------------------- | ---------- | -------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Log forwarder pod not ready     | 15 minutes | Critical | `kube_pod_status_phase` (via [kube-state-metrics])                    | Application and platform logs are not forwarded to the centralized logging system if the log forwarding pods are unavailable. |
| Log forwarder pod crash-looping | 15 minutes | Critical | `kube_pod_container_status_restarts_total` (via [kube-state-metrics]) | Application and platform logs are not forwarded to the centralized logging system if the log forwarding pods are unavailable. |
{{</ table >}}

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
