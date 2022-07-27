+++
title = ".NET 4.x with Microsoft Message Queue (msmq)"
tags = ["[msmq,message queue,k8,kubernetes]"]
summary = "Example pods hosting MSMQ"
date =  2019-04-15T13:40:12-04:00
weight = 5
+++

This project demonstrates a pod hosting a WebAPI front end and a pod hosting a Windows Service backend that communication with each other via MSMQ

## api.Dockerfile

  The container hosting the WebAPI front-end. MSMQ is installed into the base IIS container.

  ```bash
  FROM microsoft/iis
  SHELL [ "powershell" ]

  RUN Add-WindowsFeature MSMQ
  RUN Add-WindowsFeature Web-Asp-Net45

  RUN powershell -NoProfile -Command Remove-Item -Recurse C:\inetpub\wwwroot\*
  #Copy the app artifact in (assumes you are in the publish folder when building docker image)
  COPY . /inetpub/wwwroot/
  ```

## daemon.Dockerfile

  The container hosting the Windows Service backend. MSMQ is installed into the base servercore container. Port 1803 is exposed in order to receive messages from the frontend.

  ```bash
  FROM mcr.microsoft.com/windows/servercore:ltsc2019
  SHELL [ "powershell" ]

  RUN Add-WindowsFeature MSMQ
  RUN Dism /online /Enable-Feature /FeatureName:NetFx4 /All 

  WORKDIR /app
  COPY Qbert/Daemon/. .
  RUN New-LocalUser -Name "pksuser" -Password (ConvertTo-SecureString -AsPlainText "Pk$w0rd189PVTL!" -Force) -FullName "PKS.User" -Description "LocalAdministrator"
  RUN Add-LocalGroupMember -Group administrators -Member pksuser -Verbose

  WORKDIR /app/bin/Release .
  RUN C:\Windows\Microsoft.NET\Framework\v4.0.30319\InstallUtil.exe /username=.\pksuser /password=Pk$w0rd189PVTL! /LogToConsole=true .\Daemon.exe

  EXPOSE 1801

  CMD ["powershell", "while", \
      "((Get-Process | ? { $_.ProcessName -like 'Daemon'} | Measure).Count -gt 0)", \
      "{Start-Sleep -Seconds 1}"]
  ```

## Kubernetes manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: msmqdaemon
    name: msmqdaemon
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: msmqdaemon
        name: msmqdaemon
      spec:
        containers:
        - name: qbertdaemon
          image: <DOCKER_CONTAINER_REPO/DOCKER_CONTAINER_IMAGE:tag here>
          ports:
          - containerPort: 1801
        tolerations:
        - key: "windows"
          operator: "Exists"
          effect: "NoSchedule"
        nodeSelector:
            beta.kubernetes.io/os: windows
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: msmqapi
    name: msmqapi
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: msmqapi
        name: msmqapi
      spec:
        containers:
        - name: qbertapi
          image: <DOCKER_CONTAINER_REPO/DOCKER_CONTAINER_IMAGE:tag here>
          ports:
          - containerPort: 80        
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
    name: msmqdaemon
    labels:
      app: msmqdaemon
  spec:
    ports:
    - protocol: TCP
      port: 1801
    selector:
      app: msmqdaemon
    type: NodePort
  ```
  
## Testing through `KubeProxy`

  The api `Service` specs have been left out of the sample Kubernetes manifest. You can either create your own `Service` or you can use `KubeProxy`.

  Assuming you have `kubeproxy` running with `kubectl proxy` you can

  `curl -X POST http://localhost:8001/api/v1/namespaces/<YOUR NAMESPACE>/pods/<YOUR API POD NAME>/proxy/api/message -H "Content-Type: application/x-www-form-urlencoded" --data 'message=data1'|more`

  You will see the message show up in the `EventLog` of the daemon with

  `Get-EventLog -LogName Application -Source Qbert`