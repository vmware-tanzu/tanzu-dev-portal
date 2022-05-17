+++
date = "2017-05-01T12:00:00-07:00"
title = "Troubleshooting"
description = "Steps to follow when your ASP.NET application doesn't work"
weight = 2
+++

This covers some basic troubleshooting techniques to use for any full .NET application deployed to a Windows stack.

## Developer Troubleshooting

Assuming you've followed the recommendations for logging and error handling in the [getting started guide](../getting_started) you shouldn't have a hard time diagnosing issues with your deployed .NET app. Below are some common failures and possible corrective actions that you as a developer may take to fix the issue.

### `StackOverflowException`, `AccessViolationException`

If you see one of these exceptions in the PCF logs, but not locally, it usually means your application is getting killed by the PCF runtime because it's attempting to use more RAM than has been allocated to the container. Check your manifest.yml and bump up the memory setting, 4GB is a good starting point.

### 502 Gateway Error

If your application is reporting back a 502 Gateway Error, this will happen if the HWC process has crashed for some reason but the container healthcheck hasn't detected an unresponsive application. Fix the root cause, usually an unhandled exception in your application which should show up in the PCF logs. You should also change your `health-check-type` to `http` so that the PCF runtime can detect your app has crashed and automatically restart it.

### ASP.NET Yellow Screen of Death

When you see an ASP.NET Yellow Screen of Death (YSoD) this means the application cannot start because of a misconfiguration or has crashed. Typically you'll want to check your PCF application logs when you see a YSoD, assuming you've [put a global error handler](../getting_started/#application-error-handling) in place.

There are times when it's necessary to temporarily configure the ASP.NET yellow screen of death to output errors directly to the browser. These scenarios include:

1. The application contains a configuration error, typically in the `web.config`.
2. You lack the ability to modify the application and add a global error handler method.
3. .NET cannot start the app domain.

 Outputting detailed error messages to the browser can be enabled by modifying the `web.config` and setting the `customErrors` mode attribute to `Off`, like so:

```xml
<system.web>
  <customErrors mode="Off"/>
</system.web>
```

This will allow you to see the underlying error message and stack trace from your browser and is typically the first debugging action you'll take after checking the PCF logs. If you added a global error handler you will also see the underlying exception in your PCF logs.

{{% callout warning %}}
Do not leave custom errors mode set to off outside development environments as this may leak sensitive information to an attacker.
{{% /callout %}}

### App won't start, reports crashed

This will typically only happen if you have set a `health-check-type` of `http` and your application has a problem. You should be able to find an error in your PCF logs or on the YSoD page.

Another possibility is if your application times out on startup. By default PCF will wait one minute for your application to respond before giving up and showing the app has crashed. Ideally you should improve the startup time of your application, however in some scenarios you may need to increase the timeout. In PCF 1.11 you can set a maximum application [startup timeout](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#timeout) of 10 minutes, contrary to what the documentation may say.

### Logs don't show up in PCF

The default in ASP.NET is to not log anything to stdout, and thus PCF. If it does "log" anything it'll log fatal errors to the Windows event log or show the yellow screen of death page. You'll need to instrument your code with `Console.WriteLine` calls or better yet use a logging framework like log4net and configure it to log to stdout.

### The page cannot be displayed because an internal server error has occurred.

This usually means the app crashed before it even attempted to execute your code while parsing the `web.config`.

First make sure you are pushing a .NET 4.x app and not a .NET 2, 3, or 3.5 app. If you are targeting an older framework version then upgrade the application to work with .NET 4.x.

If you're ASP.NET 4.x app won't start, try pushing your application with a clean or empty `web.config` and then add in bits and pieces of configuration one block at a time until you can narrow down what's not working. Typically it's because of a http module or handler that is not available on the Windows cell, like the Microsoft URL Rewrite module.

### .NET Tracing

ASP.NET tracing enables you to view diagnostic information about requests for an ASP.NET page. ASP.NET tracing enables you to follow a page's execution path, display diagnostic information at run time, and debug your application. ASP.NET tracing can be integrated with system-level tracing to provide multiple levels of tracing output in distributed and multi-tier applications. You can also configure ASP.NET tracing to write to the PCF application log.

All the same .NET tracing [rules and configurations](https://msdn.microsoft.com/en-us/library/b0ectfxd.aspx) that you are familiar with apply to ASP.NET applications hosted in PCF. To get _all_ diagnostic traces from the .NET framework, libraries, and ASPX pages/views to show up in PCF there are a few steps you need to take.

To get ASPX page level trace statements to show up along with the other trace events you need to add the following to your `web.config`:

```xml
<system.web>
  <trace enabled="true" writeToDiagnosticsTrace="true" mostRecent="true" pageOutput="false" />
</system.web>
```

The most important step is to add a console appender so the PCF logging system can pickup all the trace statements. Additionally you can configure .NET diagnostic information to output the PCF log by enabling their source and log level. The following example will configure all ASPX trace statements and the .NET framework System.Net namespace to output to the PCF log:

```xml
<system.diagnostics>
  <sharedListeners>
    <add name="PcfLogListener" type="System.Diagnostics.ConsoleTraceListener" />
  </sharedListeners>
  <sources>
    <source name="System.Net">
      <listeners>
        <add name="PcfLogListener"/>
      </listeners>
    </source>
  </sources>
  <trace autoflush="false" indentsize="2">
    <listeners>
      <add name="PcfLogListener"/>
    </listeners>
  </trace>
  <switches>
    <add name="System.Net" value="Information" />
  </switches>
</system.diagnostics>
```

The System.Net trace statements are in particular valuable if you're trying to debug WebRequest failures that your application may be making to other services. Together these tracing techniques can be invaluable in diagnosing issues that may only happen in a limited access environment.

## Cloud Foundry Operator Troubleshooting

This section covers advanced techniques that may come in handy to a platform operator that has administrative access to the Cloud Foundry platform and cells, but potentially limited access to the application code.

### Find the cell(s) an application is running on

First get the GUID of the app:

```sh
$ cf app APPNAME --guid
c6d1259c-8057-489e-9ac2-beaa896c2bf3
```

Then use [cf curl](http://cli.cloudfoundry.org/en-US/cf/curl.html) and [`jq`](https://stedolan.github.io/jq/) to extract the information from the stats endpoint:

```sh
$ cf curl /v2/apps/c6d1259c-8057-489e-9ac2-beaa896c2bf3/stats | jq 'with_entries(.value = .value.stats.host)'
{
  "0": "10.0.33.4",
  "1": "10.0.34.4"
}
```

Use the `bosh vms` command to correlate the IPs to BOSH job indexes or VM UUIDs.

### Download application droplet

If you need to look at what an app has deployed to PCF, you can download the droplet image from PCF. This allows you to take a look at the `web.config` or other compiled bits.

```sh
$ cf app myappname --guid
9caddd73-706c-4f82-bb63-b1435bd6240d
```

Create a temporary directory, download the container to the temporary directory, and extract the downloaded tar file.

```sh
$ mkdir /tmp/droplet && cd /tmp/droplet
$ cf curl /v2/apps/9caddd73-706c-4f82-bb63-b1435bd6240d/droplet/download > droplet.tar.gz
$ tar -zxf droplet.tar.gz
```

If you list the files in the application you'll see the image looks very much like a deployed application would in IIS. Now you can verify the image layout and the contents of the `web.config` without needing to login to the cell or gain access to the source code.

```sh
$ ls -lah app
total 128
drwxr-xr-x  16 sneal  wheel   544B Apr 20 08:20 .
drwxr-xr-x   4 sneal  wheel   136B Apr 21 10:20 ..
drwxr-xr-x   4 sneal  wheel   136B Apr 20 08:20 .cloudfoundry
drwxr-xr-x   7 sneal  wheel   238B Apr 20 08:20 Bin
-rw-r--r--   1 sneal  wheel   5.5K Apr 20 08:20 Default.aspx
-rw-r--r--   1 sneal  wheel   1.2K Apr 20 08:20 Global.asax
-rw-r--r--   1 sneal  wheel   1.2K Apr 20 08:20 Web.config
drwxr-xr-x   4 sneal  wheel   136B Apr 20 08:20 css
-rw-r--r--   1 sneal  wheel    17K Apr 20 08:20 favicon.ico
drwxr-xr-x   4 sneal  wheel   136B Apr 20 08:20 img
drwxr-xr-x   7 sneal  wheel   238B Apr 20 08:20 js
```
