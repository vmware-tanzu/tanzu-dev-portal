---
title: 'Kubernetes Operators: Should You Use Them?'
description: A discussion of the up-front engineering costs associated with using
  Kubernetes operators, and when you should make the investment.
date: '2021-07-02'
tags:
- Kubernetes
team:
- Rich Lander
---

Kubernetes is the leading trendsetter in the future of autonomous software, having made it possible for companies throughout the world to experience a tremendous reduction in human toil when it comes to all types of software management and deployment. 

Kubernetes has a reputation for being a complex software system with high startup costs and an intense learning curve, yet it remains steadfastly popular among companies that made the initial investment and immediately started reaping the benefits of improved efficiency and effectiveness in delivering automated, on-demand software that accelerates time-to-value.

Many of the companies that made the lucrative decision to choose Kubernetes as a distributed software system to manage their applications quickly recognized the value of expanding the power of their Kubernetes ecosystem through Kubernetes operators that reduce operational toil in platform services and tenant workloads. 


## Reduce operational toil with Kubernetes operators

You can leverage Kubernetes operators to accomplish all types of automated tasks, including software deployments, management, troubleshooting and updates through custom resources to define the state of the system, and custom controllers to reconcile the existing state of the system with the desired state of the system defined in the custom resource. 

There’s also an impressive assortment of Kubernetes operators developed by contributing members of the Kubernetes community that are freely available. For more information, see [OperatorHub](https://operatorhub.io/).

Kubernetes operators use level-triggered logic to bring about the desired state that you defined in custom resources by continually looping through the system until it is able to reconcile the desired state. A Kubernetes operator never quits working until it completes its directive. For example, when a Kubernetes operator encounters an unexpected condition, it doesn’t crash or fail, but stays-on-course, continually looping until the condition is remedied and it is able to successfully accomplish the desired state.


## Is the upfront engineering effort to learn kubernetes worth the cost?

The upfront cost for building Kubernetes operators is the engineering effort that it’s going to take to learn Kubernetes and to build the software that will extend its control plane. The cost for the engineering effort is going to vary, depending on the Kubernetes experience of the engineers and your company’s use-cases. This will determine the number of engineering hours required to get an operator into production. The important thing to remember is your company is going to start saving money from a reduction in operational toil the moment the Kubernetes operator starts managing your software. 

The key to justify the upfront cost is to compare the engineering effort against the savings your company will immediately incur from the reduction in end-user operational toil. One way to find this out is to apply Kubernetes engineering principles to your use-cases. If the outcomes show a considerable reduction in operational toil from your end-users, the decision to invest in the upfront engineering effort is a wise one. 


### Alternative solutions

There are use-cases where a company does not need the immense power of a Kubernetes operator, and where the upfront engineering effort to learn Kubernetes is not worth the investment. An example would be if your company has a small number of workloads to deploy. In this case, it would be more efficient for you to use a template or an overlay because the barrier to user entry for both is very low. Do not incur the overhead of complexity where it is not justified by business requirements.


## Use-case examples

The following are examples of use-cases that show the benefits of building Kubernetes operators.


### Platform services

If your company uses platform services to manage cluster add-ons like ingress and monitoring, or applications to manage company and community supported workloads, the upfront cost of building Kubernetes operators is going to yield an immediate, on-going, long-term investment.

Kubernetes operators are often leveraged in production to run various platform service cluster add-ons. Often, you can make use of community-supported projects like the Prometheus Operator for app metrics or Cert-Manager to help manage Transport Layer Security (TLS) assets.  

Using Kubernetes operators to fulfill platform services usually offers the most efficient and resilient solution since it is native to the Kubernetes substrate and uses the same engineering principles that make the system stable, self-healing and extendable.


### Tenant workload   

Tenant workloads with the largest teams and the most involved architecture will benefit most from Kubernetes operators. You’ll see immediate benefits once you identify the tenant workloads where the most engineering time is spent in routine toil around deployment and maintenance that Kubernetes operators can autonomously take over for your end-users.


### In-house software 

There is no limit as to the amount or type of software Kubernetes operators can manage for your business. This includes in-house software that Kubernetes operators autonomously control, freeing-up time for your developers to focus on website updates and fixing existing issues. In-house software is any application developed by your company, for your company. Examples of in-house software include a billing app for an online store, a customer database for an emergency alert system, an inventory management software for an online pharmacy, and an online scheduling tool for a hospital. Any online business that provides Software as a Service (SaaS) can manage their business more efficiently and reliably with Kubernetes operators.


## There’s a proper way to build Kubernetes operators

The articles that you read about Kubernetes operators being hard to build are true. That’s why Kubernetes training and experience are essential. If you try to build one without understanding Kubernetes, you’re more likely to create problems that diminish the instant time-to-value savings that your company would have realized had the Kubernetes operator been built properly on Kubernetes engineering principles.


## Affordable Kubernetes training 

If the cost of Kubernetes training is a concern for your company, there is a viable, and fun solution. One of the more popular, affordable ways to learn how to build Kubernetes operators is to join the [Kubernetes community](https://kubernetes.io/community/), where you’ll find a myriad of support from new and experienced users and contributors who share advice, use-cases and bug fixes that make the complexity of learning Kubernetes a lot less intimidating, and much more manageable. 
