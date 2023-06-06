---
Date: '2023-05-16T11:00:00-07:00'
date: '2023-05-16'
Description: Reactive and Imperative Context Propagation in Spring Applications
title: Reactive and Imperative Context Propagation in Spring Applications
PublishDate: '2023-04-04T00:00:00-07:00'
episode: '31'
explicit: 'no'
calendar: true
guests:
- Dariusz Jędrzejczyk
hosts:
- Cora Iberkleid
twitch: vmwaretanzu
youtube: 6OKS36PSpho
type: tv-episode
---

Applications have relied on contextual data that is outside of core business logic for a long time to provide vital insight into what the application is doing. Traditionally, Java applications built on the ThreadLocal construct to aggregate meta and observability information. With the introduction of asynchrony to the processing, it became easy to lose the precious, contextual data.

After providing the background behind current design and implementation of context support in Project Reactor, we’ll move to practical aspects that Spring application developers face. We’ll introduce a new Context Propagation library under Micrometer, which provides new and essential capabilities for bridging reactive and imperative programming styles. Reactor 3.5 has dedicated support for interacting with these concepts.

Next, we’ll cover how Reactor uses Micrometer 1.10’s Observation feature to provide metrics, tracing, and logging and how library implementers can take advantage of these patterns.