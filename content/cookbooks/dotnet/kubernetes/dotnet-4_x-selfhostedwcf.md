+++
title = ".NET 4.x WCF Self Hosted App"
tags = ["[self hosted,wcf,k8,kubernetes]"]
summary = "A self hostd WCF pod"
date =  2019-04-15T13:50:46-04:00
weight = 5
+++

This project demonstrates a Windows Service hosting a WCF Service. You could argue this is more of a Windows Service example than a WCF example, but it still demonstrates a common pattern for operationalizing WCF.

## Dockerfile

  Creates a user for the Windows Service to run under and installs the Service with `installutil.exe`.

  ```bash
  FROM mcr.microsoft.com/dotnet/framework/runtime:4.7.2 AS runtime
  SHELL [ "powershell" ]

  WORKDIR /app
  COPY SelfHostedWCFService/SelfHostedWCFService/. .

  # Windows services need to run as some kind of user so we'll create one. This is just a legacy artifact 
  # of how Windows Services work and the identity of this user isn't important to us so the creds aren't
  # perticularly sensitive. I'm not even sure it makes sense to dial back the group the user is being put
  # in to.
  RUN New-LocalUser -Name "pksuser" -Password (ConvertTo-SecureString -AsPlainText "Pk$w0rd189PVTL!" -Force) \
      -FullName "PKS.User" -Description "LocalAdministrator"
  RUN Add-LocalGroupMember -Group administrators -Member pksuser -Verbose

  # Install the service into Windows
  WORKDIR /app/bin/Release .
  RUN C:\Windows\Microsoft.NET\Framework\v4.0.30319\InstallUtil.exe /username=.\pksuser /password=Pk$w0rd189PVTL! \
      /LogToConsole=true .\SelfHostedWCFService.exe

  EXPOSE 8080

  # The real business of the app lifecycle is managed by Windows due to this app being a Service so there isnt'
  # really a need for us to worry about it in Docker. However, we do need some process to run that docker can
  # watch so it knows we're still alive. This command let's Windows manage that lifecycle while we just watch
  # the state of the service, exiting if the process dissapears thus destroying the container. 
  # I'm open to better ideas.
  CMD ["powershell", "while", \
      "((Get-Process | ? { $_.ProcessName -like 'SelfHostedWCFService'} | Measure).Count -gt 0)", \
      "{Start-Sleep -Seconds 1}"]
  ```

## K8 manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: windowsservicewcf
    name: windowsservicewcf
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: windowsservicewcf
        name: windowsservicewcf
      spec:
        containers:
        - name: webapp
          image: <DOCKER_CONTAINER_REPO/DOCKER_CONTAINER_IMAGE:tag here>
          ports:
          - containerPort: 8080
        tolerations:
        - key: "windows"
          operator: "Exists"
          effect: "NoSchedule"
        nodeSelector:
          beta.kubernetes.io/os: windows
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: windowsservicewcf
    labels:
      app: windowsservicewcf
  spec:
    ports:
    - port: 80
      targetPort: 8080
    selector:
      app: windowsservicewcf
    type: NodePort
  ```