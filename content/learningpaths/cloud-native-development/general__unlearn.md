---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Things to Unlearn
weight: 1
oldPath: "/content/outcomes/cloud-native-development/general__unlearn.md"
aliases:
- "/outcomes/cloud-native-development/general__unlearn"
tags: []
---

Every company and team is different, and we have all spent a lot of time learning software development practices that can be detrimental to developing distributed cloud native systems. 

The list is not exhaustive, but starting to reflect on these anti-patterns will help you better understand how we work together.

## Do Not, Not Repeat Yourself

As software engineers, we interiorize that duplicating code is a bad thing. The "[Don't Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)" (DRY) mantra led us to build shared libraries and shared data models to help keep things in a single place. In reality, the reliance on shared libraries and shared models can slow releases down because development teams have to align with all the other teams that also use the shared libraries and models. The teams managing the shared libraries often become gatekeepers to new functionality, resulting in everyone getting the lowest common denominator that works with all consumers. This creates a problem because it is rare that all consumers have the same needs.

In the course of our projects, we use [Domain-Driven Design](https://github.com/ddd-crew/welcome-to-ddd) (DDD) principles to put a boundary around the services that should share things, have explicit external APIs and break away from common shared models.

## Design at the Last Responsible Moment

Some companies are incredibly risk-averse and want everything right the first time. The problem is that no practice can ensure such a thing. Just the opposite. We guarantee that you'll learn something that you have never considered or planned before your app was added to production.

That said, no planning guarantees that will be no surprises. So instead, we work in small iterations on thin slices of your app, getting them in front of users slice by slice. This provides the feedback loops we need to know if we are building the best thing for the company without months of up-front design work. We balance design and architecture by moving quickly, evolving the architecture as we learn new things.

## No Superheroes

We all want to be indispensable to our teams; able to do everything and solve any problem. In reality, it is not healthy for you, productive for your team, or smart for your company.
The way we work during a project actively encourages us to spread our individual knowledge to upskill our teammates. We identify people and processes that are bottlenecks to find ways to move fast and get everyone working sustainably. This might take some getting used to, but everything from our day-to-day pair programming, to our short-time-boxed project structure, aims to get your team self-sufficient and let everyone go home at the end of the day and take time off.