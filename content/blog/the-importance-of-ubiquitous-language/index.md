---
title: The Importance of Ubiquitous Language
description: ipsum sorem
date: '2022-12-05'
slug: ubiquitous-language
tags:
- Tanzu
- CI-CD
team:
- Greg Ball
---
Good communication is one of the hardest things to be effective at. In relationships, in business, in teams, communication has and continues to be at the top of the list when it comes to what makes good ones, or bad ones.  One of the secrets to effective communication within a software product team can be found in a language that is **_ubiquitous_**.  

> <span style="font-size: 50px; line-height: 50px">Ubiquitious</span>
> <br/>
> &nbsp;&nbsp;[yoo-**bik**-wi-_tuhs_] *adjective*
> 
> &nbsp;&nbsp;&nbsp;&nbsp;present, appearing, or **found everywhere**

How can a "ubiquitous" language help how we talk to our teams, our users, and our stakeholders?  What do we need to do to discover it, and how should it be used to be most effective?  Before we dive into the answers to these questions, let's start with the basics.

## What is Ubiquitous Language?
Ubiquitous language is a shared set of unambiguous vocabulary shared by all members and stakeholders of a product team.  Eric Evans talks about this in his book [Domain Driven Design: Tackling Complexity in the Heart of Software](https://www.amazon.com/gp/product/0321125215). For those working on a balanced team, this means that the PM(s), Designer(s), and Engineer(s) use the same terminology to talk about their product, and that same language is used to talk to end-users and stakeholders.  What makes this language ubiquitous is that it is truly **found everywhere**.  According to Evans, the language should be based on the Domain Model of the software itself.  This forces a one-to-one correlation between things like domain objects in the code, which does not cope well with ambiguity, and the language used to communicate those requirements to end users, language that left on its own could be highly ambiguous (duck for example).  

Some other characteristics of ubiquitous language are:
    
* terms have a single meaning within a given context(no exceptions)
* agreed upon by stakeholders, but not unilaterally defined by them
* evolves over time
* consists of domain terms, not technical ones 
  *  ("linked list", "hashmap", and "singleton" aren't used alot outside of computer science)

There are a lot of "rules", so to speak, to defining and maintaining a ubiquitous language.  You may be asking yourself, "Why go through the effort?" In order to answer that question lets dig into how this could help you and your team deliver better outcomes to your users.

## The importance
So why is it important that we all speak the same language?  For decades, huge organizations have adopted the "waterfall" mentality of distilling a business domain into a set of requirements by requirements writers, which were then interpretted by architects to develop high level architectures, which were then translated by senior software engineers into lower level software designs, which were then interpretted and implemented by software engineers on a number of teams throughout the organization.  Some domain terms made it from the requirements into the sofware but some didnt.  The problem of this model arises when there is an expectation of bidirectional communication.  The reality we live in is that software development isnt as simple as requirements to architecture to design to code. In order to build software, especially in an "agile" or "lean" manner, we give power to the "lower" levels to question or ask for clarity on the "higher" ones.  In order for this to happen effectively, individuals must communicate.  That communcation goes a lot more smoothly if the words that the engineers are using at the lowest level have the same meaning as those interpretting the business domain to write requirements, or the more agile accepted term, stories.

Let's use an example to illustrate what we are talking about.  Let's say that our team is writing a shopping application.  I know for those that read a lot of technical articles, this feels like a cop-out example, but there is a reason that it is so frequently used.  Let's say that our business analysts talk to the customer and write a single requirement that says something along the lines of:

> As a shopper, I want to be able to add products to my shopping cart, so that I can continue shopping until I'm ready to checkout

The architect may then make some high level architecture decisions:
* A shopping cart should be implemented as a List of items that are comprised of a product and quantity
* A shopper is an authenticated user

In order to streamline this communication as much as possible we need to remove all unnecessary translations.  There is no reason why a shopping card in the business domain has to be called a list when written in the software.  