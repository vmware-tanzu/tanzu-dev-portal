---
date: '2021-02-16'
lastmod: '2021-02-16'
parent: Application Enhancements
tags:
- Kubernetes
team:
- John Harris
title: Application Readiness Checklist
oldPath: "/content/guides/kubernetes/app-enhancements-checklist.md"
aliases:
- "/guides/kubernetes/app-enhancements-checklist"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

This list is a starting place for considerations about your application running
on Kubernetes. It is not exhaustive and should be expanded based on your
requirements.

## Required

The following are items that must be completed before running on Kubernetes.

{{% checklist-item title="Application runs in a container" %}}
For the workload to run in a Kubernetes Pod, it must be packaged in a
container.
{{% /checklist-item %}}

{{% checklist-item title="Application / container is not dependent on host configuration" %}}
Pods are scheduled across multiple hosts and may be rescheduled based on
the needs of the system. Relying on a static host to run your workloads
may cause issues.
{{% /checklist-item %}}

{{% checklist-item title="Logging occurs to stdout or stderr" %}}
In Kubernetes, it's considered an anti-pattern to concern the workload with
logging mechanisms beyond the formatting of the logs. Kubernetes-based
platforms almost always feature log shipping mechanisms. This means,
applications should log to stdout and/or stderr.

For more details, see the [Logging Practices guide](../app-enhancements-logging-practices/).
{{% /checklist-item %}}

## Recommended

The following are items that you should consider to ensure your application can run well on Kubernetes.

{{% checklist-item title="Does not run as root" %}}
Kubernetes is a multi-tenant environment where workloads may run side-by-side
on the same host. To mitigate privilege escalation allowing one container to
impact other on the host, applications should not run as a root user.
{{% /checklist-item %}}

{{% checklist-item title="Does not require elevated privileges (added Linux capabilities)." %}}
Ideally your application does not require or add Linux capabilities to the
deployment. This better ensures isolation of the workload in
Kubernetes-based environments. For more detailed examples, see the [Security
Context
documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod).
{{% /checklist-item %}}

{{% checklist-item title="Handles the TERM Linux signal." %}}
When a pod is being deleted, moved, or recreated each container's PID 1
receives a SIG TERM. The process then has a grace-period to do what it needs
and exit. The default grace-period is 30 seconds; check with your cluster
administrator to understand what your cluster is set to. If the grace period
expires, a SIG KILL is sent. For more details, see the [Termination of Pods
documentation](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).

If a process, script, or HTTP endpoints must be called to terminate
gracefully, you can also add a [preStop
hook](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks)
to your Kubernetes manifest.
{{% /checklist-item %}}

{{% checklist-item title="Readiness is reported by application." %}}
Readiness probes allow your application to report when it should start
receiving traffic. This is always what marks a pod 'Ready' in the cluster.
see the [Probing Application
State](https://kubernetes.io/docs/concepts/storage/persistent-volumes)
guide.
{{% /checklist-item %}}

{{% checklist-item title="Configuration is externalized." %}}
To support configuration of your application, it's best to place it in the
cluster using constructs like configmaps and secrets. This empowers you to
make configuration changes to new and running applications using the
Kubernetes API. For more details, see the [Externalizing Configuration
guide](../app-enhancements-externalizing-configuration).
{{% /checklist-item %}}

{{% checklist-item title="Able to run with multiple replicas." %}}
In a Kubernetes environment, workloads are moved around based on needs of
the platform. This means a workload could be deleted and recreated from time
to time. With this and general HA practices in mind, your workload should be
able to run with more than one replica.
{{% /checklist-item %}}

{{% checklist-item title="Prevent replicas of your application from being co-located." %}}
The Kubernetes scheduler does not guarantee application replicas run on
different hosts, VMs, or hypervisors. Ensure you have appropriate
anti-affinity setup based on the fault requirements of your application. For
more details, see the [Affinity and anti-affinity
documentation](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).
{{% /checklist-item %}}

{{% checklist-item title="Application resource requirements are known." %}}
Applications should claim the CPU, memory, and other resources they require.
This allows the scheduler to know the best place to run the application
based on resources available. Once your resource requirements are known,
visit [Managing Compute Resources for
Containers](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container).
{{% /checklist-item %}}

{{% checklist-item title="Important state does not persist in container filesystem." %}}
Your application's container filesystem is considered ephemeral. Meaning it
will not move with the workload. This ephemeral storage is typically
resource constrained and should not be used for anything more than small
write needs, where loss of data is not a concern. If you need data
persistence for your application, work with your platform team to understand
how to request a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes).
{{% /checklist-item %}}

{{% checklist-item title="Session affinity is not required." %}}
Requiring a request hits the same instance of an application each time is an
anti-pattern in Kubernetes. While it is possible to solve for this use case,
you should consider running or architecting your application in such a way
that affinity of sessions is a non-requirement.
{{% /checklist-item %}}

{{% checklist-item title="Metrics are exposed using an exporter." %}}
Most Kubernetes clusters use a metrics collector such as
[Prometheus](https://prometheus.io). Adding exporters to your application is
trivial and support many different programming languages. For more details, see
the [observability documentation](../app-observability/).
{{% /checklist-item %}}