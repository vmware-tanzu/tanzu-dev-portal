---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Continuous Integration and Delivery
weight: 60
---

Automate everything. Any time we have manual processes or required intervention, we have friction in the machinery that allows us to release fast at a moment’s notice. There are many tools to support continuous build, integration, and delivery of software, and your company may already have selected the tools to use. This is usually the [Jenkins](https://www.jenkins.io/) or [Concourse CI](https://concourse-ci.org/) platforms but can include [Atlassian Bamboo](https://www.atlassian.com/software/bamboo), or cloud build provides such as [CircleCI](https://circleci.com/), [TravisCI](https://travis-ci.org/), or [Oracle Container Pipelines](https://docs.oracle.com/en/cloud/iaas-classic/wercker-cloud/index.html).

While we can work with many of these tools, Concourse provides one of the purest abstractions of declarative pipelines and is our preferred tool when there is no solution in place. It is beneficial to run through the [Learning Concourse tutorial](https://github.com/concourse/concourse/wiki/Tutorials) to understand the core tenets of building with pipelines checked into your source control along with your application. Even if you end up building your applications with Jenkins or another tool, Concourse’s core concepts are great for discussing the various challenges and solutions to continuous software delivery.

#### Homework

- Run through the [Learning Concourse tutorial](https://github.com/concourse/concourse/wiki/Tutorials).

#### Additional resources

- Review the [Introduction of Secure Software Supply Chains](/outcomes/secure-software-supply-chain/what-is-ci-cd/).