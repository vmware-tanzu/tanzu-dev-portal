---
date: 2020-11-04
description: The importance of observability in distributed systems.
featured: false
lastmod: '2021-02-24'
patterns:
- Observability
tags:
- Microservices
- Observability
team:
- Scott Rogers
title: 'Under the Microscope: Software Observability in a Distributed Architecture'
weight: 1
---

It’s the day and age of mountains of microservices, running on various platforms, consuming multiple services from multiple providers. As applications become more and more distributed, they become more complex. Even splitting a monolith into multiple smaller microservices introduces several points of failure. What happens when the two services can’t reach each other over the network? What if one service relies on the other and it crashes? What about if the application slows to a crawl; where would you start looking to figure out why?

Rather than guessing and hoping, you can lean on properly instrumented [observability](/patterns/observability). Being able to aggregate logs and metrics, as well as trace a request as it flows through various applications and services, is as achievable as ever. No matter your language, framework, or platform of choice, chances are you have some great options.

But first, let’s talk about why you should care about observability.

## What Is Observability?

I think of observability as the ability to infer the correlation between (seemingly) disparate systems. That means bringing together metrics from many systems in a way that allows us to find answers to questions that speed up both MTTD (the mean time to detect an issue) and MTTR (the mean time to resolve an issue). By themselves, metrics such as CPU, memory, response time, error rates, and latency are valuable, but they will not pinpoint the cause of a service degradation. Bringing these metrics together, where we can quickly understand how they relate to one another, is the beginning of observability.

## Why Is Observability Important?

The interaction between software components is becoming more complex as infrastructure as code continues to mature. Containers, service meshes, and the use of orchestration make it increasingly difficult to troubleshoot performance issues. Being able to quickly understand how these systems are interacting without first having to define those relationships is the essence of observability.

Observability also moves the understanding of performance closer to the time of deployment. Observability is central to the ideas of DevOps, SREs, declarative [insert link here] deployments, etc. With observability, we see the performance of the service in real time, at the time of deployment.

## How Does Observability Differ from Traditional Monitoring?

First, let’s look back to when we had the mantra of “monitor everything.” While that sounded like a good idea, without correlation, monitoring everything doesn’t increase understanding, and in fact can make it more challenging to identify what’s impacting performance.

I used to lead incident response for a high-volume website. This was before containers, however, so whenever we launched a new architecture, it had a tiered architecture with web, app, and DB servers. We had everything monitored, but it wasn’t well correlated.

An issue once occurred in which we noticed that the web tier was responding slowly. Historically when the web tier slowed down, a rolling restart of the app servers would resolve it. However, on this day, as the automated script kicked off the rolling restart, we watched as response time slowed to the point that the site became unresponsive. When we dove into the slew of monitoring tools, we found that our database servers were all I/O-bound. We subsequently determined that when the app servers were starting up, they were opening several pooled connections to the database and executing certain queries to cache information at the app layer. The rolling restart of the app layer was leading to resource exhaustion on the DB layer. So we DoS’d our site.

Without observability, we were limited in our understanding of the underlying issue, which meant that we responded to the signal we best understood even though it was not causing the underlying problem. So, the steps we took to resolve the issue ultimately made it worse. True observability would have let us ask the question, “Where else in the system are we seeing anomalies?” That’s because while monitoring can help speed MTTD, observability can speed MTTR, by quickly correlating the signals with minimal effort.

Now that we have an idea of what observability is and why it is essential, let’s walk through how to achieve it.

## How Do You Achieve Observability?

To achieve observability, start by instrumenting services as much as possible. Doing so is easier today than ever before. Not only are there myriad commercial products available, there are handy open source products like Prometheus, Grafana, Zipkin, and others. There is no excuse for not instrumenting your systems.

Understanding the measurements in context is also critical, and requires a central place to ingest all of that telemetry, where correlation can occur. Correlating can mean different things, but at minimum you should be able to visualize data from other systems in a standard format.

Finally, you need to be able to quickly interrogate this mountain of data in order to identify the cause of performance issues. This capability is central to true observability. You need to be able to ask questions and get answers in real time. If you have to define the problems ahead of time and build indices, your questions may not be relevant to the specific issue at hand.

These steps assume the telemetry is flowing into a common platform, and that platform can visualize and make queries in real time. In my earlier example, all of the systems involved had some form of monitoring in place. Still, the correlation did not happen because they all flowed data to different destinations, which meant there was no one single place to discover what else might also be having an issue.

## How Do You Get Started?

You have a lot of options, both open source and commercial, that you can use to achieve observability. If you’re leaning toward the open source solutions, we’ve created guides for some of our favorites. If you’re looking to get started with gathering metrics, for example, make sure to check out [Prometheus and Grafana: Gathering Metrics from Kubernetes](/guides/kubernetes/observability-prometheus-grafana-p1/) as well as [Prometheus and Grafana: Gathering Metrics from Spring Boot on Kubernetes](/guides/spring/spring-prometheus/). If you’re more interested in tracing, we’ve published [Getting Started with Zipkin and Spring Boot](/guides/spring/spring-zipkin/). While many of these guides assume you’re working with Spring Boot, they also provide a lot of great context and lay the groundwork for transferring these ideas to other languages.

Finally, if you’re looking for a more all-in-one solution, check out how to [debug Kubernetes workloads with Octant](/blog/debugging-a-kubernetes-workload-with-octant) and learn about how you can use the free tier of [Wavefront for Spring Boot: Getting Started](/guides/spring/spring-zipkin/).