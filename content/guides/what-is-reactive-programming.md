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

In our modern software-intensive world we are producing more and more data faster than ever before. As developers we need to continue to create methods to process that data quicker and more efficiently than we have in the past. Historically, one of the most common and popular ways has been to add more threads, however, threads still take up resources and can sit idly by while there is work to be done (if not tasked properly). Reactive programming attempts to help solve this problem by giving us the extra processing that threads give us but without the huge management overhead that comes with them.

So after all that, what exactly is reactive programming? Well, if you look around the internet, the two most common ways of describing it are **asynchronous** and **declarative**, which, while nice one word answers, don't really provide much explanation if you're new to reactive programming. What these terms are trying to get across is that reactive programming is a style of programming where you write code that is ignorant of the time and context in which the code itself is run, and is done in response to an event. Note that in this case, an event is any kind of "code-based event" and not specifically an event from an event-driven system, although the concept behind both is similar. Another important factor here is that reactive programming isn't the same as multi-threaded programming. This confusion happens because while both reactive and threaded programming do things concurrently, threaded programming will also happen in parallel, where-as reactive programming doesn't mean things are necessarily done in parallel.

Let's go over two examples, one real-world and one programming, that will help explain the idea of running outside of time and context.

- Let's say that you are a fan of a certain sports team, and whenever they release a new piece of apparel, you purchase it. To make sure you never miss out on a piece of apparel, you subscribe on your team's social media page to get a notification when they announce new apparel. In this example, the code you write is equivalent to the action of buying the apparel. You don't know ahead of time when a new piece will be released, but when it does happen, you know you'll buy it. Also, like in this example of signing up on the social media page, when you code up what you want done, you'll also have to tell whatever reactive framework you are using that you want to be notified.

- Now let's go over a common code scenario where we'd want to use this; a blocking I/O call. Let's say that your service needs to update its database after making a REST call to service X for some data. In this case, you would write the code to parse the returned data while doing whatever manipulations are needed on it. Once you have that block of code, you would then subscribe it to the "event" of returning from that specific REST call.

## Some Drawbacks

While reactive programming can save us time and computing resources, there are some drawbacks to using it. The most common is that this type of code is difficult to debug. Due to the nature of writing smaller code blocks that then respond to specific events, this makes it hard to figure out what went wrong during a process composed of multiple events. Since things are no longer coded as a singular code block, it can be difficult to see what happened in past calls without a way to line things up. Also, this way of programming requires different thought processes due to basically having to change how you think about time, or even not thinking about things in relation to time at all.

## Further Learning

This was just a high-level overview to explain the overarching idea behind reactive programming. There is much more to learn that is out there. From here, you should either start to experiment with a reactive framework in your chosen language or look up reactive streams and backpressure. While it isn't necessary to have a stream of data to do reactive programming, this use case is why reactive programming has become so important to today's programming landscape. One of the key issues with data streams is backpressure, which just means that there is more data coming in than the service can handle. Hopefully this intro has given you insight to see how the reactive programming model can greatly help in this situation. The following links all provide more information on how to implement reactive programming:

- [The Reactive Manifesto](https://www.reactivemanifesto.org/) a high level call to make systems more reactive with a good high level view of what's considered reactive.
- [The Reactive Principles](https://principles.reactive.foundation/) like the first link this isn't language specific but does dive into more depth about the reasons and how to's of reactive programming.
- [Jay Phelps: Backpressure: Resistance is NOT Futile](https://www.youtube.com/watch?v=I6eZ4ZyI1Zg) a good video going over what is meant by backpressure in a reactive system.
- [Spring Reactive](https://spring.io/reactive) our own Spring project that allows for easier reactive coding in Java.
- [RxJS](https://rxjs.dev/) a popular reactive framework for the Javascript language
- [ReactiveX](https://reactivex.io/) a cross platform framework for reactive programming
