+++
date = "2017-04-21T15:28:50-06:00"
title = ".NET Cookbook"
weight = 1
layout = "top"
description = "Useful tips for getting started with .NET"
+++

Here are some useful tips for getting started with .NET on Pivotal Cloud Foundry. Search with words like "steeltoe", "dotnet", "kerberos", or "buildpack" to find helpful .NET things.

Another area of interest is the [Steeltoe Incubator](https://github.com/steeltoeoss-incubator). This is a collection of Steeltoe related projects, made by the community.

{{% children description="true" %}}

## Cloud Foundry Community

Along with the many recipes in this cookbook, there are also full projects available in the [Cloud Foundry Community repo](https://github.com/cloudfoundry-community/) to help you to migrate apps to PCF more easily.

[.NET Core CLI Extension](https://github.com/cloudfoundry-community/buildpack-dotnet-template) - For creating new extension buildpacks

[Buildpack Staging Simulator](https://github.com/cloudfoundry-community/windows-services-buildpack) - For debugging app droplets locally

[Windows Services Final Buildpack ](https://github.com/cloudfoundry-community/windows-services-buildpack) - For bootstrapping Windows Services without converting to a console app (used instead of the HWC buildpack)

[Web Config Transform Extension Buildpack](https://github.com/cloudfoundry-community/web-config-transform-buildpack) - For automating cloud-friendly configuration changes

Using IWA Kerberos with WCF - This group of tools includes a [Route Service](https://github.com/cloudfoundry-community/kerberos-auth-route-service), Route Service Extension Buildpacks for [Ingress](https://github.com/cloudfoundry-community/kerberos-auth-buildpack) and [Egress](https://github.com/cloudfoundry-community/kerberos-auth-egress-buildpack) scenarios, and a supporting [Nuget package](https://github.com/cloudfoundry-community/kerberos-auth-egress-wcf-client-interceptor).