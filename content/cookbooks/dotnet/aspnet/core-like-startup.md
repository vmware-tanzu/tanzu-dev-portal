+++
summary = "Use .NET Standard extension methds on a full framework app"
title = "Core like Startup"
date = 2019-03-04T09:08:44-05:00
+++

This recipe explains, on using .NET standard extension methods in full framework app similar to one in .NET Core application. This also helps in leveraging a number of Steeltoe extension methods.

### Steps to follow

1. Add a class in the root of the application or under App_Start, called `BootConfig.cs`
2. Add the below nuget packages (preferably latest versions)
    - Microsoft.Extensions.Configuration
    - Microsoft.Extensions.DependencyInjection
    - Microsoft.Extensions.Hosting
3. Add the below code into the class
    ```c#
        public class BootConfig
        {
            static IHost host;
            public static void Configure(string environment)
            {
                host = new HostBuilder()
                    .ConfigureAppConfiguration((builderContext, configBuilder) =>
                    {
                        //Add your IConfiguration builder extensions methods here
                    })
                    .ConfigureServices((builderContext, services) =>
                    {
                        //Add your IServiceCollection builder extensions methods here
                    })
                    .ConfigureLogging((context, loggerFactory) =>
                    {
                        //Add your ILoggerFactory extensions methods here
                    })
                    .Build();
            }

            public static T GetService<T>()
            {
                return host?.Services?.GetService<T>();
            }
        }
    ```

4. In `Application_Start` method of `Global.asax.cs` class, call the `Configure` method, which will create DI container, inject configurations and even configure logging as provided 

    ```c#
        public void Application_Start(object sender, EventArgs e)
        {
            ...

            BootConfig.Configure("development"); //pass in the enviroment variable here (hardcoded for sample purposes only)
        }
    ```
5. You can also access the registered services using `BootConfig.GetService<T>()` method, anywhere from the applications. 

> *Note: Incase if the application uses any DI framework, you can populate these services into their containers, where you may no need the `BootConfig.GetService<T>()` method.*


##### Hope you have fun!