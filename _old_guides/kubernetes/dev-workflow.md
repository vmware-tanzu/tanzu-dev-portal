---
date: '2021-02-09'
lastmod: '2021-02-26'
subsection: Developer Workflow
team:
- John Harris
title: Developer Workflow
topics:
- Kubernetes
weight: 37
oldPath: "/content/guides/kubernetes/dev-workflow.md"
aliases:
- "/guides/kubernetes/dev-workflow"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

The developer workflow typically involves writing code, executing automated
tests, building the application, and running the app locally. In most cases,
developers repeat these steps throughout the day, creating a development cycle.
The efficiency of the development cycle has a direct impact on the time it takes
development teams to ship new features and fix bugs. For this reason, minimizing
the time it takes to iterate through the cycle is desirable.

In the context of the development workflow, Kubernetes only impacts the final
steps of the cycle, which involve running the application. Depending on the
complexity of the application, developers might choose to run it in a
development Kubernetes cluster that mimics a production environment. In doing
so, developers leverage Kubernetes deployment manifests to deploy their
application alongside its dependencies, such as other services, databases, and
message queues.

The ability to deploy and test applications in a production-like environment is
one of the most significant benefits of including Kubernetes in the development
cycle. Without appropriate processes and tooling, however, Kubernetes could
hinder developers' efficiency, as they would need to add new steps to their
cycle. (Steps such as building container images and running kubectl commands to
deploy new containers).

## Application Development Cycle on Kubernetes

For simple projects it is preferable to keep Kubernetes out of a developer's
workflow. As a starting point, a development cycle might involve changing code
and rerunning an executable on one's local machine. Containers usually enter the
development process as a means of easily running dependencies with pinned
versions (for example a SQL database). As the application grows and multiple
containers are needed, it becomes useful to codify the development environment.

As more services are introduced it becomes increasingly attractive to favor
Kubernetes API manifests as the means of specifying a development environment.
This allows the developer to reuse `deployment.yaml` files which are often
already in place in production environments. At this point there is a high level
of parity between development, staging, and production environments. However, a
new challenge arises: how does the developer efficiently update the application
running on their development cluster every time the code is updated?

The Kubernetes community and the broader Cloud Native ecosystem offers a variety
of tools that improve the development workflow. Each tool attempts to solve one
of these problems: 1) Running Kubernetes in the developer's local environment,
and 2) Continuously building, pushing, and deploying containers as the developer
changes source code.

## Local vs Remote Cluster

An organization will eventually need to provide a cluster for
sandbox/development workloads for teams of developers. There are an array of
tools and strategies to provide a cluster for development workloads, but the
first question often asked is "Where should my developer's develop?" As
organizations move towards a cloud native model, the journey often starts with
simple local development machines and matures towards multi-cluster development
environments hosted on-prem or with a cloud provider.

The following tools provide developers with a local Kubernetes environment:

- [Kind](https://kind.sigs.k8s.io/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

As the development model matures, on-prem or hosted clusters are used together
with CI/CD tooling to standardize environments and workflows.

## Kubeconfig & Multiple Clusters

As more clusters are created for teams, projects, or production environments, it
is important to efficiently manage configurations and navigate between clusters.
Your `$HOME/.kube/config` file, known as the `kubeconfig`, is used to organize
information about clusters, credentials, and namespaces. Below are some common
commands to navigate contexts.

```sh
kubectl config view # Show Merged kubeconfig settings.

# use multiple kubeconfig files at the same time and view merged config
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2


kubectl config get-contexts                # display list of contexts
kubectl config current-context             # display the current-context
kubectl config use-context my-cluster-name # set the default context to my-cluster-name

# permanently save the namespace for all subsequent kubectl commands in that context.
kubectl config set-context --current --namespace=ggckad-s2
```

Additionally, useful tooling such as
[kubectx](https://github.com/ahmetb/kubectx) can help developers navigate
between contexts.

## Popular Tooling & Approaches

### Skaffold

[Skaffold](https://github.com/GoogleContainerTools/skaffold) is a project from Google that bundles multiple steps (build, tag, test, deploy) into a single command.
The tool can watch for changes and re-run the steps as needed.
Skaffold is configurable with pluggable integrations for each step.
It also assists with debugging by aggregating and tailing logs.
In addition to aiding development workflows, Skaffold can also serve double duty as the basis for executing CI/CD pipelines.

### Tilt

[Tilt](https://github.com/windmilleng/tilt) is a CLI+GUI project backed by a startup (Windmill Engineering).
Like Skaffold, Tilt supports pluggable templating solutions (Helm, Kustomize, etc).
However, unlike other tools which only present the developer with aggregated logs, Tilt also shows a summarized view of all their running applications.
This is done by displaying a web view of each application, or showing a high-level status for each service (success/error).
The Tilt team also provides a method of sharing snapshots of one's development environment with teammates via TiltCloud.

Tilt is able to speed up build processes by avoiding in-container builds during development through copying source files (and injecting restart scripts).
This process is more seamless for interpreted languages than for compiled languages where more workarounds are needed.

Tilt represents a step forward in development workflow tools because it focuses on optimizing feedback loops within a Developer's own environment as well as across a team.
However, Tilt is still an early stage project and the direction of the startup behind the project is not yet clear.