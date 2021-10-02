---
title: Secure Software Supply Chains
description: |
  Your ability to bring software to production consistently, reliably, and
  securely is the most critical component for bringing value to your customers.
  Here we explore the components that drive successful outcomes through mature
  software delivery practices.
weight: 1
featured: true
featuredspot: 3
duration: 60
experience: Beginner
layout: intro
team:
- Craig Tracey
aliases:
- "/patterns/deployment"
- "/outcomes/secure-software-supply-chain/"
oldPath: "/content/outcomes/secure-software-supply-chain/_index.md"
tags: []
---

## Key Concepts

- The software supply chain is the most critical component that stands between
  your ability to deliver value through software and your customers.
- There are no shortcuts. The same security standard that you enact for your
  production code needs to be implemented for your delivery mechanism as well.
- A supply chain is not a unidirectional construct. It is a closed-loop system
  that will enable you to quickly identify and remediate production failures.

## Outcomes

What we have heard from customers:

- “We need to be able to deploy code to our staging and production environments
  reliably every time”
- “The Security team continually scans our environment for vulnerabilities. When
  they discover a problem with our deployed code or one of its dependencies, we
  need to be able to remediate the problem within 24 hours.”
- “Our compliance requirements mandate that all of our software is validated
  during our build process and that it is built upon validated, secure images.”
- “We do not allow our developers to deploy containers directly from Docker
  Hub.”

## Summary

Delivering business value through software requires that an organization is able
to ship code to production consistently, reliably, and securely. This capability
enables the software organization to meet the immediate needs of their
customers. Whether this amounts to delivering software for the first time, or
reacting to a security vulnerability in a timely manner, consistency will create
better customer outcomes.

Unfortunately, for many organizations the primary development focus is often
centered on product features alone. Delivery systems are very often an
afterthought, usually implemented in an ad hoc fashion, and, as a result, become
a fragile component that stands between development teams and the customers
seeking to derive value from their work. When properly implemented, a secure
software supply chain has the ability to close this gap across the entirety of
your software portfolio.

A secure software supply chain is a term that refers to the full suite of
software that will move your code from a developer’s laptop, through source
control, and eventually onto production systems. This is not a one-way
transaction. This supply chain, when implemented properly, will become a
closed-loop system, whereby the same tools that will drive code to production
will also help to address critical production events.

There are a few basic tenets to consider when implementing a secure software
supply chain:

- Code is simply and consistently delivered to production. It is a natural and
  familiar extension of a developer’s workflow.
- New software is easily and consistently onboarded onto this delivery
  mechanism. There are no one-off delivery mechanisms. All code flows through
  this chain to production so that standards are continually maintained.
- The supply chain is not an opaque construct. Developers can easily interact
  with it, investigate delivery failures, and augment the system as needed.
- The software delivery mechanism is secure. As it is integral to the software
  itself, it adheres to the same security constraints. The organization may
  restrict actions through role-based policy, certify software artifacts, audit
  production system modifications, and address runtime vulnerabilities.

When most people think of software security, they often immediately consider how
software performs in a production setting. However, the process for creating
secure software begins long before your code is deployed.

There are 4 pillars for developing and deploying secure software:

- The code is thoroughly reviewed by project maintainers.
- All code has a standard suite of unit and/or integration tests that must pass
  before code can make it to production environments.
- Unit tests are an integral part of the code base.
- Tests should be run automatically on secure infrastructure and with the
  release candidate artifact.

Optionally, organizations may also choose to implement additional security
features within their software supply chain. Code linters, open source license
checks, automated vulnerability tests, and change management updates are all
common tasks that may also be incorporated into a software supply chain.

Getting code into production is the most obvious goal for a software supply
chain, but mature organizations implement this as a closed loop. Not only will
this system be used for new feature development and promotion to production, but
it will also allow operations teams to quickly identify and address
vulnerabilities.
