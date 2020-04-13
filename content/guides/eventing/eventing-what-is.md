---
title:  "What is Eventing"
date: 2020-04-13
---

An event-driven architecture aims to loosen the coupling between services. The biggest way this is accomplished is rather than having an "event emitter" reach directly out to an "event consumer", it instead puts a message out for all consumers in the system to potentially consume.

So what is an event, then? In short, it can be defined as a "change of state". This could be something like a file being uploaded, an order for a shop being placed, or the temperature being read by a sensor changing. Events could occur frequently and in huge numbers, or few and far between. 

## Why Is It Important?

This pattern can be very powerful when applied correctly. As mentioned, the biggest gain in this design is it loosens how tightly coupled services and applications are. Event emitters can "fire and forget" their events without worrying when consumers are added or removed from the system.

Since the event emitter doesn't need to know about every consumer, your consumers can come and go as needed. New ways to process these events can be added just by listening on the message queue. Capacity can also be grown by adding more consumers to the message queue to help process a large influx of events.

Processing events doesn't stop at a simple action being taken, either. With each event, you not only have the content of the event, but the context as well. How frequently similar events are coming in, how many are generated in a certain time period, where they're coming from. These are all things that give us additional information to provide to our consumers to use.

## How Does It Work?

Consider the example of an online shop when an order is placed. There's several services that will probably need to know about the new order, such as a payment service, an inventory service, a shipping service, and so on.

Traditionally, this would mean the website would send request to each of these services for each order that's placed. Not only does this mean more traffic for your site, but it also means it needs to know what to do if any of the services are down, how to distribute requests to multiple services, and will require changes as new services are added to the architecture.

An event-driven architecture flips this responsibility, and instead the website publishes a message to a queue that all of your services will listen on. A "sale" event would be picked up by the payment, inventory, and shipping services. As your shop gains more customers, you can scale these services out as needed. Perhaps the payment service takes a bit of time to determine sales tax and contact the payment provider. In this case, we can add more of the payment services to the message queue, and rely on the message queue to only deliver this event exactly once to a payment service.

You might also want to let your customers know which products are currently popular and make them easy to find. For this, you could add a service to watch for all "sale" events, and keep track which product is selling the best over the last hour of time. This sliding window of time uses the context of when the events are coming in to know what's currently selling really well, rather than the total sales from a full day or more.

## How Can I Use It?

There are a couple of ways to get started, but the best place may be to check out Getting Started with RabbitMQ or Getting Started with Kafka, going over two popular messaging brokers and how to write code to interact with them. From there, you can check out "Getting Started with Spring Cloud Stream", which can help ease event processing with Spring.