+++
date = "2017-03-29T12:00:00-07:00"
title = "Windows NT Services"
tags = [ "Windows Service","exe","Headless","Windows NT Services" ]
weight = 160
+++

Windows Services written using .NET have become very common especially in conjunction with a front end ASP.NET application. Typically these types of applications poll a DB table for work or listen on an event queue to process work in an async fashion.

Windows Services are not supported on PCF because they integate at the OS layer and duplicate and lot of the process life cycle management already built into PCF. However, the work load typically performed by Windows Services can usually be ported with minimal effort to PCF.

## Replatforming

Taking an existing Windows Service and making it run on PCF usually involves a couple of steps, but the most important is changing how the .NET application is started.

1. Convert the Windows Service to a Console Application.
2. Externalize any configuration settings to environment variables or other externalized configuration strategies.
3. Set the application health-check-type to `process` (available in PCF 1.10 and higher).

## Support Running as a Console App and a Windows Service

Sometimes you may need to support running the Windows Service the old way as a Windows Service while simultaneously supporting deployment to PCF. The best way to handle this is to use [TopShelf](http://topshelf-project.com/) to manage the Windows Service plumbing.

TopShelf supports installing and running a console application as a Windows Service, or just running the app normally as a console application. This duality allows you to support both installation scenarios with minimal changes to the application code.

Even if you don't plan on needing this long term, this technique can make for a reasonable method to iteratively deliver changes in the existing environment while supporting PCF replaforming.

## Advanced Healthcheck

While process level healthchecks are a good starting point and may be enough for some scenarios, it may make sense to implement a more in-depth custom health check in your worker service. This can be accomplished by using the port or http healthcheck.

The port healthcheck is pretty simple to setup, just listen on the $PORT specified by PCF if the application's self check tests pass. A further in depth test could be done by opening a TCP port and implementing a small listener the knows how to respond to HTTP requests. [Here is a simple example](https://github.com/sneal/SocketConsoleApp).

{{% callout note %}}
You cannot directly use the .NET HTTP libraries because the process does not have CAS permissions to open a port. Opening a direct TCP port which doesn't use the HTTP.sys library works fine.
{{% /callout %}}
