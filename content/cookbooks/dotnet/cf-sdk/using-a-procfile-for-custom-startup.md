+++
title = "Procfile for Custom Startup"
date = 2018-08-07T09:22:12-05:00
+++

## How to override a Buildpack startup command (aka Procfile)

In order to override the startup command of a Buildpack you can use an extension less file with one line of text named Procfile.  The Procfile was popular in Heroku the originators of [The-Twelve-Factor-App](https://12factor.net/).  This file is commonly used to run batch and script files before running the command that would have originally be run by the Procfile. 

+ Create a file called `procfile`.
+ Make sure the file is in the root of your source
+ Make sure the file is pushed to Cloud Foundry

Additional information can be found here: [About Procfiles](https://docs.cloudfoundry.org/buildpacks/prod-server.html#procfile)

Example Procfile

```
web: myscript.bat

```
