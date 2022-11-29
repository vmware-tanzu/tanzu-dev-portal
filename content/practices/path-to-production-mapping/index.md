---
title: 'Path to Production Mapping'
linkTitle: 'Path to Production Mapping'
description: 'A workshop to understand and map out all of the steps needed to get from a feature being built to having it running in production. This method adapts Event Storming to get people actively involved and contributing to the session.'
# Note: remove any tags that are not relevant.
tags: ['Technical Discovery']
length: '1-2 hours'
participants: 'Core team, stakeholders, subject matter experts; also see Facilitator Notes & Tips.'
# custom "cover" image example: "boris/boris.png"
image: ''
lastmod: '2022-11-22'
why:
    - This process helps to create a detailed overview of the Path to Production and can help resolve misalignment on the process between different teams and roles. It can also help to identify and resolve process bottlenecks and find opportunities to improve the process.
when:
    - During the technical discovery before deploying the application.
    - When you are able to run a highly collaborative session, with multiple people contributing at the same time. If your tools or situation do not allow for this, Value Stream Map is an alternative where one person drives the mapping.
what:
    - 'Whiteboard or digital version like [Miro](https://miro.com/)'
    - Dry erase markers
    - Sticky notes

# If this practice or workshop has a Miro template: remote: true
remote: false
miro_template_url:
---

## How to Use this Method

{{% section %}}

### Sample Agenda & Prompts

1. Provide a starting event like “Story picked up from Backlog” or “Somebody had an idea” and a final event which will probably be “Customer used the new feature”.

1. Ask everyone to brainstorm all of the "events" in the path to production and write each one on a sticky note. 

   If people are struggling to come up with events, provide example events such as “code review completed”, “deployed to the production-staging environment”, “signed off by…”

   {{< callout >}}
   **Tip:** Events should be in past tense to make the final map consistent.
   {{< /callout >}}

1. Ask everyone to put all the events from left (earliest) to right (latest) on the shared board. At this stage it will probably be messy with lots of duplicates.

1. Walk through the board, deleting duplicates and clarifying order when there are differing opinions. When there is misalignment the people most involved in that part of the process should be able to provide clarity.

   {{< callout >}}
   **Tip:** Some tasks will often happen in parallel, but you should still try to define an order. If the team says two things can happen simultaneously, then the order does not matter, but still set an order and see if anybody objects.  This will help you spot if there is a hidden dependency.
   {{< /callout >}}

   {{< callout >}}
   **Tip:** Asking a pair of teammates to lead this step can help everyone to feel more engaged.
   {{< /callout >}}

1. For each stage, ask people to create stickies (use a different color) for which systems and tools are involved. Add them below the relevance events on the map.

1. Ask people to create stickies (again use a different color) for the teams and people involved in each step. Add them below the relevance events on the map.

1. Brainstorm pain points using red stickies and add to the map.

1. Discuss with the group how long it usually takes to complete each part of the process. It may be easier to add an estimate to a group of 2–3 steps rather than each one individually.

   {{< callout >}}
   **Tip:** If timings are hard to provide, try "T-shirt" sizing and assigning each section a Small, Medium or Large label.
   {{< /callout >}}

1. If there are any blank areas or places where there are outstanding questions, assign actions to people to find out the answers.

1. Set a time to follow up and clearly state what you will be doing with the output. 

   Depending on your situation this might be to start improving the path to production, or to mitigate risks as you plan how to release the first version of your application, or a mixture of the two.

1.  After the session, if there are areas with pain points, or long time scales, see if you can improve them or get to them as soon as possible. Make sure you have access to all the tools and systems mentioned and if there are any teams or people involved that you have not met, connect with them and find out early what they need to help move your product through the process.

{{% /section %}}

{{% section %}}

### Success/Expected Outcomes

Your team has produced a Path to Production map that helps you prepare to deliver your product.

{{% /section %}}

{{% section %}}

### Facilitator Notes & Tips

Possible Participants:

-   Software Engineers
-   Software Architects
-   Product Manager
-   Product Owner
-   Security
-   Compliance
-   Delivery Manager
-   Platform
-   Security
-   Compliance
-   Designer
-   Anyone who you need help or approval from before the app can reach production

Other Notes:

-   Once the pain points in the path to prod have been identified, follow up with a solution prioritization exercise to plan how to improve the path to production.
-   If you want to remove risk along the path to production you can run a session to come up with ways to mitigate for the pains and risks identified in this session.
-   The most thorough way to understand what it will take to get your application to production is to try to deploy a "steel thread" application using the process you've mapped out. A steel thread is a version of your app with the basic set up and integration points but no functionality.

{{% /section %}}

{{% section %}}

## Related Practices

[Value Stream Map](/practices/value-stream-map/)

{{% /section %}}
