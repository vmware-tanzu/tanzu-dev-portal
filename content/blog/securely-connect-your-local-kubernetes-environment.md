---
date: 2020-09-22
description: Learn how to configure your local Kubernetes environment to work with
  secure ingress and reproducible URLs, so that development is made easier.
featured: false
lastmod: '2020-10-14'
patterns:
- Deployment
tags:
- Kubernetes
team:
- Jorge Morales Pou
title: Securely Connect with Your Local Kubernetes Environment
---

One of the biggest challenges I face when developing applications that will run on Kubernetes is having a local environment that I can spin up at any time—one that won’t give me any problems, won’t cost me money when left on during the weekend or at night, and that I can be confident will have all the same functionality as my cloud-based environment. That’s why I use minikube for local development, as it’s the tool that gives me the best “developer experience” possible. None of the alternatives can really compare.

But minikube is not perfect. There are two things in particular that require some additional configurations.The first is that every time you create a minikube instance you get a different IP address, which becomes an obstacle when you want to recreate your environments. The second is that I prefer my minikube instances to have a registry, which like the services I choose to work with should also be secure. But while the minikube documentation provides instructions for how to secure a registry, it’s still a complicated process.

For both of these reasons, I’m going to explain how I set up my minikube instances so they can be used and recreated easily, and so they give me the ability to work with trusted secured services.
## Create your own local CA
When working with secure services, I want the minikube instance to have secure routes and internal access. The easiest possible way to get those secure routes and access is to create your own certificate authority (CA), which you can provide to your minikube instance and your local computer so that they will both trust any certificate the CA will generate.

I use a Mac, so I’m going to share the process/commands used with macOS, but they should be similar for Linux-based systems. For generating the certificate, I use the OpenSSL version provided by brew.

Let’s first create a private key for your CA:
```bash
openssl genrsa -des3 -out localRootCA.key 2048
```
Now that you have a private key you can use to sign your certificates and CA, let’s go ahead and create the CA. One caveat is that the CA needs to use SSL v3 extensions, so you will also need an OpenSSL configuration file with these settings. The easiest thing to do is to copy the one that comes with your OpenSSL distribution and add these sections (or replace them if they already exist). Mine was at `/usr/local/etc/openssl@1.1/openssl.cnf` and I copied it locally to `opensslv3.cnf`:

```toml
[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment

[ v3_ca ]
basicConstraints = critical,CA:TRUE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer:always
```
After creating the OpenSSL configuration set-up for using v3 extensions, you can just go ahead and create your CA.

```bash
openssl req -x509 -new -nodes -key localRootCA.key -reqexts v3_req -extensions v3_ca -config opensslv3.cnf -sha256 -days 1825 -out localRootCA.pem
```
This gives you a CA you can use for all the certificates your cluster will need/create. More importantly, because you’ve generated this CA, you can safely trust it on your local computer. To install it on your local computer you can either import the certificate via Apple keychain or use the command:
```bash
sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" localRootCA.pem
```
You can now finally trust the locally generated CA. But how do you tell minikube to use this CA when creating certificates? 

First, you need to make the CA available in the minikube VM instance. That is as easy as copying the certificate to the `$HOME/.minikube/certs folder`:
```bash
mkdir $HOME/.minikube/certs
cp localRootCA.pem $HOME/.minikube/certs/localRootCA.pem
```
## Configure minikube to work with your local CA
At this point we need to address the second challenge to creating reproducible local development environments with minikube: the minikube instance’s ever-changing IP address.

Most developers are familiar with services like nip.io, xip.io, and sslip.io for getting a DNS name that will direct them to their local environment. With Ingress, we can use something like `myapp.192.168.64.10.nip.io` to access the application. We can use port-forwarding, but if we’re going to use Ingress resources in production, why wouldn’t we use them in development? Ingress should be the way to go for development, never port-forwarding (or node-port)—unless required, obviously.

The problem with these addresses is that they have the minikube IP encoded in them, so if we need to recreate our minikube environment, we will need to change all the resource definitions that have that name to contain the new IP. For that reason, I prefer to use something like `minikube.test` for my local minikube instances and have my application accessible at `myapp.minikube.test`.

Minikube provides a nice set of addons that most developers should use. The Ingress add-on provides you with an Ingress controller and `ingress-dns` provides a DNS service locally in your minikube VM that, in conjunction with some configuration on your local machine, will provide you with an accessible name. To enable them, before you start minikube you will need to do:
```bash
minikube addon enable ingress
minikube addon enable ingress-dns
```
Once you start minikube, you need to create/edit a file in `/etc/resolver/minikube-test`.
```
domain minikube.test
nameserver 192.168.64.20
search_order 1
timeout 5
```
NOTE: Adjust the IP of your minikube instance (`minikube ip`) and the domain name you want to use. Also, every time you recreate the environment, you will need to adjust the IP.

With this, your clusters will always be reachable at `<anything>.minikube.test`. Does the previous URL pattern already look familiar? It’s the one our applications will use.

Any application that we deploy on minikube will now be able to use these URL patterns. 

Now that we have all the pieces, we need to be able to secure our Ingress resources with a certificate generated by our CA that our local computer will trust. To generate certificates, my recommendation is that you use cert-manager. Installing it is easy:
```bash
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.0.1/cert-manager.yaml
```
>NOTE: Make sure to check if there are newer versions before installing cert-manager, which offers an easy way for you to create a certificate using your provided CA. You need a Kubernetes secret with your certificate and private key, which you need to reference in an Issuer (or ClusterIssuer) with spec.ca.

The key we created is password-protected, so we need to provide a password-unprotected version:
```bash
openssl rsa -in localRootCA.key -out unprotected-localRootCA.key
```
Let’s now go ahead and create the Kubernetes secret:
```bash
kubectl create secret tls my-ca-secret --key unprotected-localRootCA.key --cert localRootCA.pem -n cert-manager
```
Next, we’ll create a ClusterIssuer (so it’s available cluster-wide) that will use this CA:
```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ca-issuer
spec:
  ca:
    secretName: local-root-ca
```
We’re now ready to create certificates. At this point, every time you create an Ingress resource, the only thing you will need to do to get everything working is add an annotation. You will configure the Ingress resources as usual, using your provided hostname and the TLS  configuration, which will point to a secret. Cert-manager will take care of creating this secret with the proper TLS certificate needed for the domain you have configured using the cluster-issuer you instructed in the annotation.
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    # add an annotation indicating the issuer to use.
    cert-manager.io/cluster-issuer: ca-issuer
  name: myapp
spec:
  rules:
  - host: myapp.minikube.test
    http:
      paths:
      - backend:
          serviceName: myapp
          servicePort: 8080
        path: /
# < placing a host in the TLS config will indicate a certificate should be created
  tls: 
  - hosts:
    - myapp.minikube.test
    secretName: myapp-cert 
# < cert-manager will store the created certificate in this secret.
```
For convenience, if you want to omit that annotation, you can use a wildcard certificate that you can reference in any Ingress resource. The main downside to this approach is that you will either need to copy the secret to every namespace where a secure Ingress will be defined or deploy this certificate resource along with your Ingress.
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard
spec:
  dnsNames:
  - '*.minikube.test'
  issuerRef:
    kind: ClusterIssuer
    name: ca-issuer
  secretName: wildcard
```


## Final words
And that’s it! You can now have convenient and easy-to-use reproducible local development environments that mimic real production environments where your applications will be deployed with TLS security.

Most of the steps shown here will need to be done just once, and the rest can be easily automated. Sadly, they cannot be turned into a minikube add-on, but there are other, easy ways to automate them. But that will be the subject of another post.