---
date: '2021-11-04'
lastmod: '2021-11-04'
layout: single
team:
- VMware Tanzu Labs
title: "Scenarios: Anchorship in Practice"
weight: 80
tags:
- Teams
- Roles
- Agile
aliases:
- "/outcomes/anchor-playbook/scenarios-anchorship-in-practice"
---
Common scenarios that come up frequently with recommendations for all anchortypes.

### Scenario: Introducing the Anchor
A new team member has joined the project and the team is introducing roles and responsibilities, including the anchor role. The team wants to make it clear that the anchor has specific responsibilities, but they do not want to indicate that the anchor is the sole owner of those responsibilities or make it difficult to transition anchors if needed.

#### Recommendation
As you introduce the [balanced team](learningpaths/application-development/balanced-teams) to the new team members, include a description of the anchor role. Be aware that pre-conceptions people have around leadership in engineering may color their expectations of an anchor’s responsibilities. Be prepared to counter these expectations as needed (see table below). In addition, be aware that the current team anchor may need to transition into another role at some point for a variety of reasons, including possibly transitioning a [mentoring anchor](learningpaths/anchor-playbook/the-learner) to the primary anchor role. Do not imply that the anchor is the keeper of project lore: on the contrary, the team will function best when everyone has full context and any engineer is equally capable of helping to onboard new team members.

{{< table "table" >}}
| The Anchor Is Not | The Anchor Is |
| ---- | ----------- |
| Is not "the tech lead" | Is Tanzu Labs' answer to the "tech lead" |
| Is not "the decider" | Is a facilitator for good team decisions |
| Is not "the boss" | Is a teacher |
| Is not "the architect" | Is teh initiator of architectural conversations |
| Is not "the manager" | Is an advocate for growth and empowerment |
| Is not responsible for the business stakeholder's decisions | Is responsible for due diligence with regard to technical excellence |
|  |  |
{{< /table >}}

### Scenario: Program Onboarding
In a program with multiple projects, it is often true that one team — for instance, the initial team in an expanding portfolio — holds more context than the new team. In these cases the team or teams closer to a core group of stakeholders or technical approvers are responsible to ensure this context is shared across the program.

#### Recommendation
Dedicate time for the program sponsor and a versed anchor to onboard new anchors as they join the program.
1. Working with the program sponsor, the appropriate team’s anchor schedules some one-on-one time with the incoming anchor to provide the lay of the land and make sure that valuable context is shared.
2. The onboarding anchor is responsible to ask questions, make sure they are on the same page, and possibly raise areas of inquiry for both teams. Fresh eyes are generally valuable.
3. The anchors may decide that a more frequent cadence of anchor planning meetings (APMs) would be a useful way to carry on the conversation.

### Scenario: Anchors Away!
It is not always possible to keep a much loved anchor on a project. Removing an anchor can cause stress for the team, who has come to trust and rely on the anchor. However, it’s not always possible or desirable for an anchor to see a project through to its conclusion.

#### Recommendation
Managers, project sponsors, and stakeholders should feel free to rotate the anchor to another project, either to support a new team or to provide opportunities for the employee that they might otherwise miss. In order to do this safely:
1. Avoid setting the expectation that anchors always remain with a project until the end.
2. Either provide time for a new team member to work with the outgoing anchor until they fully understand the context and issues (see [the Learner]((/learningpaths/anchor-playbook/the-learner)), or socialize that a trusted and experienced engineer will be taking over as the anchor.
3. Try to avoid transitioning multiple members of the [balanced team](/outcomes/application-development/balanced-teams/) at the same time.
4. Encourage teams to maintain lightweight architecture decision records (ADRs) to support continuity during a transition.

### Scenario: Cross-Team Neural Network
Projects are more likely than ever to require multiple teams, which may spin up in different offices or regions. Teams are using Slack or MS Teams channels, but communication is light, asynchronous, irregular and targeted (e.g., Slack is used to pose and answer specific questions, but it’s not a good venue for exploratory conversation). Teams need a way to communicate cross-cutting concerns, vet technical decisions, and align on shared direction in real time.

#### Recommendation
**_NOTE from Author: This section feels outdated_**

For programs or project portfolios that have more than one parallel effort, use anchor planning meetings (APMs) to surface issues relevant to all portfolio teams.
1. The program CL, with input from the relevant customer Journey Lead, initiates and facilitates this meeting so that they are aware of program level decisions and are well positioned to provide support, if needed.
2. Anchors are responsible for recognizing and initiating topics relevant to the program.
3. Planning questions:
   a. Who needs to be present? CLs and balanced team representatives are needed. Does the BAT team need to be involved? Do you want to invite team members? What makes sense for your teams and your program?
   b. How often do you want to meet? Meeting regularly enough to surface emergent issues is advisable, but cadence can be tailored to the frequency of change and/or the maturity of the project.

### Scenario: Learning Anchorship
Anchors use a variety of skills depending on the context they are operating in and the problems they are trying to address. The different modes in which the anchor operates (the modalities described in the previous section) can be difficult to see and learn in the course of one project. Learning the many facets of anchorship over the course of several projects can contribute to role confusion and overall stress.

#### Recommendation
Identify prospective anchors and create an opportunity to learn from an experienced anchor as both work together on the same project. If the mentoring anchor is introduced as such to the team, it may be easier to switch anchors in the course of the project, thus making it easier to transition the senior anchor to a new project if needed. This practice is good for both the shadow, who has the opportunity to learn anchorship from an experienced team member and the anchor, who will be reminded to keep anchor responsibilities top of mind.

1. The prospective shadow anchor’s manager informs the team anchor that their report is particularly interested in learning anchorship during the course of the project.
2. When they begin working together, the anchor and their shadow anchor should discuss their goals for the project. After this, they can continue a dialogue with regular 1:1’s.
3. Both anchors should participate in Anchor Planning Meetings and stakeholder update calls.
4. The anchor can help find other opportunities to practice anchor skills (e.g., tee up a stakeholder conversation), provide back up as needed, and offer feedback.
5. Both anchors look for an opportunity to swap roles, with the shadow anchor providing support until the original anchor is allocated to another effort, or a new shadow anchor is identified and rolled onto the team.
