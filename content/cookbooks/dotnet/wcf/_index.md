+++
date = "2019-04-31T12:00:00-07:00"
title = "WCF"
pre = "<i class='fa fa-phone'></i> "
layout = "intro"
+++


WCF services can typically run in Cloud Foundry with minimal changes. WCF is a large framework so the guidance here is for the most common type of configurations. The most common of these being SOAP or REST based services using an http(s) transport hosted either in IIS or self hosted.

## Common Issues

WCF services which are already hosted in IIS can usually be pushed to Cloud Foundry with very few changes, if any. The set of gotchas for a WCF service hosted in IIS are largely same as for any other ASP.NET application. Some common gotchas when hosting WCF services in Cloud Foundry are:

- Windows auth is _not_ supported.
- X509 certificates cannot be stored in the Windows cert store.
- SSL offload/load balancing sometimes require custom WCF behaviors.
- Not all transports are supported.
- Self hosted WCF services using http transport (e.g. hosted outside IIS).

### Windows Authentication

Since Cloud Foundry cells and their containers are not domain joined, they cannot use Active Directory accounts for authenticating calls. An alternative option may be to use basic auth over https or certificate based authentication.

- TODO: Example with more specific guidance

### Certificate Authentication

Since apps run under a non-priviledged container account they do not have access to install certs in the Windows cert store and have the WCF runtime automatically load the cert. To work around this, the app will need to dynamically load the cert from a location it has access too. One way is with a custom ServicePointManager integration that allow the app to load the cert from the local file system, env var, or secrets store and implement a validate method itself.

- TODO: Example with more specific guidance.
- [Implementing a WCF Client with Certificate-Based Mutual Authentication without using Windows Certificate Store](https://blog.kloud.com.au/2015/11/23/implementing-a-wcf-client-with-certificate-based-mutual-authentication-without-using-windows-certificate-store/)

### SSL Offload

SSL offload will affect metadata generation for WCF SOAP services, so instead of getting the service's protocol, FQDN, and port, it'll use the internal IP and port of the container. To remedy this you'll need to create a custom endpoint behavior extension.

- TODO: Example with more specific guidance
- [WCF: SSL offloading in load balancer – a simple approach](https://blogs.msdn.microsoft.com/dsnotes/2016/05/14/wcf-ssl-offloading-in-load-balancer-a-simple-approach/) as a starting point. TODO: specific guidance.

### Transports

WCF supports a multiude of transport options, however Cloud Foundry does not support all available WCF transport options. The most common WCF transport is http(s) which fortunately is the bread and butter of Cloud Foundry. Other more esoteric transports like MSMQ and named pipes are not supported within Cloud Foundry.

The WCF TCP transport will work (provided TCP Routing is enabled on your PCF installation) as long as your application is self hosted with a custom port. You cannot use the TCP transport with HWC (hwc_buildpack), therefore you need to self host the app as a console app and push it using the binary_buildpack.

You must also configure PCF to route traffic using the same port as configured in your app. [Using custom ports](https://docs.cloudfoundry.org/devguide/custom-ports.html) is a relatively new feature which can be configured using `cf curl`. [WCF-TCP](https://github.com/greenhouse-org/wcf-tcp) is a sample WCF app that shows how to use self hosting with the TCP transport on PCF.

### Self Hosted WCF Services

WCF has the ability to be self hosted or in other words hosted outside IIS. Self hosting outside PCF is typically done programatically from a .NET Windows Service, although sometimes from console applications. Self hosting is not compatibile with Cloud Foundry when using an http(s) transport because the container doesn't have permissions to register a listener with Windows' HTTP.sys subsystem. Self hosted WCF apps must use the TCP transport within PCF, http will not work.

While migrating a self hosted WCF service to Cloud Foundry is more work than one that is already hosted in IIS, it's not a significant amount of work. [Here's a sample WCF service](https://github.com/sneal/WCFServiceSample) with a separate project for hosting it in IIS or HWC in Cloud Foundry.

## Other Patterns

{{% children  %}}
