---
date: 2022-08-03
description: It’s true that these terms are well defined and widely used, the problem is that they each have many different formal definitions associated with them and many more informal definitions too.
lastmod: '2022-08-03'
team:
- Vitor Kneipp
title: How Might We Better Use Loaded Terms Like "Personas" and "Jobs to be Done"?
---

![alt_text](images/image2.gif "image_tooltip")


It’s true that these terms are well defined and widely used, the problem is that they each have many different formal definitions associated with them and many more informal definitions too. This leads us to inefficiencies in the ways we operate as we do not have a shared understanding of what is meant. Terms should flex to their use, and the onus is on the user of a term to define it, so I am going to attempt to describe what I believe to be useful uses of each, both in terms and concepts.

## The Concepts

My hypothesis is that [`Personas` ](https://www.aha.io/roadmapping/guide/product-strategy/how-should-product-managers-define-customer-personas)and [`Jobs to be Done`](https://jtbd.info/know-the-two-very-different-interpretations-of-jobs-to-be-done-5a18b748bd89) are so overloaded, that now they are only useful as concepts. Personas embody characteristics of a group of people - they can be demographically, skill based, socioeconomic, work based, and other things. When I use `personas` at Pivotal, I generally think of them as marketing personas - ways to represent a large group of people that have similarities in their work responsibilities. It is important to note that a persona is not a real person, and instead a generalization which of course obfuscates many traits that makes individuals… individual. Personas are useful ways over covering a lot of ground quickly, and of painting a high level picture of a customer, or better yet, an ideal customer. Personas are rarely if ever fully represented in the wild. 

Because [persona definitions](https://www.aha.io/roadmapping/guide/product-strategy/how-should-product-managers-define-customer-personas) tend to be so vague and gloss over those individual characteristics, I’ve noticed people become disappointed when they can rarely find real life embodiments of them. I believe this is a reflection of the misuse of the term, and concept, that is a persona. 

`Jobs to be Done` is no different. I interpret `Jobs to be Done` as `tasks that are completed`. That is to say, that to know what the `Jobs to be Done` are, one must consider what it would take to do whatever the end goal is. For example, when we talk about “platform operators” or “platform engineers” (personas), “running a platform” (an end goal), we evaluate what all of the things are that it takes to run a platform.

The thing about `Jobs to be Done` is that those jobs get divided and subdivided in many different ways by all sorts of people. To continue with our example, at some customers a “platform engineer” may be responsible for scaling Diego cells to accommodate more workloads as well as procuring and providing services to be available to “application engineers”. At other customers, the “application engineer” is empowered to or tasked with finding, procuring, and maintaining their own services. The job is the same, who does it is all that has changed.

For these reasons, I often find it very useful to couple both concepts. I find myself constructing personas with jobs. Say I compile a list of 100 jobs, or tasks, it takes to successfully operate a platform, a persona can be created out of those 100 jobs and I could represent each customer better by adding or subtracting the relevant jobs to each “persona” or “role” in their operations. 

## In Practice

Continuing with the example from above, let’s explore the person or people who are responsible for successfully running a platform through this combined viewport. 

If we use the [current persona of Alana](https://docs.google.com/document/d/15g8MB6yFyLHLSIvQXFaOS_9G79-HKem8twfwaRUY9_k/edit?usp=sharing) to start us off, we see that she is a representation of the (often) many people it takes to successfully install, run, monitor, update, and maintain a platform that is able to host workloads, so that a business may provide something to people willing to spend money, we can start to unpack Alana’s many jobs. A few of the things Alana may have to do are: procure VMs or servers, connect those, plan for capacity changes, interact with coworkers, interact with developers who will run workloads on the thing she is responsible to manage, and many, many more. These jobs tell us a lot about what Alana does, but they do not tell us a lot of useful information about what Alana is like. Alana might be overworked, so she is stressed out and very receptive to automation. Alana might also be in a siloed organization where she has a lot of responsibility, but works in isolation. 

These descriptors of who Alana is are helpful when we think about identifying problems she faces, solving those, and delivering solutions. The combination of what Alana does day to day, and also some information about what Alana feels, sees, hears, and says, all can help construct a robust picture of who Alana is relevant to what we can deliver to solve problems for her. 

![alt_text](images/image1.gif "image_tooltip")

Do all of those things sound like a lot to put on any one person? If you say no, seek help in reducing your workload. If you say yes, consider that while Jobs, or things someone does, are very granular, a persona is often generic and covers what multiple or even many people do and who many people are. It is imperative to remember that a persona is intentionally general and many vastly different actual humans, may fit aspects of a persona.

## The Dangers

So, what if we just use Jobs? Or just use Personas and forget about everything above? We would constantly be continuing to overload both terms, and contribute to the phenomenon of people using the same terms to talk about very different things. 

By adding a name to a persona, for example, it creates the opportunity for us as people to prescribe a lot of value judgements about who they are and what they do, that we convinced ourselves is the pretty full story. What we are being exposed to instead, is only a small slice. 

Conversely, if we only use Jobs, then we talk about a set number of things that a person, or many people, do. We do not appreciate who they are. Why is this dangerous? Because a key to delivering something valuable is understanding deeply what that person needs and who they are so we can best understand how to deliver it as well. 

## Why Not Both?

![alt_text](images/image3.gif "image_tooltip")

Is it possible that by leveraging these as complementary concepts, instead of adversaries, we can paint better pictures of our “customers”? I think so.

By combining the best aspects of jobs, or tasks, that need to be done to accomplish an objective as well as different non-task factors about it is _like_ to do those things for someone or some people, then we can arrive at something ultimately useful. 
