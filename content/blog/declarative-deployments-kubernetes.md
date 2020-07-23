---
title: "Declarative Deployments in Kubernetes: What options do I have?"
featured: false

description: >
    Compare various options for declarative deployment of microservices in Kubernetes.
date: 2020-07-22
topics:
- Kubernetes
tags:
- Kubernetes
patterns:
- Deployment
# Author(s)
team: 
- Dan Dobrin
---

## Context
Your cloud-native application has been designed, built, tested locally and you're taking the next step: deployment to Kubernetes. 

Isolated environments can be provisioned as namespaces in a self-service manner with minimal human intervention through the Kubernetes scheduler, however, as the number of microservices increases, continually updating and replacing applications with newer versions, observing and monitoring the success/failure of deployments becomes an increasing burden.

Deployment processes are performed while allowing for zero or some downtime, at the expense of increased resource consumption or support of concurrent app versions. 

What options do you have to turn deployments into a predictable, repeatable, consistent, easy to observe process? Kubernetes to the rescue ... with **Declarative Deployments**...

## What are declarative deployments in Kubernetes?

The concept of Deployment in Kubernetes encapsulates the upgrade and rollback processes of a group of containers and makes its execution a repeatable and automated activity.

The declarative nature of a Kubernetes Deployment allows you to specify how the deployed state should look, rather than the steps to get there.
Declarative deployments allow us to describe how an application should be updated, leveraging different strategies, while allowing for the fine-tuning of the various aspects of the deployment process.

The core of the Deployment is centered around its ability to start and stop Pods in a predictable manner. 
In turn, containers respect cloud best practices and listen to and honor lifecycle events or provide health-check endpoints.

## How do you pick the best deployment pattern for your app?

As the number of microservices in the organization increases, so does the number of clients of a microservice and the complexity of the interconnected services. 
The approach to be taken centers primarily on a couple of discriminating factors:
* can your application allow for any downtime?
* can the clients of your application handle concurrent provider application versions?

Let's introduce a simple decision matrix for declarative deployments, then look at each of the patterns individually.

1. [Rolling Deployments](#1)
2. [Fixed Deployments](#2)
3. [Blue-Green Deployments](#3)
4. [Canary Deployments](#4)

![Deployment options
](/images/blogs/declarative-deployments-kubernetes/summary.png)

#### Pattern implementations:  
A sample application, including step-by-step instructions, source code and Kubernetes deployment configurations for all four deployment patterns can be found on [GitHub](https://github.com/ddobrin/declarative-deployments-k8s).

<a name="1"></a>
## Rolling Deployments

#### Pros:
* Zero downtime during the update process
* Ability to control the rate of a new container roll-out

#### Cons:
* During the update, two versions of the container are running at the same time

#### How does it work:
* Deployment creates a new Replica Set and the respective Pods
* Deployment replaces the old containers with the previous application version with the new ones
* Deployment allows you to control the range of available and excess Pods

![Rolling Deployment - Prior to Deployment](/images/blogs/declarative-deployments-kubernetes/RD1.png)  


![Rolling Deployment - During Deployment](/images/blogs/declarative-deployments-kubernetes/RD2.png)  

![Rolling Deployment - Post Deployment](/images/blogs/declarative-deployments-kubernetes/RD3.png)  

#### The Deployment configuration
The Deployment uses the `RollingUpdate` strategy and allows full control over how many instances of the `my-app` application can be unavailable at any given moment in time:
```yaml
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate: 
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
...        
```

The Service selects all nodes for the `my-app` application matching the label:
```yaml
kind: Service
metadata:
  labels:
    app: my-app
  name: my-servappice
  namespace: default
spec:
...
  selector:
    app: my-app
  type: NodePort
```

<a name="2"></a>
## Fixed Deployments

#### Pros:
* Single version serves requests at any moment in time
* Simpler process for service consumers, as they do not have to handle multiple versions at the same time

#### Cons:
* There is downtime while old containers are stopped, and the new ones are starting

#### How does it work:
* Deployment stops first all containers deployed for the old application version
* Clients experience an outage, as no application instance is available to process requests
* Deployment creates the new containers
* Client accesses requests serviced by the new application version

![Fixed Deployment - Prior to Deployment](/images/blogs/declarative-deployments-kubernetes/FD1.png)  

![Fixed Deployment - During Deployment](/images/blogs/declarative-deployments-kubernetes/FD2.png)  

![Fixed Deployment - Post Deployment](/images/blogs/declarative-deployments-kubernetes/FD3.png)  

#### The Deployment configuration
The Deployment uses the `Recreate` strategy as it terminates all pods from a deployment before creating the pods for the new version of the `my-app` application:
```yaml
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: my-app
...        
```

The Service selects all nodes for the `my-app` application matching the label:
```yaml
kind: Service
metadata:
  labels:
    app: my-app
  name: my-app
  namespace: default
spec:
...
  selector:
    app: my-app
  type: NodePort
```

<a name="3"></a>
## Blue-Green Deployments

#### Pros:
* Single application version serves requests at any moment in time
* Zero downtime during the update
* Allows precise control of switching to the new application version

#### Cons:
* Requires twice the capacity while both blue and green versions are up 
* Manual intervention for switching versions

#### How does it work :
* A second Deployment is created manually for the new version (green)
* The new version (green) does not serve client requests yet and can be tested internally to validate the deployment
* The Service Selector in K8s is being updated to route traffic to the new version (green), followed by the removal of the old (blue) Deployment

![Blue-Green Deployment - Prior to Deployment](/images/blogs/declarative-deployments-kubernetes/BGD1.png)  

![Blue-Green Deployment - During Deployment](/images/blogs/declarative-deployments-kubernetes/BGD2.png)  

![Blue-Green Deployment - Post Deployment](/images/blogs/declarative-deployments-kubernetes/BGD3.png)  

#### The Deployment configuration
The Deployment does not provide a specific strategy, as the service exposing the deployment is the K8s resource participating in the deployment process which selects which pod instances are exposed to client requests. In this excerpt, 2 labels are used, `my-app` and `blue`:
```yaml
kind: Deployment
metadata:
  name: my-app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: blue
...        
```

The Service selects all nodes for the `my-app` application matching multiple labels: the app + the version. This allows the selection of the pods matching a specific version. This excerpt has the Service matching 2 labels `my-app` and 'blue`:
```yaml
kind: Service
metadata:
  labels:
    app: my-app
  name: my-app
  namespace: default
spec:
...
  selector:
    app: my-app
    version: blue
  type: NodePort
```

<a name="4"></a>
# Canary Deployments

#### Pros:
* Reduces the risk of a new service version by controlling access to the new version to a subset of consumers
* Allows precise control of full switch to the new version

#### Cons:
* Manual intervention for switch
* Consumers failing to handle multiple versions simultaneously see failures

#### How does it work:
* A second Deployment is created manually for the new application version (canary) with a small set of instances
* Some of the client requests are now redirected to the canary application version
* Once there is confidence that the canary version works as expected, traffic is fully scaled up for the canary application version and scaled to zero for the old one

![Canary Deployment - Prior to Deployment](/images/blogs/declarative-deployments-kubernetes/CD1.png)  

![Canary Deployment - During Deployment](/images/blogs/declarative-deployments-kubernetes/CD2.png)  

![Canary Deployment - Post Deployment](/images/blogs/declarative-deployments-kubernetes/CD3.png)  

#### The Deployment configuration
The Deployment does not provide a specific strategy, as the service exposing the deployment is the K8s resource participating in the deployment process which selects which pod instances are exposed to client requests. In this excerpt, 2 labels are used, `my-app` and `1.0`, the canary deployment will use `my-app` and `canary`, which will allow the Service to match pods by a single label `my-app`:
```yaml
# initial deployment
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: "1.0"
...        
# canary deployment
kind: Deployment
metadata:
  name: my-app-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: canary
...
```

The Service selects all nodes for the my-app matching the labels for the app:
```yaml
kind: Service
metadata:
  labels:
    app: my-app
  name: my-app
  namespace: default
spec:
...
  selector:
    app: my-app
  type: NodePort
```

## Thinking Ahead

You have built cloud-native applications, and the different deployment patterns are understood by now. Use a simple decision process, based on the resources available to you, respectively the client tolerance for multiple versions of your application, before deploying any new application to Production. 

As conditions change, you have full flexibility to change your approach to deploying your applications to Kubernetes!