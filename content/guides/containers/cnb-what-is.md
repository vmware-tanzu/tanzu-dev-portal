---
date: '2020-04-16'
description: Learn the basics of Cloud Native Buildpacks and discover how they work
  and how to use them to turn your code into OCI-compliant containers.
lastmod: '2021-03-07'
linkTitle: Cloud Native Buildpacks
patterns:
- Deployment
subsection: Cloud Native Buildpacks
tags:
- Buildpacks
team:
- Brian McClain
title: What are Cloud Native Buildpacks?
topics:
- Containers
oldPath: "/content/guides/containers/cnb-what-is.md"
aliases:
- "/guides/containers/cnb-what-is"
level1: Modern App Basics
level2: DevOps Practices
---

[Cloud Native Buildpacks](https://buildpacks.io/) turn your code into OCI-compliant containers. They examine your source code, build it, and create a container image with all the required dependencies to run your application. 

## Why Are They Important? 

There are two things to consider when discussing the value of Cloud Native Buildpacks: how the container is created, and how the container is maintained.  

If you’ve created a container using Dockerfiles before, you’re already familiar with the decisions you need to make. You need to decide which base image to base your container on and which version of that image to use, and then ensure it has the proper versions of all the dependencies that your application relies on.  After that, you need to bring in the additional dependencies  and runtimes, build your application, and then slim down your container image to ensure it’s as lean and quick as possible. 

Cloud Native Buildpacks know how to build and containerize your application. If it's a Java app, they will bring in the JVM. If it's a Ruby app, they will bring in the Ruby runtime.

![Image Layers](/images/guides/containers/diagrams/cnb-1.png)

Your container also needs to be maintained. Throughout the entire stack—from the base image to dependencies to your application runtime—it's important to keep things up to date and secure. Since Cloud Native Buildpacks separate out the base image, the runtime, and your application into different layers, they're very quick to update only the layers that changed.

![Image Rebase](/images/guides/containers/diagrams/cnb-2.png)

## How Do They Work? 

Cloud Native Buildpacks are an abstract lifecycle, so they are more of a definition than an implementation (see the ["How Can I Use Them?"](#how-can-i-use-them) section below for something more concrete). That lifecycle is broken down into four steps:

1. **Detection:** Automatically determines which buildpacks are required to build the application.
2. **Analysis:** If any layer can be reused from a previous build, pulls it from the cache. (This helps optimize the build process.)
3. **Build:** Creates the runnable artifacts from your application's source code
4. **Export:** Creates the final OCI-compliant image.

Let's walk through these steps in a couple of specific scenarios, one where we have a Spring Boot app that uses Maven, and another where we have an app written in Ruby. An implementation of the lifecycle would look something like the following:

- Each buildpack's `detect` script is run against our codebase. If a `pom.xml` file is found, we determine that we're building a Java app with Maven. If a `Gemfile` is found, we know we need the Ruby buildpack.
- If we've previously run a build with the buildpack, it will reuse those images that contain components such as the base run image, or the JDK in the case of a Java app, or the Ruby runtime for a Ruby application.
- In the case of a Java app, the buildpack will use Maven to build our JAR. In the case of a Ruby application, the buildpack will use Bundler to pull down all of the application dependencies defined in our `Gemfile`.
- All of these layers are then put together into a single container image that is ready to be run however we choose.

## How Can I Use Them?

The easiest way to get started with Cloud Native Buildpacks is to [use the `pack` CLI](https://buildpacks.io/docs/app-journey/), an implementation of the Buildpack lifecycle. The `pack` CLI uses nothing but a local Docker daemon to run the Buildpack lifecycle entirely locally.

Alternatively, you can [check out `kpack`](https://github.com/pivotal/kpack), a Kubernetes-native container build service. You tell `kpack` where your code is and which branch to build, and it will build and containerize your application using Cloud Native Buildpacks, all on your Kubernetes cluster.