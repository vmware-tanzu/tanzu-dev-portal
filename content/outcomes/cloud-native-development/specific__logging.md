---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Logging
weight: 100
---

Logging is straightforward. You've likely already spent time comprehensively thinking about logging solutions and frameworks. The good news is you are probably where you need to be in your understanding of logging. 

The twelve-factor app indicates that apps should write all standard and error log information to the standard console output, and let the cloud platform route all that knowledge to the correct central repository. 

Almost every common logging framework provides a console that makes it easy to switch away from local rolling files, and let the platform do the work for you.

If your application relies heavily on a vendor-specific or custom logging framework, look into enabling console output in these environments.