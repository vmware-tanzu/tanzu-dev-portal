+++
title = "ASP.NET Web API"
date = "2018-02-02T12:00:00-07:00"
weight = 30
+++

## Self Hosted Web API projects in Windows 2012R2

When Cloud Foundry creates a "container" to run an application on a Windows 2012R2 based cell, that "container" is really a best approximation of a container due to the fact that Windows 2012R2 has no native containerization support.  The [garden-windows](https://github.com/cloudfoundry/garden-windows/tree/master/Containerizer) project uses the [IronFrame](https://github.com/cloudfoundry/IronFrame) library to automatically generate a local, unprivileged user to run your application on a platform provided TCP port.  Part of the setup of this "container" is to also set the appropriate HTTP ACLs that grant this generated user to use WinHTTP based services to self-host their application.

The IronFrame project currently sets the HTTP ACLs equivalent to a administrator calling the `netsh` command as follows: `netsh http add urlacl http://*:{0}/ user={1}` where `{0}` is the dynamically assigned port for your application container, and `{1}` is the dynamically generated user that your application runs as.  The use of the `*` for the hostname in the ACL is what is known as a "Weak" wildcard, which you can read more about at https://msdn.microsoft.com/en-us/library/aa364698.aspx#host-specifier_categories.  The main point here is that for this ACL to apply to your application, you'll want to make sure that your application also binds with a "Weak" wildcard to ensure it will be allowed to start up.

For example, if you are using `HttpSelfHostServer` to self host your ASP.NET Web API project, you might want to use something like the following code to lookup the assigned port for your app, and ensure you bind using a "Weak" wildcard based address:

```c#
public class Program
{
    static void Main()
    {
        //Lookup platform assigned port
        string listenPort = Environment.GetEnvironmentVariable("PORT") ?? "8080";
        string baseAddress = "http://localhost:" + listenPort + "/";

        //setup self host server
        Console.WriteLine(String.Format("***** Starting server on {0} *****", baseAddress));
        HttpSelfHostConfiguration config = new HttpSelfHostConfiguration(baseAddress);
        //Ensure we bind with a "Weak" wildcard based hostname to fit into HTTP ACLs
        config.HostNameComparisonMode = HostNameComparisonMode.WeakWildcard;
        WebApiConfig.Register(config);
        HttpSelfHostServer server = new HttpSelfHostServer(config);

        server.OpenAsync().Wait();
        Console.WriteLine("Press Enter to quit.");
        Console.ReadLine();
    }
}
```
