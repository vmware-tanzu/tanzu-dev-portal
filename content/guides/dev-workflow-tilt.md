---
date: '2021-02-09'
description: Implement a tilt-based development workflow for Kubernetes.
lastmod: '2021-02-09'
linkTitle: Getting Started with Tilt
parent: Developer Workflow
tags:
- Tilt
- Kubernetes
team:
- John Harris
title: Getting Started with Tilt
oldPath: "/content/guides/kubernetes/dev-workflow-tilt.md"
aliases:
- "/guides/kubernetes/dev-workflow-tilt"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

When developing applications to be deployed on Kubernetes, additional steps are
needed during the development workflow. Source code must be packaged into a
container and deployed to a respective test environment. A common workflow is
outlined below.

1. Save changes in code editor
2. Build and tag Docker image

    ```shell
    docker build -t <repository_name>/<image_name>:<tag> .
    ```

3. Push Docker image to registry

    ```shell
    docker push <repository_name>/<image_name>:<tag>
    ```

4. Re-deploy Kubernetes manifests

    ```shell
    kubectl delete -f deployment.yaml
    kubectl apply -f deployment.yaml
    ```

5. Run commands to observe changes in test environment

    ```shell
    kubectl describe pod <pod_name>
    kubectl logs <pod_name>
    kubectl port-forward deployment/<deployment_name> 8080:8080
    curl localhost:8080
    ```

This workflow represents the "inner-loop" of development in a cloud-native
application. More specifically, these are actions performed many times by a
developer in between committing, merging, and testing code in a CI/CD pipeline.
The goal of Tilt is to automate the inner-loop and make the development and
debugging of cloud-native applications seamless. With Tilt configured, the
developer's inner-loop is simplified to:

1. Save changes in code editor
2. View logs and errors of deployed code in UI

This guide walks you through getting started with Tilt in your development
environment.

## Prerequisites

[Tilt](https://docs.tilt.dev/install.html) is the only binary required on your
local machine for this guide. You will also need access to a running Kubernetes
cluster. If you would like to run Kubernetes locally, VMware recommends using
[Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) and
[Docker](https://docs.docker.com/install/).

## Getting Started

Below is an example directory structure for a "Hello World" application written
in Go. If you wish to follow along in your own environment, replicate the
following directory structure and copy the respective code to each file.

```shell
hello-world/
│   main.go
│   Dockerfile
│   deployment.yaml
│   imagePullSecret.yaml
```

NOTE: The following Go application is modified from the Ardanlabs [public
repository](https://github.com/ardanlabs/service-training/tree/master/03-json).

```go
// Source: main.go
package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func main() {

    // ===================================================================
    // App Starting
    log.Printf("main : Started")
    defer log.Println("main : Completed")
    // ===================================================================
    // Start HTTP server
    api := http.Server{
        Addr:         "localhost:8080",
        Handler:      http.HandlerFunc(ResponseHandler),
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 5 * time.Second,
    }
    // Make a channel to listen for errors coming from the listener. 
    // Use a buffered channel so the goroutine can exit if we don't 
    // collect this error.
    serverErrors := make(chan error, 1)
    // Start the service listening for requests.
    go func() {
        log.Printf("main : API listening on %s", api.Addr)
        serverErrors <- api.ListenAndServe()
    }()
    // Make a channel to listen for an interrupt or terminate signal 
    // from the OS. Use a buffered channel because the signal package 
    // requires it.
    shutdown := make(chan os.Signal, 1)
    signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)
    // ===================================================================
    // Shutdown
    // Blocking main thread and waiting for shutdown.
    select {
    case err := <-serverErrors:
        log.Fatalf("error: listening and serving: %s", err)
    case <-shutdown:
        log.Println("main : Start shutdown")
        // Give outstanding requests a deadline for completion.
        const timeout = 5 * time.Second
        ctx, cancel := context.WithTimeout(context.Background(), timeout)
        defer cancel()
        // Asking listener to shutdown and load shed.
        err := api.Shutdown(ctx)
        if err != nil {
            log.Printf(
                "main : Graceful shutdown did not complete in %v : %v", 
                timeout, err)
            err = api.Close()
        }
        if err != nil {
            log.Fatalf(
                "main : could not stop server gracefully : %v", 
                err)
        }
    }
}

type Response struct {
    Message string `json:"message"`
}

// ResponseHandler is an HTTP Handler for returning a message.
func ResponseHandler(w http.ResponseWriter, r *http.Request) {

    responseJson := Response{"Hello, World!"}

    data, err := json.Marshal(responseJson)
    if err != nil {
        log.Println("error marshalling result", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(http.StatusOK)
    if _, err := w.Write(data); err != nil {
        log.Println("error writing result", err)
    }
}
```

```Dockerfile
# Source: Dockerfile
# ================
# BUILD STAGE
# ================
FROM docker.io/library/golang:1.13.5 as build
WORKDIR /app
COPY . /app/
RUN CGO_ENABLED=0 go build -o /go/bin/hello-world main.go

# ================
# RUNTIME STAGE
# ================
FROM gcr.io/distroless/static
WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /go/bin/hello-world /app/hello-world

EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/hello-world"]
```

```yaml
# Source: deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  selector:
    matchLabels:
      app: hello-world
  replicas: 1
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      imagePullSecrets:
        # Reference the Secret described in the .yaml found below
        - name: regcred 
      containers:
      - name: hello-world
        image: hub.docker.com/example_repository/hello-world
        imagePullPolicy: Always
        ports:
        - name: hello-world
          containerPort: 8080
        resources: {}
```

During development, you will likely use a personal or shared image repository
that Kubernetes pulls images from. The following `.yaml` object describes an
[_image pull secret_](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/),
which is a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/)
object that Kubernetes relies on to authenticate with a Docker image registry.

```yaml
# Source: imagePullSecret.yaml
---
apiVersion: v1
data:
  .dockerconfigjson: <B64_ENCODED_CREDENTIALS>
kind: Secret
metadata:
  creationTimestamp: null
  name: regcred
type: kubernetes.io/dockerconfigjson
```

This secret object can be automatically created in Kubernetes with the following
command:

```shell
kubectl create secret docker-registry regcred \
        --docker-server=<your-registry-server> \
        --docker-username=<your-name> \
        --docker-password=<your-pword> \
        --docker-email=<your-email>
```

## Basic Tilt Configuration

Configure tilt by adding the following two files:

```json
// tilt_option.json
{
  "default_registry": "hub.docker.com/example_repository"
}
```

```python
# Tiltfile
# Import options from .json file
settings = read_json('tilt_option.json', default={})
# Configure Tilt registry from imported settings
default_registry(settings.get('default_registry'))

# Specify which Kubernetes object manages the in-development container image
k8s_yaml('deployment.yaml')
# Specify name of the in-development container image and its build directory
docker_build('hello-world','.')
# Specify name of k8s resource for Tilt to be aware of, and which ports should
# be forwarded to local machine
k8s_resource('hello-world', port_forwards=9000)
```

It is possible to configure your `default_registry` in your Tiltfile, but
VMware recommends keeping configuration in a separate file to simplify
on-boarding for developers.

Your directory structure should now look like this:

```shell
hello-world/
│   main.go
│   Dockerfile
│   deployment.yaml
│   imagePullSecret.yaml
│   Tiltfile
│   tilt_option.json
```

## Inner-Loop After Configuring Tilt

With tilt configuration in place, run `tilt up` to start Tilt. Once Tilt begins
running, the following will happen.

1. The specified Docker image will be built and tagged.
2. The specified Kubernetes `.yaml` file will be deployed to whichever cluster
   your $KUBECONFIG specifies.
3. The specified port-forwards will be set up on your local machine and managed
   by Tilt.
4. A text user-interface will take over the terminal in which `tilt up` was run.
   This UI will display information regarding the build and deploy processes,
   logs related to your in-development container image, and relevant errors.
5. A tab in your web browser will open with the same information described in
   step 4. Use whichever display you prefer.
6. Any changes made to files that Tilt is aware of will trigger steps 2-5 to be
   performed. This is how Tilt keeps your development environment in-sync with
   changes made in your local development environment.

For advanced usage of Tilt, refer to the [documentation.](https://docs.tilt.dev/)