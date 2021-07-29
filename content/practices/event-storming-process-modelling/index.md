---
# remove "draft:true" when ready for final publication 
draft: false

title: "EventStorming | Process Modelling"
linkTitle: "EventStorming | Process Modelling - Will Appear in Links"
description: "A workshop for facilitating discussions around an outcome based view of a process or workflow, with flexible levels of detail and complexity."
# Note: remove any tags that are not relevant.
tags: ["Scoping", "Kickoff", "Discovery", "Framing", "Inception", "Transition", "Modernization", "Delivery"]
length: "1-2 hours (Lite 30 mins)"
participants: "Business stakeholders, business analysts, executives, domain experts, core team, developers, architects, team leads"
# custom "cover" image example: "boris/boris.png"
image: "default-cover.png" 
lastmod: "2021-05-21"
why: 
- Process Modelling can model complex processes that require discussions between engineers and SMEs and help generate a backlog of work
- Process modelling can be a quick way to visualize an algorithmic flow or pipeline for use in architectural diagrams and other modelling tools
- Process Modelling can help compare/hypothesise processes to validate proposed solutions
when:
- When discovering a high level business process and any tools used to support it.
- When discovering a pipeline or workflow and any tools used to support them
- When validating process changes that might help solve a problem
what:
- "Large wall or digital collaboration space like [Miro](https://miro.com/)"
- Sticky notes of 5+ different colors. When using this in conjunction with other flavours of EventStorming and/or BORIS + SNAP keep consistency in colors
- Sharpies

---
## How to Use this Method
`EventStorming` is a workshop created by `Alberto Brandolini`. The fundamentals of this practice have already been described in the `Tanzu Developer Center` [here](/practices/event-storming), where the main goal is to discover a set of domain events, each represented as a colored sticky (usually orange) and ordered along a timeline. This is referred to by Alberto Brandolini, in his book [Introducing EventStorming](https://leanpub.com/introducing_eventstorming), as the `Bigger Picture`. However the book also describes two other flavors of `EventStorming` that introduce additional exercises, `Process Modelling` and `Software Design` to the standard `Bigger Picture` workshop. These exercises have the aim of adding layers of notation in the form of different colored stickies, also referred to as `Grammar`, and build a complete process and software model. `Alberto Brandolini` suggests it is like making a pizza, where events and a timeline give you a margarita but you can add more grammar to make different pizzas. Though he did warn that you might be tempted to put grammar that isn't suited for EventStorming, such as data tables. He likens this to pineapple, and insists it should never be on your pizza.

The Practice described below is the additional exercise used by `Process modelling`, as it was taught in `Alberto Brandolini`'s workshop [EventStorming Remote Modelling](https://www.avanscoperta.it/it/training/eventstorming-remote-modelling-workshop/), 

While formally the method is best used for understanding large, complex high-level processes, the general principles and grammar of `Process Modelling` have been adopted successfully to discover or validate workflows and pipelines at much smaller scales and through existing systems.

The output from these workshops can be used to discover, validate or design a system that supports an end to end business process. The information can be used as an algorithmic model of the problem space.

Typically there will be a follow on exercise to rationalize the information and transform it from an algorithmic model to a different architectural model, such as Event and Domain Driven microservice architecture, a simple Pipeline or even `CQRS` and Event Sourcing patterns. However this is often where you loose Subject Matter Experts, and the conversation often continues from a more technical perspective, so it can be useful to revisit this board and get both technical and business clarity on the problem and the solution being delivered.

#### Sample Agenda & Prompts - 
1. ##### Prerequisites: 
   Previously you should have run a `Bigger Picture` exercise to provide enough events to find a process to model
   - Copy the main storming board to record a `snapshot` 
   - Ask the participants to vote for pivotal events, the most important to their work.
   - The scope of the process modelling has been agreed with preconditions and post conditions
   - Participants have organized their own stickies between pivotal events in a timeline
1. ##### Arrange the board
   - Label the board to identify a name for the process being explored
   - From the main storming board, choose a set of pivotal events that describe an end to end flow
      - Main Business Flows: something similar to a Customer Journey, often segmented on different personas. Small Company vs Big Corporation, vs Freelance or New vs Returning customer. This is the story on the surface.
      - Value Supply: Flows providing supporting services to the main business flow. A conference business is not only selling tickets, but also inviting keynote speakers and managing call for papers, plus a lot more.
      - Supporting: Other processes that need to be there. Less correlated to the main flow, like billing and accounting, reporting, customer care, but also HR, and so on.
      - Strategy: Flows describing results based strategy. Events from other domains are used to build a strategy or forecast.
      - Making it Possible: Flows describing a path to production. The internal process of delivering a software product.
   - Copy the chosen stickies to a new board
      - Preconditions: Identify events which need to have happened before this process can begin and put them in a grayed area on the left with the title Preconditions
      - Postconditions: Identify at least one suitable event which describes the optimal outcome of the process
      - Arrange any remaining events in a chronological order from left to right between the preconditions and optimal outcomes. Do not worry about accuracy, as the events are narrated, be prepared to change, add or remove events
   - Add a grammar guide as shown  ![This is the placeholder for process modelling grammar](/images/practices/event-storming-process-modelling/process-modelling-grammar.jpg)
1. ##### First Narration
   As described in the prerequisites, when moving from the Storming board you will have chosen a flow of interest to model. The main goal of the first narration is to complete this flow to a satisfactory `golden path` outcome, where everything goes smoothly and no failures or issues arise.

   Attempt to narrate the stickies on the board, describing the process of events as they happen from left to right. Adjust and add grammar as necessary to reach a consensus of the process.

   Roles:
   - There are typically 3 roles; one `Narrator`, one `Scribe` and the remaining participants are `The Audience`
     - A Narrator reads through the process from left to right
     - The Audience listens to the narrator and assists in discovering the process
     - A Scribe records the process on the board
   - Any participant can take on any of these roles and it should be encouraged to rotate roles

   Grammar:
   Add grammar appropriately but do not get bogged down by it until you have an end to end, then return and add detail as needed
   - Events: These represent a state change that another part of the system wants to listen to.
   - Policies: This sticky represents a business decision to do something, sometimes this is written as a short sentence or can be labeled and described somewhere else. 
   - Actors: This sticky represents a human interaction and should be placed with policies to identify who is responsible of making the decision and performing the task, a policy without an actor is automated
   - Action: An action that must be performed due to policy and produces one or more interesting events
   - Read Models: Data required to make decisions or perform commands
   - System: external/3rd party tools such as; email, excel, notepad, or any required COTS application
   
   Grammar Rules:
   - A Policy listens to a single Event
   - A Policy should call one Action per decision outcome
   - A Policy description should include the `event` they are listening to an `actor` if one is required, a `business decision` to be made and an `action` to take.
   - Multiple Policies can call the same Action
   - An Action can require multiple Systems
   - An Action can raise multiple Events
   - If an action raises more than one event, these should be placed together vertically
   - Multiple Actions can raise the same Event

   Questions:
   If an assumption is being made or there is no way to clarify parts of the process with the people in the room, leave a question on the board and return to it later.

   Pain Points and Opportunities:
   - If paint points are identified and correlates to a part in the process, then these should be captured as a sticky and connected to the associated sticky in the process.
   - If opportunities are identified and can be tied to the process, then these should be captured as a sticky and connected to the associated point in the process.

   Flows: 
   While the main goal is to follow the flow chosen from the EventStorming board, you might discover other flows. These should be separated and moved to another board, with a connector drawn between the two to identify the transition between flows

2. ##### Narrate the process again
   - Correct inaccuracies and add additional grammar. You can also encourage the discovery of negative events
   - Repeat this until you are satisfied you have enough of the process to identify a thin slice to work on.

3. ##### Review Questions, Pain Points and Opportunities
   Try to answer as many questions as possible and rationalize pain points and opportunities

#### Success/Expected Outcomes
- Capture information to assist further in the development process
  - Ubiquitous Language: Policies, Actions, Events and Systems all help to define a common language that cuts through assumption and clarifies a shared understanding.
  - Domain Events: Pivotal Events describe the communication between sub-domains. They are raised by one sub-domain and listened to by another, decoupling the dependency between the domains.
  - Policies for Decision Making: Policies describe business level decisions and identifies actors and read-models, helping to discover or validate behavior and responsibility.
  - Service Contracts: Actions identify where there should be a contract. In theory you can add write models here, but the main premise is to keep read and write models separate.
  - Integrations with tools and apps: Systems give you an understanding of when your process needs to integrate with an external system
  - Pain Points + Opportunities: An understanding of where problems are experienced and ideas of how they can be resolved
- Identify one or more thin slices. Try to identify a simplified end-to-end process that can provide the most value. 

## Related Practices
### EventStorming 
As mentioned `Process Modelling` is a form of `EventStorming`, and as taught by `Alberto Brandolini`, is a natural follow on exercise to the more common `Bigger Picture` workshop. Therefore the `Process Modelling` exercise naturally offers a way to enrich any `EventStorming` session with additional grammar
### EventStorming Software Design
As with `Process Modelling` exercise, `Software Design` offers additional grammar to enrich your `Bigger Picture` and `Process modelling` workshops.
### Unified Modelling Language (UML) / C4 Component Diagrams 
If you are using an Object-Oriented based notation to model your architecture, `Process Modelling` offers an algorithmic view of the problem you are solving and can be used to complete a number of diagrams as the process is narrated.
### Boris and SNAP
The grammar used by Process Modelling offers a lot of information that can be directly used in the completion of [Boris](/practices/boris) and [SNAP](/practices/boris) exercises, to map out the flow through the system from a technical perspective.
### Service Blueprint
Stickies from the main storming board, policies and other grammar can be used to complete a [Service Blueprint](/practices/service-blueprint) to map out the journey through the system from the users perspective.

#### Facilitator Notes & Tips

Events: Finding suitable events is important to getting a good model. 
 - Identify the important state change by understanding who might listen to it, write the event to make the subject of the event, the object that changed state. 
  e.g. the "Customer created an order", in this sentence the state of the Order is more important and will be listened to by other parts of the system so we re-write it as "Order was created". Another might be "Customer Changed Address", in this instance the change of state to the customer's address is important, so the event could be written as "Customer's Address Changed". 
 - Try to avoid "Passive-Aggressive Commands" as described in Martin Fowler's blog [What do you mean by “Event-Driven”?](https://martinfowler.com/articles/201701-event-driven.html). These are often found when the object raising state changes is a listener to that event. One way to handle this could be to squash all policies, commands and events into a new policy and command, written to describe the whole process. Identify which events are listened to and what negative events might be raised as a result of any failures from the squashed commands, again only if they are listened to.

Policies: Writing Policies can be important to ensure you have the correct flow and capturing the correct business requirement
 - Policies should be written as a business decision that guides an actor or system to the correct action. 
 - The actor may be responsible for implementing the policy but they may not be responsible for defining the policy. 
 - If good Roles are identified in the `EventStorming` stage then you should be able to identify roles that influence the business decision.

Thin Slices: Thin Slices can be heavily influenced by the goals of your project, but a good start might be to pick out a `golden path` and reduce it to the least set of events required to achieve the final outcome.

## Real World Examples
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/process-modelling-a-short-story.jpg)
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/sample-event-storming-and-modelling.JPG)
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/sample-process-modelling-and-boris.JPG)
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/sample-process-modelling.JPG)
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/sample-software-design-board.JPG)
![This is the placeholder for sample 2](/images/practices/event-storming-process-modelling/SampleProcessModellingBoard.JPG)
![This is the placeholder for sample 3](/images/practices/event-storming-process-modelling/SampleSoftwareModellingBoard.JPG)
## Recommended Reading
- [50,000 Orange Stickies and Counting](https://www.youtube.com/watch?v=1i6QYvYhlYQming/)
- [Alberto Brandolini - 100,000 Orange Stickies Later](https://www.youtube.com/watch?v=fGm62ra_mQ8)
- [Remote EventStorming](https://blog.avanscoperta.it/2020/03/26/remote-eventstorming/)
- [What do you mean by “Event-Driven”?](https://martinfowler.com/articles/201701-event-driven.html)
- [DDD Crew Starter modelling Process](https://github.com/ddd-crew/ddd-starter-modelling-process)
