+++
title = "Oracle DB Driver"
date =  2017-09-01T12:46:42-07:00
tags = [ "Oracle", "Database" ]
weight = 110
+++

There are two different version of the Oracle DB driver for .NET (ODP.NET) the unmanaged driver and the [managed driver](https://www.nuget.org/packages/Oracle.ManagedDataAccess/).

The one that seems to be more commonly used is the unmanaged ODP.NET driver which requires a full installer to be run on each Windows cell to install and configure all the unmanaged components, registry settings, and the TNS names. Obviously anything that requires an installer is not cloud native as it requires a PCF operator to be involved and the creation of a BOSH addon to install it.

The managed ODP.NET driver is fully managed and can be nuget installed from nuget.org without any installer or help from a PCF operator. No additional Oracle Client software is required to be installed to connect to an Oracle Database. The managed driver, being cloud friendly, is the one you want to use with your PCF apps whenever possible.

The managed ODP.NET driver is a complete subset of the unmanaged driver's APIs, so migrating from the unmanaged driver to the managed driver is usually straight forward. It's a good idea to review the [Differences between the ODP.NET Managed Driver and the Unmanaged Driver](http://docs.oracle.com/database/121/ODPNT/intro004.htm#ODPNT8146) doc from Oracle.

## Migrating to the Managed Driver

Swapping out the unmanaged driver for the managed driver is usually as easy as changing an assembly reference and updating a couple of namespaces.

1. Remove the existing unmanaged ODP.NET assembly references.
2. Install the managed ODP.NET nuget package: `Install-Package Oracle.ManagedDataAccess`
3. Change the namespace references to the managed driver. `Oracle.DataAccess` -> `Oracle.ManagedDataAccess`.
4. Configure your connection strings using something besides TNS names (see next section)

## Managed Driver Configuration

While the most common way to configure the unmanaged driver is to use the TNS names file, this isn't a remotely 12 factor compliant solution so we'll need to use something else.

The managed driver [supports a variety of way to configure the connection](http://docs.oracle.com/database/121/ODPNT/InstallConfig.htm#ODPNT8154). During initial replatforming it's often best to directly set the connection information directly in the `web.config` or the `app.config`, for example:

```xml
<?xml version="1.0"?>
<configuration>
  <configSections>
    <section name="oracle.manageddataaccess.client" type="OracleInternal.Common.ODPMSectionHandler, Oracle.ManagedDataAccess" />
  </configSections>
  <oracle.manageddataaccess.client>
    <version number="*">
      <dataSource alias="oracle.example.com" descriptor="(DESCRIPTION=( ADDRESS_LIST =(ADDRESS= (PROTOCOL=TCP)(HOST=oracle.example.com)(PORT=1521))(ADDRESS= (PROTOCOL=TCP)(HOST=oracle-2.example.com)(PORT=1521)))(LOAD_BALANCE=off)(FAILOVER=on)(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=oracle-example)(FAILOVER_MODE = (TYPE=SELECT) (METHOD=BASIC) (RETRIES = 180)(DELAY = 5))))"/>
    </version>
  </oracle.manageddataaccess.client>
</configuration>
```

This allows you to quickly configure the ODP.NET managed driver and push your application to PCF without needing to make any code changes. While this is quick and dirty, it's not 12-factor compliant since the `web.config` should generally be treated as an immutable artifact.

The better way to configure the connection is to write some custom code that will read the configuration settings from CUPS and directly provide those when opening an Oracle connection.

{{% callout note %}}
This should be generalized into a reusable CloudFoundry connector library.
{{% /callout %}}
