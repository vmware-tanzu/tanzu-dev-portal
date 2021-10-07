---
date: '2021-06-22'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Pair Programming
weight: 50
oldPath: "/content/outcomes/application-development/pair-programming.md"
aliases:
- "/outcomes/application-development/pair-programming"
tags: []
---

Lennon and McCartney. Penn and Teller. Venus and Serena.

Some of the greatest achievements in history were produced by pairs of great minds working side-by-side on the same task. Software is no exception.

At Tanzu Labs, we are known for being on the cutting edge of Agile software development—some might even say [extreme](https://en.wikipedia.org/wiki/Extreme_programming). One software development technique in which we believe deeply is pair programming.

Pair programming helps the team produce high quality software while also helping everyone on the development team have a broader understanding of the software. There are some challenges to pair programming but we’ve proven time again across hundreds of projects that the benefits far outweigh the costs.

![Pair Programming](/images/outcomes/application-development/pair-programming.jpg)

## What you will learn
In this article, you will learn to:

- [Define pair programming and remote pair programming](#define-pair-programming-and-remote-pair-programming)
- [List at least five potential benefits of pair programming](#list-at-least-five-potential-benefits-of-pair-programming)
- [List at least five potential challenges of pair programming](#list-at-least-five-potential-challenges-of-pair-programming)
- [Describe the mechanics of the driver/navigator style of pair programming](#describe-the-mechanics-of-the-drivernavigator-style-of-pair-programming)

## Define pair programming and remote pair programming
Pair programming is a software development technique whereby two programmers work on the same problem, at the same time, on the same computer, with the goal of producing high quality software quickly. 

Regarding “on the same computer,” we do not mean two people hunched over a tiny laptop. When co-located, we recommend setting up two large monitors, two sets of keyboards, two mice, and two sets of anything else the pair needs to work effectively together, such as a laptop docking station. 

If the pair is not co-located, [remote pair programming](https://tanzu.vmware.com/content/blog/5-tips-for-effective-remote-pair-programming-while-working-from-home) is a good alternative. Remote pair programming is pair programming with the help of commonly available collaboration software.

## List at least five potential benefits of pair programming
“Done” does not mean the developers have committed their code and lifted their fingers off their keyboards. For VMware Tanzu Labs, “done” means low-defect software delivered to users in production that does not need rework due to errors or missed requirements. Pair programming helps accomplish this mission in the following ways:

### Code quality benefits
The most beneficial outcome of pair programming is the quality of the code written by the team. As pairs switch (often daily), everyone has a chance to contribute  and refine the system they are developing. Benefits include:

* Fewer bugs
* Better system design
* More understandable code
* Wider code testing coverage
* “Fresh eyes” to help expose hidden flaws

### Time-to-production benefits
While pair programming does support shipping high quality code to production quickly, predictability is a more important benefit over speed. Radical swings in delivery velocity introduce risk into the development cycles — pair programming helps mitigate swings in delivery velocity in the following ways: 

* Intense focus on the task at hand
* Less rework
* More accurate implementation of requirements
* Less time in QA

### Knowledge sharing benefits
While pair programming, not only are two people working on the same difficult problem together, they are also constantly teaching one another in the following ways: 

* New team member onboarding
* Junior developers learning from senior developers
* Senior developers learning from junior developers — it’s true!
* Tips and tricks sharing

### Collective ownership benefits
Individual ownership of features, modules, and even entire systems is both common and tempting -- it's comforting to know someone is responsible for something important. This pattern is also extremely risky since people switch jobs, have life events that make them unavailable, and other factors that impact delivery velocity. Pair programming mitigates these risks in the following ways:  

* Breaking down knowledge silos
* Countering "hero" culture
* Reduce the [“bus factor” or “lottery factor”](https://en.wikipedia.org/wiki/Bus_factor)

### Team building benefits
Pair programming isn’t all about the code — it’s also all about the people who write the code. 

* Shared pride of ownership of the code and product
* Building empathy with one another
* Interpersonal skills development
* Social interaction
* Happier, more motivated employees

## List at least five potential challenges of pair programming
The benefits of pair programming are clear, but those benefits don’t come cheaply. Pairing is hard. Without a doubt, the most difficult challenge of pair programming is **_the willingness to give it an honest try_**. 

Pair programming means not only sharing what we know, but also exposing how much we don’t know. For many people in the software industry this contradicts the rock-star-ninja-hacker-wizard image bestowed upon developers. Accepting that we all have areas of growth is important for successful pair programming, especially since you and your pair are in the same boat: both of you are sharing what you know and exposing what you don’t know at the same time. By complementing each other’s abilities, you become greater than the sum of both of your skills and experience.

Other challenges include:

* Being made fun of by others in the organization -- it happens!
* Different code editor preferences and computer configuration
* Differing schedules
* Ergonomics, such as physical desk and office configurations
* Falling behind on emails, chat threads, and other communication channels
* For remote pair programming: infrastructure, tools, network speed, security restrictions
* Individual cultural differences
* Interruptions and distractions imposed by other responsibilities
* Mental and physical exhaustion
* Organizational resistance
* Perception that it’s “twice the cost” a developers programming alone
* Personality conflicts

## Describe the mechanics of the driver/navigator style of pair programming
[While there are many pair programming styles](https://martinfowler.com/articles/on-pair-programming.html), our experience shows most are a variation of the **driver/navigator** style. At any given moment, the **driver** has their fingers on the keyboard, coding and implementing the next logic statement. At the same time, the **navigator** is looking back at what was just written, suggesting the next course of action, and strategically thinking further ahead. Research shows and our experience confirms that our brains have difficulty performing high-level strategizing and detailed execution at the same time, which is why two heads working together is better than one in complex problem-solving situations. Pairing addresses this conundrum by having one person for each role.

The pair should switch driver/navigator roles on a regular basis. Sometimes this happens organically to create a “balanced” pairing session. We do recommend a few different pair programming formats for those new to pair programming, for pairs finding their driver/navigator time to be unbalanced, or for those who want to introduce variety into their pairing sessions. More details about each of these are in the blog post _[What’s the Best Way to Pair?](https://tanzu.vmware.com/content/blog/what-s-the-best-way-to-pair)_ by Maya Rosecrance and Sarah Connor.

### Go with the Flow
Just go for it! Sit down, start pairing, and ride whatever driver/navigator pattern emerges. The pair should be disciplined about switching roles, and be cognisant of whether they are falling into an unbalanced driver/navigator pattern. 

### Pomodoro 
[Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique) is a dependable study technique where a timer is used to signal the switch between roles, taking breaks, or even switching pairs entirely. Typically, this is 25 minutes of work, followed by a 5-minute break.

### TDD Ping-Pong 
“Ping-Pong” pairing is a natural complement to [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)**.** The classic Ping Pong technique first has the driver write a failing test for some desired functionality that is not yet implemented. The pair switches roles, having the new driver implement the minimum necessary code in order to pass the test. That driver then writes the next failing test and the cycle continues, with each person equally sharing test-writing and functionality-implementation duties.

### Switch Roles on Research
Switch roles any time the pair wants to research something further. This helps reduce the impulse to separate and research individually, which can sometimes evolve into an excuse to stop pairing entirely. 

### Pairmate/One-keyboard
A small item like a stuffed animal or tchotchke can be used to signal who is navigating. The navigator holds the item to signal that they are not to touch the keyboard until that item is passed off (physically or virtually when remote) to the other. Alternatively, the item can be removed, and the pair shares a single keyboard or toggles remote-keyboard control as needed.

### Task List
The pair decides on a set of tasks that need to be accomplished and switches after each is completed. Tasks can be created, modified, or deleted as the pair progresses. Ideally each takes about the same amount of time to complete.

## In this article, you learned to:
* Define pair programming and remote pair programming
* List at least five potential benefits of pair programming
* List at least five potential challenges of pair programming
* Describe the mechanics of the driver/navigator style of pair programming

## Keep Learning
1. Blog: [What’s the Best Way to Pair?](https://tanzu.vmware.com/content/blog/what-s-the-best-way-to-pair) by Maya Rosecrance and Sarah Connor.
1. Blog: [5 Tips for Effective Remote Pair Programming While Working from Home](https://tanzu.vmware.com/content/blog/5-tips-for-effective-remote-pair-programming-while-working-from-home)
1. Video: [I've Pair Programmed for 30,000 Hours: Ask Me Anything! — Joe Moore](https://www.youtube.com/watch?v=RCDfBioUgts)

## Related topics to Pair Programming
* [Agile software development](https://tanzu.vmware.com/agile)
* Test Driven Development
* Automate who pairs with whom with [Parrit](https://parrit.io/)