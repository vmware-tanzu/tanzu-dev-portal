+++
summary = "Using Spring Config Server from within Legacy .NET Framework applications."
title = "Steeltoe and Config Server on Legacy Framework"
date = 2018-07-13T11:13:49-04:00
+++

## When To Use This Recipe

This recipe should be followed when applications built on legacy .NET Framework (“non-Core” apps) require configurations provided by Spring Config Server via the Steeltoe extensions for .NET Core. 

## Overview

Steeltoe extensions provide a great deal of convenience for .NET developers pushing to Cloud Foundry environments. One of the more popular configuration options Steeltoe provides is Spring Config Server interoperability. While Steeltoe was built with .NET Core in mind, leveraging Steeltoe’s Config Server capabilities is possible from within the confines of legacy ASP.NET.  

## Step by Step

### WebAPI Project Setup

Create a new solution and add a .NET Framework Web API Project - to follow this example verbatim, name the project `FullFrameworkWebApi`. Add a folder to the solution called `Configuration`.

### Nuget References

Add the following NuGet packages to your solution:

- `Pivotal.Extensions.CloudFoundry.ConfigServerCore` version `2.0.1`
- `Microsoft.Extensions.Options` version `2.1.0`
- `Microsoft.Extensions.DependencyInjection` version `2.1.0`
 
### Add `appsettings.json`

Add an `appsettings.json` file to your project’s root directory:

```json
{
    "Logging": {
        "IncludeScopes": false,
        "Debug": {
            "LogLevel": {
                "Default": "Warning"
            }
        },
        "Console": {
            "LogLevel": {
                "Default": "Warning"
            }
        }
    }
}
```

### Create a Wrapper

Add a class called `SteeltoeConfigurationManager` to the `Configuration` folder in your project:

```c#
using System;

using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Steeltoe.Extensions.Configuration.CloudFoundry;
using Pivotal.Extensions.Configuration.ConfigServer;

namespace FullFrameworkWebApi.Configuration
{
    public class SteeltoeConfigManager {

    }
}
```

### Load configuration

Add a new static property, `Configuration` with a return type of `IConfiguration`; ensure the setter is private to the class:

```c#
public static IConfiguration Configuration { get; private set; }
```

Next, add a static initializer for the class and setup configuration using a `ConfigurationBuilder`:

```c#
static SteeltoeConfigManager()
{
	Configuration = new ConfigurationBuilder()
				.AddJsonFile(“appsettings.json”)
				.AddEnvironmentVariables() // bootstrap config-server
				.AddCloudFoundry()
				.AddConfigServer()
				.AddEnvironmentVariables() // override config-server
				.Build();
}
```

At this point we’ll be able to access the configuration data contained in our `appsettings.json` by accessing `SteeltoeConfigManager.Configuration`. Once we push to cloud foundry we’ll also have access to the vcap settings added by the call to `AddCloudFoundry()`.  We’ll also have access to any config server settings if we’re bound to a config server, and finally, any environment variables will be layered into configuration.  So far so good.

#### Noteworthy

Notice that the previous code snippet includes two calls to the `AddEnvironmentVariables()` extension method of the `ConfigurationBuilder`. The first call is decorated with the comment “bootstrap config-server” and the second call is decorated with the comment “override config-server”. The first call exists to do what is implied by its comment; config-server requires some minimal information to bootstrap (such as active profiles, auth tokens, etc). Such settings used for bootstrapping can be stored in `appsettings.json` or in the Environment, so we need to ensure both are added prior to config-server. Once config-server is added, we want to ensure that any variables defined directly in our environment continue to override any settings brought down from config-server. Therefore, it is necessary to call `AddEnvironmentVariables()` before we invoke `AddConfigServer()` and then once again after we’ve invoked `AddConfigServer()`.

### Load Options

In order to make our wrapper more useful we have to enable configuration options. Configuration Options require use of the Dependency Injection framework provided by .NET core, so first we have to set up a service provider with options enabled.  To do this, we’ll add a new private static member, `m_serviceProvider`, as well as a few lines of code to the type initializer:

{{<highlight cs "hl_lines=12-17">}}
private static IServiceProvider m_serviceProvider;

static SteeltoeConfigManager()
{
	Configuration = new ConfigurationBuilder()
							.AddJsonFile(“appsettings.json”)
							.AddEnvironmentVariables() // bootstrap config-server
							.AddCloudFoundry()
							.AddConfigServer()
							.AddEnvironmentVariables() // override config-server
							.Build();

	m_serviceProvider = new ServiceCollection()
                                .AddConfiguration(Configuration)
                                .AddOptions()
                                .ConfigureCloudFoundryOptions(Configuration)
                                .BuildServiceProvider();
}
{{</highlight>}}

The call to `AddOptions()` enables the Configuration Options dependencies; the call to `ConfigureCloudFoundryOptions(Configuration)` binds our configuration to the Steeltoe types `CloudFoundryServicesOptions` and `CloudFoundryApplicationOptions`, which we’ll leverage below.

### Add Cloud Foundry Options

With Dependency Injection set up we can utilize the `IServiceProvider` we created during type initialization to retrieve the Cloud Foundry options we enabled.  There are two flavors of Cloud Foundry options:  `CloudFoundryServicesOptions` and `CloudFoundryApplicationOptions`.  `CloudFoundryServicesOptions` contain the values loaded from Cloud Foundry’s `VCAP_SERVICES` environment variable whereas the `CloudFoundryApplicationOptions` contains the values in `VCAP_APPLICATION`.  To expose these bound configurations to our legacy app, we’ll add two new properties:

```c#
public static CloudFoundryServicesOptions CloudFoundryServicesOptions
{
    get 
    {
        return m_serviceProvider
                .GetRequiredService<IOptionsSnapshot<CloudFoundryServicesOptions>>()
                .Value; 
    }
}

public static CloudFoundryApplicationOptions CloudFoundryApplicationOptions
{
    get 
    { 
        return m_serviceProvider
                .GetRequiredService<IOptionsSnapshot<CloudFoundryApplicationOptions>>()
                .Value; 
    }
}
```

Notice that the services we locate are both of type `IOptionsSnapshot<T>`, where T is provided as `CloudFoundryApplicationOptions` or `CloudFoundryServicesOptions`.  Using `IOptionsSnapshot<T>` instead of `IOptions<T>` ensures that the options we load are rebound if configuration changes at runtime.  Returning the value of the generic `IOptionsSnapshot<>` instances conceals this from the caller and simplifies our programming model.

### Try it

To see the results of our work we’ll add a new controller to our legacy WebAPI project:

```c#
using System.Web.Http;
using Configuration;
using System.Web.Mvc;

namespace FullFrameworkWebApi.Controllers
{
    public class ConfigBrowserController : ApiController
    {
        // GET api/values
        public JsonResult Get()
        {
            return new JsonResult() { Data = SteeltoeConfigManager.CloudFoundryServicesOptions.Services };
        }
    }
}
```

The above controller action will print the contents of `CloudFoundryServicesOptions.Services` to the screen in JSON format.  

Since we’re returning JSON, we’ll also want to modify our `WebApiConfig` to use a JSON formatter; to make it readable, we’ll set `Indent = true` on construction:

{{<highlight cs "hl_lines=10-12">}}
using System.Web.Http;
using System.Net.Http.Formatting;

namespace FullFrameworkWebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Set output to pretty-print JSON:
            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter() { Indent = true });

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
{{</highlight>}}

Finally, to simulate a Cloud Foundry environment with Redis bound to our app, add the section `vcap:services`to the `appsettings.json` as highlighted below:


{{<highlight json "hl_lines=15-45">}}
{
  "Logging": {
    "IncludeScopes": false,
    "Debug": {
      "LogLevel": {
        "Default": "Warning"
      }
    },
    "Console": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  },
  "vcap:services": {
    "rediscloud": [
      {
        "name": "cookbook-redis",
        "instance_name": "redis",
        "binding_name": "cookbook-redis",
        "credentials": {
          "hostname": "redacted.rediscloud.com",
          "password": “[REDACTED]”,
          "port": "15467"
        },
        "syslog_drain_url": null,
        "volume_mounts": [],
        "label": "rediscloud",
        "provider": null,
        "plan": "30mb",
        "tags": [
          "Data Stores",
          "Web-based",
          "Data Store",
          "Caching",
          "Messaging and Queuing",
          "Data Management",
          "key-value",
          "IT Management",
          "caching",
          "redis"
        ]
      }
    ]
  }
}
{{</highlight>}}

Launch the solution in the debugger and view the output at `api/configbrowser`:

![`api/configbrowser` output](/steeltoe-config-legacy-framework/configbrowser-json.png)

### Experiment

Once you’ve got your Steeltoe configurations working locally, try pushing to a Cloud Foundry space.  Bind and unbind services from the app and see how the output of the `ConfigBrowserController` changes.  Set up additional actions for viewing `CloudFoundryApplicationOptions` and other configurations used in your app.

#### Happy coding!
