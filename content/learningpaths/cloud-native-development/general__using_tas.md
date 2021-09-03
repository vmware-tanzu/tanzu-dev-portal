---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Using Tanzu Application Service (TAS)
weight: 50
---

VMware [Tanzu Application Service](https://tanzu.vmware.com/application-service) (TAS), formerly Pivotal Cloud Foundry (PCF), is a modern application platform that provides a best-in-class developer experience. It is based on Cloud Foundry, an open-source cloud app platform providing a choice of clouds, developer frameworks, and app services.

Even if you spend most of your time working on software code, it is essential to know how to use the TAS platform to deploy applications. Even more so, it is imperative to understand how to work with your own TAS environment. Every TAS installation operates the same way, but there are many ways to interact with it. Your company may have its own process for getting an account, organizations, spaces, and apps up and running.

It's important to push the application to the platform as early as possible in order to get quick feedback on what is working and what is not. The primary ways to work with the platform are the Command Line Interface (CLI) and the apps manager web application.

{{% callout %}}
Note: At the time of writing, VMware is still transitioning from Cloud Foundry to Tanzu tools and nomenclature. In this article you should expect to see a mix of Cloud Foundry and TAS references, such as the `cf` command line interface. 
{{% /callout %}}

## Command Line Interface 

The platform provides an API for you to interact with it. The simplest way to work with the API is through the command-line tools provided by the [Cloud Foundry](https://www.cloudfoundry.org/) project.

Note: Run through the [Try Cloud Foundry](https://katacoda.com/cloudfoundry-tutorials/scenarios/trycf) tutorial to set up your local command-line tools and get a local TAS test environment as a bonus. You'll get a local test environment up and running, then push a demo app running through the common CLI commands.


## Apps Manager

TAS, VMware's enterprise-class distribution of Cloud Foundry, has many useful features to help companies provide easy access to their platform users. For software development teams, the primary application is Apps Manager. For more information, go to the Apps Manager [documentation](https://docs.pivotal.io/application-service/2-11/console/dev-console.html).

Find the URL for your development or sandbox TAS Apps Manager and try logging into it. Once you can access it, try pushing the same demo app from the TAS Dev tutorial above your company org and space. 


## TAS and Cloud Foundry Concepts

You may have already run into terms and concepts like "organizations", "spaces", and "instances" in the above exercises. 

- Read [this overview of TAS for VMs](https://docs.pivotal.io/application-service/2-11/concepts/overview.html) for a birds-eye view of how the platform works.


## Homework

- Run through the [Try Cloud Foundry](https://katacoda.com/cloudfoundry-tutorials/scenarios/trycf) tutorial.
- Get access to your company's Apps Manager and push your application to your Company's TAS environment.
- Read through the [overview of TAS for VMs](https://docs.pivotal.io/application-service/2-11/concepts/overview.html).