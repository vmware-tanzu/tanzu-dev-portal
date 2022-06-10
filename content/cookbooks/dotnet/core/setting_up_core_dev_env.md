+++
categories = ["recipes"]
date = "2016-12-08T08:42:53-05:00"
glyph = "fa-file-text-o"
summary = "Setting up the Development Environment and Workspace for .NET Core"
tags = ["dotnetcore", "devenv", "vscode"]
title = "Development Environment for .NET Core"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe describes what is needed to prepare a development environment for working with .NET Core. Thankfully, there is very little work required to getting a development environment working.

## Installing the .NET Core SDK

To install the .NET Core SDK, follow the instructions at the [Official Microsoft Site](https://www.microsoft.com/net/core).

## Installing Visual Studio Code

Install Visual Studio Code by following the instructions at the [Official Visual Studio Code Site](http://code.visualstudio.com/docs/setup/setup-overview).

### Install the C# Extension

Ensure that you've been able to install the C# plugin for Visual Studio from the [Marketplace](http://code.visualstudio.com/docs/languages/csharp). If your workstation is prevented from using the marketplace, then consult a team leader for information on how to obtain a copy of the extension internally.

## Verify your Environment

To verify your environment, make sure that you can do the following:

* `cd` to a new, empty directory
* Issue a `dotnet new` command
* Issue a `dotnet restore` command
* Type `dotnet run`, and ensure that you see the "Hello world" output from a properly executed console application.
* `cd` to the root of one of your drives and type `dotnet --version`, ensure that you have the right version of the SDK and that you don't have any errors.
