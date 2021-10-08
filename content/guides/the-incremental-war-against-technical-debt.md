---
title:  "The Incremental War Against Technical Debt"
linkTitle: "The Incremental War Against Technical Debt"
description: An analysis of the causes of technical debt, and what we can do about it.
featured: true
tags:
- Technical debt
- Pair programming
- Agile
# Author(s)
team:
- George Dean
date: "2021-09-28"
lastmod: "2021-09-28"
aliases:
- "/guides/agile/the-incremental-war-against-technical-debt"
level1: Agile Transformation and Practices
level2: Agile Development
---

You have had this feeling before.

Two days ago, you left your Sprint planning meeting with clear goals and a lot of confidence. Now, you are navigating a swamp of goo as you try to implement your assigned features. Everything seems to be fighting you. The code that you need to edit is untested. There is a comment at the top of the method saying, "TODO: clean this up." This code path is super important to the business, and you are not sure if you can make changes safely.

You sum up your limited options and decide to add your own chewing gum and duct tape. You touch as little as you can, throw in a few extra null checks, and do your best to escape unscathed before your Sprint finishes. Whew! Then, you start the whole thing over again.

This painful experience is the product of technical debt: repeatedly doing what works now instead of doing the right thing for the long run.

##  What Does Technical Debt Look Like?

Here is what you will find when you read the code:

- The wrong tools are being used for the job. For example, a document store is used where a relational database would be appropriate, or vice versa.
- Servers are deployed using manual, one-off configuration instead of defined in version controlled infrastructure-as-code.
- There is no type safety where a compiled or type-checked language would have been possible.
- Code is untested or its tests are commented out.
- Code is duplicated, poorly factored, unused, or annotated with TODOs.
- The test suite takes too long or has too many external dependencies to run locally before pushing code.
- The code is [accidentally complex](https://en.wikipedia.org/wiki/No_Silver_Bullet) or over-engineered.

## What are the Outcomes?

Here is what you will find when you talk to the team:

- Production incidents are frequent and stressful.
- It is slow for the team to change direction in response to user feedback.
- Developers are duplicating bad patterns, thereby creating more problems for the future.
- Without good abstractions to build on, the team's velocity slows down over time.
- Burnout is high and turnover is common.

##  Why Did this Happen?

The [retrospective prime directive](https://retrospectivewiki.org/index.php?title=The_Prime_Directive) can give us some
instruction here:
> _“we understand and truly believe that everyone did the best job they could, given what they knew at the time,
> their skills and abilities, the resources available, and the situation at hand.”_

People are doing their best in the presence of constraints. These are the usual constraints:
- Developers are working alone, trying their best to navigate the 10 - 30 technologies used across their stack.
- Teams are operating in two week sprints, committing to achieve a certain set of features by the end of the two weeks.
- The definition of "done" for a story is limited to user-visible behavior; the effect on the codebase is an externality.

Despite their ubiquity, these constraints are a recipe for growing technical debt.

## What Can We Do?

The path forward from here is not to devote a week/month/quarter to "fixing all the things," but instead to change the way that day-to-day development happens. Here is how:

- Pair on it.
- Stop committing to time and scope.
- Systematically feel and address pain.

## Pair On It

Pair programming with daily pair rotation, ideally combined with trunk-based development, creates a fundamentally different set of constraints for your development team. Pair programming is a key asset in the war against technical debt.

### Teams that Solo

On teams of solo engineers, I have found that:

- Team members specialize in certain areas since collective code ownership is impossible without knowledge sharing. Permanent silos are created that grow deeper over time. Specialization makes it very difficult to complete full-stack stories.
- Teammates often end up having an unhealthy relationship with each other's work. They may not fully understand it, may not agree with the decisions that were made (or the idea of doing the work at all), and may get blocked by problems they encounter with unfamiliar code.
- There is often fuzziness around team definition. This includes oversized teams of 20+ developers, or individual developers contributing to many teams’ codebases.
- Standups end up being a hard place for product managers and designers. Developers who have not had an opportunity to share technical ideas throughout the day tend to  dominate the conversation. There is not a lot of room for product managers and designers to participate.
- Code quality remains heterogeneous across the codebase. The level of simplicity, factoring and testing of the code is proportional to the level of the experience of the author, with no real ability to make an impact across silos.
- Pain accumulates and becomes a long-term part of the development experience. The belief is that if you are feeling pain, it is probably your own fault and you should upskill to become a better developer. You are incentivized not to speak up, but instead to suffer through.
- There is divergence of thought between teammates at every level, from file naming conventions to beliefs about automated testing.

### Teams that Pair Program

On teams that pair, with rotation among pairs, I have found that:

- Bad ideas are effortlessly discarded instead of getting permanently baked into the codebase.
- The team builds a shared understanding of the problems that need to be addressed and how to invest their time.
- There is internal pressure to do the right thing within the team. Pairs have the knowledge, power, and self-accountability to write tests, refactor, and address problems.
- Developers get feedback on their ideas before the work is done, not afterwards, when it is usually too late to make substantive changes.
- The level of waste is reduced, with no context switching to review pull requests, address comments, rebase, or resolve conflicts.
- Code quality across the codebase converges to the highest standard as people learn from one another.
- There are fewer, more productive streams of work, compared to more less-productive streams on teams that solo. Pairing means that teams limit work in progress, deliver production-deployable work faster, and reduce merge conflicts.
- A higher level of thought about the development process emerges. For example, "Could we avoid large batch, late-stage security reviews by using automation to turn compliance into a continuous process?"

Everything is better when we work together.

## Stop Committing to Time and Scope

We only get to choose two: time, scope, or quality. Once two have been fixed, the other will vary. Most industry teams operate in two week sprints, committing to achieve a certain set of features by the end of the two weeks. These two week sprints are often rolled up to quarter-level commitments, sometimes called increments. If you choose to fix time and scope, quality will vary accordingly.

The cycle often begins with an overcommitment. Software engineers are optimistic by nature! After working nights and weekends to deliver the requested features in the specified timeline, the team feels exhausted. The codebase is a mess. Partially complete branches were merged at the last second. Nuanced bugs are littered throughout. No one feels proud of the work they have done, and the debt they have created will hold them back from here on out. During the next Sprint (or increment) planning meeting, everyone will sandbag their estimates and the team's efficiency will diminish.

To make the switch from debt creation to debt resolution, choose to fix time and quality. Select a fixed iteration length, and commit to high quality with variable scope. High quality pays dividends over the long run, but also over the short run. The thirty minutes spent on refactoring and automated testing that were completed this morning make this afternoon's feature straightforward to implement with confidence.

By assigning points to stories during the iteration planning meeting, teams can measure velocity. Velocity is the sum of the story points completed per iteration, usually calculated as a moving average over the last three iterations. Since velocity is determined on the basis of actual team performance, not optimistic or sandbagged time-based estimates, it gives you a much more accurate way to make predictions (not commitments) about future delivery.

## Systematically Feel and Address Pain

You (hopefully together with your pair) click start on a story. Sometime in the future you will click finish. What you do in the middle determines the level of technical debt your team will carry on from here.

Here is what your development process might look like today:

1. Click Start.
2. Write automated tests, get them passing, and refactor.
3. Click Finish.

There is a missing step in this workflow. As you write the tests and the implementation, you will feel pain. Take note of the pains by writing future commit messages to resolve them. Be incremental in your approach; none of the commits should take you more than half an hour. Write them into a text file (perhaps called plan.txt), or add them as tasks on a story. Then, before you click finish, prioritize and resolve at least some percentage of the pain. You will feel more pain than you can reasonably resolve, but if you are always prioritizing the most impactful problems, you will chip away at them slowly, but surely.

Suppose you are working on a story to prevent cross-site request forgery and JSON hijacking. Your plan.txt might look like this:

#### Prefactoring
```
Backfill test for api.ts
```
#### Functionality
```
If an X-XSRF-TOKEN cookie is present, send it as a header with all post requests
from the frontend

Configure Spring Security to produce a unique token on login, store it in an
XSRF-TOKEN cookie, and require it in an X-XSRF-TOKEN header
```

#### Cleanup
```
Run tslint with every ship

Change log level to WARN

Nest @Configuration classes in a configuration package

Add JSCookie to simplify cookie handling

Rename api to HttpClient

Convert HttpClient to a class with static methods

Convert HttpClient methods to be instance methods instead of static methods

Inject window.fetch as a dependency into HttpClient

Inject CookieRepository as a dependency into HttpClient
```

#### Not done
```
Fix error on server start: java.io.IOException: Connection closed prematurely

Disallow implicit any type in TypeScript

Delete cross-fetch from package.json if it is not needed

Change TypeScript settings to force us to specify the return type of functions
```

## Cooperation and Collaboration

Technical debt is a reality faced by almost all software engineering teams. Its effects are wide-ranging, spanning product quality, release timelines, team cohesion, employee retention, and personal happiness.

Software engineering is a game of cooperation and collaboration. Let's win this game together by pairing on it, stopping the commitment to time and scope, and systematically feeling and addressing pain.
