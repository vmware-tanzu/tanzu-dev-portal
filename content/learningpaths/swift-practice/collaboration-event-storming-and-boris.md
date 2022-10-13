---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: Collaboration During an Event Storm and Boris Exercises
weight: 20
tags: []
---

The first lesson in the learning path was a high-level overview and gave you an idea of the approach that Swift takes: understanding the business processes that your software supports and doing the work to create an incremental plan for modernizing monoliths. In this lesson, we look at the roles that each person—architect, developer, and product manager—takes in the Swift process.

The event storming and Boris workshops can feel a little chaotic. At times, it might feel like everyone is stepping on each other’s toes, and at other times, it might feel like people don’t know who should speak up. In this post, we’ll look at how architects, developers, and product managers collaborate during an event storm and Boris workshop.


## Architects

The architect naturally takes an abstract, system-level view to the design. During an event storm, they might be asking:



* Does the system perform the needed functions, and does it follow required policies, such as security and regulations?
* Are we dividing the system into the appropriate components, i.e., do the boundaries between contexts make sense?
* Are real-world constraints pushing the high-level design in a new direction?
* Is everyone using the same terms, jargon, and definitions to communicate so that we're establishing a shared language and understanding of the system?

When analyzing particularly complex parts of the system, an architect and a developer might “zoom in” to that subdomain or subsystem and work closely with developers. The architect then takes that deeper understanding and explores how changes will affect the design of the overall system. 

The developer then brings that understanding into a team-level work planning session to ensure they're doing the proper integrations with other parts of the system.

A product manager and an architect might collaborate by trying to further divide the system into coherent parts by finding subsystems that provide a discrete unit of business value.


## Developers

During an event storm, a developer might be asking, “Is it technically possible to build each piece of the new system?” The developer takes a component-level view of the design, verifies the architecture, and starts planning for how it will be implemented with probing questions like:



* What is a feasible tech stack for each component?
* Do any of the dependencies in the system require complex integrations?
* Are there any clear technical blockers to getting started?

Developers should take note of integration points with other components or systems that the target system will have to accommodate. A developer might also analyze their area of the system more deeply for dependencies that require coordination with other teams before starting.


## Product

During an event storm, a product manager might ask, “are we working on the right things?” The product manager is predisposed to a concrete, business value-driven perspective on the design. This includes asking questions like:



* Are real-world constraints being accounted for in the design?
* Where should the team start?
* What’s the first outcome we should work toward?

📌  Example: A product manager might meet with the architect to discuss the complexity of the work ahead and what makes most technical sense to start. A product manager and the architect will collaborate to find the balance point between the outcomes achieved versus the technical feasibility.

Product managers can also help by starting conversations that challenge the design:



* “What if…?” questions can drive out edge cases for the “happy path” or runtime resiliency. Back to the food ordering example, we incur a dependency on the accounting department to calculate the total number of orders from each kiosk. The “what if” scenario is if the kiosk is not available and how do we reconcile for the day.
* “How will we know if…?” questions often find observability and metrics requirements. How will we know if the kiosk is successfully processing payments and performing the functions in a timely manner?

Also, product managers can help keep the meeting focused when the conversation derails by gently nudging the room back toward the most valuable topics, with questions like:



* Does this need to be decided now?
* Will this impact the overall design?
* Do we have all of the information we need to make this decision?


## All roles

Each role applies their specialist knowledge to the process, but every role shares a common set of responsibilities in the Swift workshops, such as:



* Are the right people in the room?
* Is everyone fully engaged and able to contribute?
* What can we do next to learn more about any looming uncertainties?

The outcome you are aiming for in doing the event storm and Boris exercises is for everyone on the team to:



* Be confident in explaining the business process 
* How to support that process with a new, notional architecture 
* Actionable next steps for each person involved

What you are working toward is a shared understanding of the business process and problem, ubiquitous language, and agreement on the notional solution or architecture.

In lesson 3 of this series, we’ll dive deeper into how a team might collaborate in prioritizing thin slices of functionality to create a roadmap for modernization.


## Resources

[Event Storming | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/event-storming/)

[Boris | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/boris/)

[Ubiquitous Language | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/ubiquitous-language/)