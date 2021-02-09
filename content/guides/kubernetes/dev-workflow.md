---
title:  "Developer Workflow"
subsection: "Developer Workflow"
weight: 2
topics:
- Kubernetes
team:
- John Harris
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
and 2) Continously building, pushing, and deploying containers as the developer
changes source code. To learn more about the available tools, see the
[Options](../tooling-and-approaches) document.

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
with [CI/CD tooling](../deployment-and-lifecycle/tooling-and-approaches.md) to
standardize environments and workflows.

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
