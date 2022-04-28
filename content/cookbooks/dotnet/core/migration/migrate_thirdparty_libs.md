+++
categories = ["recipes"]
date = "2016-12-08T11:06:54-05:00"
summary = "Analyzing Third Party Dependencies for .NET Core Compatibility"
tags = ["migration", "thirdparty"]
title = "Migrate 3rd Party Libraries"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 40
+++

One of the biggest challenges when migration a .NET Framework application to .NET Core is often the 3rd party libraries used by the application. While more and more libraries are supporting .NET Core as time goes along, there's still a substantial amount of existing libraries used in today's applications which need to be upgraded or replaced.

## Netstandard

It's recommended that when evaluating the applicability of third party libraries that first and foremost these libraries have been built targeting some version of _netstandard_ 1-6. .NET Standard is a set of API definitions independent of .NET Core and the .NET Framework that both implement at some level. This allows library maintainers to simultaneously support both .NET Core and the .NET Framework without needing to recompile or redistribute. This is required because if an application is targeted to run on .NET Core on Linux it cannot have any dependencies on any libraries that _require_ the full .NET Framework on Windows.

## 3rd Party Libraries

In addition to libraries supporting netstandard you need to make sure the libraries are actively maintained and in use in production by other consumers. Because of the modular nature of .NET Core, this involves the approval of a large number of libraries, much more than with previous versions of the .NET Framework.

## 1st Party Libraries

If you are looking to analyze first party libraries (libraries developed in-house, to which you have the source code), then you will want to check out the recipe on using the API Port tool to evaluate how much of the code in the existing library might be easily ported to core: [Using APIPort to Analyze Legacy Code](/core/migration/migrate_apiport_tool/).

For additional reference, check out this article written by *Microsoft* - [Porting to .NET Core - Analyzing Dependencies](https://docs.microsoft.com/en-us/dotnet/articles/core/porting/third-party-deps)
