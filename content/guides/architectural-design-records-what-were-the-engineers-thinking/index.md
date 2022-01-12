---
date: 2021-12-22
description: Architectural Decision Records (ADRs) serve as a snapshot into the developer's past, and grants thoughts and insights about important technical decisions.
title: 'Architectural Decision Records: What were the engineers thinking?'
tags:
- Development
- Documentation
- Architectural Decision Records
team:
- Chad Serrant
level1: Building Modern Applications
level2: Modern Development Practices
---

Rip Van Winkle fell asleep for 20 years and the world moved underneath him. He woke up as a stranger in a familiar land, unable to recall details of the past. I empathize with him. When I wake up Monday morning I often ask, what did I do on Friday? What did I do last month? And why? The details are lost to the sands of time.

This happened to me recently. Six months after I finished working with a client, a new project lead joined. They wanted to know why I decided to fork the codebase, and I did not remember.

Luckily I did something else 6 months ago: I wrote an architectural decision record to explain why the fork was necessary. In addition to my reasoning, it also mentioned alternative approaches and highlighted potential future improvements. The project lead quickly understood the reasoning and moved on to the next concern. The best part? I didn’t have to say a word or explain further; the record was enough.

Architectural decision records (ADRs) document the thought process behind important engineering decisions. Topics can range from choosing an authorization back end to style guides or test refactor strategies. The record can be a single paragraph or multiple pages. The record serves as a snapshot of the past.

## What are the benefits of an ADR?

Like a journal, you get to flip back in time and review your past thoughts. Like a historical lesson, you get to learn from your past mistakes without repeating them. Like a report, it is easy for readers to understand your thoughts without asking you for basic details.

Some scenarios that could benefit from an ADR:
* You have multiple ways to implement a feature. All are costly to revert and it’s not immediately obvious which solution you should follow. An ADR would help compare each approach.
* You expect a future stakeholder will want to understand your rationale for a decision. An ADR will reveal the best decision you could make with the information you knew at the time.
* Halfway through your current implementation, you take a step back and review your approach from a fresh (and maybe naive) perspective. An ADR serves as a time capsule, reminding you how you got here in the first place.
* On Monday morning you forgot what you were doing on Friday. A small ADR can serve as a quick reminder of last week’s goal.

## What should an ADR include?

Storytellers aim to answer three questions:

* So what? (AKA “Why is this decision important?”)
* What is it? (AKA “Describe the decision”)
* Now what? (AKA “What can we do next after implementing this decision?”)

Your ADR is a story about a task, the steps taken, and a happy ending.

When describing the importance of the decision:
* Highlight your pain points. Example: Before forking the codebase, it had multiple projects working off the same repository. This led to situations where one project altered a UI component of another project, causing strange behavior across the other apps.
* Consider framing the issue in terms of development speed. Everyone understands the pain of delayed releases, as that delays customer satisfaction (and customer money). Example: Before we forked the codebase, the strange behaviors required teams to spend time debugging, coordinating, and prioritizing fixes to avoid regressions in the other apps.
* Avoid describing the solution immediately. It’s very easy to cling to the first idea that comes, but it may not be the best one. Give your mind (and the readers) time to think of their own solutions. This part of the ADR should highlight what we knew at the time. In the project I worked on, forking the project was the third of four ideas we considered.

When describing your solution:
* Show alternative solutions, comparing pros and cons of each. Readers will appreciate how you looked for the best solution rather than the first.
* Add enough detail to get the general idea of the decision. An algorithm or technique is enough.
* However, don’t add details that will quickly turn obsolete. You don’t need to name a helper library or application, for example. If you feel you need to, create a notes section and get specific there.

### OK, crystal ball, now what?

The final section of your ADR should describe the anticipated future. What lies in the application’s short- or medium-term future? Here are possible topics you can cover:
* Caveats – The cons of the decision can lead to difficulty for future engineers. Maybe it makes caching difficult, or similar projects will drift in look and feel. Customer needs are always changing, so use this section to give readers a heads-up on what changes will cause this decision to backfire.
* Refactoring – I love deleting code. You can’t cause bugs if there’s no code for the bugs to hide in! Architectural changes can render tricky code blocks obsolete. Look forward to that juicy refactor. It’s quite a morale booster.
* New features – When the code is easy to read, it’s easy to brainstorm new features. This is the fun part of feature creep, writing them down!

## Where should I store architectural decision records?

Put it in the repository. Maybe in a `docs/adr` folder. It’s the only resource your teammates and future engineers are guaranteed to look at. Anywhere else adds another potential blocker.

Raw text is fine for format. But if you want to be a bit more fancy, I suggest [Markdown](https://www.markdownguide.org/). GitHub automatically formats these files so you can read them formatted on the web. Markdown is quite readable as raw text, as well. Avoid formats that require some kind of external software to read it (like Word and PDF). Don’t slow down your eager readers!

Use consistent naming conventions. I name the records by date using a `YYYY-MM-DD` format so they’re ordered historically. For example, `2021-06-20-ForkTheCodebase.md` explains when it was written and the decision considered. You can scroll through the history of decisions without rearranging the sorted order.

## Now go forth and write!

Here’s a sample ADR from one of my personal projects, focusing around setting up inheritance for a class of similar formula objects.

```
## Why

There are many formula objects that are very similar but slightly different.
We have a lot of “if” statements floating around to denote when to use what object.

## What is this

We should instead create one Formula interface, and then subclass it for the different types.

We also need a new formula, Identity, so we can stop checking for nil.

We should create a formula builder that can work off of commands and off of JSON/YAML to make formulas.

* A builder can also serve as a factory, especially when the object we need to make is ambiguous.

## What can we do now?

* Remove objects that were similar but distinct
* Support crossfade functions (it's just a formula inside another formula)
* Consumers have to change their format:

1. Replace `*_formula` key with `formula`
2. Add a `type: X` key where X is the type of formula. For example `type: rosette`.
```

The ADR written to fork the codebase is also short and simple. Both felt intimidating until I tried writing them. Once I organized my thoughts and focused on answering the key questions, the writing was easy.

It’s always fun to jump into the code, but a bit of preparation goes a long way. Take a breather and consider alternatives before diving in deep. An ADR provides an anchor to yesterday so you don’t drift away on whatever madness today brings.

## Further reading

There’s a [GitHub repo](https://adr.github.io/) that goes into lots of detail about ADRs and offers several alternative formats for videos.

A lecture by [Matt Abrahams](https://www.youtube.com/watch?v=Fsr4yrSAIAQ) distills storytelling to its base ingredients. He’s all about “What? So what? Now what?”
