---
layout: single
team:
- Paul Kelly
title: Install kpack
weight: 20
---

These are some of the different ways you might create a container image for your application: 

* Use a Dockerfile and `docker build` 
* Use the spring-boot:build-image plug-in to create a container image
* Use kpack to build the image

Defining your own image using Dockerfiles is a long-established way of creating container images, but it has several drawbacks. For example, you are responsible for choosing a secure base image, deciding how your application should be installed on it, and updating the base image whenever security patches are issued.  

The second two methods use [Cloud Native Buildpacks](https://buildpacks.io). Buildpacks do all the heavy lifting of building a secure container with a secure base image, and deploying your application using best practices the application does not run as root, and in the case of Spring Boot applications, the fat jar is unbundled during image creation, which provides better performance. 

Once you have set up kpack in your cluster, it monitors your source repository for changes, rebuilds the container image, and pushes it to your repository as needed. Buildpacks are updated regularly so that base images have the latest patches. In this section, you install kpack on your Kubernetes cluster by getting a configuration file from GitHub and applying it with the kubectl command. Go to [https://github.com/pivotal/kpack/releases](https://github.com/pivotal/kpack/releases) to see the latest kpack release and apply it. For kpack v0.5.2 (the version used writing this tutorial), the command line is: 


```
kubectl apply -f   
   https://github.com/pivotal/kpack/releases/download/v0.5.2/release-0.5.2.yaml
```


This creates a kpack namespace on your cluster and starts pods for the kpack controller and webhook. It might take a couple of minutes to start up, but you can check the progress by running: 


```
kubectl get pods --namespace kpack --watch
```


Once the status of both pods changes to “running,” kpack is ready. To interact with kpack, you also need to install the kpack CLI on your local machine. You can either download the binary from [https://github.com/vmware-tanzu/kpack-cli/releases](https://github.com/vmware-tanzu/kpack-cli/releases), or, if you have `brew` installed: 


```
brew tap vmware-tanzu/kpack-cli
brew install kp
```


Once kp is installed, it uses the same credentials and context as your kubectl command to communicate with kpack on your cluster.
