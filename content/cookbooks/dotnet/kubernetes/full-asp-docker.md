+++
title = "A complete Dockerfile with no hidden layers"
date =  2019-04-09T17:21:51-04:00
tags = ["[asp.net,docker,k8,kubernetes]"]
summary = "Recipe Summary"
weight = 1
+++

This is a Dockerfile that "installs" an entire .NET environment. The only layer brought in, is the required base file system. Which makes the resulting container compatible with the host it is running on (Windows Server 2019 in this example). This is not meant to be used in a project but more an example to see what the Microsoft distributed images like `mcr.microsoft.com/dotnet/framework/aspnet:3.5` or `microsoft/iis` are doing "under the hood".

High level steps:
    - Create a base file system
    - Set PowerShell as shell
    - Install .NET runtime
    - Install IIS and features
    - Copy in app
    - Set the entrypoint for the running container

## Dockerfile

  ```bash
  # escape=`
  FROM mcr.microsoft.com/windows/servercore:ltsc2019

  # use powershell to build and run the container
  SHELL ["powershell", "-Command", "$ErrorActionPreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue';"]

  # ******************************************************
  # Install .NET 3.5

  # Download and expand the dotnet framework
  RUN Invoke-WebRequest -OutFile microsoft-windows-netfx3.zip `
      -Uri https://dotnetbinaries.blob.core.windows.net/dockerassets/microsoft-windows-netfx3-1809.zip
  RUN tar -zxf microsoft-windows-netfx3.zip
  RUN Remove-Item -Force microsoft-windows-netfx3.zip
  # Install the package
  RUN DISM /Online /Quiet /Add-Package /PackagePath:.\microsoft-windows-netfx3-ondemand-package~31bf3856ad364e35~amd64~~.cab
  # Clean up
  RUN del microsoft-windows-netfx3-ondemand-package~31bf3856ad364e35~amd64~~.cab
  RUN Remove-Item -Force -Recurse ${Env:TEMP}\*
  # ^^^ runtime image

  # ******************************************************
  # Prepare container for hosting ASP.NET web apps

  # Install IIS
  RUN Add-WindowsFeature Web-Server
  # Install ASP.NET
  RUN Add-WindowsFeature Web-Asp-Net
  # Clean out default site
  RUN Remove-Item -Recurse C:\inetpub\wwwroot\*
  # Download ServiceMonitor.exe
  RUN Invoke-WebRequest -OutFile C:\ServiceMonitor.exe `
      -Uri https://dotnetbinaries.blob.core.windows.net/servicemonitor/2.0.1.6/ServiceMonitor.exe 
  # Configure the app pool the appropriate .NET version
  RUN c:\Windows\System32\inetsrv\appcmd set apppool /apppool.name:DefaultAppPool /managedRuntimeVersion:v2.0
  # ^^^ aspnet image

  # Copy our application's published bits into the container's /inetpub/wwwroot
  COPY ./OldWebApp/Publish/ /inetpub/wwwroot

  # Since this container hosts a webserver we're exposing port 80
  EXPOSE 80

  # ServiceMonitor.exe starts and runs the w3svc Windows service
  ENTRYPOINT ["C:\\ServiceMonitor.exe", "w3svc"]
  # ^^^ our image
  ```
