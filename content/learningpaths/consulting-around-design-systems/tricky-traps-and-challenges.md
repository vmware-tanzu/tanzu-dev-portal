---
title: Tricky Traps and Challenges
weight: 20
layout: single
team:
- Carolyn Haines
- Lauren Manuel
---
![1 person showing their laptop screen to another](https://user-images.githubusercontent.com/105306536/186534985-fab1ca8d-5632-4b59-a91e-f3e9da44c06e.jpg)

## Terminology and Communication Traps 

> “The single biggest problem in communication is the illusion that it has taken place.”
> 
> — George Bernard Shaw

The environment around design systems is brimming with loaded and context-dependent terminology, conflicting and evolving definitions, and way too many people claiming to have it all figured out. We aren’t those people.

There are lots of ways to define, interpret, and categorize many of the terms you’ll hear in relation to design systems. We aren’t in the business of being right. We’re in the business of communicating and solving problems. It is in pursuit of communication, not righteousness, that we put together this list of commonly conflated, loaded, and context-dependent terms you’re likely to encounter when talking about design systems. The goal here isn’t to become Deputy Definitions. It’s to be aware of terms with squishy definitions so that you can recognize potential miscommunication, swoop in, and firm things up. 


### Design system*


#### In general

A design system is generally an umbrella that covers an opinionated collection of assets created to help teams build consistent UI. Typically they include:



* Pattern library
* Coded components
* Design components (Figma/Sketch/etc.)
* Documentation site


#### The squish

For some folks, the lines drawn around a design system may be more narrow, more broad, more rigid, or more blurry. You may also hear “design system” used to include, exclude, or refer to:



* Brand guides 
* Style guides
* Dev standards
* UX/UI principles
* Training materials and processes 
* Photography or illustration libraries

***This is the single most critical piece of terminology to _immediately_ norm around. Conflicting understandings of what constitutes the design system can have a _huge_ impact**


### Brand Guide (a.k.a. brand system)


#### In general

A brand guide or brand system is typically a document aimed at capturing a brand’s overall vibe, and includes rules and resources to help it be reproduced consistently across media. A brand guide will usually include:



* Logo files and requirements
* Color palettes and usage
* Typography guidance
* Voice and tone guidance
* Layout and composition guidance
* Icon, photo and illustration guidance
* Various templates (presentations, email signatures, documents, etc.)


#### The squish

Many things can be interpreted as guides or systems, and anything an organization creates _technically_ falls under their brand, so this one is a real crap shoot. 



* A brand system may contain a design system.
* A design system may contain a brand guide.
* You may see wildly varying levels of detail and quality
* You may hear brand guide and style guide used interchangeably


### Style guide


#### In general

Generally a style guide is like a lightweight version of a brand guide. It’s often a subset of the most visible aspects of a brand’s look and feel that’s easy to apply across media. If the brand guide is a full study, the style guide is like the abstract. They often include:



* Logo
* Color palette
* Typography
* Basic components such as buttons, text fields, icons (the “atoms” if you dig Atomic Design).


#### The squish

The above definition assumes a context of design. In the context of development, a style guide may be a set of guidance for how developers should be writing their code so the codebase remains clean, familiar and navigable across teams. In a marketing or branding context, a style guide may refer to on-brand voice, tone, verbal and grammar usage.

Further still, a team may create something called a style guide in lieu of a design system. In this context, we’re usually talking about an internal library of UI components and patterns that can be easily reused.

### Component


#### In general

A component is simply a reusable pattern. 


#### The squish

Designers & developers both understand components to mean reusable patterns, but the content of the patterns and the contexts in which we apply them are usually different.



* To designers, components are typically mocked-up pieces of UI, like buttons, text fields, or modals. They’re usually for illustrative purposes, and may or may not have functional coded counterparts
    * These components typically exist only in the design application (e.g. Figma)
* To developers, components may refer to extracted code or methods which are shared across a codebase(s). 
    * These components may exist on the back-end or be end-user visible on the front end.

A good place to start a conversation between developers and designers is to talk about the pieces of the interface that design believes are components (or patterns) in an attempt to model the software code to match how the designer is thinking about reusable patterns.


### Library (a.k.a. pattern library)


#### In general

A library is a collection of resources, organized and shared across teams.


#### The squish

Libraries may have shared code, shared assets, or a shared set of UI components. 



* Designers may hear “library” and think of a published collection of design assets they use to create their design files (colors, type styles, object styles, components, etc.)
    * If a design library is provided as part of a design system, it may not include everything a designer would ever need—if this is the case, designers will sometimes create their own sub-libraries (fun, right?)
* Developers may hear “library” and think of some sort of shared code across teams
* A designer’s library and a developer’s library might not always match up 1:1

There can easily be confusion on a team when both designers and developers are talking about "libraries". Our best advice is to get comfortable asking “which library do you mean?”


### Framework (a.k.a. front-end framework)


#### In general

A framework is a kind of opinionated and vetted scaffolding on top of which we build something.


#### The squish

People use the word “framework” to talk about following an established pattern or conceptual template. They also use it to talk about a specific type of technical product called a framework.



* I can use design thinking as a framework to approach problem solving (concept).
* I can use React as a front-end framework for building my app (product).


### Documentation


#### In general

Documentation is usually a website that spells out everything that’s available as part of a design system, descriptions of how it all works, and instructions/recommendations for how to use it. For example, this is the [documentation for Clarity](https://clarity.design/get-started/) (VMware’s design system).


#### The squish

Documentation can be anything that has been documented, so this is another place to get comfy asking, “which documentation are you talking about?”



* Design files can be called documentation because they document what the UI should look like and how the experience should flow
* Teams practicing Test-Driven Development (TDD) would often say that their automated testing is their documentation / specifications
* We’ve seen organizations who chose to adapt existing systems end up with 2 sets of relevant but competing documentation
    * The documentation for the source system (e.g. Material)
    * The documentation for their in-house adapted system


## One final thought on terminology

Knowing the impact that loaded terminology can have on communication, you may be tempted to align on team-specific definitions for these terms, via something like a [ubiquitous language workshop](https://tanzu.vmware.com/developer/practices/ubiquitous-language/). This could be a great solution to the problem. The word of caution we will share is this: 


> Language tends to be deeply embedded in people—dislodging or “correcting” internalized definitions from their minds might be very difficult, even if they have the best intentions of seeing them dislodged.

We don’t want to dissuade you from aligning on standard definitions for some of these terms with your team. We’re simply saying that even with the best intentions and the most bought-in team members, people may still slip. If the norm is to quickly check-in with each other when these loaded terms are used, you’re likely to catch any slips and still communicate effectively. If the norm is that “when we say library we _always_ mean _____”, you might not catch an unintentional straying from the established norm.

![Person speaking to others in a meeting](https://user-images.githubusercontent.com/105306536/186536650-ff167b25-a78e-4ea9-adfe-2ceb9b10a046.jpg)


## Common Misconceptions 

In more ways than you might think, design systems are a lot like hot dogs: lots of people love them, some people have odd opinions about them, and it’s not uncommon for their recipes to be steeped in mystery. Despite their popularity, design systems can stump the best of us. Lots of people harbor misconceptions about them that can make your life unnecessarily difficult. Get to know some of these commonly heard phrases, so that you can impress everyone in your Zoom room with your insightful ability to head off the future trouble they may cause. 


### “Design systems are easy.”

Design systems are often spoken about as simple, easy, magic-bullet-type solutions to all our product problems, which is a _huge_ misconception. Their out-of-the-box polish and the seeming straight-forwardness with which they can be used to build professional-_looking_ software has likely contributed to this reputation. 

To someone without mountains of experience, the complexities that come with design systems may not be obvious. They can seem like magic libraries, where patterns are copied off a virtual shelf and pasted into apps. The reality is that there are loads of nuance, quirks, opinions, and limitations baked into every system. They require resources, processes, and dedication to use and maintain. It requires time, training, and practice to master them, and they will _still_ surprise you. Design systems can be powerful tools, but they are not to be taken lightly.


### “Design systems are for designers.”

Language shapes perception. The name “design system” can lead to the assumption that designers “own” all the design system things in their designer bubbles. This is a dangerous assumption, and could not be further from the truth.

In reality, design systems live in the evolving (perhaps even shrinking) middleground between design and development. _Design is not a territory, it’s a capability_. We all have roles to play when it comes to engaging with design systems. The systems do not absolve you of the need for meaningful cross-discipline communication and collaboration. They _require_ it in order to be effective tools.


### “We should use Material — it’s the best design system.”

The belief that any one design system is universally “the best” ignores the fact that each product, each team, and each organization exists within its own ecosystem of needs and constraints. The best design system is the one that meets the needs of your organization and your teams. The one that loses you the least, and gains you the most in terms of trade-offs; the one you know, or are committed to learning how to use. It may be the one that doesn’t exist yet, because you need to build it. It’s even possible that the best design system for you is [no design system at all](/learningpaths/consulting-around-design-systems/is-a-design-system-right-for-your-team/).


### “A design system will make our products consistent.”

A design system provides a common starting point from which designers and developers immediately and inevitably diverge. Think of it like this: you give the same 100 LEGO pieces to ten different people, and ask them to build a house. The result is you end up with ten very different houses. Nobody did anything wrong. It’s just the nature of the beast.

Having a design system in place does not guarantee consistent (or even good) design. It’s a tool that many people are going to use in many contexts, giving it the potential to be used in many different ways. 


* If the goal is consistency and familiarity across multiple products, develop processes to achieve these goals. 
* Do not count on a design system to achieve them for you. You will be disappointed.


### “If we have a design system, why do we need designers?”

Imagine you buy an empty plot of land for your future home. Then someone drops off a few tons of framing lumber and sheetrock. You wonder, “Do I really _need_ the architect?” The answer is Yes. Unless you’re cool with being 80% complete when you realize your picture window gives an excellent view of a brick wall, you’re going to need a professional planning how things will fit together.

As discussed, a design system provides a common starting point in the form of some patterns and some decisions. _Some_ decisions! Not all decisions. You can have the most robust system in the world, and there will still be countless decisions and judgment calls that the system cannot make for you. Designers are trained to make these decisions in ways no system ever could. No matter how fancy your system is, it’s still a tool, and tools can’t use themselves. 

> It’s also worth mentioning that designers do a LOT more than assemble UI components. Design is a multifaceted discipline, and the points discussed here are just scratching the surface.


![Person speaking in a meeting](https://user-images.githubusercontent.com/105306536/186536000-9b0a0c53-3d9b-4b21-8c00-6a1b77fac0eb.jpg)


## Common Challenges

> “No matter how hard you fight the darkness, every light casts a shadow…”  
> — Plato

Design systems are no exception to Plato’s insightful observation of this basic reality. For all the value there is to be gained by using them,  design systems do not come without some very real challenges. While some of these challenges are inherent, requiring vigilance and discipline to navigate, others are entirely avoidable. Let’s muse on some common challenges around design systems, and how  you can approach navigating them.


### Risky Business

There’s no getting around this one. Some big decisions around design systems are difficult to walk back. Once you’ve decided to start using a system, it is almost always going to be a very expensive decision to unmake. 


#### What you can do

It’s important that you do everything in your power to make good, well-informed decisions. Check out some of the sections below to help navigate these choices whether you’re [choosing a design system](#heading=h.d37dn5mmcyqr) or [inheriting one](#heading=h.dprmrsiz082i).


### Proficiency and Experience

Software folk come from all manner of backgrounds, so it’s not uncommon for you to be working with stakeholders, partners, or practitioners who have little to no experience working with design systems. 


#### What you can do

Remember, empathy first. It’s no fun to not know something you feel like you should. Look for ways to help your team deepen their understanding of design systems, and remember to stay open to learning yourself. We work in an ever-changing industry, and “knowing” anything is always risky. Treat every team and every system like a new opportunity, and consider doing some [design-system-focused norming](#heading=h.4n5kqmvhy0ii) among product teams.


### Management and Maintenance

Managing and maintaining any kind of in-house system is a beast of a job. No matter how you slice it, there are a lot of plates to keep spinning: 



* What kind of resources are needed to build and maintain the system? 
* How often are updates made? How are they communicated? 
* How are contributions handled? How do teams get help or training? 
* How many tints and shades of blue do we need?

It’s possible that your experience working with a system did not go _smoothly_. It’s also possible that the folks who need help handling all this business are working outside the explicit boundaries of a specific project or team, making them a little more difficult to influence. 


#### What you can do 

Again, empathy first. Assume that everyone is doing their best and try to see where you may be able to offer some feedback, guidance, or influence. Consider disguising it as help if there are fragile egos in the mix. If there’s a meeting where updates to the system are discussed, ask if you can attend. If there’s a Slack channel where questions are asked and discussion takes place, join the conversation. 

In general, try to kindly identify gaps, inefficiencies, or problems where you see them, and always be sure to offer possible solutions if you have them. Designers are problem-solvers, after all.


### Supporting Resources

The availability of high-quality supporting resources for practitioners is another challenge with adapted or custom systems. . Issues exist from incomplete or contradictory documentation, to incorrect color values in the published design library. This can be frustrating as a practitioner, especially when it slows down the ability to do your work. These resources are often owned by outside teams, and perhaps sitting outside your sphere of influence.


#### What you can do 

If you find yourself working with resources owned by another team consider it an opportunity. If you notice that designers are constantly detaching the instances of a design component because it’s built incorrectly, point out to your teammates what you’re doing, and why you’re doing it. This is a good opportunity to demonstrate proactivity, as well. If you come across missing documentation or sloppy assets, find out what the process is for making fixes. In all likelihood, whoever has that in their job description is going to be glad to have some help. See if you can gently inject yourself and some of your expertise. If you can help improve these resources, you’ll not only be helping your team, but every other team who uses the system.


### Consistency

Consistency—the white whale. The idea of in-app and cross-app consistency is one riddled with nuance and strong opinions. You may run across leaders who insist on the consistent use of patterns regardless of domain. You may encounter a designer who believes they’ve revolutionized the dropdown, rejecting basic system components in favor of their own custom creations. You may discover that the teams building parts of a single large product offering have entirely different navigation patterns and applications of the color palette. And you will almost certainly run into someone with a desire for consistency, and an inability to tell you what that means.


#### What you can do 

First,  remember that consistency does not mean uniformity. There is, and should be, room for autonomy. Second, try to suss out what “consistency” means in your particular situation. Think about what it might take to achieve, and determine the value that the consistency provides to the organization, users, practitioners, and product teams. 

Achieving the consistency that’s initially desired is a grossly underestimated effort that provides overestimated value. That’s not to say there is _no_ value to be gained. If inconsistencies in major design patterns are causing confusion and frustration for users, or if they are resulting in a sloppy look for an organization, something should be done about it. 

Should you encounter a similar issue it’s best to proceed with caution, and do what you can to:



* Facilitate a clear articulation of the desired outcomes.
* Measure the impact inconsistency is having on the users/teams/org.
    * Run quantitative or qualitative studies with users to get data on perceived brand consistency, pattern consistency/familiarity, etc.
    * Collect data on the frequency of inconsistent pattern usage or implementation.
    * Talk to teams to gauge the impact of inconsistency has on their velocity.
    * Talk to stakeholders to gain insight on perceived brand impact.
* Size-up the effort involved in achieving the desired outcomes.
    * Talk to all disciplines to understand what would be involved.
    * Run a small consistency experiment to help estimate timelines and effort.
* Balance all the info above and prioritize ruthlessly


### Attitudes

There is no shortage of spicy opinions to be found around design systems. There are designers who are upset by the feeling of their autonomy being taken away, and there are plenty of folks who are not the biggest fans of Material. Still, others are excited by the prospect of having to make fewer design decisions. It’s important  to allow people space to have their own emotions and opinions, but there is a point where attitudes can become unproductive, risky, or even toxic.


#### What you can do 

Talk about attitudes that you encounter around design systems openly, and honestly with your team about handling attitudes around design systems. Try having a one-on-one, or sharing a different perspective with someone who may be harboring an attitude. From a practical perspective, try finding fun ways to [embrace creative constraints](https://www.psychologytoday.com/us/blog/slow-gains/201401/the-weird-strategy-dr-seuss-create-his-greatest-work). 

For example, we once ran a creative constraints workshop with a team of client designers who had mixed feelings (and mixed adoption) of their design system. It turned into a great bonding experience. We witnessed an emotional saga told exclusively with emojis,  that actually helped cool down some of the spicier attitudes on the team.
