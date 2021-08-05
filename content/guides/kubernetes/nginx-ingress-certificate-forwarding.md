---
title: "Forwarding Client Certificates with NGINX Ingress"
description: >
  A look at annotations to configure Kubernetes NGINX Ingress for forwarding client certificates
date: 2021-05-17
tags:
  - Kubernetes
team:
  - Ray Chuan Tay
topic:
  - Kubernetes
---


## Introduction

If you are building an application service, there are several ways to authenticate an incoming request from another application. Using API keys is one way. Another is to have the application make the request (which we'll refer to in the rest of this guide as the client) and send a certificate to authenticate itself. While we might commonly associate the TLS protocol with certificates being sent by the server-side of the request and authenticating them, such as when we browse to a `https://` website in our browser, TLS also supports clients sending certificates [^tls7.4.6].

[^tls7.4.6]: https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.6

What advantage do client certificates offer compared to API keys? As Cloudflare[^Cloudflare] puts it,

> <!-- spellchecker-disable -->[C]lient<!-- spellchecker-enable --> certificates offer a layer of security that API keys cannot provide. If an API key gets compromised mid-connection, it can be reused to fire its own valid, trusted requests to the backend infrastructure. However, the private key of the client certificate is used to create a digital signature in every TLS connection, and so even if the certificate is sniffed mid-connection, new requests can’t be instantiated with it.

[^Cloudflare]: https://blog.cloudflare.com/introducing-tls-client-auth/

In this post, we'll look at how to configure NGINX Ingress to forward or pass-through client certificates to your application service without NGINX Ingress performing client certificate validation of its own. This is useful if you already have your client certificate validation logic in your application, and you'd like to deploy that application on a Kubernetes cluster using NGINX Ingress.


## Kubernetes Setup

1. Place your certificate authority (CA) certificate (if you have just one) or concatenate the CA certificates (if you have multiple) into a file named `ca.crt`.

    ```shell
    # if single CA certificate
    cat certificate.crt > ca.crt
    # if multiple CA certificates
    cat certificate1.crt certificate2.crt > ca.crt
    ```

2. Create a secret containing the CA certificate(s). Take note that the file in the secret containing the CA certificate(s) must be named `ca.crt`. On the other hand, you may name the secret however you wish.

    ```shell
    kubectl create secret generic ca-secret --from-file=ca.crt=ca.crt
    ```

    For the rest of the guide, we'll assume this secret is named `ca-secret` in the namespace `default`.

3. Add the following annotations on your NGINX Ingress resource:

    ```yaml {linenos=false,hl_lines=["5-10"]}
    apiVersion: networking.k8s.io/v1beta1
    kind: Ingress
    metadata:
      annotations:
        # Specify the secret containing CA certificates in the form <namespace>/<secret name>
        nginx.ingress.kubernetes.io/auth-tls-secret: "default/ca-secret"
        # Specify that certificates are to be passed on
        nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true"
        # Do not fail request if no or an otherwise invalid certificate is provided
        nginx.ingress.kubernetes.io/auth-tls-verify-client: "optional"
      name: my-ingress
      namespace: default
    ```

With this configuration, if the client does not send certificates in their request, NGINX Ingress still allows the request to your application. Whereas with the following configuration, the client must send certificates in their requests to your application. When the client does not send certificates in their requests, NGINX Ingress responds with a 400 Bad Request error.

```yaml {linenos=false,hl_lines=["5-8"]}
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    # Specify the secret containing CA certificates in the form <namespace>/<secret name>
    nginx.ingress.kubernetes.io/auth-tls-secret: "default/ca-secret"
    # Specify that certificates are to be passed on
    nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true"
  name: my-ingress
  namespace: default
```


## Application Setup

By default, NGINX Ingress places the URL-encoded PEM client certificate in the `ssl-client-cert` header, for example `-----BEGIN%20CERTIFICATE-----%0A...---END%20CERTIFICATE-----%0A`.

This corresponds to the NGINX variable `$ssl_client_escaped_cert`[^nginx_ssl_cert_docs].

[^nginx_ssl_cert_docs]: http://nginx.org/en/docs/http/ngx_http_ssl_module.html#var_ssl_client_escaped_cert


## Closing

For other values to `auth-tls-verify-client`, as well as additional verification configurations such as validation depth, refer to the [NGINX Ingress documentation on client certificate authentication](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#client-certificate-authentication).


## Endnotes
