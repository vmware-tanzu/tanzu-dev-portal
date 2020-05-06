---
title: Event-Driven Architecture
featured: true
weight: 3
description: >
    Asynchronously emitting and consuming events at scale. A look at different messaging services and frameworks. 

---

As applications become more and more distributed, many are looking to more event-based systems. Rather than services communicating directly with each other, polling for new work to do and generating a bunch of chatter, applications are instead publishing a change in state to a message broker which services can listen on. These changes in state are often referred to as “events”.

Consider the scenario of an online shop. When a user places an order, several internal services will probably need to know about it. The payment system will need to process the customer’s payment details, the shipping service will need to begin generating the resources to send the customer the product, the inventory service will need to be updated, and so on. Not only is this additional load on our storefront, but it also needs to know where all of these services live and what to do if they’re offline at the time of a purchase. If a new service is added to this process, it also means the storefront needs to be updated to communicate with it.

![img](/images/patterns/eventing/eda-01.png)

Now, consider if the responsibility was flipped. In an event-driven architecture, the storefront would instead put a message out (traditionally on something like a message broker or event bus) saying “Hey, there’s a new order!”. Once that message is sent, the storefront doesn’t need to communicate any further with the backend services. Instead, these services will listen to that message broker for messages about new sales and take the appropriate action.

![img](/images/patterns/eventing/eda-02.png)

Furthermore, additional metadata could be added to these messages, for example in the case a customer needs to change a shipping address on a sale that has not yet shipped. In this case, only the shipping service would receive this message so that it could sort through all pending orders for that customer.

![img](/images/patterns/eventing/eda-03.png)

If you're looking to get started with eventing, make sure to check out the guides below such as [Getting Started With RabbitMQ](/guides/messaging-and-integration/rabbitmq-gs), [Getting Started With Kafka](/guides/messaging-and-integration/kafka-gs), or if you're a Spring developer, [Getting Started With Spring Cloud Stream](/guides/event-streaming/scs-gs). These guides will walk you through the basics of interacting with some popular message brokers and show what tools are available in these ecosystems. 
