+++
date = "2017-06-14T12:00:00-07:00"
title = "OAuth 2.0 and PCF SSO - Server"
+++

WCF WebServices (both SOAP and REST) are  protected by requiring all communication to present OAuth 2.0 Access Token. Access tokens are obtained by the client from Pivotal SSO and is signed and encoded and is passed in HTTP `Authorization` Header according to [JWT Bearer Profile](https://tools.ietf.org/html/rfc7523) and [Authorization profile](https://tools.ietf.org/html/rfc6750). The WCF JWT interceptor will validate the access token by retrieving the keys from the bound PCF SSO tile and ensuring the JWT token is valid (signature, lifespan, scopes etc). If token is valid the authenticated identity will be created and passed to the application context. Here is a simplified diagram:

![JWT SSO Flow](/images/cookbooks/dotnet/sso_img/client_cred.png)

## WCF Application Security Checks

First you should analyze the scenario which is used to invoke WCF Web Services. Is there an end user involved or is it a service to service (batch type) communication? In the latter, scope based Authorization is typically involved by validating scopes issued in the access token based on the client that is trying to connect. For the former, access tokens usually have some user specific information in the claims that helps to establish user role and perform role based authorization. Typically there are two types of authorization checks: principal based checks and claims based checks.

### Principal Based Checks

Perform entitlements checks based on the information available in the **Principal** for scenarios with an end user. For such scenarios code uses variations of the `IPrincial.IsInRole`:

```c#
HttpContext.Current.User.IsInRole;
Thread.CurrentPrincipal.Identity;
ClaimsPrincipal.IsInRole;
```

Or declaratively using Attributes

```c#
[PrincipalPermission(SecurityAction.Demand, Role="Admin")]
```

### Claims Based Checks

For server to server (batch) scenarios there is no end user and communication is secured by an OAuth2 token with scopes. Scopes represent claims about permissions that the consumer has based on it's authentication. There is no user principal in context of the application in this case. To obtain the identity:

```c#
ClaimsIdentity identity = ClaimsPrincipal.Current.Identity as ClaimsIdentity;
ClaimsPrincipal principal = Thread.CurrentPrincipal as ClaimsPrincipal;

// check the scope
principal.HasClaim("scope", <specific scope>);
```

## WCF Authentication and Authorization

WCF allows you to modify run-time behavior at the service level or at the endpoint level using custom behaviors. We will use a [Custom Security behavior][custbeh] that validates JWT tokens and the necessary entitlements. Authorization decisions are made by the custom `JwtServiceAuthorizationManager` class that validates the scopes provided in the JWT.

### JWT Based Authentication for Service-to-Service - Claims Based Checks

- Install the [JWT Library][jwtlib] that authenticates the JWT Token and provides WCF extension points

```ps
Install-Package Steeltoe.Security.Authentication.CloudFoundryWcf
```

- Setup resources and available scopes for the application in the [PCF SSO Tile][pcfsso]. Obtain and configure the authentication domain url as it will be used to retrieve UAA signing keys.

- Configure the WCF service behavior to include the JWT Authentication using `Steeltoe.Security.Authentication.CloudFoundry.Wcf.JwtAuthorizationManager`. It will act as interceptor by connecting to the configured PCF SSO authentication domain and retrieving the JWT signing key and validating the JWT provided in the Authorization Header. If no Authorization header is present or if the JWT token is invalid a HTTP 401 error will be issued.

An example of applying the JWT Authorization Manager to all services that do not have an explicit behavior configuration:

```xml
<system.serviceModel>
  <behaviors>
    <serviceBehaviors>
      <behavior>
        <!--Claims with Roles-->
        <serviceAuthorization serviceAuthorizationManagerType="Steeltoe.Security.Authentication.CloudFoundry.Wcf.JwtAuthorizationManager,Steeltoe.Security.Authentication.CloudFoundryWcf" />
        </behavior>
    </serviceBehaviors>
  </behaviors>
</system.serviceModel>
```

An example of applying a named JWT Authorization Manager behavior and applying it to a single service:

```xml
<serviceBehaviors>
  <behavior name="JWTBehaviour">
    <!--Claims with Roles-->
    <serviceAuthorization serviceAuthorizationManagerType="Steeltoe.Security.Authentication.CloudFoundry.Wcf.JwtAuthorizationManager,Steeltoe.Security.Authentication.CloudFoundryWcf" />
        </behavior>
</serviceBehaviors>
```

```xml
<service name="WcfTestService.TestRestService" behaviorConfiguration="JWTBehaviour" >
  <endpoint address="" behaviorConfiguration="restfullBehavior" binding="webHttpBinding" contract="WcfTestService.ITestRestService" />
</service>  
```

-  Configure Audience and scopes - JWT obtained by clients will have audience elements listing its client_id  in it. Service should configure which clients(audiences it trusts) - they will be validated as part of JWT validation process. For Authorization checks Enable list of the Required Scopes to be used with `ScopePermission` attribute or in code.

  ```xml
  <appSettings>
    <!-- semicolon separated lists -->
    <add key="AddAllowedAudiences" value="<client id" />
    <add key="RequiredScopes" value="<scope name>"/>
  </appSettings>
  ```

- Perform AuthZ checks

  ```c#
  ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
  // check the scope programtically
  principal.HasClaim("scope", <specific scope>);

  // or, check the scope declaratively with an attribute
  [ScopePermission(SecurityAction.Demand, ConfigurationName = "RequiredScopes")]
  ```

### JWT Based Authentication for End Users - Role Based Checks

- Install the package that authenticates the JWT Token and retrieves AD groups  and sets them in the Principal

  ```ps
  Install-Package Steeltoe.Security.Authentication.CloudFoundryWcf
  ```

- Setup resources and available scopes for the application in [PCF SSO Tile][pcfsso]. If you want to have the roles (LDAP groups) and user attributes (e.g. `empuniqueid`) in the Id Token (available when the `openid` scope is selected), make sure you have the roles and user_attributes selected.

- Configure the WCF service behavior to include the JWT Authentication and AD group retrieval to the `Principal using Steeltoe.Security.Authentication.CloudFoundryWcf.JwtAuthorizationManager` globally for all services:

  ```xml
  <system.serviceModel>
    <behaviors>
      <serviceBehaviors>
        <behavior>
          <!--Claims with Roles-->
          <serviceAuthorization serviceAuthorizationManagerType="Steeltoe.Security.Authentication.CloudFoundryWcf.JwtAuthorizationManager, Steeltoe.Security.Authentication.CloudFoundryWcf" />
        </behavior>
      </serviceBehaviors>
    </behaviors>
  </system.serviceModel>
  ```

To apply it on per-Service basis you could create named behavior and apply it to service.

```xml 
<serviceBehaviors>
  <behavior name="JWTBehaviour">
    <!--Claims with Roles-->
    <serviceAuthorization serviceAuthorizationManagerType="Steeltoe.Security.Authentication.CloudFoundryWcf.JwtAuthorizationManager, Steeltoe.Security.Authentication.CloudFoundryWcf" />
  </behavior>
</serviceBehaviors>
```

```xml
<service name="WcfTestService.TestRestService" behaviorConfiguration="JWTBehaviour" >
  <endpoint address="" behaviorConfiguration="restfullBehavior" binding="webHttpBinding" contract="WcfTestService.ITestRestService" />
</service>
```

Example of retrieving Identity and Claims, ACLs in WCF code

```c#
IPrincipal principal = Thread.CurrentPrincipal;
// check the role programtically
principal.IsInRole(<specific role>);

// or, check the role declaratively with an attribute
[PrincipalPermissionEnv(SecurityAction.Demand, Role = "AdminRole")]
```

Declaratively test the permissions on the service using an attribute on the service. Replace the existing `[PrincipalPermission]` (or add new to the service you need to secure) with the extended `PrincipalPermissionEnv` attribute that will read the role configuration from environment variable in PCF or `web.config` locally, instead of hardcoded roles.

```xml
<appSettings>
  <add key="AdminRole" value="<ad group name"/>
</appSettings>
```

```c#
using Steeltoe.Security.Authentication.CloudFoundryWcf;
public class TestRestService : ITestRestService
{
  [PrincipalPermissionEnv(SecurityAction.Demand, Role = "AdminRole")]
  public string DoWork(string id)
  {
    ClaimsIdentity identity = ClaimsPrincipal.Current.Identity as ClaimsIdentity;
  }
}
```

[Check WCF Sample application in Steeltoe samples](https://github.com/SteeltoeOSS/Samples/tree/dev/Security/src/AspDotNet4/CloudFoundryWcf)

## JWT Library Reference

The SSO integration is plugged to WCF extensibility point to apply Authentication/Authorization in the behavior for the services implementing custom `ServiceAuthorizationManager`:

- `Steeltoe.Security.Authentication.CloudFoundry.Wcf.JwtAuthorizationManager` - implements the `ServiceAuthorizationManager` and validates the JWT token based on SSO JWT keys , validates  signature, lifetime, scopes, audience and issuer.

- `PrincipalPermissionEnv` – custom Attribute to validate Roles based on the configured in environment Roles. Works with `JwtAuthorizationManager` configured as it checks the Principal roles. `[PrincipalPermissionEnv(SecurityAction.Demand, Role = "AdminRole")]`

- `ScopePermission` - custom Attribute to validate Scopes based on the configured in environment settings. `[ScopePermission(SecurityAction.Demand, ConfigurationName = "RequiredScopes")]`

- **Error Handling** - JWT validation interceptor will return HTTP 401 code (with error code and error description in WWW-Authenticate Header) for authentication failures and authorization checks according to:
https://tools.ietf.org/html/rfc6750



[custbeh]: https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/security-behaviors-in-wcf "Security Behaviors in WCF"
[pcfsso]: https://docs.pivotal.io/p-identity/1-3/configure-apps/web-app.html "PCF SSO"
[servauthz]: https://docs.microsoft.com/en-us/dotnet/framework/configure-apps/file-schema/wcf/serviceauthorization-element "Service Authorization"
[jwtlib]: https://github.com/pivotalservices/Manulife-App-Replatforming/tree/master/net-libraries/CloudSecurity-JWT "JWT Library"
[steeltoesec]: https://github.com/SteeltoeOSS/Security/tree/master/src/Steeltoe.Security.Authentication.CloudFoundryWcf "Steeltoe Security Auth Wcf"
