---
title: Using Cloud Foundry
weight: 50
layout: single
team:
 - VMware Tanzu Labs
---

> WIP: To be updated to TAS instead of PCF. Also check the links!

While we’ll be working primarily on the applications themselves to get them ready to run in PCF, it’s important to know how to work with the platform itself from the perspective of an application developer. Even more so, it’s important to know how to work with your PCF environment - every PCF installation operates the same way, but there are many ways to interact with it and your company may have its own process for getting an account, orgs and spaces, and apps up and running.
We’ll look to push the application to the platform as quickly as possible in order to get quick feedback on what’s working and what’s not. These are the primary ways you’ll work with the platform:

## CLI
The platform provides an API for interacting with it, and the simplest way to work with this is through the command-line tools provided by the Cloud Foundry project. Run through the [Try PCF on Your Local Workstation with PCF Dev](https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/introduction) tutorial to set up your local command-line tools and get a local PCF test environment as a bonus. You’ll get a local test environment up and running and push a demo app, running through the common CLI commands.

## Apps Manager
Pivotal’s version of Cloud Foundry comes with a handful of useful web applications that help a company provide easy access to their platform users. For software development teams, the primary application is App Manager. This won’t be available on the PCF Dev local test environment you set up previously (or in any non-Pivotal or open-source Cloud Foundry environments), but you probably have access to it within your company in preparation for the upcoming engagement. Find out the URL for your development or sandbox PCF Apps Manager and try logging into this. Once you’re able to access it, try pushing the same demo app from the PCF Dev tutorial above to your company org and space. You can find more info on Apps Manager in [their documentation](https://docs.pivotal.io/pivotalcf/2-2/console/index.html) .

## Cloud Foundry Concepts
You may have already run into a handful of terms and concepts like “organizations”, “spaces”, and “instances” during the above exercises. Read through [this overview of Cloud Foundry](https://docs.pivotal.io/pivotalcf/2-2/concepts/overview.html) for the birds-eye view of how the platform works.


#### Homework

- [x] Run through the [Try PCF on Your Local Workstation with PCF Dev](https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/introduction) tutorial
- [x] Get access to your company’s Apps Manager and push your application to your Company’s PCF environment.
- [x] Read through the [overview of Cloud Foundry](https://docs.pivotal.io/pivotalcf/2-2/concepts/overview.html) 

