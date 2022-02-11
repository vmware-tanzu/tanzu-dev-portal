---
title: "FAQ: Tanzu Labs Engineering"
description: 
date: "2022-01-14"
lastmod: "2022-01-14"
level1: Agile Transformation and Practices
level2: Agile Development
tags:
- 
# Author(s)
team: 
- Joe Moore
- Matt Parker
- VMware Tanzu Labs
---
VMware Tanzu Labs teaches clients, partners, and peers [XP](https://en.wikipedia.org/wiki/Extreme_programming), [Lean](https://www.amazon.com/Lean-Startup-Eric-Ries/dp/B007YXSYTK), and [User Centered Design](https://tanzu.vmware.com/campaigns/design) (UCD) principles and practices for product and application development. We are constantly asked about our practices. 

This FAQ explains the "why's" behind many of Tanzu Labs engineering practices, and includes examples of the real problem the team is attempting to solve. It also provides guidelines on how to answer questions from enterprises about ways to scale these practices within their organization.

## Q: Why Pair Programming?

{{% callout %}}
There is an overview of Pair Programming in [**Fundamentals of Modern Application Development learning path**](/learningpaths/application-development/pair-programming/). The following is a deeper dive into the topic.
{{% /callout %}}

How many people from your team have to [get hit by a bus (or win the lottery and retire)](https://en.wikipedia.org/wiki/Bus_factor) before your team is unable to function? Most companies that come to Tanzuy Labs have teams with a "bus count" or "lottery count" of 1.

![The Bus Count](images/image9.jpg)

When you have solo engineers, you end up with knowledge silos. For example, suppose there is an engineer in your organization that owns a particular part of the system. Because no one else knows how the code works most engineers are afraid to touch it. The engineer who created and maintains the system is the only one who understands how the system works. If a decision is made to prioritize features in the part of the codebase that only one engineer knows, the rest of the team is left twiddling their thumbs. If the same engineer becomes unavailable, the team cannot function anymore. The longer this situation continues, the worse it gets.

Knowledge silos may create job security for engineers, but they also create risk for companies. XP practitioners break down knowledge silos. Instead of making themselves "indispensable" by not sharing what they know, they share knowledge through pair programming. XP practitioners maintain collective ownership of the code so that every engineer on the team can work on any part of the codebase. No one gets to specialize, own one area, or hold the team hostage with their singular expertise. Everyone agrees to work on the **most important thing**. That means each pair pulls from the top of the backlog. No one owns a particular module, and it's everyone's job to keep the code clean. They never end up with code that only makes sense to one engineer, because they get instantaneous feedback on the readability of the code through pairing.

What about productivity? It leaves people to wonder "Should I hire twice as many engineers to get the same amount of work done?" For example, imagine a team of four engineers. When those engineers solo, there's four independent work streams happening in parallel. When they pair, there's only two independent workstreams happening in parallel.

The answer to the question is you won't have to hire more engineers. In an ideal scenario, the four engineers are going to [be more productive](https://www.theregister.com/2016/10/18/pairing_programming_youll_never_guess_what_happens_next/) when working paired than when working solo. However, reality isn't ideal. Many companies may still need to hire more engineers if they have a traditional IT culture. This is because it is also likely that they have a fair number of engineers in their current workforce who prefer not to pair. 

![Solo vs. Pair Programming](images/image8.jpg)

On the surface, it appears that the volume of work is cut in half. Yet, underlying the question is an assumption that there's no difference in productivity between solo engineers and paired engineers. The assumption is demonstrably false. Solo engineers spend less time focused on a task than paired engineers. It's also easy to get distracted while soloing with apps such as Twitter, TikTok, Hacker News, email, Reddit, Slack, YouTube, texts. They are much harder to check out while pairing. Your pair doesn't want to read your email, or answer your texts, or post a hilarious TikTok dance. And, you probably wouldn't want them to anyways. Pairing is a state of hyper-productivity. 

Hyper-productivity caused by pairing is exhausting. If you stay exhausted too long, you'll start to make bad decisions. [Science indicates](https://hbr.org/2017/05/your-brain-can-only-take-so-much-focus) that the human brain works best when it gets to alternate between states of focus and distraction. That's why there is a culture of taking breaks in pair programming. Every hour or so, the pair needs to stand up and do something completely different and it doesn't have to be work-related. You can relax, listen to music, read emails, or play a game.

Pairing also reduces the amount of time that you spend on asynchronous code reviews. A developer who doesn't pair is likely to spend a good portion of each day reading pull-requested code and writing comments. The extra overhead of code review and code revision can easily take up ~50% of a team's working hours, so there is nothing to lose by substituting pairing for code review. Instead, the developer saves time because of the real-time code review provided by pairing is more efficient than going back and forth typing and submitting comments on Github.

To achieve the level of effectiveness from pairing, everyone needs to value each other's perspectives, be willing to be vulnerable, and express what they do not know. Pairing can reveal intellectual insecurities in people. Not everyone is going to develop the empathy and relationship skills required to collaborate at this level. To be successful at pairing, let go of any ego, and understand that it's OK to make mistakes in front of your pair. Some engineers are terrified of this prospect, and would prefer to leave the company than overcome their fears.

## Q: Why Do Some Teams Struggle with Switching from Individual Code Ownership to Team Code Ownership?

Some developers effortlessly make the transition to team code ownership. They immediately see the benefits of being able to modify any part of the code base and quickly shift from personal ownership (i.e., "I made this.") to collective ownership (i.e., "The team made this.").

Yet, others struggle with team code ownership for several reasons:

* Shifting psychological ownership may require a corresponding shift in your identity. Psychological ownership refers to "the feeling of possessiveness and of being psychologically tied to an object". Psychological ownership occurs when the object becomes part of the psychological owner's identity. Psychological ownership answers the question, "What do I feel is mine?".
* Developers may struggle to transition to a caretaker mindset. For example, an engineer may struggle to describe the developer's relationship with the code on a very challenging project and settle on the caretaker metaphor, "Sometimes I feel like a caretaker to [the code base].". A caretaker cleans up messes and makes things better.
* A developer may be distraught at seeing their work slowly removed from the app.
* A developer may feel belittled when seeing their work changed or fixed without them.
* Developers can no longer take pride in functionality that they exclusively develop.
* Existing knowledge silos may be slow to break down. This can hinder team code ownership, 

New hires who are also struggling with the transition eventually realize that someone else is going to take over. They know that it's OK to move on to something else. They recognize the lack of long-term individual authorship, learn to expect their code is transitory, develop trust in their team mates, and loosely hold personal contributions. They understand that even if the code that is written today is in the code base for a little while, it is going to evolve into something better. Eventually, new hires experience the benefits of a collaborative environment. People are more flexible with changing things, accepting feedback, or collaborating. A collaborative environment is a place where the team can say "Hey, this is **_our_** code!"

Shifting from individual ownership to team code ownership may require multiple, complementary practices to actively remove knowledge silos. In this case, daily pair rotation helped combat knowledge silos. Moreover, for developers with strong individual ownership tendencies, sharing ownership first with a small group where trust and communication build quickly may help.

See: [**Practice and Perception of Team Code Ownership**](https://www.researchgate.net/publication/301612260_Practice_and_Perception_of_Team_Code_Ownership)

## Q: Why Test Driven Development? {id="tdd"}

Test Driven Development (TDD) is a crucial engineering practice. Review the article, [**Test Driven Development**](/learningpaths/application-development/test-driven-development/) as part of our Fundamentals of Modern Application Development learning path.

## Q: Why Refactor? {id="tdd"}

**Why TDD?**](https://tanzu.vmware.com/content/blog/why-tdd) Matthew Parker elaborates on the benefits of practicing test-driven development, and why you shouldn’t be afraid of refactoring.

## Q: What is a User Story?{id=stories}

A *user story*, or *story*, is the primary unit of currency in an Agile backlog. It is a narrative description of a single task or activity being performed by a user of a system. A user story represents the smallest piece of incremental value that you can deliver into the hands of a user. 

Stories focus all software implementation work on delivering real value to real people as early and often as possible. This leads to a lot of questions, beginning with "How big should a story be?". To know the answer, shorten the story. Does the shortened story still provide real value to the user? If you can make the story smaller and still deliver real value to the customer, then your story is too big.

Conversely, "Is it possible for a story to be too small?". To answer the question, ask yourself: "If I complete this story, will it provide real value to our users?" If the answer is no, then your story is too small.

For example, suppose your story is about authentication. At first, the story includes all the functionality, including the ability to sign in, sign out, recover your password, change your password, and recover your username.

Your team collaborates, "How do we make this story smaller and still deliver value to the user?". Together, everyone decides to make smaller stories about authentication. So, now instead of having one large story, you have several smaller ones, including a "Sign In" story, a "Sign Out" story, a "Recover Password" story, a "Change Password" story and a "Recover Your Username" story. 

However, the team goes too far in making smaller stories out of bigger ones. They come up with a story called "Sign In Form", and another story called "Sign In Form Signsin". The first story, "Sign In Form" is for a sign in form that includes a username field and a password field. Creating the two field form is the story. There is nothing in the story that reads that the form has to work. It only has to look like what is described in the first story. In the second story, "Sign In Form Signsin" your team has to make the sign in form work. 

Your team collaborates, "If we complete the first story, "Sign In Form", is it going to provide real value to our users?" The answer is no. Delivering a sign in form to production that doesn't work does is not going to help your users. If anything, it's more likely to frustrate them, or put the product into an unreleasable state. Individually, the two stories are too small. Your team can fix this by combining the "Sign In Form" story and the "Sign In Form SignIn" story into one.

## Q: Which Story Comes First?

At the beginning of a project, you may have a vision for a [minimum viable product (MVP)](https://en.wikipedia.org/wiki/Minimum_viable_product#:~:text=%22The%20minimum%20viable%20product%20is,means%20it%20is%20not%20formulaic), and several stories. 

For example, imagine you're building an e-commerce shopping site for a boutique clothing store. Your vision of the MVP includes the ability for people to shop the store's entire catalog online, add multiple items to a shopping cart, pay with credit card or another online payment app, view past transactions, save credit cards, and apply discount codes.

That's a lot of software! 

Where do you start? How do you pick which story should be first?

The answer to both questions is up to you. When you start and how you pick  than another but there's a few incorrect ones that require discussing.

For example, after mapping out a user's flow through the application,you may decide that the first story should be "User can Sign In" it might be tempting,  to decide that the first story should be "User Can Log In".

But remember, the definition of a story is "the smallest piece of incremental value that you could deliver into the hands of your users and learn from their reaction to it." So when you're starting from nothing, does the story "User Can Log In" deliver value into the hands of your users? No! It wouldn't add any value to the user's life; no one wants to log in to an application that does nothing.

At the beginning of an engagement, you'll need to get creative with how you think about creating that first piece of user value for the users. You might decide that a simple page listing a "product of the week" and a phone number users can call to purchase it would test important assumptions you have about the problem you're trying to solve for your users. After delivering that, you might get feedback from users that they don't want to call anyone—or that they want the store to call them. And so you write and prioritize the next story accordingly.

Of course, this is a highly idealized scenario; real projects will require weighing many options for deciding on the first story—and you likely won't have the luxury of waiting to write and prioritize the second story until you've gotten feedback from that first story. You might also decide that it's more important to prioritize the first story based on technical risk instead of user value; perhaps there's a potentially risky technical integration that you want to make sure the team has a handle on before moving forward with too many features that will be impacted by it. At the end of the day, it's up to you and your balanced team to put your heads together to effectively weight the tradeoffs and find the first starting point.

## Q: Why Estimate In Points, Not Time?

It doesn't matter if the organization is agile or [waterfall](https://en.wikipedia.org/wiki/Waterfall_model): it's generally valuable to know when something will be done. When will a feature be delivered? Will the release contain everything that we hoped to put in it? Delivery estimates help our product managers plan.

The mistake most companies make is that they ask their engineers to estimate software in chunks of time. They ask "How long will this feature take?", or "When will this feature be done?"

It's so tempting to answer their question directly by estimating how long you think something will take. Don't do it. We have literally decades of proof by this point that engineers are terrible at estimating in time.

We are, however, very good at estimating chunks of work relative to each other. This feature is harder than this feature. This story touches more moving pieces than that one. Teams can very quickly estimate stories in an iteration by comparing the stories in the iteration relative to each other (and relative to stories they've completed in the past). Line up the stories in an iteration, and sort them easy to hard.

But how does sorting stories relative to each other help us estimate when something will be done? Because of velocity. Assign points to each story that you've estimated. For example, your team may use a fibonacci pointing sequence: 1, 2, 3, 5, 8. That's five buckets to put stories in. The easiest stories go into the "1" bucket. The hardest stories go into the "8" bucket. Note that teams will also keep in mind estimates from previous iterations. Imagine a really complex story in a previous iteration got an 8, but the hardest story in this iteration isn't as complex. So maybe they put this iteration's hardest story in the "5" bucket.

Next, keep track of how many story points the team delivers week over week (or better yet, let a tool like [Pivotal Tracker](https://www.pivotaltracker.com/) automatically keep track of it for you). Figure out how many points the team can deliver in a given week by maintaining a rolling average of the last three week's of points delivered each week. That rolling average—the number of points a team can deliver in a week—is velocity.

[Velocity](https://martinfowler.com/bliki/XpVelocity.html) is the key to planning on XP teams. Instead of asking a team to estimate when something will be done based on their gut, we predict when something will be done based on data. We know how many points the team can deliver week over week. And we know where the story is in the prioritized list of stories (i.e., the backlog).

However, it's also important to know that predictions made with velocity are still just that: predictions. They're not foolproof. That's because a team probably does not deliver the exact same amount of points week over week. There's variation each week in how many points they deliver. That variation we call "volatility." The more volatility, the higher the margin of error in velocity-based predictions.

That's why engineers have to keep a very close watch on volatility on their team; when they're experiencing high degrees of volatility, they have to figure out the cause of the volatility and eliminate it. Otherwise, they won't be able to predict when things will be done with confidence—and the PMs won't be able to plan.

## Q: Why Not Estimate Bugs and Chores?

Velocity predicts when stories will be done. So why don't we estimate bugs and chores? Because if you do, you won't be able to rely on your velocity to predict when stories will be done anymore.

Here's why: stories are planned, but bugs are an **unintended consequence of feature development** (and one that, as much as possible, we try to eliminate). A bug represents something that used to work, but now doesn't. The completion of the original story has already been accounted for in your team's velocity and forward progress. It would be inaccurate to get second "velocity boost" or to show additional forward progress from fixing what was accidentally broken, given that the bug can be though of as a step backwards in progress. If the team fixes the same bug 20 times then they did not make 20 steps of progress -- they're bogged down by that bug, and their velocity might slow to reflect the situation.

Likewise, "chores" -- non-feature or bug-related tasks -- are a necessary aid to feature development, but typically aren't possible to plan up front—rather, they become apparent in reaction to the needs of the product as it evolves. If you start pointing bugs and chores, you'll artificially inflate your velocity.

Imagine you've been pointing bugs and chores as they've cropped up and adding them into the backlog; also, imagine that process has led you to a current "velocity" of 20 points per week. Your backlog is now empty, and your product manager shows your team 10 new stories. You and the other engineers estimate those stories at 40 points. So you all say, "It will take us two weeks to complete these!" But you'll be wrong. Because you won't just work on those stories; as you develop those stories, you'll have to deal with bugs and chores that crop up. Since your velocity was artificially inflated, you weren't able to accurately predict how long the stories would truly take.

Bugs and chores have to bring velocity down. That's why we don't point them. We want our velocity to tell us how long it will take to complete stories (i.e., user value). If you inflate it with bugs and chores, then you've lost your ability to predict how long it will actually take you to deliver new value.

## Q: What is the Value of CI/CD?

There are two questions you have to ask when considering shipping software:
* Can we ship?
* Should we ship?

"Should we ship?" is ultimately a business decision. Is it valuable to the business to put the latest features in the hands of the users right now? The product manager (PM) represents the business interests on the team and must own this decision.

However, the question "Can we ship?" is fundamentally an engineering question. Is the software in a working state? Are we confident it won't fail in production? The goal of the XP engineers is to **always** have a "yes" answer to this question. A team that can't ship, can't learn, and can't immediately address bugs or critical security vulnerabilities. And the longer you're not learning, the greater the risk that you're wasting time and money building the wrong thing.

The combination of three XP practices make it possible for teams to always have a "yes" answer to the question "Can We Ship?":

* Stories
* TDD
* Continuous Integration/Continuous Delivery

If your backlog consists of stories that conform [the definition in this FAQ](#stories), and your engineers only commit implementations of those stories once the team (PM, Designers, and Engineers) agree the implementation completes the story, then you'll never have any half-implemented features in the build.

But does the software work? Well we've already talked about how XP engineers answer that question: they [TDD](#tdd). Any pair, at any time, can run the tests to determine if their copy of the code works – if all features of the product work correctly. But on a big team, you have lots of pairs working in parallel, and therefore the codebase exists in multiple states simultaneously; the tests might be passing on one pairing station, but failing on another. That's where we get to continuous integration (CI): the team needs a single source of truth that they can point to in order to answer the question "does it work?" If the CI build is green, it works. You can ship the software. Now the PM has to decide if the team should ship the software.

Of course, there are all kinds of other benefits to CI. [To paraphrase Martin Fowler](https://www.martinfowler.com/articles/continuousIntegration.html): CI reduces risk by letting you know at all times what works and what doesn't. It raises awareness of bugs drastically and allows you to find and remove them quickly and without fuss. Because of this, projects that integrate continuously generally have fewer bugs. Of course, this is all predicated on the quality of your automated test suite.

It's worth noting that some PMs automate their responsibility with respect to shipping. Some always have the default answer: "Ship on green." In effect, they've asked the engineers to add another step to their build pipeline to automatically promote code to production on a green build. That's called "continuous deployment." However, although the mechanics of it are facilitated by engineers, shipping is still a business responsibility. The default answer of "ship on green" doesn't abdicate the responsibility of the decision to the engineers. The PM still has the responsibility of understanding how the features are working in production and how users are responding to it – which means the PM has to prioritize all engineering work necessary to build automated production monitoring capabilities that make continuous deployment responsible.

## Q: Why Are There Retrospectives?

We seed engagements with a number of key practices that we've found valuable over an incredible number of engagements, like pairing, test driven development, IPMs, standup, CI/CD, etc.

However, there is no one set of practices that will work effectively for all engagements. All practices are intended to solve problems, but not all engagements suffer from the same set of problems. Furthermore, the problems a team faces change over time.

That's why we also seed engagements with the [practice of retrospectives](/practices/3-column-retro). It's the seed of improvement. Week after week, teams sit down and talk about what's working, what's not, and what they can do about it.

Without that reflection and constant adjustment, the team's practices will deteriorate. What worked on day one won't necessarily work on day 30, or day 100. You have to constantly improve the team's efforts, or risk failure.

## Q: Why Do We Recommend Rotating Engineers to Other Projects?{id="rotations"}

Within Tanzu Labs, it's common to have engineers **_rotate_** between projects periodically. In other words, an engineer might not join a project at its beginning, and any given team member might not be on a project to its conclusion. We feel this is a good pattern for all team members, including [engineering anchors](/learningpaths/anchor-playbook/).

This can be difficult for everyone. Your team and product stakeholders might get attached to you. They not want you to leave to join another project. They might even get scared, or angry. You might also feel emotionally attached to your project and team, and feel scared or angry about moving on to another project before this one is finished.

However, rotation is in the best interest of the project and everyone involved with it. Here's why.

First, if a team is unchanged for too long, they'll start to become blind to their [broken windows](https://en.wikipedia.org/wiki/Broken_windows_theory). They won't see the annoying workarounds as annoying anymore; they'll have grown used to them. They'll become complacent about the hacks in their codebase,  the intermittent failures in their CI build, and the inefficiency of the release process. 

In other words, they'll become increasingly less effective at maintaining quality in the code base and in their engineering process.

It's true that every team needs a core group of engineers that understand the codebase inside and out, who have context on the architectural decisions that have been made, and can efficiently churn through a backlog. But every team also needs something else: **_they need fresh perspectives._** 

"But," we often hear, "onboarding new team members slows us down!" Actually, rotations speed up a team's productivity. That's because the peer's fresh perspective allows them to immediately notice the team's "broken windows." They'll (kindly) point out flaws in the codebase that have been slowing the team down. They'll fix the flaky CI build. They'll raise a red flag (again, kindly) about the team's insane release process.

If you rotate onto a team that's been together for a while, expect to find problems. But don't forget, your peers are humans, just like you. You can hurt their feelings if you're not careful. Be constructive; don't just complain -- offer solutions! And don't assume you understand why things are the way they are -- ask questions!

Conversely, if you're part of that core team that's been together for a while, and a peer is just rotating onto the team, set the example for soliciting feedback. Tell them you need them to point out what's broken. Be a role model for receiving feedback, and acting on it.

Rotation also eliminates the need for various kinds of organizational overhead:

* Personal assessment and feedback happens inline (part of pairing more than rotation, but rotation ensures a balanced aggregate view)
* The need for excessive handbooks/playbooks/onboarding materials is greatly reduced as knowledge silos are broken down
* Transferring of existing skills and the sharing of new technologies happens organically, rather than needing artificial efforts like required classes and workshops
* It strengthens the connection between teams as friends rotate to other projects, increasing the likeliness of cross-team knowledge sharing and reducing duplicated efforts
* Reduces the strain on any one relationship knowing that one is not "trapped" on a project forever.

We talk about how pair programming helps de-risks projects. **_Rotation is the real-life manifestation of that lowered risk.**_ By having solution knowledge and context shared by the team, rather than locked up in a few people -- or, worse, in a single person -- the downside to a single person rotating onto another team is dramatically lowered.

Project stakeholders often object to rotating team members – not just developers! It's important to remember that organizations usually prioritize keeping (and sometimes hording) the best individual contributors that they can find. It takes time, trust, and proof to show them they can live in a better world that focuses on team dynamics rather than individual skills.

Rotations are also an opportunity for:

* Validating that the team has the right documentation to effectively onboard and/or handover to new people
* Giving new or junior engineers the chance to take responsibility for core engineering knowledge on the project
* Giving new or junior developers the opportunity to onboard new people onto the project

But what about keeping historical context? What about having a consistent face on the project? We do recommend having an **anchor** the project who rotates less frequently. See our section on [Anchors](#anchors).      

## Q: What is an Engineering "Anchor"?{id="anchors"}

{{% callout %}}
Read the [**Anchor Playbook**](/learningpaths/anchor-playbook/) for an in-depth look into Anchors. It is Tanzu Lab's answer to the tech-lead role.
{{% /callout %}}

## Q: What is the Difference Between Scrum and XP? 

The fundamental difference between Scrum and XP is that Scrum is based on project structure, whereas XP is based on delivery practices and project structure.

- Scrum was a reaction to inefficient, poisonous projects, where teams were dictated how to do their jobs by outsiders who didn't know what they were doing, and often did not have any real "skin in the game" regarding the outcomes. Scrum defines a set of rules that say "the delivery team decides _how they deliver_, while the business team decides _what is delivered_." Both groups are on the hook for the outcomes. If you're not in either of those groups or are not impacted by the outcomes then you don't get a say. If you're a member of one group you don't get to tell the other group how to do their job, though you can, and should, collaborate. 

  That's Scrum -- a protective "bubble" for projects to work within.

- Scrum teams also typically practice something called a sprint "commit." That is, the developers, at the outset of a sprint, will decide on a certain amount of work that they'll "commit" to completing during their sprint.[ SAFe](https://en.wikipedia.org/wiki/Scaled_agile_framework) has a [similar commitment model](https://www.scaledagileframework.com/pi-objectives/). There are Pros and Cons to this. There can be a lot of positive energy and motivation that can come from a shared team goal like the sprint "commit," and high-functioning Scrum teams do a lot to harness and leverage that positive energy. Furthermore, a high-functioning Scrum team will also consider re-negotiating a sprint's scope with their product manager during the sprint if they discover something that leads them to believe they should adjust things mid-sprint.

  Of course, not all Scrum teams are "high-functioning" (nor are all XP teams!). With a sprint "commit", sometimes the product manager will tell the powers that be that they will **_definitely_** complete a certain scope by a certain date. Fixing time and scope in this way can have a very negative effect on the code and the team. If the team starts to slip they might be under pressure to "get things done", which often ends in sacrificing code quality and taking on tech debt. Because of that, it's not uncommon in organizations that practice firm sprint "commits" to see engineers "pad" their estimates, eroding trust between different roles and parts of the organization. Even worse, this sometimes results in management putting even more pressure on the team because they know that engineers padded the estimate and can probably do a few more things.

- Iterations in Scrum, called "sprints", are a time-box of one month or less, during which a "Done", usable, potentially releasable product increment is created by the end of the sprint.
- Scrum doesn't prescribe any specific engineering practices—instead, Scrum gives the team complete freedom to use any engineering practices that they see fit during a sprint, and to change them from Sprint to Sprint through continuous improvement (e.g., retrospectives).   
-  XP was also a reaction to inefficient projects and product delivery. It also set up a "bubble" around the product teams and rules about who gets to dictate what. But, XP came from software engineers who were frustrated with how poorly software was written and maintained, and how hard it was to change software in reaction to the needs of the business. Thus, XP suggested engineering practices within the project bubble, such as pair programming, test driven development, and refactoring.
-  XP teams also vary their practices week to week through continuous improvement (e.g. retrospectives... sounds familiar, right?). However, there are some practices that XP teams don't vary, but instead consider to be "core practices", and apply them always; namely, TDD and pair programming.
- XP teams always have a "Done", usable, potentially releasable product—every single story (even every single commit to the primary branch) should result in a working, usable, releasable product. For an interesting perspective on sprints, please see Ron Jeffries' article [Hills to Die On: Sprints](https://ronjeffries.com/articles/018-01ff/ds-hill-sprints/)
- XP teams don't have sprints defined by Scrum and time-spans are referred to as iterations. At the start of a week, a team will [review what's currently in the backlog and icebox](/practices/ipm), estimate (with points, not time) any stories that seem worthy of estimation at that time, and prioritize the next most important things to work on. Throughout the week, they'll work on stories and deliver them to production—but at any time, they may adjust the prioritized list in the backlog, or even slot in, estimate, and prioritize all new stories. That's because they believe that the best software is built through learning. They know that by **_embracing change_**, they can build better software. So they're always ready and willing to change priorities based on what they're learning as they put working software in the hands of users.

It's important to keep in mind: our goal in these situations is not to start a war of XP versus Scrum, or to tell anyone that practices Scrum that they're wrong for doing it and that XP is right choice.

Often, one of the primary goals when working with a client is to introduce them to a different way of working and thinking. We are sometimes asked if we can "just do Scrum" instead of XP. In a way we already are. Our process takes a lot of hints from Scrum and layers on many missing aspects, such as engineering practices. XP adds new tools to the software development toolbox. 

{{% callout %}}
**Consulting Tip:** If you are a consultant, be careful not to "remind" your client that they are there to learn from you and do exactly what you say -- only your clients can tell you why they are here, and one should not make assumptions about the circumstances by which they came to work with you.
{{% /callout %}}

Before we talk about how XP and Scrum are different, let's talk about how they're the **same**. 
* Both XP and Scrum strive to deliver useful software into the hands of users through short iterations via small teams employing continuous improvement. 
* Both Scrum and XP teams regularly reflect on what's working, what's not, and what they can do to iterate on the process.


## Q: Are Deadlines Bad?

No! Deadlines aren't bad. They're great! In our process, having a deadline is really a chance for our process to shine.

A lot of software development teams have had bad experiences with deadlines. They've been subjected to the dreaded [death march](https://en.wikipedia.org/wiki/Death_march_(project_management)). In other words, they've been given a fixed scope that they must complete by a certain date, and have been burned out working nights and weekends, compromising the quality of their work, trying to meet the deadline.

The problem they're dealing with is what is sometimes referred to as the
[Iron Triangle](https://en.wikipedia.org/wiki/Project_management_triangle). On any team, you have three qualities you're trying to achieve: fast, cheap, high quality. In other words, you want the team to deliver quality software as quickly as possible for as little cost as possible. But unfortunately, you can't have all three things at once. You can only have **two of the three dimensions:**

- You can get something **fast and cheap**, but the team will have to sacrifice quality to do it.
- You can get something **fast with high quality**, but you'll pay a lot of money for it. 
- You can get something **cheaply with high quality**, but you'll have to wait a long time to get it.

That's why fixed scope / fixed time is so problematic, and the death march inevitable. And the more the team sacrifices the quality of their work, the harder the work becomes. Though they might manage to meet the deadline, the software will be of such low quality that they won't be able to maintain it after that.

Of course, none of this is caused by a deadline itself. It's caused by waterfall incentive structures; the client's organization measures success as "on time, on budget". But at what quality?

We advocate for a very different way to measure success in software development. It doesn't matter if you build something "on time and on budget" if the software isn't valuable to the users or the business in the first place!

So when we are working towards a deadline, we don't focus on thinking about "how can we build _all of these features_ by this date"; instead, we think about "what are the _most valuable things_ we can build by this date?"

With a predictable velocity, the product manager can start to make hard decisions and weigh tradeoffs between features. They're forced to think more critically about their  list of features, and will start to value evidence-based approaches to deciding what to build. Deadlines are forcing functions for lean validation and constant re-prioritization based on learning, since it's really the only way they're going to ensure that they've created something valuable by the deadline.

## Q: How Do You Scale Practices into Large, Traditional Enterprises?
{{% callout %}}
See our white paper about [How to Scale Agile Software Development with Product Teams in the Enterprise](https://tanzu.vmware.com/content/white-papers/how-to-scale-agile-software-development-with-product-teams-in-the-enterprise)
{{% /callout %}}

Build teams around architecture, not architecture around teams.

With new products and startup companies it is common to start off with a handful of teams building new [greenfield applications](https://en.wikipedia.org/wiki/Greenfield_project). As those applications grow, you'll quickly discover that it's too much for one team to handle. So how do you scale it? And what about your existing product portfolio? When you start surgically applying lean, agile, and UCD teams to it, how will they integrate with the existing team structures?

We've learned quite a few lessons about how to successfully scale these practices ourselves while building [TAS - Tanzu Application Services](https://tanzu.vmware.com/application-service). We have hundreds of engineers, product managers, designers, program managers, and directors spread across the globe.

#### Rule #1: Scale Slowly

Don't go from 20 to 200 overnight. Don't jump from 1 team in 1 location to 10 teams in 10 locations. Don't lower your hiring bar in order to scale. Start small, and build slowly. Go from one team to two teams – in the same location. Go from one location to two locations – in the same time zone. Retrospect on scaling all along the way, adding just enough leadership and inventing new practices and communication patterns to keep teams efficient and healthy.

#### Rule #2: Distribute Teams Based on Architectural Boundaries

This second rule is sometimes referred to as the "inverse Conway maneuver" in reference to [Mel Conway's "law"](https://en.wikipedia.org/wiki/Conway%27s_law):

> Organizations which design systems ... are constrained to produce designs which are copies of the communication structures of these organizations".

In other words, if you're not careful, your architecture will reflect the structure of your organization—which means you'll be creating architectural boundaries to suit your people, instead of organizing your people to suit the architecture demanded by the actual product.

Let's take one of our own products as an example. Tanzu Application Service, like many well-designed systems, has a plugin architecture -- a set of well-defined APIs and extension points. You can plug in Buildpacks, service brokers, logging utilities, performance monitoring systems, and more. But underneath the hood, TAS also has a core distributed system, built by distributed teams that must collaborate closely.

Based on our experiences, we recommend you keep closely collaborating teams like these in the same or close time zone, ideally in the same location, and only spread them out geographically once you've proven it works well "in one place." The teams building at the well-defined architectural boundaries are much easier to distribute to other locations. The plugin teams have minimal communication requirements with folks working on the core distributed system, since they're operating at a well-defined plugin point and working in largely independent problem domains.

"That's all well and good for the new products I scale," you might be saying to yourself, "but what all of my existing teams and products? When I want to apply lean, UCD, and agile engineering practices to them in order to optimize my existing business, how do I do it?"

Let's set aside the funding and management adjustments you'll need to make to support these folks for a second, and talk specifically about the engineering challenges here.

1. As you start to optimize the underlying application codebases and infrastructure, you'll need to carefully retrofit automated tests on top of it so that your teams can refactor or rewrite portions of it in order to solve for the engineering pains present in the legacy architecture or meet the new business objectives. This isn't [TDD 101](/learningpaths/application-development/test-driven-development/); it's advanced testing. You'll need highly skilled practitioners in order to do this effectively. Work with your engineering leadership to find these practitioners, and to grow more of them.
2. You'll need to align certain teams vertically, instead of slicing them up horizontally. You have all kinds of cross-cutting domains in your legacy architecture (take authentication as the universal example—a domain that cuts across most, if not all, of your applications). You'll need to organize teams around business capabilities, not technologies. As Martin Fowler[ points out](https://youtu.be/wgdBVIX9ifA?t=6m30s), the common misconception that companies have when it comes to microservices is that microservice architectures means that you have a team that only owns the microservice API and nothing else. But if you look at Amazon, the archetype for the microservice architecture playing out at scale in a company,[ they instead organized their teams around business capabilities.](https://aws.amazon.com/modern-apps/faqs/) They have an order team, a shipping team, a catalog team, etc. Each of these build services, true. But they also own their business capability end to end, all the way to the end user. They own the experience, and how that experience plays out in the various software products their particular business capability is present in.

## (TBD) Q: What's Do You Think About SAFe?
Coming Soon!

## (TBD) Q: Is It Ever Okay to Bend "the Rules"?
Coming Soon!
