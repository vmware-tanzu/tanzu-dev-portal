---
title: Is a Design System Right for Your Team?
weight: 30
layout: single
team:
- Carolyn Haines
- Lauren Manuel
---

![People having a meeting in a conference room](https://user-images.githubusercontent.com/105306536/186535367-df91a146-d39a-44b4-af2c-1be25aa18805.jpg)

## Choosing a Design System

At Tanzu Labs, we love Lean and Agile because of the flexibility it affords us to iterate quickly and build valuable products. You know to identify and buy-down risk, understanding where you can afford to make assumptions and where you cannot. Unfortunately, there are risks associated with design systems that far too often go unnoticed or underestimated leading to costly mistakes. Bouncing back from a poorly-made design system choice can feel like you’re trying to stir the cream back out of your coffee. 

There are ways to avoid making bad decisions. If you or your team is in the position to choose***** the design system you use (or whether you use one at all),  there are plenty of things to do to buy down your risk and feel confident in the decisions you’re about to make. Rallying as a balanced team to ask the right questions about yourselves, and your product can make all the difference. 

_*If you’re in a position where these decisions have been made or will be made for you, check out these pointers around Inheriting a Design System in the section later on in this guide_


### Learn About Your Team

Early in your engagement, try to have a session with your team that allows you to gauge your team members’ comfort-level with design systems, without making anyone feel bad. Some goals of a session like this could be:



* **Start building shared ownership** with the understanding that design systems are not a “design thing”—they’re a balanced team thing. 
* Gauge your team members’ experience and familiarity with design systems as a whole.
* Gauge your team members’ experience and familiarity with a _specific _design system that you might be using.
* Discuss potentially confusing terminology in the design system space and start to align on ubiquitous language (if doing so makes sense for your team).
* Set expectations and build relationships that allow lean negotiations to take place around design/features/UI.

The following are suggestions for prompts and questions to help get the conversation started:



* What are the enablement goals for the engagement (specifically, any around front-end or design systems)?
* How front-end-friendly is the group?
* Who’s worked with design systems before? What systems has everyone worked with?
* What do you love/hate about design systems?
* What has your design/dev handoff experience been like in the past?
* What kind of learning and enablement goals (if any) do team members have around design systems?
* What are some team agreements that should be discussed?


### Learn About Your Product Needs

Also early in your engagement, make sure your discovery covers learning about some of the needs of your product and of the ecosystem in which it will live. Having answers to these questions is immensely helpful in weighing your design system options. Some important things to find out:



* Who is the audience for your app?
* What amount of style customization will you need?
* What are the delivery goals for the engagement (i.e. time constraints)?
* Are you subject to any specific technical limitations or constraints? What are they?
* What will the ROI be for using a system?
* How much can you afford to invest (time, resources) in implementing customization?
* What are our goals or requirements in terms of accessibility? 
* What browser/device compatibility do we need to provide?
* Is your product part of a portfolio of apps? Is it planning to be in the future?


### Consider Options and Trade-offs

Once you’ve had discussions within your team and learned as much as you can about the needs for your product, you’ll want to examine your options and make the choice that’s best for your unique situation. Since the decisions around design system approaches can be costly to walk back, it's very helpful to understand the trade-offs before deciding.

#### Adopting a system 

_What we mean_ 

Fully adopting an existing open-source system and staying largely (or entirely) within the lanes it provides. For example: [Google Material](https://material.io/design/introduction), [IBM Carbon](https://www.carbondesignsystem.com/), [VMware Clarity](https://clarity.design/) or [Microsoft Fluent](https://www.microsoft.com/design/fluent/#/).


{{< table "table" >}}
| Pros | Cons |
| ---- | ---- |
| Low cost | Low brand differentiation. | 
| Shortcut to polish/fidelity. | Less customization. |
| Vetted patterns and interactions. | Made for everyone, and for no one. |
| Can make things like responsive behavior more attainable. | Like or fight the template. |
| More likely to find familiarity among designers and developers. | More consumer-leaning patterns. |
| Usually include some ability to customize colors and fonts. | Sheer number of options can create challenges in consistency (especially for portfolios). |
| Good systems have invested in accessibility and browser compatibility, which you will get for free. | Tethered to the maintainers of the system—no input in direction. |
| You get bug fixes and updates for free. | Difficult decision to walk back from. |
 {{< table />}}

#### Adapting a System  

_What we mean_ 

Starting with an open-source system as a foundation, but building custom translation layers for things like themes or domain-specific components. For example: Layering a set of branded themes built on a [Material UI](https://mui.com/') foundation.

{{< table "table" >}}
| Pros | Cons |
| ---- | ---- |
| Provides a <em>little</em> more customization and differentiation than straight adopting. | Higher cost than adopting a system. |
| Lower-cost than a custom system. | Adds a translation layer to build, learn and maintain. |
| | Requires <em>some</em> resources to manage and maintain (maybe not dedicated). |
 {{< table />}}

#### Creating a System  

_What we mean_

Taking the DIY option and creating a custom system entirely from scratch. From color choices to browser compatibility, type scale to responsive grids, design assets, coded components, and contribution and maintenance processes. Everything according to your needs and vision. 

{{< table "table" >}}
| Pros | Cons |
| ---- | ---- |
| Full customization. | Likely requires a dedicated team. |
| High brand differentiation. | Takes time to get going. |
| Long-term gain of replication at scale. | <strong>You don’t get <em>anything</em> for free.</strong> |
| Full control over choices, processes, direction and maintenance. | <strong>High cost (possibly <em>extremely </em>high).</strong> |
| | Requires creation of documentation. and training materials. |
| | Difficult decision to walk back from. |
 {{< table />}}

#### Skipping a system (or growing one slowly)

_What we mean_

Taking the option to skip a design system entirely or to let one evolve from an organic need. Maybe a key stakeholder loves the Craigslist look and you can meet their needs without any fancy UI. More likely than the Craigslist lover, you might have a young portfolio of apps who choose to start with only common styles—as they grow together, they can then identify valuable places for consistency and create a shared library of common components over time, if doing so would provide needed value.

{{< table "table" >}}
| Pros | Cons |
| ---- | ---- |
| Cheaper than starting off with a design system | Scaling is not trivial |
| Creates a unique learning opportunity for practitioners | Limited by the skills of the team |
| Provides a way to test components that might later become a system | Risky (can be short-sighted) |
| Benefit of customization without cost of a dedicated team | Risky (can be short-sighted) |
| Can be speedy | Difficult decision to walk back from |
 {{< table />}}

> This is worth repeating: **not everyone needs a design system**. With their current surging popularity, this can be a difficult idea to sell. If you think a design system might not be the right choice, consider starting with something lightweight like a style guide paired with a basic process for sharing reusable patterns, and then pulling the design system lever when (and if) you’re confident that you’ve hit the value-add tipping point.


![Two designers collaborating on a laptop](https://user-images.githubusercontent.com/105306536/186536874-10aa291e-581a-4bb3-a128-b8893e454730.jpg)

## Inheriting a design system

Oddly enough, the relationship we find ourselves in with design systems can make it feel almost like a family member: we interact with it constantly, we get to know its strengths and quirks, and once it’s there, we’re mostly stuck with it. Occasionally, we do get to choose members of our family like our spouse, but there’s a good bit of family that we don’t get to choose—plenty of us inherit a pile of in-laws upon marriage, and I don’t know about you, but I had very little input into my parents’ decision to have my brother and sister. 

If you are inheriting a design system, either by joining an established team who already has one in place, or by being in a position where the choice is not up to your team, you probably won’t have a lot of control over the system itself. Even if that’s the case, there are still some things that are important to discuss and understand, and it's worth it for your team (not just your designers) to take the time to understand the landscape you’re entering into, so that you can navigate it gracefully and effectively.


### Meet people where they’re at

Always remember to meet people where they’re at. If you encounter an immature or incomplete design system, or an incomplete understanding of the system being adopted, try to help teams and individuals grow their understanding and/or their system by helping identify and address gaps or problem areas. Don’t just complain or tell people they’re doing a lousy job with the system—this helps no one.


### Get familiar with the landscape

Seek to understand as much as you can about the current ecosystem, and keep an eye out for opportunities either to reinforce something that’s being done well, or to identify something that could be done better. We know this is just another bullet list in a not-exactly-short document, but we cannot overemphasize the importance of channeling your inner truffle pig, and sniffing out as many of these things as possible



* What’s the culture like at the organization? 
* How did they arrive at their current system? How long have they been using it? 
    * Is it adopted, adapted, or custom?
* Is the system complete and in maintenance mode?
    * Is there an opportunity to influence upcoming changes or additions?
* Is the system still being built out?
    * If the system is half-baked, are there areas where you could influence?
    * _We have spent serious time here and have some additional thoughts below\*\*_
* Who manages the design system? 
    * Do they have processes in place to handle contributions and feedback? 
    * How are updates and/or breaking changes communicated?
    * Are they in the market for some new friends?
* How many teams use the system, and how do they typically collaborate?
    * Interview existing teams to learn about their experiences
    * Interview existing teams to learn about benefits and limitations of the system
* What training resources exist? (documentation, classes, cross-pairing, etc)
* How “good” are the designer assets (i.e. Figma library)? 
    * If they’re less-than-ideal, could you offer to help improve them?

_\*\*If you find yourself inheriting a half-baked client system, see if there are places you might gently inject yourself and some of your expertise while the bun is still in the oven. In our experience, there are often places where design system teams can benefit from collaboration, guidance, and influence, but these opportunities won’t be gift-wrapped—you will have to seek them out and build relationships in order to have a positive influence._


### Get into the weeds

If products have already been built using the system, get to know them



* Attend design critiques or product demos
* Study how components are used for standard interaction patterns
* Read product training materials if they exist

Circle back to the interviewing of current teams. You’ll probably dig up some good dirt. For example:



* Tips and tricks
* Lessons learned
* Naming conventions across the system, and potential inconsistencies to be aware of
* Non-accessible color combinations to be aware of
* Bugs and/or omissions
* Multiple versions of things
* Contact info for system maintainers (it’s all who you know)
