---
date: '2021-01-29'
lastmod: '2021-01-29'
linkTitle: Securing Config Server
parent: Spring Cloud Config Server
patterns:
- API
tags:
- Spring Cloud Config Server
title: Securing Spring Cloud Config Server
topics:
- Spring
- Microservices
oldPath: "/content/guides/spring/spring-cloud-config-security.md"
aliases:
- "/guides/spring/spring-cloud-config-security"
level1: Building Modern Applications
level2: Frameworks and Languages
---

As explained in [Setting Up Spring Cloud Config Server](/guides/spring/spring-cloud-config-set-up/), a Spring Cloud Config Server provides a centralized configuration repository for Spring apps. The [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/reference/html/) externalizes configuration information for an application and serves out this information via a REST interface. Some configuration information is sensitive (such as passwords) and requires greater security. 

This guide explains two methods to increase the security of a Config Server:

* Using encryption in combination with a git repository
* Using Vault as a secure repository

**NOTE:** To use encryption and decryption features you need the full-strength Java Cryptography Extension (JCE) installed in your JVM (it is not included by default). Download the *Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files* from Oracle, and follow instructions for installation (essentially replace the two policy files in the JRE lib/security directory with the ones you downloaded).
## Securing a git repository
The default backend for a Config Server is a git repository. This can be configured to store and serve encrypted configuration values to protect sensitive information. In a secure Config Server, the remote property sources contain encrypted content (values starting with `{cipher}`). These will be decrypted before sending to clients over HTTP. The main advantage of this approach is that property values aren’t stored in plain text. 

Keep the following in mind when using [encryption](https://cloud.spring.io/spring-cloud-config/multi/multi__spring_cloud_config_server.html#_encryption_and_decryption):

* Encrypted values in an `application.yml` file can be wrapped in quotes:
```
spring:
   datasource:
      username: dbuser
      password: '{cipher}FKSAJDFGYOS8F7GLHAKERGFHLSAJ'
```

* Encrypted values in an `application.properties` file must not be wrapped in quotes, otherwise the value will not be decrypted: `spring.datasource.password: {cipher}FKSAJDFGYOS8F7GLHAKERGFHLSAJ`

* The Config Server exposes `/encrypt` and `/decrypt` endpoints (on the assumption that these are secured and only accessed by authorized agents). If you edit a remote config file, you can use the Config Server to encrypt values by POSTing to the /encrypt endpoint.

* Take the encrypted value and add the `{cipher}` prefix before you put it in the YAML or properties file and before you commit and push it to a remote (potentially insecure) store.

### Key management: symmetric vs. asymmetric keys
The Config Server can use symmetric (shared) or asymmetric keys (RSA key pair). The asymmetric choice is superior in terms of security, but it is often more convenient to use a symmetric key since it is a single property value to configure in `bootstrap.properties`.

To configure a symmetric key, you need to set `encrypt.key` to a secret String (or use the `ENCRYPT_KEY` environment variable to keep it out of plain-text configuration files).  

You cannot configure an asymmetric key using `encrypt.key`. To configure an asymmetric key use a keystore (e.g. as created by the `keytool` utility that comes with the JDK). The keystore properties are: 

* `encrypt.keyStore.location` Contains a Resource location
* `encrypt.keyStore.password` Holds the password that unlocks the keystore
* `encrypt.keyStore.alias` Identifies which key in the store to use
* `encrypt.keyStore.type` The type of KeyStore to create. Defaults to jks

Encryption is done with the public key, and a private key is needed for decryption. Thus, in principle, you can configure only the public key in the server if you want to only encrypt (and are prepared to decrypt the values yourself locally with the private key). 

In practice, you might not want to decrypt locally because it spreads the [key management](https://cloud.spring.io/spring-cloud-config/multi/multi__spring_cloud_config_server.html#_key_management) process to all the clients, instead of concentrating it on the server. On the other hand, it can be a useful option if your Config Server is relatively insecure and only a handful of clients need the encrypted properties.

## Using HashiCorp Vault as a secure external repository
Spring Cloud Vault Config provides client-side support for externalized configuration in a distributed system. [HashiCorp’s Vault](https://learn.hashicorp.com/collections/vault/getting-started) is a central place to manage external secret properties for applications across all environments. It can be used to back Config Server instances.This section provides some guidelines for working with a Vault backend. 

**NOTE** you can also configure applications to access Vault directly using [Spring Cloud Vault](https://cloud.spring.io/spring-cloud-vault/reference/html/). Spring Cloud Vault and Spring Cloud Config with a Vault backend are [not the same thing](https://stackoverflow.com/questions/45502722/difference-between-spring-cloud-vault-and-spring-cloud-config-with-vault-backend).

To enable Config Server to [use a Vault backend](https://cloud.spring.io/spring-cloud-config/reference/html/#vault-backend), you run your Config Server with the Vault profile. For example, in your Config Server’s `application.properties`, add `spring.profiles.active=vault`.

By default, Config Server assumes that your Vault server runs at `http://127.0.0.1:8200`. It also assumes that the name of `backend` is `secret` and the `key` is `application`. All of these defaults can be re-configured in your Config Server’s `application.properties`. All the configurable properties can be found in `org.springframework.cloud.config.server.environment.VaultEnvironmentProperties.`

With your Config Server running, you can make HTTP requests to the server to retrieve values from the HashiCorp Vault backend. To do so, you need a token for your Vault server.

First, place some data in you Vault, as shown in the following example:

```
$ vault kv put secret/application foo=bar baz=bam
$ vault kv put secret/myapp foo=myappsbar
```
Second, make an HTTP request to your config server to retrieve the values:

```
$ curl -X "GET" "http://localhost:8888/myapp/default" -H "X-Config-Token: yourtoken"
```
This is the default way for a client to provide the necessary authentication to let Config Server talk to HashiCorp Vault.

## Keep Learning 
You can use the encryption features of Spring Cloud Config Server with a git repository to improve the security of your configuration service, or use Vault as a backend for situations that require the highest security. Some organizations or projects use a git repository for configuration information that does not need to be secured, plus a HashiCorp Vault repository for secrets.

You can get started learning about and using Spring Cloud Config with git in the [Centralized Configuration Guide](https://spring.io/guides/gs/centralized-configuration/). Although it does not include use of encryption, this guide steps through the process of setting up a Config Server and consuming configuration information from a client. Use that as a starting point to explore the use of encryption as described above. 

If you want to learn more and get started using a Vault backend, this [sample code on Github](https://github.com/spring-cloud-samples/spring-cloud-config-vault) provides an example of a working Config Server with Vault and Config Client plus usage instructions.