+++
title = "WebForms app with 32bit COM library"
date =  2019-04-09T17:21:51-04:00
tags = ["[asp.net,2.0,legacy,com,atl,32bit,k8,kubernetes]"]
summary = "Recipe Summary"
weight = 5
+++

Running an ASP.NET 2.0 WebForm app that relies on a 32 bit COM library.

## Dockerfile

The `Dockerfile` assumes that your solution is named COMClient and is placed at the same level as the `Dockerfile`. The `Dockerfile` also assume that you've published the application to the `bin\Release\Publish` folder.

The `Dockerfile` downloads and installs the VC++ redistributable in a special way due to the fact that the installer is asynchronous. The powershell `Start-Process` and `Wait-Process` Cmdlets synchronize the operation so the docker build doesn't terminate prematurely.

The `Dockerfile` then registers the ATL/COM dll that the .NET 2.0 project depends on. Care is taken to use the 32-bit `regsvr.exe` which is located in `c:\Windows\SysWOW64`.

Just before putting the published artifacts into `c:\inetpub\wwwroot` 32-bit execution is enabled in IIS.

  ```bash
  FROM mcr.microsoft.com/dotnet/framework/aspnet:3.5
  SHELL ["powershell", "-Command", "$ErrorActionPreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue';"]

  EXPOSE 80

  # Download vc++ redist
  ADD https://download.microsoft.com/download/C/6/D/C6D0FD4E-9E53-4897-9B91-836EBA2AACD3/vcredist_x86.exe /vcredist_x86.exe
  # SYNCHRONOUSLY install the vc++ redist
  RUN Start-Process -filepath C:\vcredist_x86.exe -ArgumentList "/install", "/passive", "/norestart", "'/log a.txt'" -PassThru | wait-process

  # Register the ATL/COM dll
  COPY ./ATLPKS.dll c:/ATLPKS/
  RUN c:/Windows/SysWOW64/regsvr32.exe /s c:/ATLPKS/ATLPKS.dll

  # Let IIS run 32-bit apps 
  RUN "c:\\Windows\\System32\\inetsrv\\appcmd.exe set apppool /apppool.name:DefaultAppPool /enable32BitAppOnWin64:true"

  WORKDIR /inetpub/wwwroot
  COPY COMClient/COMClient/bin/Release/Publish/bin/* ./bin/
  COPY COMClient/COMClient/bin/Release/Publish/* ./
  ```

## K8 manifest.yml

  ```yml
  ---
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
      labels:
          app: dotnet2atlcom
      name: dotnet2atlcom
  spec:
      replicas: 1
      template:
          metadata:
              labels:
                  app: dotnet2atlcom
              name: dotnet2atlcom
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