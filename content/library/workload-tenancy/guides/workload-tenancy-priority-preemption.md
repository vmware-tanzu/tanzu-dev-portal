---
date: '2021-02-24'
description: Guidance on pod priority and preemption
keywords:
- Kubernetes
lastmod: '2021-03-04'
linkTitle: Pod Priority and Preemption
parent: Workload Tenancy
title: Pod Priority and Preemption
weight: 2000
oldPath: "/content/guides/kubernetes/workload-tenancy-priority-preemption.md"
aliases:
- "/guides/kubernetes/workload-tenancy-priority-preemption"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

## Overview

This section aims to provide guidance on pod priority and preemption. It allows
application owners and cluster administrators to have an in-depth understanding
of Kubernetes preemption features and the relationship between the various
components, namely: Pod Disruption Budget Violation, Kubelet Pod QoS, and
PriorityClass.

After reading this document, you will have a better understanding of how to plan
for application prioritization to ensure minimal outage of the entire system.

## Motivation

Most organizations categorize their applications based on their business impact.
Each category defines specific metrics for applications, such as maximum
downtime and acceptable response times. The category also specifies the
remediation process in the event of application failure. Typically, applications
in one category have higher priority than applications in another.

In Kubernetes, the scheduler handles pods on a first-come, first-serve basis. In
other words, there is no guarantee that applications with higher importance get
scheduled when the cluster is under heavy utilization. To inform the scheduler
about application priorities, Kubernetes has a feature called Pod Priority and
Preemption. It ensures that pods with a higher priority have a front slot in the
scheduler queue and even evicts lower priority pods if necessary.

## System-Wide Priority Class

Kubernetes is managed by system-wide pods to provide services to the respective
tenants. These system-wide pods are critical to the functioning of the cluster.
To ensure that these critical pods remain scheduled and running, they are
assigned the `system-cluster-critical` and `system-node-critical` priority
classes during the installation.

Run the following command to check the value of the priority class.

```bash
$ kubectl get priorityclass

# the greater the value, the higher the priority
NAME                      VALUE        GLOBAL-DEFAULT   AGE
system-cluster-critical   2000000000   false            10d
system-node-critical      2000001000   false            10d
```

When defining priority classes for your applications, make sure that you use a
value that is lower than the built-in `system-cluster-critical` priority class.
By doing so, you can be sure that your applications will not evict
system-critical pods.

If you plan to host cluster-wide critical services such as logging agents,
metrics server, or an SSO IDP provider; `system-cluster-critical` or another
level below (you organization's definition of priority) should be used and this
will give a guaranteed prioritization for the service.

## Priority Class Planning

Most IT organizations have a classification of severity. Let’s assume they have
business criticality categories from 1 to 3, 1 having the lowest priority, while
3 having the highest priority for applications that require extremely high
levels of reliability. With this assumption, you can reflect these categories in
PriorityClasses and use them to prioritize the pods in the cluster.

With the above assumptions, we can define the following priority classes for
your entire application needs.

{{< table "table" >}}
| PriorityClass Name | Value   | preemptionPolicy     | globalDefault |
| ------------------ | ------- | -------------------- | ------------- |
| cat-1              | 10000   | None                 | true          |
| cat-2              | 20000   | PreemptLowerPriority | false         |
| cat-3              | 30000   | PreemptLowerPriority | false         |
| cluster-service    | 1000000 | PreemptLowerPriority | false         |
{{</ table >}}
**_Table 1: Sample PriorityClass Allocation_**

{{% aside title="Maximum value of priority classes" type="warning" %}}
When defining priority classes, make sure that the **`value`** field does not
exceed the value specified by `system-cluster-critical` which is `2000000000`
{{% /aside %}}

PreemptionPolicy if enabled, allows the scheduler to evict existing pods.

`cat-1` has been deliberately configured as default preemptionPolicy

The `cat-1` priority class is assigned to deployments by default. The remaining
priority classes can be used to prioritize applications according to their
availability requirements. You can leverage the `cluster-service` class for the
workloads that provide common services, such as logging and monitoring.

### Who Gets Evicted?

Lets assume the scenario where your cluster has pods defined with the following
disruption budgets.

{{< table "table" >}}
| Application | Disruption Budget |
| ----------- | ----------------- |
| Blue Pod    | Min Available : 3 |
| Purple Pod  | Min Available : 3 |
| Green Pod   | Min Available : 2 |
| Red Pod     | Min Available : 2 |
{{</ table >}}
**_Table 2: Scenario Disruption Budget_**

Now, let's assume your cluster is full but you need to deploy another `cat-3`
application. Kubernetes will attempt to schedule the pod as shown on the
following diagram:

![pod-priority](/images/guides/kubernetes/workload-tenancy/pod-priority-01.png)
**_Figure 1: Scenario: Green Application is Preempted_**

{{% aside title="Pod Disruption Budgets" %}}
Even though blue pod has lowest priority (`cat-1`), the Kubernetes scheduler will
not pick that pod due to the disruption budget requirement. Removing any blue
pod will cause a violation.
{{% /aside %}}

The scheduling will run with 2 passes. If the first attempt failed with
`fitError` which is an indication from scheduler that it could not find the best
fit for the pod under the current situations, the Kubernetes scheduler will
attempt to run the 2 passes as long as the new pod priority class has
`PreemptLowerPriority` flagged.

During the second attempt, various variables are taken into consideration to
select one victim (worker node) for preemption.

1. It starts by looking for worker nodes that are marked with
   [`Unschedulable`](https://pkg.go.dev/k8s.io/kubernetes/pkg/scheduler/framework/v1alpha1?tab=doc#Code),
   which is an indication for possibility to preempt some of the pods

1. Followed by dry-run reprieve logic on the valid worker nodes and to check if
   the new pod (orange pod) can be scheduled on the node when all lower priority
   pod (`cat-1` or `cat-2`) has been successfully evicted. If there is possibility
   for preemption, Kubernetes scheduler will sort all the pods by their priority
   and put them into 2 sorted groups based on their `PodDisruptionBudget`
   conditions; `violated` and `non-violated` pods, if preemption happen on the
   worker node.

1. If there are potential pods to preempt, the Kubernetes scheduler selects the
   worker node based on the below sequence.

   1. The node with minimum number of `PodDisruptionBudget` violations.
   1. If ties, the node with minimum highest priority victim is picked.
   1. If ties, ties are broken by sum of priorities of all victims.
   1. If ties, the node with the minimum number of victims is picked.
   1. If ties, the node with the latest start time of all highest priority
      victims is picked.
   1. If ties, the first such node is picked randomly.

1. Trigger the kubelet to start executing preemption logic.

With the algorithm shown above, the example on '**Preemption on Green App**'
remove the green pod with `cat-2` (rather than the blue pod `cat-1`) as they do not
violate `PodDisruptionBudget` upon removal.

Pod Priority algorithms do not take
[QoS](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/)
into consideration as these two features are less likely to interact
with each other except for [Kubernetes out-of-resource
eviction](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/)
scenario.

## Key Takeaways

1. Always have a default PriorityClass. Use the one with lowest value.
1. Priority classes should not have a value greater than your cluster-wide,
   critical PriorityClass.
1. Preemption logic will respect pod disruption budget rules. Make sure you have
   this specified during deployment.
1. For business-critical systems, it is recommended to specify the minimum
   availability, together with higher priority value. In the sample above, this
   would be the `cat-3` category.
1. Pod `affinity` and `anti-affinity` rules impact the selection of victims. If
   any of those exist, the worker node will not be considered as part of
   selection.