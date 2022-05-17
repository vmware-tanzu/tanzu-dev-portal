+++
date = "2017-06-14T12:00:00-07:00"
title = "OAuth 2.0 and PCF SSO - Client"
+++

In the scenarios where APIs are consumed by other systems without involvement of user – batch processes, nightly schedules etc – Consumer application is authenticated using Oauth2.0 Client Credentials Flow – it provides the client_id, client_secret to OIDC/OAuth2 provider and receives back signed Access token with the scopes this application is authorized for. This access token is passed in the HTTP header to the API for validation and authorization according to [JWT Bearer Profile](https://tools.ietf.org/html/rfc7523) and [Authorization profile](https://tools.ietf.org/html/rfc6750)

Solution is based on WCF Client JWT Interceptor that will Connect PCF SSO and get Access Token and will embed it into HTTP Header for the service being invoked. Here is a simplified diagram:

![JWT SSO Flow](/images/cookbooks/dotnet/sso_img/client_cred.png)

## WCF Services Clients

JWT interceptor implements WCF `IClientMessageInspector`  to get and inject the JWT token. To allow for configuration based setup behavior extension - `Steeltoe.Security.Authentication.CloudFoundryWcf.JwtHeaderEndpointBehavior` is provided and could be configured in `web.config` for the endpoints.  

### Configuration

Install the [JWT Library][jwtlib] that authenticates and gets JWT Tokens

```ps
Install-Package Steeltoe.Security.Authentication.CloudFoundryWcf
```

Configure SSO service on [PCF for Service-to-Service][pcfsso] and bind it to your application. Add scopes that need to be requested by the client to your `appSettings`:

```xml
<appSettings>
  <add key="RequiredScopes" value="openid; your_app_permission_scope" />
</appSettings>
```

Configure JWT Behavior extension – Configure JWT endpoint behavior which will get `Access_Token` and add it to the HTTP Headers before calling webservice

```xml
<system.serviceModel>
  <behaviors>
    <endpointBehaviors>
      <behavior name="jwtBehavior">
        <jwtSSOBehavior />
      </behavior>
    </endpointBehaviors>
  </behaviors>
  <extensions>
    <behaviorExtensions>
      <add name="jwtSSOBehavior" type="Steeltoe.Security.Authentication.CloudFoundryWcf.JwtHeaderEndpointBehavior, Steeltoe.Security.Authentication.CloudFoundryWcf" />
    </behaviorExtensions>
  </extensions>
  <client>
    <endpoint address="http://<service>.svc" binding="basicHttpBinding" behaviorConfiguration="jwtBehavior" />
  </client>
</system.serviceModel>
```

[pcfsso]: https://docs.pivotal.io/p-identity/1-3/configure-apps/web-app.html "PCF SSO"
[jwtlib]: https://github.com/pivotalservices/Manulife-App-Replatforming/tree/master/net-libraries/CloudSecurity-JWT "JWT Library"
