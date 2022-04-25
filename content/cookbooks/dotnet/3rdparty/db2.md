+++
date = "2017-12-15T12:00:00-07:00"
title = "IBM DB2"
tags = [ "IBM", "DB2", "Mainframe" ]
weight = 50
+++


IBM will soon support the `bin-deployable` package via Nuget for .NET Framework, estimated to be March 2018.

They have the package updated for Pivotal Cloud Foundry based on customer requests and will externalize it in DB2 11.1 M3FP3 (currently scheduled for March). IBM Customers can request early access to the PCF supported version directly from IBM.

While the PCF supported version is not currently public below is a link to a version IBM released specifically for Azure.

[.NET DB2 Driver](https://www.ibm.com/developerworks/community/blogs/96960515-2ea1-4391-8170-b0515d08e4da/entry/IBMDBADONETAZURECLOUDDRIVER?lang=en)

This driver works well on PCF windows cell, when packaged along with the application.
See the sample MVC application guide:

[.NET MVC guide](https://www.ibm.com/developerworks/community/blogs/96960515-2ea1-4391-8170-b0515d08e4da/resource/DB2AZUREAPPSERVICES_WEBAPPS_USING_CLUD_DRVR.pdf?lang=en)

There are some limitations and changes required for the application to use this DB2 driver on PCF:

* Application should be targeting .NET framework 4.5.+ (4.0 apps should be recompiled)

* Application should use "x64" CPU as a platform

* Copy C++ runtime `redist` DLLs to driver 'bin' directory. (PCF windows cells do not have C++ runtime DLLs installed). Required DLL's could be found in installed nuget package   

```
  packages\IBM.Data.DB.Provider.11.1.2020.4\build\clidriver\bin\amd64.VC12.CRT\
    msvcp120.dll
    msvcr120.dll
```

Build the application and copy these two DLLs under application `bin\clidriver\bin`

* The full connection string may be provided in the application configuration, (there is NO strong requirement to set it up in `db2dsdriver.cfg` as mentioned in IBM docs) Example connection string:

```xml
<connectionStrings>
  <add name="DBContext" connectionString="DATABASE=Databasename;SERVER=servername:port;UID=Userid;PWD=password;CurrentSchema=myschema" providerName="IBM.Data.DB2" />
</connectionStrings>
```

If `SERVER` is not present in the connection string, driver assumes that `DATABASE` is the name of the alias and will try to resolve it in `db2dsdriver.cfg`.
