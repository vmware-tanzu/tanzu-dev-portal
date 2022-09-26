---
title: "Getting Started with OPA Gatekeeper"
linkTitle:  "Getting Started with OPA Gatekeeper"
description: "An Introduction to the Open Policy Agent on Kubernetes using OPA Gatekeeper"
date: "2022-08-26"
lastmod: "2022-08-26"
level1: Securing Kubernetes
level2: Access and Security
tags:
- Kubernetes
- Security
# Author(s)
team:
- Tony Scully
- Tiffany Jernigan
topics:
- Kubernetes
---

## Introduction

As the use of Kubernetes and other Cloud Native platforms grows, there is an increasing requirement to ensure that the clusters and the workloads they run are in compliance with legal requirements and organizational roles, work within specific technical constraints, and are consistent across releases and across platform instances.

One of the tools that can be used for this assurance is the [Open Policy Agent (OPA)](https://www.openpolicyagent.org/).

## What Is OPA?

Open Policy Agent (OPA) is an Open Source Software project that is managed by the Cloud Native Computing Foundation (CNCF).  OPA has achieved ‘graduated’ maturity level in the CNCF landscape.
 
OPA is a general purpose policy engine that allows for unified policy enforcement across platforms and across the software stack.  OPA uses a high-level declarative language that lets you specify policy-as-code and APIs to offload policy decision-making from your software, providing a clear separation of concerns.
 
In OPA a policy is a set of rules that govern the behavior of a software service.  Policies can be used to encode information about how to achieve compliance with these rules, and to define an action to take when these rules are violated.

There are often multiple ways to build the type of controls that policy can be used to define, but as with security in general, it is useful to be able to apply controls in layers, so that the failure or misconfiguration of one layer does not lead to a failure of enforcement.

OPA policies are created in a domain specific language called Rego.  Rego is a declarative language for defining queries, so you can focus on the value returned by the queries rather than on how the query is executed.

Rego is based on the Datalog language and extends Datalog to structured document formats like YAML or JSON.  Rego queries are assertions on data that is stored in OPA.  These queries can be used to define policies that enumerate instances of data that violate the expected state of the system, for example a query could check that a particular field in a YAML document has been set to one of a range of acceptable values.
 
Here are some useful resources for learning and understanding Rego:
- [Rego Documentation](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Rego playground to develop and test queries](https://play.openpolicyagent.org/)
- [Testing locally using the `conftest` tool](https://github.com/open-policy-agent/conftest)
- [Developing policies](https://tanzu.vmware.com/developer/guides/platform-security-opa/)

It is useful to understand the Rego language, but you can get started with OPA using the examples provided by the project, which cover a lot of use-cases.

## What is Gatekeeper?
 
[OPA Gatekeeper](https://www.openpolicyagent.org/docs/latest/kubernetes-introduction/#what-is-opa-gatekeeper) is a specialized implementation of OPA that provides integration with Kubernetes using *Dynamic Admission Control* and custom resource definitions to allow the Kubernetes cluster administrator and other users to create policy templates and specific policy instances, as outlined below.
 

## What is admission control?
 
In Kubernetes, OPA policies are evaluated at the Admission Control phase of a request being processed by the Kubernetes API.  Generally requests to the Kubernetes API go through three broad phases before they are accepted or rejected:
 
- **Authentication** - checking the identity of the user or service making the request, for example by presenting a valid token to the API
- **Authorization** - checking that the identity has the required access to perform the request, for example has appropriate role bound
- **Admission Control** - checking that the request passes any built-in validation or any checks implemented by the cluster administrator
 
If the request successfully completes the above stages, the changes specified in the request are applied to the cluster.
 
Policy decisions like those defined in OPA are implemented at the admission control stage, and the OPA project provides an admission controller plugin called Gatekeeper to perform this function in a Kubernetes cluster.
 
The Kubernetes API has a number of built-in admission controllers, for example the controllers that implement `LimitRange` and `ResourceQuota.Admission` control in Kubernetes is also dynamically extensible using webhooks.

This means that once Gatekeeper is deployed and running in a cluster, each request to the Kubernetes API will be evaluated against `specifiedOPA` rules, without having to reconfigure the Kubernetes API itself.  This is managed by Gatekeeper, registering with the Kubernetes API as both a validating webhook and a mutating webhook. 

The Kubernetes API calls any validating admission webhooks that match the request resource specification; these webhooks can respond by allowing or denying the request. If any webhook responds with a denial message, the API request is rejected.

When called by the Kubernetes API, mutating admission webhooks can allow a request and additionally respond with a `patch` to the original resource, the patch contains the changes that should be applied to the resource before the request is completed. 
 
See the [Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) for more details on dynamic admission control.




## Install Gatekeeper

First, you need a cluster with Kubernetes v1.16 or later.

Next, ensure that you have cluster admin RBAC permissions:
```
kubectl create clusterrolebinding cluster-admin-binding \
--clusterrole cluster-admin \
--user <YOUR USER NAME>
```

In this guide we will just deploy Gatekeeper using a prebuilt image:
```
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
```

To see other ways to install Gatekeeper, such as with a Helm chart, check out the [Gatekeeper documentation](https://open-policy-agent.github.io/gatekeeper/website/docs/install#installation). If you are unfamiliar with and interested to learn about Helm, check out [Getting Started with Helm](/guides/helm-gs/).
## Using Gatekeeper

Now that Gatekeeper has been installed, there are some new components running in the cluster.  You can examine the content of the `gatekeeper-system` namespace:

```
kubectl -n gatekeeper-system get deployments,services
NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/gatekeeper-audit                1/1     1            1           65m
deployment.apps/gatekeeper-controller-manager   3/3     3            3           65m

NAME                                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
service/gatekeeper-webhook-service   ClusterIP   10.96.212.9   <none>        443/TCP   65m
```

These two deployments create the pods that run the Gatekeeper controllers:

- **gatekeeper-controller-manager** implements the webhooks that the Kubernetes API will call for validation and mutation
- **gatekeeper-audit** checks for policy compliance on objects that already exist in the cluster


And also see these new custom resource definitions (CRDs) that have been created in the cluster:

```
kubectl get crd -l gatekeeper.sh/system=yes
NAME                                                 CREATED AT
assign.mutations.gatekeeper.sh                       2022-07-13T10:16:20Z
assignmetadata.mutations.gatekeeper.sh               2022-07-13T10:16:21Z
configs.config.gatekeeper.sh                         2022-07-13T10:16:21Z
constraintpodstatuses.status.gatekeeper.sh           2022-07-13T10:16:21Z
constrainttemplatepodstatuses.status.gatekeeper.sh   2022-07-13T10:16:20Z
constrainttemplates.templates.gatekeeper.sh          2022-07-13T10:16:20Z
modifyset.mutations.gatekeeper.sh                    2022-07-13T10:16:20Z
mutatorpodstatuses.status.gatekeeper.sh              2022-07-13T10:16:20Z
providers.externaldata.gatekeeper.sh                 2022-07-13T10:16:21Z
```

Using the `constrainttemplates.templates.gatekeeper.sh` CRD you can create general policy definitions that Gatekeeper will use.

Once you have created a template, you can create specific constraint instances for each use-case you want to define. 

### Creating a constraint template

As an example of constraint templates, the cluster admin can create a template to require labels on objects.

This template defines a general constraint that checks for the existence of labels.  Note that there are no specific cases (label names or object types) defined in the template.

Once created, the template can be used to create constraints that require a specific label or set of labels to be defined on an object.

You can see the general structure of the template in the YAML below.  The spec contains two main fields: `crd` and `targets`.  The `targets` contains the Rego definition of the general constraint you want to use.   You can find more information in the Rego documentation or you can use `kubectl explain` to explore the structure of the YAML used to define the templates.

In the ‘targets’ section, you can see who the template refers to the Kubernetes specification of the resources to be reviewed by the policy, in this case `object.metadata.labels`.  
You can define the message that you want to be reported if the constraint is violated in the template.

Save the following YAML in a file named `example-constraint-template.yaml` for the next step.

```yaml
–
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
  annotations:
    description: >-
      Requires resources to contain specified labels, with values matching
      provided regular expressions.
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        openAPIV3Schema:
          type: object
          properties:
            message:
              type: string
            labels:
              type: array
              description: >-
                A list of labels and values the object must specify.
              items:
                type: object
                properties:
                  key:
                    type: string
                    description: >-
                      The required label.
                  allowedRegex:
                    type: string
                    description: >-
                      If specified, a regular expression the annotation's value
                      must match. The value must contain at least one match for
                      the regular expression.
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        get_message(parameters, _default) = msg {
          not parameters.message
          msg := _default
        }

        get_message(parameters, _default) = msg {
          msg := parameters.message
        }

        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_].key}
          missing := required - provided
          count(missing) > 0
          def_msg := sprintf("you must provide labels: %v", [missing])
          msg := get_message(input.parameters, def_msg)
        }

        violation[{"msg": msg}] {
          value := input.review.object.metadata.labels[key]
          expected := input.parameters.labels[_]
          expected.key == key
          # do not match if allowedRegex is not defined, or is an empty string
          expected.allowedRegex != ""
          not re_match(expected.allowedRegex, value)
          def_msg := sprintf("Label <%v: %v> does not satisfy allowed regex: %v", [key, value, expected.allowedRegex])
          msg := get_message(input.parameters, def_msg)
        }
```

Apply the YAML to the cluster created earlier:

```
kubectl apply -f example-constraint-template.yaml
constrainttemplate.templates.gatekeeper.sh/k8srequiredlabels created
```

And we can see the resource that has been created:

```
kubectl get constrainttemplates
NAME                AGE
k8srequiredlabels   64s
```

Next, you need to create a specific constraint to be applied.

In this case, the constraint defines that any `namespace` objects that are created must have a value set for the `owner` label. Save the below YAML in a file named `example-constraint-instance.yaml` for the next step:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: all-ns-must-have-owner-label
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    message: "All namespaces must have an `owner` label"
    labels:
      - key: owner
```

When this is applied a specific instance of the constraint template `K8sRequiredLabels` is created:

```
kubectl apply -f example-constraint-instance.yaml
k8srequiredlabels.constraints.gatekeeper.sh/all-ns-must-have-owner-label created
```

```
kubectl get constraints
NAME                           AGE
all-ns-must-have-owner-label   35s
```

## Testing the constraint

Save the following minimal YAML to create a namespace to a file called `test-opa.yaml`:

```
apiVersion: v1
kind: Namespace
metadata:
  name: test-opa
spec: {}
```

If you now apply this to the cluster:

```
kubectl apply -f test-opa.yaml
Error from server ([all-ns-must-have-owner-label] All namespaces must have an `owner` label): error when creating "test-opa.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [all-ns-must-have-owner-label] All namespaces must have an `owner` label
```

You can see the constraint created earlier is violated, and creation of the object is denied.

Modify the YAML as shown here and attempting to create with the label added:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: test-opa
  labels:
    owner: opa-tester
spec: {}
```

```
kubectl apply -f test-opa.yaml
namespace/test-opa created

kubectl get ns test-opa
NAME       STATUS   AGE
test-opa   Active   17s
```

## Adding another constraint using the same template

Once a constraint template exists, it can be used for multiple use-cases.  

For example, this constraint would check that a label named `stage` is set on any pod spec that is sent to the Kubernetes API:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: all-pods-must-have-stage-label
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    message: "All pods must have a `stage` label"
    labels:
      - key: stage
```

## Checking the status of constraints

One thing to note is that once a constraint has been put in place, using `kubectl describe` will show violation of the constraint by objects that already exist in the cluster.

The existing objects will not be affected, for example a running pod that violates a constraint will not be evicted, but updates to those objects will fail.  For example in the cluster deployed earlier:

```
kubectl describe  constraint all-ns-must-have-owner-label
Name:         all-ns-must-have-owner-label
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  constraints.gatekeeper.sh/v1beta1
Kind:         K8sRequiredLabels
Metadata:
  Creation Timestamp:  2022-07-13T12:14:32Z
  Generation:          1
  Managed Fields:
    API Version:  constraints.gatekeeper.sh/v1beta1
    Fields Type:  FieldsV1
    fieldsV1:
      f:status:
    Manager:      gatekeeper
    Operation:    Update
    Subresource:  status
    Time:         2022-07-13T12:14:32Z
    API Version:  constraints.gatekeeper.sh/v1beta1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:annotations:
          .:
          f:kubectl.kubernetes.io/last-applied-configuration:
      f:spec:
        .:
        f:match:
          .:
          f:kinds:
        f:parameters:
          .:
          f:labels:
          f:message:
    Manager:         kubectl-client-side-apply
    Operation:       Update
    Time:            2022-07-13T12:14:32Z
  Resource Version:  28190
  UID:               e1584a76-2a12-43c1-a9a6-dfa677c62de5
Spec:
  Match:
    Kinds:
      API Groups:

      Kinds:
        Namespace
  Parameters:
    Labels:
      Key:    owner
    Message:  All namespaces must have an `owner` label
Status:
  Audit Timestamp:  2022-07-13T14:44:37Z
  By Pod:
    Constraint UID:       e1584a76-2a12-43c1-a9a6-dfa677c62de5
    Enforced:             true
    Id:                   gatekeeper-audit-6d9c86d658-47krm
    Observed Generation:  1
    Operations:
      audit
      status
    Constraint UID:       e1584a76-2a12-43c1-a9a6-dfa677c62de5
    Enforced:             true
    Id:                   gatekeeper-controller-manager-7f66c8bb65-65v89
    Observed Generation:  1
    Operations:
      mutation-webhook
      webhook
  Total Violations:  8
  Violations:
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                tkg-system
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                gatekeeper-system
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                tanzu-package-repo-global
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                local-path-storage
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                kube-public
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                kube-system
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                default
    Enforcement Action:  deny
    Kind:                Namespace
    Message:             All namespaces must have an `owner` label
    Name:                kube-node-lease
Events:                  <none>
```

You can see in the violations section above, that a number of existing namespaces do not have the owner label set, as required by the constraint.

If you attempt to make an update to the namespace this will fail until the constraint (setting a value for the owner label) is met.

```
kubectl edit namespace default
error: namespaces "default" could not be patched: admission webhook "validation.gatekeeper.sh" denied the request: [all-ns-must-have-owner-label] All namespaces must have an `owner` label
```

## Testing Constraints

Adding new constraint templates and new constraints will impact the cluster, and may produce unwanted side-effects, so testing is key.

You can use the 'dry-run' capability by setting the `enforcementAction` property in the spec of the constraint to `dryrun`.  Violations will then be logged, but will not be denied by the admission controller.

For further details see:  
[Gatekeeper dry-run](https://open-policy-agent.github.io/gatekeeper/website/docs/next/violations/#dry-run-enforcement-action).


## Use Cases and Further Examples

Now you have seen the basic structure of a constraint template and how you can create specific constraints from templates, you can look at further examples and use-cases:

Uses-cases could include:

- enforcing a minimum number of replicas on each deployment
- enforcing the use of a SHA in image references rather than the use of a tag
- enforcing the setting of requests and limits for containers in pod specifications
- implement a denylist for disallowed registries

There are many examples in the Gatekeeper library, here: [ Gatekeeper Library](https://github.com/open-policy-agent/gatekeeper-library/tree/master/library/general)

This is also a great resource for learning about Gatekeeper.


## Using Mutation with Gatekeeper

So far you have seen Gatekeeper acting a *validating* admission controller, that is, the Kubernetes API sends a request to the Gatekeeper webhook endpoint to query the state of some value, and the webhook provides a response that the query satisfies a constraint, or that the constraint is violated.

Kubernetes also provides a mechanism where the admission controller can *mutate* (that is, update) the contents of the request to the Kubernetes API in order to satisfy the constraint.

Mutation of this sort can be a solution to the issue of having Kubernetes API requests rejected at the admission stage, which then requires the requesting entity to modify and re-submit the request.

While this is true, the use of mutation should be carefully considered, as making changes to the request at admission time means that the specification of the resource that is created or updated in the cluster is not identical to what was specified in the initial request.  This can lead to configuration drift, for example if you are using source code control for the specification of your resources, the source code control system should be a ‘single source of truth’ and should accurately reflect the running state of the cluster.

The mutating webhook uses some of the other customer resources that were shown earlier in this guide.  They are:

```
kubectl get crd -l gatekeeper.sh/system=yes  |grep -i mutation
assign.mutations.gatekeeper.sh                       2022-07-13T10:16:20Z
assignmetadata.mutations.gatekeeper.sh               2022-07-13T10:16:21Z
modifyset.mutations.gatekeeper.sh                    2022-07-13T10:16:20Z
```
The function of these CRDs is:

- `AssignMetadata` - defines changes to the metadata section of a resource
- `Assign` - any change outside the metadata section
- `ModifySet` - adds or removes entries from a list, such as the arguments to a container

Each of these CRDs applies to a different use-case. 
 
As an example, in use-case earlier in this guide, where Gatekeeper was used to deny the creation of a namespace without the `owner` label set, you can use the `AssignMetadata` CRD to set the label to a specific value.  
 
Here is the YAML for this CRD instance.  This will cause any attempt to create a namespace without a value for the label `owner` to have that label set to the value `cluster-admin`. Save it to the file `example-assign-metadata.yaml`.
 
```yaml
apiVersion: mutations.gatekeeper.sh/v1alpha1
kind: AssignMetadata
metadata:
 name: ns-label-owner
spec:
   match:
     kinds:
       - apiGroups: ["*"]
         kinds: ["Namespace"]
   location: "metadata.labels.owner"
   parameters:
     assign:
       value:  "cluster-admin"
```
 
Apply that YAML to the cluster and it will create an instance of the CRD:
 
```
kubectl apply -f example-assign-metadata.yaml
assignmetadata.mutations.gatekeeper.sh/ns-label-owner created
 
kubectl get assignmetadata.mutations.gatekeeper
NAME             AGE
ns-label-owner   14s
```
 
The constraint that requires a value to exist for the label `owner` on a namespace is still in place, but now creating a namespace without the label set will succeed.
 
Create a file called `test-opa-mutation.yaml` with the following:
 
```yaml
apiVersion: v1
kind: Namespace
metadata:
 name: test-opa-mutation
spec: {}
status: {}
```
 
Apply it:
```
kubectl apply -f test-opa-mutation.yaml
namespace/test-opa-mutation created
```
 
And check:
 
```
kubectl get namespaces test-opa-mutation --show-labels
NAME                STATUS   AGE   LABELS
test-opa-mutation   Active   14s   kubernetes.io/metadata.name=test-opa-mutation,owner=cluster-admin
```
 
*NOTE:*  if the label is already set to a value, the mutating webhook will have no effect and the value will remain as specified in the original request.


## Cleanup
```
kubectl delete -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
```

```
kubectl delete clusterrolebinding cluster-admin-binding
```

## Conclusions and Next Steps

This guide is intended as an introduction to Gatekeeper.

Using the information here and the references linked, you are now able to start the process of building a set of policies for your use-cases, and be able to apply those policies consistently across all your Kubernetes clusters.
