+++
categories = ["recipes"]
tags = ["[foo]"]
summary = "Recipe Summary"
title = "Custom Log Provider"
date = 2018-05-29T08:08:05-05:00
+++

## When To Use This Recipe

This recipe should be followed when logging requirements cannot be satisfied by any of the .NET Core logging providers contained within in the Microsoft.Extensions.Logging package. Typically, this should only be required when migrating legacy logging concerns. For green field efforts, the design decision to roll custom logging should be scrutinized; most of the popular logging frameworks (NLog, Serilog, etc) have provided Extensions for .NET Core.

## Overview

All logging operations in .NET are performed via the `ILogger` interface:

```c#
namespace Microsoft.Extensions.Logging
{
    public interface ILogger
    {
        bool IsEnabled(LogLevel logLevel);

        IDisposable BeginScope<TState>(TState state);

        void Log<TState>(
            LogLevel logLevel, 
            EventId eventId, 
            TState state, 
            Exception exception, 
            Func formatter
        );
    }
}
```

Microsoft’s logging package provides a number of built-in `ILogger` implementations.  For example, the `ConsoleLogger` allows for logging to `stdout`, while `EventLogLogger` pushes log messages to the Windows Event Log.  Both loggers are included in Microsoft’s base logging package, `Microsoft.Logging.Extensions`.

The `ILoggerProvider` interface provides an API for instantiation and configuration of an `ILogger` instance:

```c#
namespace Microsoft.Extensions.Logging
{
    public interface ILoggerProvider : IDisposable
    {
        ILogger CreateLogger (string categoryName);
    }
}
```

An `ILoggerProvider` is responsible for instantiation, configuration and shutdown/cleanup (via `IDisposable`) of one or more `ILogger` implementations.  For example, an `ILoggerProvider` implementation for a database-based logger might do things like verify database connectivity, or ensure the existance of certain tables/views as part of startup.  These types of tasks can (and should) be handled by the `ILoggerProvider` implementation, while the `ILogger` implementation is left to do what it does best (logging).

Now that we’re familiar with the subject matter, we can break down our custom logger into two high level tasks:

1. Implement `ILogger`
2. Implement `ILoggerProvider`

## Implementation

### ILogger

A custom logger can be created by implementing the `ILogger` interface as shown in the following code snippet:

```c#
public class CustomLogger : ILogger {
    public CustomLogger() { }

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception exception,
        Func<TState, Exception, string> formatter
    ){

        var msg = formatter(state, exception);
        var json = JsonConvert.SerializeObject(new
        {
            logLevel = logLevel,
            eventId = eventId,
            logDateTimeUtc = DateTime.UtcNow,
            details = msg,
            exception = exception
        });
        Console.WriteLine(json);
    }
}
```

By injecting an existing logger implementation as the final destination we can vector our custom logger output to any supported (or future) `ILogger`.

### ILoggerProvider

An `ILoggerProvider` implementation must be created in order to obtain a configured instance of our ILogger at runtime:

```c#
public class CustomLoggerProvider : ILoggerProvider
{
    ILogger m_logger;
    IConfiguration m_config;
    private bool m_disposed = false; // To detect redundant calls

    public CustomLoggerProvider(IConfiguration configuration)
    {
        m_config = configuration;
    }

    public ILogger CreateLogger(string categoryName)
    {
        if (null == m_logger)
        {
            // do some work against config to initialize logging

            m_logger = new CustomLogger();
        }

        return m_logger;
    }

    #region IDisposable Support

    protected virtual void Dispose(bool disposing)
    {
        if (!m_disposed)
        {
            if (disposing)
            {
                m_logger = null;
            }

            m_disposed = true;
        }
    }

    // This code added to correctly implement the disposable pattern.
    public void Dispose()
    {
        Dispose(true);
    }

    #endregion
}
```

### Test it!

Ensure that our provider is creating the expected logger implementation:

```c#
using System;
using Xunit;

namespace Providers.Logging
{
    public class LoggerProviderTests
    {
        [Fact]
        public void TestLoggerProviderCreatesCustomLogger(){
            var provider = new CustomLoggerProvider(null);
            var logger = provider.CreateLogger("any");
            Assert.True(logger is CustomLogger);
        }
    }
}
```

### Use it!

With our own `ILogger` and `ILoggerProvider` components completed, we can inject our new implementation into .NET Core WebAPI/MVC projects by tapping into the logging factory during startup (the highlighted line):

{{<highlight csharp "hl_lines=32">}}
namespace My.WebAPI{
	// includes our custom logging lib
    using Providers.Logging;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();

            loggerFactory.AddConsole()
                         .AddDebug()
                         .AddProvider(new CustomLoggerProvider(Configuration));
        }
    }
}
{{</highlight>}}
