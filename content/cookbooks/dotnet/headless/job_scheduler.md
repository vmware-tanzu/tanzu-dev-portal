+++
title= "Job Scheduler"
date= "2020-01-8T16:03:27-04:00"
description= ""
tags = [ "Tasks","exe","Headless","Job","PCF Scheduler" ]
draft= false
weight= 90 
+++

### Why do you need this recipe?

To complete the need of running jobs/tasks on a particular schedule, using PCF tasks scheduler, this recipe outlines the steps to successfully provision a job.

### Prerequisite
1. The `Scheduler for PCF` is installed on the platform
1. CF CLI plugin for `Scheduler for PCF` is installed. If not already, install `scheduler-for-pcf-cliplugin-windows64-exe` from https://network.pivotal.io/products/p-scheduler-for-pcf
    - `cf install-plugin C\path\to\scheduler-for-pcf-cliplugin-windows64-exe`
1. A .NET/.NET Core headless/console app is availabale, which does the specific job. However, the exmple below uses a .NET console app

### High level steps
1. Create the app manifest file
1. Deploy the application using the manifest
1. Create a job
1. Schedule a job

### Create the app manifest file

To prevent the application from starting up immediately, **set the instance count to zero** in the manifest file. In addition, the buildpacks should be set to binary_buildpack. Lastly, ensure the command attribute is set. Take notice of the stack when setting the command. In the example below, the windows stack defaults to the classic batch command.

For example:
```yml
applications:
- name: ((appname))
  buildpacks:
  - binary_buildpack
  instances: 0
  health-check-type: process
  stack: windows
  command: cmd /c .\MyApp.exe
  path: bin/release
```

### Deploy the application using the manifest

Execute `cf push`

For example:
```bash
cf push -f .\manifest.yml  --var appname=my-app
```

### Create a job

Example, create a job called `my-job` from a cf app called `my-app`
```bash
cf create-job my-app my-job "MyApp"
```

### Schedule a job

Example, schedule `my-job` to run every 5 minutes
```bash
`cf schedule-job my-job "*/5 * ? * * "`
```

### Resources
1. [Schedule for PCF](https://docs.pivotal.io/pcf-scheduler/1-2/using-jobs.html#create-jobs)
1. [Cron Expression Generator](https://www.freeformatter.com/cron-expression-generator-quartz.html)