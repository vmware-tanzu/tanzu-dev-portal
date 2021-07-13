---
date: '2021-02-24'
description: Considerations for implementing admission control in Kubernetes
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Admission Control
parent: Platform Security
title: Admission Control
weight: 1
oldPath: "/content/guides/kubernetes/platform-security-admission-control.md"
aliases:
- "/guides/kubernetes/platform-security-admission-control"
level1: Managing and Operating Kubernetes
level2: Access and Security
---

This document details the philosophy and methods for implementing admission
control in a Kubernetes cluster, such as Tanzu Kubernetes Grid (TKG). It covers
architectural considerations, tooling choices, and best practices. This document
represents how the VMware field team approaches admission control in enterprise
Kubernetes environments.

Each section covers architectural recommendations and, at times, configuration
for each concern. At a high-level, the key recommendations are:

- Unless mutation or external interaction is required, OPA Gatekeeper can often
  be the best solution.
- Be aware that admission controllers sit in the critical path to the API
  server, so consider this bottleneck carefully.
- If writing a controller, consider the trade-off between frameworks and
  familiar language stacks.

## Architecture

When objects are applied to the Kubernetes API server they go through a series
of steps before being committed to etcd (the persistent datastore). The whole
flow is illustrated below.

![Admission Control Architecture](/images/guides/kubernetes/platform-security/diagrams/admission-control-ra-architecture.png)

There are many admission controllers that are built in to Kubernetes to provide
common functionality. These include:

- `ServiceAccount` - Responsible for injecting the default service account into
  pods where necessary.
- `ResourceQuota` - Responsible for enforcing resource quotas on workloads.
- `NamespaceLifecycle` - Responsible for preventing new objects being created in
  a namespace that is currently in a `terminating` state.

There are a set of admission controllers that are [enabled by
default](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default).
These defaults include two _special_ admission controllers that allow cluster
administrators to dynamically specify additional admission controllers that will
be called via webhook from the API server (the built-ins are implemented
in-tree). This guide will only focus on designing and writing mutating and
validating admission webhooks.

Because they are called as a webhook, dynamic admission controllers (both
mutating and validating) can run in-cluster or out-of-cluster (lending
themselves to work well as serverless functions for example). One caveat is that
the API server will call webhooks over TLS, so webhooks must present
certificates trusted by the Kubernetes API. This is often achieved by deploying
Cert Manager into the cluster and automatically generating certificates.

## Mutating Admission Controllers

Mutating admission controllers receive `AdmissionReview` requests from the API
server and can optionally alter objects before allowing them to pass on to the
API server (or rejecting them). These types of controllers are useful for things
like injecting sidecar containers (keeping a clean UX for end users) e.g. Istio.

If a controller chooses to mutate a request, it will allow the request by
sending an `AdmissionReview` response object along with a serialized set of
`JSONPatch` objects that describe to the API server how the object should be
altered. Depending on the implementation chosen (details below) these patches
may be auto-generated for you.

One downside of mutating controllers is that visibility is removed from the end
user, with requests / objects being applied to the cluster that are not
consistent with those that the end user originally created, potentially causing
confusion if the user is unaware that mutating controllers are in operation on
the cluster.

## Validating Admission Controllers

Validating admission controllers also receive `AdmissionReview` requests from
the API server but are not able to modify them. They can only admit or reject
the original object.

This restriction makes them fairly limited, however they are a good fit when
ensuring that objects applied to the cluster conform to security standards
(specific user IDs, no host mounts, etc...) or contain all required metadata
(internal team labels, annotations, etc...).

## Configuring Webhook Admission Controllers

Cluster administrators can use the `MutatingWebhookConfiguration` and
`ValidatingWebhookConfiguration` kinds to specify the configuration of dynamic
webhooks. Below is an annotated example describing all of the relevant sections:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: "test-mutating-hook"
webhooks:
  - name: "test-mutating-hook"
    # Matching rules. What API / kind / version / operations should this webhook be sent.
    rules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        # The operation that should trigger a call to the webhook.
        operations: ["CREATE"]
        # Which kind to target.
        resources: ["pods"]
        # Whether Namespace-scoped or cluster-scoped resources should be targeted.
        scope: "Namespaced"
    # Describes how the API server should connect to the webhook. In this case it's in cluster at `test-service.test-ns.svc`.
    clientConfig:
      service:
        namespace: test-ns
        name: test-service
        path: /test-path
        port: 8443
      # A PEM encoded CA bundle which will be used to validate the webhook's server certificate.
      caBundle: "Ci0tLS0tQk...tLS0K"
    # Declare the admissionReviewVersions that the webhook supports.
    admissionReviewVersions: ["v1", "v1beta1"]
    # Describes whether the webhook has external side effects (calls / dependencies to external systems).
    sideEffects: None
    # How long to wait until triggering the failurePolicy.
    timeoutSeconds: 5
    # Whether this webhook can be re-invoked (this may happen after other webhooks have been called).
    reinvocationPolicy: IfNeeded
    # Whether the webhook should fail 'open' or 'closed. This has security implications.
    failurePolicy: Fail
```

## Design Considerations

**Failure Modes:** If a webhook is unreachable or sends an unknown response back
to the API server, it is treated as failing. Administrators must choose whether
to fail 'open' or 'closed' in this situation by setting the `failurePolicy`
field to `Ignore` (allow the request) or `Fail` (reject the request).

For security-related (or critical functionality) webhooks, `Fail` is the safest
option. For non-critical hooks `Ignore` may be safe (potentially in conjunction
with a reconciling controller as a backup). Combine these recommendations with
those in the performance section below.

**Ordering:** The first thing to note with regards to request flow above is that
mutating webhooks will all be called (potentially more than once)_before_
validating webhooks are called. This is important because it enables validating
webhooks (which may reject a request based on security requirements) always to
see the _final_ version of a resource before it is applied.

Mutating webhooks are not guaranteed to be called in a specific order, and may
be called multiple times if subsequent hooks modify a request. This can be
modified by specifying the `reinvocationPolicy` but ideally webhooks should be
designed for idempotency to ensure ordering does not affect their functionality.

**Performance:** Webhooks are called as part of the critical path of requests
flowing to the API server. If a webhook is critical (security-related) and fails
closed (if a timeout occurs, the request is denied) then it should be designed
with high-availability in mind.

If a webhook is resource-intensive and / or has external dependencies,
consideration should be taken for how often the hook will be called, and the
performance impact of adding the functionality into the critical path. In these
situations a controller that reconciles objects once in-cluster may be
preferable.

**Side Effects:** Some webhooks may be responsible for modifying external
resources (e.g. some resource in a cloud provider) based on a request to the
Kubernetes API. These webhooks should be aware of and respect the `dryRun`
option and skip external state modification when it is enabled. Webhooks are
responsible for declaring that they either have no side-effects, or respect this
option by setting the `sideEffects` field.

## Implementations

There are three main approaches to implementing admission control in Kubernetes.
This section details each approach and calls out the advantages / disadvantages
and most appropriate use cases for each.

### Open Policy Agent (OPA) Gatekeeper

[Gatekeeper](https://github.com/open-policy-agent/gatekeeper) is an OSS tool
that uses Open Policy Agent to implement a validating admission controller. This
allows users to write constraints in the Rego language to specify rules that
specific resources should conform to.

Administrators specify `ConstraintTemplate` resources which are templates with
variable placeholders that can be re-used by end-users. For example, to specify
a `ConstraintTemplate` that allows a user to specify some required labels, the
following could be applied:

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
        listKind: K8sRequiredLabelsList
        plural: k8srequiredlabels
        singular: k8srequiredlabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

The `ConstraintTemplate` contains Rego code that can refer to input parameters
defined at a later time. An end-user can then apply the following object to make
use of the template to enforce the constraint:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-gk
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["gatekeeper"]
```

The above selects all `Namespace` objects and ensures they have the `gatekeeper`
label.

There are also use-cases where it's necessary to make a policy decision based on
data that exists externally to the object that's being applied to the cluster.
An example of this would be ensuring that all ingresses are unique. For that
it's required that we can query the state of the cluster to check all ingress
objects to compare against the one being applied.

Another even more complex example would be to annotate a namespace with a regex
pattern, and ensure any ingress applied in that namespace conforms to the regex.
A Gatekeeper sync config needs to be applied to make existing cluster information available
to Gatekeeper. This tells Gatekeeper to sync and cache information about the
specified resources:

```yaml
apiVersion: config.gatekeeper.sh/v1alpha1
kind: Config
metadata:
  name: config
  namespace: "gatekeeper-system"
spec:
  sync:
    syncOnly:
      - group: "extensions"
        version: "v1beta1"
        kind: "Ingress"
      - group: "networking.k8s.io"
        version: "v1beta1"
        kind: "Ingress"
      - group: ""
        version: "v1"
        kind: "Namespace"
```

The `ConstraintTemplate` uses the `data.inventory...` object to look up items
from the sync cache:

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: limitnamespaceingress
spec:
  crd:
    spec:
      names:
        kind: LimitNamespaceIngress
        listKind: LimitNamespaceIngressList
        plural: limitnamespaceingresss
        singular: limitnamespaceingress
      validation:
        # Schema for the `parameters` field in the constraint
        openAPIV3Schema:
          properties:
            annotation:
              type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package limitnamespaceingress

        violation[{"msg": msg}] {
          regex :=
          data.inventory.cluster.v1.Namespace[input.review.object.metadata.namespace].metadata.annotations[input.parameters.annotation]
          hosts := input.review.object.spec.rules[_].host
          not re_match(regex, hosts)
          msg := sprintf("Only ingresses with host matching %v are allowed in namespace %v", [regex ,input.review.object.metadata.namespace])
        }
```

The `annotation` in the custom input parameters allows the user to specify the
specific annotation that Gatekeeper should pull the regex pattern from.

Rego returns early if any statement returns `False`, so the `re_match()` is
inverted with `not` to ensure that a positive match allows the request.

The `LimitNamespaceIngress` object specifies that the rule should apply to
`Ingress` objects for both `apiGroups` and designates `allowed-ingress-pattern`
as the annotation that should be inspected for the regex pattern (this was the
customizable input parameter).

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: LimitNamespaceIngress
metadata:
  name: limit-namespace-ingress
spec:
  match:
    kinds:
      - apiGroups: ["extensions", "networking.k8s.io"]
        kinds: ["Ingress"]
  parameters:
    annotation: allowed-ingress-pattern
```

Finally the Namespace object itself is applied with the custom annotation &
pattern:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    # Note regex special character escaping
    allowed-ingress-pattern: \w\.my-namespace\.com
  name: ingress-test
```

Now the setup is complete the ingress objects are applied and rules evaluated
against them:

```yaml
# FAILS because the host doesn't match the pattern above
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-1
  namespace: ingress-test
spec:
  rules:
    - host: foo.other-namespace.com
      http:
        paths:
          - backend:
              serviceName: service1
              servicePort: 80
---
# SUCCEEDS as the pattern matches
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-2
  namespace: ingress-test
spec:
  rules:
    - host: foo.my-namespace.com
      http:
        paths:
          - backend:
              serviceName: service2
              servicePort: 80
```

The second ingress above will succeed as the `spec.rules.host` matches the regex
pattern specified in the `allowed-ingress-pattern` annotation on the
`ingress-test` namespace. However the first ingress above does not match and
results in an error:

```text
Error from server ([denied by limit-namespace-ingress] Only ingresses with host matching \w\.my-namespace\.com are allowed in namespace ingress-test): error when creating "ingress.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [denied by limit-namespace-ingress] Only ingresses with host matching \w\.my-namespace\.com are allowed in namespace ingress-test
```

Advantages:

- Extensible `ConstraintTemplate` model allows admins to define common policies
  and share / re-use them as libraries.
- Doesn't require any custom coding (outside of Rego policies).
- Fairly mature, community-supported project.
- Easy to install.

Disadvantages:

- Only supports validating (not mutating) admission control.
- Rego can get unwieldy when writing non-trivial evaluation logic.
- Care needs to be taken with the defaults (e.g. `failurePolicy` is set to
  `Ignore`).

{{% aside title="Alternate deprecated approach: `OPA with kube-mgmt`" %}}
Before Gatekeeper was released, there was an alternative approach to use OPA with
Kubernetes. This involved deploying a `kube-mgmt` component to the cluster which
would watch for `ConfigMap` objects containing rego policies and load them into
OPA. This is in contrast to the more Kubernetes-native approach of using CRDs
for policies and templates.
{{% /aside %}}

### Controller-Runtime

The upstream tool
([controller-runtime](https://github.com/kubernetes-sigs/controller-runtime))
provides abstractions to ease the creation of mutating and validating admission
webhooks.

[An
example](https://github.com/kubernetes-sigs/controller-runtime/tree/master/examples/builtins)
of how to implement these hooks for built-in types (e.g. Pod, Deployment,
etc...) is provided by the project to help users get started.

This approach is useful when complex logic or side-effects are required in an
admission controller. While it does require coding knowledge (Go), it offers
great flexibility while still taking advantage of the abstractions offered by
controller-runtime.

Webhooks must implement a `Handle` method whose signature is:

```go
func (w *Webhook) Handle(ctx context.Context, req admission.Request) admission.Response
```

The `admission.Request` object is an abstraction over the raw JSON that webhooks
receive, and provides easy access to the raw applied object, the operation being
executed (e.g. `CREATE`) etc...

Within the handler create a new instance of the object being captured and decode
the raw object into the Go structure. In the case below a new Pod struct is
created:

```go
p := &v.Pod{}
err := w.decoder.DecodeRaw(req.Object, p)
```

The `p` object can be modified or validated in any way before the response is
returned. In the example below an annotation is added to the Pod before
marshaling the object back to JSON and sending the patched response back to the
API server:

```go
p.Annotations["new-annotation"] = "new-annotation-value"\
marshaledPod, err := json.Marshal(p)
return admission.PatchResponseFromRaw(req.Object.Raw, marshaledPod)
```

Controller-runtime's `PatchResponseFromRaw` method will automatically calculate
the JSONPatch diffs required between the original raw object and the modified
one before sending the correctly serialized response.

In the case of a simple validating hook, controller-runtime provides convenience
functions `admission.Allowed()` and `admission.Denied()` that can be used after
processing the required logic.

One of the biggest additional advantages of using Kubebuilder is the use of
markers to auto-generate manifests for deployment & RBAC.

```yaml
// +kubebuilder:webhook:path=/validate-v1-pod,mutating=false,failurePolicy=fail,groups="",resources=pods,verbs=create;update,versions=v1,name=vpod.kb.io
```

The example above generates the following:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "vpod.kb.io"
webhooks:
  - name: "vpod.kb.io"
    rules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["pods"]
        scope: "Namespaced"
    clientConfig:
      service:
        name: vpod
        path: /validate-v1-pod
        port: 8443
      caBundle: "Ci0tLS0tQk...tLS0K"
    failurePolicy: Fail
```

Advantages:

- Supports both mutating and validating admission control.
- Use of high-level programming language allows huge flexibility / & extensibility.
- Abstracts underlying request handling and message parsing with convenience
  interfaces and methods.
- Can have more tightly-scoped RBAC privileges.

Disadvantages:

- Requires Go programming knowledge.
- Requires knowledge of some Kubernetes API server behaviors.
- Admission logic is contained in code rather than being readable in CRDs or
  ConfigMaps.

### Agnostic HTTP Handler

An alternate way to build admission controllers (mutating & validating) is by
implementing an HTTP webhook endpoint from scratch in any language. Examples
below use Go but any language capable of TLS-enabled HTTP handling and JSON
parsing is acceptable.

Using this approach provides the most flexibility to integrate with the current
stacks in use, but comes at the cost of many high-level abstractions (although
languages with mature Kubernetes client libraries can alleviate this).

As described above admission control webhooks receive and return HTTPS requests
from and to the API server. The schema of these messages is well known so it's
possible to receive the request and modify the object (via Patches) manually.

The example below is shown in Go. Whereas `controller-runtime` provides a patch
generation helper, it is necessary in plain Go to generate the JSONPatch and
serialize it (to JSON) manually:

```go
patch := []patchOperation{
  {
   Op:    "add",
   Path:  "/spec/volumes/0",
   Value: volume,
  },
 }
patchBytes, err := json.Marshal(patch)
```

Finally there is no convenience wrapper around the response, so this also has to
be manually created with the relevant patches and status before being returned:

```go
return &v1beta1.AdmissionResponse{
  Allowed: true,
  Patch:   patchBytes,
  PatchType: func() *v1beta1.PatchType {
   pt := v1beta1.PatchTypeJSONPatch
   return &pt
  }(),
 }
```

In addition to the extra work in the logic of the webhook, there is a larger
amount of supporting code required to handle errors, graceful shutdown, HTTP
headers, etc...

Advantages:

- Maximum flexibility for different languages / stacks.
- Supports both mutating and validating hooks.

Disadvantages:

- Almost all functionality must be written from scratch.
- More complex to maintain.