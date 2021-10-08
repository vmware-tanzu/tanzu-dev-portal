---
title: Cloud Native Development in Practice
weight: -1
layout: intro
description: |
    Build a Cloud Native App.
    Run it on VMware *Tanzu Application Service* (TAS).
    Scale it on TAS.
    Then evolve it to Microservices.
team:
  - VMware Tanzu Labs
duration: 1800
experience: Intermediate
tags:
- All Roles
- Applications
---

## Why is this learning path important?

This learning path will take you on a journey of building a
greenfield web application from scratch,
getting it to run on a modern cloud native platform,
and how to deal with it after it goes to production.

If you have not yet completed the
[Cloud Native Application Development with Spring](../cloud-native-development/) learning path,
complete that first.

**This series takes the concepts you learn in the**
**[Cloud Native Application Development with Spring](../cloud-native-development/) learning path**
**and applies them to a specific application context and**
**codebase.**

In this learning path you will build a greenfield Spring Boot
application and deploy it on *Tanzu Application Service* (TAS).

Then you will run it and maintain it in production.

You will gain an understanding of how *Tanzu Application Service*
platform works,
how its container orchestration compares to Kubernetes,
and will recap some fundamentals of Spring and Spring Boot along the
way.

You will also apply some of the previous concepts such as
[Cloud Native Development](../cloud-native-development/),
[Test Driven Development](../application-development/test-driven-development/)
and
[*Continuous Integration* and *Continuous Delivery*](../../guides/ci-cd/ci-cd-what-is/).

## Who is this learning path for?

This learning path is for software engineers and architects who wish to
gain a deeper understanding of modern Cloud Native Platforms and how
Spring Boot applications run on them.

## Learning outcomes

After completing the learning path, you will be able to

-   Demonstrate the ability to build greenfield, cloud native
    applications using Java, and Spring Boot
-   Use *Tanzu Application Service* for web application deployments
-   Discuss the pros and cons of moving a monolith to a
    microservice-based architecture
-   Describe the steps to move from a monolith to a microservice-based
    architecture
-   Explain how to implement common distributed systems patterns to
    mitigate costs/limitations on an existing microservices-based
    codebase

----

## The Cloud Native Developer

{{< table "table" >}}
| Lesson | Intro | Lab | Wrap |
| ------- | ---------- | ---------- | ---------- |
| Prerequisites | | [Lab](./prereq/) |
| Introduction | [Why?](https://docs.google.com/presentation/d/16TP2QgOiYvU6ZcOJ1nhha2UlgETdR2AoO5mXiMCdsFE/present) | [Lab](./intro/) | [Concepts](https://docs.google.com/presentation/d/18XyFmx1SoHU03arGPNVNfplJDxEKSi6dXdl5U_Atylk/present#slide=id.ge9c23810de_0_0) |

### Build a greenfield app

{{< table "table" >}}
| Lesson | Intro | Lab | Wrap |
| ------- | ---------- | ---------- | ---------- |
| Initialize an app | | [Lab](./spring-boot-app-build/) | |
| Deploy it | [TAS Push](https://docs.google.com/presentation/d/1J5pgV7DvHMcdTzg_ndIXtS-NgIXF-nreTDefjHSOlyY/present#slide=id.gb53c81140d_0_61) | [Lab](./spring-boot-app-deploy/) | [TAS Staging](https://docs.google.com/presentation/d/1gWulATqi0WvV7SUEbAK3qVbNW80Y2pplsCD4NGy-fFE/present#slide=id.ge70b517444_0_0) |
| Configure it |[Environment](https://docs.google.com/presentation/d/1Sy5EvqCLPHSv1zJ8NyPyza4oAANn1qxYCeiyJclQgZ0/present#slide=id.ge9c860dbf9_0_0) | [Lab](./configure-app/) | [TAS Environment](https://docs.google.com/presentation/d/1s8bT9cpfMWXluYkCZHVUB9jKUmfG-ODzj2P1nZsBVaY/present#slide=id.ge9c860dc14_0_0) |
| Pipeline |[Routing](https://docs.google.com/presentation/d/1pAL1pL-KtQT4RUiAE4DdeFedzW-9U1V9Joq2hiukzho/present#slide=id.gb53c81140d_0_51) | [Lab](./pipelines/) | [Route Names](./route-naming/) |
| Build a REST app |[Web Apps](https://docs.google.com/presentation/d/17UWVwjWNjP3H0i8jCXybCyB7qC_N7gesq3vCj1aUsag/present#slide=id.gd58f40471a_2_0) | [Lab](./spring-mvc/) | |
| Backing Services & Database Migrations |[Services](https://docs.google.com/presentation/d/1I0PCgsBnsbz_EOfWSpNhcdb73xCd-Zj1g-h3IGe3ox4/present#slide=id.gae083b4822_0_215) | [Lab](./database-migrations/) | [Migrations](https://docs.google.com/presentation/d/15DO2A_raKVbPh7qGjXQ9Hi79NFwZdsImHu04jNlsC54/present#slide=id.gae083b4822_0_14) |
| Data Access | | [Lab](./jdbc-template/) | |

### Run it in production

{{< table "table" >}}
| Lesson | Intro | Lab | Wrap |
| ------- | ---------- | ---------- | ---------- |
| Health Monitoring |[App Ops](https://docs.google.com/presentation/d/142gpNZqTNHT3YcaOB3pJeXUM9Q8BrwULmoKwJ344RuM/present#slide=id.ge9cac6b3d8_0_0) | [Lab](./health-monitoring/) | |
| Logging | [Logs](https://docs.google.com/presentation/d/1XiqxrGlLZ-OccP7HX7DoLn39xvq86NhWbBvgTrAyGRw/present#slide=id.ge9cac6b442_0_0) | [Lab](./logs/) | |
| Harden your app || [Lab](./harden/) ||
| Availability |[Availability](https://docs.google.com/presentation/d/1FmUnMpbKKqnIH0y4CxDjB7Vzn7nY0hiGaWngYN6F1oU/present#slide=id.ge9cac6b40d_0_0) | [Lab](./availability/) ||
| Scaling |[Scaling](https://docs.google.com/presentation/d/1CAHQc2DPZHGGoS7cyYkzSchQgDQsd4UKg_olQs6LpUk/present#slide=id.ge9cac6b4b4_0_0)| [Lab](./scaling) ||
| Zero Downtime Upgrades |[Blue/Green](https://docs.google.com/presentation/d/1XeACqEoDSpII-nKpQhbE_6RbXGNCCFP-ivwIBmdXCyE/present#slide=id.ge9cac6b512_0_0) | [Lab](./rolling-upgrades/) ||

## Evolving your app

{{< table "table" >}}
| Lesson | Intro | Lab | Wrap |
| ------- | ---------- | ---------- | ---------- |
| Application Evolution | [App Continuum](https://courses.education.pivotal.io/appcontinuum) | | | |
| Deploy a Distributed System |[Intro](https://docs.google.com/presentation/d/1IFXGBBBHKGJcS9mEWHaPodUXYq9hVEjiUXPSv6MTWyg/present#slide=id.ge9cac6b4e4_0_0) | [Lab](./deploy-distributed-system/) | |

## Advanced topics

{{< table "table" >}}
| Lesson | Intro | Lab | Wrap |
| ------- | ---------- | ---------- | ---------- |
| Service Discovery and Client Side Load Balancing |[Concepts](https://docs.google.com/presentation/d/14P89lCFrS5Jcql1HA1lxrspMUGKnsc8R1VOQWcMUPLs/present#slide=id.ge9ceda5589_0_0) | [Lab](./service-discovery/) | [Implementations](https://docs.google.com/presentation/d/1DncxQ8_EXbhUO284pnojaC7Z_DYnGIQ5AaU8OulUrMM/present#slide=id.ge9ceda5589_0_0) |
| Fault Tolerance |[Concepts](https://docs.google.com/presentation/d/1rErojSPHhbDNnOnFKLvrchwLcF4_lhH_Jri2QWG_rTc/present#slide=id.ge9ceda5682_0_0) | [Lab](./fault-tolerance/) | [Implementations](https://docs.google.com/presentation/d/11jngtQWW23wmnwl_Bmt7DWpEaxIEZPLgCfcaMue9tY4/present#slide=id.ge9ceda5682_0_0) |
| Architecture Styles |[Intro](https://docs.google.com/presentation/d/1fq0pnLTkSSXg9WF0y0IVVeqSm3bYPWoaF7EVcEQscQY/present#slide=id.ge9ceda56f4_0_0) | [Lab](./arch-styles/) | |
| Securing a Distributed System |[Intro](https://docs.google.com/presentation/d/1arad8h_mRiX_NAbUC8hx7qeZAHeTKTU5y88yPbNYRqg/present#slide=id.ge9ceda571c_0_0) | [Lab](./security/) | |
| External Configuration with Backing Services |[Concepts](https://docs.google.com/presentation/d/1Bo4KkHS0830-qbZV5d_TmbBdnbWuHSotVHAuUEFD_8c/present#slide=id.ge9cf28d82d_0_0) | [Lab](./external-config-backing-service/) | [Implementations](https://docs.google.com/presentation/d/1W6slax9Hu0tbbHrqlAVI4IlOegAuK-Dqxow182Hh37M/present#slide=id.ge9cf28d82d_0_0) |
| API Gateways - coming soon |

## Keep learning

[Reference List](./references/)
