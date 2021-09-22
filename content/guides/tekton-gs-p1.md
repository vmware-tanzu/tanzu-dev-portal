---
date: '2020-06-15'
description: Walk through the set up and installation of Tekton, a set of open source
  Kubernetes resources to build and run CI/CD pipelines.
lastmod: '2021-03-07'
linkTitle: Getting Started with Tekton
metaTitle: Getting Started with Tekton
parent: Tekton
patterns:
- Deployment
tags:
- CI-CD
- Tekton
team:
- Brian McClain
title: 'Getting Started with Tekton Part 1: Hello World'
weight: 1
oldPath: "/content/guides/ci-cd/tekton-gs-p1.md"
aliases:
- "/guides/ci-cd/tekton-gs-p1"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

[Tekton](https://github.com/tektoncd/pipeline) provides a set of open source Kubernetes resources to build and run [CI/CD](/guides/ci-cd/ci-cd-what-is/) pipelines, such as parameterized tasks, inputs and outputs, as well as runtime definitions. This guide will walk you through setting up Tekton on Minikube as well as setting up your first task.

## Before You Begin

There's just a few things you'll need before you get started:

- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/): Tekton runs on Kubernetes, so to keep things simple, this guide will assume you're using Minikube to get up and running quickly
- A [Docker Hub](https://hub.docker.com/) account: You'll use this registry to push up container images built from your pipelines.
- The [Tekton CLI](https://github.com/tektoncd/cli)

## Setting Up Tekton

While Tekton can run on any Kubernetes cluster, this guide assumes you will be using Minikube. If you'd prefer to run Tekton differently, make sure to reference the [Installation Guide](https://github.com/tektoncd/pipeline/blob/master/docs/install.md).

First, create a Minikube cluster with 4GB of memory and 10GB of storage:

```bash
minikube start --memory=4096 --disk-size=10g
```

Once your Minikube environment is created, you can install Tekton by applying the YAML from the [latest release](https://github.com/tektoncd/pipeline/releases):

## Install Tekton
```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
```

You can monitor the progress of the install by watching the pods in the newly created `tekton-pipelines` namespace:

```bash
kubectl get pods --namespace tekton-pipelines --watch
```

Once the install is complete, you'll see two newly created pods: 

```bash
tekton-pipelines-webhook-69796f78cf-b28z4      1/1     Running             0          9s
tekton-pipelines-controller-6d55778887-df59t   1/1     Running             0          13s
```

Finally, in a couple of the examples, you'll be pushing container images to Docker Hub. Create a secret that Tekton can use to log in to Docker Hub. Substitute the placeholder values with your own:

```bash
kubectl create secret docker-registry dockercreds --docker-server=https://index.docker.io/v1/ --docker-username=<DOCKERHUB_USERNAME> --docker-password=<DOCKERHUB_PASSWORD> --docker-email <DOCKERHUB_EMAIL>
```


## Create Your Own Task

What better place to start than with a good 'ole "Hello World" example? For this example, you'll start with the most basic building block of a pipeline: a task. This task will simply start up a container, write "Hello World", and end:

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: echo-hello-world
spec:
  steps:
    - name: echo
      image: ubuntu
      command:
        - echo
      args:
        - "Hello World"
```

Take a moment to digest this part. While a `task` can become much more complex, this specific task has no inputs, no outputs, and just a single step. That step (named `echo`) uses the [Ubuntu image from Docker Hub](https://hub.docker.com/_/ubuntu), and executes the following command:

`echo "Hello World"`

Tekton automatically stores the output of all tasks that are run, so even though the container that will run these tasks will quickly go away, you can reference the results of that task after the fact.

However, in order to actually run the task, you need to create one more resource, a `TaskRun`. This resource defines how to run specific tasks. Consider the following for this example:

```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: echo-hello-world-task-run
spec:
  taskRef:
    name: echo-hello-world
```

Again, keeping the example as simple as possible, `TaskRun` definitions **could** fill in any parameters required by a task, but in this case, since the task that is being run takes no parameters, this resource only defines the task that it is going to run: `echo-hello-world`.

As with any Kubernetes custom resources definition (CRD), this can all be done in one file, which you can find on [GitHub](https://github.com/BrianMMcClain/tekton-examples/blob/main/hello-task.yml), and use to apply these two examples directly:

```bash
kubectl apply -f https://raw.githubusercontent.com/BrianMMcClain/tekton-examples/main/hello-task.yml
```

If you run `kubectl get pods` — even if you do so quickly — you'll likely see this task already completed:

```bash
NAME                                  READY   STATUS      RESTARTS   AGE
echo-hello-world-task-run-pod-vm6f5   0/1     Completed   0          12s
```

But as previously mentioned, Tekton stores the results of a `TaskRun`, and that's where the [Tekton CLI](https://github.com/tektoncd/cli) comes in. First, check out Tekton's description of your `TaskRun`:

```bash
tkn taskrun describe echo-hello-world-task-run
```

```bash
Name:        echo-hello-world-task-run
Namespace:   default
Task Ref:    echo-hello-world
Timeout:     1h0m0s
Labels:
 app.kubernetes.io/managed-by=tekton-pipelines
 tekton.dev/task=echo-hello-world

🌡️  Status

STARTED          DURATION    STATUS
10 minutes ago   7 seconds   Succeeded

📨 Input Resources

 No input resources

📡 Output Resources

 No output resources

⚓ Params

 No params

🦶 Steps

 NAME     STATUS
 ∙ echo   ---

🚗 Sidecars

No sidecars
```

Since the task has no inputs, outputs, or resources, the above is a bit bare. What's important is that the `Status` is set to `Succeeded`. Great! Next, take a look at the output of that `TaskRun`:

```bash
tkn taskrun logs echo-hello-world-task-run
```

```bash
[echo] Hello World
```

Just as you would expect, the output of the `echo` task was "Hello World".

## Keep Learning

In [part two of this guide](/guides/ci-cd/tekton-gs-p2/), you'll learn about inputs into and outputs from tasks, as well as how you can use Cloud Native Buildpacks with Tekton. If you want to dive deeper into what has already been covered, give the [official documentation](https://github.com/tektoncd/pipeline#-tekton-pipelines) a read to learn more!
