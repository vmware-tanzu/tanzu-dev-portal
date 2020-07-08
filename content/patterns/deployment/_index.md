---
title: Deployment and Packaging
featured: false
weight: 1
description: >
    From commit to production—see how code gets from a laptop to running live in production.
---

There are seemingly infinite ways to get code from a developer into production. In the simplest example, a website hosted on GitHub pages has a single step—a developer commits code—and the changes are reflected in production. In most applications, however, there are many more steps between the developer and the results being live in production, and they can vary from application to application. There numerous are different ways to assemble a deployment pattern.

A deployment pattern generally contains elements from four key areas.

 ![img](/images/patterns/deployment/diagrams/path-to-prod-1.png)

Each of these areas satisfies different requirements based on a particular application's needs. For applications like human resource systems, compliance and audit is crucial, whereas for a mobile website, continuous integration and rapid deployment are most important.

 ![img](/images/patterns/deployment/diagrams/path-to-prod-2.png)

What kind of tools are needed to meet the requirements of those areas? Which users will directly interact with or manage which tools?

 ![img](/images/patterns/deployment/diagrams/path-to-prod-3.png)

From a developer's perspective, the items on the left are the most important, because developers use them on a daily basis. But there are a lot of components on the right-hand side that can be necessary before going into production. When it comes to this particular pattern, that is where there will not only be deeper dives on each of these areas and tools, but also examples of where these components are brought together to deliver code from commit to production.