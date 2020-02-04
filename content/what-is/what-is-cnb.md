---
title:  "What Are: Cloud Native Buildpacks"
date:   2020-01-29
---

What Are: Cloud Native Buildpacks 
===

Cloud Native Buildpacks turn your code into OCI-compliant containers. They examine your source code, build it, and create a container image with all the required dependencies to run your application. 

## Why Are They Important? 

There are two things to consider when discussing the value of Cloud Native Buildpacks: How the container is created on Day 1, and how the container is maintained Day 2 and beyond.  

If you’ve created a container for your application before using Dockerfiles, you’ve seen the decisions you need to make. You need to decide which base image to base your container on, which version of that image to use, and ensure it has the proper versions of all the dependencies that your application relies on.  After that, you then need to bring in the additional dependencies that you need, build your application, and then finally slim down your container image to ensure it’s as lean and quick as possible. Cloud Native Buildpacks know how to build and containerize your application. If it's a Java app, it will bring in the JVM. If it's a Ruby app, it will bring in the Ruby runtime.

![Image Layers](https://buildpacks.io/docs/concepts/operations/build.svg)

Looking forward though, your container needs maintained. Throughout the entire stack, from the base image to dependencies to your applications runtime, it's important to keep things updated and secure. Since Cloud Native Buildpacks separate out the base image, the application runtime, and your application into different layers, it's very quick to update only the layers that changed.

![Image Rebase](https://buildpacks.io/docs/concepts/operations/rebase.svg)

## How Do They Work? 

As mentioned, Cloud Native Buildpacks are just an abstract lifecycle, so they are more a definition rather than an implementation (see "How Can I Use Them" below for something a bit more concrete). That lifecycle is broken down into four steps:

1. **Detection**: Automatically determine which buildpacks are required to build the application
2. **Analysis**: If any layer can be reused from a previous build, pull it from the cache. This helps optimize the build process
3. **Build**: Create the runnable artifacts from your applications source code
4. **Export**: Creates the final OCI-compliant image

Let's walk through this in a specific scenario where we have a Spring Boot app that uses Maven. An implementation of the lifecycle would look something like the following:

1. It would detect the `pom.xml` file and determine that we need the Java buildpack
2. If we've ran build previously with this buildpack, it will then pull in previously pulled images that contain components such as the base run image or the JDK.
3. The buildpack will use Maven to build your application
4. All of these layers are then put together into a single container image that is ready to be ran how you choose

## How Can I Use Them?

The easiest way to get started with Cloud Native Buildpacks is to [use the `pack` CLI](https://buildpacks.io/docs/app-journey/), an implementation of the Buildpack lifecycle. The `pack` CLI uses nothing but a local Docker daemon to run the Buildpack lifecycle completely local to you.

Alternatively, you can [check out `kpack`](https://github.com/pivotal/kpack), a Kubernetes native container build service. Kpack provides an automated way to watch your source code repositories for changes and automatically build and containerize your application.