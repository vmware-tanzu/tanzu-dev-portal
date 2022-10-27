---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: Collaboration When Prioritizing a Thin Slice of Functionality
weight: 30
tags: []
---

In this lesson, we'll look at how to decide what to work on and what role each team member plays in those decisions.

Swift seeks to avoid the high-risk, high-cost, long timeline of "change it all" modernization programs. Instead, one of the goals of Swift is to choose just the right amount of work to do along the journey. As such, prioritizing, picking, and ordering the work is one of the most important parts of Swift. In Swift, all members of the team take part in this prioritization.

“Isn't it Product's responsibility to prioritize what the team should work on next?” That’s probably what you’re thinking, followed by, “What role do architects and developers have in prioritizing work?” These are very good questions.

While it is ultimately up to product management to prioritize work, they shouldn't do it alone or in a vacuum. Good prioritizing takes into account not only clearly defined business goals, but also lots of technical input and recommendation. Let’s take a closer look at each of the roles in this stage of the modernization journey.


## Architects

Architects have a unique role in prioritizing a thin slice of functionality. Because architects focus on the big picture, the "systems of systems," they have a wider context of what each team is working on. This means that architects are aware of integrations and dependencies between teams that each team may not be aware of. As needed, the architect can help the product manager understand these dependencies and prioritize them. 

The architect advocates for the system as a whole, not just the software the team is working on. By taking a system-level view, the architect doesn’t necessarily have the most up-to-date perspective on what’s valuable to a product team working in a more bounded scope. For example, a team building a UI application may want to prioritize certain aspects of that work that help them get important feedback about their design from their users. That work may be less valuable to the system design as a whole: the new work won’t add new capabilities to the system, but that’s OK. The system-level perspective is just one way of examining the value of new activities.

On the other hand, when a product team has a set of features that they consider to be somewhat equal in value, an architect can provide valuable feedback around which of those features might be more important to the system as a whole, and “break the tie.” For example, a team building an API might not understand the system-level value of creating some API endpoints they don’t plan to use themselves but which other teams might be critically reliant on. This might be especially true for events that they broadcast outward to downstream consumers. Also, architects usually are looking out for the long-term sustainability of the entire codebase and system and will sometimes be a strong advocate for taking longer to do the right thing first rather than taking short cuts: measure twice, cut once.


## Developers

When prioritizing thin slices of functionality, developers help by providing the feasibility perspective and how much effort a team might expect to complete the work. The amount of effort required does not have to be completely accurate in terms of time required to complete. The amount of effort should be described in relative terms in relation to other thin slices. Using the 2x2 prioritization matrix will help the team figure out which thin slice they should prioritize.

📌  Example: If there are five defined thin slices, create a 2x2 diagram, write one of the thin slices on a sticky and put it in the middle of the axis for effort. Write another one of the thin slices on another sticky and put it along the axis of effort in relation to the first sticky. Repeat this process until all your thin slices have been estimated in terms of the expected effort. 

A development team may have its own goals to deliver value to the end user for a component they have developed. This team-level goal may not be known to architects. For example, the team may want to add feedback mechanisms and UI tracking to give them data about how people use their app in order to fine-tune the UI. When architects come to the team with the next service or slice to be developed, it may conflict with the team’s goals. That work may be less valuable to the system design as a whole. While the work planned by the team won’t add new capabilities to the system as a whole, it is OK to continue the work if the team feels it is of the same relative value. 

💁 Tip: When a similar situation arises where the team deems that their own work is of the same relative value as the system-level work, be sure to communicate to architects and the product team about why the team has made this decision and what the impact will be for the team to prioritize their backlog. 


## Product

At this stage, the main focus of a product manager is to determine the priority of each of the thin slices to be developed. The priority is determined based on a few factors, such as desirability from the user, which thin slice should be built as a prerequisite for future slices, technical feasibility, and value to the business. This process is a collaborative effort with architects, developers, and business leaders.

📌 Example: The first thin slice of functionality could be a successful end-to-end process, transaction, or user journey with no exceptions, errors, or edge cases—the proverbial "happy path" of the system. 

Some questions that product managers would be asking during this process include:



* What are the riskiest assumptions in our design that needs to be validated?
* What is the lowest-hanging fruit that we can get user feedback on to validate our assumptions?
* What are the trade-offs between [technical debt](https://tanzu.vmware.com/developer/guides/the-incremental-war-against-technical-debt/) and a foundation to enable smoother future development? And is this delay acceptable for the product?
* How do these thin slices get us closer to achieving our business outcomes?
* What are the metrics of success? How do we measure them?

💁  Tip: Sometimes, conversations around the priority of the thin slices arise during [the Boris exercise](https://tanzu.vmware.com/developer/practices/swift-method/), or the team may discover ways to create a thinner slice from the existing thin slice. At this stage, the product manager should determine if existing priorities need to change in conjunction with a wider group (e.g., architects, product owners, portfolio managers, and developers).

Each thin slice should have a metric that tracks whether or not the development work is progressing toward the desired outcomes. For example, the time it takes for a restaurant to accept and deliver an order, or lower app response times. Other important metrics that could be discussed are:



* What is the definition of success for this thin slice?
* What kind of performance and load should the application(s) be able to operate under?
* What are the [SLOs or SLAs](https://tanzu.vmware.com/developer/learningpaths/application-observability/monitoring-slis-and-slos/) for the application(s)?
* What, if any, [SLIs](https://tanzu.vmware.com/developer/learningpaths/application-observability/monitoring-slis-and-slos/) should be set to ensure we are meeting our SLOs or SLAs?

💁 Tip: Discussions on operational standards, such as SLOs and SLAs, should be a team discussion led by developers and architects in order to determine both the needs of the business and the needs and technical capabilities or constraints of the system. If your organization has a platform team or system reliability engineering team, they should also be included in the discussion. Your architect can help facilitate.

In summary, architects and developers should provide recommendations that take advantage of their implementation perspective. For example, they could suggest a certain order based on the chronological order of the system events. The product manager then balances the recommendations with the business value of each thin slice and prioritizes work based on what would provide the most value to the end user.


## Resources

[2x2 Prioritization | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/2x2/)

[SRE fundamentals: SLI vs SLO vs SLA | Google Cloud Blog](https://cloud.google.com/blog/products/devops-sre/sre-fundamentals-sli-vs-slo-vs-sla) 