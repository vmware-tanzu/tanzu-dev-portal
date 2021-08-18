---
date: '2021-06-15'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Cloud Native Development
weight: 70
tags:
- 12 Factor
- Culture
- Cloud Native
- Architecture
---

Cloud Native is at the heart of modern application development endeavors. Used to depict engineering practices and state of the art applications, the term "cloud-native" is omnipresent and often misunderstood. There is a good chance that anyone you ask will provide a different definition.

![Cloud Native Development](/images/outcomes/application-development/cloud-native-development.jpg)

## What you will learn

In this article, you will learn to:

- [Define one meaning of cloud native](#meaning)
- [List three major outcomes of cloud native](#outcomes)
- Explain the main cloud native concepts for the following:
	- [application architecture](#app-archi)
	- [software life-cycle](#sw-life-cycle)
	- [supporting infrastructure](#support-infra)
	- [team culture](#culture)
- [Identify the twelve factors of cloud native applications](#factors)

------

## Define one meaning of cloud native {id=meaning}

>  “Cloud is not a place; it’s a way of doing IT” - Michael Dell

There are many definitions for cloud native. The definition we use in this article is an approach to building and running applications that exploit the advantages of the cloud computing delivery model. At its heart, cloud native is structuring teams, culture, and technology to utilize automation and architectures to manage complexity and unlock velocity.

Cloud native development, often referred to as modern application development, defines how applications are created and deployed. It does not define where the deployment occurs. For example, [public cloud](https://www.vmware.com/topics/glossary/content/public-cloud), [private cloud](https://www.vmware.com/topics/glossary/content/private-cloud?SRC=WWW_US_GP_public-cloud_SiteLink), [hybrid cloud](https://www.vmware.com/topics/glossary/content/hybrid-cloud?SRC=WWW_US_GP_public-cloud_SiteLink), [multi-cloud](https://www.vmware.com/topics/glossary/content/multi-cloud?SRC=WWW_US_GP_private-cloud_SiteLink).

## List three major outcomes of cloud native {id=outcomes}

Organizations that adopt cloud native practices and technology generally report the following outcomes:

1. More efficient and happier teams. Big problems are broken down into smaller pieces for more focused, efficient and responsive teams.
2. Higher degree of automation, more determinism, less drudgery and less manual work. Infrastructure is self-healing, self-managed, and available as self-service.
3. Increased non-functionalities for application landscape: improved reliability, portability, deep security, higher efficiency, and in-depth observability.

## Explain the main cloud native concepts {id=concepts}

Cloud native concepts are numerous. The following ones are the most common. They are sorted by their context:
- [application architecture](#app-archi)
- [software life-cycle](#sw-life-cycle)
- [supporting infrastructure](#support-infra)
- [team culture](#culture)

### Application architecture {id=app-archi}

{{< table "table" >}}
| Concept | Definition | 
| ------- | ---------- |
| Twelve-factor application | A set of [twelve principles and practices](https://12factor.net/) that developers follow to construct applications optimized for modern cloud environments. Those twelve factors are often used to determine how well an application leverages cloud native technologies.
| Microservice architecture | A software architectural style that functionally decomposes an application into a set of loosely coupled services. It is prevalent within companies craving greater agility and scalability. The microservices model is an alternative to traditional monolithic software consisting of tightly integrated modules that typically ship infrequently and scale as a single unit.  Microservices are not silver bullets, their drawbacks and benefits should be carefully weighed before use. |
| Cloud Native Patterns | A catalog of reusable solutions to recurring problems occurring in cloud native applications. Each pattern describes an architectural problem, its solution, and implied benefits, and drawbacks. |
| Domain-Driven Design | A software development philosophy that encourages thinking in business domains at each step of the process: discovery, architecture, and design. [Domain-Driven Design (DDD)](https://github.com/ddd-crew/welcome-to-ddd) comprises a variety of practices (for example, Event Storming) and concepts (for example, Bounded Context), while infusing a common "ubiquitous" language for better collaboration and alignment between business people and software engineers. DDD is not an all-or-nothing deal. You can apply the ideas from DDD as much or as little as you feel is beneficial to the project you're working on. |
|  |  |
{{< table />}}

### Application life-cycle {id=sw-life-cycle}

{{< table "table" >}}
| Concept | Definition | 
| ------- | ---------- |
| DevOps | A collaborative mindset consolidating practices, cultural philosophies, tools, and patterns designed to break down the organizational barriers between development and operations departments along application life-cycles. Breaking down silos empower organizations to:<br/><br/><ul><li>Deliver new features faster and more often in production.</li><li>Have a more reliable operating environment.</li><li>Improve communication and collaboration.</li></ul>With an initial focus on software developers and operation engineers, DevOps has quickly evolved to include other departments and functions: security (DevSecOps), finance (FinOps), network (NetOps), and business.
| CI/CD | Combines the practices of continuous integration and either continuous delivery or continuous deployment. CI/CD bridges the gaps between development and operation activities and teams by enforcing automation in building, testing and deployment of applications. These automated and connected steps are often referred to as a (CI/CD) pipeline. |
|  |  |
{{< table />}}


### Supporting infrastructure {id=support-infra}

{{< table "table" >}}
| Concept | Definition | 
| ------- | ---------- |
| Container | A standard unit of software that packages code and all its dependencies so the application runs quickly and reliably from one computing environment to another. Containers are typically lighter weight than full systems. They make applications more atomic and portable across environments.
| Container orchestrator | Automates container life-cycles from deployment and scaling, to more advanced management operations. While tools such as Docker create images and run containers, you also need tools to manage them. When operating at scale, a container orchestrator like   [Kubernetes](https://kubernetes.io/) is essential to manage common orchestrator tasks such as (anti) affinity, failover, health monitoring, networking, rolling upgrades, scaling, scheduling, and service discovery .. |
| Service mesh | A dedicated infrastructure layer facilitating service-to-service communications between services or microservices, using a proxy.  [Istio](https://istio.io/)  is an example of a service mesh framework. It simplifies observability, traffic management, security, and policy. |
| Immutable infrastructure | An infrastructure paradigm in which servers are never modified after being deployed. If something needs to be changed, updated, or fixed, new servers built automatically with the appropriate changes are provisioned to replace the old ones. In a traditional mutable server infrastructure, servers are continually updated and modified in place. |
| * as a Service | Infrastructure (IaaS), Container (CaaS), Platform (PaaS), Function (FaaS) or Software (SaaS) as a service are categories of cloud computing services. They provide APIs to manage on-demand life-cycles of the corresponding abstraction layers: virtualized infrastructures, containers, application platforms, functions or external software. |
|  |  |
{{< table />}}


### Team culture {id=culture}

{{< table "table" >}}
| Concept | Definition | 
| ------- | ---------- |
| Generative culture | As defined by professor and sociologist Ron Westrum, leaders in a generative company culture emphasize the importance of accomplishing the organization’s goals and missions on-time, rather than on personal gain or rules. New ideas are welcome. Members are proactive and focused on getting information to the right people by any means necessary. In essence, when it comes to cloud-native culture, what we are talking about is being generative. |
| Psychological safety | A state of well-being where team members feel safe to take risks and be vulnerable in front of each other. According to internal  [research ](https://rework.withgoogle.com/blog/five-keys-to-a-successful-google-team/) by Google, psychological safety is the most important characteristic of high performing teams. |
| Permit to fail | Psychological safety gives teams permission to fail. The goal is to accept errors as part of the realm of possibility and use it to learn and improve. Failures and accidents are seen as opportunities to improve, not witch-hunts. Errors are subject to honest post-mortem, and risks are shared. |
| Lean experimentation | Lean experiments are a highly effective way to formulate and validate hypotheses about a software product. They are conducted purposely to fail, to gain deeper insights about possible future iterations of a product. |
| Play | Playing loosens boundaries while sky-rocketing team motivation and commitment. It could take the form of chaos engineering featuring [Netflix’ Monkeys](https://github.com/Netflix/chaosmonkey/), a “Capture the Flag” security game, a wheel of misfortune disaster role-play exercise, or a [ChatOps](https://www.atlassian.com/blog/software-teams/what-is-chatops-adoption-guide) bot. |
| Growth mindset | Embraces learning while strengthening beliefs that you can control and improve abilities. It envisions challenges and failure as opportunities to grow personally and values constructive feedback. Especially in IT, where change is the only constant, perpetual learning is a growth mantra. |
| Learning organizations | A company that facilitates the learning of its members and continuously transforms itself. The core benefits offered by being a learning organization is a competitive advantage. |
|  |  |
{{< table />}}


## Identify the twelve factors of cloud native applications {id=factors}

Cloud native app development has centered around the twelve factors originally described by the team behind the Heroku platform. The  [eponymous website](https://12factor.net/)  provides a great understanding of how a cloud native application deals with things like logging, application state, and integration with external systems.

Sometimes it is enough to refactor and update an existing legacy application with only a handful of these factors in order to get it running on a cloud platform like Tanzu, gaining the operational benefits of the platform without the large investment of a far-reach modernization effort. Pay specific attention to externalizing configurations, converting integrations into backing services, keeping your processes stateless, and logging to standard input and output.

For more information on cloud native apps check out the free e-book [Beyond the 12-Factor App](https://tanzu.vmware.com/content/blog/beyond-the-twelve-factor-app), by Kevin Hoffman. In it, he introduces three additional factors including API-first development, security, and telemetry not covered in the original set, but are often required for apps to run well in the cloud.


## In this article, you learned to:

* Define the meaning of cloud native
* List three major outcomes of cloud native
* Explain the main cloud native concepts
* Identify the twelve factors of cloud native applications


## Keep learning

To deepen your understanding, check out the following resources:

#### Cloud Native
* [What is Cloud Native? ](https://tanzu.vmware.com/developer/guides/microservices/what-is-cloud-native/) - VMware Tanzu Developer Center article
* [How to think Cloud Native?](https://tanzu.vmware.com/content/white-papers/how-to-think-cloud-native) - Whitepaper by Joe Beda
* [Cloud Native Computing Foundation (CNCF) ](https://www.cncf.io/) - Home page of an organization aiming to advance cloud native and container technology while aligning the tech industry around their evolution.
	* [CNCF definition of “Cloud Native”](https://github.com/cncf/toc/blob/main/DEFINITION.md) - GitHub 
	* [CNCF Cloud-Native Trail Map](https://raw.githubusercontent.com/cncf/trailmap/master/CNCF_TrailMap_latest.png)  guidance for enterprises beginning their cloud-native journey - Image
* [Difference between Cloud and Cloud Native discussed by Kubernetes founders Craig McLuckie and Joe Beda](https://youtu.be/I0p8MIezKkE) - YouTube video

#### Concepts

* [Beyond the Twelve-Factor App](https://tanzu.vmware.com/content/blog/beyond-the-twelve-factor-app) - e-book
* [Microservices: How to deliver scalable software, faster](https://tanzu.vmware.com/microservices) - VMware Tanzu article
* [Cloud Native Patterns by Cornelia Davis](https://www.manning.com/books/cloud-native-patterns) - Book
* [Domain-Driven Design Crew](https://github.com/ddd-crew) - GitHub hot spot for the DDD community