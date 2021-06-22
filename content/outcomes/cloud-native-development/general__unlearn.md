---
title: Things to Unlearn
weight: 1
layout: single
team:
 - VMware Tanzu Labs
---


Every company and team is different, and we’ve all spent a lot of time learning software development practices that can actually be detrimental to developing cloud native distributed systems. This list isn’t exhaustive, but start thinking about this challenges now and you’ll know why we push so hard against them when we’re working together.

## Don’t Don’t Repeat Yourself

We’ve been trained as software developers that duplicate code is a bad thing. This is captured in the DRY (Don’t Repeat Yourself) mantra and we’ve all built shared libraries and common data models to help keep things in a single place. This reliance on shared libraries and common models can actually slow our releases down, as dev teams have to synchronize with all the other teams on which versions of these shared libraries and models should be used. The teams managing those shared libraries often become gatekeepers to new functionality and everyone gets the lowest common denominator that works for all clients (and it’s rare that all clients have the same needs).
During our engagement, we’ll use domain-driven design principles to put a boundary around the services that really should share things and which should have clear external APIs and break away from common models.

## Design at the Last Responsible Moment

Most companies are incredibly risk-averse, and any practice that guarantees that they’ll get it right the first time is worth the cost. The problem is that there isn’t any practice that guarantees such a thing - just the opposite, we can guarantee you’ll learn something you hadn’t considered or planned for before once your app is in production.
That said, no planning guarantees that everything will be a surprise. So instead, we’ll help you work in small iterations on thin slices of your app, getting them in front of users at each slice. This gives us the feedback loops we need to know we’re building the best thing for the company, without months and months of up-front design work. We’ll show you how to balance design and architecture with moving quickly, evolving the architecture as we learn new things.

## No Superheroes

We all want to be indispensable to our teams, able to do everything and solve any problem. The problem is that it’s not healthy for you, it’s not better for your team’s productive, and it’s not smart for your company.
The way we’ll work during an engagement actively encourages us to spread our individual knowledge to upskill our teammates, and we’ll help identify people and processes that are bottlenecks during the engagement so that we can find ways to move fast and get everyone working in a sustainable way. This might take some time to get used to, but everything from our day-to-day pair programming to our short time-boxed engagement structure aim to get your team self-sufficient and let everyone go home at the end of the day and take an occasional vacation.

