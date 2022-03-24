+++
summary = "Inject Steeltoe objects into Unity container in legacy framework apps"
title = "Steeltoe & Unity in Full Framework"
date = 2018-12-10T16:00:00-05:00
+++

It takes quite an effort to instrument/inject some of the Steeltoe features in full framework app. SteeltoeOSS has Autofac extensions for full framework to abstarct away that effort. But there are no Unity extensions availble. Sample apps in **[steeltoe-unity-samples](https://github.com/kolluri-rk/steeltoe-unity-sample) git repo** illustrate how to use Steeltoe features with less effort when using **Unity for IoC services**. 

**How it works?** - configure and add services to Micorsoft DI container and load them into Unity container. So you can leverage Unity IoC in your apps the same way you do and can inject Steeltoe interfaces. Unity container will resolve them without any issues. 

**Note: Create/upgrade your app to target .Net Framework 4.6.1 or above, since we are making use of .Net Standard libraries**


## Pre-requisites
1. ASP.NET app tragets .Net Framework 4.6.1 or above
1. ASP.NET WEB API project use Unity.Aspnet.Webapi nuget
1. ASP.NET MVC project use Unity.Mvc nuget


## How to instrument the app to load registration into Unity container

1. Get Unity.Microsoft.DependencyInjection nuget
1. Add services to Microsoft DI container. Refer to [ApplicationConfig.cs](https://github.com/kolluri-rk/steeltoe-unity-sample/blob/master/src/FortuneTeller/Fortune-Teller-Service/App_Start/ApplicationConfig.cs) 
1. Use [DiscoveryConfig.cs](https://github.com/kolluri-rk/steeltoe-unity-sample/blob/master/src/FortuneTeller/Fortune-Teller-Service/App_Start/DiscoveryConfig.cs) to register/fetch your app in/from Eureka server
1. Use [ManagementConfig.cs](https://github.com/kolluri-rk/steeltoe-unity-sample/blob/master/src/FortuneTeller/Fortune-Teller-Service/App_Start/ManagementConfig.cs) to add cloudfoundry management endpoints and healthchecks 
1. Register and build service provider in **Application_Start() method in Global.asax.cs**  
    ```
    // register microsoft & steeltoe services  
    ApplicationConfig.Register(Environment.GetEnvironmentVariable("ASPNET_ENVIRONMENT") ?? "Development");  
    
    // build service provider for unity container  
    ApplicationConfig.BuildServiceProvider(UnityConfig.Container);
    ```

    **BuildServiceProvider(UnityConfig.Container)** method loads regsitrations from Microsoft container to Unity container  
    ```
    public static void BuildServiceProvider(IUnityContainer container)
        {
            // add services to unity container. piggy backing on Unity.Microsoft.DependencyInjection extensions
            container.BuildServiceProvider(_services);
        }
    ```

1. Refer to [Global.asax.cs](https://github.com/kolluri-rk/steeltoe-unity-sample/blob/master/src/FortuneTeller/Fortune-Teller-Service/Global.asax.cs) to start and stop Discovery client


## ASP.NET 4.x Samples with Unity and Steeltoe 

* src/FortuneTeller/Fortune-Teller-Service - use config server, connect to a MS SQL database on Azure, use Discovery client, add health management
* src/FortuneTeller/Fortune-Teller-UI - use config server, connect to Fortune-Teller-Service using Discovery client, add health management, connect to Redis server on CloudFoundry