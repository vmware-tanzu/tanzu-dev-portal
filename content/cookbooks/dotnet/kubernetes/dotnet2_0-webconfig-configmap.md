+++
title = "ASP.NET 2.0 WebForms"
date =  2019-04-09T17:07:41-04:00
tags = ["[webforms,web.config,configmap,asp.net,k8,kubernetes]"]
summary = "Recipe Summary"
weight = 5
+++

A simple ASP.NET 2.0 WebForms application. This sample demonstrates injecting a `Web.config` file into an application by way of a ConfigMap.

On Windows workers volumes can only be mounted on directories rather than also onto files so there was no way to inject the `Web.config` directly into the application directory (a requirement for ASP.NET web apps). Instead, the ConfigMap is mounted to `C:\config` and the `Web.config` is then copied into the application *BEFORE* IIS starts, thus not causing an application restart.

## Dockerfile

  The `Dockerfile` assume that you've published the application to the `bin\Release\Publish` folder, and also assumes that your solution is named `WebConfigConfigMap` and is placed at the same level as the `Dockerfile`.

  ```bash
  FROM mcr.microsoft.com/dotnet/framework/aspnet:3.5
  SHELL ["powershell", "-Command", "$ErrorActionPreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue';"]

  EXPOSE 80

  COPY run.cmd /

  WORKDIR /inetpub/wwwroot
  COPY WebConfigConfigMap/WebConfigConfigMap/bin/Release/Publish/bin/* ./bin/
  COPY WebConfigConfigMap/WebConfigConfigMap/bin/Release/Publish/* ./

  ENTRYPOINT [ "c:\\run.cmd" ]
  ```

## run.cmd entrypoint

  This is the custom entrypoint for the application. It's responsible for copying the config into the application's directory.

  ```bash
  IF EXIST "C:\config\Web.config" (
    COPY /Y C:\config\Web.config C:\inetpub\wwwroot\Web.config
  ) 

  C:\ServiceMonitor.exe w3svc
  ```

## Kubernetes configmap.yml

  The ConfigMap containing our cloudy Web.config is located in `configmap.yml`. As is the case with all ConfigMaps this must be created before the deployment. Alternatively the spec for the ConfigMap could be included into the same YAML file as the deployment.

  ```yml
  kind: ConfigMap  
  apiVersion: v1  
  metadata:  
    name: webconfigconfigmap-web-config  
    labels:  
      app: webconfigconfigmap   
  data:  
    Web.config: |  
      <?xml version="1.0" encoding="utf-8"?>
      <configuration>
        <appSettings>
          <add key="ConfigPulledFrom" value="a K8s ConfigMap"/>
        </appSettings>
        <connectionStrings/>
        <system.web>
        </system.web>
      </configuration>
  ```

## Kubernetes manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
        app: webconfigconfigmap
    name: webconfigconfigmap
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: webconfigconfigmap
        name: webconfigconfigmap
      spec:
        containers:
        - name: webapp
          imagePullPolicy: IfNotPresent
          image: <DOCKER_CONTAINER_REPO/DOCKER_CONTAINER_IMAGE:tag here>
          volumeMounts:
            - name: config-volume
              mountPath: /config/
        volumes:
        - name: config-volume
          configMap:
            name: webconfigconfigmap-web-config
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
    name: webconfigconfigmap
    labels:
      app: webconfigconfigmap
  spec:
    ports:
    - port: 80
      targetPort: 80
    selector:
      app: webconfigconfigmap
    type: NodePort
  ```