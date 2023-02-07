---
title: 'Pre-Mortem'
linkTitle: 'Postmortem'
description: 'An exercise to help the team anticipate potential major reasons for project failure. The premortem can be seen as "a powerful protection against wishful thinking"'
tags: ['Delivery', 'Discovery']
length: '1 hour'
participants: 'Core delivery team, stakeholders'
lastmod: '2023-02-06'
date: '2023-02-06'
why:
    - Pre-mortems help identify in advance potential issues that could derail the project.
when:
    - Ideally at the beginning of a project.
    - Ahead of something important happening. For example, ahead of a release.
    - Can use it for a specific instance throughout the project or for the project overall.

what:
    - Whiteboard or digital version like [Miro](https://miro.com/)
    - Sticky notes
    - Painter's tape
    - Sharpies

remote: false
miro_template_url: ''
---

{{% section %}}

## How to Use this Method

Make sure to invite the right people for the pre-mortem session. For example:

-  Core team: Product Manager(s), Engineer(s), Designer(s)
-  Relevant party, anyone who has a role to play in the project. For example: business stakeholders, platform and security team members, etc

Before the activity, identify a specific date in the future (deadline) for an important piece of work (or entire project)

At the end of the activity, the team will also have generated some potential actions that can be taken in order to avoid or reduce the likelihood of the issues happening. 

This activity is similar to [Risks & Mitigations](/practices/risks-and-mitigations), with the main difference that it uses a specific scenario where the team imagines the project has failed. Additionally, you could also “couple the premortem with an optimistic test” [\(2\)](#sources)

{{% /section %}}

{{% section %}}
### Sample Agenda & Prompts

1. **Share context with the team (5 min)**
   Explain the goal of the pre-mortem. 

   You might say something like:

   > “Imagine that today is <the day of the important event> and that the project failed. What happened? What caused the project to fail?”

   Or could say:

   > “Flash Forward. Imagine that the <project> is under way. Now imagine there’s been a major setback. What is it?” [\(3\)](#sources)

   {{< callout >}}
   Tip: By prompting the team to imagine that they are already in that situation and that the project failure has already occurred, you might increase the team’s ability to correctly identify reasons for future outcomes by 30%.” [\(3\)](#sources)
   {{< /callout >}}

   {{< callout >}}
   Tip: Make sure you provide psychological safety for each team member so that everyone can speak up.
   {{< /callout >}}

1. **Brainstorming Pre-mortem Topics (10 mins)**
  
   Ask the team members to individually brainstorm and write on post its or digital workspace reasons why the project failed.

1. **Quick topic Clustering (5 mins)**
  
   Ask the team to cluster the post-its based on similar topics. Remove the duplicate stickies

1. **Pick the top priority topics to cover (5 min)**

   There are several approaches you can take here:

   -  Discuss all topics
   -  Pick only a few topics to discuss, by doing a prioritization activity. Prioritization options include:
     -  Dot vote
     -  Plot each topic on a 2x2 with axes labeled: likelihood of occurrence and level of risk/how severe the consequences [\(4\)](#sources) . Pick the ones that have highest likelihood of occurrence and most severe consequences

1. **Discuss prioritized topics (30 mins)**
   Allow enough time for each topic to be discussed.

   Consider “How did this happen?”

   {{< callout >}}
   Tip: consider using “five whys”  
   {{< /callout >}}

   For each of the prioritized topics, identify actions that can be taken in order to mitigate that issue and also agree who will own each action.

1. **Schedule the follow up (1 min)**
   
   Agree with the team for a follow up pre-mortem session to review the actions.

   {{< callout >}}
   Tip: after considering potential major setbacks, you could also prompt people to imagine that “this time there’s been some sort of pleasant surprise. What is it?”. This optimistic scenario will help the team also prepare to recognize opportunities and find solutions that are creative.[\(5\)](#sources)
   {{< /callout >}}

{{% /section %}}
{{% section %}}

## Success/Expected Outcomes

At the end of this exercise, the team will have a clear alignment of what are some of the potential major issues that might prevent them from achieving what they’ve set to. Moreover, the team will have a set of plans to prevent or reduce the likelihood of that issue occurring. 

{{% /section %}}

{{% section %}}

## Recommended Reading
[Atlassian How to Run a Project Premortem](https://www.atlassian.com/team-playbook/plays/pre-mortem)

[Performing a Project Premortem](https://hbr.org/2007/09/performing-a-project-premortem )

### <a id="sources"></a> Sources: 
(1),(2),(5)  Wheeler Michael, 2013, The Art of Negotiation,  Chapter: Best case and worst case analysis, Harvard Business School 

(4) Chip Heath, 2014, Decisive - How to Make better decisions, Chapter: Bookend the Future

(3) Klein, 2007, Performing a Project Premortem, 2007 

Book: Life of a production system incident (coming soon!)

{{% /section %}}
