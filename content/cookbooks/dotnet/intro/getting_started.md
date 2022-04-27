
+++
date = "2017-12-19T15:28:50-06:00"
title = "Getting Started"
description = "Steps to follow to push a ASP.NET application to PCF"
weight = 1
+++

Before pushing your first ASP.NET 4.x application to Pivotal Cloud Foundry you should follow the below steps in order to ensure you have a positive experience the very first time you push your application to Cloud Foundry.

## Application Manifest

An application manifest is a YAML file which contains information about how to host your application on PCF. A good starting manifest for the majority of ASP.NET apps is below, copy and paste this into the same directory as your `web.config` and name it `manifest.yml`. Replace the `REPLACE_ME` text in the manifest with the name of your app.

```yaml
---
applications:
- name: REPLACE_ME
  memory: 2G
  stack: windows2016
  buildpack: hwc_buildpack
```

This application manifest is minimal, but specifies a few important details for hosting an ASP.NET app in PCF. It specifies that the container RAM should be 2GB, the app should run on a Windows 2016 cell, and use the Hostable Web Core to start the application (HWC is what IIS uses to run apps under the covers). There are many more tunables available in the [application manifest](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html) you may want to tweak later on.

## Memory Configuration

Don't set the application memory below 2G when _first_ pushing the app to PCF. Once you have the app successfully running it's recommended to then go back and tune the memory down to the amount the application requires. Generally that means you should never configure an ASP.NET application with anything less than 512MB of memory.

While an application that goes over the configured memory limit will be killed by the container it's possible for your application to fail in other ways in low memory situations, such as failing some requests because of `OutOfMemoryExceptions`. This is why it's important to test your application settings but more importantly implement proper health checks and application level monitoring.

## Health Check Configuration

An application health check is a monitoring process that continually checks the status of a running Cloud Foundry app. Any application instance which reports back as unhealthy is automatically restarted in a new container, so it's important you implement a robust healthcheck above and beyond the Cloud Foundry default of checking that the TCP port is open.

All ASP.NET applications should use the `http` [health check type](https://docs.cloudfoundry.org/devguide/deploy-apps/healthchecks.html#types).

> The http health check performs a GET request to the configured HTTP endpoint on the app’s default port. When the health check receives an HTTP 200 response, the app is declared healthy. We recommend using the http health check type whenever possible. A healthy HTTP response ensures that the web app is ready to serve HTTP requests. The configured endpoint must respond within 1 second to be considered healthy.

Changing from the default health check type is a minimal first step. It's highly recommended that you also change the [health check http endpoint setting](health-check-http-endpoint) and configure it to use a custom health endpoint that validates the application health at a deeper level. This deeper introspection validates that the application instance is healthy and can successfully serve requests. This could be as simple as an MVC controller which queries the application's DB.

A better solution is to use the [Steeltoe Management Health](http://steeltoe.io/docs/steeltoe-management/#1-2-3-health) endpoint along with your own custom `IHealthContributor` implementations. These health contributors should validate things like each application instance can successfully communicate it's dependant services or watch for an increased error rate over a sliding time window. Basically anything an operations team might put into a script to monitor an application should be built into the application's health check system.

## Application Error Handling

To take advantage of the builtin PCF logging your application needs to 'opt-in' to ensure you can properly view any unhandled exceptions that may occur in your app. This is a very important step and should be done before pushing the application for the first time. Without a global error handler in place you won't get any log information back from your application if it crashes on startup.

The easiest way to log any unhandled exceptions is to modify your application's Global.asax.cs and add a global error handler method that logs to stdout.

```c#
void Application_Error(object sender, EventArgs e)
{
    Exception lastError = Server.GetLastError();
    Console.WriteLine("Unhandled exception: " + lastError.Message + lastError.StackTrace);
}
```

If you already have a global exception handler you'll need to ensure it's logging to stdout. For example if using a logging framework like [`log4net`](https://logging.apache.org/log4net/) you'll need to configure a console appender so log statements write to stdout.

For production applications it's highly recommended to use a configurable logging framework like `log4net` or NLog instead of writing directly to the Console.

Once you have added a global error handler you'll see any unhandled execptions along with their stack trace logged to PCF. You can view the logs in the PCF Apps Manager or from the command line: `cf logs myappname --recent`

## `web.config`

Most application `web.config` files work out of the box with PCF, however here are a couple of things to watch out for.

- Don't use Windows integrated auth, it's been disabled in PCF.
- Don't use HTTP modules that don't ship with .NET or can't be deployed in your app's bin directory, for example the [Microsoft URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite).
- SQL Server connection strings _must_ use fully qualified domain names.
