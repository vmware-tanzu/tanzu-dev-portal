---
title: "Iteration Planning Meetings (IPM)"
linkTitle: "Iteration Planning Meetings (IPM)"
description: "A regular meeting for the core team to understand and align on the work to be done."
# Note: remove any tags that are not relevant.
tags: ["Delivery"]
length: "1 Hour"
participants: "Core delivery team"
# custom "cover" image example: "boris/boris.png"
image: "default-cover.png" 
lastmod: "2021-06-17"
date: "2021-06-17"
why: 
- Regular planning meetings help ensure the product backlog is well-understood by all team members and always reflects the current priorities. By discussing and sizing product backlog items, the team may align on the delivery impact of the work to be done.
when:
- Iteration Planning Meetings should generally follow the cadence of product iterations (e.g. weekly) or should be held as often as needed to maintain a well-sized and well-understood product backlog.
what:
- A product backlog
- A prepared set of prioritized user stories to be reviewed and potentially promoted to the product backlog

# If this practice or workshop has a Miro template: remote: true
remote: false
miro_template_url: "URL for related Miro template" 

---
## How to Use this Method

{{% section %}}
### Sample Agenda & Prompts

1. Start by framing the conversation for the meeting. Help to set overall project context as needed by briefly recapping recently accepted and in-progress stories or the current state of the newest capabilities in your acceptance environment, to get everyone aligned on where things currently stand as you enter this next iteration. Review the arc of new user stories by outlining what they will add to the product. Present user interface mockups, if available.


1. Read through the first user story to explain the business value, the user value, and the acceptance criteria. Allow participants to ask questions, providing clarifications as needed.
   
   {{< callout >}}
   **Tip**: Allow space for all members of the team to get the clarifications they need to provide an estimate they feel comfortable with. Beware of individual personalities taking over the conversation or dictating approaches that prevent full team understanding.
   {{< /callout >}}

1. Prompt the engineers to indicate if they are ready to estimate the user story and if so, to estimate the relative complexity of the story by simultaneously voting on a story point estimate. 

   Please see the [short guide to estimation](#estimation) below for estimation tips.
   
1. If there is a consensus on the estimation, label the user story with the estimation result and promote it to the backlog, indicating to the team the priority of this story. Otherwise, if there is no consensus, prompt the engineers to discuss, and re-estimate if necessary until there is a consensus that the team is happy with.
   
   {{< callout >}}
   **Tip 1**: Try to prevent the conversation from taking too long or veering too far from the scope of this user story. If there is a large amount of uncertainty or disagreement on the scope of this story, it may be necessary to add a chore to the product backlog for investigating or experimenting before this story can be reasonably estimated in a future IPM.
   {{< /callout >}}
   
   {{< callout >}}
   **Tip 2**: User stories should remain implementation-agnostic. While some discussion on implementation will naturally arise when estimating relative complexity, try and keep these discussions high-level and park any deep dives on implementation.
   {{< /callout >}}

1. Repeat steps 2-4 for the remaining user stories that were prepared for this meeting.

   {{< callout >}}
   **Tip**: Use the time available to discuss and estimate as many user stories as were prepared. If necessary, some user stories may be deferred to the next Iteration Planning Meeting. Avoid taking more time than planned, sapping valuable energy from the team
   {{< /callout >}}

1. In the final 10 minutes of the meeting, review and discuss the relative priorities of product backlog items, including any engineering chores.

   {{< callout >}}
   **Tip**: Prompt the engineers to advise on the scope and importance of chores they wish to promote to the product backlog.
   {{< /callout >}}
{{% /section %}}

{{% section %}}
### Success/Expected Outcomes
Firstly, the team should have a shared understanding of the scope and relative complexity of the product backlog items that were discussed. Secondly, items should have been added to the product backlog, which remains sorted according to current priorities. The team should come away from IPM feeling aligned and energized about the work coming up in the next iteration.
{{% /section %}}

{{% section %}}
### Facilitator Notes & Tips
- To make IPMs run more efficiently, try to ensure the user stories to be discussed in the meeting have been suitably groomed beforehand. Collaborate with a designer and an engineer to ensure the stories are actionable and meet the INVEST criteria. Avoid trying to hurriedly write stories during the meeting.
- Encourage engineers to create necessary chores and if necessary, work with the engineers to prioritize and groom those chores before the IPM.
- Only hold an IPM if you have already prepared user stories to be discussed and estimated, and your product backlog contains less than 3 iterations of work, according to average team velocity. If you estimate too far out, then estimates may be less accurate and the team may forget the context by the time they begin work on those user stories.
{{% /section %}}

{{% section %}}
### A Short Guide to Estimation {id=estimation}
- If there are user stories in the product backlog that were estimated more than 3 iterations ago, consider spending time scheduled for the IPM to review and re-estimate upcoming user stories, if the team agrees it would be helpful.
- Complexity can be estimated relative to other user stories in the product backlog, or relative to a baseline user story.
- Relative complexity is an easier and more reliable way to estimate the size of a user story than the time it may take to complete the work.
- Estimates are typically quantified using “story points”, and the team should align beforehand on the point scale they will use throughout the project, for consistency (e.g. Fibonacci, linear, exponential).
- It’s important that the estimation be done simultaneously in order to avoid bias. A good way to do this is to have participants vote on the count of 3.
- Large story point estimates may suggest the user story should be broken down if the resulting smaller stories can still be valuable to users.
- User stories may be estimated to have 0 story points when there is little or no work to be done beyond acceptance testing/verification.
- It’s OK for story point estimations to be imprecise. The same team working on the same product generally makes more accurate and consistent estimates over time as discrepancies average out.
- Estimation should typically be done only by engineers, or those who will be delivering the work. Other roles, such as Testers and Architects, may contribute when they have a sufficient understanding of the relative complexity. 
{{% /section %}}


{{% section %}}
## Related Practices

### Sprint Planning vs. Iteration Planning

[Scrum “Sprints”](https://en.wikipedia.org/wiki/Scrum_(software_development)#Sprint_planning) and “Iterations” are both timeboxed activities but with some differences that impact how planning is done:

{{< table "table" >}}
|  | Sprint Planning | Iteration Planning |
| ---- | ---- | ---- |
| **Prerequisites** | • A Sprint Goal<br>• A prioritized Product Backlog | • A prioritized Product Backlog<br>• User stories to be reviewed  |
| **Objective** | • Align on a goal for the Sprint<br>• Negotiate and plan the scope for the Sprint (a.k.a. the Sprint Backlog) | • Maintain a shared understanding of the current scope and priorities (i.e. the Product Backlog) | 
| **Activities** | • Review user stories<br>• Pull user stories from the Product Backlog to the Sprint Backlog | • Review user stories<br> • Estimate user stories<br> • Promote user stories to the Product Backlog according to priority | 
| **Outputs** | • An unprioritized Sprint Backlog that the team commits to deliver and demonstrate at the end of the Sprint | • A prioritized Product Backlog<br> • An estimation of the work that may be delivered and demonstrated during the Iteration | 
| **Participants** | • Product Owner<br> • Engineers | • Core team |
{{</ table >}}
{{% /section %}}

{{% section %}}
### Preceding
[Iteration pre-planning](/practices/iteration-pre-planning) (optional)
{{% /section %}}


{{% section %}}
### Recommended Reading
[Agile Estimating and Planning](https://www.amazon.com/Agile-Estimating-Planning-Mike-Cohn/dp/0131479415) by Mike Cohn

[Yesterday’s Weather](http://wiki.c2.com/?YesterdaysWeather)

[Planning Poker](https://en.wikipedia.org/wiki/Planning_poker)

Chapter 12 of [Extreme Programming Explained](https://www.goodreads.com/book/show/67833.Extreme_Programming_Explained) by Kent Beck, Cynthia Andres

[ExtremeProgramming.org](http://www.extremeprogramming.org/rules/iterationplanning.html)
{{% /section %}}