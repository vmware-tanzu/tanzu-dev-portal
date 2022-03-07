---
canonical: https://tanzu.vmware.com/developer/tv/dotnet-beyond
aliases:
- /tv/dotnet-beyond/conference
Date: '2022-03-30T19:48:16Z'
episode: '1'
guests:
- Andrew Stakhov
- Christos Matskas
- Hananiel Sarella
- Ian Cooper
- Jakub Pilimon
- Jeff Fritz
- John Bush
- Julie Lerman
- Lewis Denham-Parry
- Luce Carter
- Phillip Carter
- Poornima Nayar
- Richard Campbell
- Rodney Littles II
- Stacy Cashmore
hosts:
- Alyssa Nicoll
- Cora Iberkleid
- Corey Weathers
- Ed Charbeneau
- Jakub Pilimon
- Jeff Strauss
- Layla Porter
- Matty Stratton
- Michael Coté
faqs:
  faq:
  - question: What is .NET Beyond?
    answer: It's a community event spread over two full days on <a href="https://www.twitch.tv/vmwaretanzu">Twitch.TV</a>. Some of the smartest voices in the .NET community will come together to present and discuss how they're using .NET to develop for the enterprise, and at scale. It'll be educational for all attendees, featuring interactive, live Q&A. 
  - question: Sounds great! When does it all go down?
    answer: The festivities take place over two exciting days. It kicks off on March 30, 2022 at 10:30 AM ET/7:30 AM PT/3:30 PM GMT, and on March 31, 2022 at 4:45 AM ET/1:45 AM PT/9:45 AM GMT. It's gonna be a worldwide jam.
  - question: And how much does it cost?
    answer: Keep your money, friend; this event is free. 
  - question: Now we're talking. Also...what's Twitch? Do I need to have an account there?
    answer: Twitch is an interactive streaming service for all kinds of content. You don't need an account to watch any of the .NET Beyond talks, but you will need to sign up and log in to participate in the chat. 
  - question: What does VMware have to do with .NET?
    answer: VMware is a big fan of .NET! Not only can .NET applications be deployed to VMware Tanzu, but we're part of the .NET Foundation and support Steeltoe.io.
lastmod: '2022-01-27'
publishdate: '2022-01-27'
title: .NET Beyond
type: tv-episode
no_episode_title: true
no_streaming_label: true
hide_newsletter: true
twitch: vmwaretanzu
banner_only: true
calendar: true
beyond: true
contact: TanzuEvents@vmware.com
code_of_conduct: true
description: A collection of conversations exploring the wider world of .NET
---
<div id='day-1-reminder' class='p-md-5 p-3' style='display: none; width: 500px;max-width:100%;'>
<h3 class='text-white mb-3 text-center'>Add to calendar</h3>
<div class='d-flex justify-content-center'>
    <a href="https://d1fto35gcfffzn.cloudfront.net/dev-portal/NET-Beyond.ics"
      class='beyond-btn btn mr-2 mb-2 position-relative z-1'><span class="position-relative">Outlook/iCal</span></a> 
    <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=.NET+Beyond&details=Join+some+of+the+smartest+voices+in+the+.NET+community+on+Twitch+as+they+come+together+to+present+and+discuss+how+they%27re+using+.NET+to+develop+for+the+enterprise+and+at+scale.%0A%0AWatch+here%3A+https%3A%2F%2Fwww.twitch.tv%2Fvmwaretanzu&dates=20220330T150000Z%2F20220331T180000Z" class='beyond-btn btn mb-2 position-relative z-1'><span class="position-relative">Google Calendar</span></a>
</div>
</div>
<div class="row mb-5">
<div class="col-lg-9 col-12 px-0 pr-lg-5">
<p class="m-0">Are there any boundaries to what you can build with .NET? Not really! Join us for two full days on <a href="https://www.twitch.tv/vmwaretanzu">Twitch</a> or <a href='https://dotnetbeyond.io/youtube'>YouTube</a> as we look at how some of the smartest voices in the .NET community are using it to develop for the enterprise—and at scale.</p><p>No matter where you fit in the .NET spectrum, you’re guaranteed to pick up something you haven’t learned yet.</p>
<p class="mb-0"><strong><a class='lightbox' href='#day-1-reminder'><i class='fa fa-calendar-check ml-0 mr-1'></i>Add to calendar</a></strong></p>
</div>
<div class="col-lg-3 col-12 mt-lg-0 mt-4 text-center p-4 newsletter-outer" style="background-color: #1B2A32">
<div class="newsletter">
  <p class="text-white mt-0">Sign up for the developer newsletter</p>
  <div class='btn beyond-btn btn-small click-to-show position-relative'><span class="position-relative">Subscribe</span></div>
  <script src="https://connect.tanzu.vmware.com/js/forms2/js/forms2.min.js"></script>
  <form id="mktoForm_1609" class="hidden float-lg-right"></form>
  <script>
    MktoForms2.setOptions({formXDPath : "/rs/pivotal/images/marketo-xdframe-relative.html"});
    MktoForms2.loadForm("https://connect.tanzu.vmware.com", "625-IUJ-009", 1609, function(form){
      form.setValues({ "Function__c": "Developer", "utm_campaign__c": "NET Beyond"  });
      form.onSuccess(function(values, followUpUrl) {
        form.getFormElem().hide();
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event' : 'ctaSubmitted',  
            'eventCategory': 'Subscription',  
            'eventAction': 'Form Submitted',
            'eventLabel': 'Newsletter'
        });
        window.dataLayer.push({'event': 'logEvent', 'eventType': 'newsletter subscribed', 'eventProperties': {'page name': '{{ .Title }}', 'source': 'footer'} });
        sendAmplitudeEventOnLoad('newsletter subscribed', {'page name': '{{ .Title }}', 'source': 'footer', 'url path': window.location.pathname});
        $('.confirmation').show();
        return false;
      });
    });
  </script>
  <div class='confirmation' style="display:none">Done!</div>
</div>
</div>
</div>

<div class="day-toggle row">
<h5 id="day-1" class="p-4 d-inline-block mb-0 day active">DAY 1</h2>
<h5 id="day-2" class="p-4 d-inline-block mb-0 day">DAY 2</h2>
</div>

<script>
function convertTime(sessionTime) {
  var date = new Date(sessionTime);
  hours = date.getHours();
  hours = ("0" + hours).slice(-2);
  document.write(hours + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ' ' + date.toLocaleString("en", {timeZoneName: "short"}).split(' ').pop());
}
</script>
<div id="day-1-agenda" class="agenda p-lg-5 p-3">
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 15:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#history">The History of .NET</a></div>
  <div class="col-sm-1 col-0 px-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/richard-campbell/">Richard Campbell</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">.NET Rocks</span>
  </div>
</div>
<div id="history" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">The History of .NET</div><p>.NET continues to evolve—but how did it get here? Join Richard Campbell on a tour of the history of .NET, Visual Studio, and the related tools that have been helping developers produce millions of applications. So many forces shape how development tools are created, and Richard ties together the story of the hardware, software, market, and political forces that have brought .NET to be an open source, cross-platform development platform. The winding path of .NET has been influenced by many things along the way, and the future looks bright!</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 16:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#scalability-and-security">Scalability and Security with K8s and Azure Active Directory</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/christos-matskas/">Christos Matskas</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Microsoft</span>
  </div>
</div>
<div id="scalability-and-security" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Scalability and Security with K8s and Azure Active Directory</div><p>With more solutions moving to K8s, we need to provide robust ways to secure access to applications and services. In this session, we'll take a look at the latest features in Azure AD to allow K8s clusters to securely access cloud resources from anywhere, eliminating the need for secrets and keys. Join Christos to learn how to take your K8s clusters to the next level.</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 17:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#ddd">Getting to DDD: Pragmatic or Principled?</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/julie-lerman/">Julie Lerman</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">The Data Farm</span>
  </div>
</div>
<div id="ddd" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Getting to DDD: Pragmatic or Principled?</div><p>Domain-driven design (DDD) is a vast topic. There are so many wonderful concepts, philosophies, patterns, practices, and techniques to learn and benefit from. Some of the best minds in the industry have been tuning these practices for years to ensure developers are able to implement proven, successful approaches to software design. Domain modeling in particular is very specific with guidance on designing and coordinating the dance between the myriad moving parts in our system. Yet learning the principles of DDD can be daunting for developers who are new to it. To encourage and enable more developers to get on the path of DDD, is it reasonable to allow a more pragmatic approach over a principled approach of adhering strictly to DDD guidelines? Should developers be encouraged to start with low-hanging fruit that they can quickly benefit from in their software projects while they continue to learn, to gain a deeper understanding of domain-driven design in order to evolve and adapt their practices as they move closer and closer to the beauty we all know that can be achieved with DDD?</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 18:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#f-sharp">Why F# Works in the Enterprise</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/phillip-carter/">Phillip Carter</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Honeycomb.io</span>
  </div>
</div>
<div id="f-sharp" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Why F# Works in the Enterprise</div><p>F# is a modern .NET language, built by Microsoft and a strong open source community. Although it carries a certain "coolness" factor that's not typically found in enterprise programming, F# has a storied history at Microsoft and other enterprises worldwide. In this talk, Phillip will cover some of that history and then dive into several reasons why F# is a great choice for your next project in an enterprise system. Phillip will cover aspects of the language, tooling, and ecosystem, and finish off with some suggestions for how to easily and safely incorporate F# into your codebase.</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 19:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#mongodb">Introducing MongoDB and .NET: SQL is Not the Only Way</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/luce-carter/">Luce Carter</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">MongoDB</span>
  </div>
</div>
<div id="mongodb" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Introducing MongoDB and .NET: SQL is Not the Only Way</div><p>Once upon a time, relational databases—or RDMS (think SQL)—were the only data store in town. But now there’s a competitor, Document Databases, aka NoSQL. In this talk, you'll learn about the basic differences between them, what MongoDB is, why document databases are so powerful, how MongoDB can be used with .NET, and some really cool use cases that show databases can be cool.</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 20:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#tap">Kubernetes Made Easy with VMware Tanzu Application Platform</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/john-bush/">John Bush</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">VMware</span>
  </div>
</div>
<div id="tap" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Kubernetes Made Easy with VMware Tanzu Application Platform</div><p>Kubernetes may be a powerful platform for running your containerized applications, but that power comes with a steep learning curve. Developers are often required to wrestle with Dockerfiles and walls of YAML to get their application properly deployed. This session will introduce you to VMware Tanzu Application Platform and show how it allows developers to stay focused on the application code and not have to worry about the complexities of containers and Kubernetes.</p></div>
<div class="row py-3 flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/30/2022 21:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#mobile">Mobile DevOps at Scale</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/rodney-littles-ii/">Rodney Littles II</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Megsoft</span>
  </div>
</div>
<div id="mobile" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Mobile DevOps at Scale</div><p>DevOps is a practice that many organizations are using to increase their ability to reliably release software. In the world of mobile applications, we need to ensure that a binary is shipped and that it's in line with server side changes. In this world of binaries and distributed back end systems, how do we handle development operations at scale? Continuous integration, releases, mobile binaries, signing, and testing all matter to an enterprise deploying mobile applications. We'll look at some good practices around how to version, build, test, sign, and release your mobile applications across an enterprise.</p></div>
</div>
<div id="day-2-agenda" class="agenda p-lg-5 p-3">
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 09:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#rest">REST, GraphQL, and gRPC: A Comparison</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/poornima-nayar/">Poornima Nayar</a>
    </h3>
    <span class="company d-block fs-90 opacity-4"></span>
  </div>
</div>
<div id="rest" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">REST, GraphQL, and gRPC: A Comparison</div><p>No matter the industry, applications need to talk to each other. So, developers often build bridges—Application Programming Interfaces (API)—to allow one system to communicate to another.</p><p>Over time, different API architectural styles have been released. Each of them has its own characteristics, patterns of data exchange, pros and cons. REST, GraphQL, and gRPC are three main options when it comes to API development and implementation. In this session, Poornima will cover what REST, GraphQL, and gRPC are from a .NET perspective and give you a comprehensive comparison between them.
</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 10:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#messaging">Messaging for .NET Developers</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/ian-cooper/">Ian Cooper</a>
    </h3>
    <span class="company d-block fs-90 opacity-4"></span>
  </div>
</div>
<div id="messaging" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Messaging for .NET Developers</div><p>In this talk we will look at why we might use messaging, and how we use messaging in a .NET app. <p>We'll start by exploring distribution and why we can think about conversations between processes being synchronous or asynchronous, and exposing functionality or exchanging data. Then we will talk about where messaging fits, and the contexts in which we might prefer it. Along the way we should get a better understanding of messaging compared to alternatives like sharing a database or HTTTP/GRPC.</p><p>Then we will show an example of using messaging in a .NET app.</p><p>Finally, we will give pointers to resources for those who wish to explore this topic in greater detail, now that they have mastered the basics.</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 11:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#misuse">The Hand That Feeds: How to Misuse Kubernetes</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/lewis-denham-parry/">Lewis Denham-Parry</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Control Plane</span>
  </div>
</div>
<div id="misuse" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">The Hand That Feeds: How to Misuse Kubernetes</div><p>We usually trust the hand that feeds, but what happens when we can't trust the hand that feeds us? How do we run applications when there is little to no trust?</p><p>In this session, we're going to start by taking a look at attack paths in and around Kubernetes, acting as a Red Team. We'll take advantage of an OWASP vulnerability within a supply chain attack giving us an entry point. From there, together we'll explore how an attacker can take further control of the cluster via lateral and vertical movements.</p><p>Once we have your attention from seeing how this could be someone's worst day, we'll look at how we can patch this up as a Blue Team. We’ll see what we have available from Kubernetes that can mitigate some of this disaster, and what practices we should put in place to further strengthen and defend our compute.</p><p>From attending this session, you'll leave with a Purple Team understanding of core concepts within Kubernetes, that defence is strengthened with depth, and how we can defend from Script Kiddies to Nation States.</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 12:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#monolith">From Monolith to Service Orientated and Beyond</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/stacy-cashmore/">Stacy Cashmore</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Omniplan</span>
  </div>
</div>
<div id="monolith" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">From Monolith to Service Orientated and Beyond</div><p>In the autumn of 2018, we were faced with an application that wasn't performing and was very hard to change. Deployment was hit and miss almost every time.</p><p>We did the thing that you're warned against (for good reason!) and started from scratch.</p><p>This is our journey on taking that application from technical concept to production: how we included the experience of our team in our initial decisions, the things we learnt as the code was evolving, and during performance testing. And what our plans are for the future to make it even better—and raise our team at the same time!</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 13:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#asp">ASP.NET Basics for Experts</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/jakub-pilimon/">Jakub Pilimon</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">VMware</span>
  </div>
</div>
<div id="asp" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">ASP.NET Basics for Experts</div><p>People love to stay in their comfort zone; but what if you have to step outside of it and embrace a new programming language, one that happens to be ASP.NET?<p><p>Jakub is a Java/Spring developer and architect. He’s never used ASP.NET before and he has questions. Lots of questions.</p><p>Layla, a .NET developer, intends to answer Jakub’s questions and more in this demo-rich session.</p><p>But don’t worry, there will also be something for existing ASP.NET developers as we delve into the ways an ASP.NET application is configured to support services:</p><ul><li>Dependency injection and inversion of control</li><li>HTTP clients and policies</li><li>Resiliency and circuit breakers</li><li>Databases connections</li><li>Discovery clients</li><li>And more!</li></ul>
</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 14:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#observability">Observability for .NET Applications</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/hananiel-sarella/">Hananiel Sarella</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">VMware</span>
  </div>
</div>
<div id="observability" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Observability for .NET Applications</div><p>Distributed application architectures enable enterprises to easily scale their applications to meet increasing growth and demand. At the same time, the very technology choices that make it easy to build at scale also make it more challenging to maintain at scale. The maintainability of a system is directly dependent on the ability to infer its internal states from available data.</p><p>This session will focus on using the fully OSS project OpenTelemetry to add observability to modern cloud native .NET applications and getting the insight and data needed to maintain enterprise applications. We'll see how the three pillars of observability (traces, metrics, and logs) together provide the solid foundation needed to make production your favorite place on the internet!</p></div>
<div class="row py-3 border-bottom flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 15:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#yarp">Simplifying Microservice Security with YARP</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/andrew-stakhov/">Andrew Stakhov</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">VMware</span>
  </div>
</div>
<div id="yarp" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Simplifying Microservice Security with YARP</div><p>With constantly emerging attack vectors, evolving security standards, inherent complexity in implementation libraries, and lack of general security expertise, it's no wonder teams are scratching their heads when trying to secure their microservices. With API gateways becoming a common pattern to consolidate API surface, there's a golden opportunity to offload some of the security complexity into a centralized place. This session will look at how Microsoft's new .NET library called Yet Another Reverse Proxy (YARP) can be used to secure applications in a variety of scenarios.</p><p>Attendees will learn how to use YARP to create a uniform API surface for their apps, apply different security strategies, integrate with Federated Identity providers with OpenID Connect, and bridge line-of-business application security requirements with those of the greater organization.</p></div>
<div class="row py-3 flex-nowrap">
  <div class="time col-2 pl-0 h4"><script>convertTime("3/31/2022 16:00 UTC")</script></div>
  <div class="talk-title col-5 h4"><a class="lightbox" href="#enterprise">Your Enterprise Open Source Journey</a></div>
  <div class="col-sm-1 col-0 px-0"></div>
  <div class="name col-4">
    <h3 class="h4 py-0">
      <a href="/developer/team/jeff-fritz/">Jeff Fritz</a>
    </h3>
    <span class="company d-block fs-90 opacity-4">Microsoft</span>
  </div>
</div>
<div id="enterprise" class='p-md-5 p-3' style='display: none;width:600px;max-width:100%;'><div class="h3 text-white">Your Enterprise Open Source Journey</div><p>Open source software has been in the tech news a lot over the past 12 months. Sometimes it's been for good reasons, and sometimes for bad. No matter how you approach it, your enterprise is now part of the open source community. How do you accept new software, plan for upgrades, and contribute to those projects? In this talk, Jeff Fritz will pilot you through onboarding, maintenance strategies, and inventory management for working with open source software.</p></div>
</div>