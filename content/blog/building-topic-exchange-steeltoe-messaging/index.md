---
title: Using a Topic Exchange with Steeltoe and RabbitMQ
description: In a previous blog, we have seen how to build a topic exchange on RabbitMQ with .NET 6. In this blog we will see how to accomplish it with Steeltoe Messaging. 
slug: building-topic-exchange-steeltoe-messaging
tags:
- Dot NET
team:
- Hananiel Sarella
- Layla Porter
date: '2023-09-27'
publishDate: '2023-09-??'
og_image: "/blog/building-topic-exchange-steeltoe-messaging/images/cover.jpg"
languages:
- dotnet
---

## What Is Steeltoe Messaging?

![alt_text](images/cover.jpg "image_tooltip")

Steeltoe provides support for integrating with messaging by providing a simplified use of the RabbitMQ API. It builds on top of the RabbitMQ client to provide higher level abstractions like a `RabbitTemplate` and convenient attributes like the `RabbitListener`. Beyond that, it provides a complete infrastructure to receive messages asynchronously. The Steeltoe Messaging component is a core building block for even higher level abstractions such as Steeltoe stream that allows you to build to abstractions agnositic of the actual broker. Imaging writing your code to target RabbitMQ but by just changing a Nuget dependency being able to target Kafka. While Kafka support is not available currently, the core abstractions exist today. 


## Why use higher level abstractions?

The core reasons for abstractions is to hide complexity and make like simpler. By hiding a a lot of boiler plate of setting up your broker client, the stucture of your application allows us to focus on the important details or the business logic that is being implemented. 


## Before You Begin

This blog is written as a continuation of a previous blog [Using Topic Exchange with Steeltoe and RabbitMQ](building-topic-exchange-steeltoe-messaging). 

If you want to just get started with Steeltoe Messaging there are a number of samples demonstrating features and defaults [here](https://github.com/SteeltoeOSS/Samples/tree/main/Messaging). 

This example takes an existing application built with the basic RabbitMQ client and adds Steeltoe Messaging to get a better idea of what Steeltoe Messaging does. 

## Review the waffle ordering system
To review the existing application, we have the waffle ordering system. It has an order service that sends orders asychronously to a topic exchange named 'waffle_messaging'. The orders are sent with the routing key of 'order.cookwaffle'. 

On the receiving side, it has a kitchen service that receives the orders by declaring an anyonmous queue and binding it the waffle_messaging exchange with the routing key 'order.cookwaffle'. 


## Updating the project to Steeltoe Messaging

Lets take this application and add Steeltoe Messaging to it. 

Lets see how we can accomplish the same thing in Steeltoe Messaging using a named queue and adding a named binding. To keep things clear lets use a new topic exchange named 'waffle_kitchen'. We will use the same routing key 'order.cookwaffle' but use a queue named 'waffle_queue' and a binding name 'waffle.binding'. 

You can follow the rest of the guide by looking at the source code [here](https://github.com/hananiel/SteeltoeTopicExchange)

We will start by adding a Nuget Reference to Steeltoe.Messaging to the Order service and the Kitchen service. 

`<PackageReference Include="Steeltoe.Messaging.RabbitMQ" Version="3.2.4" />` 

To use Steeltoe Messaging, we need to call three main extension methods provided by the library:

```csharp
      services.AddRabbitAdmin();
      services.AddRabbitTemplate();
      services.AddRabbitServices(useJsonMessageConverter: true);
```
we wrapped them in a convenient method called `AddSteeltoeMessaging` in `Messaging.Common` which will be called by both projects OrderService and KitchenService.

Note that Steeltoe messaging adds more advanced concepts such as adding annotations to declare Queues, Exchanges and so forth but needs the use of a special RabbitMQHost that controls the lifecycle - you can see this working in the sample applications. 

One difference with how we are consuming the RabbitMQSettings is by using the [Options Pattern](). 
 
This is as simple as adding this lines:

```csharp

builder.Services.Configure<RabbitMqSettings>(builder.Configuration.GetSection("RabbitMqSettings"));

```
We can do this in `Program.cs` file in both projects. Also note the new settings QueueName and BindingName and update the names in the `appsettings.json` in both projects.

### Updating the OrderService
In the Order service we need to only call `AddSteeltoeMessaging()` method. This will make a `RabbitTemplate` available to the Service Container. 
Now we can add that as a constructor parameter to `RabbitSender` and we can remove all other parameters. Another parameter to this constructor is the `IOptions<RabbitMQSettings` which we configured earlier. 

Now sending a message to the configured exchange with the given routing key is as simple as : 

```csharp
_template.ConvertAndSend(exchange: _rabbitSettings.ExchangeName,
     routingKey: _rabbitSettings.RoutingKey,
     message: entity);
```

Also note that since we have configured a JsonConverter, we no longer need to do any serialization ourselves. Steeltoe Messaging can also be extended with other converters that are more efficient than Json. 

### KitchenService

Receiving a message has a couple more steps in setup. We need to set up the Exchange, the queue and bindings using steeltoe extension methods as follows:

```csharp
 services.AddRabbitQueue(provider =>
     new Queue(provider.GetSettings().QueueName, durable: true, exclusive: false, autoDelete: true, new Dictionary<string, object> { { "x-message-ttl", 1000 } }));

 services.AddRabbitExchange(provider => new TopicExchange(provider.GetSettings().ExchangeName, true, true));

 services.AddRabbitBinding(provider =>
 {
     var settings = provider.GetSettings();
     return new QueueBinding(settings.BindingName,
      settings.QueueName, settings.ExchangeName, settings.RoutingKey, null);
 });
```
The `provider.GetSettings()` is a helper method to read from the configured `IOptions<RabbitMQSettings>`. The benefit of using the steeltoe API over the basic RabbitMQ client is to simplify the receiver which now looks like this: 

```csharp
 public class RabbitReceiver 
 {

     private readonly IHubContext<OrderHub> _orderHub;
     public RabbitReceiver( IHubContext<OrderHub> hub)
     {
         _orderHub = hub;
     }

     [RabbitListener(Binding = "${RabbitMqSettings:BindingName}")]
     public void DoStuff(Order order)
     {
         Console.WriteLine("Success: Received Order"+ order );
         _orderHub.Clients.All.SendAsync("new-order", order);
     }
 }
```

Note the use of the placeholder `${RabbitMqSettings:BindingName}` which is another powerful tool. It is directly parsing the provided IConfiguration and providing variability into a place which needs to be static - the attibute values of the `RabbitListenerAttribute`!

## Getting it up and running

With these changes, you can start both the "KitchenService" and "OrderService" projects either from using `dotnet run` in the CLI root of each project or by configuring your IDE to run both projects on start. The app should now work identical to what it was doing before but we have removed a lot of the boiler plate of dealing with RabbitClient directly. 


## What's Next?


Check out the [Steeltoe documentation](https://docs.steeltoe.io/api/v3/messaging/rabbitmq-reference.html) and try out the many features documented. 
If this is your first time with RabbitMQ or Steeltoe, see the tutorials at [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-one-dotnet.html) and the follow along doing the exact thing with [Steeltoe]( https://docs.steeltoe.io/guides/messaging/Tutorials/Tutorial1/Readme.html)

I hope you enjoyed this tutorial. If you have any thoughts or ideas please say hello on any of the channels below:

Email: hsarella@vmware.com  
Twitter: [@hananiel](http://twitter.com/hananiel)  
GitHub: [hananiel](https://github.com/hananiel)
