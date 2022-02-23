---
date: '2022-02-23'
layout: single
team:
- David Wu
- Carlos Nunez
title: Kubernetes debugging workflow and techniques
weight: 10
tags:
- Debugging techniques
- Kubernetes
---

A fundamental skill needed by all practitioners deploying to Kubernetes is
debugging issues as they arise on the Kubernetes Platform.  Issues can range
from application deployment issues, Kubernetes system issues to network issues.
The problem is, what is a good starting point for debugging?

## What you will learn

In this section, you will learn to:
- The general workflow and Kubernetes commands to debug an issue
- How to access containers
- How to access the Kubernetes nodes

## Tools

Readers are encouraged to try these commands to help solidify their learning.
These commands work on vanilla and a majority of Kubernetes releases.   For the
interested reader, the [Tanzu Community Edition
(TCE)](https://tanzu.vmware.com/tanzu/community) can be used. TCE can be used to
stand up a local single node cluster on your laptop for learning purposes.

Note: We will introduce ephemeral debug containers later in this section. It is
recommended to use Kubernetes version 1.23 for the beta release of this feature,
which is enabled by default. Other Kubernetes version less than 1.23 will need
to manually enable this feature. More details are provided in the ephemeral
debug container section.

## The general Kubernetes debugging workflow and techniques
The general workflow is to first dive into the events, learn about the pod state
and dive into the logs. If these steps do not provide sufficient information,
further steps would be needed. For example, checking the application
configuration and network connectivity within a container.

1. Always run:
    ```sh
    kubectl get events -n <namespace> --sort-by .lastTimestamp [-w]
    ```
    
    This will provide a list of events that have occurred in a namespace ordered
with the most recent event at the bottom of the list. Adding the optional `-w`
flag will allow the output to be watched. 

2. Run:
    ```sh
      kubectl describe pod/<pod-name> -n <namespace>
    ```
    to get more details of a pod. 

3. Run:
    ```sh
      kubectl logs <pod-name> -n <namespace> [name-of-container, if multiple] [-f]
    ```

    This will get the logs from a pod. Adding the optional `-f` flag enables
tailing of the logs.  Note that logs only works with the pod API but it is
possible to do logs from a deployment/daemonset perspective, which will simply
pick a pod to get logs from. For example, 

    ```sh
      kubectl logs ds/<daemonset-name> -n <namespace> [name-of-container, if multiple] [-f]
    ```

    A useful commandline tool is [stern](https://github.com/wercker/stern),
which allows tailing of logs from multiple pods and containers. Stern can also
apply regular expressions to filter specific logs. Alternatively,
[kail](https://github.com/boz/kail) is another similar log helper tool. However,
for most debugging purposes, do try to limit the logging scope to avoid
cognitive overload that may distract from finding the real problem.  

    If it is not possible to access the cluster, check the log aggregation
platform such as Splunk, ELK and so forth, if this is setup. Within the log
platforms, try searching by the node name/ip and/or components such as `kubelet`
and `kube-proxy`.  If the cluster is not accessible, that is, `kubectl` commands
do not work, the cluster nodes will need to be accessed in order to find more
details.  Details on how to do this are discussed in ["Accessing and debugging
nodes"](#accessing-and-debugging-nodes).

4. If the cluster is still accessible and existing logs pinpoints to another
system issue, it is possible to access the pod container to perform tests such
as validating the state of a running process, it's configuration or to check a
container's network connectivity. This is visited in detail in ["Accessing
containers"](#accessing-containers).

Keep in mind the above is a good general workflow to start debugging. The
documentation on [Kubernetes Monitoring, Logging and
Debugging](https://kubernetes.io/docs/tasks/debug-application-cluster/) provides
a good outline of other debugging approaches and techniques that could be
utilized. 

## Accessing containers

The goal here is to access the container that an application is running on and
view log files and/or perform further debugging commands, such as validating
running configuration.  Listed below are some possible techniques to get on
containers.  

### __Using `kubectl exec`__
Accessing a container can be achieved through the `kubectl exec` command.
However, be aware that this may also not be permitted on a cluster due to RBAC
permissions. To exec into a container, run:

```sh
kubectl exec -it -n <namespace> <pod-name> [-c <container-name>] "--" sh -c "clear; (bash || ash || sh)"
```

Note: The above exec command was taken from [Lens](https://k8slens.dev/). Using
tools like [Lens](https://k8slens.dev/), can make this a lot easier via a GUI. 

Do note that sometimes there is no accessible shell.  One other method is to
start a pod with a container having all the network debugging tools. The
[netshoot](https://github.com/nicolaka/netshoot) container image has a number of
tools that will make it easy to debug networking issues, one can instantiate a
netshoot container and exec into it to perform tests as follows,

```sh
kubectl run netshoot --image=nicolaka/netshoot && \
kubectl exec -it -n netshoot "--" sh -c "clear; (bash || ash || sh)"
```

However, note that this is a new pod and itself would not have access to a
target pod's filesystem.  This approach is useful for debugging aspects such as
network connectivity. A deep dive of these aspects as classes is explored in
[Section 2](#section-2---a-heuristic-approach).

### __Using ephemeral debug containers__

As realized in the previous section, using `kubectl exec` may be insufficient
due to the target container having no shell or that the container has already
crashed and is inaccessible.  One could overcome this using a different image
deployed via `kubectl run`, however, this would be a different pod that is not
sharing the process namespace of the pod of interest for debugging, meaning that
one cannot access the process details or its filesystem in a different pod. This
limitation can be alleviated using debug ephemeral containers.

Introduced as an alpha in Kubernetes 1.16 and currently as a [beta in Kubernetes
1.23](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#ephemeralcontainer-v1-core),
ephemeral containers are helpful for troubleshooting issues. By default, the
`EphemeralContainer` feature-gate [is
enabled](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
as a beta in Kubernetes 1.23. Otherwise, the feature-gate will need to be
enabled first before it can be used. The documentation for [debug
containers](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/#ephemeral-container),
demonstrate with examples of how to use `debug containers` but for brevity and
completeness sake, this is included below together with content aligning to this
article.

Ephemeral containers are similar to regular containers, except that they are
limited in functionality. For example, having no restart capability, no ports,
no scheduling guarantees and no startup/liveness probes. A list of its
limitations is documented
[here](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/#what-is-an-ephemeral-container). 

Compared to what was previously done with `netshoot` and `kubectl exec`, the key
feature here is that an ephemeral container can be attached to a pod that one
wishes to debug, that is, the target pod, by [sharing it's process
namespace](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/).
This means that it is possible to see a target debug pod container's processes
and it's filesystem. There are a number of variations of the `kubectl debug`
command and its usage varies depending on what is required for debugging. One
additional note to consider is that these debug containers will remain running
after exit and needs to be manually deleted, for example, `kubectl delete pod
<name-of-debug-pod>`.

#### __The target container is running but does not have a shell__:

A no shell container means that it is not possible `kubectl exec` into a
container using a shell command, such as `sh` and `bash`.  For this scenario,
the follow command can be run:

```sh
kubectl debug <name-of-existing-pod> -it --image=nicolaka/netshoot --target=<name-of-container-in-existing-pod>
```

This will utilize the `netshoot` image, with all the network debugging utilities
as a separate ephemeral container running in the existing pod named
`<name-of-existing-pod>` and opens an interactive command prompt through using
`-it`. `--target` is a means of targeting the existing process namespace of the
other existing running container.  This is usually the same name as the pod
itself. 

#### __The target container has crashed or completed and/or does not have a shell__:

This scenario introduces the problem where a container has crashed or completed.
This presents a problem with debugging because it is not possible to `kubectl
exec`, since the container no longer exists. This can be addressed by making a
copy of that target pod attached with an ephemeral container to inspect its
process and filesystem. The following command can be used for this:

```sh
kubectl debug <name-of-existing-pod> -it --image=nicolaka/netshoot --share-processes --copy-to==<new-name-of-existing-pod>
```

This will create a debug container using `netshoot`, which shares the process
namespace in a new pod, named `<new-name-of-existing-pod>` as a copy of
`<name-of-existing-pod>`.

#### __The target container has crashed or completed and the container start command needs to be changed__:

This scenario differs from the previous with having the startup command changed
and there is no additional debug ephemeral container but instead a copy of the
target pod.  This is particular useful for situations where a target container
has crashed or ends immediately on startup and the goal is to interactively
tryout the process or review it's filesystem. In order to do this, the startup
command would require a change such that it does not end the container or that
the command helps provide more information, e.g. changing the debug verbosity
parameter to an application, issue some long sleep command or run as a shell.
One can achieve this with the following command:

```sh
kubectl debug <name-of-existing-pod> -it --copy-to=<new-name-of-existing-pod> --container=<name-of-container-in-pod>  -- sh
```

Take note of the command specifier `-- sh`. The example here changes the start
command to call the shell on the copied container. This may need to be replaced
with an appropriate start command that would enable debugging of the pod.

#### __The target container needs to utilize a different container image__:

This scenario creates a copy of a target container having a different container
image. This is useful in situations where a production container may not contain
all the utilities that allow debugging or does not have debug level outputs.
This again makes a copy of the target pod and is run with the follow command:

```sh
kubectl debug <name-of-existing-pod> --copy-to=<new-name-of-existing-pod> --set-image=*=nicolaka/netshoot
```

The one difference here is the parameter `--set-image=*=nicolaka/netshoot`,
which works in the same fashion as `kubectl set image`, where it sets all
existing container images, specified by `*`, with the new image
`nicolaka/netshoot`.

## Accessing nodes

The goal of accessing the nodes is to ascertain why a pod running on the node is
failing or why a node is failing itself.  Two areas that can be checked are the
log files of those pods and process status of Kubernetes static pods and
services. Alternatively, one could perform debugging commands, such as `netcat`
and `curl` to debug network connectivity issues, if these tools exists within
the host.

To determine where the log files are located, it is recommended to check the
documentation of components to see which log files contain the logs of
  interests. For most distributions of Kubernetes, log files can be found within
`/var/logs/`. For the containerd container runtime, `/var/logs/pods` holds pod
logs per namespace and container and `/var/logs/containers` is a symlink of the
container logs in `/var/logs/pods`.

Key Kubernetes components, such as Kubelet and containerd (for containerd
container runtime), use `systemd` in most distributions to initialize Kubernetes
components. Inspection of journals of these respective components to retrieve
their logs can be done by,

   ```sh
   journalctl -u <name-of-component>
   ```

Usually, `<name-of-component>` is just `kubelet`. If that doesn't work, one can
find the `systemd` unit for kubelet by `grep`ing for `kubelet` inside of
`/etc/systemd/system`.

If the Kubernetes components were not started by `systemd`, use `lsof` against
the `kubelet` process to see where the logs might be getting written to:

   ```sh
   pgrep -i kubelet | xargs lsof
   ```

In some Kubernetes distributions, the Kubernetes components run as Docker
containers. If they are not running in `systemd`, use `docker ps` or `crictl ps`
to check if this is the case.

Some Kubernetes distributions also configure the Kubernetes components to send
their logs to `syslog`, which is usually written to `/var/log/messages`.

### Different ways to get on a node

Described previously was where to find information on a node needed in order to
debug an issue on the node.  For readers unfamiliar with how to access nodes,
this sub-section will describe three methods of how to get on a node.

1) __Using SSH__:

    Generally, SSH access is, in best practice, performed via SSH keys. Access
    to nodes via SSH keys is performed via the command, 

    ```sh
    ssh -i <certificate.pem> <username>@<ip/fqdn of node>
    ```

    If only password access is setup, one can SSH with command

    ```sh
    ssh <username>@<ip/fqdn of node>
    ```

    and enter the password thereafter, when prompted. 

2) __Accessing the nodes via `kubectl exec`__:

    If the RBAC permits and privileged container permissions, it is possible to
    mount a node's log as a hostpath into a pod and inspect those logs after
    `kubectl exec`'ing into a container.  The following yaml will create a
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

3) __Debugging nodes using ephemeral debug containers__:

    In addition to the other uses cases of debug containers, it is also possible
    to create an ephemeral privileged container on a target node of interest
    with it's filesystem mounted at `/host`. Using ephemeral debug containers
    opens access to the node's host filesystem, it's network and process
    namespace. This is run with an interactive shell, with the following
    command:

    ```sh
    kubectl debug node/<name-of-node> -it --image=nicolaka/netshoot
    ```
