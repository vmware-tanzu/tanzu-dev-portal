---
date: '2021-02-24'
description: A reference architecture for implementing the Istio Service Mesh
keywords:
- Kubernetes
- Istio
lastmod: '2021-02-24'
linkTitle: Istio Reference Architecture
parent: Service Routing
title: Istio Reference Architecture
weight: 1600
oldPath: "/content/guides/kubernetes/service-routing-istio-refarch.md"
aliases:
- "/guides/kubernetes/service-routing-istio-refarch"
level1: Building Kubernetes Runtime
level2: Kubernetes Architecture
---

## Introduction

A lot of enterprises are embarking on a journey to adopt cloud native
technologies to meet their technology strategy goals and address internal and
external challenges. One of the key components of the technology stack is the
Platform as a Service (PaaS) which will be the target platform for a number of
migrated and new applications. These applications will be required to adopt
latest standards in security, performance, scalability and resilience in a
manner which is agile and efficient.

In order to adopt these standards, enterprises are looking towards open source
[Istio Service Mesh](https://istio.io/latest/docs/concepts/what-is-istio/) to
manage the ever-increasing mesh of microservices and to help simplify key
operational tasks.

Istio implementation brings it's own challenges, for example:

- Installation and upgrade process using istio-cni.
- Automation of certificate management at the edge (ingress/egress) of mesh.
- Different resource definitions
  (gateway/VirtualService/DestinationRule/ServiceEntry) created while
  communicating at the edges (ingress/egress) of mesh for different use cases.
- How to share responsibility across cluster-admin/Mesh Admin/Application
  Developer.
- Operational aspects (monitoring/logging/tracing).

This document helps you to understand the concept and details the reference
architecture implementation.

![Inter service mesh communication](/images/guides/kubernetes/service-routing/diagrams/istio-introduction.png)

Some salient features of the implementation are as follows.

**Assumption:**

- Each Kubernetes cluster has only one service mesh control plane and data
  plane.
- All the communication within the service mesh takes place via mutual TLS.
- All external communication across two service meshes running in separate
  clusters takes place via mutual TLS through ingress/egress gateways.
- In order to implement mutual TLS across service meshes, all TLS certificates
  are provisioned via [centralized vault](https://www.vaultproject.io/).
- To automate the provisioning of certificate via centralized vault, a
  [cert-manager](https://cert-manager.io/docs/) is used. All clusters have their
  own cert-manager installed and connected to the centralized vault.

## Installation

![Istio Architecture](/images/guides/kubernetes/service-routing/diagrams/istio-install-arch.png)

Istio installation refers to Istio control plane installation, which consists of
following component (pods).

- istio-cni plugin (running as DaemonSet) in the kube-system namespace
- ingress gateway in the istio-system namespace
- egress gateway in the istio-system namespace
- istiod in the istio-system namespace

### Prerequisite

In order to install Istio, following are the prerequisites.

- cluster-admin permission is required.
- To get istio-cni working, create the required pod security policy and it's
  corresponding role and role binding.
- It is recommended security practice to configure third party service account tokens.
- To install Istio in an offline/airgap environment, a container registry is required.

#### Istio CNI Plugin

Istio injects initContainer (istio-init) in any pod which is part Istio mesh. It
programs all the iptables rules required for intercepting all incoming and
outgoing request to application pod. These rules are programmed into the pod’s
network namespace. That requires some elevated privileges. Service accounts
deploying pods to the mesh need to have sufficient Kubernetes RBAC permissions
to deploy containers with the NET_ADMIN and NET_RAW capabilities.

Running production workloads in most enterprises with such elevated privileges
is a not advisable. Here comes the
[Istio CNI plugin](https://istio.io/latest/docs/setup/additional-setup/cni/) to
rescue. This plugin is a replacement for the istio-init container that performs
the same networking functionality but without requiring Istio users to enable
elevated privileges.

![istio-init vs istio-cni IPtables rules configuration
](/images/guides/kubernetes/service-routing/diagrams/istio-cniandnoncni.png)

The istio-cni is installed as a DaemonSet in the kube-system namespace. The
rationale behind using kube-system namespace over istio-system is that istio-cni
does not support multitenancy and in the event that multiple control planes are
running (this is not possible at the moment) in a single Kubernetes cluster,
there is no confusion as to which Istio control namespace, istio-cni is running.
The istio-cni namespace is configurable using components.cni.namespace parameter
during Istio installation.

To get istio-cni running, the corresponding
[pod security policy, role and role binding](#podsecuritypolicy-definition-for-istio-cni)
are required in the kube-system namespace.

The following Pod security policy needs to be applied. Only important snippets
are shown here.

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: istio-control-plane
spec:
  runAsUser:
    rule: "RunAsAny"
  allowedHostPaths:
    - pathPrefix: "/etc/cni/net.d"
    - pathPrefix: "/opt/cni/bin"
```

The YAML config above defines a restricted PSP that enables Istio CNI components
to be running in a Kubernetes cluster. In particular, this PSP provides access
to the **host network and host path** volumes.

#### Third Party JWT Token

To authenticate with the Istio control plane, the Istio proxy will use a Service
Account token. Kubernetes supports two forms of these tokens:

- Third party tokens, which have a scoped audience and expiration.
- First party tokens, which have no expiration and are mounted into all pods.

To determine if your cluster supports third party tokens, look for the TokenRequest API.

```bash
$ kubectl get --raw /api/v1 | jq '.resources[] | select(.name | index("serviceaccounts/token"))'
{
    "name": "serviceaccounts/token",
    "singularName": "",
    "namespaced": true,
    "group": "authentication.k8s.io",
    "version": "v1",
    "kind": "TokenRequest",
    "verbs": [
        "create"
    ]
}
```

In the config above, the kind `TokenRequest` indicates third party tokens are
supported by the Kubernetes cluster.

Where third party support is needed, one can add the following flags to the
kube-apiserver

```bash
     - --service-account-key-file=/etc/kubernetes/pki/sa.pub
     - --service-account-signing-key-file=/etc/kubernetes/pki/sa.key
     - --service-account-issuer=kubernetes.default.svc
```

In order to verify the installation of Istio create a pod which has istio-proxy
injected. Verify that the istio-proxy definition in the pod has the istio-token
mounted.

```yaml
volumeMounts:
  - mountPath: /var/run/secrets/tokens
    name: istio-token
```

Verify that token is generated at (/var/run/secrets/tokens/istio-token) in
istio-proxy container. Check it has an expiration date `exp` and audience `aud`
defined as `istio-ca`.

![JWT Token Contents](/images/guides/kubernetes/service-routing/istio-thirdpartytoken.png)

#### Container Registry

In order to install Istio in an offline/airgapped environment, a container registry
is required which contains all the requires container images needed for
installation.

The following images are required for installing Istio 1.7.0

- docker.io/istio/pilot:1.7.0
- docker.io/istio/proxyv2:1.7.0
- docker.io/istio/install-cni:1.7.0

An example of pulling and pushing images to registry:

```bash
docker pull docker.io/istio/install-cni:1.7.0
docker tag istio/install-cni:1.7.0 {{ REGISTRY_HOSTNAME }}/istio/istio/install-cni:1.7.0
docker push {{ REGISTRY_HOSTNAME }}/istio/istio/install-cni:1.7.0
```

All the worker nodes of the Kubernetes cluster need to be able to access this
registry and be able to pull required images from this registry.

### Installation Method

Istio uses the IstioOperator custom resource definition (CRD) for Istio
installation. An example of one such CRD is as follows.

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: installed-state
spec:
  profile: default
```

Istio can be installed in two different ways.

- **istioctl command**: Providing the full configuration in an IstioOperator CR
  is considered an Istio best practice for production environments.

- **Istio operator**: One needs to consider security implications when using the
  operator pattern in Kubernetes. With the istioctl install command, the
  operation will run in the admin user’s security context, whereas with an
  operator, an in-cluster pod will run the operation in its security context.

{{% callout %}}
**Note**: All the following steps use the **istioctl command** method.
{{% /callout %}}


This command is just for reference to get installation quickly and highlighting
the important parameters.

```bash
istioctl manifest install --set profile=demo --set components.cni.enabled=true --set components.cni.namespace=kube-system --set values.global.istioNamespace=istio-system --set values.global.hub={{ REGISTRY_HOSTNAME }}/istio --set meshConfig.outboundTrafficPolicy.mode=REGISTRY_ONLY --set values.global.controlPlaneSecurityEnabled=true --set meshConfig.enablePrometheusMerge=true --set revision=1-7-0
```

For a production-grade installation,
[istiooperator-airgap-1-7-0.yaml](#production-grade-istiooperator-v170) is used.

```bash
istioctl install -f istiooperator-airgap-1-7-0.yaml
```

#### Installation Validation

The istioctl command creates an IstioOperator custom resource called
`installed-state-1-7-0`.

```bash
$ kubectl get IstioOperator -n istio-system
NAME                    REVISION   STATUS   AGE
installed-state-1-7-0   1-7-0               143m
```

To verify the istio-cni DaemonSet is deployed successfully:

```bash
$ kubectl get daemonset -n kube-system
NAME             DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE
istio-cni-node   4         4         4       4            4
```

To verify complete Istio installation:

```bash
istioctl verify-install -f istiooperator-airgap-1-7-0.yaml
```

If successful, the above command results in following output:

```bash
ConfigMap: istio.istio-system checked successfully
cont**
cont**
IstioOperator: installed-state.istio-system checked successfully
Checked 21 custom resource definitions
Checked 2 Istio Deployments
Istio is installed successfully
```

To verify all images are coming from the centralized container registry:

```bash
kubectl get deployments istio-ingressgateway -n istio-system -o yaml|grep -i image:
        image: {{ REGISTRY_HOSTNAME }}/istio/proxyv2:1.7.0
```

### Uninstall Method

Uninstall control plane (istiod) only:

```bash
istioctl x uninstall -f istiooperator-airgap-1-7-0.yaml
```

- Uninstall Istio completely (including CNI):

```bash
istioctl x uninstall -f istiooperator-airgap-1-7-0.yaml --purge
```

### Integration with CI/CD

Complete installation process can be integrated with existing CI/CD system. The
following considerations are required.

- Integration of istioctl with the pipeline.Pipeline running it required
  cluster-admin permission.
- Integration of some security vulnerability tooling with the pipeline, which
  ensures that there is no security vulnerability before installing Istio.

### Conformant with Security Vulnerability

All images are existing in centralized container registry.

This centralized container registry has policy defined regarding content trust
and vulnerability scanning.

For example, [Harbor](https://goharbor.io/) registry interrogation services
provides two (Trivy and Clair) vulnerability scanners.

![policy defined in harbor](/images/guides/kubernetes/service-routing/istio-harbor-config.png)

Any image pushed to this registry passes through the vulnerability scanning.

The following is an example of one result of Harbor registry vulnerability
scanning with Trivy.

![vulnerability scanner result by Trivy](/images/guides/kubernetes/service-routing/istio-trivy-result.png)

Vulnerability scanners ensure that any new/existing vulnerability is tagged and
that no new pod can be created/scaled in cases where images have not passed
vulnerability criteria defined by the security team.

Following are examples of how vulnerability scanners prevent any new pods being
created.

```
Warning  Failed     9s               kubelet, ip-10-0-1-75.us-east-2.compute.internal  Failed to pull image "harbor-k8s.xxxx.com/istio/install-cni:1.7.0": rpc error: code = Unknown desc = failed to pull and unpack image "harb│
│or-k8s.xxxx.com/istio/install-cni:1.7.0": failed to copy: httpReaderSeeker: failed open: unexpected status code https://harbor-k8s.xxxx.com/v2/istio/install-cni/manifests/sha256:09ac572eabda6b242aa5140f6bee0cbf809a4eb13b668d047│
│23cc7e8a1c272c6: 412 Precondition Failed - Server message: unknown: The image is not signed in Notary.
```

```
  Warning  Failed     6s               kubelet, ip-10-0-1-75.us-east-2.compute.internal  Failed to pull image "harbor-k8s.xxxx.com/istio/install-cni:1.7.0": rpc error: code = Unknown desc = failed to pull and unpack image "harb│
│or-k8s.xxxx.com/istio/install-cni:1.7.0": failed to copy: httpReaderSeeker: failed open: unexpected status code https://harbor-k8s.xxxx.com/v2/istio/install-cni/manifests/sha256:09ac572eabda6b242aa5140f6bee0cbf809a4eb13b668d047│
│23cc7e8a1c272c6: 412 Precondition Failed - Server message: unknown: current image with 268 vulnerabilities cannot be pulled due to configured policy in 'Prevent images with vulnerability severity of "High" or higher from runnin│
│g.' To continue with pull, please contact your project administrator to exempt matched vulnerabilities through configuring the CVE allowlist.                                                                                      │
│  Warning  Failed     6s               kubelet, ip-10-0-1-75.us-east-2.compute.internal  Error: ErrImagePull
```

For any pod which is already running and a new security vulnerability is
detected, int is continuously monitored by security team and it is for them to
decide whether to kill the pod or keep it running depending upon the level and
nature of vulnerability.

### Sidecar Injection

There are different ways of injecting the Istio sidecar into a pod.

- **Manual sidecar injection**: Manual injection directly modifies
  configuration, like deployments, and injects the proxy configuration into it.

- **Automatic sidecar injection**: Sidecars are automatically added to
  Kubernetes pods using a mutating webhook admission controller provided by
  Istio.

  - The default configuration injects the sidecar into pods in any namespace
    with the `istio.io/rev=1-7-3` label.
  - Disable the injection policy in configmap and add `sidecar.istio.io/inject`
    annotation with value `true` to the pod template spec to override the
    default and enable injection.

Application teams organize the workloads participating in a mesh in single or
multiple namespaces depending upon the architecture (microservices bounded
context/non microservices). Our general recommendation is to keep the mesh and
non mesh related workloads in different namespaces. Automatic sidecar injection
with **default configuration** is recommended as it is easier to maintain during
the upgrade process. In this case, the Mesh Admin has clear visibility which
workload is running with which version and can take action accordingly.

```bash
$ kubectl -n istio-system get configmap istio-sidecar-injector-1-7-0 -o jsonpath='{.data.config}' | grep policy:
policy: enabled
```

```bash
$ kubectl get mutatingwebhookconfiguration istio-sidecar-injector-1-7-0 -o yaml | grep "namespaceSelector:" -A7
  namespaceSelector:
    matchExpressions:
    - key: istio-injection
      operator: DoesNotExist
    - key: istio.io/rev
      operator: In
      values:
      - 1-7-0
```

```bash
$ kubectl get ns -l istio.io/rev=1-7-0
NAME       STATUS   AGE
bookinfo   Active   15h
```

### Upgrade Process/Patch Management

Upgrading Istio can be done by first running a canary deployment of the new
control plane, allowing you to monitor the effect of the upgrade with a small
percentage of the workloads, before migrating all of the traffic to the new
version. This is much safer than doing an in-place upgrade and is the
recommended upgrade method.

Note: Upgrading across more than one minor version (e.g., 1.5.x to 1.7.x) in one
step is not officially tested or recommended.

To illustrate the upgrade process please see below (sample `bookinfo` example
and an upgrade from 1.7.0 to 1.7.3 is considered as an example).

![Current Installation state ](/images/guides/kubernetes/service-routing/istio-upgrade1.png)

The above picture shows the important labels and component versions in current
installed state (1.7.0).

In order to upgrade Istio to 1.7.3, set `revision: 1-7-3` in IstioOperator
definition file as shown in sample
[istiooperator-airgap-1-7-3.yaml](#production-grade-istiooperator-v173) and
install it using istioctl:

```bash
istioctl install -f istiooperator-airgap-1-7-3.yaml
```

{{% callout %}}
**Note**: istioctl version is the target version (e.g. 1.7.3).
{{% /callout %}}


![Control plane upgrade](/images/guides/kubernetes/service-routing/istio-upgrade2.png)

After running the command, you will have two control plane deployments and
services and mutating webhook running side-by-side:

```bash
kubectl get pods -n istio-system -l app=istiod
NAME                            READY   STATUS    RESTARTS   AGE
istiod-1-7-0-57f6b5cc56-cn7tr   1/1     Running   0          33m
istiod-1-7-3-57c6c6d9d7-99w68   1/1     Running   0          7m9s
```

```bash
kubectl get svc -n istio-system -l app=istiod
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                         AGE
istiod-1-7-0   ClusterIP   10.111.81.116   <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP,853/TCP   34m
istiod-1-7-3   ClusterIP   10.109.95.131   <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP,853/TCP   11m
```

```bash
kubectl get mutatingwebhookconfigurations
NAME                           WEBHOOKS   AGE
istio-sidecar-injector-1-7-0   1          34m
istio-sidecar-injector-1-7-3   1          11m
```

Istio CNI plugin is also upgraded to targeted version.

```bash
kubectl get ds istio-cni-node -n kube-system -o yaml|grep image:
        image: {{ hostname }}/istio/install-cni:1.7.3
```

Unlike istiod, Istio gateways do not run revision-specific instances, but are
instead in-place upgraded to use the new control plane revision.

```bash
istioctl proxy-config endpoints $(kubectl -n istio-system get pod -l app=istio-ingressgateway -o jsonpath='{.items..metadata.name}').istio-system --cluster xds-grpc -ojson | grep hostname
                "hostname": "istiod-1-7-3.istio-system.svc"
```

This in-place upgrade makes gateways unavailable for fraction of time. Thorough
testing is required to see how much time it is down. Depending upon the result
minReplicas can be adjusted.

`hpaSpec` in IstioOperator resource:

```yaml
ingressGateways:
  - enabled: true
k8s:
  hpaSpec:
    maxReplicas: 5
    minReplicas: 2
```

Number of `replicas` in istio-ingressgateway deployment:

```yaml
spec:
  replicas: 2
  strategy:
    rollingUpdate:
      maxSurge: 100%
      maxUnavailable: 25%
    type: RollingUpdate
```

Using multiple replicas can help in ensuring availability of ingress gateway
during upgrade. This need to be tested thoroughly.

Simply installing the new revision has no impact on the existing sidecar
proxies. All the workloads are still running with the old version of Istio
proxy, e.g. proxyv2:1.7.0, and pointing to the old control plane.

```bash
istioctl proxy-config endpoints $(kubectl -n bookinfo get pod -l app=productpage -o jsonpath='{.items..metadata.name}').bookinfo --cluster xds-grpc -ojson | grep hostname
                "hostname": "istiod-1-7-0.istio-system.svc"
```

To upgrade these, one must configure them to point to the new istiod-1-7-3 control plane. This is controlled during sidecar injection based on the namespace label `istio.io/rev`.

![Data plane upgrade](/images/guides/kubernetes/service-routing/istio-upgrade3.png)

**_Figure: Data plane upgrade_**

To upgrade the namespace bookinfo, remove the `istio.io/rev=1-7-0 label`, and
add `istio.io/rev=1-7-3 revision`:

```bash
kubectl label namespace bookinfo istio.io/rev=1-7-3
```

Restart the deployment in bookinfo namespace:

```bash
kubectl rollout restart deployment -n bookinfo
```

Verify that all pods are running with new labels:

```bash
kubectl get pods -n bookinfo -l istio.io/rev=1-7-3
```

Verify that the workloads are running new version of Istio proxy, e.g.
proxyv2:1.7.3, and pointing to the new control plane:

```bash
istioctl proxy-config endpoints $(kubectl -n bookinfo get pod -l app=productpage -o jsonpath='{.items..metadata.name}').bookinfo --cluster xds-grpc -o json | grep hostname
                "hostname": "istiod-1-7-3.istio-system.svc"
```

Grading both the control plane and data plane, you can uninstall the old control
plane:

```bash
istioctl x uninstall -f istiooperator-airgap-1-7-0.yaml
```

![targeted(1.7.3) installed state](/images/guides/kubernetes/service-routing/istio-upgrade4.png)

Confirm that the old control plane has been removed and only the new one still
exists in the cluster:

```bash
kubectl get pods -n istio-system -l app=istiod
NAME                            READY   STATUS    RESTARTS   AGE
istiod-1-7-3-57c6c6d9d7-99w68   1/1     Running   0          68m
```

In case new version is not working properly and want to revert back to previous
version:

```bash
istioctl install -f istiooperator-airgap-1-7-0.yaml
kubectl label namespace bookinfo istio.io/rev=1-7-0
kubectl rollout restart deployment -n bookinfo
istioctl x uninstall -f istiooperator-airgap-1-7-3.yaml
```

#### Build & Release Cadence

Istio produces new builds of Istio for each commit. Around once a quarter or so,
Istio build a Long Term Support (LTS) release, and run through a bunch more
tests and release qualifications. Finally, if they find something wrong with an
LTS release, they issue patches.

The different types represent different product quality levels and different
levels of support from the Istio team. In this context, support means that they
will produce patch releases for critical issues and offer technical assistance.

![Build & Release Cadence](/images/guides/kubernetes/service-routing/istio-cadence.png)

### Network isolation

To further tighten the security of your applications, the following network
policy are created.

#### Deny by Default

To ensure no inter-pod communication is possible, this policy can be applied
globally. The idea here is to ensure that if an application developer wants to
have a pod communicating with other pods, they need to create another network
policy which is specific to their pod's needs.

**Cluster Admin** creates this as default network policy in all the namespaces:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-by-default
  namespace: bookinfo
spec:
  podSelector: {}
  policyTypes:
    - Ingress
```

#### Allow from Istio Namespace

In order to access workloads running in the service mesh from outside of the
service mesh, all requests needs to come from Istio ingress gateway. The general
pattern is to expose one service which receives communication from outside
(ingress gateway) and interacts with other services internally within the
namespace.

**Mesh Admin** creates a label on the namespace where Istio ingress gateway is
running (istio-system).

```bash
kubectl label namespace istio-system istio-control-namespace=true
```

**Application Developer** creates a network policy.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-from-istio-namespace
  namespace: bookinfo
spec:
  podSelector:
    matchLabels:
      app: productpage
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              istio-control-namespace: "true"
```

#### Allow from Same Namespace

This is suggested policy whereby all the pods in the same namespace needs to
interact without any policy restriction and because of global network policy
(deny-by-default), cannot interact. Please check with the cluster-admin before
applying this policy.

**Application Developer** creates a network policy:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-same-namespace
  namespace: bookinfo
spec:
  podSelector: {}
  ingress:
    - from:
        - podSelector: {}
```

## Ingress Controller in Kubernetes with Istio

### Cloud Consideration

Once Istio is installed on any cloud, e.g. AWS, Azure, a Service of Type
LoadBalancer provisions an external LoadBalancer. For example, an Elastic Load
Balancer is created by default in AWS.

```bash
kubectl get svc istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP                        PORT(S)
istio-ingressgateway   LoadBalancer   10.97.48.212   xxxx.us-east-2.elb.amazonaws.com   15021:31413/TCP,80:32673/TCP,443:31820/TCP,31400:30472/TCP,15443:31916/TCP
```

A workload from outside service mesh is accessed using the ELB EXTERNAL-IP.

```bash
curl http://xxxx.us-east-2.elb.amazonaws.com/productpage
```

In order to use multiple hostnames, a CNAME type Record is required to be
configured. In AWS, a Route 53 entry is required.

![An example of CNAME record configuration.](/images/guides/kubernetes/service-routing/istio-route53-cname.png)

With the above DNS setting, and after creating the required
[Gateway Definition](#gateway-definition) and
[Virtual Service Definition](#virtual-service-definition), workloads are
accessed with different hostnames.

Hostnames can be defined using following convention: <app
name>.<namespace>.appk8s.com. For example:

```bash
curl http://productpage.bookinfo.appk8s.com
```

Istio by default creates an Elastic Load Balancer when installed on AWS. A
network load balancer (NLB) can also be created by specifying following
annotation during annotation.

```yaml
gateways:
  istio-ingressgateway:
    serviceAnnotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{% callout %}}
**Note**: AWS ELBs and NLBs both support layer 4 load balancing. There has not been
much adoption of NLB with open source Istio. But we don't have any strong
opinion when it comes to comparing these two. When it comes to Istio, Istio's
Gateway resource just lets you configure layer 4-6 load balancing properties
such as ports to expose TLS settings and so on. Application-layer traffic
routing (L7) are configured in virtual service which is bound to Istio gateway.
{{% /callout %}}

### Existing Ingress Control

If an ingress controller such as HAProxy, Contour or NGINX is in use and you do
not wish to replace it with Istio's ingress gateway, they can be used in
conjunction. In this case, the ingress controller will direct traffic intended
for Istio service mesh by creating an Ingress object and using
istio-ingressgateway as backend.

```bash
$ kubectl get svc istio-ingressgateway -n istio-system
NAME                   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                                        AGE
istio-ingressgateway   ClusterIP   10.106.162.8   <none>        15021/TCP,80/TCP,443/TCP,31400/TCP,15443/TCP   70s
```

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: istio
  namespace: istio-system
  labels:
    app: istio
spec:
  rules:
    - host: productpage.bookinfo.appk8s.com
      http:
        paths:
          - backend:
              serviceName: istio-ingressgateway
              servicePort: 80
```

{{% callout %}}
**Note**: If using a HTTPS host for the Ingress, create with passthrough mode
so that mutual authentication can take place at Istio ingress gateway.
{{% /callout %}}

{{% callout %}}
**Note**: The above Ingress definition is just for reference. In this document,
only Istio ingress controller using [Gateway Definition](#gateway-definition)
and [Virtual Service Definition](#virtual-service-definition) is used.
{{% /callout %}}

With the above setting, and after creating required
[Gateway Definition](#gateway-definition) and
[Virtual Service Definition](#virtual-service-definition), workloads are
accessed with different hostnames.

```bash
curl http://productpage.bookinfo.appk8s.com
```

If routing traffic to the Istio ingress gateway through an ingress controller,
you will put an additional hop on the request path. The following picture
illustrates on the left side cluster the additional hop to reach to Istio
ingress gateway as compared to without it on right side.

![Number of hops when using ingress controller in addition to Istio](/images/guides/kubernetes/service-routing/istio-ingresscontroller.png)

### Istio Secure Ingress Gateway with mTLS

By default the TLS protocol only proves the identity of the **server to the
client** using X.509 certificate and the authentication of the client to the
server is left to the application layer. TLS also offers **client-to-server**
authentication using client-side X.509 authentication.This two-way
authentication, when two parties authenticating each other at the same time is
also called Mutual TLS authentication (mTLS).

Following is an example depicting the difference between two (TLS vs mTLS)
certificate exchanges. Notice how the client certificate is requested and
verified depicted by yellow line in mTLS traffic flow.

![TLS(left) vs mTLS(right) handshake](/images/guides/kubernetes/service-routing/istio-tlsvsmtls.png)

As an mTLS service provider, the following certificates are required:

- Server certificate and key
- CA certificate to verify client

These certificates need to be provided as a secret in the namespace where
ingress gateway pod is running. In this example it is running in istio-system
namespace.

The service provider creates the following gateway definition in the application
namespace:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
  namespace: bookinfo
spec:
  selector:
    istio: ingressgateway
  servers:
    - hosts:
        - productpage.bookinfo.appk8s.com
      port:
        name: https
        number: 443
        protocol: HTTPS
      tls:
        credentialName: bookinfo-ingressgateway-certs
        mode: MUTUAL
```

In order to automate server certificate and CA certificate and their associated
secret, the following integrations are required.

- Integration with vault
- Integration with cert-manager

#### Integration with Vault

![Certificates Signed with Vault](/images/guides/kubernetes/service-routing/istio-ingress.png)

Enterprise Root CA exists in centralize vault. This Root CA is required to sign the following:

- server certificate provided by the service provider of the
  application/microservice.
- client certificate which is used to access the above microservice.

In order to access vault from Istio control plane namespace (istio-system), the
following needs to be configured:

Configure allowed domain (appk8s.com):

```bash
vault-0 -- vault write pki/roles/appk8s-dot-com allowed_domains=appk8s.com allow_subdomains=true max_ttl=72h
```

Configure Kubernetes authentication to vault:

```bash
vault exec vault-0 -- vault auth enable kubernetes
```

Configure Kubernetes authentication with service account:

```bash
vault-0 -- vault write auth/kubernetes/config token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
```

A role needs to be created that specify which ServiceAccount in which namespace
can access Vault:

```bash
vault exec vault-0 -- vault write auth/kubernetes/role/issuer bound_service_account_names=issuer bound_service_account_namespaces={{ controlPlaneNamespace }} policies=pki ttl=20m
```

#### Integration with Cert-Manager

Helm base installation is required. A cluster-admin who has permission to create
CRDs, should be able to install it.

Cert-manager is a Kubernetes add-on to automate the management and issuance of
TLS certificates from various issuing sources like vault.

![Cert-Manager and Vault Integration](/images/guides/kubernetes/service-routing/istio-cert-manager-vault-integration.png)

The diagram above describes interaction among different namespaces and vault:

1. **Mesh admin creates** an Issuer in istio-system namespace.
2. Once Issuer is created, cert-manager auto discovers new certificate-issuer .
3. cert-manager connects certificate-issuer to centralized Vault PKI engine.
4. **Application Developer creates** Istio gateway definition in dev namespace
   with credentialName required for mutual TLS.
5. **Application Developer creates** certificate in istio-system namespace with
   the required dnsNames and commonName.
6. cert-manager, which is watching istio-system namespace for any new
   certificate created, picks up the certificate and creates corresponding
   CertificateRequests in istio-system namespace.
7. cert-manager sends Certificate Sign Request (CSR) to centralized Vault PKI
   engine to sign certificate. Vault signs the certificate. CertificateRequests
   and Certificate turns into Ready state.
8. cert-manager generates Kubernetes secret in istio-system namespace.

##### Mesh Admin Responsibility

Mesh Admin needs to perform following steps:

1. create ServiceAccount, which is configured above in Vault.

```bash
kubectl -n istio-system create serviceaccount issuer
```

2. get the secret from above ServiceAccount.

```bash
kubectl -n istio-system  get serviceaccount issuer -o json | jq -r .secrets[].name
issuer-token-6qr6j
```

3. Configure following Issuer in Istio control plane namespace.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: vault-issuer
spec:
  vault:
    server: http://vault.vault
    path: pki/sign/appk8s-dot-com
    auth:
      kubernetes:
        mountPath: /v1/auth/kubernetes
        role: issuer
        secretRef:
          name: issuer-token-6qr6j
          key: token
```

##### Application Developer Responsibility

Application Developer needs to perform following steps.

1. Create gateway definition.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
  namespace: bookinfo
spec:
  selector:
    istio: ingressgateway
  servers:
    - hosts:
        - productpage.bookinfo.appk8s.com
      port:
        name: https
        number: 443
        protocol: HTTPS
      tls:
        credentialName: bookinfo-ingressgateway-certs
        mode: MUTUAL
```

2. Create the Certificate required for the gateway definition.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: bookinfo-ingressgateway-certs
  namespace: istio-system
spec:
  secretName: bookinfo-ingressgateway-certs
  issuerRef:
    name: vault-issuer
  commonName: productpage.bookinfo.appk8s.com
  dnsNames:
    - productpage.bookinfo.appk8s.com
```

3. Verify the CertificateRequests is created successfully.

```bash
kubectl get certificaterequests -n istio-system
NAME                                            READY   AGE
bookinfo-ingressgateway-certs-1409582587        True    5h25m
```

4. Verify the Certificate is created successfully.

```bash
kubectl get certificate bookinfo-ingressgateway-certs -n istio-system
NAME                            READY   SECRET                          AGE
bookinfo-ingressgateway-certs   True    bookinfo-ingressgateway-certs   174m
```

5. Verify the corresponding secret is created.

```bash
kubectl get secret bookinfo-ingressgateway-certs -n istio-system
NAME                            TYPE                DATA   AGE
bookinfo-ingressgateway-certs   kubernetes.io/tls   3      174m
```

#### Secret Structure

Get the detail of secret data.

```bash
kubectl -n istio-system get secret appk8s-dot-com -o=jsonpath='{$.data}'
```

The following describes the contents of the secrets created (ca.crt, tls.crt,
tls.key). What goes where depends upon the integration with cert-manager and
what Root CA or Intermediate CA is configured in vault.

ca.crt:

- In the case that vault is configured as Intermediate CA cert, it will consist
  of Intermediate CA cert only.
- In case vault is configured as Root CA cert, it will consist Root CA cert
  only.
- The thing to notice here is that it does not consist of the full chain of
  authority.

tls.crt:

- Cert Issued by Root CA in vault.
- Issuing CA certificate.
- In case vault is configured as Intermediate CA cert, it will consist of
  Intermediate CA cert and complete chain of authority.

tls.key:

- TLS key generated

{{% callout %}}
**Note**:
- Full automation can be achieved in case that the Root CA is configured in
  vault.
- Full automation **can not** be achieved in the case that an intermediate CA
  certificate in vault.
- In the case that the intermediate certificate is configured in vault, it must
  get the full chain of CA certificate in tls.crt field but not in ca.crt field
  of the certificate generated.
- ca.crt contains the CA certificate which has issued the certificate not the
  full chain.
- In order to get mTLS working, ca.crt field should have the complete chain.
  https://github.com/jetstack/cert-manager/issues/2358
- This issue can partially be resolved by creating
  bookinfo-ingressgateway-certs-ca manually. This will bring challenges in day 2
  operations. You will need to write a utility which keeps track of CA cert in
  vault and the moment it changes, recreate all the secrets
  (bookinfo-ingressgateway-certs-ca) in istio-system automatically.
{{% /callout %}}


#### Access Privilege Required to Create a Certificate

- An Application team can have following namespaces segregated by network policy.
  - istio-system
  - cert-manager
  - Dev
  - Test
  - Prod
- Depending upon their role in the application team, different namespace admins
  may be appropriate.
- Admins of Dev, Test and Prod do not have complete access on istio-system and
  cert-manager.
- App developers and pipelines for Dev, Test and Prod do require permission to
  create certificate in istio-system namespace.
- Create a ClusterRole which has privilege to create certificate in
  istio-system.
- Create a RoleBinding for different tenants which have privilege to create
  certificate in istio-system.

### High Availability for Gateway

Depending upon load, the number of gateway increases/decreases when the
horizontal pod autoscaler is enabled.

```yaml
ingressGateways:
  - enabled: true
    k8s:
      hpaSpec:
        maxReplicas: 5
        metrics:
          - resource:
              name: cpu
              targetAverageUtilization: 80
            type: Resource
        minReplicas: 1
        scaleTargetRef:
          apiVersion: apps/v1
          kind: Deployment
          name: istio-ingressgateway
      resources:
        limits:
          cpu: 2000m
          memory: 1024Mi
        requests:
          cpu: 10m
          memory: 40Mi
```

### Istio Ingress Gateway with JWT

#### Request Authentication

Request auth is used for end-user authentication to verify the credential
attached to the request. Istio enables request-level authentication with JSON
Web Token (JWT) validation and a streamlined developer experience using a custom
authentication provider or any OpenID Connect providers.

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" https://productpage.bookinfo.appk8s.com/productpage
```

As a **MeshAdmin**, RequestAuthentication definition can be applied globally
(across all the namespaces) in istio-system namespace.

    ```yaml
    apiVersion: "security.istio.io/v1beta1"
    kind: "RequestAuthentication"
    metadata:
      name: "reqauth-istio-system"
      namespace: istio-system
    spec:
      jwtRules:
      - issuer: http://<OIDC_PROVIDER>/auth/realms/istio
        jwksUri: http://<OIDC_PROVIDER>/auth/realms/istio/protocol/openid-connect/certs
        forwardOriginalToken: true
    ```

`issuer`: JSON Web Token (JWT) issuer

`jwksUri`: The JSON Web Key Set (JWKS) is a set of keys containing the public keys used to verify any JSON Web Token (JWT).

`forwardOriginalToken`: By default, JWT request tokens are not passed from one
service to another service. It is the responsibility of **Application Developer**
to pass these tokens from one service to another. This can be set to true to
pass the JWT Request token to next service. This forward is valid only for first
hop.

Istio checks the presented token, if presented against the rules in the request
authentication policy, it rejects requests with invalid tokens. When requests
carry no token, **they are accepted by default**. To reject requests without
tokens, **provide authorization rules** that specify the restrictions for
specific operations.

As **MeshAdmin** an AuthorizationPolicy definition can be applied in
istio-system namespace so that Istio ingress gateway does not let any request
through without passing valid JWT.

```yaml
apiVersion: "security.istio.io/v1beta1"
kind: "AuthorizationPolicy"
metadata:
  name: "frontend-ingress"
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  action: DENY
  rules:
    - from:
        - source:
            notRequestPrincipals: ["*"]
```

The above AuthorizationPolicy says that any request coming to ingress gateway
with label `istio: ingressgateway` is denied if it does not have a JWT in
request header.

A token can be obtained as follows. This is an example of one of the OIDC
providers: keycloak. This can vary depending upon the provider.

```bash
curl -X POST 'http://<OIDC_PROVIDER>/auth/realms/istio/protocol/openid-connect/token' -H "Content-Type: application/x-www-form-urlencoded" -d 'username=prod001&password=< PASSWORD >&grant_type=password&client_id=servicemesh' |jq -r .access_token
```

{{% callout %}}
**Note**: In above example username is `prod001`. This will be used to illustrate
some examples in the next section.
{{% /callout %}}

![Sample JWT structure](/images/guides/kubernetes/service-routing/istio-jwttoken.png)

One can access the service by passing the token obtained in the above step to
the <JWT_TOKEN> placeholder.

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" https://productpage.bookinfo.appk8s.com/productpage
```

As an **Application developer**, one can specify their application-specific
AuthorizationPolicy based on the token attribute. In following example only a
specific user(prod001) can access the service.

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: policy
  namespace: bookinfo
spec:
  selector:
  matchLabels:
    app: productpage
  action: ALLOW
  rules:
    - from:
        - source:
            namespaces: ["istio-system"]
      when:
        - key: request.auth.claims[preferred_username]
          values: ["prod001"]
```

Note: Using JWT alone does not encrypt the traffic. One should use mTLS and JWT
together.

```bash
curl -H --cacert ca.crt --cert tls.crt --key /tls.key -H "Authorization: Bearer <JWT_TOKEN>" https://productpage.bookinfo.appk8s.com/productpage
```

## Service Mesh Communication

### Istio Identity

Identity is a fundamental concept of any security infrastructure. At the
beginning of a service-to-service communication, the two parties must exchange
credentials with their identity information for mutual authentication. In
Kubernetes, Service Accounts are treated as service Identities. Istio uses X.509
certificates to carry identities in SPIFFE format. Istio provisions identities
through the secret discovery service (SDS).

### Istio CA

By default, Istio's CA generates a self-signed root certificate and key, and
uses them to sign the workload certificates. By default this certificate is
valid for 10 years. It's mounted in istiod pod.

```bash
kubectl get secret istio-ca-secret -o=jsonpath='{$.data.ca-cert\.pem}' -n istio-system | base64 --decode |openssl x509 -noout -text |grep -A4 -i Issuer
        Issuer: O=cluster.local
        Validity
            Not Before: Oct 28 17:17:26 2020 GMT
            Not After : Oct 26 17:17:26 2030 GMT
```

One can plug in their own root/intermediate certificate by creating a secret
named `cacerts` in istio-system namespace.

```bash
kubectl create secret generic cacerts -n istio-system \
              --from-file=ca-cert.pem \
              --from-file=ca-key.pem \
              --from-file=root-cert.pem \
              --from-file=cert-chain.pem
```

### mTLS Mode

![In-cluster mTLS communication](/images/guides/kubernetes/service-routing/istio-intracluster-mtls.png)

**Mesh Admin** can ensure that all the services inside the mesh are
communicating via mTLS by applying following PeerAuthentication definition:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

The above Global (in istio-system namespace) PeerAuthentication policy enforces
**Application Developer** always specify traffic policy as ISTIO_MUTUAL as
follows:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: productpage
spec:
  host: productpage
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
  subsets:
    - name: v1
      labels:
        version: v1
```

With the DestinationRule TLS mode policy set to ISTIO_MUTUAL, the Istio CA
generates all the required client and server certificates
[automatically](https://istio.io/latest/docs/concepts/security/#pki).

The certificate can be verified if they are created using the SPIFFE format
based on service account.

```bash
kubectl -n bookinfo exec $(kubectl -n bookinfo get pod -l app=productpage -o jsonpath={.items..metadata.name}) -c istio-proxy -- openssl s_client -showcerts -connect details:9080 | openssl x509 -noout -text | grep -B1 -A2 spiffe
            X509v3 Subject Alternative Name: critical
                URI:spiffe://cluster.local/ns/bookinfo/sa/bookinfo-details
```

The issuer of the certificate can be verified by executing the following
command. By default, the workload certificates are provisioned for 24 hours.

```bash
kubectl -n bookinfo exec $(kubectl -n bookinfo get pod -l app=productpage -o jsonpath={.items..metadata.name}) -c istio-proxy -- openssl s_client -showcerts -connect details:9080 | openssl x509 -noout -text | grep -A3 Issuer
        Issuer: O=cluster.local
        Validity
            Not Before: Oct 29 07:26:19 2020 GMT
            Not After : Oct 30 07:26:19 2020 GMT
```

## Egress Gateway in Istio

### Istio Secure Egress Gateway mTLS Origination

#### Within Cluster

![Istio Egress](/images/guides/kubernetes/service-routing/istio-egress-arch-withcluster.png)

**Use case:** An app running in a namespace `sleep` which is part of service
mesh is connecting to a Kubernetes service, e.g.
`my-nginx.mesh-external.svc.cluster.local`, residing in the same Kubernetes
cluster but not in the service mesh.

![Egress Vault and Cert-Manager Flow](/images/guides/kubernetes/service-routing/istio-egress-within-cluster.png)

The diagram above describes the interaction between different namespaces and vault.

##### **Within Cluster Steps**

1. **Mesh admin creates** an Issuer in istio-system namespace.
2. Once Issuer is created, cert-manager auto discovers new certificate-issuer.
3. cert-manager connects certificate-issuer to Centralized Vault PKI engine.
4. **Application Developer creates** the following in `sleep` namespace:
   - Istio egress gateway definition and destination rule (for egress service).
   - virtual service which routes
     - traffic coming from app container on port 80 to egress service on port 443.
     - traffic coming to egress service on port 443 to external service.
5. **Application Developer creates** Certificate in `istio-system` namespace
   with the required dnsNames and commonName.
6. cert-manager, which is watching `istio-system` namespace for any new
   Certificate created, picks up the Certificate and creates corresponding
   CertificateRequests in `istio-system` namespace.
7. cert-manager sends Certificate Sign Request (CSR) to Centralized Vault PKI
   engine to sign certificate. Vault signs the certificate. CertificateRequests
   and Certificate turns into Ready state.
8. cert-manager generates Kubernetes secret in `istio-system` namespace.
9. **Application Developer creates** DestinationRule (for external service) with
   credentialName required for mutual TLS.

##### **Mesh Admin Responsibility**

Mesh Admin needs to perform following steps.

1. Create ServiceAccount, which is configured above in vault.

```bash
kubectl -n istio-system create serviceaccount issuer
```

2. Get the secret from above ServiceAccount.

```bash
kubectl -n istio-system  get serviceaccount issuer -o json | jq -r .secrets[].name
issuer-token-6qr6j
```

3. Configure the following Issuer in Istio control plane namespace.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: vault-issuer
spec:
  vault:
    server: http://vault.vault
    path: pki/sign/appk8s-dot-com
    auth:
      kubernetes:
        mountPath: /v1/auth/kubernetes
        role: issuer
        secretRef:
          name: issuer-token-6qr6j
          key: token
```

##### **Application Developer Responsibility**

{{% callout %}}
**Note**: EXTERNAL_SERVICE_HOST=my-nginx-client.mesh-external.svc.cluster.local
{{% /callout %}}


1. Create egress gateway definition in `sleep` namespace as all traffic external
   to mesh goes via this Egress Gateway.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
    - port:
        number: 443
        name: https
        protocol: HTTPS
      hosts:
        - { {  EXTERNAL_SERVICE_HOST } }
      tls:
        mode: ISTIO_MUTUAL
```

2. Create destination rule in `sleep` namespace. It is required as it determines
   how ISTIO_MUTUAL service residing in service mesh communicates with egress
   gateway.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: egressgateway-for-nginx
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
    - name: nginx
      trafficPolicy:
        loadBalancer:
          simple: ROUND_ROBIN
        portLevelSettings:
          - port:
              number: 443
            tls:
              mode: ISTIO_MUTUAL
              sni: { {  EXTERNAL_SERVICE_HOST } }
```

3. Create virtual service in `sleep` namespace. This virtual service has two functions:
   - HTTP (port:80) traffic originating from app container is redirected to istio-egressgateway.istio-system.svc.cluster.local on port 443
   - Any traffic coming to istio-egressgateway.istio-system.svc.cluster.local on port 443 is redirected to external service (EXTERNAL_SERVICE_HOST)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: direct-nginx-through-egress-gateway
spec:
  hosts:
    - { {  EXTERNAL_SERVICE_HOST } }
  gateways:
    - istio-egressgateway
    - mesh
  http:
    - match:
        - gateways:
            - mesh
          port: 80
      route:
        - destination:
            host: istio-egressgateway.istio-system.svc.cluster.local
            subset: nginx
            port:
              number: 443
          weight: 100
    - match:
        - gateways:
            - istio-egressgateway
          port: 443
      route:
        - destination:
            host: { {  EXTERNAL_SERVICE_HOST } }
            port:
              number: 443
          weight: 100
```

4. Create Certificate in `istio-system` namespace. It is required because a
   client certificate is required to communicate to the external service with
   mutual TLS. This Certificate definition creates a secret (client-credential)
   mentioned in the destination rule below.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: client-credential
  namespace: istio-system
spec:
  secretName: client-credential
  issuerRef:
    name: vault-issuer
  commonName: { {  EXTERNAL_SERVICE_HOST } }
  dnsNames:
    - { {  EXTERNAL_SERVICE_HOST } }
```

5. Create DestinationRule in `istio-system` namespace. It is required as it
   determines how MUTUAL external service communicates with egress gateway.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: originate-tls-for-nginx
spec:
  host: { {  EXTERNAL_SERVICE_HOST } }
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    portLevelSettings:
      - port:
          number: 443
        tls:
          mode: MUTUAL
          credentialName: client-credential
          sni: { {  EXTERNAL_SERVICE_HOST } }
```

#### Inter Cluster

![Egress Inter-Cluster Communication](/images/guides/kubernetes/service-routing/istio-egress-arch-intra-cluster.png)

**Use case:** An app running in a namespace `sleep` which is part of service
mesh is connecting to an external Kubernetes service, e.g.
`my-nginx.mesh-external.svc.cluster.local`, residing in **different** Kubernetes
cluster.

![Egress Vault Cert-Manager Flow](/images/guides/kubernetes/service-routing/istio-egress-intra-cluster.png)

The diagram above describes the interaction between different namespaces and Vault.

Please see the [Within cluster steps](#within-cluster-steps) section for all
different steps involved. The only difference here is in **step 4** where an
additional service entry is required in order to access the service residing in
different Kubernetes cluster. This is required to make sure external service is
available in Istio's internal service registry.

##### **Mesh Admin Responsibility**

Mesh Admin needs to perform following steps.

1. Create a ServiceAccount which is configured above in vault.

```bash
kubectl -n istio-system create serviceaccount issuer
```

2. Get the secret from the above ServiceAccount.

```bash
kubectl -n istio-system  get serviceaccount issuer -o json | jq -r .secrets[].name
issuer-token-6qr6j
```

3. Configure the following Issuer in Istio control plane namespace.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: vault-issuer
spec:
  vault:
    server: http://vault.vault
    path: pki/sign/appk8s-dot-com
    auth:
      kubernetes:
        mountPath: /v1/auth/kubernetes
        role: issuer
        secretRef:
          name: issuer-token-6qr6j
          key: token
```

##### **Application Developer Responsibility**

{{% callout %}}
**Note**: EXTERNAL_SERVICE_HOST=my-nginx-client.mesh-external.appk8s.com
{{% /callout %}}


Please see [Within cluster](#application-developer-responsibility-1) section for
all required responsibilities. Note that an additional service entry is
required. This is required to make sure external service is available in Istio's
internal service registry.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: nginx-k8s
spec:
  hosts:
    - { {  EXTERNAL_SERVICE_HOST } }
  ports:
    - number: 443
      name: https
      protocol: HTTPS
  resolution: DNS
```

#### Access Privilege Required to Create a Certificate and Gateway

- All application teams are responsible for their service mesh.
- An application team can have the following namespaces segregated by network policy.
  - istio-system
  - cert-manager
  - Dev
  - Test
  - Prod
- Depending upon their role in application teams, different namespace admins may
  be appropriate.
- Admins of Dev, Test and Prod do not have complete access on istio-system and
  cert-manager.
- App developers and pipelines for Dev, Test and Prod do require permission to
  create certificate in istio-system namespace.
- Create a ClusterRole which has privileges to create Certificate and Gateway in
  `istio-system`.
- Create a RoleBinding for different tenants which has permission to create
  Certificate in 'istio-system'.

### High Availability for Gateway

Depending upon load, the number of gateway increases/decreases when the
horizontal pod autoscaler is enabled.

```yaml
egressGateways:
  - enabled: true
    k8s:
      hpaSpec:
        maxReplicas: 5
        metrics:
          - resource:
              name: cpu
              targetAverageUtilization: 80
            type: Resource
        minReplicas: 1
        scaleTargetRef:
          apiVersion: apps/v1
          kind: Deployment
          name: istio-egressgateway
      resources:
        limits:
          cpu: 2000m
          memory: 1024Mi
        requests:
          cpu: 10m
          memory: 40Mi
```

## Observability

### Telemetry & Prometheus

Istio generates metrics for all service traffic into, out from, and within an
Istio service mesh. These metrics provide information on behaviors such as the
overall volume of traffic, the error rates within the traffic, and the response
times for requests. By default, Istio configures Envoy to record minimal
statistics.

```bash
kubectl -n bookinfo exec -it {{ SOURCE_POD_NAME}} -c istio-proxy -- pilot-agent request GET stats | more
```

```bash
cluster_manager.cds.version_text: "2020-10-21T10:31:01Z/6"
listener_manager.lds.version_text: "2020-10-21T10:31:01Z/6"
cluster.xds-grpc.assignment_stale: 0
cluster.xds-grpc.assignment_timeout_received:
|
|
```

Istio control plane components export metrics on their own internal behaviors to
provide insight on the health and function of the mesh control plane.

[Prometheus](https://prometheus.io/docs/introduction/overview/) is an
open-source metrics and alerting toolkit. Prometheus works on pull based
mechanism. That means our applications or the Istio service proxy expose an
endpoint with the latest metrics from which Prometheus can the pull/scrape the
metrics.

#### Proxy-Level Metrics

Each proxy generates a rich set of metrics about all traffic passing through the
proxy (both inbound and outbound). The proxies also provide detailed statistics
about the administrative functions of the proxy itself, including configuration
and health information.

Some examples are as follows.

```
envoy_cluster_upstream_rq_completed{cluster_name="xds-grpc"} 7164
envoy_cluster_ssl_connection_error{cluster_name="xds-grpc"} 0
```

![Proxy-level metrics in Prometheus](/images/guides/kubernetes/service-routing/istio-envoy-level-metrics.png)

#### Service-Level Metrics

Istio provides a set of service-oriented metrics for monitoring service
communications. These metrics cover the four basic service monitoring needs:
**latency, traffic, errors, and saturation**

[Standard Istio metrics ](https://istio.io/latest/docs/reference/config/policy-and-telemetry/metrics/)
are exposed for scraping by Prometheus by default.

![Service-level metrics in Prometheus](/images/guides/kubernetes/service-routing/istio-service-level-metrics.png)

#### Control Plane Metrics

[These metrics](https://istio.io/latest/docs/reference/commands/pilot-discovery/#metrics)
allow monitoring of the behavior of Istio itself.

![Control-Plane metrics in Prometheus](/images/guides/kubernetes/service-routing/istio-controlplane-metrics.png)

#### Prometheus Architecture

In an Istio mesh, each component exposes an endpoint that emits metrics. To
gather metrics for the entire mesh, configure Prometheus to scrape:

- The control plane (istiod deployment)
- Ingress and Egress gateways
- The Envoy sidecar
- The user applications (if they expose Prometheus metrics)

The recommended approach for production-scale monitoring of Istio with
Prometheus is to use
[hierarchical federation](https://prometheus.io/docs/prometheus/latest/federation/#hierarchical-federation)
in combination with a collection of recording rules.

![Prometheus architecture in production](/images/guides/kubernetes/service-routing/istio-prometheus-arch.png)

The Istio pods in the control and data planes declare they are ready to have
metrics scraped by Prometheus by way of annotations in pod definition.

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/path: /stats/prometheus
    prometheus.io/port: "15090"
    prometheus.io/scrape: "true"
```

One can verify that the pod metrics are ready to be scraped by checking targets
in Prometheus.

![Prometheus status target](/images/guides/kubernetes/service-routing/istio-promethus-bookinfo-metrics.png)

Prometheus instances that are deployed locally to each cluster for Istio act as
initial collectors. A local Prometheus scrapes the metrics from different
services. Metrics fill up underlying storage very fast over a period of days or
weeks.The recommended approach is to keep a short retention window on this local
cluster. If you deploy this Prometheus server to the `istio-system` namespace,
you do not need to worry about additional network policy.

Modify the configuration of your production-ready deployment of Prometheus to
scrape the federation endpoint of the Istio Prometheus. It is not required to
scrape all the metrics. Only production relevant metrics are scraped.

#### Grafana

Prometheus is a time-series database and collection toolkit. Once metrics are
collected, Prometheus brings a simple expression browser to help explore trends
and metrics, Grafana is a popular and powerful open-source graph and
visualization tool that works well with Prometheus.

Istio comes with some pre built
[dashboards](https://istio.io/latest/docs/tasks/observability/metrics/using-istio-dashboard/)
which consist of following sections.

**Mesh Summary View:** provides Global Summary view of the Mesh which shows
HTTP/gRPC and TCP workloads in the Mesh.

**Individual Services View:** provides metrics about requests and responses for
each individual service within the mesh (HTTP/gRPC and TCP).

**Individual Workloads View:** provides metrics about requests and responses for
each individual workload within the mesh (HTTP/gRPC and TCP).

#### Installing Prometheus and Grafana

##### **Prometheus Installation**

Istio comes with
[built-in](https://istio.io/latest/docs/ops/integrations/prometheus/#option-1-quick-start)
Prometheus installation, which contains all the required scraping
configurations.

To use an existing Prometheus instance, add the scraping configurations from
[prometheus/configmap.yaml](https://raw.githubusercontent.com/istio/istio/release-1.7/manifests/charts/istio-telemetry/prometheus/templates/configmap.yaml)
to your configuration.

In both the above cases, access to metrics are provided using Grafana with RBAC.

##### **Grafana Installation**

Istio provides a
[basic sample](https://istio.io/latest/docs/ops/integrations/grafana/#option-1-quick-start)
installation to quickly get Grafana up and running. It is bundled with all of
the Istio dashboards already installed. One can remotely access Grafana
[securely](https://istio.io/latest/docs/tasks/observability/gateways/#option-1-secure-access-https).

If using an existing Grafana instance, the following dashboards can be imported
into its dashboard:

- [Mesh Dashboard](https://grafana.com/grafana/dashboards/7639) provides an
  overview of all services in the mesh.
- [Service Dashboard](https://grafana.com/grafana/dashboards/7636) provides a
  detailed breakdown of metrics for a service.
- [Workload Dashboard](https://grafana.com/grafana/dashboards/7630) provides a
  detailed breakdown of metrics for a workload.
- [Performance Dashboard](https://grafana.com/grafana/dashboards/11829) monitors
  the resource usage of the mesh.
- [Control Plane Dashboard](https://grafana.com/grafana/dashboards/7645)
  monitors the health and performance of the control plane.

#### Prometheus Annotations

By passing **--set meshConfig.enablePrometheusMerge=true** during installation,
appropriate prometheus.io annotations will be added to all data plane pods to
expose metrics for scraping. With this option, the Envoy sidecar will merge
Istio’s metrics with the application metrics. The merged metrics will be scraped
from /stats/prometheus:15020. This option exposes all the metrics in plain text.

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/path: /stats/prometheus
    prometheus.io/port: "15020"
    prometheus.io/scrape: "true"
```

In the case that the application is also exposing custom app metrics in
Prometheus format, **Application Developer** needs to provide application
specific Prometheus annotation in pod definition.

Following is an example of a Spring Boot application pod definition exposing JVM
specific metrics:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/path: /manage/prometheus
    prometheus.io/port: "8383"
    prometheus.io/scrape: "true"
```

Once the above pod definition is applied in a namespace that is part of the
service mesh, istio-proxy is injected and the above annotations are merged as
shown in the following pod definition.

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/path: /stats/prometheus
    prometheus.io/port: "15020"
    prometheus.io/scrape: "true"
```

At the same time ISTIO_PROMETHEUS_ANNOTATIONS environment variable is updated to
the application specific Prometheus annotation.

```yaml
env:
- name: ISTIO_PROMETHEUS_ANNOTATIONS
  value: '{"scrape":"true","path":"/manage/prometheus","port":"8383"}
name: istio-proxy
```

Application specific metrics can be queried from Prometheus as follows.

![Querying Application-specific metrics](/images/guides/kubernetes/service-routing/istio-application-level-metrics.png)

If you pass **--set meshConfig.enablePrometheusMerge=false** during
installation, **Application Developer** will need to provide appropriate
prometheus.io annotations inside the pod/deployment.

### Logging

Istio uses `meshConfig.accessLogFile` parameter during installation to specify
where the logs should be redirected.

```yaml
spec:
  meshConfig:
    accessLogFile: /dev/stdout
```

It's [recommended](https://12factor.net/logs) practice for containerized
applications to write logs to the standard output and error streams. These
streams are redirected by container engine to its configured location (usually
/var/log/containers).

#### Log Aggregation

Logs are produced by containers at the configured location on their respective
nodes, where they are running.

An example of Istio control plane logs are as follows.

```bash
ls -al /var/log/containers/
istiod-1-7-3-_istio-system_discovery-xx.log -> /var/log/pods/istio-system_istiod-1-7-3-xx/discovery/0.log
istio-egressgateway_istio-system_istio-proxy-xx.log -> /var/log/pods/istio-system_istio-egressgateway_xx/istio-proxy/0.log
istio-ingressgateway_istio-system_istio-proxy-xx.log -> /var/log/pods/istio-system_istio-ingressgateway_xx/istio-proxy/0.log
```

An example of Istio data plane logs are as follows.

```bash
ls -al /var/log/containers/
productpage-v1_bookinfo_istio-proxy-xx.log -> /var/log/pods/bookinfo_productpage-v1-xx/istio-proxy/0.log
productpage-v1_bookinfo_istio-validation-xx.log -> /var/log/pods/bookinfo_productpage-v1-xx/istio-validation/0.log
productpage-v1_bookinfo_productpage-xx.log -> /var/log/pods/bookinfo_productpage-v1-xx/productpage/0.log
```

An example of Istio CNI logs are as follows.

```bash
ls -al /var/log/containers/
istio-cni-node-cfxml_kube-system_install-cni-xx.log -> /var/log/pods/kube-system_istio-cni-node-xx/install-cni/0.log
istio-cni-node-cfxml_kube-system_repair-cni-xx.log -> /var/log/pods/kube-system_istio-cni-node-xx/repair-cni/0.log
```

These logs are created on all the nodes where pods are running. A logging agent
such as Fluentd, FluentBit or Logstash is required to be running on all the
nodes and have access to log directories. It collects logs from those
directories and forwards it to a back end log storage such as ElasticSearch,
Splunk or Kafka. Most of the logging agents provided by different vendors are
implemented as a DaemonSet.

![Logging architecture](/images/guides/kubernetes/service-routing/istio-logging-architecture.png)

An example of a **FluentBit integration with Splunk** is as follows. It runs as
DaemonSet using a ConfigMap to provide a configuration file. This configuration
file has two sections: input and output.

This example is provided to explain the concept. Complete details are omitted.

**Input Config**

```bash
input-kubernetes.conf: |
[INPUT]
Name              tail
Tag               kube.*
Path              /var/log/containers/*.log
Parser            docker
DB                /var/log/flb_kube.db
Mem_Buf_Limit     5MB
Skip_Long_Lines   On
Refresh_Interval  10
```

Things to note:

- **Path:** From where logs need to be collected.
- **Tag:** An internal string used to filter logs for Output phase.

**Output Config**

```bash
output-splunk.conf: |
[OUTPUT]
Name           splunk
Match          kube.*
Host           <SPLUNK_HOST_NAME>
Port           8088
Splunk_Token   98706938-a99d-459f-9255-ca7e192d05a9
TLS            On
TLS.Verify     Off
```

Things to note:

- **Name:** shows output sent to Splunk
- **Tag:** Which tag is used to filter logs for Output phase.
- **Splunk_Token:** Splunk index specific token for HTTP Event Collector.

![Splunk HTTP Event Collector](/images/guides/kubernetes/service-routing/istio-splunk-event-collector.png)

Once a FluentBit DaemonSet is created with the above configuration, the
FluentBit agent starts sending logs to Splunk.

#### Log Display

In Splunk, one can view the logs by entering the appropriate query. Some
screenshots follow.

![splunk: logs for istiod](/images/guides/kubernetes/service-routing/istio-splunk-istiod.png)

![splunk: logs for ingress gateway](/images/guides/kubernetes/service-routing/istio-splunk-ingress.png)

![splunk: logs for Istio data plane proxy](/images/guides/kubernetes/service-routing/istio-splunk-dataplane-istioproxy.png)

![splunk: logs for Istio data plane app container](/images/guides/kubernetes/service-routing/istio-splunk-dataplane-productpage.png)

## Known Bugs

- Istio control plane only installs in istio-system namespace
  https://github.com/istio/istio/issues/24037

## Appendix

### Gateway Definition

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
  namespace: bookinfo
spec:
  selector:
    istio: ingressgateway
  servers:
    - hosts:
        - productpage.bookinfo.appk8s.com
      port:
        name: http
        number: 80
        protocol: HTTP
```

### Virtual Service Definition

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: bookinfo
  namespace: bookinfo
spec:
  gateways:
    - bookinfo-gateway
  hosts:
    - productpage.bookinfo.appk8s.com
  http:
    - match:
        - uri:
            exact: /productpage
        - uri:
            prefix: /static
        - uri:
            exact: /login
        - uri:
            exact: /logout
        - uri:
            prefix: /api/v1/products
      route:
        - destination:
            host: productpage
            port:
              number: 9080
```

### PodSecurityPolicy Definition for Istio CNI

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: istio-control-plane
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: docker/default,runtime/default
    seccomp.security.alpha.kubernetes.io/defaultProfileName: runtime/default
spec:
  allowPrivilegeEscalation: false
  hostNetwork: true
  volumes:
    - configMap
    - emptyDir
    - projected
    - secret
    - downwardAPI
    - persistentVolumeClaim
    - hostPath
  runAsUser:
    rule: "RunAsAny"
  seLinux:
    rule: "RunAsAny"
  supplementalGroups:
    ranges:
      - max: 65535
        min: 1
    rule: "RunAsAny"
  fsGroup:
    ranges:
      - max: 65535
        min: 1
    rule: MustRunAs
  allowedHostPaths:
    - pathPrefix: "/etc/cni/net.d"
    - pathPrefix: "/opt/cni/bin"
```

Following Role is required in kube-system namespace

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: istio-control-plane
rules:
  - apiGroups:
      - extensions
    resources:
      - podsecuritypolicies
    resourceNames:
      - istio-control-plane
    verbs:
      - use
```

Following RoleBinding is required in kube-system namespace

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: istio-control-plane
subjects:
  - kind: ServiceAccount
    name: istio-cni
    namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: istio-control-plane
```

### Production-Grade IstioOperator v1.7.0

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: installed-state
  namespace: istio-system
spec:
  addonComponents:
    istiocoredns:
      enabled: false
  components:
    base:
      enabled: true
    cni:
      enabled: true
      namespace: kube-system
    egressGateways:
      - enabled: true
        k8s:
          env:
            - name: ISTIO_META_ROUTER_MODE
              value: sni-dnat
          hpaSpec:
            maxReplicas: 5
            metrics:
              - resource:
                  name: cpu
                  targetAverageUtilization: 80
                type: Resource
            minReplicas: 1
            scaleTargetRef:
              apiVersion: apps/v1
              kind: Deployment
              name: istio-egressgateway
          resources:
            limits:
              cpu: 2000m
              memory: 1024Mi
            requests:
              cpu: 10m
              memory: 40Mi
          service:
            ports:
              - name: http2
                port: 80
                targetPort: 8080
              - name: https
                port: 443
                targetPort: 8443
              - name: tls
                port: 15443
                targetPort: 15443
          strategy:
            rollingUpdate:
              maxSurge: 100%
              maxUnavailable: 25%
        name: istio-egressgateway
    ingressGateways:
      - enabled: true
        k8s:
          env:
            - name: ISTIO_META_ROUTER_MODE
              value: sni-dnat
          hpaSpec:
            maxReplicas: 5
            metrics:
              - resource:
                  name: cpu
                  targetAverageUtilization: 80
                type: Resource
            minReplicas: 1
            scaleTargetRef:
              apiVersion: apps/v1
              kind: Deployment
              name: istio-ingressgateway
          resources:
            limits:
              cpu: 2000m
              memory: 1024Mi
            requests:
              cpu: 10m
              memory: 40Mi
          service:
            ports:
              - name: status-port
                port: 15021
                targetPort: 15021
              - name: http2
                port: 80
                targetPort: 8080
              - name: https
                port: 443
                targetPort: 8443
              - name: tcp
                port: 31400
                targetPort: 31400
              - name: tls
                port: 15443
                targetPort: 15443
          strategy:
            rollingUpdate:
              maxSurge: 100%
              maxUnavailable: 25%
        name: istio-ingressgateway
    istiodRemote:
      enabled: false
    pilot:
      enabled: true
      k8s:
        env:
          - name: PILOT_TRACE_SAMPLING
            value: "100"
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 1
          periodSeconds: 3
          timeoutSeconds: 5
        resources:
          requests:
            cpu: 10m
            memory: 100Mi
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
    policy:
      enabled: false
      k8s:
        env:
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                apiVersion: v1
                fieldPath: metadata.namespace
        hpaSpec:
          maxReplicas: 5
          metrics:
            - resource:
                name: cpu
                targetAverageUtilization: 80
              type: Resource
          minReplicas: 1
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: istio-policy
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
    telemetry:
      enabled: false
      k8s:
        env:
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                apiVersion: v1
                fieldPath: metadata.namespace
          - name: GOMAXPROCS
            value: "6"
        hpaSpec:
          maxReplicas: 5
          metrics:
            - resource:
                name: cpu
                targetAverageUtilization: 80
              type: Resource
          minReplicas: 1
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: istio-telemetry
        replicaCount: 1
        resources:
          limits:
            cpu: 4800m
            memory: 4G
          requests:
            cpu: 1000m
            memory: 1G
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
  hub: docker.io/istio
  meshConfig:
    accessLogFile: /dev/stdout
    defaultConfig:
      proxyMetadata: {}
    enablePrometheusMerge: true
    outboundTrafficPolicy:
      mode: REGISTRY_ONLY
  profile: demo
  revision: 1-7-0
  values:
    base:
      enableCRDTemplates: false
      validationURL: ""
    clusterResources: true
    gateways:
      istio-egressgateway:
        autoscaleEnabled: false
        env: {}
        name: istio-egressgateway
        secretVolumes:
          - mountPath: /etc/istio/egressgateway-certs
            name: egressgateway-certs
            secretName: istio-egressgateway-certs
          - mountPath: /etc/istio/egressgateway-ca-certs
            name: egressgateway-ca-certs
            secretName: istio-egressgateway-ca-certs
        type: ClusterIP
        zvpn: {}
      istio-ingressgateway:
        applicationPorts: ""
        autoscaleEnabled: false
        debug: info
        domain: ""
        env: {}
        meshExpansionPorts:
          - name: tcp-istiod
            port: 15012
            targetPort: 15012
          - name: tcp-dns-tls
            port: 853
            targetPort: 8853
        name: istio-ingressgateway
        secretVolumes:
          - mountPath: /etc/istio/ingressgateway-certs
            name: ingressgateway-certs
            secretName: istio-ingressgateway-certs
          - mountPath: /etc/istio/ingressgateway-ca-certs
            name: ingressgateway-ca-certs
            secretName: istio-ingressgateway-ca-certs
        type: LoadBalancer
        zvpn: {}
    global:
      arch:
        amd64: 2
        ppc64le: 2
        s390x: 2
      configValidation: true
      controlPlaneSecurityEnabled: true
      defaultNodeSelector: {}
      defaultPodDisruptionBudget:
        enabled: true
      defaultResources:
        requests:
          cpu: 10m
      enableHelmTest: false
      hub: harbor-k8s.shk8s.de/istio
      imagePullPolicy: ""
      imagePullSecrets: []
      istioNamespace: istio-system
      istiod:
        enableAnalysis: false
      jwtPolicy: third-party-jwt
      logAsJson: false
      logging:
        level: default:info
      meshExpansion:
        enabled: false
        useILB: false
      meshNetworks: {}
      mountMtlsCerts: false
      multiCluster:
        clusterName: ""
        enabled: false
      network: ""
      omitSidecarInjectorConfigMap: false
      oneNamespace: false
      operatorManageWebhooks: false
      pilotCertProvider: istiod
      priorityClassName: ""
      proxy:
        autoInject: enabled
        clusterDomain: cluster.local
        componentLogLevel: misc:error
        enableCoreDump: false
        excludeIPRanges: ""
        excludeInboundPorts: ""
        excludeOutboundPorts: ""
        image: proxyv2
        includeIPRanges: "*"
        logLevel: warning
        privileged: false
        readinessFailureThreshold: 30
        readinessInitialDelaySeconds: 1
        readinessPeriodSeconds: 2
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 10m
            memory: 40Mi
        statusPort: 15020
        tracer: zipkin
      proxy_init:
        image: proxyv2
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 10m
            memory: 10Mi
      sds:
        token:
          aud: istio-ca
      sts:
        servicePort: 0
      tracer:
        datadog:
          address: $(HOST_IP):8126
        lightstep:
          accessToken: ""
          address: ""
        stackdriver:
          debug: false
          maxNumberOfAnnotations: 200
          maxNumberOfAttributes: 200
          maxNumberOfMessageEvents: 200
        zipkin:
          address: ""
      trustDomain: cluster.local
      useMCP: false
    grafana:
      accessMode: ReadWriteMany
      contextPath: /grafana
      dashboardProviders:
        dashboardproviders.yaml:
          apiVersion: 1
          providers:
            - disableDeletion: false
              folder: istio
              name: istio
              options:
                path: /var/lib/grafana/dashboards/istio
              orgId: 1
              type: file
      datasources:
        datasources.yaml:
          apiVersion: 1
      env: {}
      envSecrets: {}
      image:
        repository: grafana/grafana
        tag: 7.0.5
      nodeSelector: {}
      persist: false
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      security:
        enabled: false
        passphraseKey: passphrase
        secretName: grafana
        usernameKey: username
      service:
        annotations: {}
        externalPort: 3000
        name: http
        type: ClusterIP
      storageClassName: ""
      tolerations: []
    istiocoredns:
      coreDNSImage: coredns/coredns
      coreDNSPluginImage: istio/coredns-plugin:0.2-istio-1.1
      coreDNSTag: 1.6.2
    istiodRemote:
      injectionURL: ""
    mixer:
      adapters:
        kubernetesenv:
          enabled: true
        prometheus:
          enabled: true
          metricsExpiryDuration: 10m
        stackdriver:
          auth:
            apiKey: ""
            appCredentials: false
            serviceAccountPath: ""
          enabled: false
          tracer:
            enabled: false
            sampleProbability: 1
        stdio:
          enabled: false
          outputAsJson: false
        useAdapterCRDs: false
      policy:
        adapters:
          kubernetesenv:
            enabled: true
          useAdapterCRDs: false
        autoscaleEnabled: true
        image: mixer
        sessionAffinityEnabled: false
      telemetry:
        autoscaleEnabled: true
        env:
          GOMAXPROCS: "6"
        image: mixer
        loadshedding:
          latencyThreshold: 100ms
          mode: enforce
        nodeSelector: {}
        podAntiAffinityLabelSelector: []
        podAntiAffinityTermLabelSelector: []
        replicaCount: 1
        sessionAffinityEnabled: false
        tolerations: []
    pilot:
      appNamespaces: []
      autoscaleEnabled: false
      autoscaleMax: 5
      autoscaleMin: 1
      configMap: true
      configNamespace: istio-config
      cpu:
        targetAverageUtilization: 80
      enableProtocolSniffingForInbound: true
      enableProtocolSniffingForOutbound: true
      env: {}
      image: pilot
      keepaliveMaxServerConnectionAge: 30m
      nodeSelector: {}
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      policy:
        enabled: false
      replicaCount: 1
      tolerations: []
      traceSampling: 1
    prometheus:
      contextPath: /prometheus
      hub: docker.io/prom
      nodeSelector: {}
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      provisionPrometheusCert: true
      retention: 6h
      scrapeInterval: 15s
      security:
        enabled: true
      tag: v2.19.2
      tolerations: []
    sidecarInjectorWebhook:
      enableNamespacesByDefault: false
      injectLabel: istio-injection
      objectSelector:
        autoInject: true
        enabled: false
      rewriteAppHTTPProbe: true
    telemetry:
      enabled: true
      v1:
        enabled: false
      v2:
        enabled: true
        metadataExchange:
          wasmEnabled: false
        prometheus:
          enabled: true
          wasmEnabled: false
        stackdriver:
          configOverride: {}
          enabled: false
          logging: false
          monitoring: false
          topology: false
    tracing:
      jaeger:
        accessMode: ReadWriteMany
        hub: docker.io/jaegertracing
        memory:
          max_traces: 50000
        persist: false
        spanStorageType: badger
        storageClassName: ""
        tag: "1.18"
      nodeSelector: {}
      opencensus:
        exporters:
          stackdriver:
            enable_tracing: true
        hub: docker.io/omnition
        resources:
          limits:
            cpu: "1"
            memory: 2Gi
          requests:
            cpu: 200m
            memory: 400Mi
        tag: 0.1.9
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      provider: jaeger
      service:
        annotations: {}
        externalPort: 9411
        name: http-query
        type: ClusterIP
      zipkin:
        hub: docker.io/openzipkin
        javaOptsHeap: 700
        maxSpans: 500000
        node:
          cpus: 2
        probeStartupDelay: 10
        queryPort: 9411
        resources:
          limits:
            cpu: 1000m
            memory: 2048Mi
          requests:
            cpu: 150m
            memory: 900Mi
        tag: 2.20.0
    version: ""
```

### Production-Grade IstioOperator v1.7.3

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: installed-state
  namespace: istio-system
spec:
  addonComponents:
    istiocoredns:
      enabled: false
  components:
    base:
      enabled: true
    cni:
      enabled: true
      namespace: kube-system
    egressGateways:
      - enabled: true
        k8s:
          env:
            - name: ISTIO_META_ROUTER_MODE
              value: sni-dnat
          hpaSpec:
            maxReplicas: 5
            metrics:
              - resource:
                  name: cpu
                  targetAverageUtilization: 80
                type: Resource
            minReplicas: 1
            scaleTargetRef:
              apiVersion: apps/v1
              kind: Deployment
              name: istio-egressgateway
          resources:
            limits:
              cpu: 2000m
              memory: 1024Mi
            requests:
              cpu: 10m
              memory: 40Mi
          service:
            ports:
              - name: http2
                port: 80
                targetPort: 8080
              - name: https
                port: 443
                targetPort: 8443
              - name: tls
                port: 15443
                targetPort: 15443
          strategy:
            rollingUpdate:
              maxSurge: 100%
              maxUnavailable: 25%
        name: istio-egressgateway
    ingressGateways:
      - enabled: true
        k8s:
          env:
            - name: ISTIO_META_ROUTER_MODE
              value: sni-dnat
          hpaSpec:
            maxReplicas: 5
            metrics:
              - resource:
                  name: cpu
                  targetAverageUtilization: 80
                type: Resource
            minReplicas: 1
            scaleTargetRef:
              apiVersion: apps/v1
              kind: Deployment
              name: istio-ingressgateway
          resources:
            limits:
              cpu: 2000m
              memory: 1024Mi
            requests:
              cpu: 10m
              memory: 40Mi
          service:
            ports:
              - name: status-port
                port: 15021
                targetPort: 15021
              - name: http2
                port: 80
                targetPort: 8080
              - name: https
                port: 443
                targetPort: 8443
              - name: tcp
                port: 31400
                targetPort: 31400
              - name: tls
                port: 15443
                targetPort: 15443
          strategy:
            rollingUpdate:
              maxSurge: 100%
              maxUnavailable: 25%
        name: istio-ingressgateway
    istiodRemote:
      enabled: false
    pilot:
      enabled: true
      k8s:
        env:
          - name: PILOT_TRACE_SAMPLING
            value: "100"
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 1
          periodSeconds: 3
          timeoutSeconds: 5
        resources:
          requests:
            cpu: 10m
            memory: 100Mi
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
    policy:
      enabled: false
      k8s:
        env:
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                apiVersion: v1
                fieldPath: metadata.namespace
        hpaSpec:
          maxReplicas: 5
          metrics:
            - resource:
                name: cpu
                targetAverageUtilization: 80
              type: Resource
          minReplicas: 1
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: istio-policy
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
    telemetry:
      enabled: false
      k8s:
        env:
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                apiVersion: v1
                fieldPath: metadata.namespace
          - name: GOMAXPROCS
            value: "6"
        hpaSpec:
          maxReplicas: 5
          metrics:
            - resource:
                name: cpu
                targetAverageUtilization: 80
              type: Resource
          minReplicas: 1
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: istio-telemetry
        replicaCount: 1
        resources:
          limits:
            cpu: 4800m
            memory: 4G
          requests:
            cpu: 1000m
            memory: 1G
        strategy:
          rollingUpdate:
            maxSurge: 100%
            maxUnavailable: 25%
  hub: docker.io/istio
  meshConfig:
    accessLogFile: /dev/stdout
    defaultConfig:
      proxyMetadata: {}
    enablePrometheusMerge: true
    outboundTrafficPolicy:
      mode: REGISTRY_ONLY
  profile: demo
  revision: 1-7-3
  values:
    base:
      enableCRDTemplates: false
      validationURL: ""
    clusterResources: true
    gateways:
      istio-egressgateway:
        autoscaleEnabled: false
        env: {}
        name: istio-egressgateway
        secretVolumes:
          - mountPath: /etc/istio/egressgateway-certs
            name: egressgateway-certs
            secretName: istio-egressgateway-certs
          - mountPath: /etc/istio/egressgateway-ca-certs
            name: egressgateway-ca-certs
            secretName: istio-egressgateway-ca-certs
        type: ClusterIP
        zvpn: {}
      istio-ingressgateway:
        applicationPorts: ""
        autoscaleEnabled: false
        debug: info
        domain: ""
        env: {}
        meshExpansionPorts:
          - name: tcp-istiod
            port: 15012
            targetPort: 15012
          - name: tcp-dns-tls
            port: 853
            targetPort: 8853
        name: istio-ingressgateway
        secretVolumes:
          - mountPath: /etc/istio/ingressgateway-certs
            name: ingressgateway-certs
            secretName: istio-ingressgateway-certs
          - mountPath: /etc/istio/ingressgateway-ca-certs
            name: ingressgateway-ca-certs
            secretName: istio-ingressgateway-ca-certs
        type: LoadBalancer
        zvpn: {}
    global:
      arch:
        amd64: 2
        ppc64le: 2
        s390x: 2
      configValidation: true
      controlPlaneSecurityEnabled: true
      defaultNodeSelector: {}
      defaultPodDisruptionBudget:
        enabled: true
      defaultResources:
        requests:
          cpu: 10m
      enableHelmTest: false
      hub: harbor-k8s.shk8s.de/istio
      imagePullPolicy: ""
      imagePullSecrets: []
      istioNamespace: istio-system
      istiod:
        enableAnalysis: false
      jwtPolicy: third-party-jwt
      logAsJson: false
      logging:
        level: default:info
      meshExpansion:
        enabled: false
        useILB: false
      meshNetworks: {}
      mountMtlsCerts: false
      multiCluster:
        clusterName: ""
        enabled: false
      network: ""
      omitSidecarInjectorConfigMap: false
      oneNamespace: false
      operatorManageWebhooks: false
      pilotCertProvider: istiod
      priorityClassName: ""
      proxy:
        autoInject: enabled
        clusterDomain: cluster.local
        componentLogLevel: misc:error
        enableCoreDump: false
        excludeIPRanges: ""
        excludeInboundPorts: ""
        excludeOutboundPorts: ""
        image: proxyv2
        includeIPRanges: "*"
        logLevel: warning
        privileged: false
        readinessFailureThreshold: 30
        readinessInitialDelaySeconds: 1
        readinessPeriodSeconds: 2
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 10m
            memory: 40Mi
        statusPort: 15020
        tracer: zipkin
      proxy_init:
        image: proxyv2
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 10m
            memory: 10Mi
      sds:
        token:
          aud: istio-ca
      sts:
        servicePort: 0
      tracer:
        datadog:
          address: $(HOST_IP):8126
        lightstep:
          accessToken: ""
          address: ""
        stackdriver:
          debug: false
          maxNumberOfAnnotations: 200
          maxNumberOfAttributes: 200
          maxNumberOfMessageEvents: 200
        zipkin:
          address: ""
      trustDomain: cluster.local
      useMCP: false
    grafana:
      accessMode: ReadWriteMany
      contextPath: /grafana
      dashboardProviders:
        dashboardproviders.yaml:
          apiVersion: 1
          providers:
            - disableDeletion: false
              folder: istio
              name: istio
              options:
                path: /var/lib/grafana/dashboards/istio
              orgId: 1
              type: file
      datasources:
        datasources.yaml:
          apiVersion: 1
      env: {}
      envSecrets: {}
      image:
        repository: grafana/grafana
        tag: 7.0.5
      nodeSelector: {}
      persist: false
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      security:
        enabled: false
        passphraseKey: passphrase
        secretName: grafana
        usernameKey: username
      service:
        annotations: {}
        externalPort: 3000
        name: http
        type: ClusterIP
      storageClassName: ""
      tolerations: []
    istiocoredns:
      coreDNSImage: coredns/coredns
      coreDNSPluginImage: istio/coredns-plugin:0.2-istio-1.1
      coreDNSTag: 1.6.2
    istiodRemote:
      injectionURL: ""
    mixer:
      adapters:
        kubernetesenv:
          enabled: true
        prometheus:
          enabled: true
          metricsExpiryDuration: 10m
        stackdriver:
          auth:
            apiKey: ""
            appCredentials: false
            serviceAccountPath: ""
          enabled: false
          tracer:
            enabled: false
            sampleProbability: 1
        stdio:
          enabled: false
          outputAsJson: false
        useAdapterCRDs: false
      policy:
        adapters:
          kubernetesenv:
            enabled: true
          useAdapterCRDs: false
        autoscaleEnabled: true
        image: mixer
        sessionAffinityEnabled: false
      telemetry:
        autoscaleEnabled: true
        env:
          GOMAXPROCS: "6"
        image: mixer
        loadshedding:
          latencyThreshold: 100ms
          mode: enforce
        nodeSelector: {}
        podAntiAffinityLabelSelector: []
        podAntiAffinityTermLabelSelector: []
        replicaCount: 1
        sessionAffinityEnabled: false
        tolerations: []
    pilot:
      appNamespaces: []
      autoscaleEnabled: false
      autoscaleMax: 5
      autoscaleMin: 1
      configMap: true
      configNamespace: istio-config
      cpu:
        targetAverageUtilization: 80
      enableProtocolSniffingForInbound: true
      enableProtocolSniffingForOutbound: true
      env: {}
      image: pilot
      keepaliveMaxServerConnectionAge: 30m
      nodeSelector: {}
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      policy:
        enabled: false
      replicaCount: 1
      tolerations: []
      traceSampling: 1
    prometheus:
      contextPath: /prometheus
      hub: docker.io/prom
      nodeSelector: {}
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      provisionPrometheusCert: true
      retention: 6h
      scrapeInterval: 15s
      security:
        enabled: true
      tag: v2.19.2
      tolerations: []
    sidecarInjectorWebhook:
      enableNamespacesByDefault: false
      injectLabel: istio-injection
      objectSelector:
        autoInject: true
        enabled: false
      rewriteAppHTTPProbe: true
    telemetry:
      enabled: true
      v1:
        enabled: false
      v2:
        enabled: true
        metadataExchange:
          wasmEnabled: false
        prometheus:
          enabled: true
          wasmEnabled: false
        stackdriver:
          configOverride: {}
          enabled: false
          logging: false
          monitoring: false
          topology: false
    tracing:
      jaeger:
        accessMode: ReadWriteMany
        hub: docker.io/jaegertracing
        memory:
          max_traces: 50000
        persist: false
        spanStorageType: badger
        storageClassName: ""
        tag: "1.18"
      nodeSelector: {}
      opencensus:
        exporters:
          stackdriver:
            enable_tracing: true
        hub: docker.io/omnition
        resources:
          limits:
            cpu: "1"
            memory: 2Gi
          requests:
            cpu: 200m
            memory: 400Mi
        tag: 0.1.9
      podAntiAffinityLabelSelector: []
      podAntiAffinityTermLabelSelector: []
      provider: jaeger
      service:
        annotations: {}
        externalPort: 9411
        name: http-query
        type: ClusterIP
      zipkin:
        hub: docker.io/openzipkin
        javaOptsHeap: 700
        maxSpans: 500000
        node:
          cpus: 2
        probeStartupDelay: 10
        queryPort: 9411
        resources:
          limits:
            cpu: 1000m
            memory: 2048Mi
          requests:
            cpu: 150m
            memory: 900Mi
        tag: 2.20.0
    version: ""
```