+++
title = "New Relic"
date = "2017-07-11T12:00:00-07:00"
weight = 6
+++

Please refer to the official [NewRelic documentation](https://docs.pivotal.io/partners/newrelic/) to instrument .Net Core apps.

[New Relic](https://newrelic.com/) doesn't currently have a nuget package or a buildpack to deploy the .NET New Relic agent with a .NET 4.x app on Cloud Foundry. You can use the New Relic Azure agent and configure it to work with a Cloud Foundry Windows stack and the hwc buildpack without having to modify or install anything on the Windows cell.

These instructions make it possible for any application developer to push a New Relic instrumented application to any Cloud Foundry environment with a Windows stack available. The only external requirement is that the Windows cell stack needs to have internet access to the New Relic API servers.

### Install `NewRelic.Azure.WebSites.x64` Nuget Package

Open your web project in Visual Studio and install the [NewRelic.Azure.WebSites.x64](https://www.nuget.org/packages/NewRelic.Azure.WebSites.x64/) Nuget package. This will add a `newrelic` folder under the root of your website. Commit the `newrelic` folder to source control.

### Configure `newrelic.config`

Open the `newrelic/newrelic.config` file. Find the `REPLACE_WITH_LICENSE_KEY` text and replace it with your New Relic license key.

```xml
<service licenseKey="REPLACE_WITH_LICENSE_KEY"/>
```

Below the service element add an application element like so, changing the name element to the app name that should show up in New Relic.

```xml
<application>
  <name>CashCow</name>
</application>
```

_Remove_ the directory attribute from the log element since it points to a folder your container doesn't have access too. It should look like this when you're done:

```xml
<log level="info" />
```

Now finally add an instrumentation element telling New Relic to profile the hwc.exe. HWC is the executable that bootstraps your PCF web app and we need to tell New Relic to profile it.

```xml
<instrumentation>
  <applications>
    <application name="hwc.exe" />
  </applications>
</instrumentation>
```

Save the updated New Relic.config file.

### Secure the `newrelic` Subdirectory 

To ensure no one can download any files from the `newrelic` folder that was added when you nuget installed the `NewRelic.Azure.WebSites` package, add a _new_ `web.config` file in the `newrelic` folder with the following contents:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.webServer>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="newrelic"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
```

### Add Procfile

Now we need to add a file named `Procfile` to the root of the website. This file tells Cloud Foundry to execute an alternative command on startup instead of the default `hwc.exe`. The Procfile needs one single line:

```
web: run.cmd
```

This tell Cloud Foundry to execute the `run.cmd` batch file on startup, which we'll create next.

### Add `run.cmd`

Finally we need to add a file named `run.cmd` to the root of the website. This file is executed on app instance startup by Cloud Foundry. This batch file sets some environment variables to enable .NET profiling and configure New Relic to run from your app's `newrelic` folder. Finally it starts the `hwc.exe` just like Cloud Foundry would do by default.

```bat
set COR_ENABLE_PROFILING=1
set COR_PROFILER={71DA0A04-7777-4EC6-9643-7D28B46A8A41}
set COR_PROFILER_PATH=%~dp0newrelic\NewRelic.Profiler.dll
set NEWRELIC_HOME=%~dp0newrelic
set NEWRELIC_INSTALL_PATH=%~dp0newrelic

.cloudfoundry\hwc.exe
```

This sets three [.NET 'COR_' profiler environment variables](https://msdn.microsoft.com/en-us/library/ee471451(v=vs.100).aspx) that .NET 4.x + use to enable profiling without needing access to the registry as was required in older versions of .NET. The final two environment variables tell New Relic where its files and configuration are, which we're dynamically pointing to in the `newrelic` folder under the root of our app website.

### Push to Cloud Foundry

With all those files in place you can now `cf push` your application to any Cloud Foundry installation with a Windows cell. There's no need to manually install a machine wide MSI or any other nonsense. Hopefully in the future some of this manual setup will be automated and some of the configuration will also work with the [New Relic Service Broker](https://docs.pivotal.io/partners/newrelic/index.html).
