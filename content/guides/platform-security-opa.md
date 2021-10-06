---
date: '2021-02-24'
description: Implementing Open Policy Agent in Kubernetes
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Developing OPA Policies
parent: Platform Security
title: Developing OPA Policies
weight: 1600
oldPath: "/content/guides/kubernetes/platform-security-opa.md"
aliases:
- "/guides/kubernetes/platform-security-opa"
level1: Securing Kubernetes
level2: Access and Security
tags: []
---

[Open Policy Agent](https://www.openpolicyagent.org/) (OPA) is a declarative
policy engine that helps an IT organization separate policies from software so
teams can support or modify policies without affecting the software.

This guide demonstrates how to implement Open Policy Agent (kube-mgmt) in
Kubernetes. First, you will use OPA in your local machine to define and test
policies. Then, you will deploy OPA to a Kubernetes cluster and test the
policies there.

## Assumptions

The guide assumes you understand policy management, admission webhooks, and the
Rego programming language. You can use the following resources if you need to
review these topics:

- **Policy Management Philosophy**: https://www.openpolicyagent.org/docs/latest/philosophy/
- **Admission Webhooks**: https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/
- **Rego Policy Language**: https://www.openpolicyagent.org/docs/latest/#rego

## Install OPA in your local machine

Follow the [Running
OPA](https://www.openpolicyagent.org/docs/latest/#running-opa) documentation to
install OPA in your machine. Once installed, you will be able to test your OPA
policies locally.

## Creating policies

### Directory structure setup

In this guide, you will create OPA policy files, test files, and Kubernetes
manifests. Create a working directory to hold these files.

### Policy development

Create a policy file called `PolicyA.rego` with the following contents. The
policy ensures that Deployments have CPU limits set. You will dissect the policy
in the following sections.

```rego
# PolicyA.rego
package kubernetes.admission

operations = {"CREATE","UPDATE"}

input_container[c] {
  c := input.request.object.spec.template.spec.containers[_]
}

deny[reason] {
  input.request.kind.kind == "Deployment"
  operations[input.request.operation]
  input_container[container]
  not container.resources.limits.cpu
  reason := sprintf("container %v is missing CPU limits", [container.name])
}
```

#### Packages

The first line of the policy is the package statement. `package
kubernetes.admission` defines hierarchical name to the rules in the rest of the
policy.`kubernetes.admission` is the default package statement for OPA because
it assumes OPA is configured as an admission controller.

As you create more policies you will want to revise and plan your package
statements. This
[document](https://www.openpolicyagent.org/docs/latest/faq/#collaboration-using-import)
demonstrates one way you can define your package statement strategy. If your
package statements in different policies are the same, then you will run into
conflict issues when you test them. OPA may output an error even if the policy
is logically valid.

#### Operations

The `operations` variable defines the actions that will trigger the policy. In
this case, the policy is run when an API object is created or updated.

#### Input document & Dot notation

The `input` variable is a reserved global variable whose value is equal to the
[Admission
Review](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admissionreview-request-0)
object. The API server takes this object and provides it to any admission
control webhook.

In OPA, the dot notation is used to traverse through the YAML hierarchy. If the
path does not exist, the dot(.) operator does not throw an error but instead it
has a value of `undefined`. The overall result of the policy will evaluate to
`undefined` and **not** `true` or `false`.

In this example, under the `deny` section, `input.request.kind.kind ==
"Deployment"`, OPA is traversing through YAML hierarchy to check for the
Kubernetes resource type of `Deployment`.

#### Iteration

You will want your policy to apply to multiple containers. If you use this line
in your policy `input.request.object.spec.container`, OPA will only review the
first container. This is not practical as pods can have multiple containers.

To iterate over multiple containers, use this line `c:=
input.request.object.spec.containers[_]` and create function of
`input_p_container` with the variable of `c`. This function iterates over the
indexes `input.request.object.spec.containers[_]` array and the anonymous
variable `_` allows you to use a built-in variable instead of defining a new one
strictly for iteration.

#### Deny rules

The `deny` statement is the error message that will be returned to the user.
`deny[reason]` states that the admission control should reject the request if
the conditions in the body (the statements between the `{}`) are **true** and
return the error message to the user.

In this example, the policy evaluates to **true** when the `Deployment` does not
have a CPU resource limit. The `deny` statement returns a message of `container
%v (name of container) is missing CPU limits`.

## Test case development

To test the policy you created in the previous section, you have to create a
matching test case/file. Create a test policy called `test-PolicyA.rego` with
the content below.

The test case validates that the policy blocks Deployments without a CPU limit.
Here is the finished test policy. Let's dissect the policy in the following
sections:

```rego
# test-PolicyA.rego
package kubernetes.admission

test_no_limits {
   no_limits := {
     "request":{
       "kind":{
         "kind":"Deployment"
       },
       "operation":"CREATE",
       "object":{
         "spec":{
           "template": {
             "spec": {
               "containers": [
                 {
                   "name": "nginx-1",
                   "resources":{
                       "requests":{
                          "cpu": "10mi",
                          "memory": "10mi"
                       }
                    }
                 }
               ]
             }
           }
         }
       }
     }
   }
   count(deny) == 1 with input as no_limits
 }
```

### Packages

Similarly to when developing policies, the first line of the policy test file
should be the package statement. The package should be the same as the
policy's package: `package kubernetes.admission`.

### Test case name

`test_no_limits {` represents the name of the test case. This name should be
different for each test case in the test file.

`no_limits := {` represents the name of the input value which will be JSON. This
variable is used in the test case.

### Test case JSON

After the `no_limits :=` statement you will see JSON data. This JSON is your
mock data that mimics an AdmissionReview request sent by the API server. Here
you will make the data as close to a real life scenario as possible for the best
testing results. In this example, the container has CPU and Memory requests but
not limits. Therefore, our policy should block the request.

### Test case

The `count(deny) == 1 with input as no_limits` statement has 2 key components.
First, the `count(deny)` gets a count of the deny statements in the test case.
Second, the `with input as no_limits` statement sets the `input` to the
`no_limits` variable, which is necessary to use our mock data.

In this example, the `count(admission.deny)` value should be equal to `1`
because the container is missing the CPU limit. Therefore, OPA should return the
value of `count` as `1`

## Testing policies

Now that you have a policy file and corresponding test file, you are ready to
test your policy.

This is the syntax of the command to run the test:

`opa test -v name_of_policy name_of_test_file`

Run the following command to test the policy you have created:

```bash
opa test -v PolicyA.rego test-PolicyA.rego
```

The output should look similar to the following:

```txt
data.kubernetes.admission.test_no_limits: PASS (601.648µs)
------------------------------------------------------------
PASS: 1/1
```

All the tests `PASS`. The results show the name of the test case and
pass/fail/error.

If the test case `FAILS`, the output will look like this:

```txt
FAILURES
--------------------------------------------------------------
data.kubernetes.admission.test_no_limits: FAIL (568.467µs)

  Enter data.kubernetes.admission.test_no_limits = _
  | Enter data.kubernetes.admission.test_no_limits
  | | Enter data.kubernetes.admission.deny
  | | | Enter container.resources.limits.cpu
  | | | | Fail container.resources.limits.cpu
  | | Fail __local4__ = 3 with input as no_limits
  | Fail data.kubernetes.admission.test_no_limits = _

SUMMARY
---------------------------------------------------------------
data.kubernetes.admission.test_no_limits: FAIL (568.467µs)
---------------------------------------------------------------
FAIL: 1/1
```

Ensure all your test cases `PASS` before you move on to testing in your cluster.

## Example policies

Here are example policies that are used in production Kubernetes environments.
All these examples are simple examples that can be modified and customized to
your environment and needs.

### Policy to prevent users from deleting CustomResourceDefinitions

```rego
### This policy block users from deleting CRDs.
### You have to enable the Validating Admission Webhook to include the DELETE operation if not already

package kubernetes.admission

deny[reason] {
    input.request.kind.kind == "CustomResourceDefinition"
    input.request.operation == "DELETE"
    reason := ("You do not have authority to delete a Custom Resource Definition")
}

```

### Policy to prevent users from creating unapproved Service types

```rego
### This policy blocks the user from creating or changing Service Types of LoadBalancer or NodePort.
package kubernetes.admission

operations = {"CREATE","UPDATE"}

deny[reason] {
    input.request.kind.kind == "Service"
    operations[input.request.operation]
    input.request.object.spec.type == "LoadBalancer"
    reason := ("Cannot have service type of LoadBalancer")
}

deny[reason] {
    input.request.kind.kind == "Service"
    operations[input.request.operation]
    input.request.object.spec.type == "NodePort"
    reason := ("Cannot have service type of NodePort")
}
```

## Policy to enforce specific labels on all Deployment resources

```rego
package main

name = input.metadata.name

labels {
    input.metadata.labels["app.kubernetes.io/name"]
    input.metadata.labels["app.kubernetes.io/instance"]
}

deny[reason] {
  input.request.kind.kind == "Deployment"
  not labels
  reason = sprintf("%s must include Kubernetes recommended labels: https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/#labels", [name])
}
```

Preferably, you should test and develop your policies locally before you proceed
to testing in your cluster. As you can see there are various ways you can design
your policies to fit your IT process.

## Deploy OPA to a cluster

Let's move to test your policy in a Kubernetes cluster. We will use the policy
`PolicyA.rego` for testing OPA in our cluster.

To deploy OPA to you cluster, follow the [Deploying OPA on a Kubernetes Cluster
Guide](https://www.openpolicyagent.org/docs/latest/kubernetes-tutorial/)

### Confirm OPA is deployed to the cluster

Confirm that OPA has been deployed to the cluster by checking if the OPA Pods
are running. Use the `kubectl get pods -n opa` command to verify. You should see
two OPA Pods running.

### Load the policy as a ConfigMap

You will test the policy file `PolicyA.rego` in your cluster. Navigate to the
directory where `PolicyA.rego` is stored. You will use this file to create a
ConfigMap in the `opa` namespace that the OPA sidecar will notice and load into
OPA. OPA can also load policies from other namespaces if they are labeled
`openpolicyagent.org/policy=rego`

Load the policy using this command:

```bash
kubectl create configmap cpulimits --from-file=PolicyA.rego -n opa
```

Confirm that the ConfigMap has been created in the Kubernetes cluster:

```bash
kubectl get configmap -n opa
```

You should see the OPA ConfigMap and the ConfigMap you just created:

```text
NAME                      DATA   AGE
cpulimits                 1      36m
opa-default-system-main   1      107m
```

Also, confirm that OPA accepted the policy by checking the ConfigMap status and
looking at the `openpolicyagent.org/policy-status` annotation. The status should
be equal to "ok".

Run the following command to view the annotations on the ConfigMap:

```bash
kubectl get configmap cpulimits -o yaml
```

The output should be similar to this:

```yaml
kind: ConfigMap
metadata:
  annotations:
    openpolicyagent.org/policy-status: '{"status":"ok"}'
  creationTimestamp: "2020-04-03T14:20:52Z"
  name: cpulimits
  namespace: opa
```

**Pro-Tip** Before you try to create the Deployment, delete the OPA pods in the
OPA namespace. This is not mandatory but sometimes the OPA pods need to be
restarted before it recognizes the ConfigMap you just created; even though the
ConfigMap status value equals "ok".

### Exercise the policy

To exercise the policy, you will create two Kubernetes manifest files: one with
a valid Deployment and the other with an invalid Deployment.

1. Create a file called `PolicyA-good.yaml` with the following content. This
   manifest contains a Deployment that OPA should allow because the container
   has a CPU limit.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      namespace: default
      name: nginx-good
      labels:
        app: nginx
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx
            ports:
            - containerPort: 80
            resources:
              limits:
                cpu: "200m"
                memory: "256Mi"
    ```

2. Create a file called `PolicyA-bad.yaml`. This manifest contains a Deployment
   that OPA should **not** allow to get created because the container lacks CPU
   limits.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      namespace: default
      name: nginx-bad
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx
            ports:
            - containerPort: 80
    ```

Now that you have the Kubernetes manifests, lets verify that OPA is working as
expected.

1. Run `kubectl apply -f PolicyA-good.yaml`. The Deployment should be created
   successfully.

2. Run `kubectl apply -f PolicyA-bad.yaml` and see the error message that is
   returned. It should be the same message that you defined in the `reason`
   statement in the policy.

   ```text
   Error from server (container nginx is missing CPU limits): error when creating "PolicyA-bad.yaml": admission webhook "validating-webhook.openpolicyagent.org" denied the request: container nginx is missing CPU limits
   ```

### Summary

In this guide, you completed the following:

- Installed OPA into your local environment
- Developed an OPA policy that blocks Deployments without CPU limits
- Tested the policy locally with mock data
- Reviewed sample OPA policies for different use-cases
- Installed OPA into a Kubernetes cluster
- Deployed your policy into the Kubernetes cluster as a ConfigMap
- Verified that the policy works as expected using `kubectl` and sample
  Deployment manifests