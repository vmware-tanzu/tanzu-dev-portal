+++
glyph = "fa-file-text-o"
tags = ["configuration", "options", "dependency injection"]
categories = ["recipes"]
date = "2017-01-05T08:53:46-05:00"
title = "Static Config to DI Options"
summary = "Replacing Static Configuration Settings with DI-Managed Options"
taxonomy = ["CLIENT", "DOT_NET"]
+++

## Legacy Code

During the course of replatforming the application, we refactored out the use of a static configuration classes (e.g one called `ConfigSettings`). In the original code, anytime a class needed information about how certain things were configured, the class would simply make a call to a static property on the `ConfigSettings` class and query the configuration value from there.

For example, if the `CacheDictionary` needed to know if caching was enabled, it could query `ConfigSettings.EnableCaching`. On the surface this looks like a good idea, but it becomes problematic when trying to convert an application to be cloud native.

## Problems with Statics

Not all static code is bad. After all, there are a number of static methods available throughout the .NET Framework, but these methods do not carry state, they do not rely upon anything else in order to perform their function, and they are always idempotent and usable in isolation.

The problem we needed to solve with `ConfigSettings` was that its use was proliferated throughout the codebase, creating a tight coupling we didn't like. More importantly, its use made testing either difficult or physically impossible. When using a static, that static has to be set _before_ anything that relies upon it invoked. This can cause myriad problems, _especially_ when running in a CI build which is likely to execute multiple tests concurrently.

If you need to run one test with a configuration value set to **X** and another test with a configuration value set to `Y` and these tests run in parallel, the use of a static becomes a blocker.

Finally, the use of statics like this makes it very difficult to allow for environment overriding of configuration values, and this is mandatory for cloud native applications to function properly in Cloud Foundry.

## Removing Statics with DI Options

The solution to the problem was to take the values wrapped by `ConfigSettings` and replace them with the use of a POCO class that is read from the configuration system and made injectable via the `IOptions<T>` mechanism. We inject the options into any class that needs them via constructor injection, and then we simply pass these values down into any classes that are not lifetime managed by dependency injection.

First, we can just add a custom section to our `appsettings.json` file (remember, this file is only for local defaults):

```json
{
  "Custom": {
    "PropertyOne" : "Value1",
    "PropertyTwo" : "Value2"
  }
}
```

And then in our startup to read the `Custom` section from the configuration system into an injectable `IOptions<Custom>`, we can configure it as follows by adding this to the `ConfigureServices` method in `Startup`:

```c#
services.Configure<Custom>(Configuration.GetSection("Custom"));
```

## References

Here are some links to to additional information:

* [http://misko.hevery.com/2008/12/15/static-methods-are-death-to-testability/](http://misko.hevery.com/2008/12/15/static-methods-are-death-to-testability/)
* [.NET Core Documentation on Configuration with Options](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration#using-options-and-configuration-objects)
