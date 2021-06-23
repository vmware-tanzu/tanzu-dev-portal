---
title: Things to Unlearn
weight: 1
layout: single
team:
 - VMware Tanzu Labs
---

Every company and team is different, and we have all spent a lot of time learning software development practices that can be detrimental to developing distributed cloud native systems. 

The list is not exhaustive, but starting to reflect on these anti-patterns will help you better understand how we work together.

## Do Not, Not Repeat Yourself

As software engineers, we have been interiorizing that duplicating code is a bad thing. The "[Don't Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)" (DRY) mantra led us to build shared libraries and common data models to help keep things in a single place.  In reality, this reliance on shared libraries and common models can slow our releases down, as development teams have to align with all the other teams on which versions of these shared libraries and models should be used. The teams managing those shared libraries often become gatekeepers to new functionality, and everyone gets the lowest common denominator that works for all clients (and it is rare that all clients have the same needs).
In the course of our engagement, we will use domain-driven design (DDD) principles to put a boundary around the services that should share things and have explicit external APIs and break away from common models.

## Design at the Last Responsible Moment

Most companies are incredibly risk-averse, and any practice that guarantees that they will get it right the first time is worth the cost. The problem is that no practice ensures such a thing. Just on the opposite, we can guarantee you will learn something you had not considered or planned for before once your app is in production.
That said, no planning warrantees that everything will be a surprise. So instead, we will help you work in small iterations on thin slices of your app, getting them in front of users slice by slice. This provides us the feedback loops we need to know we are building the best thing for the company without months of up-front design work. We will show you how to balance design and architecture with moving quickly, evolving the architecture as we learn new things.

## No Superheroes

We all want to be indispensable to our teams, able to do everything and solve any problem. In reality, it is neither healthy for you, nor productive for your team, nor smart for your company.
The way we will work during an engagement actively encourages us to spread our individual knowledge to upskill our teammates. We will help identify people and processes that are bottlenecks during the engagement to find ways to move fast and get everyone working sustainably. This might take some time to get used to, but everything from our day-to-day pair programming to our short-time-boxed engagement structure aims to get your team self-sufficient and let everyone go home at the end of the day and take time off.

