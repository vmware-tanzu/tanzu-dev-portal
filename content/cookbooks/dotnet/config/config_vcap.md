+++
date = "2017-06-14T12:00:00-07:00"
title = "VCAP Configuration"
+++

Applications running at PCF leverage Services for environment specific settings. All `web.config` settings that are specific to environment are moved into CF services that are bound to the application. There services provided by PCF Service Brokers or User Provided Services.

To enable .NET applications to read  and use CF services information Configuration library is provided. Library will use `web.config` settings if it detects that it runs in NON-Cloud and CF services information if run on PCF. It will essentially parse `VCAPS_SERVICES` JSON information and provide it as set of classes for the application to use. The concept and structure is borrowed from Steeltoe and Spring CloudConnectors.

## Configuration

Install [Configuration Library][conflib]

```ps
Install-Package Pivotal.Configuration.CloudFoundry
```

This library reads configuration and provides it as set of classes for the application. It runs seamlessly locally by reading `web.config` sections and on PCF reading `VCAP_SERVICES`. Usage:

```c#
ConfigurationBuilder config = ConfigurationBuilder.Instance();

// Get specific service by name and type
SqlServerService svc = config.GetService<SqlServerService>("name-db");
SSOService sso = config.GetService<SSOService>("Internal-SSO");
 
// Get all services of specific type
List<SqlServerService> svcs = config.GetServices<SqlServerService>(); 
 
// For generic user provided services
Service svc = config.GetServiceByName("servicename");

// get config values
svc.Credentials["value_key"];
```

Following are Classes Hierarchy available for usage:
![Configuration Connector Classes](/sso_img/vcaps_config.png)
 
[conflib]: https://github.com/pivotalservices/Manulife-App-Replatforming/tree/master/net-libraries/CloudFoundry-Config "Config Library"
