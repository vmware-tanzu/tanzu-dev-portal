---
type: newsletter
date: "2023-08-23"
title: Hooked on .NET - August 2023 with Irina Scurtu
description: The second edition with guest Irina Scurtu, includes suggestions for the latest blogs to read, podcasts to listen to and videos to watch. 
link: https://laylacodesit.substack.com/p/hooked-on-net-587
canonical: https://laylacodesit.substack.com/p/hooked-on-net-587
team: 
- Layla Porter
---
## Welcome back 👋

I hope you are all having a great August so far. For me, it's been quiet, which has been lovely. 
I am delighted to have our very first newsletter guest this month, my good friend [Irina Scurtu!](https://twitter.com/irina_scurtu)

Irina is a Microsoft MVP for Developer Technologies, a Software Architect, and a Microsoft Certified Trainer (MCT). In this role, she has provided more than 2000 hours of training, classes, workshops, and presentations. Twice annually, for five-month periods, she teaches .NET and C# to people who either want to get into software development or simply learn new things. Irina is passionate about Microsoft developer topics and is always on a quest to try out the latest trends and best practices in architecture, .NET, and the world around it. Irina is active in the community, having founded the DotNet Iasi User Group and the https://dotnetdays.ro conference where she brings together like-minded developers willing to share their knowledge with others. Her articles can be found at http://irina.codes.

{{< figure src="/developer/languages/dotnet/newsletter/02/images/irina-scurtu.jpeg" alt="A black and white protrait of Irina" height="100%" width="100%" >}}

## Irina's thoughts

I am currently waiting for my WEB API book to be published to be able to smell the printed pages and talk about it.

Currently, I am still trying to find ways to integrate gRPC into my .NET projects, as well as improving the workshop I created on this topic. I really love gRPC and this is a technology that is here to stay we should give it more credit. We can use gRPC in many cases and benefit from what it has to offer.

Contrary to popular belief, gRPC is not here to replace RESTful APIs as we all know and write, and we shouldn’t have REST vs gRPC debates. It is just another tool in our toolbelt that we have to know when, and how to use because it has its particularities. For example, we will have to manage special files written in a syntax called Protocol Buffers. In these files, we define what the consumer can use, and what the server exposes and ultimately implements. These files become the source for the code-generation that is done by the compiler for us. In C# we will obtain C# types that have the methods that we defined, and we provide logic for them. Unlike REST, when we consume gRPC services we have a more call-a-method approach. We call methods, we don’t make requests to endpoints, although that happens behind the scenes, and it can be a bit confusing at first. It can really make a distributed-system feel like a monolith because of that.

Among other things, I recently started playing with 11ty(Eleventy)- a static site generator - for a few personal projects and I am really asking myself why I didn’t find this sooner. A static website can really give you the flexibility to have a lightning-fast website and if you host it in Azure, you can back that up with an Azure function as an API, and pay almost nothing. This is ideal for personal projects or blogs, since it can have 2 custom domains, it has free SSL.

Update: Irina’s [book](https://link.springer.com/book/10.1007/978-1-4842-9348-5) is now published and available to purchase!

### Irina's recommendations

- [11ty](https://www.11ty.dev/)
- [Microsoft static sites](https://azure.microsoft.com/en-us/products/app-service/static/)
- [gRPC in .NET](https://learn.microsoft.com/en-us/aspnet/core/grpc/?view=aspnetcore-7.0)
- [Gui Ferreira's YouTube](https://www.youtube.com/@gui.ferreira)
- [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3)

## What's new and exciting?

- [.NET 8 preview 7](https://devblogs.microsoft.com/dotnet/announcing-dotnet-8-preview-7/) - Gosh, the releases are coming thick and fast. This is the final preview release, next up will be the release candidates!
- [.NET MAUI keyboard accelerators](https://devblogs.microsoft.com/dotnet/announcing-dotnet-maui-in-dotnet-8-preview-7/) - also in this release, is the latest version of .NET MAUI which introduces keyboard accelerators along with a whole host of improvements and fixes. Keyboard accelerators enable you to assign keyboard shortcuts to any menu item, whether visible or not, and attach them to any UI element. Cool, huh?
- [Unity Extension for VS Code](https://devblogs.microsoft.com/visualstudio/announcing-the-unity-extension-for-visual-studio-code/) - I have dabbled in a fair bit of Unity and having support in an editor such as VS Code is going to make a lot of people happy!

## What to read 📖

[How to Benchmark in different .NET versions](https://steven-giesel.com/blogPost/59cfb6f8-8b87-4707-a99e-e372541b696a?utm_source=csharpdigest&utm_medium&utm_campaign=1693) - I've recently had a play with benchmarking using BenchmarkDotNet, it can be quite addictive once you get started! In this quick article, Steven shows us how to benchmark in multiple .NET versions.

[Tales from the .NET Migration Trenches - Intro](https://www.jimmybogard.com/tales-from-the-net-migration-trenches/) - Jimmy Bogard has started a new series where he will talk about his experiences with migrating from .NET Framework 4.8 to .NET 6. As someone who talks to plenty of customers planning to embark on a similar journey, I cannot wait to hear more!

[Struct memory layout and memory optimizations](https://ayende.com/blog/199777-A/struct-memory-layout-and-memory-optimizations?key=bb987d033f60428698a31b9a4a1b1e58) - as I mentioned earlier, I have been dabbling with Unity. Most recently with [Unity DOTS](https://unity.com/dots) which stands for data-oriented technology stack. It is all about utilising memory efficiently and thinking in a different way. In this article, Oren Eini, talks about how they have saved 66% of memory space by considering struct memory layouts and this totally reminded me of DOTS. It's a fascinating approach to programming which most web developers don't often consider.

## What to listen to 🗣

[Breaking Up with Tech Debt: A Love Story with M. Scott Ford](https://dotnetcore.show/episode-124-breaking-up-with-tech-debt-a-love-story-with-m-scott-ford/) - on episode 124 of the Modern .NET Show podcast, Jamie is joined by M. Scott Ford. The discussion covered technical debt and the tools Scott has used to vizualise it, and the importance of incremental changes to keep on top of codebases and their dependencies.

[The Ingredients to a Life in Tech with Corey Weathers](https://hanselminutes.com/904/the-ingredients-to-a-life-in-tech-with-corey-weathers) - my totally awesome friend and former co-worker, Corey Weathers, hopped on the Hanselminutes podcast. Corey is such an insightful, level individual. Go give it a listen.

## What to watch 📺

[The BEST Moq Alternatives: NSubstitute vs FakeItEasy](https://youtu.be/hE1_ByNG2J0) - If you haven't already checked out Gui based on Irina's recommendations, here is another reminder. Gui has just celebrated one year of content creation and in this video he discusses the MOQ alternatives for use in your tests.

[Beautiful UI Controls for .NET MAUI with Telerik UI](https://www.youtube.com/watch?v=DzD0ucPldeM&ab_channel=dotnet) - Sam Basu from Progress is on the On .NET  show to demo beautiful UI controls for .NET MAUI using Telerik UI.

[The Blazor Power Hour: Static Rendering with .NET 8](https://youtu.be/BZW5Dd6L0y4) - and continuing with lovely folks from Progress, Ed Charbenaeu is showing us the latest .NET 8 and Blazor feature, static rendering.

## Before you go 👋

We do hope you've enjoyed the articles, videos, and podcasts we've shared with you. If you have an article you'd like us to include in the newsletter, then please complete this [form](https://forms.gle/WJM3F7STnSiVdysy5).

If you have any comments or suggestions or just want to reach out then feel free to complete this [contact form](https://forms.gle/TNMj6mMtUxDFXP8v6) to reach me, Layla.

Lastly, don't forget to subscribe to the newsletter and share it with your friends!

Thanks for reading!

Layla.
