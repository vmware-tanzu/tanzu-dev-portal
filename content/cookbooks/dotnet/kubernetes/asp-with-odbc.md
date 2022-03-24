+++
title = "ASP with SQL via ODBC"
tags = ["[asp,odbc,k8,kubernetes]"]
date =  2019-04-09T09:46:37-04:00
summary = "Classic ASP with SQL via ODBC"
weight = 5
+++

This project demonstrates a classic ASP application connecting to a SQL Server database via ODBC.

## Dockerfile

  During the build process this Dockerfile installs the ODBC Driver for SQL Server and configures a system-level DSN. You'll have to replace `hostname-or-ip` with the correct address in your environment and `your-dsn` with the DSN your application expects.

  ```bash
  FROM microsoft/iis
  SHELL ["powershell", "-command"]
  EXPOSE 80

  # Install ASP
  RUN Install-WindowsFeature Web-ASP; 

  # Clean out default site
  RUN powershell -NoProfile -Command Remove-Item -Recurse C:\inetpub\wwwroot\*

  # Install the ODBC Driver for SQL Server
  RUN md c:/msi;
  RUN Invoke-WebRequest 'https://download.microsoft.com/download/1/E/7/1E7B1181-3974-4B29-9A47-CC857B271AA2/English/X64/msodbcsql.msi' -OutFile c:/msi/msodbcsql.msi; 
  RUN ["cmd", "/S", "/C", "c:\\windows\\syswow64\\msiexec", "/i", "c:\\msi\\msodbcsql.msi", "IACCEPTMSODBCSQLLICENSETERMS=YES", "ADDLOCAL=ALL", "/qn"];

  # Add the DSN
  RUN Add-OdbcDsn -Name "pkstest" -DriverName "\"ODBC Driver 13 For SQL Server\""  -DsnType "System"  -SetPropertyValue @("\"Server=hostname-or-ip\"", "\"Trusted_Connection=No\"");

  #Change directory
  WORKDIR /inetpub/wwwroot
  #Copy the app artifact in (assumes you are in the publish folder when building docker image)
  COPY wwwroot/* .
  ```

## wwwroot/default.asp

  In `default.asp` you'll have to specify the DSN, username, and password relevant to your environment. 

  While specifying such information directly in code is not desirable, it's a pattern often found in legacy ASP applications. In the future content will be added demonstrating config externalization.

  ```html
  <!DOCTYPE html>
  <html>
    <body>

    <%
    Dim objConn
    Set objConn = Server.CreateObject("ADODB.Connection")
    objConn.Open("DSN=your-dsn;UID=user-id;PWD=password")

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
      app: aspodbc
    name: aspodbc
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: aspodbc
        name: aspodbc
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
    name: aspodbc
    labels:
      app: aspodbc
  spec:
    ports:
    - port: 80
      targetPort: 80
    selector:
      app: aspodbc
    type: NodePort
  ```