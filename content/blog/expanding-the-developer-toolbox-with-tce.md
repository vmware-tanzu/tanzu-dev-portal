---
date: 2021-10-04
description: VMware Tanzu Community Edition gives developers another tool in their toolbox to learn and use Kubernetes to deploy their workloads. 
featured: true
lastmod: '2021-10-04'
tags:
- Kubernetes
- Tanzu
team:
- Grant Shipley
title: 'Expanding the Developer Toolbox with VMware Tanzu Community Edition'
Level1: Building a Kubernetes Runtime
Level2: Building Your Kubernetes Platform
tanzu:
  label: tce
  gettingstarted: true
  gettingstartedweight: 1
  featured: true
  featuredweight: 1
---

Kubernetes is a wonderful piece of software and provides developers capabilities they have not had readily available to them in most organizations. This is a game changer for what developer productivity can look like in the future. I am excited about the commitment of VMware to make Kubernetes accessible to the masses by simplifying not only the operational use of the platform, but also creating and collaborating on tools targeted specifically for developers and their applications.

You see, Kubernetes can and should be more than just a deployment platform for our application code. We should be able to utilize the power and features of Kubernetes for our daily development processes. Think about what you could accomplish if you had the power and flexibility of Kubernetes for your local development before you perform a git push. Think about all of the things you could play with and prototype before kicking off your [CI/CD pipelines](https://tanzu.vmware.com/developer/topics/ci-cd/) for a full integration test. 

But what good does it do to have a great developer experience on top of Kubernetes if developers don’t have access to Kubernetes to begin with? This is problem No. 1 that we need to address. When VMware wanted to create an open source Kubernetes offering, I knew I had to be part of it. [VMware Tanzu Community Edition](https://tanzu.vmware.com/content/blog/vmware-tanzu-community-edition-announcement) is the open source project that will bring Kubernetes to a developer workstation near you. Chances are your IT infrastructure team already has and relies on the award-winning VMware vSphere platform. Tanzu Community Edition is an open source distribution backed by the community and the already-trusted brand of VMware. This will open up the reality of quickly getting a full-featured Kubernetes cluster for development purposes using the same IT processes and procedures already in place at most organizations. These are exciting times as Kubernetes becomes available to more people than ever before.

## What next?

Given that Tanzu Community Edition is now available to you, what next? You will need to start learning how you can use Kubernetes for your own development projects. VMware is investing in a community-focused effort to bring people up to speed on this technology called learn.tanzu.io. This is a free site dedicated to providing interactive, self-paced learning sandboxes with a goal of helping you know what you need in order to be effective with both containers and Kubernetes.

## Why Tanzu Community Edition?

You may be wondering why Tanzu Community Edition over minikube or KIND? I certainly love and use both and would never get into a debate over which Kubernetes distribution is better because the answer depends on the use case. With Tanzu Community Edition, we are working to create an open source platform that goes beyond Kubernetes alone and also provides tools developers need and an easy path to production.

## What tools can I use with Tanzu Community Edition?

First and foremost, Tanzu Community Edition starts with a pure upstream Kubernetes offering. The magic of the edition comes into play with the software that you install on top of Kubernetes in order to be effective with your job. While I am going to focus on a few VMware open source projects in this article, it is important to remember that any Kubernetes-compliant developer tool will work with Tanzu Community Edition. We strongly believe in developers using the best tool for the job, and we hope that we are providing the best of the best in our developer offerings.

### Spring

Not a Java developer? You can skip this one. :) If you are a Java developer, then you certainly know and probably use [Spring](https://spring.io/) and the surrounding projects. It is the leading framework for the most [popular programming language](https://www.techradar.com/news/java-beats-python-to-remain-the-most-popular-programming-language-around) in the world. Oh, and by the way, it is created and maintained by the Spring team that is part of the Tanzu engineering organization at VMware. A lot of advancements have been made and are in flight to continue to grow the Spring ecosystem and provide ease of use for developers when working with containers and Kubernetes. A few of my personal favorites are the work we are doing around native images and the ability to build and deploy containers right from the maven command line.

### Buildpacks

Let’s be honest here. If you are a developer, you probably like writing code. You probably don’t like the process of building and deploying container images so much. This is where the upstream [kpack](https://github.com/pivotal/kpack) comes into play. This package allows developers to build a container image and deploy it into your Tanzu Community Edition cluster with a single command. You can go from source to URL very quickly. Couple that with something like [Skaffold](https://skaffold.dev/docs/pipeline-stages/builders/buildpacks/) and you have a pretty great experience.

### Carvel

[Carvel](https://carvel.dev/) provides a set of reliable, single-purpose, composable tools that aid in your application building, configuration, and deployment to Kubernetes. What this means in reality is that it is a set of tools that can make your life easier, especially when trying to install new packages on Kubernetes. If you have used MacOS or Linux, you are probably familiar with packaging systems for those operating systems, such as Homebrew (MacOS), or APT (Debian based) and DNF (Fedora). These packaging systems have significantly reduced the complexity of installing new packages for those operating systems. We are aiming to do the same thing for Kubernetes, and Carvel packages are our way of achieving this. You can create your own packages or select from a list provided in community package repositories. 

I am personally very excited about this and am looking forward to seeing what great packages the community will create. At VMware, we are also the stewards of the very popular [Bitnami](https://bitnami.com/) set of packages that are wildly popular. Look for more great things to come here.

## KubeApps

[KubeApps](https://kubeapps.com/) is a dashboard that surfaces and presents the Bitnami Application Catalog of software to developers. By installing KubeApps into your Tanzu Community Edition cluster, you will instantly have access to a plethora of tools ranging from databases to memory caches, all while leaving the heavy lifting to the Bitnami team. Oh, and by the way, did you know the Bitnami team is part of the Tanzu engineering team at VMware?

I have only talked about a few of my favorite tools that I immediately begin using on a new Tanzu Community Edition cluster. The options for what you can do with this edition are limitless! 

Want to know the best part about all of this? Yeah, it’s freely available, open source software—and that is hugely important. You can use it locally or on large-scale clusters, completely free. You can think of it as one of the ways we’re giving back to the entire community that has played such a huge role in creating, maintaining, releasing, and supporting Kubernetes projects. But to me, what’s most important is the understanding that Tanzu Community Edition is VMware’s upstream expression of our enterprise-class Kubernetes software. This means that if the time comes that your application is wildly popular and you need enterprise support, we’ll have your back. For each of the upstream components, we have downstream offerings for your company or enterprise to satisfy your largest infrastructure and platform needs. It is important to know that the software you choose is open source while providing the capabilities to help if the time comes that you need it.

What are you waiting for? Download and try out [Tanzu Community Edition](https://tanzucommunityedition.io)!
