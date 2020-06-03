---
title:  "Tekton: Getting Started - Part 1"
sortTitle: "Tekton 1"
weight: 2
topics:
- CI-CD
tags:
- CI-CD
- Tekton
patterns:
- Deployment
team:
- Brian McClain
---

[Tekton](https://github.com/tektoncd/pipeline) provides a set of open-source Kubernetes resources to build and run [CI/CD](/guides/ci-cd/ci-cd-what-is/) pipelines, such as parameterized tasks, inputs and outputs, as well as runtime definitions. This guide will walk you through setting up Tekton on Minikube as well as setting up your first task.

## Before You Begin

There's just a few things you'll need before you get started:

- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/): Tekton runs on Kubernetes, so to keep things simple, this guide will assume you're using Minikube to get up and running quickly
- A [Docker Hub](https://hub.docker.com/) account: You'll use this registry to push up container images built from your pipelines.
- The [Tekton CLI](https://github.com/tektoncd/cli)

## Setting Up Tekton

While Tekton can run on any Kubernetes cluster, this guide will walk through with the assumption that you will be using Minikube. If you'd prefer to run Tekton differently, make sure to reference the [Installation Guide](https://github.com/tektoncd/pipeline/blob/master/docs/install.md).

First, create a Minikube cluster with 4GB of memory and 10GB of storage:

```bash
minikube start --memory=4096 --disk-size=10g
```

Once your Minikube environment is created, you can install Tekton by applying the YAML from the [latest release](https://github.com/tektoncd/pipeline/releases):

Install Tekton
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

Finally, in a couple of the examples, you'll be pushing up container images to Docker Hub, so create a secret that Tekton can use to log into Docker Hub with, substituting the placeholder values with your own:

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

Take a moment to digest this a bit. While a `task` can become much more complex than this, this specific task has no inputs, no outputs, and just a single step. That step (named `echo`) uses the [Ubuntu image from Docker Hub](https://hub.docker.com/_/ubuntu), and executes the following command:

`echo "Hello World"`

Tekton automatically stores logs of all tasks that are ran, so even though the container that will run this will tasks will quickly go away, you can reference the results of that task after the fact.

In order to actually run this task though, you need to create one more resource, a `TaskRun`. `TaskRun` resources define how to run specific tasks. Consider the following for this example:

```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: echo-hello-world-task-run
spec:
  taskRef:
    name: echo-hello-world
```

Again, keeping the example as simple as possible, `TaskRun` definitions _could_ fill in any parameters required by a `Task`, but in this case since the tasks to run takes no parameters, it simply refers to it by name: `echo-hello-world`.

As with any Kubernetes CRD, this can all be defined in one file, which you can find all put together on [GitHub](https://github.com/BrianMMcClain/tekton-examples/blob/master/hello-task.yml), and use to apply these two examples directly:

```bash
kubectl apply -f https://raw.githubusercontent.com/BrianMMcClain/tekton-examples/master/hello-task.yml
```

Even if ran quickly, if you run `kubectl get pods`, you'll see this task probably already completed:

```bash
NAME                                  READY   STATUS      RESTARTS   AGE
echo-hello-world-task-run-pod-vm6f5   0/1     Completed   0          12s
```

As mentioned though, Tekton stores the results of a `TaskRun`, and that's where the [Tekton CLI](https://github.com/tektoncd/cli) comes in. First, checkout Tekton's description of your `TaskRun`:

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

This is a bit bare since the task has no inputs, outputs, or resources. What's important though is that the `Status` is set to `Succeeded`. Great! Next, take a look of the output from the output of that `TaskRun`:

```bash
tkn taskrun logs echo-hello-world-task-run
```

```bash
[echo] Hello World
```

Just as you may expected, the output of the `echo` task was `Hello World`. 

## Keep Learning

In [part two of this guide](/guides/ci-cd/tekton-gs-p2/), you'll learn about inputs into and outputs from tasks, as well as how you can use Cloud Native Buildpacks with Tekton. If you want to dive deeper into what has already been covered, you can give the [official documentation](https://github.com/tektoncd/pipeline#-tekton-pipelines) a read to learn more!