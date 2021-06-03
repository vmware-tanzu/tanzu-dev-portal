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
- Process modelling can be a quick way to visualize an algorythmic flow or pipeline for use in architectural diagrams and other modelling tools
- Process Modelling can help compare/hypothisise processes to validate proposed solutions
when:
- When discovering or validating a high level business process
- When discovering a low level pipeline or workflow
- When validating process changes that might help solve a problem
what:
- "Large wall or digital collaboration space like [Miro](https://miro.com/)"
- 5+ different colored sticky notes (when using this in conjunction with Event Storming and/or BORIS + SNAPe keep consistency in colors)
- Sharpies

---
## How to Use this Method
This is formally a grammer/notation for Process and Software Modelling that has evolved from the application of [Event Storming](https://www.eventstorming.com/) by its founder, Alberto Brandolini. 
Traditionally it was indestiguishable from EventStorming, however its evolution has lead to Process Modelling becoming its own phase in the EventStorming journey.
While the formal method is great for large complex high level prcesses, the general principals and grammar of Process Modelling have been adopted successfully to discover or validate workflows and pipelines through existing applications, that are part of a larger business process

The output from these workshops can be used to validate and/or design an end to end system. The information can be architected in any way seen fit, such as an Event + Domain Driven model, or a Data Pipeleine or even CQRS Event Sourcing. Typically there should be a follow on exercise to rationalise the information and transform it from an algorythmic model to a more suitable architectural model for a proposed solution.

### When discovering or validating a high level business process accross many domains
#### Sample Agenda & Prompts - 
1. Arrange the board:
     - From the main event storming board, identify a selection of key events that describe an end to end process within the larger system and copy them to another board. 
       - Pre-conditions: Identify events which need to have happened before this process can begin and put them in a greyed area on the left with the title Pre-Conditions
       - Post-conditions: Identify at least one suitable event which describes the optimal outcome of the process
       - Arrange any remaining events in a chronological order from left to right between the pre-conditions and optimal outcomes
     - Add a grammar guide as shown  ![This is the placeholder for grammar](/images/practices/default-cover.png)
     - Lable the board to identify a name for the process being explored

1. Attempt to narrate from left to right, describing the process of events to the rest of the participants
      Roles: 
      - There are typically 3 roles:
         - A Narrator reads through the process from left to right
         - The Audience listens to the narrator and assists in discovering the process
         - A Scribe records the process on the board
      - There is typically one Narrater and one Scribe, while the other participants are The Audience
      - Any participant can take on any of these roles and it should be encouraged for roles to rotate      
      - Questions: If a question cannot be answered straight away then leave it on the board as a sticky note and return to it later.
      - Grammar: If at any time during the narration you identify any other grammer, then attempt to add it apropriately but do not get bogged down by getting it right first time around  
         - Commands: An action that is required to acheive a particular outcome.
         - Policies: This sticky represents a decision to do something: "When `<previous event>` `<actor>` `<always, sometimes, if.. then etc>` does something.
         - Tools: external/3rd party tools. Such as email, excell, notepad, or any required COTS application
         - Read Models: Data required to make decisions or perform commands
           Note: it does not always need to happen in this order and more grammar may be added so it is best to leave enough space or be prepared to shift post-its further to the right as you make changes
      - Negative/Alternative Outcomes: If events representing negative or alternative outcomes are identified these are placed vertically the events for positive outcomes   
      - Pain Points and Opportunities: As you progress through narration, you might identify parts of the process that causing problems or . Mark these areas with a sticky and if add any ideas opportunities that are identified at the time.

1. For each event identify any missing grammar

1. Narrate the process again, including the policies and commands and correct any inaccuracies along the way. You can repeat this until you have at least agreed a golden path through the process

1. Review Questions and Pain Poins: Try to answer as many questions as possible and rationalise pain points and opportunities

#### Success/Expected Outcomes
   - The goal is to capture enough information to assist further in the development process
     - Ubiquitous Language
     - Domain Events
     - Object Model
     - Read Models
     - Manual Actions + System Commands
     - Decision Making Policies
     - External Integration
     - Existing Applications
     - Pain Points + Opportunities
   - Identify a thin slice; You dont need to discover all the paths through the system, try to start with the simplest golden path and aim for recurring Process Modelling workshops to find alternative paths as additional slices. 

### When discovering the architecture of an existing pipeline, workflow or application
#### Sample Agenda & Prompts
1. Arrange the board:
     - Add a grammar guide as shown  ![This is the placeholder for grammar](/images/practices/default-cover.png)
       - Post-conditions: Identify at least one suitable event which describes the optimal outcome of the process
       - Pre-conditions: Identify events which need to have happened before this process can begin and put them in a greyed area on the left with the title Pre-Conditions
     - Lable the board to identify a name for the process being explored

1. Optional: At this point you can ask perticipants to "eventstorm" events in between, but this should be timeboxed to 10 minutes
   Interesting Events: 

2. Attempt to narrate from left to right, describing the process of events to the rest of the participants
      Roles: 
      - There are typically 3 roles:
         - A Narrator reads through the process from left to right
         - The Audience listens to the narrator and assists in discovering the process
         - A Scribe records the process on the board
      - There is typically one Narrater and one Scribe, while the other participants are The Audience
      - Any participant can take on any of these roles and it should be encouraged for roles to rotate
      - Questions: If a question cannot be answered straight away then leave it on the board as a sticky note and return to it later.
      - Grammar: If at any time during the narration you identify any other grammer, then attempt to add it apropriately but do not get bogged down by getting it right first time around  
         1. Commands: An action that is required to acheive a particular outcome.
         2. Policies: This sticky represents a decision to do something: "When `<previous event>` `<actor>` `<always, sometimes, if.. then etc>` does something.
         3. Tools: external/3rd party tools. Such as email, excell, notepad, or any required COTS application
         4. Read Models: Data required to make decisions or perform commands
           Note: it does not always need to happen in this order and more grammar may be added so it is best to leave enough space or be prepared to shift post-its further to the right as you make changes
      - Negative/Alternative Outcomes: If events representing negative or alternative outcomes are identified these are placed vertically the events for positive outcomes   
      - Pain Points and Opportunities: As you progress through narration, you might identify parts of the process that causing problems or . Mark these areas with a sticky and if add any ideas opportunities that are identified at the time.
      
3. Narrate the process again, including the policies and commands and correcting any inaccuracies along the way.

4. Review Questions and Pain Poins: Try to answer as many questions as possible and rationalise pain points and opportunities

#### Success/Expected Outcomes
1. As the workshop progresses, information is captured to assist further in the development process
  - Interesting Events
  - Data Models
  - Manual Actions + System Commands
  - Decision Making Policies
  - External Integration
  - Existing Applications
  - Pain Points + Opportunities

#### Facilitator Notes & Tips
Are there common ways by which this workshop gets off track? Notes like that are great for this section.

## Related Practices
If there are any related practices list them here.

### Variations
Are there alternative ways of performing this practice or workshop? Call out the differences here.

### Preceding
Optional.

 
### Following
Optional.


## Real World Examples

## Recommended Reading