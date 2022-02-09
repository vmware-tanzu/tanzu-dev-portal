---
date: '2022-02-09'
description:
lastmod: '2022-02-09'
team:
- Layla Porter
title: "Build an API gateway with .NET 6, C# and YARP"
languages:
- dotnet
url: "/blog/build-api-gateway-with-net-6-csharp-yarp"
---

Consider an API gateway to be a virtual “garden gate” to all your backend services. Implementing one means that all external traffic must pass through the gateway. This is great as it increases security and simplifies a lot of processes such as rate limiting and throttling.

There are many paid for services that offer API management but they can be costly and you may not need all the features they offer.

In this tutorial, you will build a basic API Gateway using [YARP](https://microsoft.github.io/reverse-proxy/) or “Yet Another Reverse Proxy”. YARP is an open-source library  built by developers from within Microsoft. It’s highly customisable, but you are just going to use a simple implementation today.

Before you begin you will need:

An understanding of ASP.NET and C#
- The [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) SDK installed
- A C# code editor such as [Visual Studio](https://visualstudio.microsoft.com/), [Jetbrains Rider](https://www.jetbrains.com/rider/promo/) or [VS Code](https://code.visualstudio.com/Download)
- A local copy of [this GitHub Repository](https://github.com/Layla-P/APIGatewayWithYarp) (either downloaded or forked+cloned)

## What does an app look like without an API gateway?
Below is a simple diagram consisting of 3 services and a database - note our demo looks slightly different to this. The front end client app is talking directly to all three services directly. This means that each service will need to manage its own security and makes implementing patterns such as service discovery much harder.

![Diagram of system without an API gateway](images/no-gateway.png)

Once you add in an API gateway, as you can see in the diagram below, all external traffic must now go via the gateway and the gateway will redirect the requests to the appropriate service.
The gateway will now handle security such as authorisation and authentication, thus reducing the complexity of the application.

![Diagram of system with an API gateway](images/gateway.png)

## Exploring the application

You should already have a copy of the application downloaded or cloned. If not, you can find it [here](https://github.com/Layla-P/APIGatewayWithYarp).
The app consists of 3 projects; a `FoodService`, a `DrinkService` and a `Client`. All the projects are in a single solution for ease of demonstration. Normally, each service would be in its own solution.

The `FoodService` and `DrinkService` are both .NET WebAPI applications. Both have just a single controller, and when called, will return a random food item and random drink item respectively.

The Client directory contains a Blazor WASM application. There is only one page in the app and it has a button that when clicked, will display a random food and drink item. Behind the scenes, there is a method which calls both the FoodService and DrinkService respectively, retrieving a random food item and random drink item to display to the user.

Let’s run the application and make sure it behaves as expected. All three projects should be set to startup at once. If not, then configure your application start to do so.

The application is configured to run on Kestel. If you would prefer to run on IIS then you will need to update the `localhost` port numbers on both the FoodService and the DrinkService in “Client/Program.cs” as shown below.

