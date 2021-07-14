---
# remove "draft:true" when ready for final publication 
draft: false

title: "Event Storming | Process Modelling"
linkTitle: "Event Storming | Process Modelling - Will Appear in Links"
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
- When discovering a high level business process
- When discovering a pipeline or workflow
- When validating process changes that might help solve a problem
what:
- "Large wall or digital collaboration space like [Miro](https://miro.com/)"
- 5+ different colored sticky notes (when using this in conjunction with Event Storming and/or BORIS + SNAPe keep consistency in colors)
- Sharpies

---
## How to Use this Method
This is formally a grammar/notation for modelling Processes and Software, that has evolved from the application of [EventStorming](https://www.eventstorming.com/) by its founder Alberto Brandolini. 
Traditionally it was indistinguishable from `EventStorming`, however its evolution has lead to Process Modelling becoming its own phase in the `EventStorming` methodology.

While the formal method is best used for identifying large complex high level processes, the general principals and grammar of Process Modelling have been adopted successfully to discover or validate workflows and pipelines at much smaller scales and through existing systems.

The output from these workshops can be used to discover, validate or design a system that supports an end to end business process. The information can be used as an algorithmic model of the problem space, and other forms of design can be derived from it; such as an Event + Domain Driven microservice architecture, a simple Pipeline or even design a `CQRS` and Event Sourcing pattern. Typically there will be a follow on exercise to rationalize the information and transform it from an algorithmic model to a more suitable architectural model.

#### Sample Agenda & Prompts - 
1. Arrange the board:
     - Label the board to identify a name for the process being explored
     - From the main event storming board, identify a selection of key events that describe an end to end process within the larger system and copy them to another board. 
       - Preconditions: Identify events which need to have happened before this process can begin and put them in a grayed area on the left with the title Preconditions
       - Postconditions: Identify at least one suitable event which describes the optimal outcome of the process
       - Arrange any remaining events in a chronological order from left to right between the preconditions and optimal outcomes. Do not worry about accuracy, as the events are narrated, be prepared to change, add or remove events
     - Add a grammar guide as shown  ![This is the placeholder for process modelling grammar](/images/practices/event-storming-process-modelling/process-modelling-grammar.png)

1. First Narration: Attempt to narrate a `golden path` through the board, describing the process of events as they happen from left to right. Adjust and add grammar as necessary to reach a consensus of the process.
    - Roles: 
       - There are typically 3 roles; one Narrater, one Scribe and the remaining participants are The Audience
         - A Narrator reads through the process from left to right
         - The Audience listens to the narrator and assists in discovering the process
         - A Scribe records the process on the board
       - Any participant can take on any of these roles and it should be encouraged for roles to rotate

    - Questions: If a question cannot be answered straight away then leave it on the board and return to it later.
    - Grammar: Add grammar appropriately but do not get bogged down by it
      1. Events: These represent events that are "Interesting" to the wider system. When understanding what is "interesting", you might refer to the description given by Martin Fowler in his article [What do you mean by “Event-Driven”?](https://martinfowler.com/articles/201701-event-driven.html)
      1. Policies: This sticky represents a business decision to do something, sometimes this is written as a short sentence or can be labeled and described somewhere else. Any description should include the `event` they are listening to an `actor` if one is required, a `business decision` to be made and an `action` to take
      1. Actors: This sticky represents a human interaction and should be placed with policies to identify who is responsible of making the decision and performing the task, a policy without an actor is automated
      1. Action: An action that must be performed due to policy and produces one or more interesting events
      1. Read Models: Data required to make decisions or perform commands
      1. System: external/3rd party tools such as; email, excel, notepad, or any required COTS application
      Note: it does not always need to happen in this order and more grammar may be added, so it is best to leave enough space or be prepared to shift post-its further to the right as you make changes.
    - Negative/Alternative Outcomes: If a command can result in multiple or alternative events then all events should be placed vertically
    - Pain Points and Opportunities: Place a sticky to represent any pain points and any opportunities that are identified at the time. Pain points can be around the process itself or the current system or tools supporting the process

1. Narrate the process again; correct inaccuracies and add missing grammar. You can also encourage the discovery of negative events
   Repeat this until you are satisfied you have enough of the process to identify a thin slice.

1. Review Questions and Pain Points: Try to answer as many questions as possible and rationalize pain points and opportunities

#### Success/Expected Outcomes
   - Capture information to assist further in the development process
     - Ubiquitous Language
     - Domain Events
     - Policies for Decision Making 
     - Actors
     - Read Models
     - Manual Actions + System Commands
     - Integrations with tools and apps
     - Pain Points + Opportunities
   - Identify one or more thin slices. Try to identify a simplified end-to-end process that can provide the most value. 

## Related Practices:
### `EventStorming`
As mentioned Process Modelling evolved from `EventStorming` and is a fundamental part of the complete application of Event Storming as prescribed by Alberto Brandolini. However the storming phase, or `Big Picture` as referred to by Alberto Brandolini, has been more widely adopted with minor variations to the original, such as the use of [Event Storming](/practices/event-storming)  as described in this Developer Center. Therefore Process Modelling naturally offers a way to enrich any `EventStorming` session
### UML/C4/Boris
if you are using an Object Oriented based notation to model your architecture, Process Modelling offers an algorithmic view of the problem you are solving, and can be used to complete a number of diagrams as the process is narrated.
### Boris and SNAP
The grammar used by Process Modelling offers a lot of information that can be directly used in the completion of [Boris](/practices/boris) and [SNAP](/practices/boris) exercises. 

### Variations:
### Event Storming | Software Modelling
This is an extension of Process Modelling and is represented by Alberto Brandolini as a third phase in the `EventStorming` methodology. It is primarily used to identify an aggregate responsible for the execution of one or more commands.
#### Sample Agenda & Prompts
1. Arrange the board:
   - Start with a copy of an existing Process Modelling board
   - Add an additional piece of grammar as shown ![This is the placeholder for grammar](/images/practices/event-storming-process-modelling/software-modelling-grammar.png) 

1. Narrate the story and identify solutions for each command
    - Grammar: Add grammar appropriately but do not get bogged down by it
      1. Software: This represents either an existing or proposed solutions for executing a given command
#### Success/Expected Outcomes
The primary focus of this is to define a domain driven solution to support the process, however it can also be used to identify where existing solutions exist and help to map a migration path from legacy.
  - Software Model

### When discovering a pipeline or workflow
Often when using Process Modelling to investigate or discover specific workflows or pipelines, event storming can be done as a short session as part of the process modelling or skipped entirely in favor of narration. Also grammar might be a lot more flexible, as you may only need events and commands to visualise the process. This can also be useful when comparing processes to identify a good solution, as you do not want to spend too much time on detailed grammar

#### Sample Agenda & Prompts
For the most part the agenda is the same as formal process modelling, however the grammar is more ad-hoc and there is some initial discovery as you are not starting with an Event Storming board

1. Arrange the board: 
     - Start by identifying the target process and label the board
     - Add the grammar as with the formal method
     - Discover at least one suitable precondition and one outcome and arrange them as with the formal method

1. Optional: At this point you can ask participants to "event storm" events in between, but this should be time-boxed to 10 minutes

1. First Narration: As with the formal method, attempt to narrate a `golden path` through the board.
     - If you did not event storm then your main goal here is to discover interesting events as you try to identify how the process gets from precondition to outcome
     - At this level you will often find more passive aggressive events. For this reason identify them early and if you want to leave them "un-squashed" only represent them as either events or commands and events
  
1. Narrate the process again, as with the formal method you can include more grammar and correct inaccuracies. 
   To save time you can identify only the grammar that is relevant to the discussion, you do not need to find all grammar for all events.

1. Review Questions and Pain Points: As with he formal method try to answer as many questions as possible and rationalize pain points and opportunities

#### Success/Expected Outcomes
   Generally you are looking for the same types of outcome as the formal method, however the sessions tend to be shorter and more focused on the flow of the process, and so only Events and Integrations are required

#### Facilitator Notes & Tips

Events: Finding suitable events is important to getting a good architecture. 
 - Identify the important state change and write the event to make the subject of the event, the object that changed state. i.e. the "Customer created an order", in this sentence the state of the Order is more important so we re-write it as "Order was created". Another might be "Customer Changed Address" In this instance the change of state to the customer's address is important, so the event could be written as "Customer's Address Changed". 
 - Try to avoid "Passive-Aggressive Commands" as described in Martin Fowler's blog [What do you mean by “Event-Driven”?](https://martinfowler.com/articles/201701-event-driven.html). These are often found when the object raising state changes is a listener to that event, in order to complete a process. One way to handle this could be to squash all policies, commands and events into a new policy, command, written to describe the whole process squashed. Identify which events are listened to and what negative events might be raised as a result of any failures from the squashed commands, again only if they are listened to.

Policies: Writing Policies can be important to ensure you have the correct flow and capturing the correct business requirement
 - Policies should be written as a business decision that guides an actor or system to the correct action. The actor may be responsible for implementing the policy but they may not be responsible for defining the policy. If good Roles are identified in the `EventStorming` stage then you should be able to identify roles that influence that decision.

Thin Slices: Thin Slices can be heavily influenced by the goals of your project, but a good start might be to pick out a `golden path` and reduce it to the least set of events required to achieve the final outcome.

## Real World Examples
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/SampleEventStormingAndModellingBoard.JPG)
![This is the placeholder for sample 2](/images/practices/event-storming-process-modelling/SampleProcessModellingBoard.JPG)
![This is the placeholder for sample 3](/images/practices/event-storming-process-modelling/SampleSoftwareModellingBoard.JPG)
## Recommended Reading
- [50,000 Orange Stickies and Counting](https://www.youtube.com/watch?v=1i6QYvYhlYQming/)
- [100,000 Orange Stickies and Counting](https://www.youtube.com/watch?v=fGm62ra_mQ8)
- [Remote Event Storming](https://blog.avanscoperta.it/2020/03/26/remote-eventstorming/)
- [What do you mean by “Event-Driven”?](https://martinfowler.com/articles/201701-event-driven.html)