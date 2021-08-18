---
date: '2020-05-06'
description: Looking to decompose a monolith? This guide provides expert tricks and
  tips to break down monoliths into microservices.
lastmod: '2021-03-07'
linkTitle: Breaking Down a Monolith
metaTitle: Breaking Down a Monolith
patterns:
- API
tags:
- Microservices
- API
team:
- Nate Schutta
title: Breaking Down a Monolith into Microservices
topics:
- Microservices
weight: 3
oldPath: "/content/guides/microservices/deconstructing-the-monolith.md"
aliases:
- "/guides/microservices/deconstructing-the-monolith"
level1: Modernizing Legacy Applications
level2: Deconstruction
---

There is a pretty good chance more than a few people in your organization are talking about microservices these days. Perhaps you’ve noticed more copies of Eric Evans’ [Domain-Driven Design](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215), or maybe they’ve taken a [training course](http://www.wmrichards.com/microservices-architecture.html) or two. And while there are ample [resources](https://martinfowler.com/microservices/) to help you understand the nuances of a suite of small focused services, most start from, well, greenfield development. Much as physicists are first taught to “[ignore air resistance](https://www.forbes.com/sites/chadorzel/2015/09/29/the-annoying-physics-of-air-resistance/#38a1ab0e718a)” software prognostication often ignores the reality facing every organization - the entrenched portfolio of heritage applications that make up the bulk of every company’s IT environment. While it is tempting to nuke and pave, you have to face the facts, these applications are powering your business and you must chart a path forward.

{{< tweet 1229184287867428864 >}}

## What is a microservice?

There are nearly as many definitions of a microservice as there are developers touting them as miracle cures. Before delving further, the key definition is the one inside the walls of *your* organization. Whether it adheres to the Platonic ideal form of a microservice isn’t nearly as important as getting everyone on the same page. There is a reason why a glossary is often one of the most important artifacts in any project room.

> If you’ve already debated tabs vs spaces, consider touching off a [discussion around the definition](https://mobile.twitter.com/littleidea/status/500005289241108480) of a microservice. Consider removing sharp objects, it may devolve rapidly. Microservices really are in the eye of the beholder!

Ultimately, microservices are a reaction to monoliths and heavyweight [service oriented architectures](https://martinfowler.com/bliki/ServiceOrientedAmbiguity.html) as well as the capabilities of cloud environments. The issues with poorly structured monolithic architectures are legion, from low developer productivity caused by massive code bases to the inability to target compute resources to the bits that need more performance, there are no shortage of headaches. Software is not immune to the [second law of thermodynamics](https://www.grc.nasa.gov/WWW/K-12/airplane/thermo2.html), over time, the modularity of the monolith breaks down and it takes longer and longer to add new features and functionality.

> It should be stressed that monoliths span the continuum of modularity and they can actually be structured in such a way that they don’t suffer all of the maladies normally associated with the term “monolith”. You can apply [microservice design principles](https://twitter.com/simonbrown/status/962945350737825793?lang=en) to monoliths!

Personally, I am a fan of “something that can be rewritten in two weeks or less” since that reminds us microservices should be, well, small. Others are partial to saying any service built and maintained by a two pizza team. While I support two pizza teams, that definition won’t help you determine just how many services said team can support. Of course there is no stock answer to that question, it depends on the volatility of the services in question. If the microservices are stable, a two pizza team might be able to support ten or twenty however if the services are constantly changing, the exact same team might struggle with more than five!

Rather than debate terms, think in terms of characteristics, microservices are suites of small, focused services that embody the [Unix ethos](http://www.catb.org/~esr/writings/taoup/html/ch01s06.html) of small, focused tools that do one thing and do it well. Microservices should be independently deployable, independently scalable, and free to evolve at different rates. Developers are free to choose the best technology to build services around business capabilities. In a nutshell, microservices are an example of the zeroth law of computer science - high cohesion, low coupling...applied to services.

## What should be a microservice?

There is no doubt that microservices bring a host of benefits however, they come with added complexity. Teams should understand the trade-offs before blindly sprinting down a path that has the potential to make things worse. Repeat after me **not everything needs to be a microservice**! Please consider the following principles when considering microservices.

**Multiple Rates of Change**. In many systems, some parts change all the time while others haven’t been touched since the initial commit. If parts of your system evolve at different rates, microservices might help. Splitting out the more volatile pieces allows them to iterate faster enabling you to deliver business value quickly.

**Independent Life Cycles**. The monolith doesn’t turn on a dime but today you need to be nimble. Speed matters, your business partners may not be able to wait for a quarterly release window. Standalone microservices can have their own life cycle with their own repository and a separate deployment pipeline containing the appropriate tests and code quality scans allowing you to capitalize on new opportunities.

**Independent Scalability**. Monoliths often force you to make decisions early, when you know the least about the forces acting on your system. Your infrastructure engineers probably asked you how much capacity your application needs forcing a “take the worst case and double it” mentality leading to poor resource utilization. Instead of wild guesses, a microservice approach allows you to more efficiently allocate compute.

**Failure Isolation**. To [paraphrase a fictional mathematician](https://www.youtube.com/watch?v=dMjQ3hA9mEA), failure, uh, finds a way. Microservices can be used to isolate a dependency giving you a natural spot to build in proper failover mechanisms.

**Simplifying Interactions**. Microservices give you a natural indirection layer insulating you from external dependencies that change frequently or are complex to use. Essentially, your microservice implements the facade pattern.

**Polyglot Tech Stacks**. Monoliths forced a standardized, often lowest common denominator, technology stack regardless of the fit to purpose. Microservices give you the freedom to choose the right language or database for the business requirements rather than force a one size fits all solution.

**Facilitate Legal Compliance**. Our applications often deal with sensitive data which means compliance with various laws and regulations. Credit cards and personally identifiable information must be safeguarded. Creating a separate microservice to handle the legally entangled aspects of your application can be simpler and faster than attempting to rewire the monolith.

> Microservices are not an excuse to use your favorite esoteric language or technology. You must [weigh the pros and cons](https://www.vmwaretanzu.com/episode/0004/) of any design choice and do not dismiss the cost of maintaining multiple disparate stacks.

If you’d like to learn more about these principles, peruse the blog series [Should that be a Microservice?](https://tanzu.vmware.com/content/blog/should-that-be-a-microservice-keep-these-six-factors-in-mind) on the [VMware Tanzu blog](https://tanzu.vmware.com/blog).

## Identifying Bounded Contexts

By now, developers are (re)familiarizing themselves with domain driven design and the quest for the bounded contexts in their systems. But it can be daunting to know how to start. [Event Storming](https://tanzu.vmware.com/content/podcasts/domain-driven-design-event-storming-with-jakub-pilimon) is a collaborative technique designed to help you discover bounded contexts and vertical slices of an application. It facilitates decomposition of the monolith giving you an opportunity to model new flows and ideas. [Event Storming](https://www.eventstorming.com/book/) is a group activity requiring little more than sticky notes, sharpies, some painters tape and a large wall.

As a group, participants “storm the business” process jotting down domain events on sticky notes. The facilitator will often kick things off by identifying the start and end of the process. Focus on the happy path to begin with and use past tense for events. As your team works through the business domain, you will inevitably find trouble spots, external systems, parallel processing and time constrained events like batch processes. Once you’ve brainstormed the events, work with domain experts to enforce a timeline which will often uncover missing elements.

Once you have a timeline, look for domain aggregates aka bounded contexts. Identify events that transition across subdomains. These clumps of events will often expose candidate services. From here you can also rough out user interfaces, personas and whatever else is important in the domain.

In addition to Event Storming, you can apply a set of heuristics to discover domains. Some of the things to look for:
The structure of the organization. An insurance policy means different things to the billing area than it does to the claims department.
Domain language - where does a given term mean the same thing and more importantly where does it mean something else entirely?
Where are domain experts positioned in the org chart?
What is the core domain of the company? Strategic differentiation should inform your breakdown.

Once you have some candidate boundaries, you can test them! Are there any “schizophrenic contexts” aka where the context does too many things? A multitude of if statements indicates you probably have two or more domains. Is your context autonomous? Can it make decisions on its own or does it need to reach out to a dozen other modules? It may seem a bit fuzzy, but don’t forget to do a sanity check - do these boundaries feel right?

## Next Steps

There is a fair amount of art involved when you decompose a monolith, there is no magic formula. Hopefully this article gives you some tips and a place to start your journey. [Refactoring](https://www.youtube.com/watch?v=toqfiv4o7jA) takes time, be patient, your portfolio wasn’t built in a day and you won’t move everything to the cloud in a week. Move what makes sense, prioritize what can and be ruthlessly pragmatic. Good luck!

> Decomposing the monolith can be a very challenging exercise. With years of technical debt, mounting pressure and an often unconscious attachment to “we’ve always done it that way” it can be a challenge to shift to microservices. Not to toot our own horn, but the [VMware Tanzu Labs](https://tanzu.vmware.com/labs) team has a [proven track record of success](https://tanzu.vmware.com/customers) helping companies of all sizes in a wide variety of domains [modernize their apps](https://tanzu.vmware.com/application-modernization). We even offer a virtual consultation, if you’re interested, please [reach out](https://tanzu.vmware.com/product-consultation).