---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: A Practitioner's Introduction to Modernizing Monoliths with Swift
weight: 10
tags: []
---

## Event storm

Before you even start to think about how a modern system might be architected, you must know the business needs that the system needs to support. The software exists to support real-world events that occur in the daily operations of a business. There is no point in creating software that doesn’t line up with what happens in the physical world.

When it comes to understanding software, it's helpful to think in terms of the series of events that occur in the business, using a _shared language_ that bridges the business and technical contexts. These events drive architectural aspects of the system design: domains, bounded contexts, and services of a system.

For example, let’s say you want to model the business process around designing a self-serve kiosk at a fast-food restaurant. You might identify events around creating an order for each person; adding the type of burger, sides, and drink to that order; queuing up the multiple orders received for the kitchen; and notifying the customer when their order is ready for pickup. Analyzing the domain at this level makes it possible to model new flows and ideas, synthesize knowledge, and facilitate active group participation without conflict in order to ideate the next generation of a software system.

A successful event storm will produce the following outcomes:



* A shared language between the business and technical contexts
* Bounded contexts and aligned domains
* Mappings between each bounded context and organizational areas of the business
* Services in the software architecture that represent each bounded context or subdomain, such as an order service and a kitchen service


## Boris + SNAP

Attempting to model the entire notional architecture often results in analysis paralysis. Most likely, the event storm has revealed what we call _thin slices_: starting points for rearchitecting the system that achieve a partial, yet tangible, modernization outcome. We like to differentiate these thin slices as system-level outcomes, versus something like a minimum viable product (MVP), which is a related concept at the product level.

We use Boris to model the interactions between bounded contexts, identified in the event storm, within a complex system to reveal the notional target system architecture within the thin slice. At this level, we’re trying to:



* Identify and name the interactions that are taking place (e.g., “create an order” or “order completed”)
* Indicate whether these interactions are inherently synchronous or asynchronous in nature

For example, a thin slice for designing a self-serve kiosk at a fast-food restaurant might look like the ability to create an order with all the selected products by the diner that the kitchen sees and can complete. Boris identifies how the order and kitchen-bounded contexts will negotiate the flow of information between these bounded contexts.

Concurrent to Boris, SNAP is used to quickly document the services needed to implement the notional architecture discovered by Boris. Information is often grouped into APIs, data, pub/sub, external systems/UI, stories, and risks. The key artifact is a poster-size sticky paper on a conference room wall or similar from a digital workspace, with one SNAP per node or service depicted on Boris. 

A successful Boris and SNAP will produce the following outcomes:



* Identify and model the relationships between services and bounded contexts while avoiding pitfalls such as premature solutioning
* Start to document the information about each service, such as API endpoints, the types of data handled by the service, pub/sub information, etc.
* Identify potential downstream impacts that may be external to the team
* Identify specialized knowledge and proverbial "gotchas" that can only be known if you’ve worked in the system for a long time
* Surface risks earlier that may have otherwise not been known until coding begins


![Diagram of the Boris + SNAP process](/learningpaths/swift-practice/images/image1.png)

Once completed, a series of successful Swift workshops will produce the following outcomes:

* A shared language between the business leaders and technical practitioners
* A shared understanding of the business context and technical solutions supporting the business
* A notional architecture model that starts small and incrementally builds toward a new system
* Alignment between business leaders and technical practitioners.


## Modernize software with business-driven analysis and incrementally transform your software

In our experience after working with hundreds of organizations, Swift is a powerful technique that makes the modernization journey more enjoyable, manageable, and effective. We have additional posts featuring tips and examples of how developers, architects, and product managers/owners collaborate throughout Swift's different stages of modernizing a system.


## Resources

[Breaking Down a Monolith into Microservices](https://tanzu.vmware.com/developer/guides/deconstructing-the-monolith/)

[Event Storming | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/event-storming/)

[Boris | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/boris/)

[Modernize Monolithic Apps with VMware Tanzu Labs](https://tanzu.vmware.com/content/infographics/modernize-monolithic-apps-with-vmware-tanzu-labs)