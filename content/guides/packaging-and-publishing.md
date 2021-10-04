---
date: '2021-09-16'
description: Build your code reliably
weight: -100
linkTitle: Packaging and Publishing
title: Packaging and Publishing
level1: Deploying Modern Applications
level2: Packaging and Publishing
toppage: true
tags: []
---

Packing your application is rarely as simple as running `gcc` anymore, especially when deploying to Kubernetes. Tools such as [Cloud Native Buildpacks](/guides/cnb-what-is/) for example can examine your code, determine how to build it, and package it into a container. Additionally, once your container is built, the comes the question: Where does it go? Different container registries provide different features such as image scanning and access management.