+++
categories = ["recipes"]
date = "2016-12-08T08:42:25-05:00"
glyph = "fa-file-text-o"
summary = "Logging in the Cloud and .NET Core - Patterns and Practices"
tags = ["logging", "cloud native"]
title = "Logging PCF & .NET Core"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe will provide a brief discussion of logging in .NET Core. Since this is a topic that is fairly generic we will provide links to the appropriate documentation from Microsoft.

## Using the Logging Extensions

The best place to start learning about the new logging extensions is the [Microsoft documentation - Logging](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging).

## Getting a Logger Reference

We _strongly_ recommend that the best practice of using dependency injection be used to allow instances of `ILogger` to be passed to a class instance at constructor time. This frees the developer from the burden of having to figure out how to name a particular logger. When injected, the `ILogger<T>` instances are already configured to have a category with the same name as the fully qualified class name.

If you want to use a different naming convention then you are free to write your own wrapper around the `LoggerFactory` class, but you should _not_ be using things log `log4n` or other frameworks that carry a lot of bloat around things like file persistence, log file rotation, backup files, etc.

Here is some sample code that illustrates getting an instance of a logger and using that instance within a DI-managed class (code is from a sample in a forthcoming book on .NET Core microservices):

```c#
public AMQPEventEmitter(
    ILogger<AMQPEventEmitter> logger,
    IOptions<CloudFoundryServicesOptions> servicesOptions)
{
    this.logger = logger;

    // ... initialization

    logger.LogInformation("AMQP Event Emitter configured with URI {0}", rabbitServiceBinding.Credentials["uri"].Value);
}
```

## Using Log Scopes

Log scopes allow you to prefix all log messages within a given scope with information on that scope. This means that for all log messages emitted during an HTTP request, regardless of how deep within the class hierarchy and call stack, those messages will all contain the same scope-metadata prefix. This kind of information can be invaluable in diagnosing problems and sifting through complicated logs when you don't have a robust correlation system downstream.

Here's some sample code that enables scopes for a given provider (debug doesn't support scopes):

```c#
public void Configure(
    IApplicationBuilder app,
    IHostingEnvironment env,
    ILoggerFactory loggerFactory)
{
    loggerFactory
        .AddConsole(includeScopes: true)
        .AddDebug();
    ...
}
```

And to utilize the scope, you frame your scope with a `using` statement:

```c#
public IActionResult GetById(string id)
{
    TodoItem item;
    using (_logger.BeginScope("Message attached to logs created in the using block"))
    {
        _logger.LogInformation(LoggingEvents.GET_ITEM, "Getting item {ID}", id);
        item = _todoRepository.Find(id);
        if (item == null)
        {
            _logger.LogWarning(LoggingEvents.GET_ITEM_NOTFOUND, "GetById({ID}) NOT FOUND", id);
            return NotFound();
        }
    }
    return new ObjectResult(item);
}
```

This will result in output to the console that looks like the following:

```shell
info: TodoApi.Controllers.TodoController[1002]
      => RequestId:0HKV9C49II9CK RequestPath:/api/todo/0 => TodoApi.Controllers.TodoController.GetById (TodoApi) => Message attached to logs created in the using block
      Getting item 0
warn: TodoApi.Controllers.TodoController[4000]
      => RequestId:0HKV9C49II9CK RequestPath:/api/todo/0 => TodoApi.Controllers.TodoController.GetById (TodoApi) => Message attached to logs created in the using block
      GetById(0) NOT FOUND
```

## Cloud Native Logging

As has been discussed many times, the only way to ensure proper functioning of logs within a Cloud Foundry foundation is to log _only_ to the console. You can emit errors, information, debug, trace, and various levels of logging as per the Microsoft documentation, but you should _never_ add any other destinations to your logs.

In other words, the only methods you should invoke on the logger factory instance are `AddConsole` and `AddDebug`.
