+++
title = "Legacy .NET 3.5"
date =  2019-04-09T17:21:51-04:00
tags = ["[asp.net,3.5,legacy,k8,kubernetes]"]
summary = "Recipe Summary"
weight = 5
+++

Running a .NET Framework 3.5 app.

## Dockerfile

  Notice the use of the legacy `aspnet:3.5` tag.

  ```bash
  FROM mcr.microsoft.com/dotnet/framework/aspnet:3.5
  SHELL ["powershell", "-Command", "$ErrorActionPreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue';"]

  EXPOSE 80

  # Clean out default site
  RUN powershell -NoProfile -Command Remove-Item -Recurse C:\inetpub\wwwroot\*

  WORKDIR /inetpub/wwwroot
  #Copy the app artifact in (assumes you are in the publish folder when building docker image)
  COPY wwwroot/* .
  ```

## Kubernetes manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: dotnet3_5
    name: dotnet3_5
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: dotnet3_5
        name: dotnet3_5
      spec:
        containers:
        - name: windowswebserver
          imagePullPolicy: IfNotPresent
          image: <DOCKER_CONTAINER_REPO/DOCKER_CONTAINER_IMAGE:tag here>
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
    name: dotnet3_5
    labels:
      app: dotnet3_5
  spec:
    ports:
    - port: 80
      targetPort: 80
    selector:
      app: dotnet3_5
    type: NodePort
  ```