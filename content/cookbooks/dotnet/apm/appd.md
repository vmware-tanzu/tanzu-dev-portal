+++
title = "App Dynamics"
date =  2019-05-30T12:00:00-07:00
weight = 5
+++

AppDynamics (AppD) is an Application Performance Monitoring system that supports both on-prem and SaaS based collection of performance data. Most commonly the AppD centralized collector is deployed on-premise. Like most APMs, AppD provides an agent for collecting metrics from .NET applications on Windows.

These instructions walk you through installing and configuring an AppD agent on Windows for use in PCF. Unlike NewRelic, the AppD agent requires that a PCF operator install a Windows service before an application can be instrumented by AppD.

## Agent Installation and Usage

[Please refer to the official Pivotal partner documentation](https://docs.pivotal.io/partners/appdynamics/index.html) for the [AppD extension buildpack](https://docs.pivotal.io/partners/appdynamics/multibuildpack.html).

## Troubleshooting

If data from your application isn't showing up in the AppD dashboard you should follow the standard [AppD troubleshooting steps](https://docs.appdynamics.com/display/PRO40/Resolve+.NET+Agent+Installation+and+Configuration+Issues), however a couple of quick items to check:

- Ensure you've loaded your ASP.NET application by curling it, opening it in a browser, or enabling the http healthcheck. The profiler doesn't start until the hwc process loads your application code by serving an http request. Also be patient. Sometimes metrics take 5 minutes or so to show up.
- Check the Windows Application event log. If you see an Info level message from the .NET Runtime like this: **".NET Runtime version 4.0.30319.0 - The profiler has requested that the CLR instance not load the profiler into this process.  Profiler CLSID: 'AppDynamics.AgentProfiler'."**, then it didn't work. This usually means the app _requested_ to be profiled, but the coordinator service decided not to profile it because of a coordinator service misconfiguration, specifically the `app-agents` section.
