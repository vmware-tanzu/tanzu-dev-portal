+++
date = "2017-06-14T12:00:00-07:00"
title = "SQL Server DB Migration to Azure"
tags = [ "Azure", "SQL Server" ]
weight = 10
+++

![SQL Server Migration](/sso_img/db_migrate.png)
 
## Process Description
 
### Create Azure PCF Service

A target SQL Server database in Azure must exist that is provisioned by the Azure SQL Server service broker.

Below is a Service Creation Pipeline Bash Script Template which demonstrates how to automate the CF CLI to create the SQL Service via the broker, a JSON Service Configuration File Template which provides the specifics of the database to the CLI, and a Service Creation Concourse Task Template which triggers the script as part of the deployment process. The SQL Server Service broker will automatically create a username and password for application when it binds to the service.

{{% callout note %}}
Note that this process is engineered to **NOT** overwrite or destroy the underlying database/service if it already exists.
{{% /callout %}}

JSON Service Configuration File Template For Azure SQL DB, notice you'll need to replace the arguments surrounded by brackets:

```json
{
  "resourceGroup": "<AZURE RESOURCE GROUP>",
  "location": "eastus",
  "sqlServerName": "<SERVER NAME>",
  "sqldbName": "<DATABASE NAME>",
  "sqldbParameters": {
      "properties": {
          "collation": "SQL_Latin1_General_CP1_CI_AS"
      }
  }
}
```
 
Service Creation Pipeline Bash Script Template

```sh
#!/bin/bash
set -o errexit
set -o xtrace
 
cf login -a <API URL> -o <ORG> -s <SPACE> -u $user -p $password
cf create-service azure-sqldb <PLAN> <SERVICE NAME> -c <JSON SERVICE CONFIG FILE PATH>|| echo "Already Exists"
```

Service Creation Concourse Task Template

```yaml
platform: linux
 
image_resource:
  type: docker-image
  source: {repository: czero/cflinuxfs2}
 
inputs:
  - name: <RESOURCE> #resource containing the JSON Service Configuration File

run:
  path: sh
  args:
  - -exc
  - |
    ls -lR  
    sh <SERVICE CREATION PIPELINE BASH SCRIPT>
```
  
### Backup DB

Ask DBAs for a backup of the on-prem database to be ran and placed on the jumpbox

### Restore DB

Follow Microsoft instructions to [restore DB to Staging Server](https://msdn.microsoft.com/en-us/library/ms177429.aspx)
 
### Sanitize DB

1. Each table has to have clustered indexes or pk
2. Delete Windows users

### Generate BACPAC

Generate BACPAC DB from clean DB in Staging Server (must have admin user credentials)

```cmd
sqlpackage.exe /Action:Export /ssn::<DATABASE HOSTNAME> /sdn:<DATABASE NAME> /su:<ADMIN USER ID> /sp:<ADMIN PASSWORD> /tf:<PATH TO BACPAC FILE>
```

### Restore BACKPAC

Restore BACPAC from file into Azure DB. It Requires server admin role

```cmd
sqlpackage.exe /Action:Import /tsn:<DATABASE HOSTNAME> /tdn:<DATABASE NAME> /tu:<ADMIN USER ID> /tp:<ADMIN PASSWORD> /sf:<PATH TO BACPAC FILE>
```

### Further Reading

[Azure IMPORT BACPAC](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-import)
