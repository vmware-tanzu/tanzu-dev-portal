---
title: Top-Level Statements in .NET 6
slug: dotnet6-top-level-statements
description: The Startup class was the place to register all of the application’s dependencies, set up the middleware, and of course, configure the configuration. Yet, in .NET 6, all of that changed with the launch of top-level statements.
tags:
- Dot NET
team:
- Layla Porter
date: '2022-05-23'
publishDate: '2022-05-23'
og_image: "/blog/dotnet6-top-level-statements/images/cover.jpg"
languages:
- dotnet
---

When the community first saw .NET 6 there was a little bit of uproar, myself included, about how the way we structured web applications had changed.

In earlier versions of .NET Core, we had grown familiar with the symbiotic relationship between the Startup and Program classes. We even engineered ways to add a Startup class to Azure Functions and console applications.

![Cover image of a stack of four rocks on a wooden table](images/cover.jpg)

The Startup class was the place to register all of the application’s dependencies, set up the middleware, and of course, configure the configuration.

Yet, in .NET 6, all of that changed with the launch of top-level statements. By making the program’s entry point a static method, the new Program class could relinquish its hold on ceremony including all of the set up we used to do in the Startup class—so no more Startup class!

The Program class now looks like this:

``` csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
```
I haven’t omitted any code—this is the entirety of the Program file from a webAPI template project.

The program looks far more like a script and it starts by creating a `WebApplication` object called `builder`.

You can add any services, whether user-defined or framework, to the Inversion of Control (IoC) container to the builder, which has an `IServiceCollection` within it called `Services`.

This section of code has replaced the `ConfigureServices` method in Startup.

Then, once everything has been added, the `builder` is built into a `WebApplication` object called `app`.  

All of our configuration and middleware, such as mapping endpoints to controllers, can be added to the app object before we finally run the web app.

This section of code has replaced the `Configure` method in Startup.

## Other changes in .NET 6

You may also notice a lack of `using` directives. This is due to the inclusion of [global using directives](/blog/new-global-usings-in-csharp-10/), which is part of C#10.

Another interesting addition to .NET 6 is the inclusion of file-scoped namespaces. Traditionally, code within a namespace would need scoping braces like this:

```csharp
namespace SomeNamespace
{
    // code scoped in the namespace
}
```

This would require that all of the code within that file  be indented at least once. However, withfile-scoped namespacing, you can rid yourself of the braces and your code looks like this:

```csharp
namespace SomeNamespace;
// code scoped in the namespace
```

You can still use scoping braces, especially if you wish to scope multiple namespaces within a single file, you just don’t *have* to.

In the six months or so since .NET 6 was released, I have come to really appreciate these simple but effective changes. I am no longer feeling bereft of the Startup class, in fact, I am quite glad it’s gone.

As always, let me know your thoughts and opinions in any of the following ways:

Email: [laylap@vmware.com](mailto:laylap@vmware.com)  
Twitter: [@LaylaCodesIt](http://twitter.com/laylacodesit)  
GitHub: [layla-p](https://github.com/Layla-P)  
Twitch: [LaylaCodesIt](https://www.twitch.tv/laylacodesit/)  
YouTube: [LaylaCodesIt](https://www.youtube.com/channel/UCrgujxhBlukMz4YH-o1cogQ)  