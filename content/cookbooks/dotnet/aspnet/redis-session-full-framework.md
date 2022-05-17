+++
summary = "Use Redis Cache for session persistence on legacy framework apps"
title = "Persist session to Redis"
date = 2019-03-14T09:08:44-05:00
+++

*[!TIP]
Before continuing, please refer to recipe named `Core like Startup` under `ASP.NET`*

This recipe guides you on, how to make use of redis, for session persistence in classic ASP.NET applications, using Steeltoe connectors.

### Prerequisites

- Install Redis version 2.6 or higher to support session
- Visual studio 15.3 or more

### Steps to add session/caching to classic ASP.NET application (Common steps)

- Follow the instructions from the recipe `Core like Startup` This will add the support for .NET Core like DI, Configuration injection, use of Steeltoe Core extension methods, etc.
- Add nuget package reference to `Steeltoe.Extensions.Configuration.CloudFoundryCore`
- Add the `IConfigurationBuilder` extensions methods (as below) to pull in configurations from environment variables and `VCAP_SERVICES` (user provided). Optional to add JSON files, YAML files, etc as needed. 

    ```c#
        public class BootConfig
        {
            ...
            public static void Configure(string environment)
            {
                ...
                .ConfigureAppConfiguration((builderContext, configBuilder) =>
                {
                    configBuilder.AddCloudFoundry();
                    configBuilder.AddEnvironmentVariables();
                })
                ...
            }
            ...
        }
    ```

- Add nuget package reference to `Steeltoe.CloudFoundry.ConnectorCore`
- Add the Steeltoe's `IServiceCollection` extension method (as below) which injects an implementation of `IConnectionMultiplexer`. Steeltoe is smart to pull the configurations from `VCAP_SERVICES`, if app is bounded to a redis instance, else use the default host and port for Redis

    ```c#
        public class BootConfig
        {
            ...
            public static void Configure(string environment)
            {
                ...
                .ConfigureServices((builderContext, services) =>
                {
                    services.AddRedisConnectionMultiplexer(builderContext.Configuration);
                })
                ...
            }
            ...
        }
    ```

- Create a class called `RedisConfig` as below, which serves the connection string to `RedisSessionStateProvider` mentioned in the `web.config` (later in the steps)
    
    ```c#
        public class RedisConfig
        {
            static IConnectionMultiplexer connectionMultiplexer;
            static RedisConfig()
            {
                connectionMultiplexer = BootConfig.GetService<IConnectionMultiplexer>() 
                    ?? throw new ArgumentNullException(nameof(IConnectionMultiplexer));
            }
             
            public static string GetConnectionString()
            {
                return connectionMultiplexer.Configuration;
            }
        }
    ```

- Add reference to the nuget package `Microsoft.Web.RedisSessionStateProvider`. This modifies the `web.config` file adding custom session state provider and machine key sections under `system.web` section
- Overwrite the `sessionState` section as below, where we mentioned the class and method which serves the connection string. Note that the class name should be fully qualified

    ```xml
       <sessionState mode="Custom" customProvider="RedisSessionStateStore">
          <providers>
            <add name="RedisSessionStateStore" type="Microsoft.Web.Redis.RedisSessionStateProvider"
                 settingsClassName="RedisConfig"
                 settingsMethodName="GetConnectionString" />
          </providers>
        </sessionState>
    ```

- Use a generator like [this one](https://www.developerfusion.com/tools/generatemachinekey) to create and update the `machineKey` section
- Application is all set to use Redis as its backing store for session.

For more details and sample application, you can refer to [this article](https://www.initpals.com/cloud/asp-net-app-using-redis-backed-session-using-steeltoe-io/)

##### Hope you have fun!
