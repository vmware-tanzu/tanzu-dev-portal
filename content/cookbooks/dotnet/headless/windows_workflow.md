+++
date = "2017-12-18T12:00:00-07:00"
title = "Windows Workflow (WF)"
tags = ["WF","Windows Workflow"]
weight = 170
+++

Windows Workflow Foundation is a Microsoft technology that provides an API, an in-process workflow engine, and a rehostable designer to implement long-running processes as workflows within .NET applications.

The in-process engine will execute on PCF within a .NET ASP .NET application or headless exe. The designer is typically hosted as a desktop application so is not relevant for PCF.

Whilst the in-process workflow execute model is supported on PCF some capabilities of WF are not supported like MSMQ and MSTDC so an understanding of the workflows is required to determine suitablity to replatforming.
