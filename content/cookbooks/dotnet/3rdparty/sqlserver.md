+++
title = "SQL Server"
date =  2018-08-29T12:00:00-07:00
tags = [ "SQL Server", "Database" ]
weight = 8
+++

The ADO.NET driver for SQL Server is fully managed, therefore there are no code changes required when pushing an app to PCF which uses SQL Server. At a minimum there are likely connection string changes required in order to connect to your SQL Server. There also potentially firewall and Application Security Group changes required.

## SQL Server Authentication

There are two modes of authentication when using SQL Server: Integrated Auth and SQL Server Auth. Only SQL Server Authentication is supported from PCF. The reason SQL Server Authentication must be used is because each application instance runs under a unique local container account which has no ability to authenticate with Active Directory.

You can directly configure the SQL Server Auth username and password in your connection string in your web.config, however since it's best to separate code from configuration it's recommended to use the [Steeltoe SQL Server connector](http://steeltoe.io/docs/steeltoe-connectors/#3-0-microsoft-sql-server). This allows you to store the connection string in the environment and bind the connection string at runtime thus satisfying the best practice of separating code from configuration.

## Application Security Groups

In order for your application to connect to your SQL Server hosted outside of your PCF foundation you'll need to make sure the firewall(s) between your PAS deployment network (and optionally isolation segments) have the port(s) SQL Server is listening on open, by default port `1433`.

Depending on your application security group configuration, you'll need to create a SQL Server application security group and assign it to the required organizations in PCF.

Sample ASG rule:

```json
[
  {
    "protocol": "tcp",
    "destination": "10.0.11.0/26",
    "ports": "1433",
    "description": "Allow access to SQL Server cluster"
  }
]
```
