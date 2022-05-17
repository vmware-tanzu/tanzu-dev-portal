+++
categories = ["ODBC"]
tags = ["[ODBC]"]
summary = "A summary of using ODBC connections in a Windows container."
title = "ODBC"
date =  2019-06-18T13:46:53-04:00
weight = 5
+++

## When To Use This Recipe

With legacy .NET it is common to use ODBC based connections to databases. MS SQL, PostgreSQL, Oracle, and MySQL are the popular choices. The following recipe can be used to create the ODBC registry values in a windows container, point to the correct driver DLLs, and consume a simple connection string. The example will use PostgreSQL as the data store of choice but everything can be easily adapted for other types of database.

PostgreSQL: [https://odbc.postgresql.org/](https://odbc.postgresql.org/)

MS SQL ODBC driver (for Windows): [https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)

MySQL ODBC driver: [https://dev.mysql.com/downloads/connector/odbc/](https://dev.mysql.com/downloads/connector/odbc/)

## Overview

1. Create a working environment locally using the intended ODBC drivers and data store.
1. Run provided PowerShell script to extract the settings and create a registry file (.reg).
1. Add everything created from script to the app and set to be included in final artifact.
1. Example connection string using Steeltoe

## Local working environment

1. Install the driver by downloading and running msi: [https://ftp.postgresql.org/pub/odbc/versions/msi/psqlodbc_11_01_0000-x64.zip](https://ftp.postgresql.org/pub/odbc/versions/msi/psqlodbc_11_01_0000-x64.zip)
1. Using PowerShell create a temporary folder `mkdir c:\cf_odbc_driver` and go in to folder `cd c:\cf_odbc_driver`.
1. Save the following script as a `.ps1 `file in the new folder

  ```bash
  $ErrorActionPreference = "Stop"

  $odbc_driver_name = "PostgreSQL"
  $i=0
  $output_file = "odbc.reg"
  $container_deps_path = "C:\\users\\vcap\\app\\deps"

  New-Item -ItemType Directory -Name "tmp" -Force
  New-Item -ItemType Directory -Name "output" -Force
  New-Item -ItemType Directory -Name "output\deps" -Force

  Get-ItemProperty -path HKLM:\software\odbc\odbcinst.ini\"Odbc drivers" | 
    Get-Member | 
    Where-Object {$_.definition -match "installed" -and $_.Name -like "$odbc_driver_name*"} | 
    foreach-object {
      $item = Get-ItemProperty -path $("hklm:\software\odbc\odbcinst.ini\"+ $_.Name)
      $key = $item.PSPath.Replace('Microsoft.PowerShell.Core\Registry::',"")

      $i++
      #write the registry entry values to a temp location
      reg export $key "tmp\$i.reg"

      #Copy the driver and setup DLLs used to the deps folder
      Copy-Item -Path $item.Driver -Destination "output\deps" -Force
      Copy-Item -Path $item.Setup -Destination "output\deps" -Force

      #Get the file names of the DLLs for parsing below
      $driverFileName = (Split-Path -Path $item.Driver -Leaf -Resolve)
      $setupFileName = (Split-Path -Path $item.Setup -Leaf -Resolve)

      #Replace driver location with vcap location
      (Get-Content "tmp\$i.reg") | 
        ForEach-Object {
          if ($_ -like '"Driver"*'){
            $_ = '"Driver"="'+$container_deps_path+'\\'+$driverFileName+'"'
          }
          if ($_ -like '"Setup"*'){
            $_ = '"Setup"="'+$container_deps_path+'\\'+$setupFileName+'"'
          }
          $_
        } | 
        Set-Content "tmp\$i.reg"
    }

  #Write the final reg file
  'Windows Registry Editor Version 5.00' | Set-Content output\deps\$output_file
  Get-Content "tmp\*.reg" | 
    Where-Object { $_ -ne 'Windows Registry Editor Version 5.00' } | 
    Add-Content output\deps\$output_file

  #Create profile script
  'reg import deps\odbc.reg' | Set-Content "output\.profile.bat"

  #Cleanup
  Remove-Item -Path "tmp" -Force -Recurse
  ```

## Extract settings and create registry file

The PowerShell script is going to look in the registry where ODBC driver information is stored, and match all the drivers with the value of the `$odbc_driver_name` variable. For each one it finds, it will copy the driver details to a .reg file and copy the associated driver DLL(s) as well. During writing the driver details it sets the location of the driver DLL to what it will be in a windows container on Cloud Foundry.

Once all that is finished, the script then creates a .profile.bat script that simply has a command to execute the new .reg file. The profile file will be automatically run when the container is started up, thus installing the registry values, thus making the ODBC driver available to the app within the container.

## Prepare Visual Studio project

1. With the driver information now extracted copy the `.profile.bat` file and the `/deps` folder (with contents) to the root of your application's project (it's where the `.csproj` is).
1. Right click on each file in the project, choose 'properties', set 'Build Action' to 'None' and 'Copy To Output Directory' to 'Copy Always'. This means every time the project is either built or published these files (keeping the folder structure) will be copied to the artifact.
  
## Example connection string

There are many ways to connect to a database using ODBC. The below example is a .NET Framework 4.7 application that has a PostgreSQL database attached to it (named "my-sql"), and uses [Steeltoe](https://steeltoe.io) to retrieve connection values to build the connection string.

```c#
private CloudFoundryApplicationOptions _appOptions;
private CloudFoundryServicesOptions _serviceOptions;
private ILogger<ValuesController> _logger;

public ValuesController() {
  _appOptions = ApplicationConfig.CloudFoundryApplication;
  _serviceOptions = ApplicationConfig.CloudFoundryServices;
  _logger = LoggingConfig.LoggerFactory.CreateLogger<ValuesController>();
}

// GET api/values
[HttpGet]
public IEnumerable<Person> Get() {
  Dictionary<string, Credential> db_values = _serviceOptions.ServicesList.Single(s => s.Name == "my-sql").Credentials;

  string connectionString = string.Format("Driver={{PostgreSQL UNICODE(x64)}};Server={0};Port={1};Database={2};Uid={3};Pwd={4};",
    db_values["db_host"].Value,
    db_values["db_port"].Value,
    db_values["db_name"].Value,
    db_values["username"].Value,
    db_values["password"].Value);

  _logger.LogInformation("CONNECTION_STRING: " + connectionString);

  List<Person> people = null;

  using (OdbcConnection connection = new OdbcConnection(connectionString)){
    connection.Open();

    var command = connection.CreateCommand();

    command.CommandText = "SELECT FirstName, LastName FROM People";
    var reader = command.ExecuteReader();
    while (reader.Read()){
      people.Add(new Person(){
        FirstName = reader["FirstName"].ToString(),
        LastName = reader["LastName"].ToString()
      });
    }
  }

  return people.AsEnumerable();
}
```
## Adding a DSN to simplify your connection string using `Add-ODBCDSN`

To add a DSN to your app's container, we can follow a similar approach to adding ODBC drivers by exporting the registry key settings. The following code assumes there exists a driver called "PostgreSQL Unicode(x64)" and requires you to fill in your database host information (<YOUR DATABASE HOST>). 

```bash
$ErrorActionPreference="Stop"

mkdir $PSScriptRoot\app\deps
mkdir $PSScriptRoot\temp

$depDir=(Resolve-Path $PSScriptRoot\app\deps).Path
$tempDir=(Resolve-Path $PSScriptRoot\temp).Path

Add-OdbcDsn -Name postgres-dsn -SetPropertyValue @("server=<YOUR DATABASE HOST>", "database=postgres", "sslmode=require") -DriverName "PostgreSQL Unicode(x64)" -DsnType User

reg export HKEY_CURRENT_USER\Software\ODBC\ODBC.INI $tempDir\odbc-dsn.reg

(Get-Content $tempDir\odbc-dsn.reg) `
    -replace "C:\\\\Program Files\\\\psqlODBC\\\\1101\\\\bin\\\\", "C:\\Users\\vcap\\app\\deps\\" |
  Out-File $depDir\odbc-dsn.reg

Copy-item -Recurse -Path "C:\Program Files\psqlODBC\1101\bin\*" $depDir

dir $depDir

```

To import the DSN registry settings, add "reg import C:\Users\vcap\app\deps\odbc-dsn.reg" to your existing profile.bat script.

You can now use the name of your DSN as your connection string. In the above example, we named our DSN `postgres-dsn`: 
`OdbcConnection connection = new OdbcConnection(postgres-dsn)`


## Summary
The example provided should give you enough context of how ODBC is accomplished in a windows container. When pushing to Cloud Foundry, remember to attach the datastore to the space `cf target -o my-org -s my-space` where the app will be pushed `cf create-service postgresql basic1 my-sql` ahead of pushing the app itself. If you are instead using Oracle, MySql, or MS SQL simply interchange the specific Postgres values. This example is intended to apply to how most ODBC drivers work on Windows.

