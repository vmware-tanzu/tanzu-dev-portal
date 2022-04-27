+++
date = "2017-12-15T12:00:00-07:00"
title = "Route service in .NET"
tags = [ "Route", "Authentication" ]
weight = 130
+++

Route Services are  often used in PCF to intercept requests to the applications and provide Authentication, Logging or other common functionality. You can read more on [Route service Architecture](https://docs.pivotal.io/pivotalcf/2-0/services/route-services.html#user-provided)

There are few examples in Java, Ruby, GO, and [here](https://github.com/lenisha/AuthRouteService) is example implementation in .NET

One approach is to implement `HttpHandler` extending `DelegatingHanlder` and register it to process all requests:

```c#
public class ProxyHandler : DelegatingHandler
{
    protected  override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        return ProxyRequest(request, cancellationToken);
    }
}
```

And configure the handler to intercept requests:

```c#
// Intercepting backend calls
config.Routes.MapHttpRoute(
    name: "allpath",
    routeTemplate: "{*allpath}",
    defaults: null,
    constraints: null,
    handler: new ProxyHandler()
);

// Route Static files (js,css) requests too
RouteTable.Routes.RouteExistingFiles = true;		
```

Another possible approaches are to implement `HttpModule` or OWIN Middleware, or .NET Core Middleware

## References
* https://kasperholdum.dk/2016/03/09/reverse-proxy-in-asp-net-web-api/
* https://github.com/SharpTools/SharpReverseProxy