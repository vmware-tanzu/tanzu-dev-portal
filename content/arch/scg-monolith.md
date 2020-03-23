---
title:  "Using Spring Cloud Gateway to Deconstruct a Monolith"
weight: 1001
---

# Spring Cloud Gateway

In this architecture, you'll take a look at how you can use [Spring Cloud Gateway](/guides/spring/spring-cloud-gateway/scg-what-is) to help deconstruct a monolith into discrete microservices gradually and transparently. The benefit of this method is that it allows you to make these structural changes to your application as well as introduce resiliency without the interface to your application ever changing. 

Consider the following monolithic application. In this case, all requests go to this one application, which handles request routing and business logic.

![scg-arch-1](/img/arch/scg/scg-arch-1.png)

At this point, you've decided that you want to start breaking this single application down into smaller, more independent services. You've identified some business logic that could be used elsewhere or in other applications, created a service, and have it up and running. But how can you start sending traffic to this new service without making a bunch of changes to your original application? This is where Spring Cloud Gateway can help out.

![scg-arch-1](/img/arch/scg/scg-arch-2.png)

Above, you can see how Spring Cloud Gateway sits between the user and the application, and in this case, knows which requests need to be sent to this backend service. This means that you can stand up our new service, build the gateway, and then start sending all traffic through it without incurring downtime.

![scg-arch-1](/img/arch/scg/scg-arch-3.png)

This pattern can be used to continually break apart your monolith into individual services. Meanwhile, you can keep updating your gateway to know about these new services.

![scg-arch-1](/img/arch/scg/scg-arch-4.png)

Finally once all of your business logic is broken into their own services, you can decommission the monolith. The upside to this approach is that instead of large all-at-once rewrite, it can be done in small, easy to digest portions.

## Learn More

To learn more, more sure to check out [What Is Spring Cloud Gateway](/guides/spring/spring-cloud-gateway/scg-what-is) as well as our [Getting Started with Spring Cloud Gateway](/guides/spring/spring-cloud-gateway/scg-gs) guide.