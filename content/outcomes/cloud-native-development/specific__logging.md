---
title: Logging
weight: 100
layout: single
team:
 - VMware Tanzu Labs
---

Logging is pretty straightforward. You certainly already spent some in-depth thinking about logging solutions and frameworks.

The good news is you are probably already where you need to be. The twelve-factor app states that apps should write all log info (both standard and errors) to the standard console output and let the cloud platform route all that knowledge to the correct central repository. 

Almost every common logging framework provides some form of console appender. Therefore, it is as easy as switching away from your local rolling files and letting the platform do the work for you.

If your application relies heavily on a vendor-specific or custom logging framework, look into enabling console output in these environments.

