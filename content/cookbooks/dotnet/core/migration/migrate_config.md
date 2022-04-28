+++
categories = ["recipes"]
date = "2016-12-08T08:56:32-05:00"
glyph = "fa-file-text-o"
description = "Migrating Configuration and Configuration Abstractions to .NET Core"
tags = ["config", "dotnetcore"]
title = "Migrate Config to .NET Core"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 55
+++

This recipe discusses the migration of existing `web.config` and other configuration file processing to .NET Core.

## Migrating `web.config`

`web.config`, at least in the way most developers are familiar with it as it relates to ASP.NET configuration in the past, no longer exists. If you create a web application in Visual Studio, you will get a mostly-empty web.config file that basically tells IIS to use Kestrel to launch the application. There are a few other settings and controls that can be put in `web.config` for IIS, **but these should never be set** because there will be no IIS in the cloud. .NET Core applications are targeted specifically at cross-platform compatibility levels and to run in PCF on linux cells.

A best practice to avoid any accidental tight coupling with IIS would be to **never** include a `web.config` file with your application. If you feel you must have one, then add it to the source control's ignore list so that it never gets published with the app.

### IIS Settings and Web Server Configuration

As mentioned, you should not be configuring any of this in the new configuration system. If you have custom listeners and modules defined in your existing `web.config`, you will need to evaluate each one of them and find an equivalent or a migration strategy. One very common example that we find in legacy `web.config` files are custom HTTP listeners that were used to provide aspect-style header manipulation, security, logging, etc. These should be converted into _middleware_ and configured according to the new .NET Core/OWIN middleware design.

### Custom `ConfigSections`

While the new configuration system does support reading XML files, it doesn't actually know how to parse the `web.config` XML schema. You won't be able to simply drag over code that converted from a configuration section. Our recommended approach is to first evaluate whether you even need this configuration at all in the new system.

If you do, then one best practice is to convert the custom configuration section into a POCO that can be read from a configuration source (XML or JSON). Then enable the Options framework and inject these values into the classes that require them via dependency injection of `IOptions<T>` constructor parameters. For these, we recommend using separate files for local defaults, and to ensure that these local defaults can be overridden by environment-specific values in PCF.

### Data Sources and Connection Strings

There are few hard and fast rules when it comes to migrating to .NET Core and building cloud-native applications. One of these few rules is to **never**, **ever** store data source credentials and connection strings in configuration. The only exception to this is the use of [local defaults](/core/local_vcap_override_by_pcf). These local defaults should **only** work against localhost or other completely throwaway systems that do not ever contain meaningful information. In other words - if the information in the local defaults were to be compromised and published on the public internet, could it cause any harm?

Consult the Entity Framework Core documentation as well as some Entity Framework Core samples and the Steeltoe OSS samples for illustrations of how to use things like Cloud Foundry Connectors and Steeltoe configuration to pull connection string and data source credentials from local defaults and from PCF environment variables.

### URLs/Credentials for Backing Services

The same rule goes for URLs and credentials to backing services (web services and any other backing service not considered a data source). The only configuration stored in a file should be a harmless local default for testing on a workstation (e.g. `http://localhost/foo`) and should not contain any URLs or credentials that could expose sensitive information.

These URLs and credentials should also be configured in such a way that they can be overridden by PCF, which is documented as another recipe.

## Using the New Features

To utilize the new features, please take a look at the document under the [Required Reading](#required-reading) section.

There are some aspects of the new configuration system that we feel are inherently cloud **non**-native and so should not be used or should be used sparingly. For example, one such feature is the ability to inject an environment name into the configuration file, so you can have `appsettings.json` and `appsettings-Development.json` and `appsettings-Production.json`, etc. This is an anti-pattern for working in cloud native environments. Environment-specific configuration should not be floating around with the application's immutable artifact, it should be injected from the environment.

As such, we prefer the pattern of providing local defaults to allow the application to work on a developer workstation and then injecting overrides from the environment in all deployment target foundations.


## Required Reading

The following document from Microsoft should be considered mandatory reading and we highly recommend that all developers working on .NET Core projects create at least one "hello world" project that experiments with the various ways in which the new configuration system can be utilized.

[Microsoft .NET Core Docs - Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration)
