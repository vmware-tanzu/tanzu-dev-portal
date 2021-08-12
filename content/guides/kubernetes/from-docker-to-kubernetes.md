---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: From Docker to Kubernetes
parent: What is Kubernetes?
title: Getting Started with Docker Containers on Kubernetes
topics:
- Kubernetes
- Containers
- Microservices
oldPath: "/content/guides/kubernetes/from-docker-to-kubernetes.md"
aliases:
- "/guides/kubernetes/from-docker-to-kubernetes"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Once you understand what [containers](/guides/containers/what-are-containers) and [Kubernetes](/guides/kubernetes/what-is-kubernetes) are, the next step is to learn how the two work together. This guide provides an example of containerizing a simple application using Docker and deploying it on Kubernetes.

## What is Docker?

Docker is an open source container platform that uses OS-level virtualization to package your software in units called containers. Containers are isolated from each other and are designed to be easily portable. You can build, run and distribute applications in Docker containers to run on Linux, Windows, Macs and almost anywhere else--both on-premises and in the cloud. The Docker environment also includes a container runtime as well as build and image management.

## Docker Containers 

A **Docker container image** is a lightweight, standalone, executable software package that includes everything needed to run an application: code, runtime, system tools, system libraries and settings. Docker provides a standard format for packaging and porting software, much like ISO containers define a standard for shipping freight. A runtime instance of a Docker image consists of three parts:

* The Docker image
* The environment in which the image is executed
* A set of instructions for running the image

## Docker and Kubernetes

A containerized application image along with a set of declarative instructions can be passed to Kubernetes to deploy an application. The containerized app instance running on the Kubernetes node derives the container runtime from the Kubernetes node along with compute, network, and storage resources, if needed.

Here’s what it takes to move a Docker container to a Kubernetes cluster.

* Create a container image from a Dockerfile
* Build a corresponding YAML file to define how Kubernetes deploys the app

### Dockerfile to Create a Hello World Container Image

A manifest, called a Dockerfile, describes how the image and its parts are to run in a container deployed on a host. To make the relationship between the Dockerfile and the image concrete, here’s an example of a Dockerfile that creates a "Hello World" app from scratch:

```text
FROM scratch
COPY hello /
CMD ["/hello"]
```

When you give this Dockerfile to a local instance of Docker by using the `docker build` command, it creates a container image with the "Hello World" app installed in it.

### Creating a Kubernetes Deployment for Hello World

Next you need to  define a deployment manifest, commonly done with a YAML or JSON file, to tell Kubernetes how to run "Hello World" based on the container image:

```yaml
# Hello World Deployment YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helloworld
spec:
  selector:
	matchLabels:
  	app: helloworld
  template:
	metadata:
  	labels:
    	app: helloworld
	spec:
  	containers:
  	- name: helloworld
    	image: boskey/helloworld
    	resources:
      	limits:
        	memory: "128Mi"
        	cpu: "500m"
```
To deploy the application on a Kubernetes cluster, you can submit a YAML file using a `kubectl` command similar to the following. 

```kubectl apply -f https://yourdomain.ext/application/helloworld.yaml --record```

Once that’s done, the hello world container is deployed in a Kubernetes pod.

## Creating a Kubernetes Service

The container is now deployed to Kubernetes but there is no way to communicate with it, the next step is to turn the deployment into a Service by establishing communication.

In Kubernetes, a Service is an abstraction which defines a logical set of pods and a policy by which to access them. This guide demonstrates a basic method of providing services to pods.

### Application Labels and Services

#### Labels

A very interesting aspect of Kubernetes is the way Kubernetes combines the use of `Labels` and `Services` to create tremendous possibilities.

At the heart of Kubernetes is a `pod.` A pod contains running instances of one or more containers. When a pod is deployed in Kubernetes, apart from other specifications, the pod can be assigned labels. Ideally a pod is given a label identifying which part of the overall application the pod belongs to. For example, if the pod being deployed is for the application ”frontend” and within “frontend” the pod is running code for login, upon deployment it can be labeled \[`app=frontend,label=login`\]. Other pods deployed as part of this tier can be given the same label.

![Kubernetes Services and Labels](/images/guides/kubernetes/kubernetes-services-and-labels.png)

#### Services

`Services` enable Kubernetes to route traffic to pods. Pods in Kubernetes are deployed on an overlay network. Pods across Kubernetes nodes cannot access each other nor can any external/ingress traffic access pods unless a `Service` type resource is defined.  A service is routed to the correct app using a label. So when a service gets created with label `login,`the service will send traffic to pods that contain the `login` app based on the label match. Services are needed for both East-West communication, when two pods from different apps need to talk to each other, and for North-South communication, when external traffic \( outside of the Kubernetes cluster\) needs to talk to a pod. Kubernetes has different service types to address both scenarios. Some common services are listed below:

{{< table "table" >}}
| Service Type | Depends on | What it Does | Traffic Type Handled |
| --- | ----- | --- | --- |
| **Cluster IP** | Cluster Network | Uses the Cluster Network to MAP pod IP/port | Internal to the Cluster |
| **Node Port** | Cluster IP | Uses a port on Kubernetes Node + creates a mapping of Node port to the Cluster IP | External |
| **Load Balancer** | Cluster IP/Node Port | Creates an External Load Balancer that maps to either a Cluster IP/Node Port | External |
{{</ table >}}

The `services` resource constructs in Kubernetes may be [Microservices](/topics/microservices) or other HTTP services. 

### Hello World service definition

A corresponding service definition for the earlier “Hello World” deployment manifest is shown below. Notice `line 5` onward. With the selector as `"app: hello world"` the service will forward traffic coming to port 80 on the cluster network to pods that match this label.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld
spec:
  selector:
	app: helloworld
  ports:
  - port: 80
	targetPort: 80
```

## The Power of Services

Because of label matching, there is no need to understand the IP addressing of pods to load balance traffic. As a result:

* **Load balancing** traffic across multiple pods is simplified.
* **Updating an app** \(in a pod\) can be as simple as:
  *  Deploying apps with new version labels \( e.g, v.1.5\)
  * Waiting for all deployments to complete
  * Updating the corresponding Service's labels to match the new pods.
* **Traffic shaping**: Using [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), incoming app traffic can be split between multiple labels, making it simple to do things like A/B testing.

## Keep Learning
This guide explained how a few  simple tools can create powerful services. Microservices in application development allow for expedited development, test, deployment and upgrade and, when combined with Kubernetes, can make you fast and efficient. The video below breaks down some of the key Kubernetes concepts in five minutes:

{{< youtube PH-2FfFD2PU >}}

To learn more be sure and check out our developer workshops on [containers](/workshops/lab-container-basics/) and [Kubernetes](/workshops/lab-k8s-fundamentals/). KubeAcademy also offers great free 101 content on [containers](https://kube.academy/courses/containers-101) and [Kubernetes](https://kube.academy/courses/kubernetes-101), and additional introductory content to help you get started including [Hands on with Kubernetes and Containers](https://kube.academy/courses/hands-on-with-kubernetes-and-containers) and [Building Applications for Kubernetes](https://kube.academy/courses/building-applications-for-kubernetes).