---
title: Inner-loop Development with VMware Tanzu Application Platform
description: |
  Your ability to bring software to production consistently, reliably, and securely is the most critical component for bringing value to your customers. Here we explore the components that drive successful outcomes through mature software delivery practices.
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

- Inner-loop development cycles are a critical workflow for modern application creation. These flows allow developers to iterate on a feature or bug locally, before pushing to more formal testing environments. This saves time, and yields better results.
- Increasing the velocity of the inner-loop development cycle is key to unlocking greater efficiency. If all code updates were immediately preview-able in an environment which closely mirrored testing and production environments, this creates a very fast and effective workflow.
- Utilizing the components within the VMware Tanzu portfolio pf products can help unlock functionality the is greater than simply the sum of the parts.

## Outcomes

- You will go from a complete beginner with the Tanzu portfolio, to deploying your own, fully functional, extendible, Tanzu development environment.
- You will set up all the accounts required, as well as all of the supporting tooling to support this infrastructure. 
- You will learn along the way how and why certain tools are necessary, and what they are necessary for. 

## Summary

Inner-loop development is a term which refers to the local, small, and iterative code changes that are day-to-day for most developers. This goes hand-in-hand with outer-loop development, where these smaller changes are packaged as a larger commit or feature branch and pushed to a testing environment and eventually production. 

The specifics of this inner-loop experience with vary greatly across teams and organizations, but the pattern is essentially consistent for most teams. A developer may pick up a user story or a bug report, and start by downloading or updating a code repo locally. From here, small and iterative code changes are made. These changes are tested locally. And once the developer is reasonably sure the changes meet the expectation of the user story or fix the issue filed in the bug report, it is pushed into a pipeline. Perhaps going to a more formal testing process before reaching production. Perhaps not. 

This inner-loop process is critical for modern application development. And improvements which can be made to this process, even small ones, can have rippling effects across an organization. And improvements which completely change the inner-loop workflow paradigm are nothing short of transformational. 

There are a number of issues which can arise with this process traditionally, such as:

- The local environment which the developer is building in does not adequately represent the formal testing or production systems. This leads to unforeseen and untested for errors after the submission. These errors must be reworked and fixed prior to the changes moving out to production. 
- The developer is not able to adequately preview their application before pushing it. While testing scripts and methods are likely to exist, it may be that the application being built is not easily deployed on a local system. This is especially common for cloud native and Kubernetes-based applications.
- The inner-loop development cycle is extremely limited, forcing developers to push their changes to formal testing pipelines any time they want to test a change. While these tests are critical to perform, it is important to perform them at the right time, and in the right context. Otherwise developers end up spending too much time waiting for tests to finish and return.

In this guide, and with the environment you will build, you will solve these issues.

- For organizations that have adopted the Tanzu suite of products, and especially Tanzu Application Platform, your local environment will closely mirror that of production. Tanzu Application Platform is an opinionated platform which runs on top of Kubernetes. If this is what is also running in testing and production environments, you can be much more certain that changes that worked locally, will also work in production. 
- With some of the extensions developed for Tanzu Application Platform, including those for VS Code, live updates of your applications becomes fast and simple. With every code save, your application is quickly rebuilt and redeployed, ready for testing.
- Tanzu Application Platform comes with a default set of supply chains, and testing pipelines. And these pipelines can be shared as code. This means that any new deployments run locally have the ability to go through as much of the production pipeline's testing as your teams deem necessary. The out-of-the-box defaults are there to give you a safe operating environment, but they are also very customizable and extensible. 

Keep going in this Learning Path to get started, and see for yourself. 
