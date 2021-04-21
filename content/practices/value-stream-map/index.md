---
title: "Value Stream Map"
linkTitle: "Value Stream Map"
description: "Visualize the steps an organization takes to create & deliver value to customers in order to help eliminate \"waste.\" A common use case is a path to production."

tags: ["Kickoff", "Discovery", "Framing", "Inception"]
length: "60 min"
participants: "Core team, subject matter experts (as needed)"

image: "default-cover.png" 
lastmod: "2021-04-21"
why: 
- To identify how we could deliver user and/or business value faster and/or more often by identifying delays, unnecessary features and hand-offs. 
- To understand the steps and people involved in a process so that we can improve collaboration and preclude potential blockers.
when:
- This activity can be done as early as the Kickoff if there are concerns about many teams creating one system or known problems in the path to production. Otherwise, it can be done as part of technical Discovery, Framing, or any time the team finds itself bogged down with an inefficient process.
what:
- "Whiteboard or digital version like [Miro](https://miro.com/)"
- Sticky notes
- Sharpies / markers

remote: false
---
## How to Use this Method

### Sample Agenda & Prompts
1. Explain the purpose of the workshop.
   
   Using path-to-production as an example, you might say something like:
   
   > “To identify our path to production, we’ll follow a feature from definition (e.g. a story is written) to its deployment on production. We’ll focus on the current deployment process before the future state, because understanding what’s happening now will surface real blockers and stakeholders faster than an idealized workflow.”

1. On one end of the whiteboard or section of the digital collaboration board, write the first step of your chosen value stream. On the other end, write the last step.
   
   For path-to-production, put “Write Story” as a first step and “Release to Prod” as a last step.
 
   {{< callout >}}
   Tip: If the team having trouble determining the end point, ask a question like "when would we consider the job done for this journey?" 
   {{< /callout >}}

1. Have the group identify the high-level steps that take place from beginning to end in the value stream, being as detailed as possible. Write each step on a sticky note and place it in order on the whiteboard. Iterate as needed.

   {{< callout >}}
   Tip: Ideally you’ll move from start to end but don’t get hung up on the order because you can easily move the sticky notes around. The idea is just to start generating as a team. 
   {{< /callout >}}
   
1. Once the group is satisfied they’ve captured all of the high-level steps in the right order, loop through the flow again. This time, capture the following information about each step on another sticky note or on the whiteboard:
   
   - What happens at this step?
   - Where does it happen?
   - Who is responsible for this step? (e.g. is it automated or manual; when do they need to be involved; are they an employee or third party)
   - When can this step happen? (e.g. what must happen before it can proceed)
   - How long does this step take? (e.g. process time)
   - How much lead time is required?
   - What works well or is painful about this step?
   - How do we know this step is done?
   - How long does the whole value stream take and how does the team feel about it?

   {{< callout >}}
   Tip: These are example questions. Use whatever “lens data” that’s appropriate for your content to shape your picture of the problem. Care about handoffs? Capture them explicitly. Want to visualize system touchpoints? Add in [Service Blueprint](/practices/service-bluepring)-type details. In short, capture what matters.
   {{< /callout >}}

1. Have the team take a step back to review the flow and adjust anything that feels incorrect. When it feels right, capture any next steps and take a picture of the output.

### Success/Expected Outcomes
You know you’re done when you have a visual value stream on the whiteboard and the team feels confident it accurately represents the current process. 

## Facilitator Notes & Tips
Some clients are sensitive to the idea of calling out “waste” in their processes. Another way to frame the purpose of this activity is to call it an opportunity to increase efficiency.

**The Seven Wastes of Product Development**
- Partially done work (because we cannot release it)
- Extra features (because they are unnecessary right now or perhaps always)
- Relearning (because this takes time away from learning new things and releasing working software)
- Hand-offs (because this leads to waiting, and adds communication)
- Delays (because this slows the team down)
- Task switching (because it leads to context switching which reduces our focus and slows us down)
- Defects (because this adds work cycles)

## Related Practices
[Event Storming](/practices/event-storming)

### Variations
None at the moment.

### Preceding
None at the moment
 
### Following
None at the moment

## Real World Examples
Release Process Changes for an example iOS project (do not share with clients)
- **NOTE:** this was a google doc reference. Can we generify this, create a blog post with the content, etc? See the internal practice site for reference.

Deployment Process & Pivotal Tracker States (do not share with clients)
- **NOTE:** this was a google doc reference. Can we generify this, create a blog post with the content, etc? See the internal practice site for reference.

![Value Stream Map image](/images/practices/value-stream-map/value-stream-map-1.jpg)

![Value Stream Map image](/images/practices/value-stream-map/value-stream-map-2.jpg)

## Recommended Reading
[Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation](https://www.oreilly.com/library/view/value-stream-mapping/9780071828918/) by Mike Osterling & Karen Martin

[The Seven Wastes of Software Development](https://codepunk.io/the-seven-wastes-of-software-development/) - Blog post by Michael Szul

[Software Development Waste](https://www.researchgate.net/publication/313360479_Software_Development_Waste) - Conference paper by Todd Sedano

[Lean Software Development: An Agile Toolkit](https://www.amazon.com/Lean-Software-Development-Agile-Toolkit/dp/0321150783) by Mary Poppendieck & Tom Poppendieck

Lean Value Stream Mapping Lunch and Learn by Chicago Pivot Bruce Jacobson
- **NOTE:** this was a google doc reference. Can we generify this, create a blog post with the content, etc? See the internal practice site for reference.
