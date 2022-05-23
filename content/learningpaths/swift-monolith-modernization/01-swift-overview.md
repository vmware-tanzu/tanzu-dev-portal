---
title: Swift Method Overview
weight: 1
layout: single
team:
- Marc Zottner
- Lizz Smullen
tags: []
---

## What is Swift?

The Swift Method is a suite of highly effective, time-saving practices that are proven to help development teams who want to build highly scalable software or who are stuck in the modernization of existing monolithic applications. Instead of spending months doing analysis work, the team moves forward with a lean development plan that they can expect to bring new tested features in production at the end of 4-10 one week iterations. 

The Swift practices collaboratively align the stakeholders of an application with implementation objectives, desired functionalities, and high-level design. A stakeholder is any person with a vested interest in releasing a successful software project, and can be administrators, designers, developers, directors, product managers, and project managers.

The information that the stakeholders share is going to prove instrumental in helping you make informed decisions on how to organize development teams, and how to prioritize stories from a business and technical perspective. 
Swift jumpstarts the work of turning an idea or a monolith application into a highly distributed, modern application. In the case of a legacy system, you decompose and rewrite a monolith from the ground up by figuring out how it wants to behave. Old and new systems co-exist while the legacy system is progressively broken down and its parts rebuilt.
This method has been developed over time by VMware Tanzu Labs practitioners, especially by Shaun Anderson.


## How Does Swift Work?

Swift helps you to successfully plan projects that significantly reduce development time using a series of activities including Event Storming Light, Thin Slice definition, a Boris Exercise, and SNAP.

These activities are opinionated and well defined: they have been fine tuned through dozens of conducted real-world projects. While it’s  best to stick to defined activities for your first try, the Swift approach is meant to be adapted to the needs of your endeavor.

The success formula of Swift lies in its highly-collaborative nature (intrinsic alignment), while focussing on the future (and not the past) of the app by quickly shaping its notional architecture, and just getting started (constructive laziness). 

-   **Notional architecture**

    Notional architecture drafts the high-level design of the application to be built. It focuses on the communication flows between the core business capabilities and refrains from embedding any form of technological aspects. While aligning all stakeholders behind a big picture with a simple representation depicting how the system wants to behave, notional architecture eliminates weeks and months of analysis and conceptual work.

-   **Future over past**

    Swift focuses fully on the desired application,  and the future rather than its past. While many learnings on functionality and user experience originate from previous insights, spending too much time on the past is a trap that often prevents any progress. In the engineering process, you spend most of your time considering how the application would be built from scratch today by a fast-paced tech startup, rather than by capitalizing on the entirety of existing code and specifications.


-   **Collaboration first**

    Bringing together all stakeholders of the application lifecycle to effectively align, collaborate, ideate, and exchange is at the heart of the swift methodology. The stakeholders transform from people with individual ideas, to people who collectively discover solutions to problems. No one feels left out because everyone sees how they fit into the big picture.

-   **Constructive laziness**

    Constructive laziness recognizes that it’s OK to not know everything upfront about an enterprise system, especially in the case of large systems that are constantly evolving. No one can know everything. In the end, perfect is the enemy of good. How do you escape the analysis-paralysis trap aiming to craft the perfect meta-architecture with completely detailed specifications? By taking a leap of faith, and accepting that a realistic way forward implies starting small, working on one scenario part of the big picture first, and evolving incrementally. 


## Sequence of Activities

It’s OK to leverage each practice individually, but you’ll get better results by applying them in the following sequential order:

1. [Quantify targeted outcomes for goals and non-goals](#one)
1. [Quickly understand the desired business functionality using Event Storming Light](#two)
1. [Identify business capabilities as service candidates](#three)
1. [Select a meaningful starting point: a thin slice of functionality](#four)
1. [Use Boris notional architecture to find out how the system wants to be designed](#five)
1. [Document each business capability instantly with SNAP](#six)
1. [Explore and match technical patterns](#seven)
1. [Create a prioritized work backlog](#eight)
1. [Develop iteratively tested and working code](#nine)

The steps come together, as depicted in the following diagram:

  ![Prioritizing the issues to test](/learningpaths/swift-monolith-modernization/images/swift_process.png#center)

The following sections describe the purpose of each practice, how long each practice takes to complete, group activities for the stakeholders, and the positive outcomes to expect.

### 1. Quantify targeted outcomes for goals and non-goals {id=one}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To capture the goals and non-goals that set the direction for the project, and to ensure that ongoing progress continues in an intended direction by becoming a North Star for your project or program. This is a core prerequisite to enforce alignment between new architecture and efforts with the desired business outcomes.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 - 2 hours</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Conduct an interactive workshop about goals and non-goals.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>A list of goals and non-goals agreed upon and prioritized by the stakeholders.</td>
    </tr>
  </tbody>
</table>

### 2. Quickly understand the desired business functionality using Event Storming Light {id=two}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To interactively explore the desired business functionality of an application. The practice fosters clarity and aligns all stakeholders on the future application by collaboratively crafting a commonly understood model and language.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 - 2 days</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>A bespoke, simplified variant of the Big Picture Event Storming that you can use to model the business domain behind your application and leverage a common language for different tribes.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>A non-exhaustive, non-technical, comprehensive model of the business functionality covered by the system that you want to build. The model includes business events, domains, and capabilities. It is typically complemented by a glossary covering abbreviations and the meaning of specific business terms.</td>
    </tr>
  </tbody>
</table>


### 3. Identify business capabilities as service candidates {id=three}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To define the boundaries between the different business domains, and to identify potential, separate service candidates for the new system.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 hour</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Leverage pivotal events and domain boundaries to map events to a service capability.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>Named groups of events belonging to the same business capability. The groups are known as service candidates.</td>
    </tr>
  </tbody>
</table>


### 4. Select a meaningful starting point: a thin slice of functionality {id=four}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To identify and select a first business narrative to start modernizing out of everything your monolithic application is doing. This business narrative is referred to as a “thin slice” of functionality because it reflects a small functional piece of the whole cake: your monolith application.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 - 2 hours</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Cut the monolithic business cake and pick a sweet piece to start the modernization work. Prioritize  practices like dot voting, and pain points clustering, while keeping the previously defined goals and non-goals that are typically leveraged here.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>A first well-defined business narrative (“thin slice” of functionality) is identified and framed.</td>
    </tr>
  </tbody>
</table>


### 5. Use Boris notional architecture to find out how the system wants to be designed {id=five}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To design the notional, technology-agnostic architecture of the desired system that will be used as a basis for the implementation for the selected slice of functionalities.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>2 - 4 days</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Follow the business narrative covered by the selected thin slice to model and draw the communication between the previously identified business capabilities of the target system. This guided exercise uncovers needs in terms of APIs, data, communication and synchronicity. It also helps to capture relevant business logic, ownerships, cross-cutting concerns, and risks for the implementation of a thin slice.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>Documented communication model between identified business capabilities that reveals the likely target architecture of the system.</td>
    </tr>
  </tbody>
</table>

### 6. Document each business capability instantly with SNAP {id=six}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To quickly capture and structurally document the information discovered during the Boris exercise for each business capability.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>Occurs in parallel to the Boris exercise.</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Pre-filled structured templates (AKA SNAP-sheets) for each relevant business capability are filled in real-time during the Boris exercise.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>One structured documentation sheet for each business capability covering the following categories: APIs, Data, External Systems, UI, Stories, and Risks.</td>
    </tr>
  </tbody>
</table>


### 7. Explore and match technical patterns {id=seven}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To preselect known and missing technical design patterns you could apply while building in the drafted notional architecture.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 - 2 hours</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Identify recurrent patterns that are documented in your library or missing ones that should be elaborated on. Examples include Anti-Corruption Layers (ACL), asynchronous communication with messaging, and data storage (SQL/NoSQL).</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>One list of patterns to either be reused during the implementation, or developed to solve specific repeating issues.</td>
    </tr>
  </tbody>
</table>


### 8. Create a prioritized work backlog {id=eight}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To create a prioritized agile backlog of work to structure the implementation and to understand the interdependencies between the required activities.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>1 - 2 days</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>By going through the previous steps, a list of stories and tasks will be documented in the SNAP sheets. Creation of the backlog is a matter of prioritizing the stories based on the highest priority, thin slice of functionality. This step is also used to formalize the stories by mapping them to any technical patterns that are defined. An “Objective and Key Results” (OKR) exercise can be conducted at this stage to align priorities on goals.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>Prioritized a backlog of work.</td>
    </tr>
  </tbody>
</table>


### 9. Develop iteratively tested and working code {id=nine}

<table class="table table-striped">
  <tbody>
    <tr>
      <td><b>Purpose</b></td>
      <td>To turn the desired notional architecture into tested, running code by iterating on the backlog of work.</td>
    </tr>
    <tr>
      <td><b>Duration</b></td>
      <td>Several 1-week iterations.</td>
    </tr>
    <tr>
      <td><b>Activities</b></td>
      <td>Iterate on the backlog of work to take low-level design decisions, document learning, apply technical patterns to use, and implement user stories.</td>
    </tr>
    <tr>
      <td><b>Outcomes</b></td>
      <td>Tested and working code running on production implementing the desired system.</td>
    </tr>
  </tbody>
</table>


## Next

In the upcoming sections of this learning path, you are going to learn many more insights and best practices that are essential to successfully conducting each step of the Swift method.
