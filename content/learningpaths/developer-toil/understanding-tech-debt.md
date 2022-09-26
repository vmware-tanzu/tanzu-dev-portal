---
title: Understanding Tech Debt and Developer Toil
weight: 40
layout: single
team:
- Michael Coté
- Danielle Burrow
- Susie Forbath
- Tyson McNulty
---

Before you can start fixing your developer toil problem, you have to find it. And to find it, you have to know what you’re looking for. So, let’s first look at a more detailed definition of developer toil and then go over how to find it.


## Identifying tech debt

When it comes to software, the concept of “debt” helps us explain deficiencies in internal quality and the associated impact on the software features, the business outcomes, and the ability to change in the future. For example, using a credit card allows you to buy something now, but includes the possibility of paying more for it later if you don't pay your credit card bill on time. This same pattern applies to thinking about tech debt. 

“Debt” is a great metaphor for software because it describes the impact of short-term gains on long-term quality and optionality. With software, a team can take on tech debt to deliver features with less time and effort now, deferring costs to the future. These "costs" can come in several types. Here are a few examples:



1. **Compromises made in the code to ship faster:** Instead of doing the work to make the code easier to configure and add to in the future, developers can "hard code" parts of configuration making it hard to change the code in the future. Historically, the time it takes many apps to create a mobile version of their web interface, even by simply "reskinning" the UI, exposed compromises in many code bases. The deadliest form of this type of tech debt are compromises made in security. 
2. **Using older, even unsupported versions of third-party and open source software, as well as platforms and systems:** Instead of spending time to update the database, teams may decide to ship features. This type of debt also includes decisions to keep using [older systems like mainframes](https://www.computerweekly.com/feature/Why-post-pandemic-reskilling-must-focus-on-mainframes) instead of doing the work (if appropriate!) to move to new systems.
3. **Developer toil:** Teams can decide to put up with manual processes and other types of "toil," as we define below, in favor of shipping software. For example, complying with architectural review boards may require a developer day's worth of time to fill out a spreadsheet. Instead of spending the four days to automate this process, teams may decide to ship features instead.

This paper focuses on the third type of tech debt described above, developer toil. For discussion and techniques to address other types of tech debt, check systems like [the Swift Method](https://tanzu.vmware.com/developer/practices/swift-method/?utm_source=cote&utm_medium=whitepaper&utm_content=devtoil&utm_campaign=devrel) and our upcoming book, _Escaping the Legacy Trap_.

Although fixing other types of tech debt is critical, we believe that addressing developer toil is one of the most effective ways to increase developer productivity. But, at the same time, it's been one of the most neglected types of tech debt in recent years. So, let's take a look at what exactly developer toil is and then, finally, go over how you can pay down that type of tech debt.


## What is developer toil?

With the phrase "developer toil," we're borrowing the idea of "toil" from a new operations school of thought called Site Reliability Engineering (SRE). Google's original SRE definition is focused on operations staff that build and run the platforms used to run software in production.[^4] We adapt this definition to developers as: 


> Developer toil is the repetitive, predictable, constant stream of tasks that support adding features to software, but don't actually directly decide what those features are or write the code to create them. 

You could fancy this up by saying "any activities that don't directly create business value," but who has the tolerance for that kind of biz jargon anymore?

Let's look at a story of toil to give you an idea of what toil smells like.


## Story time: "It'll just take 15 minutes."

You walk into an app planning meeting, and developers are having a conversation with their product manager on estimates for a new feature. They work at an insurance company, The Mid-Eastern Warm Smiles Insurance Company, "Smiles'' for short. The company is growing by introducing 24-hour insurance products: so if you want to learn how to skateboard today, but you work in the gig economy, you’ll want to buy some insurance immediately in case you break an ankle. 

Things are going well, Wall Street likes Smiles' promise to grow revenues by adding new insurance lines to its 150-year-old business of traditional insurance. Right now, the actuaries need to incorporate a new stream of data into their pricing engine: a good dataset going over skateboard injury rates per demographic and geography. Thankfully, the International Skateboarding and Paddleboarding Society has been cataloging this information since 1956, so there's an API to get this information. Integrating that information into the actuary's app requires some slight data reforming. 

"Adding a field to list that?" a developer says. "No problem, that's, like, 15 minutes of work. An hour at most if I have to refill my coffee while doing it or attend an HR meeting."

And, sure, it may actually be the case that once the developer puts their fingers on the keyboard and starts typing, it only takes an hour. But, someone else chimes in...

"Oh, except we'll need to handle state changes," they say. "Remember when we pulled in data about the sunlight fading effects on paper for the Pokémon card game insurance product? That was supposed to just take 15 minutes, too…but it ended up taking a week."

"And we'll need to migrate the database," someone says from the back of the room. The developers nod in agreement. 

"You're right…two days, then?" says the original developer, "assuming there's no mandatory ergonomics assessment and training I need to take in those two days."

Everyone is about to stand up to go get some coffee, but another person adds, "Oh, and we'll need to get security and compliance to review the changes. I mean, we're integrating in third-party data and attaching to a third-party system." They pause and add, "and we'll probably need to talk with the networking team as well."

"Time to break out the spreadsheets!" they add, getting a laugh from the room.

"Also, we haven't updated our database yet. I don't think version 7.05G has the ability to combine this skateboard dataset with our existing dataset," adds someone else.

"But...it should have just been 15 minutes," the developer says, realizing they'll have to skip a  lunch break and eat a frozen burrito at their desk again. (Not to mention complete that ergonomics training they're three weeks overdue on.)

[^4]:
     Their [original definition of toil](https://sre.google/workbook/eliminating-toil/) is focused on operations staff that support running applications in production, so it's focused on service support: "the repetitive, predictable, constant stream of tasks related to maintaining a service."