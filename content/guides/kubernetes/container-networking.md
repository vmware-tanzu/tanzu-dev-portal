---
date: '2021-02-24'
lastmod: '2021-02-26'
subsection: Container Networking
team:
- Josh Rosso
title: Container Networking
topics:
- Kubernetes
weight: 32
oldPath: "/content/guides/kubernetes/container-networking.md"
aliases:
- "/guides/kubernetes/container-networking"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
---

Kubernetes uses the [Container Network
Interface](https://github.com/containernetworking/cni) (CNI) to provide
networking functionality to containers. Networking is implemented in CNI
plugins. The interface / plugin model enables Kubernetes to support many
networking options implemented via plugins such as Calico, Antrea, and Cilium.

Anyone may write a CNI-plugin. The expectation is the plugin will support
specific operations defined in the specification (e.g.
[0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md#parameters)).
These operations include:

- `ADD`: Add a container to the network.
- `DEL`: Delete a container from the network.
- `CHECK`: Check whether the container's network is as expected.

CNI Plugins are often only concerned with container to container networking.
Kubernetes constructs such as
[services](https://kubernetes.io/docs/concepts/services-networking/service/) are
still handled by kube-proxy. This means selecting a target pod for a service may
still happen via IPtables (round-robin) on the host. Once the target pod is
selected, the networking facilitated by the CNI plugin will pick up from there.
Some plugins replace kube-proxy for their own alternative implementation.
[Cilium](https://cilium.io/blog/2019/08/20/cilium-16), for example, has replaced
kube-proxy for an implementation using
[BPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter).

Enforcement of [network
policy](https://kubernetes.io/docs/concepts/services-networking/network-policies)
is contingent on your choice of plugin. Some plugins, such as
[Flannel](https://github.com/coreos/flannel), do not enforce policy at all. This
means that adding network policy objects to your cluster will have no impact.
Most plugins, however, do enforce policy. Policy can be set for both ingress
traffic to pods and egress traffic from pods. Kubernetes has a policy API that
plugins may choose to respect. Some plugins, such as
[Calico](https://docs.projectcalico.org/v3.11/reference/resources/networkpolicy)
and [Cilium](https://docs.cilium.io/en/v1.6/kubernetes/policy) offer extended
APIs through Custom Resource Definitions (CRDs) that provide additional
functionality. Kubernetes network policy is namespace scoped with no ability to
apply cluster-wide policy. The only CNI-plugin that offers cluster-level policy
is Calico's
[GlobalNetworkPolicy](https://docs.projectcalico.org/v3.11/reference/resources/globalnetworkpolicy)
CRD.

Choosing a CNI Plugin comes down to your network topology, desired container
networking features, and understanding of different routing protocols. Plugins
that can be used in Kubernetes have all sorts of routing features such as:

- BGP for route sharing
- Tunneling protocols (VXLAN, GRE, IP-in-IP, and more)
- Native routing (no encapsulation)

## Popular Tooling and Approaches

### Calico

Calico has been one of the predominant CNI-plugins since Kubernetes became
popular. It supports a variety of routing modes including IP-in-IP, VXLAN, and
Native (non-encapsulated). It even supports versatile routing options such as
only encapsulating when crossing subnet boundaries. With Calico's native-routing
abilities, it does not need to incur encapsulation overhead. This means Calico
can achieve near native network speeds.

[BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol) is used to
distribute routes when running in IP-in-IP or native routing modes. BGP is a
well known route sharing protocol that many enterprise networks are capable of
peering with. This enables enterprises to integrate pod networks into their
networking fabric, making pods routable. This capability unlocks a multitude of
network topologies.

Network Policy support in Calico is arguably the strongest of all CNI plugins.
Historically, the work Calico did with network policy influenced Kubernetes
adoption of those constructs. For example, Calico implemented egress policy
before the Kubernetes project did. Along with full support for Kubernetes
network policy, Calico offers its own
[NetworkPolicy](https://docs.projectcalico.org/v3.11/reference/resources/networkpolicy)
and
[GlobalNetworkPolicy](https://docs.projectcalico.org/v3.11/reference/resources/globalnetworkpolicy)
CRDs. These network policies offer advanced features. The global policy enables
administrators to apply cluster-wide policies. Calico also supports mixing both
Kubernetes native policies and its own CRDs.

Calico is the most common CNI-plugin we have seen in deployments. Tigera, the
creators of Calico, offer extended enterprise features and support. Additionally
VMware offers break-fix Calico support for those with the appropriate support
subscription. With the above in mind, Calico is generally our first choice for
CNI-plugin.

**Pros:**

- Diverse routing mode support.
  - IP-in-IP
  - Native
  - VXLAN
- Integrates with the Kubernetes API server.
  - No direct etcd access required.
- Native routing incurs minimal overhead.
  - Supports cross-subnet only encapsulation.
  - Uses native routing for all intra-subnet routing.
- BGP route sharing enables advanced topologies.
- Most capable network policy support.
  - Includes Calico-specific GlobalNetworkPolicy.
- Break-fix support offered by VMware.
- External data store not required
  - Uses Kubernetes API.
  - Scales with [typha](https://github.com/projectcalico/typha).

**Cons:**

- BGP might not be possible in your environment
  - If so, Calico's VXLAN mode does not use BGP.

### Antrea

Antrea provides container networking based on Open vSwitch. Using Open vSwitch,
Antrea is capable of offering routing via VXLAN, Geneve, GRE, or STT
encapsulation methods. Unlike Calico, Antrea can enforce networking rules inside
Open vSwitch, which should provide more performant policy enforcement relative
to IPtables.

![Antrea](/images/guides/kubernetes/container-networking/antrea.png)

Those familiar with Open vSwitch are likely to find Antrea a very compelling
option. Since Antrea is still in pre-release, we don't recommend it for
production use cases at this time.

**Pros:**

- Support many encapsulation protocols.
  - VXLAN
  - Geneve
  - GRE
  - STT
- Familiar to users of Open vSwitch.
- Performant network policy enforcement.
- [Octant](https://github.com/vmware-tanzu/octant) UI support.
- Break-fix support from VMware.

**Cons:**

- Must have Open vSwitch kernel module.

### NSX-T

NSX-T is an extremely capable network virtualization technology. It is used to
facilitate networking in datacenters around the world. As such, it is very
uncommon to see the NSX-T CNI plugin used unless an existing NSX-T deployment
exists. Introducing a net new NSX-T deployment for a Kubernetes platform
introduces a lot of operational overhead. It is also common for teams running
Kubernetes on top of vSphere + NSX-T to run a different CNI-plugin (such as
Calico or Flannel) on top of it.

With this in mind, we only recommend considering the NSX-T CNI plugin if there
is an existing NSX-T deployment and a strong desire to integrate container
networking with it directly.

**Pros:**

- NSX-T is familiar to many VI Admins.
- NSX-T makes container networking feel more like normal VM networking.
  - e.g. Namespaces are assigned their own subnets.

**Cons:**

- Architecting, Deploying, and Operating NSX-T is a non-trivial task.
  - It can be overkill for just container networking.
- Unlike most plugins, you're not running the pod network on top of another.
  - You're instead using the existing network to run the pod network.

### Cilium

Cilium is a powerful CNI-plugin that uses
[BPF](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter) to make routing
decisions in a highly performant manner. Cilium has replaced kube-proxy, which
facilitates services, for it's own eBPF implementation. This makes service
routing decisions O(1) rather than the time complexity it takes to traverse many
IPtables chain rules.

Cilium's network policy enforcement also uses BPF. Calico leverages IPtables,
which can have its own scalability issues and troubleshooting complexity.
Overall, Cilium appears to be a very promising CNI in the Kubernetes ecosystem.

Cilium is new to the ecosystem and does not have as many production stories as
we'd expect before recommending it. It may be worth considering for lab
environments, depending on your tolerance for risk and comfort with BPF, or
you may want to hold off a little longer.

**Pros:**

- BPF enables extremely fast routing decisions.
  - Services
  - Network Policy
  - Routing
- Community support and enthusiasm is growing.
  - Likely to become a predominant CNI-plugin.

**Cons:**

- Need to ensure BPF kernel support.
  - Sometimes not possible in highly regulated environments.
  - Especially with older versions of RHEL.
- You cannot mix Cilium network policy with Kubernetes network policy.
- Newer player in the ecosystem, still experiencing paper cuts.
  - CRD-based backend not scalable yet.