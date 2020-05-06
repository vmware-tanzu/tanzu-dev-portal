---
title: APIs
featured: true
weight: 1
description: >
    API design, implementation, and operation. Everything from the basics of REST to building an API from scratch.
---


The Application Programming Interface, or API, defines the language that other applications can use to talk to your service. APIs expose your data, as well as define the data structures and formats that they should expect and provide. You're probably consuming APIs more than you even realize, even if it is indirectly. If you open up the weather application on your phone, it probably makes an API call for the latest weather. When you order food from your favorite restaurant, it's sending an API call to their backend order service. You know those daily Cat Facts texts that you get sent? Likely that provider is reaching out to an API provided by somebody else to send the text message.

While “API” does not necessarily mean REST API, in the world of microservices, it’s the most common meaning. Being able to expose your microservice in an easy-to-consume but safe manner—quickly and easily—is a hard balancing act, but knowing the fundamentals can really help.

Not only does the development of these services pose certain challenges, but the operation of them does, too. Like most applications, the more you adhere to best practices while writing your code, the easier it will be when it comes time to run it. If you’re new to microservices, there’s been lots of discussion around this very topic and while there are many differing opinions, some  are more agreed upon than others. The [Twelve Factor Application](https://12factor.net/), for example, offers a number of applicable suggestions.

Security is also a huge but often overlooked aspect of developing an API. Securing an API involves things such as authentication, authorization, and encryption, but also the basics, like design and implementation. And as with any application you’re developing, [security should be top of mind even before you type the first line of code](https://tanzu.vmware.com/content/practitioners/slaying-the-hydra-the-multi-headed-beast-that-is-api-security). If you’re looking for a rundown of related issues, make sure to give the [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) a read!

Once you begin to consider design, operation, and security, it may become quite daunting. Not to worry; there are a lot of great resources out there for anyone looking to learn more. Those new to designing APIs should make sure to give [Principles of Designing & Developing an API Product](https://tanzu.vmware.com/content/practitioners/principles-of-designing-developing-an-api-product-part-1-of-4) a read, as it walks you through the design and implementation of a service from start to finish. In addition, you’ll find lots of resources below, for everything from the [Basics of REST](/guides/microservices/basics-of-rest) to [Deconstructing the Monolith](/guides/microservices/deconstructing-the-monolith) all the way to [Using Spring Boot to Build a REST API](../../guides/spring/spring-build-api) and more!
