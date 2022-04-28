+++
categories = ["recipes"]
date = "2016-12-08T08:42:07-05:00"
glyph = "fa-file-text-o"
summary = "Migrating Unit Tests from NUnit to XUnit"
tags = ["testing", "nunit", "xunit"]
title = "Migrate NUnit to XUnit"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 60
+++

The main reason for this migration is the lack of availability of a reliable NUnit alternative in NuGet for .NET Core.

For documentation on the differences between NUnit and XUnit, please check out this [document in github](https://xunit.github.io/docs/comparisons.html)

## Test Runners and Tooling

Just include the right XUnit dependency and `dotnet test` will automatically figure out how to run your tests.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netcoreapp2.2</TargetFramework>

    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="FluentAssertions" Version="5.5.3" />
    <PackageReference Include="Microsoft.AspNetCore.TestHost" Version="2.2.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="15.9.0" />
    <PackageReference Include="Moq" Version="4.10.1" />
    <PackageReference Include="xunit" Version="2.4.0" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.4.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\src\Namespace.Namespace.Foo\Namespace.Namespace.Foo.csproj" />
  </ItemGroup>  

</Project>
```

The other really important thing to note is that the _project reference_ here takes a relative path, whereas with the `preview2` tooling, you could get away with just specifying the name of the project directory.
