---
date: '2021-02-11'
description: A set of lightweight techniques using agile and Domain Driven Design
  (DDD) principles that help teams plan enough to start modernizing software systems
image: swift-method/swift.png
lastmod: '2021-03-04'
length: 2-4 days if done end-to-end
participants: Business stakeholders, architects, technical leads, developers
tags:
- Kickoff
- Discovery
- Framing
- Modernization
title: Swift Method
what:
- Sticky arrow flags
- Whiteboard tape - black, green, red; 2 rolls of each
- Scissors
- Scotch tape
- Dry Erase Surface (3 ft x 2 ft)
- Super sticky 4x6 multicolor sticky notes, 4 pack
when:
- Jumpstart application modernization initiatives in an iterative fashion. This is
  the core method of the [App Navigator](https://tanzu.vmware.com/application-modernization),
  which can be a short consulting engagement that quickly reviews current business
  functionality and plans “to be” architecture. Our experts practice the Swift method
  to discover architecture, boundaries, points of risk or concern, and then map a
  direction to move from current state to future state.
why:
- Align business leaders and technical practitioners. Use this approach to break down
  a system of systems, and develop a notional architectural plan that maps future
  goals with the way the system “wants to behave.” We’ve found this to be especially
  important for critical systems modernization. - Inform decisions on how to organize
  development teams, and prioritize work from both a business and technical perspective.
  It’s also helpful as a “catch-all” way to define a path between the status quo and
  the desired state.
---

## How to Use this Method

{{% section %}}
### Sample Agenda & Prompts
1. [Event Storm](/practices/event-storming) the system, using language that business and technical people understand.

1. Conduct a [Boris](/practices/boris) exercise that models the relationships between capabilities in a system. Conduct a SNAP that documents the technical capabilities identified during Boris in real time.

    ![SNAP analysis](/images/practices/boris/snap.jpg)

1. Identify thin slices of modernization.

   Thin slices are short domain event flows. Vertical slices are identified by choosing short, domain event flows in the core domain and leveraging the services coming out of [Boris](/practices/boris) to produce those events. Think of them as the architectural components required to produce those events. Thin slices are informed by [Event Storming](/practices/event-storming), [Boris](/practices/boris) and SNAP activities.
   {{% callout %}}
   Tip: A vertical slice touches every layer of the architecture but implements only a sliver of functionality. For example, the vertical slice, “Allow a user to login with a password,” might add username and password fields to a user interface, implement server-side logic, and update the last login field on the database record. Slicing vertically is one of the toughest mind shifts to make for a team new to agile because it requires developers to interact with areas of the app with which they may be less familiar.
   {{% /callout %}}

1. Prioritize the thin slices, with an eye to balancing business value, technical risk, and effort. The goal is to incrementally move the system toward behaving “the way it wants to;” the implementation of each successive slice gets us that much closer to this goal.

1. The thin slices become actionable when captured in the backlog as MVPs (Minimum Viable Products) or collections of stories. In some cases, VMware Tanzu Labs will partner with the customer team to identify and prioritize the thin slices, with an eye to balancing business value, technical risk, and effort.
   {{% callout %}}
   Tip: In order to determine the right MVPs for your system you have to consider thin vertical end to end slices where these domains interact with one another. The MVPs map a path from ["strangling the monolith"](https://tanzu.vmware.com/content/blog/strangling-a-monolith-by-focusing-on-roi) and leveraging tactical patterns to interact with the new domains and services.
   {{% /callout %}}

1. As you define the slices, leverage tactical implementation patterns  like <a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer" target="_blank">anti-corruption layer</a>, <a href="https://en.wikipedia.org/wiki/Facade_pattern" target="_blank">Facade</a>, <a href="https://www.swiftbird.us/docket-choreography" target="_blank">Docket Based Choreography</a>, and <a href="https://martinfowler.com/bliki/StranglerFigApplication.html" target="_blank">Strangler</a> so that the newer or strangled services coexist together with the older legacy system

1. Create a backlog of prioritized user stories tied back to ***goals*** (practice coming soon) / OKRs. Map user stories to MVP or releases.

   {{% callout %}}
   Tip: User story impact mapping is a technique that can be applied for mapping stories to MVPs and releases. Here's a <a href="https://blog.eriksen.com.br/en/mapping-domain-knowledge" target="_blank">blog post</a> that explains how to combine User Story Mapping with DDD.
   {{% /callout %}}
1. Start hands-on experimentation, feedback, and iterative progress.
{{% /section %}}

{{% section %}}
### Success/Expected Outcomes
- Quickly discover current system capabilities, create an aspirational target architecture, identify underlying areas of concern and agree on prioritization
- Discuss and understand notional solutions, tactical fixes, potential trade-offs, framed in an incremental, measured way
- Architectural work to validate / invalidate assumptions and help inform solutions / fixes
- Develop approach to incrementally modernize services
- Definition of solution(s) with associated business outcomes using an “everything on the table” approach
- A  plan of tactical steps that starts small, scales & enables customer developers and architects to move forward confidently.
{{% /section %}}

{{% section %}}
### Facilitator Notes & Tips

A good facilitator should be able to drive out how a system should be designed based on supporting the business capabilities from a DDD perspective.

This notional architecture now represents a good first cut direction of the system. When used as a tool for modernizing existing systems, [Boris](/practices/boris) reveals the likely target architecture. Other activities in the Swift Method help define how to get from Current State to Modernized.
{{% /section %}}

{{% section %}}
### Related Practices
Swift Method contains many activities, including:

- [Event Storming](/practices/event-storming)
- [Boris](/practices/boris)
{{% /section %}}

{{% section %}}
### Real World Examples

See the <a href="https://miro.com/app/board/o9J_kzaSk0E=/" target="_blank">Event Storming and Boris Training Miro board</a> for a detailed description of [Boris](/practices/boris) and the Swift Method of modernization for an Uber Eats-style application

![Visual of the Swift Method's various steps and how they flow into one another](/images/practices/swift-method/example-1.png)
{{% /section %}}

{{% section %}}
### Recommended Reading

<a href="https://tanzu.vmware.com/content/white-papers/tackle-application-modernization-in-days-and-weeks-not-months-and-years" target="_blank">Tackle Application Modernization in Days and Weeks, Not Months and Years</a> (white paper)

<a href="https://www.youtube.com/watch?v=7-fRtd8LUwA" target="_blank">Swift Method: Event Storming, Boris the Spider and Other Techniques</a> (YouTube video) talk at ExploreDDD 2019 by Shaun Anderson

<a href="https://www.youtube.com/watch?v=s5qeE4qii6M" target="_blank">A Deep Dive into Modernization Patterns to Get Your Mission Critical Applications to the Cloud</a> (YouTube video)

<a href="https://tanzu.vmware.com/content/slides/the-modern-family-modernizing-applications-to-pivotal-cloud-foundry-getting-out-of-the-big-ball-of-mud" target="_blank">Tools to Slay the Fire Breathing Monoliths in Your Enterprise</a> (blog post)

<a href="https://www.eventstorming.com/" target="_blank">EventStorming.com</a> (website)
{{% /section %}}