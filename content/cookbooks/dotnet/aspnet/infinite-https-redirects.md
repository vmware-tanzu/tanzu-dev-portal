+++
date = "2021-04-06T13:18:36+08:00"
title = "Infinite HTTPS redirects"
tags = [ "HTTPS", "ingress" ]
+++

For ASP.NET apps that call `app.UseHttpsRedirection()` / `app.UseHsts()` in their `Startup.cs`, you might find that the app responds to HTTPS requests with an infinite HTTP redirect loop when deployed to Kubernetes, especially if you have configured Kubernetes for SSL termination to happen at Kubernetes ingress.

Why? This is because (as is the case for most reverse proxy/load balancer deployments) when the app is deployed on Kubernetes, its Ingress controller takes care of the SSL connection, ie. SSL termination happens on Kubernetes' Ingress controller, and the app deployed in Kubernetes will be connected to via HTTP, not HTTPS. The app detects that it is being connected to via HTTP, and (rightfully) responds with a redirect to use HTTPS.

What we can do is to indicate to the app that the originating request did indeed use HTTPS. Most reverse proxies/load balancers indicate this by setting the `X-Forwarded-For` header (contains the IP of the client making the request, ie. the "real" IP) and the `X-Forwarded-Proto` header (contains the protocol that the client connected via, eg. HTTPS), and Kubernetes Ingress supports this too. Here's how we can do this:

1. In your Kubernetes manifest YAML, tell Ingress to set the `X-Forwarded-...` headers :

  ```yaml
  ...
  - apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: ...
      namespace: ...
      annotations:
        kubernetes.io/ingress.class: ...
        ...
        nginx.ingress.kubernetes.io/use-forwarded-headers: "true"
  ```

2. In your app's `Startup.ConfigureServices()` ([source][aspnet-core-proxying]), tell ASP.NET Core to forward the scheme:

  ```csharp
  if (string.Equals(
      Environment.GetEnvironmentVariable("ASPNETCORE_FORWARDEDHEADERS_ENABLED"), 
      "true", StringComparison.OrdinalIgnoreCase))
  {
      services.Configure<ForwardedHeadersOptions>(options =>
      {
          options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | 
              ForwardedHeaders.XForwardedProto;
          // Only loopback proxies are allowed by default.
          // Clear that restriction because forwarders are enabled by explicit 
          // configuration.
          options.KnownNetworks.Clear();
          options.KnownProxies.Clear();
      });
  }
   ```

3. In your Kubernetes manifest YAML, set the environment variable `ASPNETCORE_FORWARDEDHEADERS_ENABLED` for the app:

   ```yaml
   ...
     metadata:
       labels:
         app: ...
     spec:
       containers:
       - name: ...
         image: ...
         env:
         - name: ASPNETCORE_FORWARDEDHEADERS_ENABLED
           value: "true"
         ...
   ```

## References

* ["Configure ASP.NET Core to work with proxy servers and load balancers"][aspnet-core-proxying]
* ["Enforce HTTPS in ASP.NET Core"][enforce-https]

[aspnet-core-proxying]: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-3.1
[enforce-https]: https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.1
