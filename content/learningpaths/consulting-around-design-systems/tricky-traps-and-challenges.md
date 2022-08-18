---
title: Tricky Traps and Challenges
weight: 20
layout: single
team:
- Carolyn Haines
- Lauren Manuel
---

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
