---
date: '2021-07-28'
description: Demonstrates basic SSL connection of a Tanzu GemFire .NET client with a GemFire cluster. It's a simple command line program that connects to a region using the cache factory object and does not involve a dependency on Java. 
  
lastmod: '2021-05-24'
repo: https://github.com/dkhopade/gemfire-dotnet-nc
title: Tanzu GemFire .NET Client - SSL
type: samples
weight:
---

This is a sample code that connects to an SSL enabled GemFire cluster using SSL enabled client. It's a simple command line simple program that connects to a region using cache factory object and does not involve any dependency on Java. Since the Java KeyStore (JKS) format is not supported with .NET, you will need to export your certs (keystore, truststore) in `.pem` or other supported types. Please refer to [this article](https://community.pivotal.io/s/article/How-to-connect-SSL-Enabled-VMware-GemFire-NET-Client-to-SSL-Enabled-VMware-GemFire-Cluster-on-Windows?language=en_US) for more details. 

This sample was created, built and tested with Microsoft Visual Studio 2017 Community Edition.