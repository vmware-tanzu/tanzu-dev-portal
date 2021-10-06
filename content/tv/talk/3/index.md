---
aliases:
- '0003'
date: '2020-10-01 11:58:36'
description: 'Tanzu Talk: Large scale application modernization with Rohit Kelapure,
  part two'
draft: 'False'
episode: '3'
lastmod: '2020-10-02'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'Tanzu Talk: Large scale application modernization with Rohit Kelapure, part
  two'
type: tv-episode
youtube: JSv7gubN0mc
---

You can't do everything at once, very quickly, large scale application modernizing, part two, with Rohit Kelapure

----

In part one, Rohit Kelapure showed how to analyze and sort an application portfolio to find apps that should be modernized first. In part two, we discuss the process of breaking down a monolith. It starts by making sure that everyone agrees on goals and objects. As Rohit says, you also want to establish what the key results are: this allows you to know when you're done, otherwise you'll just keep working and working.

Next, it's key to understand the domain the application is using. This means, the components, the nouns and things like invoices, mortgage applications, and actions like "approval" and "purchase." These processes are called "thin slices." Rohit explains how using event storming (mapping the business process) is used to do this. Once done, you build up a language that both the business side and the developers understand.

After this, you map out the dependencies between all of this - what services and domain objects rely on others. With this, you can start finding the APIs between the services. With all of these, you've created a target architecture for modernization, mapped to what the software does, the business domain.

With this in hand, you're ready to start using some tactical patterns to modernize your apps. Rohit mentions three, strangler, facade, and anti-corruption layer. I ask him to explain what the anti-corruption layer is in-depth.

Next, you're able to create user stories from all these flows, and then start grouping those stories into MVPs to create a backlog of work. This helps you plan and stage out your modernization program. This also allows management to track and monitor progress.

Then, you do the actual work of migrating code, working through those stories, and so forth. Each cycle - release - generally last 4 to 6 weeks. Rohit explains that he likes 6 weeks and 3.25 people. Six weeks is the right amount of time to get momentum and show value, Rohit says. At the same time, it's small enough that you can change course if you need to change plans.