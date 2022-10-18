---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: Collaboration When Developing a Thin Slice of Functionality
weight: 50
tags: []
---

By the time a development team begins to implement the solution, everyone should be familiar with the notional architecture and the work involved. However, this does not mean that architects and product managers are disengaged from the process.


## Architects

Architects hold a lot of context with respect to the overall architectural vision and what each team is doing. This provides an opportunity for the architect to quickly identify duplicative efforts, similar struggles encountered by separate teams, and better practices, and to align practices across teams.

In addition to cross-team work, architects work with the developers within the teams. These can include:



* Helping developers with a user story when developers are stuck
* Explaining how a new design pattern or technology works or should be coded
* Coding standards
* Complexities or blockers that will change the original architecture

💁 Tip: Architects shouldn’t feel like they are only allowed to work with developers when asked. Architects are encouraged to jump in with teams on the day-to-day work even if it’s to help a team even out their pairs or joining an existing pair to foster more collaboration and empathy.


## Developers

Ideally, developers should be able to develop the user stories as written and according to the notional architecture. The developers should find that the work is straightforward due to the context they hold from participating in the event storming, Boris, SNAPe, and story writing.

As developers work on each story, they should first be thinking about how they will implement the story to give feasibility input—Can it even be done? How long will it take? Is it risky? In addition to the actual job of coding, developers should also be thinking about ensuring that the software is:



* Capable of allowing for changes and agility in the future
* Easier to maintain to avoid technical debt
* More performant and reliable
* Easier to recover from failure
* More secure

When developers get stuck or come across something in the user story that they don’t understand, they should first refer to the Boris and SNAPe diagrams to see if the answers can be found in the documentation. If not, developers should talk with the product manager and the architect as soon as possible to keep the momentum going and not impact velocity.

Over the course of development, they may come across complications or discover dependencies that were not addressed during the Boris exercise and that impact the architectural design. When the architecture may need to change, developers should engage with architects to discuss the discovery and come up with a solution.

💁 Tip: Developers shouldn’t feel like they are only allowed to work with architects in a scheduled meeting. Developers are encouraged to reach out and ask for help or assistance when needed; they should not wait until the next scheduled time that architects and developers meet to bring up their needs.


## Product

While developing a thin slice of functionality in a modernization effort, a product manager’s main concerns do not differ from developing any other feature. There are two broad categories that a product manager should focus on:



* Ensuring the team has all the information they need to do the work
* Identifying and defining the lean experiments to validate or invalidate our assumptions

Some of the questions that a product manager might ask are:



* Does the team understand the vision and the expected outcome of the work?
* Does the team have clear requirements for the work?
* Does the team have just enough work?
* What feedback are we receiving?
* What is the impact of the feedback to our plan?

In developing a thin slice, the team often discovers more unknowns and unexpected complications when modernizing a legacy system. A product manager would continue to treat these as any other unit of work by helping the team to clarify uncertainties and unblock any blockers. In practical terms, it might include pulling impacted developers or teams to discuss the problem, how it impacts our product goals, and pains the customer experiences. The team can then generate different solutions to the problem and come to a decision on the best path forward.

As part of the decision-making process, the team can use lean experiments to de-risk the development activities along the way. Lean experiments help de-risk software development under extremely uncertain conditions, such as proving out whether a new and untested architecture will work as intended in the notional architecture.

In mature teams, lean experiments should be discussed concurrently with the solution without any need for a product manager to lead the discussion. In developing teams, a product manager should lead this discussion and make sure that the work is being de-risked along the way rather than waiting for software to be released into production to find out if the team has built the right thing.

While developers take the lead in creating the new system, by no means do architects and product managers sit on the sidelines. We always encourage an active and involved architect to provide another pair of helping hands and set of eyes. Product managers alike should stay engaged to ensure the path ahead is clear for the team and that they are engaged with the work to keep the modernization effort on track.

In the upcoming lesson, we’ll conclude this series with releasing the thin slice to a production environment.


## Resources

[Lean Experiments | VMware Tanzu Developer Center](https://tanzu.vmware.com/developer/practices/lean-experiments/)

[The Lean Startup](http://theleanstartup.com/) 