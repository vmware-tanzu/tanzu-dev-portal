---
title: "Plain English Description of Certificates, Certificate Authorities (CA), and Local Development"
description: learn more about SSL, Certificates, and CAs from a higher level perspective.
date: "2021-11-18"
lastmod: "2021-11-18"
level1: Building Modern Applications
level2: Modern Development Practices 
tags:
- SSL
# Author(s)
team:
- Steven Pousty
---

Most of us do application development work on our local machine. We also come to understand that HTTPS (TLS/SSL) is the new standard for all our web applications. But we often skip using them on our local machine because either: \

1. We don’t think it is important for our local development
2. We don’t understand the process and how to do it on our local machine 

The reason why you should care about it for local development is:

> Every difference between your local development and production adds to the risk that your code won’t run in production. 

This post will help you understand the process and set you up to grok what you are doing when you do the actual commands to make this work on your local machine. This post is NOT going to talk about certificates in production or in a public key infrastructure (PKI). While many of the concepts are similar, the security implications are much more serious once you move past just your local machine.


## What this post covers (and what it doesn’t)

We will start by talking about TLS/SSL for web applications. You may also know that you can use TLS/SSL for connecting database (DB) client software to the DB server. Finally, certificates are highly used in Kubernetes, even if you are running it on your local machine. As an application developer, it is getting harder and harder to ignore the use of TLS/SSL in your daily development work. And to make TLS/SSL work appropriately, you are going to need a signed certificate that validates that your application is legitimate.

You can certainly obtain this certificate by using an established Public Trusted Certificate Authority, such as DigiSign or Let’s Encrypt. However, there are three potential hassles with this approach:

1. This may cost money 
2. There is administrative overhead
3. We are going to be interacting with a web server, DB, or Kubernetes cluster on our local machine so DNS resolution isn’t available for a domain certificate.

A cheaper and less involved way of doing this is to create and use a self-signed certificate on your local machine. Please note, I recommend doing this process for development on your local workstation **only**. If you need to have more clients connect to the server, I **strongly** encourage you to do more reading on the subject. For anything more than localhost production, you will want a publicly signed certificate or your organization’s IT-signed certificate. 

We will cover a very simplified explanation of a much more sophisticated process, with just the parts that are important for TLS/SSL encryption in the browser or between a DB client and a DB. 

This discussion will take us from a blank workstation to using a certificate that works in your local browser without warnings.


## Definitions for the purposes of this discussion

1. **Keys** – Specifically crafted binary strings that are used in encryption. The private key is used to decrypt messages encrypted by the client using the public key. This flow happens only during initial negotiation between the client and server; once they agree the connection is valid, they exchange shared server keys for the rest of the encrypt/decrypt process. 
2. **Certificate** – A digital document that contains the public key and other information from a site. A certificate has to be issued (signed) by a certificate authority (see below). The certificate for web usage will also contain information about the URLs over which it is valid. The client, upon receiving the public key, can then use that key to encrypt communications with the server. 
3. **Wildcard certificate** – This has the same properties as above except, rather than specifying a single URL, it allows you to do TLS/SSL over any URL with a common base (i.e. `*.mycompany.com`). If you want to create a bunch of applications on your local machine, you can create this one certificate and use it for all the apps as long as they use the same ending to their URL. Note: [http://mcompany.com](http://mcompany.com) will not be covered by this cert, but we cover that use case below. 
4. **Certificate authority (CA)** – An organization that vouches for all the certificates it signs/validates. Typically a certificate will be signed by a large, well-known CA that is in a list of trusted, well-known providers. These issuers are included in most operating systems as trusted providers, allowing web browsers and other tools to automatically trust the certificate as long as it was signed by one of the providers.

    In lower-security situations, a user can be their own CA for certificates they create. They will then have to put their own CA certificate in the trusted location on any computer they want to accept their signed certificates.

    It is also quite common for a company's IT department to create their own CA and then share or even install that certificate on computers in the organization. Usually the process of using your corporate CA for local development requires too much overhead to be practical.

In this post, in an effort to speed up local development, we only talk about how to make and use your own personal certificates.  

To make a trusted certificate, the first requirement is to sign the certificate and certify that the information is correct. To do this, you’ll need a certificate authority. 


## Creating a certificate authority

1. First, make a private key on your local computer. We will use this to create but NOT sign the CA certificate (`myCA.key` file).
2. Next, make a certificate from this pair as your CA certificate (`myCA.pem` file).  The information requested about the organization creating the certificate is all optional, but it is good to fill it in for your own reference. 

You now have a root certificate you can use to sign other certificates. Technically, that is all that is required to be a certificate authority. In practice, because so much depends on verification, the process is much harder to become a publicly recognized CA. By default, nobody trusts this certificate as a signing authority, but it will work for our purposes.


## Creating a signed certificate

Now, you can create a wildcard certificate to use in your web server or other server-based software. To do that, take these steps:

1. Gather the following information:
    1. The domain you want to use with the certificate. For this example, I will use: *._thesteve0.io_
    2. Alternative URLs you want to cover that have the same base URL. This allows you to have Wildcard Subject Alternative Name Certificate. [Here](https://grokify.github.io/security/wildcard-subject-alternative-name-ssl-tls-certificates/) is a great discussion on the topic. Doing this would allow you to also cover [http://thesteve0.io](http://thesteve0.io) or `myapp`.`thesteve0.com` with the same certificate as `*.thesteve0.io`.
    3. The rest of the information for the certificate is optional, but I recommend you use information that will help you remember why you made the certificate. 
2. Now generate a key that will be used for the certificate on your web server - `<thesteve0-local>`.key.
3. Next, generate a certificate signing request (CSR) file - `thesteve0-local.csr`. This is a file encrypted with the `thesteve0-local.key` and is used by the CA for creating a valid signed certificate. In this case, we will use the CSR with our own CA. 
4. Now you’ll need a configuration file, to tell the CA what type of certificate you want. There will be certain flags set in this config file that specify the cert is to be used for a server. Most importantly, this file will contain the domains you want to encrypt with this certificate. In this example, we will call this file `thesteve0-local.ext`.
5. With `myCA.pem`, `thesteve0-local key`, `thesteve0-local.csr`, and `thesteve0-local.ext` in hand, you can do the command to output the signed certificate you’ll put in your web server - `thesteve0-local.cert`. This cert file is the one that says:

    If the server you are talking to has this certificate and is pointing you at URL that matches `*.thesteve0.io`, then `myCA` verifies this site is who they say they are.

As long as your browser (or client computer) recognizes `myCA` as a trusted verification company, then the browser will use an SSL connection without any complaints.


## Setting up the web server

The `.cert` file validates that your web server is who it says it is, and the `.key` will then be used to encrypt all the traffic. Your web server will present the cert to any client that connects and, if the client continues, then the key will be used to negotiate the encryption with the client. 

{{% callout %}} Remember, we are talking in very general terms here, just to give you an overview. Please read and learn more about the process if you are going to do anything beyond doing this localhost development. {{% /callout %}}

You need to place both `thesteve0-local.key` and `thesteve0-local.cert` in a location on the web server machine (in this case, your local computer) where it can access both files. This location will depend on the web server you are using, but usually there is a configuration file for the server that lets you specify the path. You should pick a secure location where the web server can access the files and no other users can. 

Now your server is ready to accept incoming SSL/TLS connection requests. 


## Setting up the client machine

**Without** the following steps, when you try to connect to the URL, your browser will give you a warning that this is an unsafe site and you should not proceed. As stated above, this message appears because, by default and design, your browser does not trust the signing authority, `myCA`. 

To fix this, add your CA cert to a place where the client can trust it. You generally have two options here:

1. Place the CA cert into the trusted store on your computer. Usually, applications will know to look in that place for trusted CAs on the OS.
2. Add the CA to the application you are using, in this case your browser of choice.

Each OS and browser have their own special and unique steps to adding the CA to the trusted CA list. I suggest you do an internet search for the OS or app with the words “adding a root certificate.”


## Wrap-up

Once you do that step above, when you now point your browser at a web page over HTTPS coming from your local machine, you will not get that annoying error message. You have also, hopefully, learned more about certificate authorities, certificates, and how they all work together to create secure connections between client and server.