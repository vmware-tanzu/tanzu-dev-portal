---
title: "Postmortem"
linkTitle: "Postmortem"
description: "An exercise to learn from any incident that impacts the product or users. In the SRE community, this exercise is called an incident retrospective."
tags: ["Delivery"]
length: "1 hour"
participants: "Core delivery team, stakeholder, and support team"
image: "default-cover.png" 
lastmod: "2021-07-28"
date: "2021-07-28"
why: 
- Post-mortems help to reduce the recurrence of negative incidents.
when:
- When the team agrees that there is something to learn about the incident or near miss.
- During the incident or soon after it is resolved, as long as the session would not interfere with resolving the incident
- Stakeholders or another team (eg: support) has asked for a postmortem session.
what:
- Whiteboard or digital version like [Miro](https://miro.com/)
- Sticky notes
- Painter's tape
- Sharpies

remote: false
miro_template_url: "" 

---
## How to Use this Method
First, let's define an Incident:
- An event in the live product that interrupts the user’s interaction with the product
- An unexpected negative event that has a high impact on your development process
- An [error budget](https://cloud.google.com/blog/products/management-tools/sre-error-budgets-and-maintenance-windows) violation

### Sample Agenda & Prompts
1. **Prior to the session**, collect as much information about the incident as you can. For example, you might send a survey to relevant teams requesting information. If teams took notes about the incident while it was in progress, collect these as well.
   
   Moreover, it will be helpful to create a timeline prior to the session and validate it during the postmortem session.
   
   Example of timeline:
   
   ![Postmortem Timeline](/images/practices/post-mortem/timeline.jpg)
   
   Make sure to invite the right people for the postmortem session. For example:
   
   - Core team: Product Manager(s), Engineer(s), Designer(s)
   - Relevant party, anyone who is the key role and involved in the incident. For example:
      - Member of platform team
      - Member of security team

1. **Explain the goal of the postmortem (5 mins)**

   You might say something like: 
   
   > “What caused the recent incident? And how did we fix it? Additionally we want to define action items to avoid this in the future and document it in our postmortem document.  We are not looking to find someone to blame.” 
   
   {{< callout >}}
   Tip: Embrace blameless culture because you want to identify what happens and how to avoid it in the future. Make sure you provide psychological safety for each team member.
   {{< /callout >}}

1. **Present the incident timeline (5 mins)**

   Show the incident timeline and confirm it with the team.

1. **Brainstorming Postmortem Topic (5 mins)**

   Ask team to write on post-it or digital workspace:
   
   - What went wrong - What caused the recent incident?
   - What went well - What did we do that worked well to fix the incident?
   - Where we got lucky - Are there any events/things that helped us out?

1. **Quick Topic Clustering (5 mins)**
   
   Ask the team to cluster the post-its based on similar topics.

1. Discuss each cluster (20 mins)
   
   Allow enough time for each cluster to be discussed. If any particular clusters need additional time, consider a follow-up session about that specific topic.
   
   Additionally, for clusters in the “what went wrong” column, ask “Why did this happen?” and “How can we reduce the impact if it happens again?” 
   
   {{< callout >}}
   Tip: consider using [“five whys” method](https://en.wikipedia.org/wiki/Five_whys). Again, be sure to focus on root causes that are due to the process, not individual blame.  
   {{< /callout >}}

1. **Discuss the action items (15 mins)**

   Discuss with the team what actions we can take to solve the incident and avoid it in the future. Define the owner(s) of these actions.

1. **Agreed on the postmortem owner(s) (4 mins)**

   Decide as a team the post-mortem owner, whose responsibilities are to:
   
   - Create a post-mortem document for future reference that contains:
      - Overview of the incident
      - Action items to resolve the incident
      - [Root cause analysis](https://asq.org/quality-resources/root-cause-analysis)
   - Learnings and next steps to avoid the incident happening in the future
   - Communicate with stakeholders regarding the status of the post-mortem
   - Plan review meeting to make sure all action items in the postmortem meeting is done

1. **Schedule the follow up (1 min)**

   Agree with the team for a follow up post-mortem session to review the actions. The incident is not closed until all post-mortem actions are completed. 

## Success/Expected Outcomes
At the end of this exercise, the team will have a clear alignment of what the incident was and how it happened. Moreover, the team will have a set of plans to prevent or reduce the impact of the incident’s recurrence. 

## Facilitator Notes & Tips
Examples of postmortem documents: 

- https://sre.google/sre-book/example-postmortem/
- https://github.com/dastergon/postmortem-templates
- https://github.com/danluu/post-mortems
- ["sredocs" on GitHub](https://github.com/google/sredocs)

## Recommended Reading
[Atlassian Incident management](https://www.atlassian.com/incident-management)

[Google Post mortem culture](https://sre.google/sre-book/postmortem-culture/)

Life of a production system incident ebook (coming soon!)
