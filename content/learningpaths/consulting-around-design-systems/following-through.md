---
title: Following Through
weight: 40
layout: single
team:
- Carolyn Haines
- Lauren Manuel
---

## Norming and endurance

Like any healthy relationship, your working relationship with your design system needs commitment, attention, and maintenance to ensure it stays strong. Whether you’ve chosen your own design system or it was chosen for you, working with design systems in the long-term requires ongoing discipline and endurance to be continuously successful. It’s not a sprint, it’s a marathon. To help set yourself and your team up for long-term success, we recommend doing some team norming around your UI design / design system processes and practices, and knowing what kinds of things to keep an eye on over time. 


## Good, gritty norming

While some [team norms](https://tanzu.vmware.com/developer/practices/team-working-agreements/) can be defined as early as week one of an engagement (e.g. what are our rituals and when do they happen) the kind of gritty, granular norms we’re about to propose are usually best to discuss once your team has had a chance to get their legs under them a bit—it’s not always helpful to norm around story structure before you have a backlog. That being said, every team is different, and you will need to read your own tea leaves in order to know exactly what to norm around, and when the right time is to define, revisit, or refresh your norms. 

Here are some things related to design systems that we’ve commonly found valuable to norm around:

**Roles and advocacy**

To hit on this one last time, design systems are not just a designer thing—you need commitment and shared ownership by the whole team to ensure you work effectively. When you do team norming, consider discussing and agreeing on things each role/team member can do. Some examples could be:



* **Product Manager** is accountable for making sure any stories with a UI element adhere to an agreed-upon structure, and contain all relevant design system information
* **Designers** are responsible for consulting the design system documentation to validate  that their designs are feasible and require minimal customization
    * If a custom component is needed, designers will talk with developers to discuss the need and find the best path forward
* **Developers** are responsible for being fluent in the capabilities of the design system, and for rotating through dev/design pairing sessions so that everyone is invested in a polished UI and a firm grasp of the system
* All team members are **advocates** for a polished, well-built UI, making effective use of the design system as a primary tool for building their app interface

**No-Such-Thing-as-Stupid Questions Policy**

Design systems are complex, ever-changing things. Even if you’re not using a system, there is still plenty of complexity to keep track of, and we’re all in different places with our understanding. We highly recommend that a “_No-Such-Thing-as-Stupid Questions_” policy be the norm for any team. You never know when you’ll be the one wondering what that acronym means, and being able to ask comfortably in the moment is way better than nervously googling on your phone in the bathroom stall. Gross. 

 \
As an offering of vulnerability, here are questions we’ve asked our teammates in the past:


> Q: **What are design tokens?**  
> A: _A clever method of capturing everything from color values to border radii as variables that can be quickly updated, translated, and propagated across platforms._
>
> Q: **What does it mean to “pass a prop” into a component?**  
> A: _Many components can accept different types of data, or properties (“props”), and adapt their display or behavior dynamically based on these properties we pass into them._
>
> Q: **What’s a variant?**  
> A: _A variation of a component, with a consistent purpose but slightly different look or behavior (e.g. determinate vs indeterminate progress indicators)._

**Story structure**

Implementing a polished UI means being detail-oriented, whether you’re using a design system or not. The best way we’ve found to minimize the amount of back and forth between design and dev is to norm around what kind of UI details should be included in the Acceptance Criteria of your stories, and how that information is to be used. For example:



* Links to specific frames in design files (Figma, Sketch, etc)
* Links to specific design system components
* Descriptions of specific component variants being used
* Descriptions of props being passed into components
* Appropriate names for system colors, type styles, icons, etc

**Design files**

Discuss with your team how the design file is structured, where to find important information, and what to do with the information they find.



* Where to find the latest backlog-ready files
* How precise is the UI design in Figma/Sketch/etc? 
    * Is it pixel-perfect? Is it "close enough"?
* Review Dev handoff features (i.e. the ‘code’ panel in Figma)
    * Is there CSS that should be routinely ignored?
    * Are component names visible?
    * How should we interpret spacing values?

**Styling terminology**

As we harped on for an entire section earlier, conflating terminology can lead to lots of communication problems—and even the most senior among us will occasionally say “padding” when we really mean “margin”. It’s not a bad idea to do a quick refresher of common styling terms so that you all have a better chance of understanding each other and helping clarify when things may be misstated.



* Typography terms like line-height, font-weight, letter-spacing, etc.
* Margin and padding_ (hello, box model)_
* Align and justify _(i see you, Flexbox)_
* Rows, columns and grid area _(oh hey, CSS grid)_

**UI details**

Regardless of which system you use, or whether you use one at all, there are plenty of granular UI decisions that the system will make for you, and some you will need to make for yourselves. It’s extremely helpful if developers and designers norm around these details, and how to interpret certain things that will commonly appear in design files:



* **Rems vs Pixels** 
_Are we using Rems for sizing? What’s our Rem value?_
* **Pixel grid** 
_If we’re using an 8px grid, is a 7px measurement in Figma just a small mistake?_
* **Responsive column grid layouts ** 
_If we have a 12 column grid, what does it mean when something spans 6 columns on a XL screen and 12 on a small screen?_
* **Alignment and positioning**  
_Am I saying this is 748 px from the top of the page, or am I saying this is bottom-aligned to a content element that has 16px padding?_**
* **Font classification and type scale** 
_Is this a 28px medium weight font used everywhere or, is this an H4?_


## The LEGO trap

One of the long-term risks that comes with using design systems is falling into what we affectionately call the LEGO trap. In a nutshell, the idea is that by giving practitioners a predefined set of solutions via a design system (the LEGO set), they are no longer encouraged to develop creative solutions to problems, but rather, to follow directions. This can be an easy trap to fall into, especially when using the existing patterns from a design system is rewarded with fast delivery and a polished UI. 

> When we’ve fallen into the LEGO trap, we find ourselves asking, _“What patterns exist in the system to solve this problem?”_ instead of asking, _“What patterns would offer the best solution to this problem?”_
>
> Problems get jammed into existing solutions, rather than solutions being crafted to solve problems—this is not where we want to be. 

As usual, there’s a fine line to walk here. Although we don’t want the existing design system to impede our crafting of the right experience for users, we also can’t go all "pimp my ride" with customizations either. In reality, these kinds of decisions should probably be… a balanced team approach (surprise!). Decide what your users need, talk as a team about the tradeoffs, and have a conversation. Maybe you use an out-of-the-box component that _mostly_ works for v1, or maybe you have enough evidence that the juice is worth the custom squeeze. And if it really is the latter, bring your juice to the design system team—it might be sweet enough to add to the system. 


## Endurance

Working with, in, and around design systems is rarely a short-term thing. More often it’s a long-term commitment organizations are making. No matter how long or at which stage of the design system lifecycle we are at, it’s important to stay vigilant and true to our processes; to ask the right questions; to accurately assess risk and effort; to check-in with each other when using loaded terminology; to constantly toe the line between out-of-the-box and custom solutions; and to be open with each other as we’re doing it. 

If we don’t take the time to cover these bases, we run the risk of overlooking mountains of nuance, and learning only how to wield the system. What is much, much more important is the ability to wield an effective process for solving tough problems—and to know what to do when the right solution isn’t part of the LEGO set.


## Thank You!

We love you all! Goodnight!

Well, we love saying thanks and hate saying goodbye, so **thank you**, for completing this learning path. We hope that sharing our perspectives and experience will help you in your professional journey.

If you have thoughts or feedback, don’t be shy: 


**Carolyn Haines** | chaines@vmware.com  
**Lauren Manuel** | lmanuel@vmware.com
