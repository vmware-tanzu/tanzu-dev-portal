---
title: Observability
featured: true
weight: 1
description: >
    Observability allows developers and operators a better look into their applications, and can help pinpoint an issue when something goes wrong.
---

Observability is all about being able to answer questions. That question may be "why is this request slow?" or it may be "how many requests is this service receiving?". Worse, the question might be "why is production down?". To answer a question however, you need data. Observability is making sure that data is available when those questions come up.

Observability generally includes at least three concepts: metrics, logging, and tracing. Each of these is a tool in your kit for making sure your application is running how it should.

### Metrics

Software is rarely, if ever, as straightforward as "broken or not." When things do break, there is also a lot of context to be determined around why it's broken. A service could still serve requests, but due to an increased load it could be doing so at a much slower rate.

Metrics allow you to measure your applications and your infrastructure. Response time, request count, memory usage. These metrics, and more, are quantitative data that can be measured, monitored and alerted on. As you can imagine though, the sheer amount of data can quickly become overwhelming, with every aspect of your stack putting out potentially tens, hundreds, or even thousands of metrics. Knowing what metrics to monitor is just as important as collecting them. As with most things in software, the metrics that matter are often specific to your environment, but there are lessons to be learned from others. For example, Google discusses the "Four Golden Signals" in chapter 6 of their [Site Reliability Engineering book](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/):

1. **Latency:** How long does it takes to service a request?
2. **Traffic:** How much demand is being placed on your system?
3. **Errors:** How frequently are requests failing?
4. **Saturation:** How close are you to your known capacities of resources?

These "golden signals" are a good example of the type of data you should be paying attention to.

### Logging

It's easy to generate logs from your applications. In fact, it's so easy that one of the most common issues when collecting and analyzing logs is that there's way, _way_ too much to sift through. Chances are that no matter the language or framework you're working with, there's a way to generate logs. For example, in Java there's [Log4j2](https://logging.apache.org/log4j/2.x/), Go has the built-in [log package](https://golang.org/pkg/log/), and Node.js has the [console module](https://nodejs.org/api/console.html).

That still leaves gathering, sorting, indexing, and analyzing  your logs, which is no small task. This becomes even more important in the world of containerized workloads, where containers can start and stop in a matter of moments, taking the local logs with them. Similar to discussing metrics, there's a lot of ways to solve this problem, and it's important to find the right solution for your environment. If you're running on an application platform, it may automatically collect logs for you. IaaS providers may provide a service that you can send your logs to. You may even need to stand up your own infrastructure.

Logging can be thought to have three responsibilities: collection, indexing, and visualization. For those that do need to stand up their own solution, there's a wide ecosystem of open-source technologies that can be used. For example, the "EFK stack" ([Elasticsearch](https://www.elastic.co/), [Fluentd](https://www.fluentd.org/), and [Kibana](https://www.elastic.co/kibana)) is popular for solving this exact problem.

### Tracing

Many applications today are made up of several smaller services, meaning one request to your application might make several hops inside of your infrastructure. From the frontend, to backend services, to databases, there's plenty of reasons why a single request may take longer than usual to respond. Tracing follows requests through the infrastructure, measuring the performance and response time along the way. If a request takes 500ms, a trace can tell you that 480ms of that is a service that's seeing degraded performance.

Of these three topics discussed, tracing is generally the hardest to implement. While metrics and logging can somewhat rely on standards, such as writing logs to STDOUT or offering an open way of pulling metrics, tracing relies on instrumentation of every service. In a polyglot system, this means that your tracing solution of choice also needs to provide client libraries for each language.

There's a number of popular open-source solutions out there, including [Zipkin](https://zipkin.io/) and [Jaeger](https://www.jaegertracing.io/), so make sure to look around and see which solution fits your use case best.

### Putting It Together

There's quite a bit that's been covered here and you may be wondering where to start. If you have applications in production today, give some thought of what's giving you the most trouble. What sort of insight would give you the best idea of why your services aren't performing as they should? If you're in the process of creating a new service, what do you expect the problem spots may be?

Log aggregation can be a great first step that's may require little to no code changes, and setting up the EFK stack is a great first step. If you're a Spring developer, you can even [try out Wavefront for Spring Boot](guides/spring/spring-wavefront-gs/) for free. If you're looking to dig a bit deeper, you could even begin looking into getting started with Jaeger.
