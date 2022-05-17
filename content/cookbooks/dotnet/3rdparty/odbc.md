+++
title = "ODBC Drivers"
date =  2017-09-01T12:46:42-07:00
tags = [ "ODBC", "Driver","DSN","Bosh","Addon" ]
weight = 100
+++

The below BOSH Addon approach is only supported by PASW 2012R2. For PASW, please see **Update** below.  

Most ODBC drivers can be replaced by managed data providers that are bin deployable but sometimes there will not be another option and the driver will have to be installed on the Windows Cells via a Bosh Addon.

Below is an example of a simple bosh add-on that could be used to install a ODBC driver.

https://github.com/pivotalservices/simple-addon-release

The DSN can be avoided by providing a `DRIVER=` keyword rather than `DSN=` in the connection string.

```
Driver={IBM DB2 ODBC DRIVER};Database=myDataBase;Hostname=myServerAddress;Port=1234;Protocol=TCPIP;Uid=myUsername;Pwd=myPassword;
```

## UPDATE

There is also an example of using ODBC msi installed drivers in a Windows container [here](https://dotnet-cookbook.cfapps.io/aspnet/odbc).
