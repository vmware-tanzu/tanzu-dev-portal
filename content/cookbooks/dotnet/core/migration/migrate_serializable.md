+++
categories = ["recipes"]
date = "2016-12-14T16:15:02-05:00"
tags = ["exceptions"]
title = "Migrate Serializable Classes"
taxonomy = ["CLIENT", "DOT_NET"]
weight = 65
+++

When building class libraries in .NET Core that contain classes marked with the `[Serializable]` attribute or that implement the `ISerializable` interface, you may end up with compilation errors. If you're following best practices and building your class library projects to conform to a specific version of `netstandard`, then there's a good chance it might appear as though this attribute and interface are not part of core.

Because of Core's modular nature, some things may _appear_ to be missing that aren't. For example, both the `[Serializable]` attribute and the `ISerializable` interface are part of the NuGet package `System.Runtime.Serialization.Formatters` which you can find on Nuget.org.

To get these things to compile, just add a reference to this module in your project and things _should_ work. Many classes that used to implement `ISerializable` in legacy versions of .NET _do not_ implement that interface in .NET Core, which means the .NET Core versions of those classes likely don't have the constructor overloads that accept `SerializationInfo` objects, etc.
