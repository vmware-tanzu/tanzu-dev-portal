---
title: "An Iterative Approach to Reliability"
description: Learn how to embrace reliability on your team, one step at a time.
date: "2022-06-02"
lastmod: "2022-06-02"
level1: Building Modern Applications
level2: Modern Development Practices
tags:
- 
# Author(s)
team:
- Christina Liu
- Brian Watkins
---

## Common Patterns

An application team walks into a project, eager to start building the next awesome thing for their users: the product manager has a vision for something that will grab more market share, the designer is inspired about creating an experience that provides seamless delight, and the developers can’t wait to make that winning product a reality. But before anyone is allowed to even start, a governing authority insists that an exhaustive checklist of the final product’s reliability and quality targets must be researched, agreed upon and approved. This saps the team’s energy and motivation, while eating into the product’s window of opportunity for success.

Or maybe you’ve seen the flip side: the application team is celebrating their successful early alpha or beta launch, proving that they have hit upon a product with a promising combination of business viability, user desirability and technical feasibility. But in their zeal, they keep putting off and shutting the door on the folks tasked with maintaining the application in production, who have been wondering how to keep the new app running, what signs might be early indications of trouble, and when to sound which alarms. This breeds frustration and resentment between teams, while eating into the product’s potential future stability and success.

In both of these cases, software reliability is treated as an afterthought: either something that’s imposed on the product from outside the team or something that’s taken for granted and continually deprioritized in favor of new user-facing capabilities. 

There must be a better way.

We believe that application teams can and should take an approach that embraces reliability from the start, by understanding and acknowledging the effort required to build a product that users will depend upon. We want to build software that’s available when users need it, that will keep their data secure, that won’t fail during important workflows, that will be accessible to all who need it, and so on. To embrace reliability is to prioritize the work required to achieve these outcomes just like any product feature, even if the work to improve reliability may be less immediately apparent to users and stakeholders. In what follows, we’ll propose some ways to approach reliability in an iterative fashion (just like any product outcome) based on data that we observe about the application in production.

#### A Note about Application Teams

Throughout this document, we are assuming an application team that adheres to the philosophy of a [balanced team](https://tanzu.vmware.com/developer/learningpaths/application-development/balanced-teams/). Balanced teams bring people with a variety of skills and perspectives that support each other together to pursue a shared goal. Typically, a balanced team mix for product development is a product manager, product designer, and engineer(s) dedicated to a single product development effort. This is in contrast to another common team structure where some roles, such as product management and design, are shared across many product efforts, or where reliability considerations are ONLY an engineering concern. By addressing software reliability within the construct of a balanced team, we ensure that all these perspectives blend and inform each other so that we build software products that are desirable, usable, feasible, and viable as well as being reliable.

## Getting Started with Reliability Outcomes

Software reliability is a very broad topic; as such, it can be difficult to know where to start. Depending on the application, and the organization developing that application, a team might find itself considering everything from concerns about availability, latency, security, and data durability, to regulatory requirements for auditing system interactions, to accessibility concerns, and more. We should assume that teams want to build software that users can depend on and stakeholders can trust, but as with any other aspect of the product, we think these outcomes are best approached iteratively, based on an understanding of user and business needs that the team continually validates along the way.

In addition, we encourage teams to articulate reliability outcomes in domain-specific terms. While most discussions of reliability tend to frame things in terms of low-level concerns like the latency or error rate of HTTP requests or CPU utilization, a domain-specific approach describes reliability in terms of the expectations that users have when using the software to accomplish important tasks or in terms of what it is that the business hopes to achieve (or avoid). When reliability outcomes are articulated in domain-specific terms, their significance is much easier to grasp and the outcome becomes easier to prioritize against others.

To embrace reliability outcomes in the right way, we propose that teams begin thinking about reliability with an exercise that helps them: (1) articulate reliability outcomes in terms of user expectations and business needs and (2) prioritize outcomes by impact and likelihood so that the team has a good sense for where to start. 

To align team members of various backgrounds on well understood domain-specific reliability outcomes, the starting prompt can ask everyone to consider a future after delivery: the team’s software has been put into production, and yet it is generating negative feedback, not being used, and not trusted. What are the reasons for that? What are everyone’s fears that underlie this? 

This kind of brainstorming session gives everyone a chance to share their concerns in a way that is rooted in the team’s understanding of what users hope to achieve with the software. As people share their concerns, you might find that some people tend to talk in general terms about quality attributes like maintainability, availability, scalability, observability, etc… This type of jargon can be difficult for all members of the team to understand, leading to disengagement. Therefore, it is important for a facilitator to ask questions that help everyone get more specific by employing domain-specific terms. 

For example, is there a fear that the app will be down when users need it? Which part of the app would be “down”? Are there certain workflows that we believe users will find more important than others? Is the fear that the app will be “slow”? What’s motivating this worry? Is it a concern that the number of concurrent users could potentially overload other systems that our software interacts with, causing a larger issue across the business’s software portfolio? Or is it a concern that certain integrations with other systems may put an upper-bound on the responsiveness we can expect from our system? How will users become aware of this slow down? And do we believe that is likely to affect a crucial workflow? By asking these questions you will help the team eliminate confusion and ambiguity, and encourage the team to practice thinking of reliability in terms of our user’s expectations and the needs of the business.

As the fears start to coalesce around certain areas of the application or system, you will start to see patterns emerge, illustrating hot spots where user attention will be most intense. Enumerate these as the domain-specific areas of concern that the team’s efforts should be organized around. Consider: what do users expect to accomplish? That will likely center around a few critical flows or key user journeys that will make or break the users’ trust in your application. Those functional areas of concern, such as transaction reconciliation in a billing system or authentication in a payment system, will help focus your attention when it comes to monitoring and continuous improvement efforts.

After establishing the common themes and listing out the specific fears, sort and rank them in terms of impact (from minimal to catastrophic) and likelihood to occur. For each of the highest impact and most likely fears, enumerate what can be measured as a first step in managing those concerns. Which system behaviors can be observed and serve as an indicator of whether our software is in fact meeting user expectations? This overall activity can be made into a whole workshop in itself soon after kickoff, to help the team collaboratively establish their models for addressing quality concerns.

When a team holds this kind of workshop early on, it serves multiple purposes:
- It sets the tone that reliability is important.
- It helps the team understand reliability in terms that are specific to their particular domain.
- It gives a chance to each participant to share their reliability-related fears, fostering psychological safety and a feeling of belonging.
- It helps the team agree on which aspects of reliability are most important based on our understanding of what our users expect from our software and on what the business hopes to achieve. 

A team then knows where to focus, and can then consider the best way to make progress on specific reliability outcomes: How can we measure this particular outcome? What sorts of objectives should we establish for those metrics? How is our system doing today? If we aren’t currently meeting our objectives, what investments are necessary to do so?

## An Iterative Approach to Implementing Reliability Outcomes

Once a team understands what reliability means for their software product, the next challenge is to find a way to work towards reliability outcomes without stopping all other development of user-facing capabilities. The best way to do this is by taking an iterative approach. That way, we can balance small steps toward reliability outcomes with other development initiatives. We propose a way of thinking about the various iterations a team might move through toward a reliability outcome in terms of ‘maturity levels’.

Organize your backlog by breaking up the work that contributes to reliability outcomes into epics that correspond to increasing maturity levels for each area. With each progression in maturity, the team will steadily improve the confidence in each of these areas in production, and steadily reduce the toil to manage them. The target users for stories in those epics can vary. Ultimately, the application users will benefit from any work we do toward improving the reliability of the app. However, the immediate beneficiaries of these stories will generally be the team itself and any other folks responsible for maintaining the application in production.

### Maturity Level 1 - Basic Observability

We encourage teams to think about work that goes into achieving some reliability outcome as a product feature like anything else. There is a difference, however. Reliability is something users generally take for granted. Only when the application is unreliable do users notice that work needs to be done. This is an important point: reliability is not visible by default. For the product development team that is concerned with reliability, some extra work must be done to make the application *observable* in a production environment. In doing so, we will be able to quantify relevant aspects of its operation, so that we can judge the degree to which our software achieves specific reliability outcomes. 

Teams should invest in observability from the very beginning of development because we know this work will provide an important source of insight and feedback that we can use to make better decisions later. The insights gathered help the entire team. Engineers can use this data to weigh the tradeoffs of various implementation options. Product managers can use this data as another input when deciding what features to prioritize next. Designers can use this data to identify potential user pains that might need to be addressed. Not to mention, once a team can observe its app in a production environment, they will have greater confidence that the software is actually operating consistently well in the areas that matter. 

Maturity Level 1 is about establishing basic observability, by which we mean gathering data by passively monitoring the application as it executes in a production environment. Stories that fall into this epic generally involve instrumenting deployable components so that they record and send telemetry to some application monitoring tool where the data can be analyzed. Most tools will collect a tremendous amount of data automatically; the challenge later will be to focus on the metrics that matter for our application. Upon completion of this epic, monitoring for key Service Level Indicators related to important reliability outcomes should be covered, and, from here, baseline measures can be used to compare all future improvements. 

What counts as a good metric or a good indicator? The four golden signals are a good way to start (latency, errors, saturation, throughput), and these generally come for free with most tools. But, again, we encourage teams to frame reliability in terms of domain-specific service level indicators. These are metrics that let you know that your software is performing consistently well in those areas that matter to users the most. Don’t just observe errors on HTTP requests, translate these into domain-specific failures that would matter to your users. For example: “failures buying insurance” rather than “500 on POST to the /purchase endpoint”.

**You’ll know you’re at Maturity Level 1 when ...**

**Your software ...** is instrumented to capture relevant telemetry and send it to some application monitoring tool. Are you building a distributed system? Start by instrumenting one deployable service, then move to the others when it makes sense.

**Your team ...** has a good idea for what parts of the system need to be observed first and is using that to prioritize the work needed. Furthermore, reliability should become a common talking point on the team. As product managers build out a roadmap for the product, they should lay out which metrics can be observed to show that the product is achieving the expected outcomes. As developers are in the code, making decisions each day, they should be cognizant of the risks and assumptions involved, which affect the quality of the system. These should be articulated for the overall team so that any tradeoffs are understood and prioritized collectively.


### Maturity Level 2 - Invest in Advanced Observability

In order to observe some aspects of reliability, a team may find that it needs to invest in tooling or infrastructure that exercises their application so that relevant data can be gathered. We call this active observability. For example, we might want to ensure that our software allows our users to buy insurance only on particular days of the year. If we take a passive approach, we need to wait until users actually attempt to buy insurance, and then monitor what happens. An active approach, on the other hand, might involve building a small piece of software called a probe that continually buys insurance from our app on behalf of some test user, thus ensuring all the time that the system behaves the way we expect. Other active observability strategies might involve performance or load testing, penetration testing and other dynamic security scans, and so on.

**You’ll know you’re at Maturity Level 2 when ...**

**Your software ...** can take requests from probes to gather domain-specific SLI’s without affecting reliability in production or otherwise disrupting business activities. Automated performance or load testing has been implemented in order to establish baseline metrics during levels of traffic that are similar to what we would expect in production.

**Your team ...** prioritizes engineering work (like building probes or setting up performance tests) required to observe important, domain-specific aspects of the application that would be otherwise difficult to observe with passive monitoring.


### Maturity Level 3 - Establish Service Level Objectives

Once you have a way to observe important service level indicators (SLI’s), then the team should work toward establishing appropriate service level objectives (SLO’s). While an SLI tells us what level of service our application is providing in some area, an SLO tells us whether that level of service is acceptable.

Note that in crafting an SLO, we should embrace some level of risk. As we attempt to approach maximal reliability, we will find that the cost and effort required increase dramatically. At the same time, we will quickly reach a point where users will fail to care about or even notice lapses in reliability. A good service level objective balances these constraints. It allows enough risk for the team to prioritize other things besides reliability, but it doesn’t allow so much risk that would make it likely for users to lose trust in the application. In order to determine the right objective for a given reliability outcome, the whole team should be involved. Engineers need to help the team understand what would be required to achieve a certain level of reliability. Product managers need to understand how much the business is willing to invest in this reliability outcome. And designers need to help the team understand users’ expectations and the degree to which failures might affect their confidence in the product.

In addition to establishing an SLO, the team should consider what consequences follow if the application should fail to meet its objectives. If the app sometimes fails to meet the established SLO's, product managers might decide to prioritize work on reliability over delivery of new user-facing capabilities. If the app fails to meet its SLO's for a sustained amount of time, perhaps a team would decide to halt all development that’s not in the service of restoring reliability. Because decisions that affect the delivery of new user-facing capabilities might have ramifications beyond a particular product team, we encourage teams to include stakeholders in these discussions, and to draft a policy document that describes agreements in detail.

**You’ll know you’re at Maturity Level 3 when ...**

**Your software ...** is observable in such a way that the team can determine at a glance (usually on a dashboard of some sort) the degree to which the application meets its service level of objectives over some time frame. Reports from automated performance and load testing are also displayed and compared with actual production usage.

**Your team ...** is confident that the objectives chosen appropriately balance the need for user satisfaction with the investment required. The team should do research to validate assumptions about service level objectives. How slow is too slow (when will users start to complain)? How do users react when things break? If certain parts of the app fail, what sorts of solutions could we provide to help them continue to accomplish their job or at least feel confident that their workflow has been disrupted in a minimal way? The team should also agree on what to do if the app fails to provide an appropriate level of service on a sustained basis. Should the team stop development of user-facing capabilities in order to focus solely on reliability? How long would a ‘feature freeze’ last? Should someone be alerted when the app fails to meet its service level objectives? Is that a member of the team or some other support team? Stakeholders should participate with the team to craft a policy document that describes SLI’s, SLO’s, and what happens should the software fail to meet its objectives. 


### Maturity Level 4 – Use Data to Make Product Decisions

Now that the team has established service level objectives for some reliability outcome, it’s time to use this data. Engineers should use this data to understand when to make important architectural changes. Are we consistently seeing that some important user workflows are taking a significant amount of time to complete? Consider different approaches that could remediate the problem, and use the data you are collecting to know when you’ve made progress. Product Managers can use data to understand when to prioritize investments in reliability over delivery of new user-facing capabilities. Is the application consistently failing to meet its SLO's? Then maybe the team is moving too fast and needs to focus on paying down tech debt, exploring more reliable architectures, and so on. Designers can use data to identify potential sources of user pain or to craft assumptions about user expectations that can be validated with further research.

**You’ll know you’re at Maturity Level 4 when ...**

**Your software ...** can evolve with reference to service level objectives. When new features are rolled out to production, automatically track the rate of change with respect to relevant service level indicators. Use this to determine whether new features are degrading reliability and take steps to remediate. Treat automated performance testing as a ‘fitness function’ that provides fast feedback on changes in service level before software is released.

**Your team ...** uses information about the degree to which the application meets its service level objectives to inform product decisions around implementation, prioritization, and further research.


### Maturity Level 5 - Spend Error Budget Proactively

Our software will never be 100% reliable. We say that our *error budget* is the difference between 100% reliability and the service level objective. So, for example, if we expect our application to be available to users 99% of the time over a 28 day period, then our error budget is 1% of that period or 6.72 hours. If we find that our app tends to be available more than 99% of the time, then we should consider *spending* some of that error budget. We can intentionally bring down parts of the system in production to understand how our application (and team) will respond to possible outages in the future.

**You’ll know you’re at Maturity Level 5 when ...**

**Your software ...** can be (for example) subjected to chaos testing in a production environment.

**Your team ...** is confident enough to randomly introduce errors into a production environment in order to better understand how the system can respond to degradations in reliability.

### Work Toward Reliability Outcomes One Step at a Time

There are many aspects in which an application can be reliable, and maturity is not a monolithic concept. A team can be more mature with respect to some reliability outcomes and less mature with respect to others. We encourage teams to prioritize their efforts on the outcomes that will do the most to establish trust with users and the business. Reliability is an outcome that teams should approach one step at a time.

