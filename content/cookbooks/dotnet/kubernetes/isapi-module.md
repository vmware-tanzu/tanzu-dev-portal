+++
title = "Isapi Module"
tags = ["[isapi,vc++]"]
summary = "Deploy a 64-bit ISAPI module in a pod"
date =  2019-04-15T13:58:50-04:00
weight = 5
+++

This project demonstrates a dockerized 64-bit ISAPI module.

## Dockerfile

  The Dockerfile installs the `Web-ISAPI-Ext` Windows feature, the 64-bit VC++ redistributable, and configures IIS to execute our ISAPI module.

  ```bash
  FROM microsoft/iis
  SHELL ["powershell", "-command"]

  WORKDIR /

  # Install the ISAPI Windows feature
  RUN Install-WindowsFeature Web-ISAPI-Ext

  # Install the **64-bit** VC++ runtime
  RUN Invoke-WebRequest -Uri https://aka.ms/vs/15/release/vc_redist.x64.exe -OutFile vc_redist.x64.exe
  RUN Start-Process -filepath ./vc_redist.x64.exe  -ArgumentList "/install", "/passive", "/norestart", "'/log a.txt'" -PassThru | Wait-Process

  COPY <my-project>/x64/Release/PKSISAPI.dll /Inetpub/wwwroot/isapi/

  # Configure IIS to execute our module
  RUN "c:/Windows/System32/inetsrv/appcmd.exe set config -section:system.webServer/security/isapiCgiRestriction /`+\"[path='C:\Inetpub\wwwroot\isapi\PKSISAPI.dll',allowed='True',groupId='PivotalGroup',description='PKS Extension']\" /commit:apphost"
  RUN "c:/Windows/System32/inetsrv/appcmd.exe set config /section:handlers /`+\"[name='PKSIsapiExtension',path='PKSISAPI.dll',verb='GET,POST',modules='IsapiModule',scriptProcessor='C:\Inetpub\wwwroot\isapi\PKSISAPI.dll']\" /commit:apphost"

  # Uncomment the following to configure IIS to not supress error messages 
  #RUN "c:/Windows/System32/inetsrv/appcmd.exe set config \"Default Web Site\" /section:system.webServer/httpErrors /errorMode:Detailed"

  ENTRYPOINT [ "ServiceMonitor.exe", "w3svc" ]

  EXPOSE 80
  ```

## K8 manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: isapimodule
    name: isapimodule
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: isapimodule
        name: isapimodule
      spec:
        containers:
        - name: webapp
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
    name: isapimodule
    labels:
      app: isapimodule
  spec:
    ports:
    - port: 80
      targetPort: 80
    selector:
      app: isapimodule
    type: NodePort
  ```