---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: Collaboration When Writing Stories for a Thin Slice
weight: 40
tags: []
---

Even in modernization work, user stories are needed. Modernization work is not just technical work that developers can manage themselves; it should be developed as any other new feature, with requirements and acceptance criteria. Architects, developers, and product managers should work together to clarify the work needed for the thin slice that may not be represented in the Boris diagram and break it down into user stories.


## Architects

Stories are usually written by a product manager or product owner. While this is the expectation, architects often contribute as well by:



* Providing more big-picture context or technical details within the story
* Creating a small demo service for developers to consider in their coding that developers can run on their local machines to see the development pattern for the new services
* Spotting any discrepancies from the Boris and SNAP diagrams
* Identifying potential parallel efforts that we can take advantage of during the modernization effort, for example, adding in a shared biometric authentication service

Oftentimes, new details and complexities arise when providing more context for the user story. This may trigger the architects to pair with developers to come up with a solution. Sometimes the complexities are outside of our control, for instance, if it is dependent on another team or because of a technical limitation. In these cases, an architect can be helpful by thinking through how the team can address the complexities in the short term while also building out a long-term solution. 

💁  Tip: Make sure to update the Boris and SNAP diagrams when changes happen, including temporary and short-term solutions so that the team has an accurate representation of the decisions made.

During the process of writing stories, the architects should be involved to help identify critical pieces of information that are already known. For example, this could include the specific data tables that the new service will need to call. These details should be called out in the stories created when pairing with the product owner or product manager when writing the stories. Involving the architects saves the developers the time it would take to research the information and allows the architects to quickly disseminate patterns of the system to the team.


## Developers

Developers contribute to the story writing process by providing implementation details that would help make the development process smoother. These details can range from small details that only certain individuals know to patterns that may help make the coding smoother. 

Some examples of these implementation details can include:



* Specific table name within a database
* An existing service that can be reused
* Procedural work, such as ticket requests to open a port in the firewall
* Getting advice from people who have done similar work in the past
* Link to code snippets or where to find similar code in the codebase to reuse

In addition to implementation details, developers work with architects and product managers to clarify the requirements and acceptance criteria. They may ask questions such as:



* What edge cases are considered out of scope?
* How can we prevent an edge case from blocking a story from being delivered?


## Product

Product owners or product managers should be writing stories that represent the notional architecture diagrammed in the Boris diagram and SNAP exercise. The Boris diagram shows the high-level relational architecture between different service candidates. The SNAP exercise should include more details on each of the service candidates, such as specific pieces of functionality, events to emit, and any external systems impacted.

The Boris diagram shows the different service candidates and how services relate to each other. Following the lines between the services, create a thin vertical slice of functionality that can be independently shipped to production. The SNAP exercise will include the functionality that the service will need. These functionalities will be the stories that have to be written.

📌 Example: A thin vertical slice story should cover the UI inputs that call a service, which in turn calls the database or data layer to retrieve the data and return to the user on the UI. 

While writing stories, product managers may be asking themselves the following questions:



* Is the story written in a way that, if needed, can be released to production by itself?
* If the story is released to production, will users be able to use it and get value from it?
* Could a developer pick up and start without needing any clarification on the requirements and acceptance criteria?
* Can a developer complete the story in about one day or less?
* Are there clear acceptance criteria to test whether or not the story was completed correctly?

The first vertical slice is usually “fatter,” since developers will need to stand up the initial services and APIs. However, once this first story is completed, the rest of the stories that add other functionality using the same services and APIs will involve less complexity and effort.

💁 Tip: The first story in a vertical slice is a great opportunity to discuss with the team how they’d like to split the work into manageable chunks while still following the [INVEST](https://tanzu.vmware.com/content/blog/how-to-write-user-stories-without-users) best practice for story writing!

While it might seem like writing user stories is a solo effort by the product owner or product manager, architects and developers both play important roles in making sure that the team, as a collective, is clear on what and how they will build the solution. Furthermore, the team establishes a shared understanding of the system as a whole and why decisions were made.

In the next lesson, we’ll look at collaboration amongst a balanced team while implementing the user stories.


## Resources

[Writing Agile User Stories for Event-Based Systems | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/guides/writing-agile-user-stories/)

[How to Write User Stories Without Users](https://tanzu.vmware.com/content/blog/how-to-write-user-stories-without-users)
