---
title: "Developer Toil: The Hidden Tech Debt"
description: How to use the Developer Toil Audit to speed up software release cycles, make developers more productive, and increase the business value of your apps
duration: 60
experience: Beginner
layout: intro
team:
- Michael Cote
- Susie Forbath
- Tyson McNulty
---

Anything you can do to speed up your software release cycle will improve the quality, resilience, and business value of your software. In this paper, we describe one approach organizations use to speed up this release cycle, the Developer Toil Audit. This is a systematic process for finding, valuing, and prioritizing fixing waste in your software process.

First, the process finds wasted time and process debt in how you build and release software. Second, the process then helps you justify delaying working on features in favor of eliminating and automating your software creation process. The result is speeding up your software release cycle. The more frequently you can change and release software—even with just small changes—the more opportunities you have to learn what works and put those features in front of customers, employees, and other users.

Developer toil is a type of tech debt. [Tech debt is a broader concept](https://tanzu.vmware.com/developer/guides/the-incremental-war-against-technical-debt/?utm_source=cote&utm_medium=whitepaper&utm_content=devtoil&utm_campaign=devrel) that encompasses all of the short-term shortcuts and maintenance compromises made in favor of shipping features now instead of spending time fixing, or "paying down," the debt. For example, instead of updating an API framework you depend on to pull in new data used for insurance adjusting, you spend that time to add multi-file upload to the insurance claims process. Most people focus on this part of tech debt: neglecting your app's code. But [we find that focusing on another type of tech debt—developer toil—has equal benefit](https://tanzu.vmware.com/content/webinars/may-6-tech-debt-audit-how-to-prioritize-and-reduce-the-tech-debt-that-matters-most?utm_source=cote&utm_medium=whitepaper&utm_content=devtoil&utm_campaign=devrel), sometimes more in the early stages of a company's efforts to improve its software process.[^1]

This paper describes the overall Developer Toil Audit with examples and how to get started. First, let's spend a brief time looking at why faster release cycles are one of the best ways to improve how you create your software and, thus, how your organization functions.

We've developed this method and process at VMware Tanzu Labs after helping hundreds of organizations improve their software development and delivery process. We still use it today as part of a broader technical debt assessment methodology. If you're interested in finding out more after reading this overview, don't hesitate to [contact us](https://tanzu.vmware.com/office-hours).

[^1]:
     In the Kubernetes world, [as of the Spring of 2022 at least](https://tanzu.vmware.com/content/blog/state-of-kubernetes-2022?utm_source=cote&utm_medium=whitepaper&utm_content=devtoil&utm_campaign=devrel), the phrase "developer experience" or "DevX" is being used more frequently to describe, well, the day-to-day experience developers have creating their software. Of course, you want that experience to be good, which increases developer productivity and happiness. Addressing developer toil is one the best and easiest ways to improve DevX.