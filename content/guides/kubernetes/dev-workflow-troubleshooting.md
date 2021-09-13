---
date: '2021-02-09'
description: Common steps for troubleshooting applications running on Kubernetes.
lastmod: '2021-02-09'
linkTitle: Troubleshooting Applications
parent: Developer Workflow
tags:
- Troubleshooting
team:
- John Harris
title: Troubleshooting Applications on Kubernetes
topics:
- Kubernetes
oldPath: "/content/guides/kubernetes/dev-workflow-troubleshooting.md"
aliases:
- "/guides/kubernetes/dev-workflow-troubleshooting"
level1: Managing and Operating Kubernetes
level2: Monitoring and Observing Kubernetes
---

This guide lists common commands and approaches to troubleshoot applications on
Kubernetes. In this guide we assume that:

* You are familiar with `kubectl`, the Kubernetes command-line client.
* You have access to the Kubernetes cluster you want to troubleshoot
* You are familiar with the common Kubernetes resources, such as Deployments,
  Services, Pods, etc.

Below is a list covering some common issues and how to troubleshoot them in a Kubernetes environment.

## Pods showing 'CrashLoopBackOff' status

This usually indicates an issue with the application. Use the `kubectl logs`
command to get logs from the pod.

If the pod has multiple containers, you first have to find the container that is
crashing.

Use the `kubectl describe` command on the pod to figure out which container is
crashing. The following example shows the list of containers in the `kubectl
describe` output. Notice how the `bad` container's last state is `Terminated`.
This is the container that keeps crashing.

```bash
Containers:
  bad:
    Container ID:  containerd://dd42e41890e04253915445...
    Image:         busybox
    Image ID:      docker.io/library/busybox@sha256:83...
    Port:          <none>
    Host Port:     <none>
    Args:
      sleep
      1
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Mon, 18 May 2020 10:47:03 -0400
      Finished:     Mon, 18 May 2020 10:47:04 -0400
    Ready:          False
    Restart Count:  3
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from 
      default-token-dfl9d (ro)
  good:
    Container ID:   containerd://8a8ce59842cce4d8c98f...
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:30...
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Mon, 18 May 2020 10:46:14 -0400
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from 
      default-token-dfl9d (ro)
```

## Services are unreachable or not available

As a sanity check, it is always useful to verify that the service has endpoints.

Use the `kubectl get endpoints` command to verify that a service has at least
one endpoint:

```bash
$ kubectl get endpoints example
NAME      ENDPOINTS                       AGE
example   10.244.0.21:80,10.244.0.22:80   27s
```

If the service does not have endpoints, verify the following:

* The service's pod selector matches the labels on the desired pods.
* The pods backing the service are passing their readiness probe.

For more in depth troubleshooting, you can utilize a dnsutil pod described [here](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)

## Pods showing 'Pending' status

If the pod is stuck in Pending state, this means that the pod cannot be
scheduled to a node. The most common cause of this issue is that there is no
node with enough resources to satisfy the pod's resource requests.

To diagnose this issue, use `kubectl describe` and look at the events at the
bottom of the output. The following is an example that shows what to look for:

```bash
$ kubectl describe pod example
### Output truncated for brevity
Events:
  Type     Reason            Age                From               Message
  ----     ------            ----               ----               -------
  Warning  FailedScheduling  17s (x2 over 17s)  default-scheduler  0/1 nodes are available: 1 Insufficient memory.
```

## Pods showing 'ContainerCreating' status

The most common causes for this issue are:

* Missing configmaps referenced in volume mounts
* Missing secrets referenced in volume mounts

To diagnose this issue, use `kubectl describe` on the pod and look at the events
at the bottom of the output. The following is an example that shows what to look
for:

```bash
$ kubectl describe pod example
### Output truncated for brevity
Events:
  Type     Reason       Age               From                         Message
  ----     ------       ----              ----                         -------
  Normal   Scheduled    10s               default-scheduler            Successfully assigned kube-system/example-796885bff7-cf7nc to kind-control-plane
  Warning  FailedMount  3s (x5 over 10s)  kubelet, kind-control-plane  MountVolume.SetUp failed for volume "foo" : secret "foo" not found
```

## Pods showing 'ErrImagePull' Pod status

The `ErrImagePull` condition means that the node is unable to pull the container
image from the container image registry (e.g. Harbor). Some potential causes of
this issue:

* The registry is unavailable or inaccessible from the node
* The container image does not exist in the registry
* The container image specified in the deployment manifest is incorrect

Use the `kubectl describe` command on the pod to troubleshoot this issue. The
events section at the bottom of the output should have useful context. The
following example shows what to look for:

```bash
$ kubectl describe pod example
### Output truncated for brevity
Events:
  Type     Reason     Age   From                         Message
  ----     ------     ----  ----                         -------
  Normal   Scheduled  11s   default-scheduler            Successfully assigned kube-system/example-7cc7c59cbb-4h6cv to kind-control-plane
  Normal   Pulling    11s   kubelet, kind-control-plane  Pulling image "non-existent"
  Warning  Failed     10s   kubelet, kind-control-plane  Failed to pull image "non-existent": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/non-existent:latest": failed to resolve reference "docker.io/library/non-existent:latest": pull access denied, repository does not exist or may require authorization: server message: insufficient_scope: authorization failed
  Warning  Failed     10s   kubelet, kind-control-plane  Error: ErrImagePull
  Normal   BackOff    10s   kubelet, kind-control-plane  Back-off pulling image "non-existent"
```

## Useful Commands

This section lists commands that are useful in day-to-day interactions with
Kubernetes:

### Listing resources

Use the `kubectl get` command to list resources of one or more types:

```bash
kubectl get deployments,pods
```

Specify the `wide` output format for additional information:

```bash
kubectl get pods -o wide
NAME                     READY   STATUS              RESTARTS   AGE   IP           NODE                 NOMINATED NODE   READINESS GATES
cassandra-0              0/1     ContainerCreating   0          47s   <none>       kind-control-plane   <none>           <none>
redis-5c7c978f78-wlbkn   1/1     Running             0          27s   10.244.0.6   kind-control-plane   <none>           <none>
```

Use the `--show-labels` to display the labels of resources

```bash
kubectl get pods --show-labels
NAME                     READY   STATUS              RESTARTS   AGE   LABELS
cassandra-0              0/1     ContainerCreating   0          98s   app=cassandra,chart=cassandra-5.4.2,controller-revision-hash=cassandra-6d7b4575f6,heritage=Helm,release=cassandra,statefulset.kubernetes.io/pod-name=cassandra-0
redis-5c7c978f78-wlbkn   1/1     Running             0          78s   pod-template-hash=5c7c978f78,run=redis
```

Use the `yaml` output format if you want to get the entire YAML definition of a
resource:

```bash
kubectl -n bow get deployment vendor-abstraction -o yaml
```

### Getting application logs

Use the `kubectl logs` command to get application logs.

```bash
kubectl -n bow logs <pod name>
```

To specify the container within the pod using the `-c` flag:

```bash
kubectl -n bow logs vendor-abstraction -c tag-blink-servce
```

Use the `-f` or `--follow` flag to follow/tail the logs.

### Forward local ports into a Pod

You can open forward local ports into the pod's network using `kubectl
port-forward`. With this command, you essentially open a network tunnel into the
pod.

For example, if you have a pod that listens on port 9090, you can forward your
local machines 8080 into the pod's port 9090 using the following command:

```bash
kubectl -n bow port-forward zuul-gateway 8080:9090
```

Once this command is running, you can access the pod's 9090 port via
`localhost:8080`.

### Exec into a running Pod

You can run commands within the context of your pod using `kubectl exec`. **Do
not use this to configure or modify application behavior at run time.**

For example, to run `ps -ef` in a container, you would run:

```bash
kubectl exec -it example-pod -- ps -ef
```

---
{{% callout %}}
**Note**: Keep in mind that the container must have the binary you are trying to execute
(`ps` in the above example). Otherwise, you will get an error.

Use [Ephemeral Containers (alpha)](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) if the binary is not available.
{{% /callout %}}

---

### Get the documentation of a specific resource kind

You can get the documentation of a specific resource kind (e.g. `Deployment` or
`Pod`) using `kubectl explain`. This command will fetch the API documentation of
the resource and display it in the terminal.

For example, to get the `Pod` documentation:

```bash
kubectl explain pod
```

You can drill into specific fields within the resource. For example, to the get
pod's `spec` field documentation:

```bash
kubectl explain pod.spec
```