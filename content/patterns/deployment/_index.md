---
title: Deployment Pattern
featured: true
weight: 1

description: >
    Introduction
---

There are almost infinite ways to get code from a developer into production. In the most simple example, a website hosted on GitHub pages has one step-a developer commits code and the changes are reflected in production.
In most applications however, there are many more steps between the developer and the results being live in production, and they can vary from application to application and are different ways to assemble a deployment pattern.

A deployment pattern generally contains elements from four key areas.

 ![img](/images/patterns/deployment/path-to-prod-1.png)

Each of these areas satisfies different requirements based a particular application's needs. For applications like human resource systems, compliance and audit is crucial, while for a mobile website, continuous integration and rapid deployment are most important.

 ![img](/images/patterns/deployment/path-to-prod-2.png)

What kind of tools are needed to meet these requirements in those areas? Which users will directly interact with or manage which tools?

 ![img](/images/patterns/deployment/path-to-prod-3.png)

From a developer's perspective, the items are the left are top of mind because they use them on a daily basis but there are a lot of components on the right-hand size that can be a necessity before going into production. For this pattern, this is where there will be deeper dives on each of these areas and tools, but examples of this pattern where these components are brought together to deliver code from commit to production.