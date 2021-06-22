---
title: Logging
weight: 100
layout: single
team:
 - VMware Tanzu Labs
---


Logging is pretty straightforward, and you’ve probably long since moved on from thinking about logging solutions and frameworks. The good news is you’re probably already where you need to be - the twelve-factor app states apps should write all log info (both standard and errors) to the console standard output and let the cloud platform route all that knowledge to the correct central repository. And almost every common logging framework makes provides some sort of console appender, so it’s as easy as switching away from your local rolling files and letting the platform do the work for you.

If your application relies heavily on a vendor-specific or custom logging framework, look into how to enable console output in these environments.

