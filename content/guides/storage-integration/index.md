---
date: '2021-02-24'
lastmod: '2021-04-29'
team:
- Josh Rosso
title: Storage Integration
weight: 72
oldPath: "/content/guides/kubernetes/storage-integration.md"
aliases:
- "/guides/kubernetes/storage-integration"
level1: Building a Kubernetes Runtime
level2: Kubernetes Architecture
tags:
- Kubernetes
---

Core Kubernetes does not concern itself with storage integration. At most, it
provides a set of APIs, [Persistent
Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/),
[Persistent Volume
Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims),
and [Storage
Classes](https://kubernetes.io/docs/concepts/storage/storage-classes). By
default, containers can use their own ephemeral storage system and/or leverage
host storage. Both of these solutions are typically inadequate for enterprise
workloads. Ephemeral storage goes away if the container dies. Host storage ties
the container to a specific host and (depending on how you access host storage)
it can be insecure in multi-tenant environments.

The model used by most enterprise platforms is to introduce a provider that can
enable dynamic provisioning of volumes for workloads requiring some amount of
persistence. Integration to providers is typically accomplished through a
container storage interface (CSI) plugin. The following demonstrates the
relationship.

![Dynamic Storage Provisioning](images/dynamic-storage-provisioning.png#diagram)

There is high variance in how the above works based on the provider. Some
providers create multiple PVs ahead of time and make them available to workloads.
The above is only meant to give a conceptual overview of how the flow might
work.

### Container Storage Interface (CSI)

Kubernetes uses the [container storage
interface](https://github.com/container-storage-interface/spec) (CSI) to provide
storage functionality to containers. Storage is implemented in CSI plugins. This
interface / plugin model enables Kubernetes to support many storage options
implemented via plugins (or drivers) such as
[vSphere](https://github.com/kubernetes-sigs/vsphere-csi-driver),
[DellEMC](https://dell.github.io/storage-plugin-docs/docs/dell-csi-driver/),
[portworx](https://github.com/libopenstorage/openstorage/tree/master/csi), [AWS
EFS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver), and
[NetApp](https://github.com/NetApp/trident).

A more complete list is available in the [CSI driver documentation](https://kubernetes-csi.github.io/docs/drivers.html).

Prior to standardization around CSI, the implementation of storage integrations
had high-variance across providers. There are two common models for running
storage drivers in Kubernetes. These are through cloud providers and dedicated
storage providers. Cloud providers (such as AWS and vSphere) package their
storage driver into the provider, so that it can handle all the integration
points such as provisioning load balancers and storage volumes. Dedicated
integrations run as independent processes managing only storage. Below you'll
find explanations on each.

### In-tree Providers

Historically, Kubernetes relied on in-tree "cloud" provider functionality for
most storage integration. This method of integration predates CSI. These
providers are referred to as in-tree because [their code lives in the core
kubernetes/kubernetes
repo](https://github.com/kubernetes/kubernetes/tree/v1.18.0-alpha.2/pkg/cloudprovider).
With this model, every Kubernetes cluster has cloud provider logic in it, even
if it wasn't activated. In a cluster integrated with vCenter, the
kube-apiserver, controller-manager, and kubelet will look as follows.

![In-tree provider](images/in-tree-provider.png#diagram)

As you can imagine, shipping these components with cloud-provider logic for
every cut of Kubernetes is not a good model. Additionally, the in-tree model
does not allow you to update the provider without updating your cluster. In-tree
providers have been deprecated and are planned to be removed. You should **not**
use an in-tree provider for storage integration of your platform.

### Out-of-tree Providers

Out-of-tree providers encapsulate cloud-provider logic in a controller. This
controller is commonly referred to as a cloud-controller-manager (CCM). The CCM
is deployed to your cluster and interacts with the cloud-provider's APIs. The
storage driver (CSI-plugin) often runs outside of the CCM, but can require the
CCM to function correctly. In the case of vSphere, you install 3 components.

{{< table "table" >}}
| Component | Name | Type |
| --------------------------- | -------------------------- | ----------- |
| Cloud Controller Manager | `vsphere-cloud-controller` | Deployment |
| Storage Controller | `vsphere-csi-controller` | StatefulSet |
| Storage Driver (CSI-plugin) | `vsphere-csi-node` | DaemonSet |
{{</ table >}}

With these components installed, a 4 node Kubernetes cluster (assuming 1 master)
would look as follows.

![Out-of-tree provider](images/out-of-tree-provider-and-csi.png#diagram)

### Dedicated Storage Integrations

Some storage providers have nothing to do with cloud-provider integration. In
this case they run their integrations / drivers as isolated processes (pods in
Kubernetes). An example of this model is NetApp's
[Trident](https://netapp-trident.readthedocs.io/en/stable-v19.10/) integration.
Running trident in a cluster will provision volumes against its supported
providers, such as NetApp's SolidFire. It also handles concerns around backup
and recovery. Another common project that follows this model is
[rook](https://rook.io), which provides integration with providers like Ceph and
NFS.
Also, Dell EMC [Container Storage Modules](https://github.com/dell/karavi) (formerly known as Karavi)
enriches CSI with enterprise storage capabilities such as Authorization, Resiliency and others.

### Option Considerations

There is no shortage of CSI-plugin options. For your environment, the decision
may be easy because you only have one type of storage available to you, for
example vSAN. However, if you're thinking about integrating a new storage
provider, it's important that you consider the storage offerings and resiliency
guarantees your platform needs to offer. Some key considerations are:

- What I/O speeds are required for platform workloads?
- What disaster scenarios does the persistence layer need to handle?
- How many workloads will need persistent storage?
  - How much storage do you need and what are your expansion requirements?
- Do you need to offer dynamic volume resizing if a workload uses up its
  storage?
- What backup scenarios (if any) do you plan to offer?
  - Alternatively, do you plan to make the application teams responsible for
    their backups?
- What storage system can you realistically operate? Ceph? vSAN?

Having conversations around these points will help you determine the best
storage integration for you.