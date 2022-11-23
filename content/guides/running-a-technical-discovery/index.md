---
date: '2022-11-22'
lastmod: '2022-11-22'
description: Discovery work is about finding and reducing risk, and technical discovery is no different. Running a technical discovery before software development can help to set your team up for success. 
linkTitle: Running a Technical Discovery
subsection: Spring Cloud
featured: true
team:
- Gagandeep Kaur
- Luke Malcher
title: Running a Technical Discovery
level1: Agile Transformation and Practices
level2: Agile Development
---

Running a technical discovery before software development can help to set your team up for success. Discovery work is about finding and reducing risk, and technical discovery is no different.

Typical goals you might aim for in a technical discovery are:

- Be ready to start building on day one
- Have a clear path to production
- Understand how technical constraints might impact the product 

Ideally technical discovery can happen while [product research](https://tanzu.vmware.com/developer/guides/guide-to-discovery-and-framing/) is taking place. This way product and engineering streams can inform each other without delaying delivery.

## Identify assumptions and risks

Start by capturing assumptions about the project. For example: What’s the current state? What exists? What doesn’t? What are the current unknowns?

Then identify the biggest risks through a [risks and mitigations](https://tanzu.vmware.com/developer/practices/risks-and-mitigations/) exercise. This is where the team brainstorms things that could cause the project to fail - or be slowed down - from a technical perspective. 

If your team is running a risks and mitigations exercise, make sure whoever is facilitating prompts participants to consider technical risks. If it seems like the technical risks that come out are too vague or there are too many, it could help to run a specific version of this exercise for technical risks.

Speaking to stakeholders in the organization can also help uncover risks and opportunities. Interview developers and stakeholders about how they currently work, how software is currently being delivered and how the people involved interact. 

## Set Technical Discovery goals

With some agreement on the biggest assumption and risks, you are now in a good position to agree on some goals for your technical discovery. Some of the most common goals you might aim for are: 

- Be ready to start building on day one
- Have a clear path to production
- Understand how technical constraints might impact the product 

We’ll dig into the details of these in a section at the bottom of this article. 

When setting your goals, consider what is achievable in the time you have. If the domain is unfamiliar or complex, things will take longer.

## Build a Technical Discovery backlog

During technical discovery, you should build and prioritize a backlog similar to a software user story backlog - but based on things you are trying to learn or decide. 

Remember to keep your goals in mind. Take things a day at a time, sharing learnings with your team - perhaps in dedicated time after team stand-up - and pausing regularly to re-prioritize the backlog. 

If you are struggling to prioritize items in the backlog, run a prioritization activity with your team. Draw a 2x2 grid where one axis is “level of understanding” and the other is “importance to this project”. Brainstorm the things you might need to learn about and discuss where each item belongs on the grid. The most important and least understood items will be the top priority to learn about in Technical Discovery. Visit the [2x2 prioritization](https://tanzu.vmware.com/developer/practices/2x2/) practice page for more tips on how to run this activity.

## Work together with product to avoid silos

It’s important that product discovery and technical discovery are not done in isolation from each other. Maintaining a [balanced team approach](https://tanzu.vmware.com/developer/learningpaths/application-development/balanced-teams/) helps the whole team to make the most of what you learn during discovery.

Make sure you communicate technical discovery findings. Make sure the team knows why each finding is important - for example does it impact product direction or product delivery?

Don’t forget that engineering also has an important role to play in product discovery work, so make sure to balance this with your technical discovery. During user interviews or prototype testing an engineer can identify technical concerns, or notice an opportunity that a less technical team member might miss.

## How to approach typical technical discovery goals
Let's break down our goals to make them more achievable.

### Goal: Be ready to start building on day one

This means you can push code, that tests will run, and if successful it will be pushed to an environment where acceptance can take place.

#### Sub-Goals

Pick the goals relevant to your situation: 

- Get access to systems
- Make key technical choices
- Decide where to deploy
- Set up CI/CD, tools, platform, etc.
- Ramp up on unfamiliar tech
- Investigate potential integrations and get access to them e.g. API keys


### Goal: Have a clear path to production

This means you have a way to push code into production, and a way to do this often and incrementally. Usually there will be an existing path to production to uncover and potentially improve upon. Other times you may be creating one for a new platform.

Use Path to Production Mapping to create a detailed picture of how code gets to production in the organization. This activity usually takes an hour or two, and relies on having the right people in the room - particularly people who have done this before and have experience of the process.

Another approach is to deploy a “steel thread” - a version of your app with the basic set up and integration points but no functionality. The process of deploying a sample application takes longer but can give you a more accurate picture of what you will need to do and will help you to drive out issues like system access. 

You might want to try deploying a steel thread app after you’ve mapped the Path to Production to validate what you have found. Alternatively if there is no existing path to production, this can be used to drive discussion and demonstrate how the process you are creating could work. 

#### Sub-Goals

Pick the goals relevant to your situation:  

- Understand the existing path to production
- Propose a suitable path to production for a new platform
- Identify and understand regulations that you have to follow
- Identify stakeholders who 'sign off' and build relationships with them
- Identify pain points in the existing path to production and come up with strategies to avoid them
- Build confidence within the team via delivery, especially for teams who were skeptical or unfamiliar with pushing to production early in a project’s life cycle

### Goal: Understand how technical constraints might impact the product 

This means you can assess the feasibility of potential solutions and share any technical constraints or concerns that might impact product direction.

#### Sub-Goals

Pick the goals relevant to your situation: 

- Aim to understand the domain
- What’s off the table? What can’t we do?
- Understand technical complexity of potential solutions
- What technical or security requirements are there?


## Advice from our team

We asked around at Tanzu Labs to find out what tips people had for Technical Discovery. This is what people told us: 

- Discovery is a lot more chaotic than the delivery phase so don’t expect to move as quickly. This is the start, you will gain momentum later.
- Reach out to practitioners that have worked on similar projects for advice.
- When building a Proof-of-Concept: make it look rough and temporary so that it will be thrown away. If the code is of low quality but the proof of concept looks good stakeholders may want to use it!
- If you can't get access to people or information you need, raise this as a risk to your project sponsor.
- Keep product and design informed about Technical Discovery findings.
- Get the whole team involved in the decision making and planning to encourage a sense of shared ownership.
- Have a schedule and make it visible to the whole team.
- Focus on outcome/goals.
- Focus on things that you cannot continue without.
- Focus on things that are unlikely to change e.g. don’t start a walking skeleton before the tech stack is established.
- Don’t stress if things take longer than planned, anything you get done will save time later and you can still do the remaining work in the delivery phase (be sure to raise this as a risk to the team).
- If you get stuck, ask yourself what decision your team is trying to make. You can often work backwards from that to the things you need to find out.

## Practices you might try during Technical Discovery

Review and apply these practices and workshops to help your technical discovery become more successful.

- [Risks and Mitigations](https://tanzu.vmware.com/developer/practices/risks-and-mitigations/) - Brainstorm what could cause project delay or failure and think of ways to avoid this
- [Path to Production Mapping](https://tanzu.vmware.com/developer/practices/path-to-production-mapping/) - The team collaboratively maps out the Path to Production. 
- [Ubiquitous language](https://tanzu.vmware.com/developer/practices/ubiquitous-language/) - a session to establish a common set of terms understood by the core team 
- [Event Storming](https://tanzu.vmware.com/developer/practices/event-storming/) - session to map out events in a system and or domain 
- [Service Blueprint](https://tanzu.vmware.com/developer/practices/service-blueprint/) - a session to map out the technological and human interactions that take place in a customer journey- Steel thread - Also known as a tracer bullet or walking skeleton, a steel thread is an app with no functionality that is pushed to production to de-risk the process and integrations.  
- [Architectural decision records](https://tanzu.vmware.com/developer/guides/architectural-design-records-what-were-the-engineers-thinking/) - a process for keeping track of decisions for sharing context with the current and future team
- [C4 architecture diagrams](https://c4model.com/) - a model for mapping out software architecture 
- Proofs of concept - quick experiments to check if an idea is feasible 
