+++
date = "2017-06-14T12:00:00-07:00" 
title = "OIDC/OAuth 2.0" 
weight = 50
+++

## Prerequisites

1. Pivotal Cloud Foundry (PCF) instance 
1. Windows support on PCF instance 
1. SSO Tile installed and configured
1. ASP.NET Application with .NET Framework 4.6.1+

## High level steps

1. Configure ASP.NET Application for `OpenIDConnect` (OIDC)
1. Push the application to PCF
1. Bind the application to [Pivotal SSO Tile][websso]

### 1. Configure ASP.NET 4.x Application

#### Nuget packages

These are the main Nuget packages to install. These packages have dependencies that will also be installed.

```ps
Install-Package Microsoft.Owin.Host.SystemWeb
Install-Package Steeltoe.Security.Authentication.CloudFoundryOwin
```

#### `web.config`

Turn off authentication in `web.config`.

```xml
<system.web>
  <authentication mode="None" />
</system.web>
```

#### `appsettings.json`

```json
{
  "security": {
    "oauth2": {
      "client": {
        "validateCertificates": false,
        "forwardUserCredentials": true
      }
    }
  }
}
```

#### `Startup.cs`

Add Owin `Startup.cs` class to the project. The Startup class under the OWIN design abstracts away startup code from the Web Server. 

Add Owin Startup class using VS template: Add New Item -> Search for OWIN Startup class. It will generate a `Startup.cs` file, usually found in the `App_Start` folder.

You should be able to run the app and verify that Startup is invoked.

{{% callout tip %}}
**[optional]** Therefore the Global.asax.cs `protected void Application_Start()` code can be move to `Startup.cs`. Proceed if this adds minimal overhead.
{{% /callout %}}

```c#
// OWIN Startup.cs
// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
using Microsoft.Owin;
using Owin;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

[assembly: OwinStartup(typeof(demo.values.Startup))]

namespace demo.values
{
  public class Startup
  {
    public void Configuration(IAppBuilder app)
    {
      #region optional. Code in this region could remain in Global.asax.cs
      
      // optional. disable certificate validation as it 
      // depends on the environment.
      ServicePointManager.ServerCertificateValidationCallback =
        delegate (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) { return true; };

      AreaRegistration.RegisterAllAreas();
      FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
      RouteConfig.RegisterRoutes(RouteTable.Routes);
      BundleConfig.RegisterBundles(BundleTable.Bundles);
      #endregion

      app.ConfigureApp("development");  // New
      app.ConfigureAuth();              // New
    }
  }
}
```

Sample code to illustrate III	factor from [The Twelve Factors][12factors] methodology.

{{% callout note %}}
Config - Configuration that varies between deployments should be stored in the environment.
{{% /callout %}}

```c#
// File: App_Start/AppConfig.cs
using Microsoft.Extensions.Configuration;
using Owin;
using Steeltoe.Extensions.Configuration.CloudFoundry;
using System;

namespace demo.values
{
  public static class AppConfig
  {
    public static IConfiguration Configuration { get; set; }

    public static void ConfigureApp(this IAppBuilder app, string environment)
    {
      // Set up configuration sources.
      var builder = new ConfigurationBuilder()
          .SetBasePath(GetContentRoot())
          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
          .AddJsonFile($"appsettings.{environment}.json", optional: true)
          .AddEnvironmentVariables()
          .AddCloudFoundry(); // Steeltoe wrapper for all configuration

      Configuration = builder.Build();
    }
    public static string GetContentRoot()
    {
      var basePath = (string)AppDomain.CurrentDomain.GetData("APP_CONTEXT_BASE_DIRECTORY") ??
          AppDomain.CurrentDomain.BaseDirectory;
      return System.IO.Path.GetFullPath(basePath);
    }
  }
}
```

#### Configure OIDC

In this example, change the pipeline to use OpenId Connect and use the login path `/Account/AuthorizeSSO` which is unprotected and redirects the unauthenticated user to the IdP.  

Add SSO configuration to Startup by adding information from bound SSO `VCAPS_SERVICES` (client_id, client_secret, authentication domain, and app host)

For more info on the [`OpenIDConnectOptions`](https://steeltoe.io/docs/steeltoe-security/#1-3-2-configure-settings).

```c#
// File: App_Start/AuthConfig.cs
using Microsoft.Extensions.Configuration;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Steeltoe.CloudFoundry.Connector;
using Steeltoe.CloudFoundry.Connector.Services;
using Steeltoe.Security.Authentication.CloudFoundry.Owin;
using System;
using System.Linq;
using System.Security.Claims;

namespace demo.values
{
  public static class AuthConfig
  {
    public static IConfiguration Configuration { get; set; }

    public static void ConfigureAuth(this IAppBuilder app)
    {
      app.SetDefaultSignInAsAuthenticationType("ExternalCookie");
      app.UseCookieAuthentication(new CookieAuthenticationOptions
      {
        AuthenticationType = "ExternalCookie",
        AuthenticationMode = AuthenticationMode.Active,
        CookieName = ".AspNet.ExternalCookie",
        LoginPath = new PathString("/Account/AuthorizeSSO"),
        ExpireTimeSpan = TimeSpan.FromMinutes(5),

      });

      // Get SSO info
      var serviceInfos = CloudFoundryServiceInfoCreator.Instance(AppConfig.Configuration);
      var ssoInfo = serviceInfos.GetServiceInfos<SsoServiceInfo>().FirstOrDefault()
                      ?? throw new NullReferenceException("Service info for an SSO Provider was not found!");

      // Add SSO configuration retrived from bound SSO VCAPS_SERVICES
      app.UseOpenIDConnect(new OpenIDConnectOptions()
      {
        ClientID = ssoInfo.ClientId,
        ClientSecret = ssoInfo.ClientSecret,
        AuthDomain = ssoInfo.AuthDomain,
        AppHost = ssoInfo.ApplicationInfo.ApplicationUris.First(),
        AppPort = 0,
        // AdditionalScopes = "testgroup",
        ValidateCertificates = false,
        // see Configure SSO RedirectUri and Scope access in resources
        CallbackPath = new PathString("/signin-oidc") // Default Callback
      });

      System.Web.Helpers.AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
    }
  }
}
```

#### Configure Application

Analyze the application and make sure to arrange unprotected area for login, access denied from secured/protected area.

```c#
//File: Controllers/AccountController.cs
using System.Web;
using System.Web.Mvc;

namespace demo.values.Controllers
{
  [AllowAnonymous]
  public class AccountController : Controller
  {
    public ActionResult AuthorizeSSO(string returnUrl)
    {
      // Uses the default authentication type "PivotalSSO"
      return new Models.ChallengeResult(
        Steeltoe.Security.Authentication.CloudFoundry.Owin.Constants.DefaultAuthenticationType,
        returnUrl ?? Url.Action("Secure", "Home"));
    }

    public ActionResult AccessDenied()
    {
      ViewData["Message"] = "Insufficient permissions.";
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult LogOff()
    {
      Request.GetOwinContext().Authentication.SignOut();
      return RedirectToAction("Index", "Home");
    }
  }
}
```

```c#
// File: Models/ChallengeResult
using Microsoft.Owin.Security;
using System.Web;
using System.Web.Mvc;

namespace demo.values.Models
{
  internal class ChallengeResult : HttpUnauthorizedResult
  {
    public ChallengeResult(string provider, string redirectUri)
    {
      LoginProvider = provider;
      RedirectUri = redirectUri;
    }

    public string LoginProvider { get; set; }

    public string RedirectUri { get; set; }

    public override void ExecuteResult(ControllerContext context)
    {
      var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
      context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
    }
  }
}
```

This example wraps a Secure action with `[Authorize]`. The contents will display in the browser once user is validated.

```c#
// File: Controllers/HomeController.cs
using System.Web.Mvc;

namespace demo.values.Controllers
{
  public class HomeController : Controller
  {
    public ActionResult Index()
    {
      return View();
    }

    public ActionResult About()
    {
      ViewBag.Message = "Your application description page.";

      return View();
    }

    public ActionResult Contact()
    {
      ViewBag.Message = "Your contact page.";

      return View();
    }

    [Authorize]
    public ActionResult Secure()
    {
      ViewBag.Message = "You're now logged in as " + User.Identity.Name;
      return View("Index");
    }

  }
}
```

### 2. Push the application to PCF

### 3. Bind the application to [Pivotal SSO Tile][websso]

## Background

To secure web based application typically [OpenID Connect (OIDC)][oidc] implicit flow with authorization code grant is used. Web application is contacting OIDC Provider which directs to user to Authenticate against IdP and after successful user authentication receives Authorization code. Web Application then exchanges the authz code to Identity or/and Access token from OIDC provider.

For the applications running on PCF it is straightforward to use [PCF SSO][pcfsso] tile as it is the Standard OIDC SSO provider implementing required endpoints.  PCF SSO could be wired to different IdPs validating user credentials (in the example below it's ADFS, but could be LDAP or another OIDC ). All OIDC interactions are handled by OWIN middleware that is intercepting requests and acts on behalf of app to provide security.

Here is simplified diagram:

![WebApp SSO Flow](/sso_img/sso_flow.png)

To see more detailed SSO with ADFS flow refer to [Detailed SSO flow][sso]

## OWIN Middleware

The standard way to offload common code such as Authentication from the application functionality is creating interceptor - OIDC/OAuth 2.0 OWIN Middleware - and wiring it the application.

To integrate PCF SSO OAuth 2.0 provider use Pivotal OWIN middleware as it takes care of PCF SSO specifics. This middleware implements the required interactions with OIDC provider – Pivotal SSO Tile – and handles callbacks/responses to abstract most of the security code from the application itself. As it is OWIN  middleware the first step is to make the application based on OWIN and running in integrated pipeline.

### OWIN-ize Application

The following steps were tested with classic .NET Web Forms and MVC projects.

#### Adjust Project properties

1. Make sure VS project is set to use to use local IIS express server (not dev server)
2. Update following properties:
  - Enable SSL (OIDC requires it)
  - Enable Anonymous Authentication
  - Disable Windows Authentication
  - Managed pipeline set to integrated
  ![Project properties](/sso_img/project_props.png)  

## Webforms login page example

```c#
public partial class Login : System.Web.UI.Page
{
  protected void Page_Load(object sender, EventArgs e)
  {
    if (!Request.IsAuthenticated)
    {
      string returnurl = HttpContext.Current.Request.Params["ReturnUrl"];
      HttpContext.Current.GetOwinContext().Authentication.Challenge(
        new AuthenticationProperties { RedirectUri = returnurl }, "PivotalSSO");
    }
  }
}
```

## Protect the Web Application Areas

In a webforms application secure protected areas in `web.config` by denying access to unauthenticated users using location elements.

```xml
<location path="<protected folder>">
  <system.web>
    <authorization>
      <deny users="?" />
    </authorization>
  </system.web>
</location>
```

In an MVC application, secure MVC controllers by adding the `[Authorize]` attribute to the route. Also disable forms Authentication in the web.config.

```xml
<system.webServer>
    <modules runAllManagedModulesForAllRequests="true">
       <remove name="FormsAuthentication" />
    </modules>
</system.webServer>
```

## Get Token Claims

To get claims from the access/id token  get them from `ClaimsIdentity`

```c#
ClaimsIdentity claimsIdentity = (ClaimsIdentity)HttpContext.Current.User.Identity;
// Access claims
Response.Write("<b>User Claims from JWT</b> <BR/>");
foreach (Claim claim in claimsIdentity.Claims)
{
  Response.Write(claim.Type +"<BR/>");
  Response.Write(claim.Value + "<BR/>");
}
```

### [Optional] WCF Services Over SSL

If the web forms application has WCF services in the same project you need to enable them to run over SSL.
Add following to web.config services configuration.

```xml
<bindings>
  <webHttpBinding>
    <binding name="….">
      <security mode="Transport">
        <transport clientCredentialType ="None"></transport>
      </security>
    </binding>
  </webHttpBinding>
<bindings>
```

### [Optional] ASP.NET Application LDAP Groups Authorization

Many legacy .NET forms apps are using **RoleManager ASP.NET role checks** - Perform entitlements checks by using configured **RoleManager**. Roles are not set on the Principal, but are verified by invoking configured RoleManager Provider which will verify the roles. In code it is usually done by invoking configured RoleManager:

```c#
Roles.IsUserInRole;
```

To perform Authorization based on ActiveDirectory Groups, we provided custom `ActiveDirectoryRoleProvider` that implements **RoleProvider** interface contract by overriding methods such as `IsUserInRole,FindUsersInRole,GetAllRoles`. To use this AD RoleManager library install the package:

```ps
Install-Package Pivotal.Security.Ldap
```

Configure `web.config`

```xml
<system.web>
  <authentication mode="None" />

  <roleManager defaultProvider="DirectoryServicesRoleProvider" enabled="true" cacheRolesInCookie="true">
    <providers>
      <add name="DirectoryServicesRoleProvider" type="Pivotal.Security.Ldap.ActiveDirectoryRoleProvider, Pivotal.Security.Ldap" LDAPService="..." />
    </providers>
  </roleManager>
</system.web>
```

Programmatic imperative checking of role access:

```c#
bool isInRole = Roles.IsUserInRole("<role name>");
```

Declarative attribute based role access checks:

```c#
[Authorize(Roles = "<role name>")]
```

For more details [Custom Role Providers][roleprov]

## Resources

* [Steeltoe Security ASP.NET 4.x](https://steeltoe.io/docs/steeltoe-security/#1-3-usage-in-asp-net-4-x)
* [Configure SSO RedirectUri and Scope access](https://github.com/SteeltoeOSS/Samples/blob/aa5e641568f4e2a7804b5a6ebca44dab9db5891f/Security/src/AspDotNet4/CloudFoundrySingleSignon/README-SSO.md#configure-sso-redirecturi-and-scope-access)
* [ServicePointManager.ServerCertificateValidationCallback Property (System.Net) | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/system.net.servicepointmanager.servercertificatevalidationcallback?view=netframework-4.7.2)

[oidc]: https://openid.net/specs/openid-connect-basic-1_0.html "OIDC Implicit flow"
[pcfsso]: https://docs.pivotal.io/p-identity/1-3/configure-apps/web-app.html "PCF SSO"
[websso]: https://docs.pivotal.io/p-identity/1-3/getting-started.html#install "Setup SSO"
[sso]:  /sso_img/detailed_sso_flow.png "Detailed SSO Flow"
[owin]: http://www.c-sharpcorner.com/UploadFile/4b0136/introduction-of-owin-startup-class-in-visual-studio-2013-rc/ "OWIN Startup class"
[oidcazure]: http://www.cloudidentity.com/blog/2014/07/24/protecting-an-asp-net-webforms-app-with-openid-connect-and-azure-ad/ "OIDC for WebForms"
[roleprov]: https://www.codeproject.com/Articles/607392/Custom-Role-Providers "Custom Role Providers"
[implroleprov]: https://msdn.microsoft.com/en-us/library/8fw7xh74.aspx "Implementing Role Providers"
[ssolib]: https://github.com/pivotalservices/Manulife-App-Replatforming/tree/master/net-libraries/owin-oidc
[12factors]: https://en.wikipedia.org/wiki/Twelve-Factor_App_methodology