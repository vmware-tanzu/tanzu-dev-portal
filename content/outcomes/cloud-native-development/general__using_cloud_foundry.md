---
title: Using Cloud Foundry
weight: 50
layout: single
team:
 - VMware Tanzu Labs
---

VMware [Tanzu Application Service](https://tanzu.vmware.com/application-service) (TAS), formerly Pivotal Cloud Foundry (PCF), is a modern application platform conceived to provide best in class developer experience. It is based on Cloud Foundry, which is an open-source cloud app platform, providing a choice of clouds, developer frameworks, and app services. 

While we will be spending most of our time working on software code, it is essential to know how to use the VMware Tanzu Application Service (TAS) platform to deploy applications. Even more so, it is imperative to understand how to work with your own TAS environment. Every TAS installation operates the same way, but there are many ways to interact with it, and your company may have its own process for getting an account, orgs, and spaces, and apps up and running.

We will look to push the application to the platform as early as possible to get quick feedback on what is working or not. The primary ways you will work with the platform are the CLI and the apps manager web application.


## Command Line Interface (CLI)

The platform provides an API for interacting with it, and the simplest way to work with this is through the command-line tools provided by the Cloud Foundry project.

* Run through the "[Try Cloud Foundry](https://katacoda.com/cloudfoundry-tutorials/scenarios/trycf)" tutorial to set up your local command-line tools and get a local TAS test environment as a bonus. You will get a local test environment up and running and push a demo app, running through the common CLI commands.


## Apps Manager

TAS, VMware's enterprise-class distribution of Cloud Foundry, comes with many useful features that help companies provide easy access to their platform users. For software development teams, the primary application is Apps Manager. You can find more info on Apps Manager in its [documentation](https://docs.pivotal.io/application-service/2-11/console/dev-console.html).

Find out the URL for your development or sandbox TAS Apps Manager and try logging into this. Once you can access it, try pushing the same demo app from the TAS Dev tutorial above your company org and space. 


## Cloud Foundry Concepts
You may have already run into a handful of terms and concepts like "organizations", "spaces", and "instances" during the above exercises. 

- Read through [this overview of TAS for VMs](https://docs.pivotal.io/application-service/2-11/concepts/overview.html) for the birds-eye view of how the platform works.

#### Homework

- Run through the [Try Cloud Foundry](https://katacoda.com/cloudfoundry-tutorials/scenarios/trycf) tutorial
- Get access to your company's Apps Manager and push your application to your Company's TAS environment.
- Read through the [overview of TAS for VMs](https://docs.pivotal.io/application-service/2-11/concepts/overview.html) 


