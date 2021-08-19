---
date: '2020-05-05'
lastmod: '2021-01-29'
patterns:
- Deployment
tags:
- CI-CD
team:
- Nate Schutta
title: What is CI/CD?
topics:
- CI-CD
weight: -1
oldPath: "/content/guides/ci-cd/ci-cd-what-is.md"
aliases:
- "/guides/ci-cd/ci-cd-what-is"
level1: Modern App Basics
level2: DevOps Practices
---

Modern distributed architectures together with cloud environments offer a powerful toolkit for delivering applications that quickly deliver business value. No industry is immune to disruption, however, and you can no longer afford a plodding release cycle with nebulous review boards and heavyweight gates that slow development to a crawl. You need to move fast but you cannot afford to break things. You need deployment pipelines.

So, how can you ensure releases don’t bring down production? By leveraging continuous integration (CI) and continuous delivery (CD), you can rapidly deliver features and functionality while still getting a good night’s sleep!
## How did we get here?
In the early days of web development, servers were handcrafted and builds were bespoke. Deployment “scripts” were often littered with manual steps and, unsurprisingly, mistakes were common. Such an approach worked, for some definition of worked, at least when software development was measured in quarterly releases. But you don’t live in that time in human history. Today, many companies release new versions of their software products continuously, sometimes multiple times a day.

To support these more dynamic environments, companies are increasingly turning to automation to ensure a consistent, repeatable delivery process. While artisanal coffee may make your morning better, a build process that cannot be replicated isn’t anyone's definition of a good way to start your day. You need a reliable process. You need a deployment pipeline.

CI/CD puts you and your customers in the driver's seat by allowing you to deploy features and functionality on your schedule. A deployment pipeline does **not** require code to go from commit to production in minutes, though robust pipelines can *enable* that timeline and companies with years of experience may choose to release quickly, at least with low-risk changes. But if you’re releasing code early and often, how do you avoid the pain of broken software and late nights in a windowless conference room?

Automation to the rescue! Instead of thoughts and prayers every time you deploy software, pipelines ensure code that gets to production has endured a gauntlet. Code must survive a set of automated tests, code quality scans, performance tests, chaos engineering, and whatever other gates you need to give you confidence.

## What is CI?
Continuous Integration (CI) has been around for many years; it was originally defined as one of Kent Beck’s core practices of [Extreme Programming](https://www.amazon.com/Extreme-Programming-Explained-Embrace-Change-ebook/dp/B00N1ZN6C0/). CI solves the age-old problem of merge hell, when two (or more!) developers are working in similar parts of the codebase at the same time. While source code management tools could sometimes automatically merge code, developers often spent a significant amount of time staring at diffs trying to amalgamate conflicting changes. Problems were compounded if developers spent days—or worse, weeks—working before merging their code.

CI could be summarized as merge early, merge often. But it is [more than that](https://martinfowler.com/articles/continuousIntegration.html). It starts with an automated build separate from the IDE. Code isn’t just built, though; it is also subject to a barrage of automated tests. From traditional unit tests all the way through to various integration or end-to-end tests, automated testing provides a safety net for developers. A robust test suite allows developers to change code at will because they know that a broken test will alert them to any issues their changes may have caused. And code quality scans can be employed to catch common mistakes and antipatterns, which helps to ensure adherence to agreed-upon standards. Again, deviation is detected and fixed early.

CI is also a cultural shift. Developers commit early and commit often to main. A CI server like [Jenkins](https://jenkins.io) or [Concourse](https://concourse-ci.org) monitors the code repository, kicking off the build process on every commit. These builds must be fast (seconds or minutes); if a test or quality scan fails, developers are notified and the problem is handled quickly or the change is rolled back. The goal is to maintain a stable base so that you can be responsive to the challenging environments that companies exist in today.

Ultimately, CI reduces risk. Developers work in small batches. Bugs are found and fixed quickly. Instead of a frustrating game of whack-a-mole, unintended side effects are manifested early and can be remediated before they grow into unwieldy monsters. With your code in a releasable state (most of the time) you are empowered to deliver functionality on your schedule.

## What is CD?
Continuous Delivery (CD) builds upon the foundations of CI and takes it to the next step, where code is released. By adding automation to the release process, it allows you to decide which cadence is most appropriate. The goal is to find issues before your code hits production servers. [CD](https://martinfowler.com/bliki/ContinuousDelivery.html) takes the deployable unit coming out of your CI process and moves it from a development region all the way through to production. This process typically involves a pass through QA and a customer acceptance gate, both of which may involve a manual sign off.

> ### Delivery vs. Deployment
> There is some ambiguity about the definition of the D in CD. Arguably the most common understanding is that continuous *deployment* is one step beyond continuous *delivery* where changes that successfully pass through all the deployment pipeline gates are **automatically** moved to production. In other words, changes are serving live customer traffic within minutes of a commit. Continuous Deployment requires a significant investment in testing to ensure changes do not cause havoc in production. It also typically involves feature flags and other advanced techniques.


From there, releases move into a staging environment. There should be relatively few issues in staging; they should have been discovered earlier in the process. Staging allows you to throw real-world traffic at your code without actually exposing it to customers validating monitoring, performance, user experience, and whatever other factors matter for your application. If it all checks out in staging, it’s time to move to a canary release.

A canary release is literally the canary in the coal mine; you expose a percentage of your production workload to the new version of your code. Canaries serve real-world traffic; if you find errors, you roll back to the previous version. With a robust deployment pipeline, you should have very few issues in production as they should have surfaced earlier in the process. Not only does this allow you to deliver business value on a regular basis, it builds credibility with your customers while significantly reducing your stress level. It is a win-win!

## How do you move forward?
It can be daunting to create a build pipeline from scratch. While your organization probably already has CI tooling in place, there may be little guidance provided for how to start. A blank editor is terrifying. Don’t start at zero, use [Cloud Pipelines](https://spring.io/blog/2018/11/13/spring-cloud-pipelines-to-cloud-pipelines-migration) as a base. Whether you use it for inspiration or as a set of starter scripts that you customize, Cloud Pipelines is worth some of your time.

If you are new to the CI/CD journey, don’t neglect the cultural shift inherent in any technical change. Some developers reject the build break notifications, some going so far as removing themselves from the email list. Be sure everyone understands the benefits of CI/CD, including increased speed-to-market, stable builds, and reduced drama around releases. Software development has changed dramatically in recent years; no longer can you afford to say “That’s how we’ve always done it.” Applications are evolving rapidly, which requires you to [Move Fast and Fix Things](https://github.blog/2015-12-15-move-fast/). CI/CD will not just help you deliver for your customers; it will help you sleep better at night.