+++
title = "ASP.NET 4.x app using the GAC"
date =  2019-04-09T17:21:51-04:00
tags = ["[asp.net,4.0,legacy,gac,k8,kubernetes]"]
summary = "Recipe Summary"
weight = 5
+++

Running an ASP.NET 4.x app that consumes an assembly from the Global Assembly Cache (GAC).

## Dockerfile

The `Dockerfile` assumes that your solution is named COMClient and is placed at the same level as the `Dockerfile`. The `Dockerfile` also assume that you've published the application to the `bin\Release\Publish` folder.

The `Dockerfile` downloads and installs the VC++ redistributable in a special way due to the fact that the installer is asynchronous. The powershell `Start-Process` and `Wait-Process` Cmdlets synchronize the operation so the docker build doesn't terminate prematurely.

The `Dockerfile` then registers the ATL/COM dll that the .NET 2.0 project depends on. Care is taken to use the 32-bit `regsvr.exe` which is located in `c:\Windows\SysWOW64`.

Just before putting the published artifacts into `c:\inetpub\wwwroot` 32-bit execution is enabled in IIS.

  ```bash
  FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8

  ADD Library/Library/bin/Release/Library.dll /Library.dll
  ADD machine.config /Windows/Microsoft.NET/Framework64/v4.0.30319/Config/machine.config
  ADD gac.ps1 /gac.ps1
  RUN /gac.ps1
  COPY Consumer/Consumer/bin/Release/publish/ /inetpub/wwwroot
  ```

## gac.ps1

  THis powershell script will be executed during container build and will add the library into the container's GAC.

  ```csharp
  [System.Reflection.Assembly]::Load('System.EnterpriseServices, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a')
  $publish = New-Object System.EnterpriseServices.Internal.Publish
  $publish.GacInstall('\Library.dll')
  ```

## K8 manifest.yml

  ```yml
  ---
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
      labels:
          app: gac
      name: gac
  spec:
      replicas: 1
      template:
          metadata:
              labels:
                  app: gac
              name: gac
          spec:
              containers:
              - name: webapp
                image: <insert your repo/image:tag here>
                ports:
                - containerPort: 80
              tolerations:
              - key: windows
                value: "1803"
                effect: NoSchedule
              nodeSelector:
                  beta.kubernetes.io/os: windows
  ```
  