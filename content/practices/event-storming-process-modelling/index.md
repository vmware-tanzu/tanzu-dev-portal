---
# remove "draft:true" when ready for final publication 
draft: true

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
Traditionally it was indistinguishable from EventStorming, however its evolution has lead to Process Modelling becoming its own phase in the EventStorming methodology.

While the formal method is best used for identifying large complex high level processes, the general principals and grammar of Process Modelling have been adopted successfully to discover or validate workflows and pipelines at much smaller scales and through existing systems.

The output from these workshops can be used to discover, validate or design a system that supports an end to end business process. The information can be used as an algorithmic model of the problem space, and other forms of design can be derived from it; such as an Event + Domain Driven microservice architecture, a simple Pipeline or even design a CQRS and Event Sourcing pattern. Typically there will be a follow on exercise to rationalise the information and transform it from an algorithmic model to a more suitable architectural model.

#### Sample Agenda & Prompts - 
1. Arrange the board:
     - Label the board to identify a name for the process being explored
     - From the main event storming board, identify a selection of key events that describe an end to end process within the larger system and copy them to another board. 
       - Pre-conditions: Identify events which need to have happened before this process can begin and put them in a greyed area on the left with the title Pre-Conditions
       - Post-conditions: Identify at least one suitable event which describes the optimal outcome of the process
       - Arrange any remaining events in a chronological order from left to right between the pre-conditions and optimal outcomes. Do not worry about accuracy, as the events are narrated, be prepared to change, add or remove events
     - Add a grammar guide as shown  ![This is the placeholder for grammar](/images/practices/event-storming-process-modelling/Grammar.PNG)

1. First Narration: Attempt to narrate a `golden path` through the board, describing the process of events as they happen from left to right. Adjust and add grammar as necessary to reach a consensus of the process.
    - Roles: 
       - There are typically 3 roles; one Narrater, one Scribe and the remaining participants are The Audience
         - A Narrator reads through the process from left to right
         - The Audience listens to the narrator and assists in discovering the process
         - A Scribe records the process on the board
       - Any participant can take on any of these roles and it should be encouraged for roles to rotate

    - Questions: If a question cannot be answered straight away then leave it on the board and return to it later.
    - Grammar: Add grammar appropriately but do not get bogged down by it
      1. Events: These represent events that are "Interesting" to the wider system. When understanding what "interesting" means, you might refer to the description given by Martin Fowler in his blog about Event-Driven systems
      2. Commands: An action that must be performed due to policy, and produces one or more outcomes
      3. Policies: This sticky represents a decision to do something: "When `<previous event>` `<actor>` `<always, sometimes, if.. then>` `<task>`
      4. Actors: This sticky represents a human interaction and should be placed with policies to identify who is responsible of making the decision and performing the task, a policy without an actor is automated
      5. Tools: external/3rd party tools such as; email, excel, notepad, or any required COTS application
      6. Read Models: Data required to make decisions or perform commands
      Note: it does not always need to happen in this order and more grammar may be added, so it is best to leave enough space or be prepared to shift post-its further to the right as you make changes.
    - Negative/Alternative Outcomes: If a command can result in multiple or alternative events then all events should be placed vertically
    - Pain Points and Opportunities: Place a sticky to represent any pain points and any opportunities that are identified at the time. Pain points can be around the process itself or the current system or tools supporting the process

3. Narrate the process again, including the policies and commands and add or correct any grammar along the way. 
   You can repeat this until you have agreed on at least one end-to-end slice through the process

4. Review Questions and Pain Points: Try to answer as many questions as possible and rationalise pain points and opportunities

#### Success/Expected Outcomes
   - Capture information to assist further in the development process
     - Ubiquitous Language
     - Domain Events
     - Read Models
     - Manual Actions + System Commands
     - Decision Making Policies
     - External Integration
     - Existing Applications
     - Pain Points + Opportunities
   - Identify one or more thin slices. Pick out a set of events that represents an end-to-end path through the process. Usually you will start with a simplified version of the `golden path` and add more slices as you choose to tackle more complexity and more outcomes. 

## Related Practices:
### EventStorming
As mentioned Process Modelling evolved from EventStorming and is a fundamental part of the complete application of Event Storming as prescribed by Alberto Brandolini. However the storming phase, or `Big Picture` as referred to by Alberto Brandolini, has been more widely adopted with minor variations to the original, such as the use of [Event Storming](/practices/event-storming)  as described in this Developer Center. Therefore Process Modelling naturally offers a way to enrich any EventStorming session
### UML/C4/Boris
if you are using an Object Oriented based notation to model your architecture, Process Modelling offers an algorithmic view of the problem you are solving, and can be used to complete a number of diagrams as the process is narrated.
### Boris and SNAP
The grammar used by Process Modelling offers a lot of information that can be directly used in the completion of [Boris](/practices/boris) and [SNAP](/practices/boris) exercises. 

### Variations:
### Event Storming | Software Modelling
This is an extension of Process Modelling and is represented by Alberto Brandolini as a third phase in the EventStorming methodology. It is primarily used to identify an aggregate responsible for the execution of one or more commands.
#### Sample Agenda & Prompts
1. Arrange the board:
   - Start with a copy of an existing Process Modelling board
   - Add an additional piece of grammar as shown: 

1. Narrate the story and identify aggregates for each command
    - Grammar: Add grammar appropriately but do not get bogged down by it
      1. Aggregate: This represents either an existing or proposed aggregate for executing a given command. Repeat the same aggregate if they have multiple commands

#### Success/Expected Outcomes
  - Object Model

### When discovering a pipeline or workflow
Often when using Process Modelling to investigate or discover small workflows or pipelines, eventstorming can be done as a short session as part of the process modelling or skipped entirely in favour narration. Also grammar might be a lot more flexible, as you may only need events to visualise the process. This can also be useful when comparing processes to identify a good solution, as you do not want to spend too much time on detailed grammar

#### Sample Agenda & Prompts
1. Arrange the board:
     - Label the board to identify a name for the process being explored
     - Add a grammar guide as shown  ![This is the placeholder for grammar](/images/practices/event-storming-process-modelling/Grammar.PNG)
     - Post-conditions: Identify at least one suitable event which describes the optimal outcome of the process
     - Pre-conditions: Identify at least one event, which need to have happened before this process can begin and put it in a greyed area on the left with the title Pre-Conditions

1. Optional: At this point you can ask participants to "event storm" events in between, but this should be time-boxed to 10 minutes

1. First Narration: Attempt to narrate a `golden path` through the board, describing the process of events as they happen from left to right. Adjust and add grammar as necessary to reach a consensus of the process.
    - Roles: 
       - There are typically 3 roles; one Narrater, one Scribe and the remaining participants are The Audience
         - A Narrator reads through the process from left to right
         - The Audience listens to the narrator and assists in discovering the process
         - A Scribe records the process on the board
       - Any participant can take on any of these roles and it should be encouraged for roles to rotate

    - Questions: If a question cannot be answered straight away then leave it on the board and return to it later.
    - Grammar: Add grammar appropriately but do not get bogged down by it
      1. Events: These represent events that are "Interesting" to the wider system. When understanding what "interesting" means, you might refer to the description given by Martin Fowler in his blog about Event-Driven systems
      2. Commands: An action that must be performed due to policy, and produces one or more outcomes
      3. Policies: This sticky represents a decision to do something: "When `<previous event>` `<actor>` `<always, sometimes, if.. then>` `<task>`
      4. Actors: This sticky represents a human interaction and should be placed with policies to identify who is responsible of making the decision and performing the task, a policy without an actor is automated
      5. Tools: external/3rd party tools such as; email, excel, notepad, or any required COTS application
      6. Read Models: Data required to make decisions or perform commands
      Note: It is not always discovered in this order and more grammar may be added, so it is best to leave enough space or be prepared to shift post-its further to the right as you make changes.
    - Negative/Alternative Outcomes: If a command can result in multiple or alternative events then all events should be placed vertically
    - Pain Points and Opportunities: Place a sticky to represent any pain points and any opportunities that are identified at the time. Pain points can be around the process itself or the current system or tools supporting the process
      
1. Narrate the process again, including the policies and commands and correcting any inaccuracies along the way.

1. Review Questions and Pain Points: Try to answer as many questions as possible and rationalise pain points and opportunities

#### Success/Expected Outcomes
   - Capture information to assist further in the development process
     - Interesting Events
     - Data Models
     - Manual Actions + System Commands
     - Decision Making Policies
     - External Integration
     - Existing Applications
     - Pain Points + Opportunities

#### Facilitator Notes & Tips

Warning: The pipeline and workflow variation can often lead to "Passive-Aggressive Commands" as described by Marting Fowler, sometimes this can be useful to better understand the problem space, but any architecture that is derived from the output should take that into account.

## Real World Examples
![This is the placeholder for sample 1](/images/practices/event-storming-process-modelling/SampleEventStormingAndModellingBoard.JPG)
![This is the placeholder for sample 2](/images/practices/event-storming-process-modelling/SampleProcessModellingBoard.JPG)
![This is the placeholder for sample 3](/images/practices/event-storming-process-modelling/SampleSoftwareModellingBoard.JPG)
## Recommended Reading