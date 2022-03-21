---
date: '2022-02-23'
layout: single
team:
- David Wu
- Carlos Nunez
title: Kubernetes debugging workflow and techniques
weight: 10
tags:
- Debugging
- Kubernetes
---

A fundamental skill needed by all practitioners deploying to Kubernetes is
debugging issues as they arise on the Kubernetes Platform.  Issues can range
from application deployment issues, to Kubernetes system issues, or to network issues.
The problem is, what is a good starting point for debugging?

## What You Will Learn

In this section, you will learn:
- The general workflow and Kubernetes commands to debug an issue.
- How to access containers.
- How to access the Kubernetes nodes.

## Tools

To help solidify your learning, it is recommended that you learn
these commands, because they work on vanilla and a majority of Kubernetes releases. 
You can use the [Tanzu Community Edition
(TCE)](https://tanzu.vmware.com/tanzu/community) to stand up a local single 
node cluster on your laptop for learning purposes.

Note: A discussion about ephemeral debug containers is further in this section. It is
recommended that you use Kubernetes version 1.23 for the beta release of this feature,
enabled by default. If your Kubernetes versions is less than 1.23, you must manually 
enable this feature.

## The General Kubernetes Debugging Workflow and Techniques

The general workflow is to get the events, learn about the pod state,
then get the pod logs. If these steps do not provide sufficient information,
further steps are needed. For example, checking the application
configuration and network connectivity within a container.

1. Always run:

    ```sh
    kubectl get events -n <namespace> --sort-by .lastTimestamp [-w]
    ```
    
    This provides a list of events that occur in a namespace. The most 
  recent event is at the bottom of the list. Adding the optional `-w` flag 
  will allow the output to be watched. 

2. Run:

    ```sh
    kubectl describe pod/<pod-name> -n <namespace>
    ```

    to get more details of a pod. 

3. Run:

    ```sh
    kubectl logs <pod-name> -n <namespace> [name-of-container, if multiple] [-f]
    ```

    This gets logs from a pod. Adding the optional `-f` flag enables
tailing of the logs. Note that logs only work with the pod API, but you
can still selects a pod to get logs from a deployment/daemonset perspective. For example, 

    ```sh
    kubectl logs ds/<daemonset-name> -n <namespace> [name-of-container, if multiple] [-f]
    ```

    A useful command line tool is [stern](https://github.com/wercker/stern) because
it allows tailing of logs from multiple pods and containers. Stern can also
apply regular expressions to filter specific logs. [Kail](https://github.com/boz/kail) 
is another similar log helper tool. For most debugging purposes, try to limit the logging scope to avoid
cognitive overload that may distract you from finding the real problem.  

    If you cannot access the cluster, check the log aggregation
platform. For example, Splunk or ELK if they are setup. From the log
platforms, try searching by the node name/IP and/or components such as `kubelet`
and `kube-proxy`.  If the cluster is not accessible because `kubectl` commands
do not work, you must access the cluster nodes to find more details.  
See ["Accessing nodes"](#accessing-nodes) for more information.

4. If the cluster is still accessible and existing logs pinpoints to another
system issue, it is possible to access the pod container to perform tests such
as validating the state of a running process, it's configuration, or to check a
container's network connectivity. See ["Accessing containers"](#accessing-containers) 
for more information.

  The above is a good general workflow to start debugging. The documentation 
  on [Kubernetes Monitoring, Logging and Debugging](https://kubernetes.io/docs/tasks/debug-application-cluster/) 
  provides a good outline of other debugging approaches and techniques that could be
utilized. 

## Accessing Containers

The goal here is to access the container that an application is running on and
view log files and/or perform further debugging commands, such as validating
running configuration.  

The following are some techniques to get on containers.  

### Use `kubectl exec`

Accessing a container can be achieved through the `kubectl exec` command.
However, this may not be permitted on a cluster due to RBAC
permissions. To exec into a container, run:

```sh
kubectl exec -it -n <namespace> <pod-name> [-c <container-name>] "--" sh -c "clear; (bash || ash || sh)"
```

Note: The above exec command is from [Lens](https://k8slens.dev/). Using
tools like [Lens](https://k8slens.dev/), can make this a lot easier via a GUI. 

Sometimes there is no accessible shell. One other method is to
start a pod with a container having all the network debugging tools. The
[netshoot](https://github.com/nicolaka/netshoot) container image has a number of
tools that make it easy to debug network issues. You can instantiate a
netshoot container and exec into it to perform tests as follows,

```sh
kubectl run netshoot --image=nicolaka/netshoot && \
kubectl exec -it -n netshoot "--" sh -c "clear; (bash || ash || sh)"
```

However, this is a new pod that does not have access to a
target pod's filesystem. This approach is useful for debugging aspects such as
network connectivity. A deep dive of these aspects as classes is explored in
the next learning path on Heuristic Approach.

### Using Ephemeral Debug Containers

As discussed in the previous section, using `kubectl exec` may be insufficient
due to the target container having no shell, or if the container has already
crashed and is inaccessible. To overcome this, use a different image
deployed via `kubectl run`. This should be a different pod that is not sharing 
the process namespace of the pod of interest for debugging. This means you 
cannot access the process details or its filesystem in a different pod. To alleviate
this limitation, use debug ephemeral containers.

Introduced as an alpha in Kubernetes 1.16 and currently as a [beta in Kubernetes
1.23](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#ephemeralcontainer-v1-core),
ephemeral containers are helpful for troubleshooting issues. By default, the
`EphemeralContainer` feature-gate [is
enabled](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
as a beta in Kubernetes 1.23. Otherwise, you must enable the feature-gate first before it can be used. 
The documentation for [debug containers](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/#ephemeral-container)
use examples to demonstrate how to use `debug containers`. It is included as follows, along with content aligning to this
article.

Ephemeral containers are similar to regular containers. The difference is that they are
limited in functionality. For example, ephemeral containers have no restart capability, 
no ports, no scheduling guarantees, and no startup/liveness probes. To view a list of
limitations, see [What is an Ephemeral Container?](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/#what-is-an-ephemeral-container). 

Compared to what was previously done with `netshoot` and `kubectl exec`, the key
feature here is that an ephemeral container can be attached to a pod that you 
want to debug. For example, the target pod, by [sharing it's process
namespace](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/).
This means that it is possible to see a target debug a pod container's processes
and filesystem. There are a number of variations of the `kubectl debug`
command. Its usage depends on what is required for debugging. One
additional note to consider is that the debug containers continue to run
after exit and needs to be manually deleted. For example, `kubectl delete pod
<name-of-debug-pod>`.

#### The Target Container is Running, But Does Not Have a Shell

A no shell container means that it is not possible to add `kubectl exec` into a
container using a shell command, such as `sh` and `bash`.  For this scenario,
the follow command can be run:

```sh
kubectl debug <name-of-existing-pod> -it --image=nicolaka/netshoot --target=<name-of-container-in-existing-pod>
```

This utilizes the `netshoot` image, with all the network debugging utilities
as a separate ephemeral container running in the existing pod named
`<name-of-existing-pod>`. It also opens an interactive command prompt using
`-it`. `--target` lets you target the existing process namespace of the
other existing running container. This is usually the same name as the pod. 

#### The Target Container Has Crashed or Completed and/or Does Not Have a Shell

This scenario introduces the problem where a container has crashed or completed, 
and presents a problem with debugging because it is not possible to `kubectl
exec` because the container no longer exists. You can address this by making a
copy of the target pod attached with an ephemeral container to inspect its
process and filesystem. Use the following command.

```sh
kubectl debug <name-of-existing-pod> -it --image=nicolaka/netshoot --share-processes --copy-to==<new-name-of-existing-pod>
```

This creates a debug container using `netshoot`. The debug container shares the process
namespace in a new pod, named `<new-name-of-existing-pod>` as a copy of
`<name-of-existing-pod>`.

#### The Target Container Has Crashed or Completed, and the Container Start Command Needs to be Changed

This scenario is different from the previous one about the startup command change
because there is no additional debug ephemeral container. Instead, there is a copy 
of the target pod. This is particularly useful for situations where a target container
has crashed or ends immediately on startup. The goal is to interactively
tryout the process or review its filesystem. To do this, the startup
command requires a change that does not end the container, or a command 
that helps to provide more information. For example, changing the debug verbosity
parameter to an application, issuing a long sleep command, or run as a shell.
You can achieve this with the following command:

```sh
kubectl debug <name-of-existing-pod> -it --copy-to=<new-name-of-existing-pod> --container=<name-of-container-in-pod>  -- sh
```

Take note of the command specifier `-- sh`. The example changes the start
command to call the shell on the copied container. This may need to be replaced
with an appropriate start command that enables debugging of the pod.

#### The Target Container Needs to Utilize a Different Container Image

This scenario creates a copy of a target container with a different container
image. This is useful in situations where a production container may not contain
all the utilities that allow debugging, or does not have debug level outputs.
It is run with the follow command:

```sh
kubectl debug <name-of-existing-pod> --copy-to=<new-name-of-existing-pod> --set-image=*=nicolaka/netshoot
```

The difference is the parameter `--set-image=*=nicolaka/netshoot`,
which works the same way as `kubectl set image`, where it sets all
existing container images, specified by `*`, with the new image
`nicolaka/netshoot`.

## Accessing Nodes

The goal of accessing the nodes is to ascertain why a pod running on the node is
failing, or why a particular node is failing. Two areas that you can check are the
log files of the pods, and the process status of Kubernetes static pods and
services. You can also perform debugging commands, such as `netcat`, 
and `curl` to debug network connectivity issues if these tools exists within
the host.

To determine where the log files are located, it is recommended to check the
documentation of components to see which log files to access.
For most distributions of Kubernetes, log files can be found within
`/var/logs/`. For the containerd container runtime, `/var/logs/pods` holds pod
logs per namespace and container, and `/var/logs/containers` is a symlink of the
container logs in `/var/logs/pods`.

Key Kubernetes components, such as Kubelet and containerd (for containerd
container runtime), use `systemd` in most distributions to initialize Kubernetes
components. To retrieve logs so that you can inspect the journals of these components, 
run the following command:

   ```sh
   journalctl -u <name-of-component>
   ```

Usually, `<name-of-component>` is just `kubelet`. If that doesn't work, you can
find the `systemd` unit for kubelet by `grep`ing for `kubelet` inside of
`/etc/systemd/system`.

If the Kubernetes components were not started by `systemd`, use `lsof` against
the `kubelet` process to see where the logs are getting written to:

   ```sh
   pgrep -i kubelet | xargs lsof
   ```

In some Kubernetes distributions, the Kubernetes components run as Docker
containers. If they are not running in `systemd`, use `docker ps` or `crictl ps`
to check if this is the case.

Some Kubernetes distributions also configure the Kubernetes components to send
their logs to `syslog`, which is usually written to `/var/log/messages`.

### Different Ways to Get on a Node

For readers unfamiliar with how to access nodes, this section describes three methods 
of how to get on a node.

1. Use SSH.

    SSH access is performed via SSH keys. To access the nodes via SSH keys, 
    run the following command:

    ```sh
    ssh -i <certificate.pem> <username>@<ip/fqdn of node>
    ```

    If only password access is setup, you can SSH with the following command.

    ```sh
    ssh <username>@<ip/fqdn of node>
    ```

    and enter the password thereafter, when prompted. 

2. Accessing the nodes via `kubectl exec`.

    If the RBAC permits and with privileged container permissions, it is possible to
    mount a node's log as a hostpath into a pod, and inspect those logs after
    `kubectl exec`'ing into a container. The following yaml creates a
    debugging pod to help with this:

    ```sh
    kubectl apply -f - <<-EOF
    apiVersion: v1
    kind: Deployment
    metadata:
      name: debugging
      labels:
        app: debugging
    spec:
      template:
        metadata:
          labels:
            app: debugging
        spec:
          containers:
          - image: nicolaka/netshoot
            volumeMounts:
            - mountPath: /node-logs
              name: node-logs
          volumes:
          - name: node-logs
            hostPath:
              directory: /var/logs
              type: Directory
    EOF
    ```

3. Debugging nodes use ephemeral debug containers.

    In addition to the other use cases of debug containers, it is also possible
    to create an ephemeral privileged container on a target node of interest
    with its filesystem mounted at `/host`. Ephemeral debug containers
    opens access to the node's host filesystem, its network, and process
    namespace. This is run with an interactive shell using the following
    command:

    ```sh
    kubectl debug node/<name-of-node> -it --image=nicolaka/netshoot
    ```
