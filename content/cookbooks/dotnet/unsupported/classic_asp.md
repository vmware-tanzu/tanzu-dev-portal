+++
date = "2017-04-18T12:00:00-07:00"
title = "Classic ASP"
tags = [ "ASP", "Classic" ]
weight = 30
+++

[Active Server Pages](https://en.wikipedia.org/wiki/Active_Server_Pages) (also known as ASP or classic ASP) is Microsoft's first server-side script engine that enabled dynamically-generated web pages. ASP is Microsoft's alternative to CGI scripts and Java Server Pages typically written in VBScript.

## Background

Classic ASP applications can run on Windows cells in Cloud Foundry, however the ROI on replatforming is often low because of lower business value and technical challenges. It's not uncommon for these types of applications to contain a tangle of HTML, CSS, JavaScript, and server side VBScript. ASP applications typically lack composability, structure, and automated tests which make them highly brittle and difficult to replatform. 

Since Classic ASP applications are typically written in VBScript they are slower to execute than their modern compiled counterparts like ASP.NET. For performance critical areas, ASP apps typically consume COM components written in a compiled language like C++ or VB6. COM components lack a cloud friendly deployment model and often have maintainability issues. If an ASP application uses COM components that do not already exist on the Windows cell, and most do, they cannot be replatformed to Cloud Foundry.

## UPDATE

A new and upcoming solution for containerizing class ASP, is windows nodes in Kubernetes. [Here](https://dotnet-cookbook.cfapps.io/kubernetes/dotnet2_0-webconfig-configmap/) is an ASP.NET 2.0 example.