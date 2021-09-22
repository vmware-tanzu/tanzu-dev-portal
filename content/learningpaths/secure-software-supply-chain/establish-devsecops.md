---
date: '2021-05-11'
lastmod: '2021-06-15'
layout: single
team:
- Craig Tracey
title: Developing a DevSecOps Practice
weight: 1
oldPath: "/content/outcomes/secure-software-supply-chain/establish-devsecops.md"
aliases:
- "/outcomes/secure-software-supply-chain/establish-devsecops"
tags: []
---

Modern software delivery demands that we think differently about how we bring
code to production. Traditional methodologies typically took on a siloed
approach: a development team writes the code, a security team ensures that this
code adheres to organizational compliance requirements, and operations teams
maintained the availability of the running service. While this organization of
specific roles often met the demand for bringing code to production, it suffers
from a number of drawbacks.

First, it was often slow. With different groups all involved in bringing code to
production, responsibilities were often serialized. Once the code is ready, the
security team takes a look. And then, once the security team blesses the
release, an operator can deploy and maintain it. Yes, these teams could
multi-task, and begin the next body of work while their current release
candidate was being validated. But, this is typically not an efficient process.
In practical terms, it introduces disruptive context switching, but it also
means that these teams are not working collaboratively towards a common goal.

Because these teams each have different objectives, friction often develops when
attempting to achieve outcomes. Development teams are often blindsided by
unclear or poorly understood security requirements, operations teams do not
usually have nuanced understanding of the code to effectively operate it, and
security teams struggle to keep the business secure in the face of rapidly
evolving technical requirements.

While Secure Software Supply Chains are primarily a component of getting code
into production, they are also an opportunity to reduce the friction between the
various stakeholders attached to software development efforts. When implemented
properly, each part of the organization will be working together towards the
common goal of delivering customer value through software delivery.

## Changing Responsibilities

Members of a development organization will still maintain their respective areas
of expertise, but they will now be asked to work more collaboratively towards
this common goal of bringing code to production. Instead of serialized tasks,
within DevSecOps each of these groups are working together in parallel. Needs
and solutions are clearly communicated on a regular basis. And, because these
lines of responsibility are becoming blurred, members can come to shared
understandings of how the system works through code. After all, they are now
working as one team.

### The Platform Operator

The role of the SRE or platform operator shifts from one of being primarily
focused on system availability to one where the operator is an integral part of
the development process itself. While the application teams will be focused on
new feature development, SREs will focus on the reliability of the whole system.
This will require new and different skills from that of a classic system
administrator role. Instead of a simple restart of a service, an SRE will now be
analyzing performance metrics, debugging defects, and helping to build plans to
ensure data integrity.

Platform operators need to be involved from the beginning in order to develop
fault-tolerant systems. Their broad infrastructure expertise will help to inform
key code decisions during the design and development phases. Determining backup
and recovery needs as well as how to ensure the high-availability of systems are
just some of the tasks that require operator involvement.

Maintaining the supply chain will require the development of cross-cutting
functionality: pipelines and tools that are suitable for all development teams.
This may include implementation of common frameworks for business continuity,
systems that enforce transparent security, and general infrastructure
management.

### The Security Engineer

The role of the security engineer, similar to that of a platform engineer,
evolves into one that is closely aligned with their development partners.
Instead of acting as a gate to production, they are now engaged with the
development teams from the start. The goal is to ensure that security
requirements are implemented from the beginning. And, these requirements are no
longer defined by spreadsheets and quickly-dated documents, but where possible
they are defined by code and continuously verified. This code will make crystal
clear, to anyone who would like to ship new code to production, the security
requirements that are expected to be adhered to.

Modern platforms provide for shared mechanisms of policy enforcement. This may
include everything from how infrastructure is deployed and refreshed to clearly
outlining which software dependencies a development team is cleared to use. With
a DevSecOps mindset, security engineers are helping to define these policies,
but more importantly, help to implement these policies through code. Sometimes
that code will be implemented as simple configuration data, but there is also
the expectation that security teams will engage on the product's code itself;
advising on items like dependencies, user identity flows, and similar types of
needs.

### The App Developer

Within DevSecOps the application developer's role still consists, primarily, of
bringing new software to customers. However, the scope of their work grows.
Instead of being squarely focused on new features, or even addressing bugs,
their scope needs to include tasks that will help to establish and maintain the
security of their software pipelines. 

The software delivery pipeline requires the same degree of diligence as the
product itself. After all, this is the component that stands between your
development teams and customers realizing value through your code. Without this
robust capability, new code will never make it to your customers.

Developers will need to be involved in the development of unit and integration
tests that exercise their code in ways that will mimic real-world use. Likewise,
they will be a critical part in ensuring that all of the components in their
software artifacts are up to date and secure. And, as they are typically closest
to the data requirements of the software, they will need to play a critical role
in developing disaster recovery requirements with their Security and Operations
counterparts.