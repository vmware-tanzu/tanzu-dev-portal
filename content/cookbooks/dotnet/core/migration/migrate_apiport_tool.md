+++
categories = ["recipes"]
date = "2016-12-08T09:42:43-05:00"
summary = "Using the API Port Tool to Analyze Legacy Code for .NET Core Compatibility"
tags = ["legacy", "migration","tools", "apiport"]
title = "Migration Analysis with APIPort Tool"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 35
+++

The APIPort tool will give you some information as to how many of the method calls invoked by the code in the library being analyzed are still available in .NET Core. It's important to note that this may not be entirely accurate because the API Port tool isn't going to go out to NuGet and look for suitable replacements for deprecated or removed APIs. This tool doesn't analyze third party dependencies, it only refers to the code in the base class library.

- For information on how to use the tool and to create and analyze the results, please see [Microsoft's documentation](https://github.com/Microsoft/dotnet-apiport/blob/master/docs/Console/README.md).
- A [video containing an interview](https://sec.ch9.ms/ch9/031c/f3d7672b-dd71-4a18-a8b4-37573c08031c/DotNetPortabilityAnalyzer_mid.mp4) on **Channel 9** about how to use the API Port tool.
- Portability analyzer as a Visual Studio plugin from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ConnieYau.NETPortabilityAnalyzer).
- Use the [Windows Compatibility Pack](https://docs.microsoft.com/en-us/dotnet/core/porting/windows-compat-pack) to port code to .NET Core  
