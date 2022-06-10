+++
categories = ["recipes"]
date = "2016-12-16T10:23:55-05:00"
glyph = "fa-file-text-o"
summary = "Creating a Microservice Skeleton or Scaffolding"
tags = ["microservices", "scaffolding", "skeleton"]
title = "Creating a Microservice Skeleton"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe addresses the question of how to set up a new project, the steps involved, and recommended best practices.

## Setting up the Solution Directory

There are a couple of different ways you can set up your project directory hierarchy, but the following is the one we recommend. This matches Microsoft's own patterns for .NET Core itself as well as community recommended best practices.

* (Solution Root)
  * src/
      * Namespace.Namespace.Foo/
          * (project file)
          * classes
          * `appsettings.json`
      * Namespace.Namespace.Bar/
      * Namespace.Namespace.Baz/
  * test/
      * Namespace.Namespace.Foo.Tests/
      * Namespace.Namespace.Bar.Tests/
      * Namespace.Namespace.Baz.Tests/


## Creating a Project File

`csproj` file is (XML) based project file format to accommodate the cross-platform version of MSBuild. For our project skeleton, the main thing is to get the right versions of dependencies. At the time this cookbook was written, most of the core framework dependencies were on version `2.1.1`. The following is a list of the most common dependencies for an empty microservice project:

* `Microsoft.AspNetCore.App` - `2.1.1`
* `Microsoft.AspNetCore.Mvc` - `2.1.1`
* `Microsoft.AspNetCore.StaticFiles` - `2.1.1`
* `Microsoft.Extensions.Logging.Debug` - `2.1.1`
* `Microsoft.Extensions.Logging.Console` - `2.1.1`
* `Steeltoe.Extensions.Configuration.CloudFoundryCore` - `2.2.0`

## `Program.cs`

The `Program.cs` file should be mostly barren. It's sole purpose is to set up a configuration builder which is then built to produce a configuration root that can then be passed to the `WebHostBuilder`. The majority of your application's initial DI configuration and startup logic should be in the `Startup` class.

If you start to notice your `Program.cs` file growing, you should consider this a smell and scrutinize the code there to decide whether it really belongs.

```c#
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Steeltoe.Extensions.Configuration.CloudFoundry;

namespace Foo.Core.Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            
                .UseCloudFoundryHosting()
                .AddCloudFoundry()
                .UseStartup<Startup>();
    }
}
```

## `Startup.cs`

Here is a sample `Startup` class that ensures that your service will start up properly and will enable MVC, the middleware that allows for RESTful routing.  

One subtle thing to keep in mind is that when you register singletons with the service provider via type mapping (rather than explicitly creating an object), they are only instantiated upon first request. You'll have to decide how you want to manage your singletons but the preferred method is to allow the container to manage the object lifetimes if at all possible.

If you have a singleton (like a queue listener/monitor) that you need to prime or trigger upon startup, then you can simply modify your `Configure` method to accept an instance of an interface there and the DI container will satisfy it with a freshly created instance of your singleton. You can then trigger/start the class as you see fit.

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        }

       

        public void Configure(IApplicationBuilder app,
                          IHostingEnvironment env)            
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseMvc();                  
        }   

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {   
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseMvc();
        }            
    }
}
```
