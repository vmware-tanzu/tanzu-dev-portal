---
title: .NET Beyond 2022 Wrap Up
slug: dotnet-beyond-2022-wrap-up
description: A wrap up of the exciting .NET Beyond 2022 event. 
tags:
- Dot NET
- F Sharp
- Tanzu Application Platform
team:
- Lizz Smullen
date: '2022-04-11'
publishDate: '2022-04-11' 
---

The whirlwind that was .NET Beyond 2022 just wrapped up. If you had a chance to attend, we hope you learned a lot, and had some fun in the process. If you couldn’t attend, check out some talk summaries below. If you want to know more, check out all the talks on [YouTube](https://www.youtube.com/playlist?list=PLAdzTan_eSPRDT8g6FcjSFlL1i5JtnV3i).

## Why F# Works in the Enterprise

Python and Java developers who have tried using F# in a .NET ecosystem are in awe over the succinctness in their code.

"It's not like [Python](http://python.net/)," said Philip Carter, a senior product manager at HoneyComb, "It has a heritage based on functional programming, not out of smorgasbord programming that Python does."

Carter, who spent six years working at Microsoft, and five years working with F# for Visual Studio Code, said that F# got its start as a basic Microsoft research project, "It's really hard for a research project to become a real product," said Carter.

According to Carter, F# provides excellent Visual Studio Code integration because it lets you use first class software development kits (SDKs) such as Badger, AWS, or any other service that has a standard .NET or small library. He also likes _Immutable first_, a feature that forces developers to structure their programming so that everything flows cleanly, from top to bottom. He said you can declare something as mutable by just turning off the Immutable first feature.

Immutable first makes the declaration explicit, rather than everything implicitly being always changeable. "It's one of the reason F# programmers love using it," said Carter, especially for more complicated systems where they don't want to be debugging things all the time.

Carter said that you can also define a web server in F# in just 11 lines of code, and that you can define two API routes with just three lines of code in F#, "Anything that you can do with .NET, you can do with F# on the server."

## Kubernetes Made Easy with VMware Tanzu Application Platform

If there are two things that Kubernetes is known for it is for being the ultimate open-source container orchestration platform, and for having a steep learning curve.

John Bush, a senior solutions engineer at VMware, says that the learning curve is a result of people not knowing how to deploy apps as packages in containers using software like Docker, and not knowing how to use YAML. "YAML tells Kubernetes how to run your application," said Bush, adding that YAML also tells Kubernetes how to route, scale, event, deploy, and traffic services.

Bush said he would like to see Kubernetes start to be built with a higher-level platform and a higher-level abstraction because it is more developer friendly. He also said that he doesn't like the idea of developers having to deploy directly onto Kubernetes when it is built as a low-level platform. One way he said you can change this is to use the VMware Tanzu Application Platform.

Tanzu Application Platform provides customizable application accelerators that provide a starting point for you to build an app. "If I was a developer who wanted to do a .NET app, I would select a template accelerator," said Bush. "In Tanzu Application Platform, you can configure the accelerator before it renders the template." The templates in Tanzu Application Platform are sophisticated and internal to how your company does software. Tanzu Application Platform includes a starter template. "The starter template is a skeleton," said Bush, "You can add whatever business logic you've been tasked to write."

There is also a Tanzu Application Platform Visual Studio Code plugin to enhance the experience of a developer when working with an app on a desktop. "It's going to build your app and deploy it out to the development Kubernetes cluster," he said. It's also going to monitor and detect source code changes and do an incremental rebuild of the app before deploying it to your Kubernetes environment. In addition, Tanzu Application Platform gives you a live update of the code changes and monitors your environment without you ever having to invoke commands. "As I make changes, it rebuilds and deploys my app," says Bush, "I can just focus on code and not worry about issuing commands."

## Mobile DevOps at Scale

Continuous integration (CI) is universal. With it, you can restore, build, publish and release. When you deploy software as a service (SaaS) in an environment, you are on the most recent version of the app, unless you are looking at the app on a mobile device using iOS.

"There is no guarantee that any given end user is going to be on the most recent version of the apps," said Rodney Littles II, a senior software engineer who is currently working with Xamarin mobile and Azure cloud infrastructure. Littles says it's important to be mindful of this whenever you are deploying SaaS to AWS or other SDKs. In iOS, you don't have failovers to go back to the previous version. The only way to get this to work is to fail forward. "That means you have to push a binary with the previous version, with a new version number that is greater than the one that you want to get rid of," said Littles.

During a comparison between a mobile device and an old school desktop, Littles said that it's important to make sure that you have side-by-side installations from day one to avoid increasing CI risk and landscape. He suggests using `msbuild` from a command line, and that a .NET CLI does not exist. The key is to ensure that the binaries are signed. "You can't deploy an iOS app to a mobile phone if the binaries are not signed," he said, because mobile devices are specific.

When writing apps, Littles said he prefers to use Nuke over YAML because Nuke is an extensible, domain specific language that can generate a YAML file from a build script. It is also an abstraction that sits on top of `msbuild`. Littles also chose Nuke because he likes partial classes that let him separate, segregate because it provides separation of concern. "Single responsibility is my jam. It is the most solid principle, but also the most violated principle," said Littles.

## ASP.NET — Basics for Experts

Two of the most exciting changes to the .NET 6 release that are making developers take another look at C# are top level statements and minimal APIs.

With top level statements, the program's entry point in .NET 6 is now in a static method class. "It removes the extra ceremony of previous versions," said Layla Porter, a developer advocate at VMware, and founder of #WomenOfDotNet. As a result, Porter said that the .NET 6 release is going to look different to developers who are familiar with C# apps. Porter said that with the new web application builder, you can add content such as controllers, Swagger to test endpoints, middleware, and default controller mappings to the startup class.

Porter likes the new minimal APIs feature and believes that is going to be a big hit with developers from other platforms. "If you've done node development, this will be in a similar format," she said.

Another great feature in .NET 6 is Dependency Injection and Inversion of Control (IOC) because it lets you add services to the IOC container. Porter said that it is easy to use and implement because you can isolate business models.

The Policies and Circuit Breakers with Polly is a game changer in .NET 6 because it lets you keep a circuit open. For example, when everything is working, the circuit is closed. When the circuit opens again, you can't keep it open. "With a circuit breaker policy, you open the circuit," explains Porter. Policies with Polly also lets you define routes and end points. "You can define the route from the API controller," said Porter, adding that you can now also write how you want custom controllers to behave.

The Steeltoe Project was also highly recommended by Porter. The Steeltoe Project, built off of Spring Boot, is useful for service discovery, health checks, messaging, logging and tracing. "If you're coming from Spring, check out the Steeltoe Project, she said. "You will be familiar with this."

## From Monolith to Service Oriented and Beyond

After spending 2.5 years on a complex financial app project that was due to be released twelve months later, Stacy Cashmore, a DevOps tech explorer from Omniplan, and her team, asked management if they could start again.

Cashmore described the conversation as difficult, but said "Surprisingly, management agreed." There was one condition. "Management said OK, but you have one year left," she said.

According to Cashmore, one of the problems with the financial app was that it was massive, had over 140 projects, and took five minutes to open. When the team got together to collaborate in the middle of the COVID pandemic, the tech leads were asked to share their knowledge, too.

One of the changes to the new system was to add Service Oriented Architecture, so that each of the services had its own set of responsibilities. "We didn't want them doing more than one thing," she said. One of the services that the team came up with provides output for personal financial dossiers that are easy for people to understand. "The service doesn't have any responsibility for calculation. It just has the responsibility of taking what we store and turning it into something the calculating engine can actually understand," said Cashmore.

Everyone on the team wanted to keep the new system independent from the old one. "That meant what we stored wasn't quite the same as what we used for calculating because you need to give your users more visual clues than you give your calculating engine," said Cashmore.

The team also didn't want to share objects between the old and the new system because of the old system's existing problems. "When you share objects that are almost the same, but not quite, but they are shared everywhere so every object can do everything, as soon as you change one object all of the things die," explains Cashmore.

When the team discussed which resources to run in the new system, Cashmore said that everyone suggested their favorite shiny, cool, tech toys, but then decided to go with none of them. "We had to build a huge application that has to be live in 12 months. Let's not complicate things by using techniques and technologies that we're not comfortable with, that we don't need right now."

## What’s next?

If these talks sound interesting, and you would like to know more, the entire schedule of talks from .NET Beyond is now up on YouTube. [Check it out](https://www.youtube.com/playlist?list=PLAdzTan_eSPRDT8g6FcjSFlL1i5JtnV3i)!

And for ongoing .NET content so you can stay up to date, be sure to watch [.NET in the Wild](https://tanzu.vmware.com/developer/tv/dotnet-wild/) every week, with host Layla Porter. Each week she interviews someone from the .NET community. The discussions are always informative, and fun!
