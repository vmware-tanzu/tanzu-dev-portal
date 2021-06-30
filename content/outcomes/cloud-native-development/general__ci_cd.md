---
title: Continuous Integration and Delivery
weight: 60
layout: single
team:
 - VMware Tanzu Labs
---

<<<<<<< HEAD
Automate everything. Any time we have manual processes or required intervention, we have friction in the machinery that allows us to release fast at a moment’s notice. There are many tools to support continuous build, integration, and delivery of software. We typically use the Jenkins or Concourse CI platforms, but you can also use Atlassian Bamboo or cloud build provides such as CircleCI, TravisCI, or Oracle Container Pipelines. Your company may already have selected the tool we will use.
=======
Automate everything. Any time we have manual processes or required intervention, we have friction in the machinery that allows us to release fast at a moment’s notice. There are many tools to support continuous build, integration, and delivery of software, and your company may already have selected the tool we will use. This is usually the [Jenkins](https://www.jenkins.io/) or [Concourse CI](https://concourse-ci.org/) platforms but can include [Atlassian Bamboo](https://www.atlassian.com/software/bamboo), or cloud build provides such as [CircleCI](https://circleci.com/), [TravisCI](https://travis-ci.org/), or [Oracle Container Pipelines](https://docs.oracle.com/en/cloud/iaas-classic/wercker-cloud/index.html).
>>>>>>> 244d986b9dee0e461cd063af7babd7b86e487dff

While we can work with most of these tools, Concourse is our preferred tool when there isn't a solution already in place because it provides one of the purest abstractions of declarative pipelines. 

To get an idea of the core tenets of building with pipelines checked into your source control along with your application, review the [Concourse tutorial](https://concoursetutorial.com/) by Stark & Wayne. 

We always apply Concourse concepts when talking through the various challenges and solutions of continuous software delivery, whether we use Jenkins or one of the other platforms to build your applications.


#### Homework

- Run through the [Concourse Tutorial](https://concoursetutorial.com/).
