---
date: '2021-02-24'
lastmod: '2021-02-26'
subsection: Platform Security
team:
- Farid Saad
title: Platform Security
topics:
- Kubernetes
weight: 62
oldPath: "/content/guides/kubernetes/platform-security.md"
aliases:
- "/guides/kubernetes/platform-security"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
---

## Overview

Best practices in Kubernetes security are rapidly evolving. Many security
problems in early versions of Kubernetes are resolved by default in recent
versions. However, like any complex system, there are still risks you should
understand before you trust it with your production data. We’ve tried to
summarize the most important things you should have in mind when you host
sensitive workloads on Kubernetes.

The topics discussed here help you understand potential risks in your cluster.
The risk in your environment depends on your threat model and the types of
applications you run in your cluster. You’ll have to consider how best to invest
in security controls and hardening based on the sensitivity of your data, the
amount of time and staff you’re able to dedicate to security, and your company’s
particular compliance requirements.

Kubernetes provides several mechanisms to enforce security within the cluster.
These range from API security controls, down to container isolation, resource
limiting, and network policy control.

## General points

Kubernetes core components cooperate to schedule and run your workloads in a
cluster. Kubernetes provides a range of access control mechanisms, however their
default values tend to be overly permissive. You should carefully determine what
access your system components and users need, and configure the most restrictive
controls possible.

Remember also to secure the infrastructure that your clusters run on - for
example, SSH access, or cloud provider access such as AWS IAM.

## TLS Certificates

Kubernetes clusters require
[PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure) certificates for
secure communication between cluster components. Default CAs and certificates
are provided by kubeadm, but you should consider your requirements before
accepting only the defaults.

Kubernetes requires TLS for the communication between the control plane
components of your cluster. For details about the required PKI certificates, see
the
[certificates documentation](https://kubernetes.io/docs/setup/certificates/).
You can reuse the control plane CA certificate bundle for TLS in your
application/workloads. See the documentation about [managing TLS
certificates](https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/).
kubeadm automatically generates the certificates required by the cluster; this
topic explains when and why you might want to generate your own certificates. It
also discusses options for managing certificates for your applications.

### Certificate Authorities

The certificates generated with a kubeadm install rely on a single cluster CA
for all certificates. You might want to manage your certificates differently in
the following cases:

- For finer-grained control over authentication, you might set up different
  certificate authorities for server certificates and client certificates.
- Your company’s policies might require TLS certificates that are issued by your
  own PKI.
- If you integrate with an OpenID Connect (OIDC) provider, you can use the OIDC CA.
- Publicly facing workloads may require a Commercial or
  [non-profit](https://en.wikipedia.org/wiki/Let%27s_Encrypt) certificate
  bundle.

### If you issue your own certificates

The certificate for the API server control plane component requires a
subjectAltName ([SAN](https://en.wikipedia.org/wiki/Subject_Alternative_Name)):
kubernetes. We recommend you use a corporate CA on a load balancer in front of
the API server instead of replacing the CA. Note that the `--root-ca-file` flag
for the controller manager must also include a copy of the CA for the
API-server.

### Certificate rotation

By default, kubeadm generates certificate authorities that expire after 10
years. The server and client certificates expire after one year. It is strongly
recommended to not let certificates expire as your cluster will become
inoperable.

To help make sure your certificates do not expire, you can use the [Prometheus
BlackBox exporter](https://github.com/prometheus/blackbox_exporter), which
allows probing and alerting on certificate expiry dates.

You can also configure automatic certificate rotation. See the documentation for
[kubelet certificate
rotation](https://kubernetes.io/docs/tasks/tls/certificate-rotation/) and
[node certificate rotation](https://kubernetes.io/docs/reference/setup-tools/kubeadm/implementation-details/#setup-nodes-certificate-rotation-with-auto-approval).

## [Authentication and Authorization](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/)

### Authentication

Kubernetes uses client certificates, bearer tokens, an authenticating proxy, or
HTTP basic auth to authenticate API requests through authentication plugins. As
HTTP requests are made to the API server, plugins attempt to associate the
following attributes with the request: Username, UID, Groups, and Extra fields.

A critical component of cluster security is making sure that human users,
Kubernetes services accounts, cluster components, and application components
have the right permissions to access only the resources they need to get their
respective jobs done. Authentication and authorization are critical parts of
access control.

### Integrate an identity provider

Certificates take care of authentication for clients, servers, clusters and
applications. To authenticate human users, we recommend integrating an existing
corporate identity system. Kubernetes lets you provide authentication with any
compliant OpenID Connect provider (for example, GitHub or Google). Kubernetes
authentication and authorization can also be extended with webhook-based plugins
to create a custom identity integration.

If your organization integrates multiple identity providers,
[Dex](https://github.com/dexidp/dex) can be integrated with Gangway to act as
the OIDC endpoint. Dex acts as a broker for identity, providing a standard OIDC
frontend for a variety of backends such as LDAP servers, SAML providers, or
established identity providers like GitHub, Google, and Active Directory.  
Multi-factor authentication is not required, but provides additional protection
for end user flows.

### Authorization

Human users and service accounts need to be carefully authorized to access only
the resources they need to get their jobs done, and no more. The principle of
least privilege is central to good authorization policies.

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems, which may handle other APIs besides
the Kubernetes API. Every authenticated request to the Kubernetes API server
made by a human user or a service account needs to be authorized.

### [RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

Role-Based Access Control (RBAC) allows the control of actions performed on
resources in the cluster, and defines who is allowed to perform them. Every
resource in Kubernetes is represented as an API object (Pods, Namespaces,
Secrets, ConfigMaps, etc.) These resources can be created, read, updated, and
deleted (verbs). A rule is composed of a verb and a resource, as an operation to
be performed on an API group. These rules are bundled together in Roles. Roles
are scoped to a namespace. Cluster-wide roles are defined in ClusterRole
objects. Roles can then be bound to users, groups and service accounts by
creating a role binding thereby granting them the ability to perform actions
described in the roles.

At a minimum, we recommend that you enable RBAC. RBAC is enabled by default in
most recent installers and provides a framework for implementing the principle
of least privilege for humans and applications that access the Kubernetes API.

To get the most benefit from RBAC, an appropriate configuration is required:

- Run each component with the most restrictive permissions that still allow for
  expected functionality. Most applications in a cluster will need little or no
  access to the Kubernetes API. System components such as an ingress controller
  or monitoring system may need more access, but can often be limited to
  read-only access or access within a particular namespace.
- Make sure that trusted components don’t act as pivots that allow less
  privileged users to escalate privileges. The Kubernetes Dashboard and Helm
  tiller daemon are examples that deserve special attention. Isolate these
  components with application-level authentication/ authorization and network
  access controls to prevent unauthorized access.

When creating RBAC policies, prefer Roles and RoleBindings over ClusterRoles and
ClusterRoleBindings whenever possible as they are scoped to namespaces by
default. While Kubernetes comes with default RBAC policies in place, we
recommend setting up your baseline policies with the least required privileges
that you need.

The Kubernetes API audit logs are a useful tool for discovering which APIs a
particular application is using, and for testing locked-down RBAC policies. The
[audit2rbac](https://github.com/liggitt/audit2rbac) tool can act as a reference
as it can generate RBAC roles and bindings to cover the API requests made by a
user. See also
[Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) in
the Kubernetes documentation.

### [Admission Controllers](https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)

An admission controller is a piece of code that intercepts requests to the
Kubernetes API. This happens before the persistence of the object, but after the
request is authenticated and authorized. These are plugins that govern and
enforce the acceptance of requests. There are two individual Admission
Controllers: MutatingAdmissionWebhook and ValidatingAdmissionWebhook, which
execute mutating and validating actions, respectively. Mutating controllers may
modify the objects they admit; validating controllers do not. The admission
control process has two phases: the mutating phase is executed first, followed
by the validating phase. An excellent example of a mutating admission controller
is Istio's
[automatic sidecar injection](https://istio.io/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection)
mechanism. If any of the controllers in either phase reject the request, the
entire request is rejected immediately and an error is returned to the end-user

## Network and Application Access Control

Access to the cluster network should be carefully controlled and permissions
granted only to the components or resources that need access. The Kubernetes
NetworkPolicy API allows users to express ingress and egress policies (starting
with Kubernetes 1.8.0) to Kubernetes pods based on labels and ports.

Many existing applications assume that network-level access implies a level of
authorization. Even if applications include strong application-layer
authentication and authorization, network-level access control provides an
additional layer of defense. For example, it provides crucial protection against
pre-auth vulnerabilities such as the [Heartbleed
(CVE-2014-0160)](https://en.wikipedia.org/wiki/Heartbleed) vulnerability in
OpenSSL.

### [Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)

By default, Kubernetes clusters do not restrict traffic. Pods can communicate
with any other pods. External clients can also communicate with pods, assuming
they are routable from the client's network.

The NetworkPolicy resource in Kubernetes allows you to control how pods are
allowed to communicate with each other and other network endpoints. The
NetworkPolicy resource is namespace scoped. Rules defined in the policy allow
traffic and are combined additively.

Kubernetes provides core data types for specifying network access controls
between pods. Network policy in Kubernetes can limit inbound traffic to a pod
based on the source pod’s namespace and labels, plus the IP address for traffic
that originates outside the cluster. Network policy can also limit outbound
traffic using the same set of selectors. A good starting point is to restrict
ingress to only the application namespace by default. For details, see the
[Kubernetes Network Policy
documentation](https://kubernetes.io/docs/concepts/services-networking/network-policies/#default-deny-all-ingress-traffic).

The enforcement of network policy relies on the cluster’s
[CNI](https://github.com/containernetworking/cni) provider. Without them,
Kubernetes “fails open” — the API happily accepts any network policy, but the
policies are not enforced. We recommend
[Calico](https://www.projectcalico.org/) as your CNI provider, because it
enforces controls. Examples of Network policies can be found
[here](https://github.com/ahmetb/kubernetes-network-policy-recipes).

### Restricting access to control plane services

Network controls in the infrastructure underlying the cluster must also be
considered. In a cloud provider environment, make sure that pods cannot
communicate with the instance metadata service. We also recommend the use of the
[Node Authorizer](https://kubernetes.io/docs/reference/access-authn-authz/node/)
to limit kubelet access to the API. When enabled, this special-purpose
authorization module restricts kubelet access to resources that are referenced
by Pods running on that specific node. The Node Authorizer is enabled by default
in recent releases of kubeadm. For example, instead of being able to access all
Secrets in the cluster, a kubelet can access only Secrets that are referenced by
Pods scheduled to that kubelet.

Enforcing network controls in the infrastructure underlying your cluster is also
critical. In a cloud provider environment, make sure that your pods cannot talk
to the instance metadata service (for example,
`http://169.254.169.254/latest/meta-data` on AWS EC2). Depending on your
requirements, you may also need to restrict access to the kubelet localhost
read-only port (10255 by default). This port exposes metadata about the pods
running on the node, which you may not want access to your applications.

### Application-layer access control

One solution to the problem of network-level access controls is strong
application-layer authentication such as
[mutual TLS](https://en.wikipedia.org/wiki/Mutual_authentication). Cryptographic
application identity is powerful because it allows identity to be efficiently
expressed across network boundaries. Securely provisioning certificates for
applications is still a hard problem in Kubernetes.

### Limitations

Network access controls have some limitations in dynamic environments like
Kubernetes, which results in the following difficulties:

- Federating Kubernetes network policy across multiple clusters.
- Integrating Kubernetes network-level controls and granular network-level
  controls expressed outside of the pod networking layer (for example, in AWS
  EC2 Security Groups).
- When services running in a Kubernetes cluster need to communicate with
  services outside the cluster, NetworkPolicy is often unable to filter traffic
  as expected due to source and destination IP address translation.

If you encounter any of these issues, we recommend that you define a more
coarse-grained network policy and rely on the application layer for fine-grained
access control.

## Container Security

### [Security Contexts](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)

Security contexts limit what a Pod or Container can do and what privileges the
object has when running in the cluster. Example controls are the UID of the
process running inside the container, the filesystem access group, the process
capabilities, SELinux labels, etc.

These can be applied to individual Pods and containers, and they define a set of
conditions that it must run with.

### [Pod Security Policies PSP](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)

Pod security policies are cluster-wide resources that provide automation of the
above described security contexts. PSPs can be used to automatically set
security context parameters or to prevent out-of-policy pods from running in the
cluster. For example, if you don't want any containers in your cluster to run as
root, you can enforce this using a PSP with a `runAsUser` rule of
`MustRunAsNonRoot`. They define a set of conditions that a pod must run with to
be accepted into the system. Pod Security Policies are comprised of settings and
strategies that control the security features a pod has access to, and hence
this must be used to control pod access permissions. Strong pod security
policies make sure that pod access is appropriately controlled.

Pod Security Policies provide a policy-driven mechanism for requiring
applications in your cluster to use container sandboxing in an approved way. For
example, you can require that all pods in a particular namespace run as
non-root, that they don't mount host file systems and do not use host
networking.

To use pod security policies, the PodSecurityPolicy admission controller must be
enabled in the API server configuration. Policies must be present before
enabling the controller, or no pods would be allowed to run. For more
information, see to the
[Kubernetes documentation](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#run-another-pod).

## Credentials security (Secrets)

Secrets are sensitive pieces of data such as passwords, tokens or keys.
Applications use secrets to access internal resources like the Kubernetes API or
external resources such as git repositories, databases, etc. The following
section details concerns related to secrets in the context of Kubernetes.

### Secrets Management

Kubernetes has a core primitive for managing application secrets, appropriately
called a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/).
Applications typically need secrets for two reasons:

- They need access to a credential that proves their identity to another system
  (for example, a database password or third-party API token).
- They need a cryptographic secret for some essential operation (for example, an
  HMAC signing key for issuing signed HTTP cookies).

### Identity Secrets

For the first use case of application identity, follow the efforts of
[SPIFFE](https://spiffe.io/) and the Container Identity working group for a long
term solution to dynamically provisioning unique application identities. In the
near term, there is no well-established best practice in this area. Still, some
users have success integrating with existing certificate provisioning workflows
as part of a CI/CD pipeline. Simple Kubernetes-native solutions like
[cert-manager](https://github.com/jetstack/cert-manager) may also work for your
use case.

### Non-identity Secrets

For the other use case, systems such as
[Vault](https://github.com/hashicorp/vault) perform cryptographic operations in
a centralized service. If you choose this option, make sure you understand the
entire chain of attestations involved in authenticating to the system. Often
these systems depend on Kubernetes secret resources as one step in the chain. In
Vault, the
[Vault Kubernetes auth backend](https://www.vaultproject.io/docs/auth/kubernetes.html)
authenticates pods by consuming a Kubernetes Service Account token. Still, the
token is stored as a secret object before it’s injected into the pod. This
pattern requires that you trust Vault not to replay your token and impersonate
the pod to the Kubernetes API.

### Caveats for Kubernetes Secrets

You should be aware of the following limitations:

- Many standard components – for example, ingress controllers – require
  permission to read all secrets in your cluster.
- Secrets are not encrypted at rest by default. You can, however, configure,
  etcd, to encrypt secret data at rest. For details, see [Encrypting Secret Data
  at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).

## Auditing to support security

Audit logging must be explicitly enabled. It provides valuable insight into
access rules, compliance, and potential access issues. Kubernetes auditing
provides a security-relevant chronological set of records documenting the
sequence of activities that have affected the system by individual users,
administrators, or other components of the system.

The Kubernetes API server audit log documents the sequence of cluster activities
performed by users, administrators, and system services. Each API request has
multiple stages that can be tracked and logged using an Audit Policy.

### Enabling Audit Logging

The Kubernetes API server does not perform audit logging by default. We
recommend that you enable audit logging to a file by setting the following flags
in the API server configuration:

- `--audit-log-path` specifies the log file path that log backend uses to write
  audit events.
- `--audit-log-maxage` defines the maximum number of days to retain old audit log
  files
- `--audit-log-maxbackup` defines the maximum number of audit log files to retain
- `--audit-log-maxsize` defines the maximum size in megabytes of the audit log
  file before it gets rotated
- `--audit-policy-file` specifies the Audit policy file to be used

Audit events can also be sent to a webhook backend, but we recommend logging to
a file that can be aggregated. Audit data should be treated as a high priority,
and care should be taken that the file specified for --audit-log-path is
aggregated for multiple control plane nodes and handled by systems with high
reliability. In the case of an outage or other issue, administrators need to be
able to rely on the data produced by audit systems.

When logging to files on the control plane hosts, you should set
`--audit-log-maxage`, `--audit-log-maxbackup`, and `--audit-log-maxsize`
appropriately based on the available disk space before aggregation.

## Node and container runtime hardening

It is of critical importance to consider the security of the container-host
boundary. This is important even in single-tenant environments since a remote
code execution vulnerability like [Shellshock
(CVE-2014-6271)](<https://en.wikipedia.org/wiki/Shellshock_(software_bug)>) or the
[Ruby YAML parsing vulnerability (CVE-2013-0156)](https://groups.google.com/forum/#!topic/rubyonrails-security/61bkgvnSGTQ/discussion)
can turn your otherwise trusted workload into a malicious agent. Without proper
hardening, that single remote code execution vulnerability can escalate into a
whole-node or whole-cluster takeover.

Current container runtimes don’t provide the most reliable possible sandboxing,
but there are some steps you can take to help mitigate the risk of container
escape vulnerabilities:

- Segment your Kubernetes clusters by integrity level — a simple but very
  effective way to limit your exposure to container escape vulnerabilities. For
  example, your dev/test environments might be hosted in a different cluster
  than your production environment.
- Invest in streamlined host/kernel patching. Make sure that you have a way to
  test new system updates (for example, a staging environment) and that your
  applications can tolerate a rolling upgrade of the cluster without affecting
  application availability.
- Kubernetes shines at orchestrating these upgrades. Once you build confidence
  in letting Kubernetes dynamically rebalance application pods, patch management
  at the node level becomes relatively easy. You can automate a rolling upgrade
  that gracefully drains each node and either upgrade it in place or (in an IaaS
  environment) replaces it with a new node. Investments in this area also
  improve your overall resiliency to node-level outages.
- Run your applications as a non-root user. Root (UID 0) in a Linux container is
  still the same user as root on the node. A combination of sandboxing
  mechanisms restrict what code running in the container can do. Still, future
  Linux kernel vulnerabilities are more likely to be exploitable by a root user
  than by a non-privileged user.
- Enable and configure extra Linux security modules like SELinux and AppArmor.
  These tools let you enforce more restrictive sandboxing on particular
  containers. They are valuable in many situations, but building and maintaining
  appropriate configurations requires a time investment. They may not be
  appropriate for every application or environment.

## Image Security

### Runtime Security

Runtime security is concerned with potential changes to a running container
through its lifetime, invalidating an initial security scan. A container image
could have been scanned and approved but become a liability as new
vulnerabilities, bugs, and threats are found. Runtime security tools help to
mitigate this problem by looking at what's happening inside containers:
filesystem, process activity, networking behavior, etc. Examples of runtime
security tools: Falco, Aquasec, Twistlock, Sysdig.

### Attack Surface Minimization

Minimize container footprint and attack surface by excluding extraneous
libraries and utilities that are not needed and could be leveraged during an
attack. Consider building images from scratch and include only what is necessary
at runtime. Also leverage multi-stage builds where applicable so that build
tools are not included in the final image used in production.

### Container Image Scanning

Container image scanning is an integral part of building container images,
whether from source or third party base images, to discover any known
vulnerabilities and mitigate them before cluster deployment. One of the last
steps of your CI (Continuous Integration) pipeline involves building the
container images that would be pulled and executed in your environment.
Therefore, whether you are building Docker images from your code or using
unmodified third party images, it’s crucial to identify and find any known
vulnerabilities that may be present in those images. This process is known as
container image scanning. Container image scanning helps make sure that your
images are free from known vulnerabilities before they are deployed.
Appropriately managed scanning keeps your clusters safe by not introducing
malicious or malformed artifacts.

Services and open source tools that provide image scanning include the
following:

- [Clair](https://github.com/coreos/clair)
- [Falco](https://sysdig.com/opensource/falco/)
- [Aqua Security](https://www.aquasec.com/)
- [Twistlock](https://www.twistlock.com/)

We recommend integrating a container scan as part of a continuous delivery
pipeline. In addition, we recommend running periodic scans against stored images
so you can identify and mitigate new vulnerabilities.

We also recommend deploying an ImagePolicyWebhook
[admission controller](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/)
with the Kubernetes API server that only allows images that have passed security
scans to run in a cluster.

#### Deploying the ImagePolicyWebhook in Kubernetes

The ImagePolicyWebhook admission controller plugin queries a backend service to
determine whether a workload can be run on a cluster. It does not make any
changes to the submitted workload, but instead accepts or rejects it as-is based
on whether the images associated with the workload comply with the policy set
for the cluster. The webhook service queries the scanner tool to scan an image
and either accept the workload or reject it based on the scan results.

The webhook service must use TLS.

See [the documentation on ImagePolicyWebhook](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers#imagepolicywebhook)
for a detailed explanation.

## Image signing

Image signing helps make sure that your container images have not been tampered
with. In other words, image signing is used to prove the provenance of your
images. Signed images do not guarantee compliance, however.

Image signing establishes image trust, ensuring that the image you run in your
cluster is the image you intended to run.

Private image registries or private accounts on public registries let you
establish some degree of trust. Still, if your registry is compromised, bad
actors could replace your images with malicious versions.

Image signing adds a layer of protection by cryptographically signing an image.
As long as your private keys are not compromised, you can be guaranteed that the
image you run is trusted.

Note that you must also deploy a mechanism to verify image trust. An example is
[portieris](https://github.com/IBM/portieris), which allows you to configure
image security policies and stop the workload from being deployed if it is not
signed.

## Patch management and CI/CD

### Deployment pipelines

A successful cluster access pattern is to have most users interact with the
production cluster only through a deployment pipeline. This pipeline consists of
one or more automated systems that handle building code into a container image,
running unit and integration tests and other validation steps such as pausing
for any manual approval. Depending on your needs, developers could still have
direct read-only access to the Kubernetes API or have a way to “break the glass”
and exec into pods during an incident.

A robust application deployment pipeline is also the key to remediating
vulnerabilities in container images. You can use tools like
[Clair](https://github.com/coreos/clair) to identify known vulnerabilities in
the libraries and packages you use. Still, to release patches on time, you need
a trusted, automated way of rebuilding and testing patched versions of the
container.

### Limiting churn

Healthy Kubernetes clusters are dynamic environments. New versions of
applications are deployed, nodes disappear for kernel upgrades, deployments
scale up and down, and (hopefully) the users of your application never notice.
Making all this work in practice requires some diligence, but it’s critical to
reaping all the benefits of Kubernetes.

One tool that can help put bounds on the amount of chaos introduced into your
cluster is the [Pod Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/).
It’s useful when you have multiple automated systems, and you want to make sure
they don’t interact in unwanted ways. For example, an application-level bug might
leave some pods of your application temporarily unavailable. A pod disruption
budget could make sure that an automated rolling node upgrade doesn’t terminate
the remaining healthy copies of your application.

### Overly privileged container builds

One Docker-specific anti-pattern to avoid in your build pipeline is mounting the
host-level Docker control socket “/var/run/docker.sock” into a container during
a build. Access to this socket is equivalent to root on the host, which means
any running build could compromise the node. This is doubly true if your build
system runs build before a manual code review (a typical pattern).

## Conclusions

### What to do now

We keep saying it: how you secure your Kubernetes cluster depends in part on
your available resources and your application requirements. Consider each
element in the broader security picture and spend some time upfront assessing
how important it is to your needs overall. At a very high level, some of our
recommendations fit nicely into larger best practices in deployment:

- Automated deployment pipeline and scheduler. Lets you simplify host and
  application patch management with rolling upgrades that are integrated into
  the rest of your overall development cycle.
- Integrated access controls at appropriate levels. (authz/authn with API
  integration)
- Integrated logging and monitoring. You log and monitor for performance and
  reliability -- adding support for security-specific events and pod metadata is
  non-trivial but vital. Precisely what to monitor depends as always on your
  specific needs.

### Planning for the future

Security is an increasing concern for everyone, and initiatives are well
underway to improve the security landscape. Keep an eye out for developments on
these fronts:

- More strongly encrypted identity specific to your hardware or cloud provider
- Stronger provenance for cryptographically signed binaries/images
- Automatically updated inventories
- More sophisticated alerts and monitoring

## Other Resources

- [Securing a Cluster (Kubernetes documentation)](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)
- [Hacking and Hardening Kubernetes By Example (slides from Brad Geesaman)](https://docs.google.com/presentation/d/1xeagoDn-6kQ6FPdfX9IlD5MjWalW2o8PeCt20DEfFpg/edit)

## Popular Tooling and Approaches

### Encryption Configuration

The Kubernetes docs provide
[instructions to enable encryption at rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
for specified resources. Most importantly, this allows cluster operators to
ensure the data contained in Secrets has a layer of protection against a
malicious actor gaining access to the storage disk for etcd.

**Pros:**

- Adds a layer of protection for data contained in Secrets

**Cons:**

- Is compromised if attacker gains access to the encryption keys used by the API Server

### Validating Admission Webhook Controllers

Kubernetes RBAC provides a useful way to manage access to resources. However, it
does not provide ways to restrict access based on external systems or the
attributes of the resource being created. Proper authorization may require a
deeper understanding of the requester, evaluation of business logic, or
understanding of the cluster's current state to determine whether a request
should be authorized. Kubernetes offers preset admission controllers built into
the `kube-apiserver`, such as `PodSecurityPolicy`. These can be enabled by
altering flags on the `kube-apiserver`. To provide custom admission control
without modifying the API server, Kubernetes offers an Admission webhook
functionality. In this model, Kubernetes offers selected inbound request to an
external service that can approve or deny the request.

![Kubernetes Admission Flow](/images/guides/kubernetes/platform-security/diagrams/k8s-admission-flow.png)

Writing an admission webhook controller in code enables you to do complex logic
and access Kubernetes objects structurally, through a language's type system.
For example, see https://github.com/kubernetes/apimachinery. A downside to this
approach is maintaining the controller code base over time, which can involve
keeping logic up to date against changing Kubernetes API versions.

**Pros:**

- Flexible option for resource validation

**Cons:**

- Webhook is on the critical path for resource management in the cluster
  - Development & maintenance overhead for the webhook

### Open Policy Agent (OPA)

Similar to Validating Admission Webhook Controllers,
[OPA](https://www.openpolicyagent.org) performs validation on requests sent to
it. OPA is a general purpose policy agent. It's primary goal is to unify
policies around a centralized model and language. It uses a DSL called
[Rego](https://www.openpolicyagent.org/docs/latest/#rego) that analyzes input,
usually JSON, and provides an output. For Kubernetes admission control, the
request is typically the JSON from an
[AdmissionReview](https://godoc.org/k8s.io/api/admission/v1beta1#AdmissionReview)
object and the response is the same object with the
[AdmissionResponse](https://godoc.org/k8s.io/api/admission/v1beta1#AdmissionResponse)
filled in.

![Admission Flow with OPA](/images/guides/kubernetes/platform-security/diagrams/k8s-admission-flow-opa.png)

While this unified model is great, it can be harder to do complex logic in rego
over a general purpose language.

**Pros:**

- Powerful validation framework

**Cons:**

- Requires learning a new policy definition language: Rego

### Network Policy

Kubernetes provides a [NetworkPolicy
API](https://kubernetes.io/docs/concepts/services-networking/network-policies/).
Verify that your CNI-Plugin enforces policies. By default, Kubernetes allows
traffic to and from any pod or external source that can reach it. With this in
mind, enforcing Network Policy is critical to protect applications from unwanted
access. How policy is enforced depends on the CNI-plugin. For example, in Calico
it's enforced via IPtables and in Cilium it's BPF. If network policy if a large
part of your Kubernetes design, ensure the solution you're using offers a
scalable approach to enforcement.

Along with the Kubernetes network policy API, some CNI-Plugins offer their own
CRDs that extend the base functionality. Calico offers a
[GlobalNetworkPolicy](https://docs.projectcalico.org/v3.9/reference/resources/globalnetworkpolicy)
and
[NetworkPolicy](https://docs.projectcalico.org/v3.9/reference/resources/networkpolicy)
CRD. The primary trade-off to using a CNI-specific CRD is portability. Should
you choose to change plugins in the future, you may need to convert policies
between types. However, some of the plugin-specific policy features are very
compelling for various cluster architectures.

Historically, organizations have attempted to keep their existing network models
outside of Kubernetes and make Kubernetes fit within it. For example, this can
include making layers of Kubernetes nodes such as running nodes in Kubernetes
dedicated to certain layers such as Web, App, and Data. This moves away from
Kubernetes declarative approach and add a lot of complexity to the system. We
highly recommend considering intra-cluster and workload traffic policies into
the Kubernetes API.

**Pros:**

- Essential network controls can be enforced

**Cons:**

- Differences in implementation between CNI plugins can be a challenge