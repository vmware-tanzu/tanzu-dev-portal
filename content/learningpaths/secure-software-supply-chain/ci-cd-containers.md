---
date: '2021-05-19'
lastmod: '2021-06-15'
layout: single
title: Building Containers in CI/CD Pipelines
weight: 5
oldPath: "/content/outcomes/secure-software-supply-chain/ci-cd-containers.md"
aliases:
- "/outcomes/secure-software-supply-chain/ci-cd-containers"
tags: []
---

While we explored a number of methods to build a container, they can all integrate into your CI/CD pipelines differently. Of course, your choice of CI and CD tools can also dictate how you build your container as well, so make sure you're reading the appropriate documentation and ensure that your pipelines are leveraging all of the features at your disposal.

## Docker

Depending on your choice of CI/CD tool, building container images with Docker can present its own unique challenges. Some tools will present a running Docker daemon, which makes this process very straightforward, allowing you to perform a simple `docker build` command to build your container. In some scenarios however, a running Docker daemon isn't always available, at least not by default. [Jenkins](https://www.jenkins.io/) provides a [Docker plugin](https://plugins.jenkins.io/docker-plugin/) and [CircleCI](https://circleci.com/) allows you to [define the need for a Docker daemon](https://circleci.com/docs/2.0/building-docker-images/) for example, and the ability to build container images from a Dockerfile is becoming more prevalent, but ensure to keep this in mind when choosing your CI/CD tools.

The upside to using Dockerfiles to build your containers is that it makes your CI/CD pipeline very straightforward. There's a straight line through test, build, and deploy without relying on external processes triggering parts of your pipeline(s).

## Kaniko

Kaniko and other tools that rely on reactively spinning up pods on Kubernetes present a different challenge of how you construct your CI/CD pipeline. Your tool of choice may have a plugin or feature to enable either the use of Kaniko directly or allow you to run a pod and wait for its outcome. If it doesn't however, not all is lost, the solution just becomes more of a structural one.

The solution, again, can take many forms. You can have one pipeline that tests your code and spins up a Kaniko pod, then a second pipeline that is triggered when a newer version of a container image is uploaded to your registry. Alternatively, you could feed the details of the pod running your build into a step in your pipeline that's responsible for watching that pod and waiting for it to complete. Any way you go about it, you can still leverage solutions such as Kaniko in case you don't have access to a dedicated Docker daemon but do have a Kubernetes cluster that you can use.  

## Tanzu Build Service

A difference between using a build service such as Tanzu Build Service and a solution such as Kaniko is who initiates each step of the build. With a solution such as Kaniko, you're responsible for kicking up tests once a new commit is made to the code, and then spinning up a pod to build the container. You're then also responsible for figuring out when the build completes, sending it to our image scanning solution, and finally watching for when the scan finishes.

Since solutions such as Tanzu Build Service offer building and scanning images in one, your pipeline could be as simple as watching for a new commit, running the tests, and then tagging the code so that the build service kicks off a build and scan. This may represent a faster and less risk-prone path to production.