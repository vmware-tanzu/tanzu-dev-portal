---
date: '2022-01-19'
lastmod: '2022-01-19'
subsection: What is Reactive Programming?
title: What is Reactive Programming?
tags:
  - Programming Paradigm
  - Getting Started
  - Spring
  - Reactive
weight: 1
team:
  - Eric Standley
level1: Modern App Basics
level2: Modern Development Concepts
description: Learn what reactive programming is about.
---

## Basic Overview

In our modern software intensive world we are producing more and more data and we're producing it faster and faster. As developers we need to process that data quicker and more efficiently than we have in the past. Historically one of the most common and popular ways has been add more threads, however threads still take up resources and can still be sitting by idly by while there could be some work done if not tasked properly. Reactive programming attempts to help solve this problem by giving us the extra processing that threads give us but with out the huge management overhead that comes with them.

So after all that what truly is reactive programming? Well if you look around the internet the two most common ways of describing it are **asynchronous** and **declarative**, which while nice one word answers they don't really provide much explanation if you're new to reactive programming. What these are trying to get across is that reactive programming is a style of programming where you write code that is ignorant of the time and context in which the code itself is run, and the code runs in response to an "event". Note that in this case an event is any kind of "codable event" not an event from an event driven system, although the concept behind both is the same. One more important thing to note here is that reactive programming isn't the same as multi-threaded programming. This confusion happens because both reactive and threaded programming do things concurrently but threaded programming will also happen in parallel where as reactive programming doesn't mean things are necessarily done in parallel.

Let's go over two common real world examples that hopefully will help explain the idea of running out of time and context.
First let's relate this to actions we do in the real world.

- Lets say that you are a fan of a certain sports team, and that whenever they release a new piece of apparel you purchase it. To make sure you never miss out on a piece of apparel you subscribe on your team's social media page to get a notification when they release new apparel. In this example the code you write is equivalent to the action of buying the apparel, you don't know ahead of time when a new piece will be released, but when it does happen you know you'll buy it. Also like in this example with signing up on the social media page, when you code up what you want done you'll also have to tell whatever reactive framework you are using that you want to be notified.

- Now let's go over a common actual code scenario where we'd want to use this, a blocking I/O call. Let's say that your service needs to update it's database after making a REST call to service X for some data. In this case you would write the code to parse the returned data while doing whatever manipulations are need on it. Once you have that block of code you would then subscribe it to the "event" of returning from that specific REST call.

## Some Drawbacks

Well reactive programming can save us time and computing resources there are some drawbacks to using it. The most common is this type of code is difficult to debug. Due to the nature of writing smaller code blocks that then response to specific events makes it hard to figure out what went wrong during a process composed of multiple events. Since things are no long code as an singular code block it can be difficult to see what happened in past calls without a way to line things up. Also this way of programming requires a bit of a different thought process due to basically having to change how you think about time, or no thinking about things in relation to time.

## Further Learning

This was just a high level overview to attempt to explain the overarching idea behind reactive programming, there is much more to learn that is out there. Lastly "backpressure" is also a pretty important topic in the world of reactive programming, I didn't go into it here as this is meant to be an intro however if you are going to start using reactive programming it is something that you should defiantly look up. The following links could be helpful for you:

- [The Reactive Manifesto](https://www.reactivemanifesto.org/) a high level call to make systems more reactive with a good high level view of what's considered reactive.
- [The Reactive Principles](https://principles.reactive.foundation/) like the first link this isn't language specific but does dive into more depth about the reasons and how to's of reactive programming.
- [Jay Phelps: Backpressure: Resistance is NOT Futile](https://www.youtube.com/watch?v=I6eZ4ZyI1Zg) a good video going over what is meant by backpressure in a reactive system.
- [Spring Reactive](https://spring.io/reactive) our own Spring project that allows for easier reactive coding in Java.
- [RxJS](https://rxjs.dev/) a popular reactive framework for the Javascript language
- [ReactiveX](https://reactivex.io/) a cross platform framework for reactive programming
