+++
date = "2017-03-29T12:00:00-07:00"
title = "Console Applications"
tags = [ "Console","headless","exe","Windows Service" ]
weight = 40
+++

Console applications can be hosted from PCF using the binary buildpack. By default the buildpack will discover the lone `exe` file being pushed and attempt to execute that with no arguments.

It's important that the executable not exit otherwise PCF will think the application has crashed and attempt to restart it until it times out. You should also set a health check type of `none` or `process` since a console application has no http listener.

## Child Processes

Your application code shouldn't directly spawn child processes while running in the cloud. If you need to run one-off tasks, you can take advantage of the [PCF 1.9 Tasks Feature](https://docs.pivotal.io/pivotalcf/1-9/devguide/using-tasks.html), which essentially takes your application's already-staged blob and runs it in a container, once, with the appropriate parameters.

These one-off administrative tasks are also not child processes spawned by your application, they are managed strictly by Cloud Foundry. **ALL** process management should be the responsibility of the platform, and should never be done explicitly within your application code. Batch processes and scheduled activity are both things that require individual attention and need to be rearchitected and designed to take advantage of the cloud and to be designed in a [12-factor/cloud native](https://12factor.net/admin-processes) fashion.
