---
date: '2021-02-16'
lastmod: '2021-02-26'
parent: Application Enhancements
tags:
- Kubernetes
team:
- John Harris
title: Graceful Shutdown
oldPath: "/content/guides/kubernetes/app-enhancements-graceful-shutdown.md"
aliases:
- "/guides/kubernetes/app-enhancements-graceful-shutdown"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Throughout the lifecycle of an application, running pods are terminated due to
multiple reasons. In some cases, Kubernetes terminates pods due to user input
(when updating or deleting a deployment, for example). In others, Kubernetes
terminates pods because it needs to free resources on a given node. Regardless
of the scenario, Kubernetes allows the containers running in a pod to shutdown
gracefully within a configurable period.

## Pod Shutdown Scenarios

The following diagrams depict the possible pod shutdown scenarios.

### Graceful Shutdown

In this scenario, the containers within the pod shut down gracefully within the
grace period. The "graceful shutdown" state for the containers represents the
execution of an optional pre-stop hook and PID 1 responding to the SIGTERM
signal. Once the containers exit successfully, the Kubelet deletes the pod from
the API server.

![Graceful Shutdown Success](images/graceful_shutdown_success.png#diagram)

### Forceful Shutdown

In this scenario, the containers fail to shutdown within the grace period.
Failure to shutdown could be due to multiple reasons, including 1) the
application ignoring the SIGTERM signal, 2) the pre-stop hook taking longer than
the grace period, 3) the application taking longer than the grace period to
clean up resources, or 4) a combination of the above.

When the application fails to shutdown within the grace period, the Kubelet
sends a SIGKILL signal to forcefully shutdown the processes running in the pod.
Depending on the application, this can result in data loss and user-facing
errors.

![Graceful Shutdown Failure](images/graceful_shutdown_failure.png#diagram)

## Forceful Deletion Using Kubectl

Pod deletion involves coordination between the API server and the Kubelet. When
a pod deletion is requested, the pod is marked for deletion in the API and the
Kubelet stops the pod. Once stopped, the Kubelet deletes the pod object from the
cluster state.

In addition to the above flow, Kubernetes exposes a mechanism to forcefully
delete a pod from the cluster via the API. The forceful deletion is typically
achieved using the `kubectl delete pod --force --grace-period=0` command.

Forceful deletion should be avoided, as there is no guarantee that the pod will
be terminated. Furthermore. the user has no visibility of this problem via the
API server (using `kubectl` commands) and would have to log into the node to
manually clean up the process.

![Graceful Shutdown Zombie](images/graceful_shutdown_zombie.png#diagram)

{{% aside title="Note" %}}
While technically possible, it is unlikely you will end up with a zombie process
after forcefully deleting a pod.
{{% /aside %}}

## Shutting Down Gracefully

### Handle the SIGTERM Signal

The top-most process, or PID 1 process, must configure signal handlers to handle
the SIGTERM signal. By doing so, the application can perform any necessary
cleanup before shutting down.

The following code snippet shows how to handle the SIGTERM signal in a Go process.

```go
func main() {
    // App initialization code here...
    serverErrors := make(chan error, 1)
    server := app.NewServer(serverErrors)

    // Make a channel to listen for an interrupt or terminate signal from the OS.
    // Use a buffered channel because the signal package requires it.
    shutdown := make(chan os.Signal, 1)
    signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

    // Start the application and listen for errors
    go server.ListenAndServe()

    // Wait for a server error or shutdown signal
    select {
        case err := <-serverErrors:
            log.Fatalln("server error", err)

        case sig := <-shutdown:
            server.Shutdown()
    }
}
```

How you capture and handle Linux signals depends on your language and runtime.

### Configure the Graceful Shutdown Period

The graceful shutdown period is defined at the pod level using the
`terminationGracePeriodSeconds` field. If not specified, the period defaults to
30 seconds.

The following YAML snippet shows how to set the grace period to 60 seconds.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  terminationGracePeriodSeconds: 60
  containers:
  - image: nginx
    name: nginx
```

### Implement a Pre-stop Hook

If your application requires a separate process or script to be run, or an HTTP
endpoint to be called, you can configure a pre-stop hook in your pod manifest.
The Kubelet executes the pre-stop hook within the container's namespace before
sending the SIGTERM signal to the application.

The following YAML snippet shows how to configure a pre-stop hook that runs a
script called `pre-stop.sh`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
    lifecycle:
      preStop:
        exec:
          command: ["/pre-stop.sh"]
```