+++
tags = ["[k8,kubernetes,docker]"]
summary = "Examples of deploying a .NET application to a Kubernetes cluster with windows workers"
date = "2019-03-25T14:27:52-06:00"
title = "Kubernetes"
pre = "<i class='fa fa-anchor'></i> "
weight = 2
layout = "intro"
+++

Each recipe in this section is an example of deploying a .NET application to a windows server, managed by Kubernetes. All recipes assume a running cluster, an established [`~/.kube/config`](https://kubernetes.io/docs/tasks/tools/install-kubectl/#configure-kubectl), and the [kubectl cli](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

With those core components established, moving .NET applications to Kubernetes becomes the combination of the app artifact, a [Dockerfile](https://docs.docker.com/engine/reference/builder/), and the Kubernetes deployment manifest. The Dockerfile will declare a base image and configure the app's environment (IIS, registry, install dependencies, install services, etc) to create the container. The Kubernetes manifest will instruct the platform how to deploy the container and what services to connect. Note the use of a base container image in each Dockerfile `FROM microsoft/iis`. This image must match the operating system being used by the Kubernetes worker (Server 1803, Server 2019, etc). All the recipes assume Windows Server 2019, by  using the latest image.

The recipes will suggest how to navigate specific configurations, through the combination of all these components.

{{% children  %}}


