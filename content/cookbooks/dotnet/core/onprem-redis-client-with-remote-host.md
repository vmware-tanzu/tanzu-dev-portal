+++
title = "Redis for On-Prem applications"
date = 2018-08-06T09:57:24-05:00
+++

#### How to connect redis during On-Premises installation or when the redis host is remote, using Steeltoe?

- In `Program.cs`, add some code as below to distinguish between cloud vs on-premises installation

```c#
var hostingLocation = Environment.GetEnvironmentVariable("HOSTING_LOCATION");
Console.Out.WriteLine($"HostilgLocation: {hostingLocation}");
hostingLocation = string.IsNullOrWhiteSpace(hostingLocation) ? string.Empty : $".{hostingLocation}";
config.SetBasePath(builderContext.HostingEnvironment.ContentRootPath)
    .AddJsonFile($"appsettings{hostingLocation}.json", optional: false, reloadOnChange: false)
    .AddCloudFoundry()
    .AddEnvironmentVariables();
```

- Then add an additional json file, `appsettings.on-premises.json`. In this case, I used "on-premises" as the distinguisher


- For Steeltoe to pick your redis connection string, please add the below section in the on-premises `appsettings.json` file and modify the host, port and password accordingly

```json
"redis": {
	"client": {
		"host": "localhost", 
      	"port": "6379",
      	"password": ""
    }
}
```

- You can also make use of environment variable to set these values as below

```
redis:client:host=localhost
redis:client:post=6379
redis:client:password=
```

{{% callout %}}
Given this connection string in your configuration, `services.AddRedisConnectionMultiplexer(configuration)` and `services.AddRedisDistributedCache(configuration)`, which are Steeltoe extensions, will take care of connecting to the remote redis
{{% /callout %}}
