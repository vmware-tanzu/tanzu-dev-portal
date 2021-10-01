---
date: '2021-02-24'
description: Configuring the Dex identity provider.
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Configuring Dex
parent: Identity and Access Control
title: Configuring the Dex Identity Provider
weight: 1600
featured: true
oldPath: "/content/guides/kubernetes/identity-dex.md"
aliases:
- "/guides/kubernetes/identity-dex"
level1: Securing Kubernetes
level2: Access and Security
tags: []
---

## Motivation

Most organizations have an IT department that handle new staff on boarding and
provide them a new set of credentials. These credentials are stored in
centralized directory service, most commonly Active Directory. Some cases expose
these services through an Identity Provider using OIDC or SAML.

Authentication and Authorization is a common topic on how you can provide
Kubernetes cluster access and the resources to the intended user; e.g.:
Developers, Kubernetes Admin, Backup Admin, etc. Rather than create and manage a
new user repository, you can leverage Dex and Gangway to enable kubernetes
cluster authentication using an existing Identity Provider.

Gangway is a web application that enables the OIDC authentication flow which
results in the minting of the ID Token.Dex acts as a portal to other identity
providers through "connectors."

## Configuration

![Dex Gangway Setup](images/dex-setup-01.png#diagram)
**Figure 1: Dex - Gangway Identity Federation**

Assuming you have either Active Directory or IDP server that provide centralized
user management and you wish all your Kubernetes user is authenticated before
they are able to access the resource. This scenario is the typical usage for
Dex and Gangway and will be explained further in the following sections

### Dex and Gangway

![Dex Gangway Setup](images/dex-setup-02.png#diagram)
**Figure 2: Dex - Gangway Configuration**

Dex provide common OIDC endpoints for multiple Identity providers. To configure
Dex and Gangway communication, you need to collect some information from Dex.
Following OIDC standard, Dex provides a URL where its OIDC configuration can
be gathered. This URL is located at `.well-known/openid-configuration` and by
accessing the URL, Dex will produce the following response

```yaml
## Sample '.well-known/openid-configuration' DEX response
{
  "issuer": "http://app.example.com",
  "authorization_endpoint": "http://app.example.com/auth",
  "token_endpoint": "http://app.example.com/token",
  "jwks_uri": "http:/app.example.com/keys",
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported":
    ["openid", "email", "groups", "profile", "offline_access"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic"],
  "claims_supported":
    [
      "aud",
      "email",
      "email_verified",
      "exp",
      "iat",
      "iss",
      "locale",
      "name",
      "sub",
    ],
}
```

With the above response from Dex, Gangway configuration can be defined
as follows.

```Yaml
## Sample Gangway ConfigMap configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: gangway
data:
  gangway.yaml: |
    serveTLS: false
    certFile: /tls/tls.crt
    keyFile: /tls/tls.key
    clusterName: "{{Gangway cluster name}}"

    #!! Dex URL for token auth request
    authorizeURL: "{{ Dex authorization_endpoint }}"

    #!! Dex URL to obtain access tokens.
    tokenURL: "{{ Dex token_endpoint }} "

    # Where to redirect back to. This should be a URL where gangway is reachable.
    # Typically this also needs to be registered as part of the oauth application
    # with the oAuth provider.
    redirectURL: "{{Gangway hostname}}/callback"

    # Used to specify the scope of the requested Oauth authorization.
    #!! Refer to dex `scopes_supported` response above
    scopes: ["openid", "profile", "email", "offline_access"]

    # API client ID as indicated by the identity provider
    clientID: "{{Gangway Client Id}}"

    #!! refer to dex `claims_supported` response above.
    usernameClaim: "email"

    # The API server endpoint used to configure kubectl
    apiServerURL: "{{ Kubernetes API hostname }}:6443/"

    # The path to a root CA to trust for self signed certificates
    # at the Oauth2 URLs.
    # the dex-ca.crt can be mounted as secret in kubernetes
    trustedCAPath: /etc/dex/dex-ca.crt
    idpCAPath: /etc/dex/dex-ca.crt
```

#### Registering Gangway

In order to establish communication between Dex and Gangway, Dex require a
registration of Gangway through `Client id`, and `Client secret` exchange.
This allow Dex to authenticate that the intended requestor (in this case
Gangway) is registered within Dex and is allowed to retrieve access token
through Dex.

The configuration for Client id and Secret in Dex and Gangway can be define
as follows

```yaml
## Sample Dex Config Map
apiVersion: v1
kind: ConfigMap
metadata:
  name: dex
data:
  config.yaml: |
    ...
    staticClients: 
    - id: {{Gangway Client Id}}
      redirectURIs:
      - '{{ Gangway Callback URL}}'
      name: '{{Gangway Client Id}}'
      secret: {{Decoded Gangway Client Secret}}
    ....
```

```yml
## Sample Gangway Secret
apiVersion: v1
kind: Secret
metadata:
  name: gangway
type: Opaque
data:
  #! Key to generate secret session.
  #! Command to run : openssl rand -base64 32 | pbcopy
  sesssionKey: { { session key for dex } }
  #! base64 encoded client secret , shoudl match with Dex config Client Secret
  #! echo -n "$clientSecret" | base64
  clientSecret: { { encoded Gangway Client Secret } }
```

### Identity Federation

![dex-federation](images/dex-setup-03.png#diagram)
**Figure 3: Dex - Identity Federation**

Dex acts as a portal to other identity providers through `connectors`. This
lets Dex defer authentication to LDAP servers, SAML providers, or established
identity providers like GitHub, Google, and Active Directory. Clients write
their authentication logic once to talk to Dex, then Dex handles the protocols
for a given backend.

Upon successful authentication, signed JWT token returned by Dex as part of the
authentication (OAuth2) response that attest to the end user's identity. The JWT
token issued by Dex contains standard claims which can be consumed by other
system for service to service call.

```json
// Sample JWT claims response from Dex.
{
  "iss": "http://127.0.0.1:5556/dex",
  "sub": "CgcyMzQyNzQ5EgZnaXRodWI",
  "aud": "example-app",
  "exp": 1492882042,
  "iat": 1492795642,
  "at_hash": "bi96gOXZShvlWYtal9Eqiw",
  "email": "jane.doe@ldap.com",
  "email_verified": true,
  "groups": ["admins", "developers"],
  "name": "Jane Doe"
}
```

#### Connector

A `connector` is a plugin that used by Dex for authenticating a user against
another identity provider. Dex adopted connectors that target specific platforms
such as LDAP, OIDC, Github, SAML, etc. A list of available connectors is available
[here](https://github.com/dexidp/dex/blob/master/README.md#connectors).

Depending on the connectors limitations in protocols can prevent Dex from
issuing refresh tokens or returning group membership claims. For example,
because SAML doesn't provide a non-interactive way to refresh assertions, if a
user logs in through the SAML connector Dex won't issue a refresh token to
its client.

With the example from the above diagrams (figure 1), the configuration for the
connectors can be defined as follows

##### _For LDAP Connector_

```yml
connectors:
  - type: ldap
    id: ldap
    name: LDAP
    config:
      host: ldap.example.com:636
      insecureNoSSL: true
      insecureSkipVerify: true
      startTLS: true
      rootCA: /etc/dex/ldap.ca
      bindDN: uid=serviceaccount,cn=users,dc=example,dc=com
      bindPW: password
      usernamePrompt: SSO Username
      userSearch:
        baseDN: cn=users,dc=example,dc=com
        filter: "(objectClass=person)"
        username: uid
        idAttr: uid
        emailAttr: mail
        nameAttr: name
      groupSearch:
        baseDN: cn=groups,dc=freeipa,dc=example,dc=com
        filter: "(objectClass=group)"
        userMatchers:
          - userAttr: uid
            groupAttr: member
        nameAttr: name
```

##### _For OIDC Connector_

```yml
connectors:
  - type: oidc
    id: oidcServer
    name: oidcServer
    config:
      issuer: https://accounts.google.com
      clientID: $CLIENT_ID
      clientSecret: $CLIENT_SECRET
      # Dex's issuer URL + "/callback"
      redirectURI: http://127.0.0.1:5556/callback

      # Some providers require passing client_secret via POST parameters instead
      # of basic auth, despite the OAuth2 RFC discouraging it. Many of these
      # cases are caught internally, but some may need to uncomment the
      # following field.
      #
      basicAuthUnsupported: true

      # List of additional scopes to request in token response
      # Default is profile and email
      # Full list at https://github.com/dexidp/dex/blob/master/Documentation/custom-scopes-claims-clients.md
      scopes:
        - profile
        - email
        - groups
      insecureSkipEmailVerified: true
      insecureEnableGroups: true

      # When enabled, the OpenID Connector will query the UserInfo endpoint for additional claims. UserInfo claims
      # take priority over claims returned by the IDToken. This option should be used when the IDToken doesn't contain
      # all the claims requested.
      # https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
      getUserInfo: true

      # The set claim is used as user id.
      # Default: sub
      # Claims list at https://openid.net/specs/openid-connect-core-1_0.html#Claims
      userIDKey: nickname

      # The set claim is used as user name.
      # Default: name
      userNameKey: nickname

      # For offline_access, the prompt parameter is set by default to "prompt=consent".
      # However this is not supported by all OIDC providers, some of them support different
      # value for prompt, like "prompt=login" or "prompt=none"
      promptType: consent
```

##### _For SAML Connector_

```yml
connectors:
  - type: saml
    # Required field for connector id.
    id: saml
    # Required field for connector name.
    name: SAML
    config:
      # SSO URL used for POST value.
      ssoURL: https://saml.example.com/sso

      # CA to use when validating the signature of the SAML response.
      ca: /path/to/ca.pem

      # Dex's callback URL.
      redirectURI: https://dex.example.com/callback

      # Name of attributes in the returned assertions to map to ID token claims.
      usernameAttr: name
      emailAttr: email
      groupsAttr: groups # optional

      # To skip signature validation, uncomment the following field. This should
      # only be used during testing and may be removed in the future.
      #
      insecureSkipSignatureValidation: true

      # Optional: Manually specify dex's Issuer value.
      entityIssuer: https://dex.example.com/callback

      # Optional: Issuer value expected in the SAML response.
      ssoIssuer: https://saml.example.com/sso

      # Optional: Delimiter for splitting groups returned as a single string.
      groupsDelim: ", "

      # Optional: Requested format of the NameID.
      nameIDPolicyFormat: persistent
```