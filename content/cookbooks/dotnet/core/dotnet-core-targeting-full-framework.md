+++
title = "Dotnet Core Targeting Full Framework"
date = 2018-06-13T08:20:27-07:00
+++

**Warning**: ASP.NET Core 3.0 and above will only run on .NET Core runtime as [per announcement ](https://github.com/aspnet/Announcements/issues/324)

## When To Use This Recipe

This recipe should be followed when .NET Core web applications (Web APIs, MVC sites, etc) should target the full .NET Framework as the runtime. The most typical use-case for running .NET Core on full framework is for supporting referenced assemblies that have not yet migrated to the .NET Standard.

Please note that this recipe applies to .NET Core 1.1 and above. If you’re unsure of which .NET Core version supports your project, view the contents of your application’s root directory.  If you see the file “project.json” your application was created to run on .NET Core 1.0. If you don’t have a project.json, this recipe is for you.

## Overview

In order to provide an iterative pathway to modernization, it may be necessary to allow new .NET Core applications to target the full .NET Framework until all referenced projects/assemblies have been migrated to support the .NET Standard. Thankfully, targeting the full framework can be accomplished with little effort.

## Step by Step

### 1. Create a .NET Core Project

With a command window open, create a directory for your new project and execute `dotnet new webapi`. This will scaffold a .NET Core WebAPI project targeting the .NET Core as the runtime.  

![new web api](/dotnet-core-targeting-full-framework/dotnet-new-webapi.png)

Using Visual Studio’s Add Project wizard would produce a similar result at the project level:

![project structure](/dotnet-core-targeting-full-framework/dotnet-new-webapi-result.png)

### 2. Modify the Project File

Open the `.csproj` file in your editor of choice. The default output should look similar to the below:

![default project file](/dotnet-core-targeting-full-framework/csproj-default.png)

Change the value of `<TargetFramework>` to the desired framework version. Remove the `PackageReference` element for `Microsoft.AspNetCore.All` and replace it with the more granular references shown below:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net462</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <Folder Include="wwwroot\" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore" Version=“2.1.0” />
    <PackageReference Include="Microsoft.AspNetCore.Mvc" Version=“2.1.0” />
    <PackageReference Include="Microsoft.AspNetCore.StaticFiles" Version="2.1.0" />
    <PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="2.1.0" />
    <PackageReference Include="Microsoft.VisualStudio.Web.BrowserLink" Version="2.1.0" />
  </ItemGroup>

  <ItemGroup>
    <DotNetCliToolReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Tools" Version="2.0.3" />
  </ItemGroup>

</Project>
```

### 3. Build the Application

Switching back to the console, execute the command `dotnet build`.

![dotnet build](/dotnet-core-targeting-full-framework/dotnet-build.png)

## Conclusion

Depending on your architecture and organizational goals, targeting the full framework may or may not be a temporary posture. If at some point the project achieves full .NET Standard compatibility, simply follow this recipe backwards to restore .NET Core as the runtime.
