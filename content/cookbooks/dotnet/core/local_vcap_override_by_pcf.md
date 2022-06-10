+++
categories = ["recipes"]
date = "2016-12-19T09:11:05-05:00"
glyph = "fa-file-text-o"
summary = "Configuring Local Development PCF Service Bindings That Can Be Overridden in PCF"
tags = ["vcap_services", "services", "configuration"]
title = "Local Service Bindings (VCAP)"
taxonomy = ["CLIENT", "DOT_NET"]
+++

## Configuring Local Service Bindings

This recipe provides information on how you can set up your application code and development environment such that your app is coded to rely upon PCF service bindings for backing service data, but you can get reasonable defaults when running locally but the values can be overridden by a specific space and set of service bindings when pushed to PCF.

### Injecting Steeltoe Service Binding Objects via DI

As we showed in the [Creating a Microservice Skeleton](../creating_microservice_skeleton) recipe, we can have a `Startup` class that looks as follows that will enable the discovered PCF application service bindings to be injectable through .NET Core's default DI mechanism, e.g. the `IOptions<T>` system.

```c#
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Steeltoe.Extensions.Configuration;
using Steeltoe.Extensions.Configuration.CloudFoundry;

namespace Foo.Core.Service
{
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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddOptions();
            services.ConfigureCloudFoundryOptions(Configuration);
            services.AddConfiguration(Configuration);

            services.Configure<CloudFoundryApplicationOptions>(Configuration);
            services.Configure<CloudFoundryServicesOptions>(Configuration);            

            // set up your own DI to start initializing your classes, data sources, etc.          

            // IFooCache needs an IDatabaseCreator to get a DB and a PdbCacheDictionary
            services.AddSingleton(typeof(Foo.IDatabaseCreator), typeof(Foo.DatabaseCreator));
            services.AddSingleton(typeof(IFooCache), typeof(DefaultFooCache));

            // JsonMessageProcessor needs an IQueueProducer and an IQueueConsumer and an IFooCache
            services.AddSingleton(typeof(IQueueProducer), typeof(RabbitMQQueueProducer));
            services.AddSingleton(typeof(IQueueConsumer), typeof(RabbitMQQueueConsumer));            
            services.AddSingleton(typeof(JsonMessageProcessor));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory,
            IQueueConsumer queueConsumer,
            JsonMessageProcessor messageProcessor)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseMvc();                  

            queueConsumer.StartConsumption();            
        }               
    }
}
```

When configuring an application to allow local default configuration as well as PCF overriding configuration, the key components are to enable the Steeltoe Cloud Foundry configuration source via the `AddCloudFoundry()` call in the `Startup` constructor, and then to make parsed `VCAP_*` configuration values available via POCOs using the following two lines of code:

```c#
services.Configure<CloudFoundryApplicationOptions>(Configuration);
services.Configure<CloudFoundryServicesOptions>(Configuration);       
```

Once this has been configured, you can simply configure classes to be injectable via constructor injection to accept an `IOptions<CloudFoundryServicesOptions>` parameter. This lets your code sift through the service bindings to find the one it's looking for.

### Setting up a Local Configuration File

The key to allowing your local configuration to work on your workstation and then have it automatically overridden with the environment configuration from your target foundation is in setting up your configuration defaults properly. You need to make sure that your `appsettings.json` file is added _first_ as a configuration source, allowing environment variables to overwrite your local defaults.

Next, you need to make sure your configuration matches the format that Steeltoe expects to come from Cloud Foundry. As you can see, this is nearly identical to what you'll see if you issue a `cf env` command against an application with active service bindings.

```json
{  
  "vcap:services" : {
    "rabbitmq": [
        {
            "name" : "rabbitmq",
            "label": "rabbitmq",
            "credentials": {
                "username" : "guest",
                "password" : "guest",
                "hostname" : "localhost",
                "uri" : "amqp://localhost:5672/",
                "vhost" : "/"
            }
        }
    ],
    "user-provided": [
      {
        "credentials" : {
          "url" : "http://localhost:5001"
        },
        "label" : "user-provided",
        "name" : "teamservice",
        "syslog_drain_url" : "",
        "tags" : []
      }
    ]
  }
}
```