---
Date: '2020-07-22T09:00:00-07:00'
PublishDate: '2020-06-25T00:00:00-07:00'
aliases:
- /tv/springone-tour/5
date: '2020-06-07'
episode: '5'
guests:
- Josh Long
hosts:
- Bob Brindley
lastmod: '2020-10-09'
minutes: 120
register: https://springonetour.io/2020/reactive
title: Spring Tips and Reactive Spring - Day 1
twitch: vmwaretanzu
type: tv-episode
youtube: _LR0Cxnn-kw
---

See more at - https://springonetour.io/

**Day 1, Part I: Spring Tips: Configuration**

Hi, Spring fans! Spring is an inversion-of-control container. Inversion of control insulates objects from the knowledge of how a collaborating object on which they depend are created. It also insulates objects from their environment, letting them exist blissfully unaware of where individual configuration properties–like passwords, URLs, etc.–originate. In this talk, we’re going to explore the Environment which connects objects to configuration properties. We’ll also look at PropertySources, profiles, @ConfigurationProperties, the @Value annotation, the Spring Cloud Config Server and Spring Cloud Vault for HashiCorp Vault.

**Day 1, Part II: Reactive Spring**

Microservices and big data increasingly confront us with the limitations of traditional input/output. In traditional IO, work that is IO-bound dominates threads. This wouldn't be such a big deal if we could add more threads cheaply, but threads are expensive on the JVM, and most other platforms. Even if threads were cheap and infinitely scalable, we'd still be confronted with the faulty nature of networks. Things break, and they often do so in subtle but non-exceptional ways. Traditional approaches to integration bury the faulty nature of networks behind overly simplifying abstractions. We need something better.

Spring Framework 5 is here! It introduces the Spring developer to a growing world of support for reactive programming across the Spring portfolio, starting with a new Netty-based web runtime, component model and module called Spring WebFlux, and then continuing to Spring Data Kay, Spring Security 5.0, Spring Boot 2.0 and Spring Cloud Finchley. Sure, it sounds like a lot, but don't worry! Join me, your guide, Spring developer advocate Josh Long, and we'll explore the wacky, wonderful world of Reactive Spring together.