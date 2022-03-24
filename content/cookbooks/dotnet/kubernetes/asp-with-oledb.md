+++
title = "ASP with SQL via OLEDB"
date =  2019-04-09T14:21:10-04:00
tags = ["[oledb,asp,sql,k8,kubernetes]"]
summary = "Classic ASP with SQL via OLEDB"
weight = 5
+++

This project demonstrates a classic ASP application connecting to a SQL Server database via OLEDB.

Note, this pattern in isolation is achievable on Pivotal Application Service for Windows(PASW) today. Running on Pivotal Container Services for Windows(PKS) would only be required if additional concerns present themselves that are not achievable on PASW.

## Dockerfile

  Because the MDAC is generally available on Windows Server nothing special is required during the build of this docker image. This Dockerfile can be considered the bare minimum to run a classic ASP application on PKS with or without database access.

  The Dockerfile assumes that you have the contents of your web application in the wwwroot directory at the same level as the Dockerfile. 

  ```bash
  FROM microsoft/iis
  SHELL ["powershell", "-command"]
  EXPOSE 80

  # Install ASP
  RUN Install-WindowsFeature Web-ASP; 

  # Clean out default site
  RUN powershell -NoProfile -Command Remove-Item -Recurse C:\inetpub\wwwroot\*

  WORKDIR /inetpub/wwwroot
  #Copy the app artifact in (assumes you are in the publish folder when building docker image)
  COPY wwwroot/* .
  ```

## wwwroot/default.asp

  In default.asp you'll have to specify the connection string relevant to your environment.

  While specifying such information directly in code is not desirable, it's a pattern often found in legacy ASP applications. In the future content will be added demonstrating config externalization.

  ```html
  <!DOCTYPE html>
  <html>
    <body>

      <%
      Dim objConn
      Set objConn = Server.CreateObject("ADODB.Connection")
      objConn.Open("PROVIDER=SQLOLEDB;DATA SOURCE=hostname-or-ip;UID=user-id;PWD=password;DATABASE=database-name")
      Set objCmd = Server.CreateObject("ADODB.Command")
      objCmd.CommandText = "SELECT * FROM master.sys.tables"
      objCmd.ActiveConnection = objConn
      Set objRS = objCmd.Execute
      Do While Not objRS.EOF
        %><%= objRS("name") %><br><%
        objRS.MoveNext()
      Loop
      %>

    </body>
  </html>
  ```

## K8 manifest.yml

  ```yml
  ---
  apiVersion: v1
  kind: Deployment
  metadata:
    labels:
      app: aspoledb
    name: aspoledb
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: aspoledb
        name: aspoledb
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
    name: aspoledb
    labels:
      app: aspoledb
  spec:
    ports:
    - port: 80
      targetPort: 80
    selector:
      app: aspoledb
    type: NodePort
  ```