---
title: Inner-Loop Development with VMware Tanzu Application Platform
description: Kubernetes might not be the most developer-friendly platform out there. But platforms built on top of Kubernetes can be. This path walks you through deploying and using VMware Tanzu Application Platform, a platform for developers, built on top of Kubernetes. 
weight: 1
featured: true
duration: 180
experience: Beginner
layout: intro
team:
- Tony Vetter
tags:
- Tanzu
- Tanzu Application Platform
tanzu:
  label: tap
---

## Key Concepts

* Inner-loop development cycles are a critical workflow for modern application creation. These flows allow developers to iterate on a feature or bug locally before pushing to more formal testing environments. This saves time and yields better results.
* Increasing the velocity of the inner-loop development cycle is key to unlocking greater efficiency. If all code updates are immediately preview-able in an environment that closely mirrors testing and production environments, this workflow becomes faster and more effective.
* Utilizing the components within the VMware Tanzu portfolio of products can help unlock functionality that is greater than simply the sum of the parts.

## Outcomes

* You will go from a complete beginner with the Tanzu portfolio to deploying your own, fully functional, extendible, Tanzu development environment.
* You will set up all the accounts required, as well as all of the supporting tooling to support this infrastructure. 
* You will learn along the way how and why certain tools are necessary—and what they are necessary for. 

## Summary

Inner-loop development is a term that refers to the local, small, and iterative code changes that most developers make daily. This goes hand-in-hand with outer-loop development, where these smaller changes are packaged as a larger commit or feature branch and pushed to a testing environment and, eventually, production. 

The specifics of this inner-loop experience will vary greatly across teams and organizations, but the pattern is essentially consistent for most teams. A developer might pick up a user story or a bug report and start by downloading or updating a code repo locally. From here, small and iterative code changes are made and tested locally. Once the developer is reasonably sure the changes meet the expectation of the user story or fix the issue filed in the bug report, it is pushed into a pipeline, perhaps going to a more formal testing process before reaching production, perhaps not. 

This inner-loop process is critical for modern application development. Improvements that can be made to this process, even small ones, can have ripple effects across an organization, and improvements that completely change the inner-loop workflow paradigm are nothing short of transformational. 

A number of issues can arise with this process traditionally, such as:

* The local environment the developer is building in does not adequately represent the formal testing or production systems. This leads to unforeseen and untested errors after the submission. These errors must be reworked and fixed prior to the changes moving out to production. 
* The developer is not able to adequately preview their application before pushing it. While testing scripts and methods are likely to exist, it may be that the application being built is not easily deployed on a local system. This is especially common for cloud native and Kubernetes-based applications.
* The inner-loop development cycle is extremely limited, forcing developers to push their changes to formal testing pipelines any time they want to test a change. While these tests are critical to perform, it is important to perform them at the right time, and in the right context. Otherwise developers end up spending too much time waiting for tests to finish and return.

In this guide, and with the environment you build, you will learn to solve these issues.

* For organizations that have adopted the Tanzu suite of products, and especially [VMware Tanzu Application Platform](https://tanzu.vmware.com/application-platform), your local environment will closely mirror that of production. Tanzu Application Platform is an opinionated platform that runs on top of Kubernetes. If this is also running in testing and production environments, you can be much more certain that changes that worked locally will also work in production. 
* With some of the extensions developed for Tanzu Application Platform, including those for VS Code, live updates of your applications become fast and simple. With every code save, your application is quickly rebuilt and redeployed, ready for testing.
* Tanzu Application Platform comes with a default set of supply chains and testing pipelines, and these pipelines can be shared as code. This means that any new deployments run locally have the ability to go through as much of the production pipeline's testing as your teams deem necessary. The out-of-the-box defaults are there to give you a safe operating environment, but they are also very customizable and extensible. 

Keep going in this Learning Path to get started, and see for yourself. 
