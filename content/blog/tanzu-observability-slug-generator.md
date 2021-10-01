---
date: 2021-04-15
description: Announcement for the open sourcing of code that generates Tanzu Observability
  URL
featured: false
lastmod: '2021-04-16'
patterns:
- Deployment
tags:
- Microservices
- Observability
- Spring
- Spring Boot
- Wavefront
team:
- Dan Florea
title: Introducing the Tanzu Observability Slug Generator
---

A great feature of [Tanzu Observability](https://tanzu.vmware.com/observability) is that all context about the chart or dashboard that you are looking at is encoded in the URL, which makes it easy for you to share those links with your colleagues and to deep link into our product from other places such as wiki pages. A consequence of this is that the URL slug is rather involved. This is not a problem when the UI generates the URL, but it becomes very tedious when customers try to create the URL on their own in order to automate and embed Tanzu Observability charts and dashboards outside of the product itself.

To help customers take better advantage of Tanzu Observability charts and dashboards as well as allow easier automation and customization, we recently open sourced our Tanzu Observability URL slug generation code. This code lets you programmatically generate links to charts and dashboards that you can then embed wherever you like to give users an easy to find view of the metrics that matter to them.

## What is a URL Slug?

If you are not familiar with a URL slug, it is the last part of a URL that comes after the domain name. For example: 

https://www.vmware.com/company.html

In the URL above, “company.html” is referred to as the URL slug.

In some cases, the URL slug is relatively simple. In the case of a Tanzu Observability chart or dashboard, a lot of information is encoded in the slug which makes it difficult for humans to parse and even trickier to generate. For example, a Tanzu Observability slug might looks like the following:

`(c:(b:1,id:chart,n:Chart,ne:!t,s:!((n:source,q:'ts(metrics)',qb:!n,qbe:!f)),smp:off),g:(c:off,d:7200,g:auto,s:1373948820),t:customer)`

Luckily, you do not have to parse URLs manually. But at times, it can be convenient to generate a Tanzu Observability dashboard or chart in code and this is where the open sourced library comes in.

## Where to Find the Code?

The open sourced URL slug generation code can be found in the [VMware Tanzu GitHub organization](https://github.com/vmware-tanzu/tanzu-observability-slug-generator)

Note that previously open sourced code can be found under [Wavefront in GitHub](https://github.com/wavefrontHQ). 

## How to Get Started

Complete instructions to use the code can be found in the [README.md file in the GitHub directory](https://github.com/vmware-tanzu/tanzu-observability-slug-generator/blob/main/README.md).

The README file includes information about prerequisites for Maven and Gradle as well as instructions on how to create chart and dashboard slugs. 

## Conclusion

Generating Tanzu Observability URL slugs can be cumbersome and error prone. With the newly open sourced URL slug generation code, you can easily and automatically generate URL slugs and embed charts and dashboards in the pages that make the most sense for your business.

## Links

- [Try Tanzu Observability and get started today](https://tanzu.vmware.com/observability-trial)

- If you are a Spring developer, take a look at the [guide for Tanzu Observability](https://spring.io/guides/gs/tanzu-observability/) as well as our guide on [Getting Started with Wavefront for Spring Boot](https://tanzu.vmware.com/developer/guides/spring/spring-wavefront-gs/)

- [Get started with generating URL slugs](https://github.com/vmware-tanzu/tanzu-observability-slug-generator)