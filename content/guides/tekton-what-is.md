---
date: '2021-01-29'
lastmod: '2021-02-05'
linkTitle: Tekton
patterns:
- Deployment
subsection: Tekton
tags:
- CI-CD
- Kubernetes
- Tekton
team:
- Brian McClain
title: What is Tekton?
oldPath: "/content/guides/ci-cd/tekton-what-is.md"
aliases:
- "/guides/ci-cd/tekton-what-is"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

[Tekton](https://tekton.dev) is a framework for building [CI/CD](/guides/ci-cd/ci-cd-what-is/) pipelines on Kubernetes. It provides a set of building blocks to craft a system that meets your exact needs by breaking things down into individual `Task` resources, which are in turn chained together in a user-defined `Pipeline`.

## Why Is It Important?

The flexibility of Tekton, combined with it being built with Kubernetes in mind, provides a unique scenario: You can use it to build a pipeline, pick it up, and move it to any other Kubernetes cluster. Both individual tasks and complete pipelines can be shared, pieced together, and tracked in source control.

Adding your own functionality to Tekton is also straightforward. Since `Task` resources are essentially a container image and a list of commands to run, you can create your own tasks to piece into a pipeline if one doesn’t exist. If a task to build Java code didn’t exist, for example, you could create a container that has the JDK and Maven.

## How Does It Work?

Tekton can be thought of as the composition of two different resources: 

1. `Task` – A resource that accomplishes a specific action. Tasks are the pieces that take specific inputs and produce specific outputs.
2. `Pipeline`– Defines a series of `Task` resources, the order in which to run them, as well as their inputs, outputs, and parameters. 

For example, you may want to develop a `Pipeline` to test and build some Go code and then create a container image to run the code. You would probably define your Git repository as an input, and both an artifact repository and container registry as outputs. You’d then define three `Task` resources:

**Task 1**
- __Input__: Git repository
- __Step__: Test the Go code
- __Output__: None

**Task 2**
- __Input__: Git repository
- __Step__: Build the Go code
- __Output__: Artifact repository to store the built code

**Task 4**
- __Input__: Compiled Go code from the artifact repository
- __Step__: Create the container image
- __Output__: Registry to store the container image

Of course, the exact tasks depend on the tools, languages, and frameworks that you’re using. But thanks to the flexibility of Tekton, you’re not limited to just what it can do out of the box. If you need to create a `Task` to build some code in a language that’s not currently supported, it’s as easy as providing Tekton with a container that has the tools to build the code and telling it which commands to run.

## How Can I Use It?

There are some great resources to get started with Tekton.  [Getting Started with Tekton](/guides/ci-cd/tekton-gs-p1/) walks you through how to install Tekton and create your first Task. In [part 2](/guides/ci-cd/tekton-gs-p2/) of the guide, we cover how to build a pipeline that builds a container image for your code using [Kaniko](https://github.com/GoogleContainerTools/kaniko). Meanwhile, the [Tekton Docs](https://tekton.dev/docs/) do a great job of explaining the concepts and components, and even include some interactive tutorials right in the browser!