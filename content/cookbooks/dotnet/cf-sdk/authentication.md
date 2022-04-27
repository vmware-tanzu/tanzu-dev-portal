+++
date = "2017-12-18T12:00:00-07:00"
title = "Authentication"
+++

Authentication is supported via the `CloudFoundry.UAA` namespace. Below is some sample code showing how to obtain a bearer token from UAA.

```c#
private static AuthenticationContext refreshToken = null;

client = new CloudFoundryClient(new Uri("https://[URL TO PCF INSTANCE]"), new System.Threading.CancellationToken());

CloudCredentials credentials = new CloudCredentials();
credentials.User = "[USER NAME]";
credentials.Password = "[PASSWORD]";

try
{
    refreshToken = await client.Login(credentials);
    retVal = true;
}
catch (Exception ex)
{
    Console.WriteLine(ex.ToString());
}
```
