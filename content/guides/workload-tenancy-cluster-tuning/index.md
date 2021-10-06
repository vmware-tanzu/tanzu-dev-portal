---
date: '2021-02-24'
description: A workflow for tuning Kubernetes clusters
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Cluster Tuning Guide
parent: Workload Tenancy
title: Cluster Tuning Guide
weight: 1800
featured: true
oldPath: "/content/guides/kubernetes/workload-tenancy-cluster-tuning.md"
aliases:
- "/guides/kubernetes/workload-tenancy-cluster-tuning"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
tags: []
---

## Overview

This document aims to provide a sensible workflow for understanding and tuning
available parameters in Kubernetes. This guide is for application owners and
cluster managers. It is intended to help illustrate and inform configuration
decisions. Whereas the Kubernetes documentation provides in-depth information on
individual parameters, this guide highlights the relationships between them and
implications of each one on the rest of the cluster. By the end of this
document, you will have a clearer understanding of how your responsibilities
impact the stability, utilization, and performance of your overall Kubernetes
environment.

The content of this guide was presented at the 2019 KubeCon in San Diego. This
presentation may be viewed [here](https://youtu.be/uodXrKk7I-o).

### Motivations

IT organizations deploy applications to cloud environments, public or private,
with one primary goal: keep applications online to maximize the value add for
their business and keep costs to a minimum. More specifically, they want to
optimize stability and utilization of their environment while meeting the
availability and performance requirements of their applications. Kubernetes
enables them to achieve these goals by providing a framework to run distributed
systems
[resiliently](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/#why-you-need-kubernetes-and-what-can-it-do).
Kubernetes offers various features and options to help mitigate disruption to
application workloads. Application owners and cluster managers are encouraged to
work together to mitigate the risks posed by these disruptions to maximize the
value of Kubernetes for their organizations.

#### Involuntary Disruptions

Disruptions are classified into two
[categories](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions):
involuntary and voluntary. _Involuntary_ _disruptions_ are any case of an
unavoidable hardware or software failure. Examples of this include:

- physical hardware failure
- cloud provider or hypervisor failure
- kernel panic
- network partition
- pod eviction caused by resource contention

Among these examples, pod eviction is the only one unique to Kubernetes, and it
is discussed in-depth throughout this guide. The other types of involuntary
disruptions are common across all cloud environments, whether a container
orchestrator such as Kubernetes is used or not.

#### Voluntary Disruptions

_Voluntary disruptions_ are those caused by an application owner or cluster
manager. Unlike involuntary disruptions, voluntary disruptions are actions
performed to Kubernetes. Examples of disruptions caused by an application owner
include:

- deleting the controller responsible for managing a pod
- updating a deployment’s pod template
- directly deleting a pod

Examples of disruptions caused by a cluster manager include:

- draining a node for a repair or upgrade
- scaling the cluster up or down (can also be caused by an
  [autoscaler](https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling))
- removal of a pod to permit another one to schedule on a node

A cluster manager, application owner, automation, or an underlying hosting
provider can all cause the above listed voluntary disruptions. Fortunately,
Kubernetes provides several constructs to application owners and cluster
managers to mitigate the risks presented by each of these disruptions.

### Topics

It is helpful to categorize tunable parameters by the persona that may be
responsible for them: application owner or cluster manager. For each parameter,
you will learn the risks posed by the default Kubernetes configuration, the
benefit of tuning this parameter, and the implications of your tuning decisions
on the rest of your cluster.

**Managed by application owners:**

- [Disruption-Tolerant Applications](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#how-to-perform-disruptive-actions-on-your-cluster)
- [Limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)
- [Requests](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)
- [Pod Disruption Budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- [Affinity & Anti-Affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)
- [Pod Priority & Preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/)

**Managed by cluster operators:**

- [Live Restore](https://docs.docker.com/config/containers/live-restore/)
- [PodsPerCore](https://docs.openshift.com/container-platform/4.1/nodes/nodes/nodes-nodes-managing-max-pods.html)
- [LimitRanges](https://kubernetes.io/docs/concepts/policy/limit-range/#enabling-limit-range)
- [Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
- [Soft Eviction](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#soft-eviction-thresholds)
- [Hard Eviction](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#hard-eviction-thresholds)
- [Kube Reserved](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#kube-reserved)
- [System Reserved](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)
- [Housekeeping Interval](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#eviction-monitoring-interval)

For both audiences, topics are listed top-to-bottom by their relative
impact-to-risk. The top-most items will have the greatest impact on your
environment while introducing minimal risk. As you approach the bottom of the
list, parameters have less of an impact (relative to the others) and/or
introduce risk if implemented incorrectly. Examples of misconfigured parameters:

- for Application Owners, misconfigured or “abuse” of pod priority can
  negatively impact scheduling of other teams' workloads
- for Cluster Operators, misconfigured Kubernetes & System reserved flags can cause
  significant instability in the cluster.

## Application Owner

The parameters discussed in this section are of primary concern to application
owners, although understanding them will help anyone who works with Kubernetes.

### Disruption Tolerant Applications

This guide assumes that the applications you are deploying are prepared to take
advantage of Kubernetes. This includes Kubernetes-specific configuration such as
liveness probes, readiness probes, logging to stdout etc. This guide also
assumes your application can tolerate [temporary
disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#how-to-perform-disruptive-actions-on-your-cluster).

### Resource Limits

_[Resource
limits](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)_
provide a way to limit pod resource consumption and contribute to the overall
stability of the cluster. By default, pods do not have resource limits and their
consumption of resources is unbounded. This is problematic because a pod is free
to consume all available resources on a node.

![No limits or requests](images/cluster-tuning-figure-1.png#diagram)
**Figure 1: BestEffort pod (no limits or requests)**

#### Quality-of-Service

_[Quality of
Service](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/)_

(QoS) is a classification assigned to each pod by Kubernetes for the purposes of
scheduling and pod
[eviction](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#eviction-policy).
A
_[BestEffort](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-besteffort)_
pod is one with no resource limits or requests (requests are discussed in the
next section), and is the lowest QoS assigned by Kubernetes. Figure 1 shows a
pod with a QoS of BestEffort. The green bar represents utilization and the
dotted line indicates it is a variable quantity. In this case, utilization is
unbounded and free to consume all available CPU and memory.

![Best Effort Pod](images/cluster-tuning-figure-2.png#diagram)
**Figure 2: Two replicas of a BestEffort pod**

#### Compressible vs. Incompressible Resources

Figure 2 shows a node with two replicas of Pod A. Notice the CPU is fully
utilized and each replica is using 50% of the available capacity, yet the single
replica in Figure 1 is using over 50% of the available CPU capacity. The CPU
consumption of each replica in Figure 2 has been throttled down to 50%. This is
because CPU is a _[compressible
resource](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md)_.

When a compressible resource (such as CPU) is fully utilized, its consumers will
be throttled.

Figure 2 also shows the memory consumption of both pods, however memory is an
example of an _incompressible resource_. The red bar in Figure 2 indicates
memory that the second replica of Pod A attempted to consume, but the node did
not have available. At this point, the node must reclaim resources to ensure
stable operation. Although there are ways for a node to protect itself when this
occurs, it does introduce uncertainty and put the stability of the node at risk.

#### Risk of Unbounded Resource Consumption

When memory approaches full utilization, a node’s kubelet invokes _[pod
eviction](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)_
to reclaim resources and ensure the node remains stable. If pods consume all
available memory before the kubelet begins the eviction process, then Kubernetes
workloads will be competing with system daemons for memory and it is up to the
node’s [oom_killer](https://lwn.net/Articles/391222/) to respond. Once this
occurs, the best case scenario is for the pod to be killed by the oom_killer.
Unlike pod eviction, a pod killed by the oom_killer may be restarted on the same
node by the kubelet based on its restart policy. This means a pod may enter a
cycle of consuming too much memory, being killed by the oom_killer and restarted
by the kubelet. This cycle may continue without the pod being rescheduled
because it is never successfully evicted. This is problematic because it raises
the possibility of system daemons, such as Docker, crashing and causing the
entire node to become unstable.

#### Risk of Docker Termination

If you use Docker for your container runtime, under its default configuration,
it will terminate all pods under its
supervision when it terminates. This means that resource contention between pods
and node daemons could potentially crash Docker and all other containers on the
node. This setting is configurable and discussed later in the
[Live Restore](#live-restore) section.

![Pod with limit](images/cluster-tuning-figure-3.png#diagram)
**Figure 3: Pod with limit**

#### Resource Limits

Figure 3 shows a pod with a limit, indicating the point at which compressible
resources (CPU) are throttled and incompressible resources (memory) are limited.
If the pod consumes more memory than its memory limit specifies, it will be
killed by the kubelet to prevent overconsumption of resources, mitigate the
[noisy
neighbor](https://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance)
problem and ensure node stability.

While resource limits do help mitigate overconsumption of resources, they do not
help the scheduling process within Kubernetes. In other words, resource limits
help optimize stability, but do not have a big impact on utilization. For
example, resource limits would not prevent the situation described in Figure 2
from occurring. The Kubernetes scheduler may still attempt to schedule a pod on
a node without sufficient resources, resulting in the pod being evicted and
rescheduled on another node. Scheduling may be influenced by resource requests,
which will be discussed in the next section.

#### Setting Appropriate Resource Limits

A resource limit set too low may result in a pod being throttled or evicted.
However, a resource limit set too high may result in underutilization of node
resources. _Slack_ is the difference between a pod’s resource limit and its
actual utilization. The optimal resource limit for a pod depends on application
performance characteristics and requirements, and may be determined manually by
observing the workload with monitoring tools. _[Vertical Pod
Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)_

is an upstream effort aimed at automating the process of optimizing pod slack to
achieve high utilization and effective scheduling.

#### Effect of CPU Limits on Latency-Sensitive Workloads

The diagrams in this document use memory as an example of an overcommitted
resource to trigger pod eviction. Memory is a good example because memory
overcommit poses the greatest risk to node stability. Although CPU overcommit
isn’t a risk to node stability, it does have significant performance
implications. If your workloads are latency-sensitive, we recommend viewing a
[Zalando presentation](https://www.youtube.com/watch?v=eBChCFD9hfs) that goes
into depth on this topic. We also recommend reviewing the Kubernetes
documentation on [CPU Management
Policies](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/)
and [Topology
Manager](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/).

### Resource Requests

_[Resource
requests](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)_
allow you to specify a minimum amount of a resource required for a pod to
function and allow the scheduler to optimize utilization.

#### Burstable Pods

![Burstable Pod](images/cluster-tuning-figure-4.png#diagram)
**Figure 4: Burstable pod (request < limit)**

A pod with a QoS of _burstable_ has at least a resource request assigned to it.
If a limit is assigned, the request must be less than the limit for the pod to
be classified by Kubernetes as burstable (Kubernetes will not allow pods with
requests configured to be higher than limits). Figure 4 shows a burstable pod,
indicated by having requests and limits specified and the request lower than the
limit. The darker shade of green indicates the amount of resource that is
indicated by the request.

![Scheduler Node](images/cluster-tuning-figure-5.png#diagram)
**Figure 5: Node from scheduler’s point-of-view**

The Kubernetes scheduler considers resource requests when evaluating whether a
node has sufficient capacity for a pod to be scheduled. Figure 5 is an
illustration of a node from the scheduler’s point of view. For the pod
illustrated in Figure 4, the Kubernetes scheduler evaluated the node by
considering whether the specified request would have fit on the node. Figure 5
illustrates this by showing how many resource requests would have fit on the
node. Although an implementation of resource requests does affect scheduling, it
will not always prevent the problem illustrated in Figure 2. This is not always
a problem however, as the difference between a pod’s limit and request is what
allows for the node to be overcommitted.

#### Resource Overcommit

_Overcommit_ allows a node’s aggregate resource limits to be greater than the
available capacity for a given resource, which optimizes cluster utilization at
the expense of stability. This is acceptable when the workloads do not always
consume resources up to their limit, but instead infrequently burst up to that
limit. This does introduce risk, as it allows multiple workloads to burst at the
same time and force pod eviction or node instability to occur. An appropriate
amount of overcommit depends on your application requirements.

#### Guaranteed Pods

A QoS of _guaranteed_ is assigned to pods where the request is equal to the
limit.

![Guaranteed Pods](images/cluster-tuning-figure-6.png#diagram)
**Figure 6: Two replicas of Pod A scheduled across two nodes**

Figure 6 shows two replicas of Pod A across two nodes, each pod with a QoS of
guaranteed. The entirety of the available utilization is indicated by dark
green. Figure 6 is an example of how the scheduler may avoid the problem
illustrated in Figure 2. Because the request is equal to the limit, the
scheduler sees that Node 1 cannot provide sufficient resources for a second
replica of Pod A. The scheduler concludes Node 2 is sufficient because Pod A’s
resource request is less than Node 2’s available capacity.

### Pod Priority and Preemption

Pod
_[priority](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/)_
indicates a pod’s importance relative to other pods. It is also used to
prioritize which pods will be evicted when a node is out of resources or when a
higher-priority workload is being scheduled (also known as
_[preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/)_).
Pod priority ensures stability of high-priority workloads when nodes are
highly-utilized.

#### Pod Eviction Order

![Node under memory pressure](images/cluster-tuning-figure-7.png#diagram)
**Figure 7: Node under memory pressure**

Figure 7 shows a node with multiple pods (all of varying QoS classifications)
scheduled to it. The node is also under memory pressure, which means it will
begin the [eviction
process.](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)

{{< table "table" >}}
| Eviction Order | QoS        | Priority | Utilization | Usage / Request | Pod Label |
| -------------- | ---------- | -------- | ----------- | --------------- | --------- |
| 1              | BestEffort | 1        | 2%          | N/A             | D         |
| 2              | BestEffort | 2        | 5%          | N/A             | C         |
| 3              | BestEffort | 3        | 20%         | N/A             | A         |
| 4              | BestEffort | 3        | 10%         | N/A             | B         |
| 5              | Burstable  | 3        | N/A         | 2               | F         |
| 6              | Burstable  | 2        | N/A         | 0.5             | E         |
| 7              | Guaranteed | 1        | N/A         | 1               | G         |
{{</ table >}}
**Table 3: Eviction prioritization of pods from Figure 7**

Table 3 outlines the details of each pod illustrated in Figure 7, and the order
in which the pod would be evicted. Note that the kubelet only evicts pods until
the node is no longer under pressure, this table is just an example of how pods
are prioritized.

The
[prioritization](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)
of pods during the eviction process first considers a pod’s QoS class.
BestEffort and Burstable pods are considered first. Then, pods are ranked by
priority and usage above request. BestEffort pods do not have a request, so this
value is considered to be zero during the eviction process. After this,
Guaranteed pods and Burstable pods whose usage is below their request are
considered.

#### Node Out-of-Memory Behavior

If a node’s resources are consumed faster than the eviction process can reclaim
resources, the node must rely on the oom_killer to ensure node stability. This
document will not go into detail on this process, as the process is not
configurable and our goal is to avoid this situation as it puts node stability
at risk. Refer to the Kubernetes
[documentation](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#node-oom-behavior)
for details on this process.

### Pod Disruption Budgets

A Kubernetes cluster will experience various disruptions throughout its
lifecycle. Some are
[involuntary](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions)
such as a VM failing or a network partition, and others are voluntary such as
cluster scaling or node draining. To optimize stability, you should strive to
mitigate risk across all lifecycle events. _[Pod Disruption
Budgets](https://kubernetes.io/docs/tasks/run-application/configure-pdb/)_
(PDBs) allow an application owner to optimize application stability and
availability by indicating how many concurrent voluntary disruptions their
application can tolerate. This information is used by Kubernetes to block
voluntary disruptions if the PDB requirement would be violated by performing the
voluntary disruption.

By default, Kubernetes is unaware of the availability requirements of the
applications that are deployed to it. As a result, PDBs are a crucial interface
between application owners and cluster managers because they enable a way for
Kubernetes to track an application’s availability requirements. PDBs are
especially important for stateful applications with data sharded across
replicas, or high priority deployments where application-level availability is
of concern.

#### PDB Example

The following example is an illustration of the example given in the Kubernetes
[documentation](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pdb-example).

![Cluster prior to draining](images/cluster-tuning-figure-8.png#diagram)
**Figure 8: Cluster prior to node draining**

Figure 8 shows a 3-node cluster with its respective Deployment and PDB objects.
There is also an unrelated pod, Pod X, deployed to node 1.

![Cluster during draining](images/cluster-tuning-figure-9.png#diagram)
**Figure 9: Cluster during node draining with pods rescheduled**

When a voluntary disruption occurs, such as a cluster manager draining a node in
preparation for a node upgrade, Kubernetes will consult each deployment’s
respective PDB and block the operation if the PDB would be violated by the
operation. Figure 9 shows the state of a cluster during a node draining
operation that was allowed by Kubernetes because the deployment’s PDB would not
have been violated.

![Cordoned Node](images/cluster-tuning-figure-10.png#diagram)
**Figure 10: Cluster with node cordoned and rescheduled pods running**

Once a node is drained, its state is considered to be “cordoned”. Figure 10
shows the Kubernetes cluster after a node is successfully cordoned and its pods
have been rescheduled.

![Cordoned Node](images/cluster-tuning-figure-11.png#diagram)
**Figure 11: Cluster with node cordoned and rescheduled pods running**

As mentioned earlier, if a voluntary disruption is attempted on a cluster that
would result in a PDB being violated, the action will be blocked by Kubernetes.
Figure 11 shows the Kubernetes cluster after a cluster manager attempts to
perform a drain operation on Node 2. Pod E, a part of the deployment, is stuck
in “Pending” state because there are not enough resources remaining to schedule
it. Furthermore, Kubernetes will refuse to drain Pod D from the node because
that would violate the PDB. This operation would block, and Figure 11 represents
the state the cluster would be in at this point.

### Affinity & Anti-Affinity

It is a common requirement for highly-available applications to be dispersed
across physical hardware, or for an application to require hardware that is
specific to a node in the cluster. By default, Kubernetes is unaware of these
topology requirements. _[Affinity &
anti-affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)_
allow an application owner to express these requirements to optimize application
availability during voluntary disruptions.

In the previous example, if the cluster had a fourth node then anti-affinity
could have been used to influence the scheduler to reschedule Pod D to it. This
would have prevented two pods from the deployment to land on the same node.

#### Hard Requirement vs. Soft Preference

A _hard requirement_ is one that would prevent a pod from being scheduled if it
is not met. A _soft preference_ would not prevent a pod from being scheduled if
it is not met. For example, the
[nodeSelector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector)
field should be implemented to express a hard requirement for a pod that
requires a specific hostPath volume to be present. An example of a soft
preference is an application with high-availability requirements that needs to
spread across physical machines and can be expressed by [affinity &
anti-affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)
or [taints &
tolerations](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/).

This requirement may be preferred, but not required during voluntary disruptions
for example.

## Cluster Operator

The parameters discussed in this section are of primary concern to cluster
managers, although understanding them will help anyone who works with
Kubernetes. The diagrams in this section build off of those found in the
previous Application Owners section.

### Live Restore

_[Live restore](https://docs.docker.com/config/containers/live-restore/)_ is a
feature of Docker that allows containers to continue running when the Docker
daemon is unavailable. By default, this feature is disabled when installing
Docker. Docker configuration is also out of scope for
[kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/),
resulting in cluster managers often overlooking this setting. If using Docker
for your container runtime, we recommend
enabling this feature to prevent containers from being shutdown if the Docker
daemon is terminated to optimize node stability.

### Pods Per Node

Kubernetes is configured with a default limit of 110 pods per node. VMware
recommends Cluster Managers remain aware of this default and adjust it as
necessary according to workload requirements to optimize utilization. This value
is configurable as a [kubelet
flag](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)
and may be set when
[installing](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#workflow-when-using-kubeadm-init)
Kubernetes with kubeadm.

### LimitRanges and Resource Quotas

As mentioned earlier, containers are configured to run with unbounded resources
by default._
[LimitRanges](https://kubernetes.io/docs/concepts/policy/limit-range/)_ allow
cluster managers to set a default resource request and limit requirements for
all pods in a namespace. If a pod is created without this requirement being met,
it will automatically be added by the
[LimitRanger](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#limitranger)
[admission
controller](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/).

_[Resource quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/)_
allow cluster managers to limit aggregate resource consumption on a
per-namespace basis. These are easy ways to bound resource consumption across
all pods and namespaces to optimize stability and utilization (as detailed in
[Resource Limits](#resource-limits) and [Resource Requests](#resource-requests)).

### Eviction Thresholds

As mentioned earlier, kubelet evicts pods on a node when it is under pressure
for a resource to ensure node stability. _[Eviction
thresholds](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#eviction-thresholds)_
define the threshold at which the eviction process begins on a node. A _[hard
eviction
threshold](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#hard-eviction-thresholds)_
is one in which pods are immediately evicted after being crossed. A _[soft
eviction
threshold](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#soft-eviction-thresholds)_
is one in which a grace period must pass before kubelet begins to evict pods.

#### Visualizing Eviction Thresholds

![Unbound Utilization](images/cluster-tuning-figure-12.png#diagram)
**Figure 12: Unbounded utilization of workloads and daemons**

A node’s resources are consumed by Kubernetes workloads or by system daemons.
Figure 12 illustrates this concept by showing workload and daemon utilization
increasing from left-to-right. A fully utilized resource would be indicated by
these two bars filling the rectangle.

![Eviction Thresholds](images/cluster-tuning-figure-13.png#diagram)
**Figure 13: Node with eviction thresholds shown**

Figure 13 shows a node’s memory resources with default eviction threshold. Note
that eviction thresholds are bounded by a solid line. Furthermore, eviction
thresholds are only affected by workload utilization surpassing them and not by
daemon utilization. By default, the resource consumption of system daemons on a
cluster is unbounded. Bearing this in mind, Figure 13 is also representative of
a Kubernetes cluster configured by kubeadm in its default configuration.
(unbounded workload utilization, unbounded daemon utilization and a hard
eviction threshold for memory).

#### Configuring Eviction Thresholds

By default, kubelet is configured with only a hard eviction threshold with these
parameters as
of[v1.16.2](https://github.com/kubernetes/kubernetes/blob/v1.16.2/pkg/kubelet/apis/config/v1beta1/defaults_others.go):

```
evictionHard:
  imagefs.available: 15%
  memory.available: 100Mi
  nodefs.available: 10%
  evictionPressureTransitionPeriod: 5m0s
```

These values represent the defaults configured for kubelet regardless of the
resources available on a particular node. To override these parameters,
[override](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)
them when installing your cluster with kubeadm. VMware recommends cluster
managers remain aware of this default and configure their cluster with the node
resources and application requirements in mind.

### Kube & System Reserved

Kubernetes also provides a means for cluster managers to limit resource
consumption of daemons to optimize utilization. _[Kube
reserved](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#kube-reserved)_
reserves compute resources for Kubernetes-related daemons and _[system
reserved](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)_
reserves compute resources for other daemons.

![Kube Reserved](images/cluster-tuning-figure-15.png#diagram)
**Figure 15: Node with eviction threshold, kube, and system reserved**

### Node Allocatable Constraints

![CPU Constraints](images/cluster-tuning-figure-16a.png#diagram)
**Figure 16a: Node CPU with Node Allocatable and Node Allocatable Constraints highlighted**

![Memory and Storage Constraints](images/cluster-tuning-figure-16b.png#diagram)
**Figure 16b: Node Memory & Ephemeral Storage with Node Allocatable and Node Allocatable Constraints highlighted**

_Node allocatable constraints_ are what eviction thresholds, kube reserved and
system reserved are collectively referred to as. This name is derived from the
fact that they are what determines _node allocatable_, which is how much of a
resource is available for consumption by pods. In other words, a node’s
allocatable capacity is equal to its capacity minus node allocatable
constraints. Figures 16a and 16b illustrate the relation between these values
for [CPU, memory and
ephemeral-storage](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).
Note that Figure 16a does not contain an eviction threshold. This is because
eviction thresholds only apply to non-compressible resources such as memory and
ephemeral storage.

Note that the addition of kube and/or system reserved will introduce a second
eviction threshold for non-compressible resources (for example, memory and
ephemeral-storage). In Figure 16b, eviction is triggered either when pod
utilization exceeds allocatable, or when the total utilization (pods and
daemons) exceeds the eviction threshold. For compressible resources (CPU), the
addition of kube and/or system reserved will move the threshold at which that
resource is compressed because it affects the size of allocatable.

#### Tuning Node Allocatable Constraints

When configuring eviction thresholds, keep in mind that kube reserved and system
reserved flags have a direct effect on the allocatable capacity of each node.

As a cluster manager, your primary means of tuning stability vs. utilization of
your cluster is by adjusting node allocatable constraints. Always have eviction
policies configured and tuned appropriately relative to node size and workload
resource consumption. Only after adequate monitoring is in place,
[consider](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#general-guidelines)
enforcing kube reserved to bound resource consumption of Kubernetes-related
daemons. Finally, only enforce system reserved if absolutely necessary and after
exhaustive profiling of daemon resource consumption via monitoring tools.

### Housekeeping Interval

Kubernetes does not maintain a real-time understanding of resource consumption
on its nodes. Instead, kubelet periodically evaluates the eviction thresholds on
each node at a preconfigured _[housekeeping
interval](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/#eviction-monitoring-interval)_.
Because of this, it is possible for a rapid increase in memory consumption to
cause instability on a node. Kubernetes’ default housekeeping interval is 10
seconds, but VMware recommends cluster managers adjust this parameter if they
know their workloads can rapidly increase in memory consumption.

![Increased memory consumption](images/cluster-tuning-figure-17.png#diagram)
**Figure 17: Linear increase in memory consumption with default housekeeping interval (10 seconds)**

The risk posed by the default housekeeping interval is illustrated in Figure 17.
Notice that the utilization captured by the kubelet is only updated every 10
seconds even though the memory is increasing linearly with time. In this
example, eviction thresholds would not be triggered until the moment utilization
hit 100%, which may be too late to mitigate the risk posed by out-of-memory
handling.

![Memory Spike](images/cluster-tuning-figure-18.png#diagram)
**Figure 18: Spike in memory consumption with default housekeeping interval (10 seconds)**

The worst-case scenario is for memory to become fully utilized for some amount
of time before the utilization captured by the kubelet is updated to reflect
this. Figure 18 shows this scenario with the actual utilization at 100% for 5
seconds before the kubelet notices.

![Memory Spike](images/cluster-tuning-figure-19.png#diagram)
**Figure 19: Spike in memory consumption with default housekeeping interval of 10 seconds**

For deployments that consume memory rapidly and are at risk of the situation
described in Figure 18, consider reducing the housekeeping interval. Figure 19
shows how changing the housekeeping interval to 5 seconds (from the default of
10 seconds) can mitigate this problem.

### Fault Tolerance

One of the greatest benefits of tuning the parameters discussed in this guide is
that failover scenarios become much more predictable. A node failure in a
Kubernetes cluster with default configuration will have an unpredictable outcome
because it is unknown what would be required to reschedule the workloads of a
given node.

#### Before: Unpredictable Failover

![Default Settings](images/cluster-tuning-figure-20.png#diagram)
**Figure 20: Kubernetes cluster default settings**

Figure 20 shows a cluster that has not been configured beyond the default
kubeadm configuration. While it is possible to configure a monitoring tool to
observe the current utilization of nodes within your cluster, a lack of requests
and limits makes it difficult to tell whether or not the cluster could
accommodate a node failure.

#### After: Predictable Failover

![With Node Allocatable Constraints](images/cluster-tuning-figure-21.png#diagram)
**Figure 21: Kubernetes cluster with Node Allocatable Constraints configured**

On the other hand, a cluster with bounded resource consumption makes this task
relatively simple. Monitoring tools may be configured to consume the cluster’s
resource requests, limits, eviction thresholds, kube reserved and system
reserved settings. With these values known, it is possible to configure an alert
that will warn a cluster manager when the cluster will no longer be able to
tolerate a node failure. Figure 21 is a visualization of this concept with a
node in its most general form, with a resource’s allocatable capacity limited by
node allocatable constraints. This illustration applies to [CPU, memory and
ephemeral
storage](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

#### Calculating Max Utilization

Similar to calculating whether or not a cluster could afford a node failure, it
is also possible to calculate the maximum utilization of each node such that the
cluster could tolerate a node failure. Note that this calculation is only an
estimation, and does not take into account scheduling complexities such as
affinity. The broader point here is that having well-defined limits and requests
allows us to be proactive in reasoning about different failure scenarios.

##### Estimate Function

![Maximum Node Utilization](images/cluster-tuning-figure-22.png#diagram)
**Figure 22: Simple function for maximum utilization of nodes while allowing for 1 failure, where _n_ represents the number of nodes in a cluster**

A simple version of calculating this value is shown in Figure 22, with sample
input and output shown in Table 2. Calculating maximum utilization with this
function makes the following assumptions:

- allocatable constraints (eviction threshold, kube & system reserved) == 0
- number of failures is 1

{{< table "table" >}}
| # of nodes (n) | maxUtilization(n) |
| -------------- | ----------------- |
| 2              | 50%               |
| 3              | 66%               |
| 10             | 90%               |
{{</ table >}}
**Table 4: Example calculations of maximum node utilization with function from Figure 22**

##### Full Function

Maximum utilization may also be calculated without making any of the previous
assumptions. Figure 23 shows how to calculate maximum utilization while also
taking into account the number of node failures, _f_, and node allocatable
constraints (summed up across all nodes), _c_. Table 3 shows example input and
output for this function.

![Maximum Node Utilization](images/cluster-tuning-figure-23.png#diagram)
**Figure 23: Full function for maximum utilization of nodes while accounting for an arbitrary number of node failures (f) and node allocatable constraints.**

{{< table "table" >}}
| # of nodes (n) | max # of node failures | node allocatable constraints | max utilization of nodes |
| -------------- | ---------------------- | ---------------------------- | ------------------------ |
| 2              | 1                      | 0                            | 50%                      |
| 3              | 1                      | 0                            | 66%                      |
| 10             | 1                      | 0                            | 90%                      |
| 2              | 1                      | 0.2                          | 40%                      |
| 3              | 1                      | 0.3                          | 56%                      |
| 10             | 2                      | 0.5                          | 75%                      |
{{</ table >}}
**Table 5: Example calculation of maximum node utilization with function from Figure 23**

## Tying it All Together

The beginning of this document categorized disruptions into two categories:
involuntary and voluntary. By now, it should be clear how each of the constructs
discussed in this document mitigate the risks presented by these disruptions.

### Before Tuning

Figure 20 provides a good visual for the risks that are present in an untuned
Kubernetes cluster. This cluster is not resilient to involuntary disruptions
because its workload and daemon resource consumption is unbounded, putting nodes
at risk of instability and causing failover to be unpredictable. During
voluntary disruptions such as scaling or node draining, there are no PDBs in
place to protect stateful or high-priority applications from losing
high-availability. Scheduling is inefficient as it is unaware of pod priority,
affinity, anti-affinity requirements. Overall, its behavior is not well-defined
and the only way to ensure stability is by minimizing utilization.

### After Tuning

The cluster shown in Figure 21 is a good visual for a tuned cluster. It is
resilient to involuntary disruptions because workload and daemon resource
consumption is bounded, which mitigates the risk of node instability also
results in predictable failover scenarios. During voluntary disruptions such as
scaling or node draining, PDBs, affinity, and anti-affinity now help
applications maintain high-availability. Scheduling is efficient as it is aware
of pod priority, affinity and anti-affinity requirements. Overall, stability and
utilization of the cluster is optimized.

### Refocusing on Bigger Problems

Prior to tuning your cluster, it will be exposed to a number of risks that
detract from the
[benefits](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/#why-you-need-kubernetes-and-what-can-it-do)
Kubernetes has to offer. A tuned cluster gives you peace of mind and an ability
to focus on broader architectural tradeoffs such as those between utilization,
fault tolerance and scheduling complexity.

#### Utilization vs. Fault Tolerance

How many nodes can your environment tolerate losing? This depends on many
factors including your application’s service-level-agreement (SLA), disruption
tolerance and other organizational requirements. It is a complicated question to
answer, but with a tuned cluster it is much easier to approach. As discussed,
bounded resource consumption allows you determine the max utilization of your
nodes based on your fault tolerance requirements.

#### Utilization vs. Scheduling Complexity

If your workloads have relatively simple resource requirements, the scheduler’s
job will be straightforward and you may be able to increase the utilization of
your cluster by scaling the number of nodes down. On the other hand, complex
resource requirements will complicate scheduling. This may be may be remedied by
adding capacity to the cluster, which reduces cluster utilization.

## Testing

_[Kind](https://kind.sigs.k8s.io/docs/user/quick-start)_ is a tool for running
clusters locally using Docker containers as nodes, and may be used to
familiarize with configuring the kubelet parameters discussed in this document.
You may also experiment with application-level parameters (those discussed in
the [Application Owner](#application-owner) section) upon cluster creation.
Follow the [getting started](https://kind.sigs.k8s.io/docs/user/quick-start)
guide with the following configuration to deploy a kind cluster with default
node allocatable constraints:

```
kind: Cluster
apiVersion: kind.sigs.k8s.io/v1alpha3
kubeadmConfigPatches:
- |
  apiVersion: kubelet.config.k8s.io/v1beta1
  kind: KubeletConfiguration
  metadata:
    name: config
  maxPods: 110
#  systemReserved:
#      memory: "500Mi"
#  kubeReserved:
#      memory: "500Mi"
  evictionHard:
      memory.available:  "100Mi"
      imagefs.available: "15%"
      nodefs.available: "10%"
      nodefs.inodesFree: "5%"
- |
  apiVersion: kubeadm.k8s.io/v1beta2
  kind: InitConfiguration
  metadata:
    name: config
  nodeRegistration:
    kubeletExtraArgs:
      "housekeeping-interval": "10s"
      "enforce-node-allocatable": "pods"
nodes:
- role: control-plane
- role: worker
```

To enforce system or kube reserved flags, be sure to
[configure](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)
your cgroup driver and update the enforce-node-allocatable.