---
title: This is Part 2
weight: 2
layout: single
---

Traditional methods of software delivery typically consisted of deploying an application binary or script with any necessary metadata or configuration data to one or more servers. While standards for where and how these components should be configured within a server, there was little in the way of standardization beyond that. Dependencies were sometimes managed at the operating system level or perhaps were sandboxed for the application through mechanisms such as Python virtual environments or Ruby Gemfiles. Many times these deployments relied on fragile configuration management systems that acted on a large corpus of complex metadata.

In the case of small, one-off applications, where a single application is deployed to a single host, these techniques were often sufficient. But as the complexity of systems increased with the addition of new features, interconnected systems, or even just scale, these configuration management tools began to quickly surface their shortcomings.

Application developers seeking to achieve economies of scale by way of co-locating applications on servers were suddenly met with a dilemma: How do I ensure that an application is suitably isolated from other applications situated on the same server? The answers were often not obvious and ultimately led to broad adoption of containers.

## Containerized Workloads

The primary benefit of the move towards containerized workloads is that code may be delivered to production environments, immutable and complete with all of its software dependencies, as a single, auditable artifact.
