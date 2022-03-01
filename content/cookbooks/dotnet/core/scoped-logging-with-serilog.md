+++
title = "Scoped Logging w/ Serilog"
date = 2018-08-08T20:02:01-05:00
+++

## Scoped logging with Serilog/Microsoft `ILogger`

The sample application, [here](https://github.com/pivotalservices/scoped_logging_with_serilog), lets you understand how to integrate Serilog with Microsoft `ILogger`, including scoped context (for both Serilog and Microsoft console loggers)

### Why we need scopped logging?

In case of distributed systems, if you need to track logs for a particular request across the systems, it will be very challenging to find the exact logs associated with that particular request. This allows you to add any unique identifier so that you can track the log message across the systems. Another good example of application would be, tracking logs across distributed transaction across database systems.


### How to enable scopped logging using Microsoft `ILogger` (with or without Serilog integration) in a .NET Core application?

### 1. Using Microsoft `ILogger` only

- Nuget package required (version depends on sdk framework, preferebly the latest one): `   Microsoft.Extensions.Logging`

- In `Program.cs`, add the console logger under `ConfigureLogging` extension method as below 

```c#
.ConfigureLogging((builderContext, loggingBuilder) =>
{
    loggingBuilder.AddConfiguration(builderContext.Configuration.GetSection("Logging"));
    loggingBuilder.AddConsole((options) =>
    {
    options.IncludeScopes = Convert.ToBoolean(builderContext.Configuration["Logging:IncludeScopes"]);
    });
})
```

- In `Startup.cs`, under `ConfigureServices` method, add the below code to inject LoggerFactory into the service collection

```c#
services.AddLogging();
```

- Add the below section in `appsettings.json`, which sets the log levels and scopes as needed (In Microsoft Logging, Scoping will be enabled only if `Logging:IncludeScopes` is true)

```json
"Logging": {
    "IncludeScopes": true,
    "LogLevel": {
        "Default": "Information",
        "System": "Warning",
        "Microsoft": "Warning",
        "Pivotal": "Warning",
        "Steeltoe": "Warning"
    }
}
```

- Create a middleware which creates a log scope based on a log state as below under the invoke operation, for complete details, please refer to `ScopedLoggingMiddleware.cs` in the sample application

```c#
using (logger.BeginScope($"CorrelationID:{CorrelationID}"))
{
    await next(context);
}
```

- Now add `ILogger<T>` in any of the classes that requires logging, and add logging statements as necessary, refer to `ValuesController.cs` in the sample application for the exact implementation. Sample code snippet below.

```c#
private readonly ILogger<ValuesController> logger;

public ValuesController(ILogger<ValuesController> logger)
{
    this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
}

[HttpGet]
public ActionResult<IEnumerable<string>> Get()
{
    logger.LogInformation("Log something here......");
    return new string[] { "value1", "value2" };
}
```

- Now we are all set to run and test the application, when you run the application you will see that all the logs under a single scope will be grouped by the unique/correlation id, as below. Here CorrelationID is the property we set as unique identifier for a request

```shell
info: Scoped.logging.Serilog.Controllers.ValuesController[0]
  => ConnectionId:0HLFTAFDRCVND => RequestId:0HLFTAFDRCVND:00000001 RequestPath:/api/values/12 => CorrelationID:c00d1372-6b4f-402b-9666-0f93894a261e => Scoped.logging.Controllers.ValuesController.Get (Scoped.logging)
  Returning values '12' that was received
```

### 2. Using Microsoft `ILogger` integrated with Serilog (Using `Microsoft.Logger.BeginScope()`)

- Nuget package required (preferebly the latest one)

```xml
<PackageReference Include="Serilog.Extensions.Logging" Version="2.0.2" />
<PackageReference Include="Serilog.Sinks.Console" Version="3.1.2-dev-00777" />
<PackageReference Include="Serilog.Settings.Configuration" Version="2.6.1" />
```

- In `Program.cs`, make sure you use the `DefaultWebHostBuilder` or add configuration providers under `ConfigureAppConfiguration` extension method as below 

```c#
.ConfigureAppConfiguration((builderContext, config) =>
{
    config.SetBasePath(builderContext.HostingEnvironment.ContentRootPath)
        .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: false)
        .AddEnvironmentVariables();
})
```

- In `Startup.cs`, under the constructor, add the below code to create the serilog logger, based on the configuration provided in `appsettings.json`. `Serilog.Settings.Configuration` package enables the logger creater based on a given configuration 

```c#
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();
```

- In `Startup.cs`, under `ConfigureServices` method, add the below code to inject `LoggerFactory` with serilog as logging provider into the service collection

```c#
services.AddLogging((builder) => 
{
    builder.AddSerilog(dispose: true);
});
```

- Add the below section in `appsettings.json`, which sets the log levels and other configurations as below. Here you can setup your own output template with your own custom properties, which need to part of scopped logging for a particular request. In this sample, I have used `CorrelationID` as my custom property.

- `MinimumLevel:Default` - default log level
- `MinimumLevel:Override` - overrides on default log level
- `WriteTo:Name` - you are injecting Console logger (from `Serilog.Sinks.Console` package to enable console logging)
- `WriteTo:Args:outputTemplate` - your own logging template, please note the way I setup `CorrelationID` here, you can add any more as needed

```json
"Serilog": {
    "MinimumLevel": {
        "Default": "Information",
        "Override": {
            "Microsoft": "Warning",
            "System": "Warning",
            "Pivotal": "Warning",
            "Steeltoe": "Warning"
        }
    },
    "WriteTo": [
    {
        "Name": "Console",
        "Args": {
        "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss}|{Level} => CorrelationID:{CorrelationID} => RequestId:{RequestId} => RequestPath:{RequestPath} => {SourceContext}{NewLine}    {Message}{NewLine}{Exception}"
        } 
    }
    ]
    ,
    "Enrich": [
    "FromLogContext"
    ]
}
```

- Create a middleware which creates a log scope based on a log state as below under the invoke operation, for complete details, please refer to `ScopedLoggingMiddleware.cs` in the sample application

```c#
var loggerState = new Dictionary<string, object>>
{
    ["CorrelationID"] = "your unique id value here"
    //Add any number of properties to be logged under a single scope
};

using (logger.BeginScope<Dictionary<string, object>>(loggerState))
{
    await next(context);
}
```

- In `Startup.cs`, under `Configure` method, add the below code to use the middleware you created, at the very begining of the request pipeline

```c#
app.UseMiddleware<ScopedLoggingMiddleware>();
```

- Now add `ILogger<T>` in any of the classes that requires logging, and add logging statements as necessary, refer to `ValuesController.cs` in the sample application for the exact implementation. Sample code snippet below.

```c#
private readonly ILogger<ValuesController> logger;

public ValuesController(ILogger<ValuesController> logger)
{
    this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
}

[HttpGet]
public ActionResult<IEnumerable<string>> Get()
{
    logger.LogInformation("Log something here......");
    return new string[] { "value1", "value2" };
}
```

- Now we are all set to run and test the application, when you run the application you will see that all the logs under a single scope will be grouped by the unique/correlation id, as below. Here `CorrelationID` is the property we set as unique identifier for a request

```shell
2018-08-08 13:24:55|Information => CorrelationID:c00d1372-6b4f-402b-9666-0f93894a261e => 
RequestId:0HLFTAFDRCVND:00000001 => RequestPath:/api/values/12 => 
Scoped.logging.Serilog.Controllers.ValuesController
```

### 3. Using Microsoft `ILogger` integrated with Serilog (Using `Serilog.LogContext.PushProperty()` enrichment)

- This method will be useful if you are using any custom `ILogger` interface other than Microsoft `ILogger`

- Nuget package required (preferebly the latest one)

```xml
<PackageReference Include="Serilog.Extensions.Logging" Version="2.0.2" />
<PackageReference Include="Serilog.Sinks.Console" Version="3.1.2-dev-00777" />
<PackageReference Include="Serilog.Settings.Configuration" Version="2.6.1" />
```

- In `Program.cs`, make sure you use the `DefaultWebHostBuilder` or add configuration providers under `ConfigureAppConfiguration` extension method as below 

```c#
.ConfigureAppConfiguration((builderContext, config) =>
{
    config.SetBasePath(builderContext.HostingEnvironment.ContentRootPath)
        .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: false)
        .AddEnvironmentVariables();
})
```

- In `Startup.cs`, under the constructor, add the below code to create the serilog logger, based on the configuration provided in `appsettings.json`. `Serilog.Settings.Configuration` package enables the logger creater based on a given configuration 

```c#
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();
```

- In `Startup.cs`, under `ConfigureServices` method, add the below code to inject `LoggerFactory` with serilog as logging provider into the service collection

```c#
services.AddLogging((builder) => 
{
    builder.AddSerilog(dispose: true);
});
```

- Add the below section in `appsettings.json`, which sets the log levels and other configurations as below. Here you can setup your own output template with your own custom properties, which need to part of scopped logging for a particular request. In this sample, I have used `CorrelationID` as my custom property.

- `MinimumLevel:Default` - default log level
- `MinimumLevel:Override` - overrides on default log level
- `WriteTo:Name` - you are injecting Console logger (from `Serilog.Sinks.Console` package to enable console logging)
- `WriteTo:Args:outputTemplate` - your own logging template, please note the way I setup `CorrelationID` here, you can add any more as needed

```json
"Serilog": {
    "MinimumLevel": {
        "Default": "Information",
        "Override": {
            "Microsoft": "Warning",
            "System": "Warning",
            "Pivotal": "Warning",
            "Steeltoe": "Warning"
        }
    },
    "WriteTo": [
    {
        "Name": "Console",
        "Args": {
        "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss}|{Level} => CorrelationID:{CorrelationID} => RequestId:{RequestId} => RequestPath:{RequestPath} => {SourceContext}{NewLine}    {Message}{NewLine}{Exception}"
        } 
    }
    ]
    ,
    "Enrich": [
    "FromLogContext"
    ]
}
```

- Create a middleware which creates a log scope using `LogContext.PushProperty()` enricher as below, under the invoke operation, for complete details, please refer to `ScopedSerilogSpecificLoggingMiddleware.cs` in the sample application. Nest as many as usings for addidional properties

```c#
using(LogContext.PushProperty("CorrelationID", correlationId, true))
{
    await next.Invoke(context);
}
```

- In `Startup.cs`, under `Configure` method, add the below code to use the middleware you created, at the very begining of the request pipeline

```c#
app.UseMiddleware<ScopedSerilogSpecificLoggingMiddleware>();
```

- Now add `ILogger<T>` in any of the classes that requires logging, and add logging statements as necessary, refer to `ValuesController.cs` in the sample application for the exact implementation. Sample code snippet below.

```c#
private readonly ILogger<ValuesController> logger;

public ValuesController(ILogger<ValuesController> logger)
{
    this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
}

[HttpGet]
public ActionResult<IEnumerable<string>> Get()
{
    logger.LogInformation("Log something here......");
    return new string[] { "value1", "value2" };
}
```

- Now we are all set to run and test the application, when you run the application you will see that all the logs under a single scope will be grouped by the unique/correlation id, as below. Here `CorrelationID` is the property we set as unique identifier for a request

```shell
2018-08-08 13:24:55|Information => CorrelationID:c00d1372-6b4f-402b-9666-0f93894a261e => 
RequestId:0HLFTAFDRCVND:00000001 => RequestPath:/api/values/12 => 
Scoped.logging.Serilog.Controllers.ValuesController
```

### 4. Adding filters in Serilog

- Nuget package required (preferebly the latest one)

```xml
<PackageReference Include="Serilog.Filters.Expressions" Version="2.0.0" />
```

- In the `appsettings.json`, add configuration section as below. For more details on filtering, please refer to [Serilog Filters Expressions](https://github.com/serilog/serilog-filters-expressions/blob/dev/README.md). Refer to the sample for exact implementation

```json
"Filter": [
  {
    "Name": "ByExcluding",
    "Args": {
      "expression": "Contains(@Message, '*log to filter out*')"
    }
  }
]
```

##### Hope you had fun!
