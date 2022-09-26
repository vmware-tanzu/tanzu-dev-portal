---
title: RBAC for Tanzu Application Platform in on Tanzu Kubernetes Grid and OpenLDAP
description: In this article, users will get detailed instructions on how to configure RBAC for Tanzu Application Platform on Tanzu Kubernetes Grid and OpenLDAP.
date: 2022-08-18
lastmod: 2022-08-18
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
tags:
- Tanzu
- Tanzu Application Platform
tanzu:
  label: tap
  featured: true
  featuredweight: 2
# Author(s)
team:
- Madhavan Srinivass Sampath
---

In this article, users will get detailed instructions on how to configure RBAC for Tanzu Application Platform on Tanzu Kubernetes Grid and OpenLDAP.

RBAC is a mechanism that restricts system access based on a role within the organization. Tanzu Application Platform (TAP) provides five default roles to help set up permissions for users and service accounts within a namespace on a cluster that runs one of the Tanzu Application Platform profiles.

User Roles: app-editor, app-viewer and app-operator

Service Accounts Roles: workload and Deliverable
## Prerequisites

A client machine with the following CLIs installed. - Tanzu CLI and plugins, TAP plugins, RBAC plugin, kubectl

## Installing OpenLDAP

1. Install the LDAP packages 

```
$ sudo apt update
$ sudo apt -y install slapd ldap-utils ``` When prompted, provide the LDAP admin password
```

2. Confirm the successful installation

```
$ ldap-admin@ldapserver:~# sudo slapcat
dn: dc=dapd,dc=net
objectClass: top
objectClass: dcObject
objectClass: organization
o: dapd.net
dc: dapd
structuralObjectClass: organization
entryUUID: 98c43c4a-66c4-103c-8f8e-7b50518483c1
creatorsName: cn=admin,dc=dapd,dc=net
createTimestamp: 20220513045504Z
entryCSN: 20220513045504.025940Z#000000#000#000000
modifiersName: cn=admin,dc=dapd,dc=net
modifyTimestamp: 20220513045504Z
```

3. Add base `dn` for Users and Groups

```
$ cat basedn.ldif
dn: ou=people,dc=dapd,dc=net
objectClass: organizationalUnit
ou: people

dn: ou=groups,dc=dapd,dc=net
objectClass: organizationalUnit
ou: groups
```

4. Add the user and group

```
$ ldapadd -x -D cn=admin,dc=example,dc=com -W -f basedn.ldif
Enter LDAP Password:
adding new entry "ou=people,dc=dapd,dc=net"
adding new entry "ou=groups,dc=dapd,dc=net"
```

5. Generate the password for `UserAccounts`

```
$ sudo slappasswd
New password:
Re-enter new password:
{SSHA}aTnt+LGt+i2AEj8fdRGI37AoGVugNYx3
```

6. Create User and Group config

```
$ cat  ldapusers.ldif
dn: uid=app-editor,ou=people,dc=dapd,dc=net
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: app-editor
sn: Wiz
userPassword: {SSHA}6VuoGldvwIWXZ2j4eJOBTz+RnOBoA7Qe
loginShell: /bin/bash
uidNumber: 2001
gidNumber: 2001
homeDirectory: /home/app-editor
$ cat ldapgroups.ldif
dn: cn=editor,ou=groups,dc=dapd,dc=net
objectClass: posixGroup
cn: editor
gidNumber: 2003
memberUid: editor
```

7. Apply the config

```
$ ldapadd -x -D cn=admin,dc=dapd,dc=net -W -f ldapusers.ldif 
Enter LDAP Password: 
adding new entry "uid=app-editor,ou=people,dc=dapd,dc=net"
$ ldapadd -x -D cn=admin,dc=dapd,dc=net -W -f ldapgroups.ldif
Enter LDAP Password: 
adding new entry "cn=editor,ou=groups,dc=dapd,dc=net"
```

8. Generate certificates and configure LDAP for SSL. Copy the certificates to `/etc/ldap/sasl2/` directory and change the ownership of `/etc/ldap/sasl2/*` to OpenLDAP user 

```
$ sudo cp {ldapserver.dapd.net.key,ldapserver.dapd.net.crt} \ /etc/ssl/certs/ca-certificates.crt /etc/ldap/sasl2/     $ sudo chown -R openldap. /etc/ldap/sasl2
```

9. Create LDAP configuration file for SSL

```
$ cat ldapssl.ldif
dn: cn=config
changetype: modify
add: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ldap/sasl2/ca.crt
-
add: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ldap/sasl2/ldapserver.dapd.net.crt
-
add: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ldap/sasl2/ldapserver.dapd.net.key
```

10. Apply the SSL config and restart the LDAP service

```
$ sudo ldapmodify -Y EXTERNAL -H ldapi:/// -f ldapssl.ldif
SASL/EXTERNAL authentication started
SASL username: gidNumber=0+uidNumber=0,cn=peercred,cn=external,cn=auth
SASL SSF: 0
modifying entry "cn=config"
$ sudo systemctl restart slapd
```

11. Secure the connection between the client and server 

```
echo "TLS_REQCERT allow" | sudo tee /etc/ldap/ldap.conf
```

## Configuring TKGm to use LDAP

For Tanzu Kubernetes Grid clusters, Pinniped is the default identity solution and is installed as a core package. Follow the documentation here for detailed procedure for installing TKG Management and Workload cluster.

1. Before creating the TKG Management cluster, get the following OpenLDAP details.

```
Bind DN eg:- cn=admin,dc=dapd,dc=net
Bind Password
Group Base DN eg:-ou=groups,dc=dapd,dc=net
User Base DN eg:- ou=people,dc=dapd,dc=net
Root CA cert if LDAP
```

2. Add the LDAP information to the config file to create a TKG management cluster. Refer here for detailed documentation.

```
IDENTITY_MANAGEMENT_TYPE: ldap 
LDAP_BIND_DN: "cn=admin,dc=dapd,dc=net" 
LDAP_BIND_PASSWORD: "VMware1!" 
LDAP_GROUP_SEARCH_BASE_DN: "ou=groups,dc=dapd,dc=net" 
LDAP_GROUP_SEARCH_FILTER: "(objectClass=posixGroup)"
LDAP_GROUP_SEARCH_GROUP_ATTRIBUTE: memberUid 
LDAP_GROUP_SEARCH_NAME_ATTRIBUTE: cn 
LDAP_GROUP_SEARCH_USER_ATTRIBUTE:  uid
LDAP_HOST: "10.221.41.4:636"
LDAP_ROOT_CA_DATA_B64: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURWRENDQWp5Z0F3SUJBZ0lVVXFPU0tHQk4rTmoyZnpSalZUZjdPTW9Gdlprd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0dURVhNQlVHQTFVRUF3d09aR0Z3WkdWc2FYWmxjbmt0WTJFd0hoY05Nakl3TlRFek1EWXlOVEExV2hjTgpNekl3TlRFd01EWXlOVEExV2pBWk1SY3dGUVlEVlFRRERBNWtZWEJrWld4cGRtVnllUzFqWVRDQ0FTSXdEUVlKCktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU1qWUdZNzdMRWdXcUlnZXk4RHRZZkxTWGI4SkFOVTMKUDMrQWZmOEV4NEVnZFllcXdjdkhNKzRQRzREeFc0cTJ2em5OK0VaVzNoa0xiWFh1emFqeGZEcVBna3p0NFJqegptZ2FzcFRSK3gyZ3hObVJDVnVGenVGQkYzZFdBYy9KMU05TERac3JSS2ZhWGowQmZlV1o5alNTVFN3c1ZVVU1BCkJlaFhDaUd5RldadXZjS3Q1VGl5bE9xcXdReTBqa0thTjg5eXFmVWVuUFd1WlpNNUNIRW5JK04waURnSHVQdzYKNWt4TFhnS3pnZlNZb1Z4bGVxcXZWNS9FQUhMWWtLRm4zRHZEL09qVXJ5dUMvbFZoZWgwSmNRQkgyWFluOWJjdQpSNzN6SFFBK0UvSTZ2aFZqTmFyNlJsZEF6cGQxU1ltR0Z5bzNuYXp4Ry9JTy9nWUh5TWc3dGRzQ0F3RUFBYU9CCmt6Q0JrREFkQmdOVkhRNEVGZ1FVelJvVWR4WFc0VXZhUmlPSUVVaFcyNFNzTFVzd1ZBWURWUjBqQkUwd1M0QVUKelJvVWR4WFc0VXZhUmlPSUVVaFcyNFNzTFV1aEhhUWJNQmt4RnpBVkJnTlZCQU1NRG1SaGNHUmxiR2wyWlhKNQpMV05oZ2hSU281SW9ZRTM0MlBaL05HTlZOL3M0eWdXOW1UQU1CZ05WSFJNRUJUQURBUUgvTUFzR0ExVWREd1FFCkF3SUJCakFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBVFExVm9aNDBYcU94bGZoMDNkNFlGTjFXSVl2YkpXYmMKdXR5ZSt2NU5iTkFzeWJaTXVOQndodEd4eE1odElBMWR0c200bTRUUDE5bjRVOGdNZWJqcjNFcVQ1OVMzQUZzTwpBbmNGOFl6ZHdYdWdSOE1SekpTY3BSenM4d3czSnNaR0hLUGUyWW04bytvcWFhZjAyM0Jvcjd5TjZJSElNZ2E4Cm05cDNnRVZ0dUtqWjM3aEFNcCtpRGtrSE9IMDZNVVBaZXdHMUFSTGxtRlY5Z1BZY05XcnFrSnUwSXErQlE2UjIKalgycDgxY2NzbGkwOWdhbDdueDBSYVJFTW8yNXpvK1M1anNWSVhZdGwwUk9YWWQzWUo5b2xDendiczQ2RHpIWQpyRWZCZWloWFQrMzRPR1gzaGNCN1o1V2pWMkVwelhBMGxSUjMwY3ZIRXRpTTVYcS84VlFXNHc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
LDAP_USER_SEARCH_BASE_DN: "ou=people,dc=dapd,dc=net"
LDAP_USER_SEARCH_FILTER: "(objectClass=inetOrgPerson)"
LDAP_USER_SEARCH_NAME_ATTRIBUTE: uid
LDAP_USER_SEARCH_USERNAME: uid
LDAP_USER_SEARCH_ID_ATTRIBUTE: uidNumber
LDAP_USER_SEARCH_EMAIL_ATTRIBUTE: uid
```

3. While creating Workload cluster, include the following in the config to setup pinniped.

```
IDENTITY_MANAGEMENT_TYPE: ldap
```

4. After the workload cluster creation is complete, get the Admin context for the workload cluster.

```
$ tanzu cluster kubeconfig get tkg-wld-02 --export-file tkg-wld-02-admin-kubeconfig   --admin
```

## Install Tanzu Application Platform

Install TAP on the workload cluster with admin privilege. minimal install procedure given below. Follow the documentation here for detailed installation procedure

1. Add the Tanzu Network secret to the workload cluster.

```
tanzu secret registry add tanzunet-creds --server registry.tanzu.vmware.com --username <TANZUNET-USERNAME> --password-stdin --export-to-all-namespaces
```

2. Add TAP repository to the cluster

```
tanzu package repository add tanzu-tap-repo --url registry.tanzu.vmware.com/tanzu-application-platform/tap-packages:1.2.0 -n tanzu-package-repo-global
```

3. Prepare the `tap-install-values.yaml`
```yaml
ceip_policy_disclosed: true
profile: full
shared: 
ingress_domain: tap.example.com
supply_chain: basic
buildservice: 
kp_default_repository: $REGISTRY/build-service
kp_default_repository_username: $REGISTRY_USERNAME
kp_default_repository_password: $REGISTRY_PASSWORD
tanzunet_username: $TANZUNET_USERNAME
tanzunet_password: $TANZUNET_PASSWORD
contour: 
envoy: 
    service: 
    type: LoadBalancer
infrastructure_provider: vsphere
namespace: tanzu-system-ingress
grype: 
namespace: my-apps
targetImagePullSecret: registry-credentials
metadata_store: 
app_service_type: ClusterIP
ingress_domain: tap.example.com
ingress_enabled: "true"
ootb_supply_chain_basic: 
cluster_builder: default
gitops: 
    ssh_secret: $SSH_SECRET_KEY
registry: 
    repository: tap/apps
    server: $REGISTRY
tap_gui: 
app_config: 
    app: 
    baseUrl: "http://tap-gui.tap.example.com"
    title: "TAP Beta 4"
    backend: 
    baseUrl: "http://tap-gui.tap.example.com"
    cors: 
        origin: "http://tap-gui.tap.example.com"
    catalog: 
    locations: 
        - 
        target: "https://GIT-CATALOG-URL/catalog-info.yaml"
        type: url
    integrations: 
    github: 
        - 
        host: github.com
        token: $GITHUB_TOKEN
ingressEnabled: true
service_type: ClusterIP
```

Replace placeholders `$REGISTRY`, `$REGISTRY_USERNAME`, `$REGISTRY_PASSWORD`, `$TANZUNET_USERNAME`, `$TANZUNET_PASSWORD`, `$GITHUB_TOKEN`, `$SSH_SECRET_KEY` and `tap.example.com` with appropriate real values.

4. Install TAP on the cluster

```
tanzu package install tap-full-profile -p tap.tanzu.vmware.com -v 1.2.0 -n tap-install -f tap-pkg-values.yaml --create-namespace
```

## Add RBAC role bindings

1. On the client machine, ensure the RBAC plugin is installed.

```
$ tanzu plugin list
NAME                DESCRIPTION                                                                                                                   SCOPE       DISCOVERY  VERSION        STATUS
login               Login to the platform                                                                                                         Standalone  default    v0.11.6        installed
management-cluster  Kubernetes management-cluster operations                                                                                      Standalone  default    v0.11.6        installed
package             Tanzu package management                                                                                                      Standalone  default    v0.11.6        installed
pinniped-auth       Pinniped authentication operations (usually not directly invoked)                                                             Standalone  default    v0.11.6        installed
secret              Tanzu secret management                                                                                                       Standalone  default    v0.11.6        installed
apps                Applications on Kubernetes                                                                                                    Standalone             v0.5.1         installed
rbac                The rbac plugin allows the tap platform operator to add or remove subjects from a tap default user role within a namespace.  Standalone             v1.0.1-beta.1  installed
services            Discover Service Types, Service Instances and manage Resource Claims (ALPHA)                                                  Standalone             v0.2.0         installed
accelerator         Manage accelerators in a Kubernetes cluster                                                                                   Standalone             v1.1.1         installed
insight             post & query image, package, source, and vulnerability data                                                                   Standalone             v1.1.3         installed
```

2. Add the RBAC role binding. Role binding can be added to individual user level or at group level

```
$ tanzu rbac binding add --user new-editor -r app-editor -n my-apps --kubeconfig tkg-wld-02-admin-kubeconfig

$ tanzu rbac binding add --group editor -r app-editor -n my-apps --kubeconfig tkg-wld-02-admin-kubeconfig

$ tanzu rbac binding get -r app-editor -n my-apps --kubeconfig tkg-wld-02-admin-kubeconfig
------
RoleBinding 'app-editor' has the following users:
- new-editor
------
RoleBinding 'app-editor' has the following groups:
- editor
------
ClusterRoleBinding 'app-editor-cluster-access' has the following users:
- new-editor
------
ClusterRoleBinding 'app-editor-cluster-access' has the following groups:
- editor
```

3. Get the kubeconfig without admin privilege

```
$ tanzu cluster kubeconfig get tkgm-15-wld01 --export-file tkg-wld-02-kubeconfig
ℹ  You can now access the cluster by specifying '--kubeconfig tkg-wld-02-kubeconfig' flag when using `kubectl` command
```

4. Copy this Kubeconfig to a machine with a browser and run kubectl commands. you’ll be redirected to authenticate. Login using LDAP user.

```
kubectl get pods -n my-apps --kubeconfig ~/tkg-wld-02-kubeconfig
Log in by visiting this link:
https://10.221.42.13/oauth2/authorize?access_type=offline&client_id=pinniped-cli&code_challenge=C80QanvFGmYNzOrDW00qgakqL4vkIW_da6srU4HHBGM&code_challenge_method=S256&nonce=43f35735a2aeac339ef9aa6454033c29&redirect_uri=http%3A%2F%2F127.0.0.1%3A56604%2Fcallback&response_mode=form_post&response_type=code&scope=offline_access+openid+pinniped%3Arequest-audience&state=23f25868966a04e521618fcbde6dda3b 
    Optionally, paste your authorization code: [...]

NAME                                                  READY   STATUS       RESTARTS   AGE
tanzu-java-web-app-00003-deployment-6f7db89b5-wtb96   2/2     Running      0          12d
tanzu-java-web-app-build-1-build-pod                  0/1     Completed    0          13d
tanzu-java-web-app-build-2-build-pod                  0/1     Init:Error   0          13d
tanzu-java-web-app-config-writer-5htcq-pod            0/1     Completed    0          13d
tanzu-java-web-app-config-writer-69g64-pod            0/1     Completed    0          13d
tanzu-java-web-app-config-writer-6nmpj-pod            0/1     Completed    0          13d
tanzu-java-web-app-config-writer-d2v6b-pod            0/1     Completed    0          12d
tanzu-java-web-app-config-writer-jkvjk-pod            0/1     Completed    0          13d
tanzu-java-web-app-config-writer-nnmgl-pod            0/1     Completed    0          13d
```