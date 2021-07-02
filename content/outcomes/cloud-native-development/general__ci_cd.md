---
title: Continuous Integration and Delivery
weight: 60
layout: single
team:
 - VMware Tanzu Labs
---

Automate everything. Any time we have manual processes or required intervention, we have friction in the machinery that allows us to release fast at a moment’s notice. There are many tools to support continuous build, integration, and delivery of software. We typically use the Jenkins or Concourse CI platforms, but you can also use Atlassian Bamboo or cloud build provides such as CircleCI, TravisCI, or Oracle Container Pipelines. Your company may already have selected the tool we will use.

While we can work with many of these tools, Concourse provides one of the purest abstractions of declarative pipelines and is our preferred tool when there is not already a solution in place. It is beneficial to run through the [Learning Concourse tutorial](https://github.com/concourse/concourse/wiki/Tutorials) to get an idea of the core tenets of building with pipelines checked into your source control along with your application. Even if we end up building your applications on Jenkins or another application, we will use Concourse’s concepts to talk through the various challenges and solutions to continuous software delivery.


#### Homework

- Run through the [Learning Concourse tutorial](https://github.com/concourse/concourse/wiki/Tutorials).


#### Additional resources

- Review the [Introduction of Secure Software Supply Chains](/outcomes/secure-software-supply-chain/what-is-ci-cd/).