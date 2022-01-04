---
title: Writing Agile User Stories for Event-Based Systems
linkTitle: Writing Agile User Stories for Event-Based Systems
description: A Product Manager's perspective on how to write technical backend stories,
  using an action-oriented approach.
tags:
- User Stories
- Agile
team:
- Christina Liu
date: '2021-07-27'
lastmod: '2021-07-27'
level1: Agile Transformation and Practices
level2: Agile Development
aliases:
- "/guides/agile/writing-agile-user-stories/"
---

Product managers (PMs) can help development teams be more agile in their approach to building software by writing crisp user stories that align with the oft-cited “INVEST” (sometimes extended as INVEST-A) principles. This is now a well-accepted truism. 

But what happens when these good story-writing habits slip in the face of projects that are more technically complex, “don’t have a front-end” or are less end-user visible than the PM is used to? The following downward spiral can result:

* The backlog of stories may start to look much more like a list of development to-do tasks, configurations and research. 
* Weeks might go by without something satisfyingly “demo-able” to outside stakeholders.
* Before you know it, stakeholder confidence and team morale are both trending down. 

One way to stop this slide is by taking a step back and re-evaluating your stories with an eye towards actions in your system, even if those actions aren’t taken up by a human.


## Beware the Makings of a Science Project

In a recent engagement, our team was building a brand new internet-of-things monitoring system that needed to be able to process and store millions of readings per minute from internet-connected devices. It had all the markings of a project that might devolve into technical minutiae:   

* The team was pioneering an approach to this that utilizes event streaming.
* End-users would be interacting with this system only through consumer and administrative applications, owned by other teams in the organization. 
* Our team’s only “user-facing” elements would be through our API. 
* Between receiving streams of real-time device data and updating millions of calculations to deliver accurate, up-to-the-minute data to present in these applications, our system had quite a bit of complexity under the hood. 

How might we organize our work and build this new system out in a way that kept feedback loops tight, built momentum, and minimized the risk of wasted effort?


## Don’t Try to be Too Cute

An initial approach attempted to “personify” each component in the system, giving a proper name to each database and event stream, for example. The resulting stories ended up having titles like, 

> _“Evie the Event Stream can provide temperature data”_ 

> _“Dudley the database can store average daily temperature data”_ 

and descriptions structured like 

> _“As Evie/Dudley,_ <br> _I want to provide/store temperature data_ <br> _So that I can...”_. 

While perhaps clever, this level of abstraction added too much cognitive load when reading through stories - who is Evie again? Who is Dudley? - and did not lead to concise and tidy understanding. After working through a few stories in this manner, the team wasn’t feeling like they were gaining traction, and stakeholders did not understand what value they were getting from the work being done.  


## Identify the Real Actors

We re-examined the architectural patterns we were establishing in our system and noticed the work being done in the system. In general we had processors, source event streams and sinks with different jobs, in addition to our API layer: 

* **Processors** were responsible for consuming data from incoming **event streams**, doing appropriate calculations and emitting the results onto outgoing **event streams**. 
* **Sinks** needed to consume the end result of all necessary calculations from event streams to save and update those values in the appropriate **data stores**. 
* The **API** we exposed for the applications would be responsible for querying the appropriate data stores to quickly provide a response for the requested data and time frames. 

We established naming conventions for each component type so that they could be easily disambiguated. 


## Focus on Actions

With this understanding of the system, we were able to enumerate our work into more manageable, yet still value-delivering, increments by focusing on the key actions needed from each component. For example, a processor story would have the action-oriented title: _“The Temperature Processor updates values for average temperatures by time.”_ Already, a glance at this title in the backlog was easier to comprehend than trying to remember each component by an arbitrary name. 

Going into the description, the value being delivered by this temperature processor is realized by the downstream consumer, so the “As \<the user\>…” summary was written from that component’s perspective:

> _"As the Temperature Sink,_ <br> _I want to retrieve the updated average hourly, daily, weekly and monthly temperature,_ <br> _So that I can store these readings by time in the Temperature Store."_

Since this was a story for building temperature processor functionality, the acceptance criteria was thus written from the perspective of verifying that the processor, given the expected inputs, has produced the correct outputs:

> _"Given a temperature reading for time T:xx:xx has been received from the temperature_readings event stream, <br> _When I read from the temperature_averages event stream,_ <br> Then I shall see timestamped events containing updated average temperatures for the hour, day, week and month containing T:xx:xx."_


## Validate Incrementally

Through this single story, the team implemented a slice of functionality through the system that delivered and proved out distinct value and key integrations which could be quickly validated and even demonstrated, thus keeping feedback loops short. For example:

* Can the processor receive readings properly from the incoming event stream? 
* Is the data expected in the incoming event stream adequate for the calculations we’ll be doing? 
* Are the processor’s calculations what we expect to see?
* Can the processor deliver readings to the outgoing event stream, formatted in a way that can be stored by the sink who will consume them?
* Can this all be done in a way that gives a good early indication that it will perform at scale?


## Remember the Bigger Picture

One drawback to this approach, however, was that this level of focus on the correct functionality occasionally led to technical myopia: steadily building out one branch of this data processing pipeline without taking a moment to consider total throughput or to later realize it wasn’t the optimal path for making that calculation, proved painful. For us, rigorous analysis of data volumes and processing times at scale, and fault tolerance, among other non-functional considerations, took a back seat to “making it work”, sometimes revealing pitfalls later than we would have liked.


## A Happier Journey Overall

Nevertheless, by structuring our work via action-oriented stories, our team was able to maintain a steady sense of forward progress and learning, as our fledgling monitoring system grew stronger and capable of performing more and more of these actions. In addition, our stakeholders were better able to understand this progress, and thus could make decisions about adjusting our priorities or external expectations with plenty of time to make smooth lane changes in our course of action. And, ultimately, isn’t that what being agile is all about?
