+++
title = ".NET Versions"
date =  2017-09-01T14:47:18-07:00
tags = [ "DOT_NET","Versions" ]
weight = 60
+++

## .NET Framework & CLR

The Microsoft .NET Framework is actually two major subsystems, the CLR and the class libraries.

```text
Microsoft .NET Framework = CLR + managed libraries and tools
```

<img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/DotNet.svg" alt=".NET" style="height: 600px;"/>

### CLR Versions

The CLR is short for Common Language Runtime. The CLR is the virtual machine component which manages the execution of .NET programs. The CLR is included in the .NET Framework installer alongside the libraries and tools. 

{{% callout tip %}}
With .NET Core you can install the CLR _separately_ from the libraries and tools.
{{% /callout %}}

The .NET Framework has four major CLR versions: 1.0, 1.1, 2.0, and 4. Typically you'll only ever see CLR 2.0 and 4 still in use today as each new version of the .NET Framework adds libraries and features but still runs on the same CLR. For example .NET 2.0, 3.0 and 3.5 all run on the 2.0 CLR while .NET 4.0, 4.5.2 and 4.7 all run on the 4 CLR.

{{% callout note %}}
Notice that CLR 3.0 doesn't exist and goes directly from 2.0 to 4.
{{% /callout %}}

## .NET Framework 4.x

.NET Framework 4.0 was released 7 years ago in 2010, so most .NET applications already target some version of .NET 4.x, typically 4.5.2 or newer since older versions are out of support.

Windows stemcells include the latest .NET 4 Framework version available from Microsoft at the time the stemcells are published. As of now all Windows stemcells ship with [.NET Framework 4.7](https://en.wikipedia.org/wiki/.NET_Framework_version_history#.NET_Framework_4.7). You can [check the installed .NET Framework version](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) by querying the cell's registry.

{{% callout warning %}}
For vSphere and OpenStack it's possible admins have built their own stemcells which contain an older .NET 4.x version.
{{% /callout %}}

The .NET framework is installed system wide on a Windows cell, therefore applications can't choose to install a different version than is already available to them on the Windows2012R2 stack. Fortunately all .NET 4.x versions are backwards compatible, so an application which requires .NET 4.5.2 can run without any changes or even being recompiled to run on .NET 4.7.

{{% callout tip %}}
The rule of thumb is: your app must be hosted on a .NET Framework (CLR) version >= than it was built for.
{{% /callout %}}

## .NET Framework 3.5

.NET Framework 3.5 is a set of .NET framework libraries that runs on top of the .NET 2.0 CLR. Unfortunately some older applications still target .NET 3.5. While you can't directly push these applications to PCF, you can get them to run in PCF without much effort.

The .NET 4 CLR can execute older .NET assemblies side-by-side, but your top level executable or web application must still target .NET 4.x. This means that your entry point application should be compiled against .NET 4.x, but it can reference assemblies that were compiled for .NET 3.5 (or even .NET 2.0 or 3.0). For larger multi-project solutions this is very fortunate because you only need to retarget and recompile the top level project, the rest of the .NET 3.5 projects in the solution can still target .NET 3.5 and run side by side with your .NET 4.x application.

### Upgrading to .NET 4.x

Upgrading a .NET 3.5 project to .NET 4.x is relatively painless, in fact newer versions of [Visual Studio will automatically prompt you to upgrade your project](https://msdn.microsoft.com/en-us/library/dd483478.aspx) and make the necessary changes for you without any work on your part. This is especially nice for ASP.NET web projects where there's multiple `web.config` edits required in order to support .NET 4.x.

When upgrading it's recommended to target the highest version of .NET your stemcells has installed, hopefully .NET 4.7.
