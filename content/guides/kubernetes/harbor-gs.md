---
title:  "Installing Harbor on Kubernetes with Project Contour, Cert Manager, and Let’s Encrypt"
sortTitle: "Harbor"
weight: 2
topics:
- Kubernetes
tags:
- Kubernetes
- Containers
patterns:
- Deployment
team:
- Tony Vetter
---

# Installing Harbor on Kubernetes with Project Contour, Cert Manager, and Let’s Encrypt

Running a private container image registry has been a staple in many enterprise environments for years. These registries allow full control over access, updates, and the software platform itself. And while your organization may have an official image registry, having your own can also be a benefit!

Maybe it's just for learning. Or maybe you like the idea of self-hosting your own services. Or maybe, like so many companies that have also made the decision to self-host, you are concerned about security and access. Whatever the reason, you have made the decision to deploy your own. But this process includes a lot more than just an initial install. 

A container image registry needs to be accessible to many online services to be useful, not the least of which is your desktop. It’s what makes pulling and pushing images possible. And you probably want it to be accessible from outside your own network, too, so that you can collaborate and share your projects. These days, to be secure, this requires TLS encryption to enable HTTPS traffic. 

In this guide, you will deploy Harbor to Kubernetes as the actual image registry application. You will also use Project Contour to manage ingress to your Kubernetes cluster. 

## Harbor and Contour

[Harbor](https://goharbor.io) is a powerful registry for containers and Helm charts. It is fully open source and backed by the [Cloud Native Computing Foundation (CNCF)](https://landscape.cncf.io/selected=harbor). But getting it up and running, with automated TLS certificate renewal in particular, can be a challenge—especially with the multiple services Harbor uses that require east-west and north-south network communication. 

[Contour](https://projectcontour.io), also a CNCF project, is an ingress controller built for Kubernetes. It functions as a control plane for Envoy while also offering advanced routing functionality beyond the default ingress controller provided by Kubernetes.  

You will deploy Harbor and Contour, and use [cert-manager](https://cert-manager.io/docs/) and [Let's Encrypt](https://letsencrypt.org) to automate TLS certificate generation and renewal for your Harbor installation. This will allow you to keep your Harbor installation up and running and utilizing HTTPS without manually generating and applying new certificates.

Also, using the patterns in this guide, you should be able to deploy other services to Kubernetes and secure their ingress as well. And once you understand the basics of certificate management, ingress, and routing services, you’ll be able to keep on deploying other services to Kubernetes and enabling secure access over the internet!

## Prerequisites

Before you get started, you’ll need to do the following:

- **Install Helm 3**: Helm is used in this guide to install Contour and Harbor. A guide for installing Helm can be found [here](https://helm.sh/docs/intro/install/).

- **Create a Kubernetes cluster**: This guide was built using Google Kubernetes Engine (GKE) with Kubernetes version 1.17. Any Kubernetes cluster with access to the internet should work fine, but your results may vary depending on the version you use. Initial testing with 1.16 resulted in errors during the Harbor install. For a guide on creating a GKE cluster, see [this page](https://cloud.google.com/kubernetes-engine/docs/quickstart) from Google. Ensure your [`kubectl` context](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) is using this cluster. 

- **Buy a domain name**: You will need a domain name that you control in order to configure DNS. This guide uses a Google-owned domain and DNS zone, but instructions can be modified for other providers.

- **Install watch**: watch is a small command-line utility that continually shows the output of a command being run. This allows you to monitor `kubectl get pods`, for example, without explicitly re-running the command multiple times. Instructions for installing on macOS are [here](https://osxdaily.com/2010/08/22/install-watch-command-on-os-x/).

- **About 30 minutes**:  It could take more time than that; it will depend on how long the Let’s Encrypt servers take to issue certificates. But in most of my testing for writing this post, it took about 30 minutes.

## Prepare the Environment

Being organized is key to any successful project. So before you dig in, create a new project directory and `cd` into it.
```
$ mkdir harbor-install && cd $_
```
Then define some environment variables for your proposed Harbor domain and your email address. It is recommended that you use a subdomain under the domain procured in the prerequisites section (e.g., harbor.example.com). This way you can use other subdomain URLs to access other services you may deploy in the future. The email address will be used for your Let's Encrypt certificate so the cert authority can notify you about expirations. 

Defining these variables will make the rest of the commands in this guide more simple to run. The email address and the domain do not have to use the same domain (a Gmail address is fine).
```
$ export DOMAIN=harbor.example.com
```
```
$ export EMAIL_ADDRESS=username@example.com
```

## Install Project Contour

While you are going to use Helm to install Project Contour, Helm will not create the namespace for you. So the first step in this installation is to create that namespace.
```
$ kubectl create namespace projectcontour
```

If you do not have the Bitnami repo referenced in Helm yet (you can check by running `helm repo list`), you will need to install it.
```
helm repo add bitnami https://charts.bitnami.com/bitnami
```

You will also need to update your Helm repositories.
```
helm repo update
```

Next, run `helm install` to finish the installation. Here you will install Bitnami's image for Contour. This chart includes defaults that will work out of the box for this guide. And since it comes from Bitnami, you can trust that the image has been thoroughly tested and scanned.
```
$ helm install ingress bitnami/contour -n projectcontour
```

Now simply wait for the Pods to become `READY`.
```
$ watch kubectl get pods -n projectcontour
```

## Set Up DNS

**NOTE**: In this section, things can vary a bit. Because this guide was written using Google Cloud Platform (GCP) tooling, the instructions below will reflect that. But should you be using another provider, I will try to provide a generalized description of what is being done so you can look up those specific steps. I have also numbered these steps for clarity. 

1. In order to set up DNS records, you need the IP address of the Envoy ingress router installed by Project Contour. Use the following command to describe the service. If the `EXTERNAL-IP` is still in a `<pending>` state, just wait until one is assigned. Record this value for a future step.

```
$ watch kubectl get service ingress-contour-envoy -n projectcontour -o wide
```

2. Now set up a DNS zone within your cloud provider. 

  - For GCP, this can be found in the GCP web UI, under Networking Services > Cloud DNS. Click `Create Zone` and follow the instructions to give the zone a descriptive name, as well as provide the DNS name. The DNS name will be whatever domain you have registered (e.g., `example.com`).

  - For AWS, this is done via a service called [Route 53](https://aws.amazon.com/route53/faqs/), and for Azure, [this is done](https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal_) by creating a resource in the Azure Portal. 

  - Once completed, the important part is that you now have a list of name servers. For example, one or more of the format `ns-cloud-x1.googledomains.com.` Record these for a future step.

3. Next, add an A record to your DNS zone for a wildcard (`*`) subdomain. An A record is an "Address" record, one of the most fundamental types of DNS records; it maps the more user-friendly URL (harbor.example.com) to an IP address. Setting this up as a wildcard will allow you to configure any traffic coming into any subdomain to first be resolved by Project Contour and Envoy, then be routed to its final destination based on the specific subdomain requested. 

- For GCP, click into the DNS zone you just created and select `Add Record Set`. From here, add a `*` as the DNS name field so the full DNS name reads `*.example.com`. In the IPv4 address field, enter the `EXTERNAL_IP` of the Envoy service recorded earlier in Step 1. Then click create. 

- For AWS and Azure, this is done via the respective services listed in the previous step.

- Once completed, your DNS zone should have an A record set up for any subdomain (`*`) to be mapped to the IP address of the Envoy service running in Kubernetes.

4. For the last of the somewhat confusing UI-based steps, you need to add the list of name servers from Step 2 to your personal domain. This will allow any HTTP/HTTPS requests for your domain to reference the records you set up previously in your DNS zone. 

- For Google-managed domains, in the Google Domains UI, click `manage` next to the domain you want to modify. Then click on `DNS`. In the Name Servers section at the top, click `edit`. Now, one at a time, simply paste in the list of name servers recorded in Step 2. There should be four name server addresses. Then click `Save`.

- For other domain name registrars, the process is similar. Contact your registrar if you require further assistance with this process.

That's it for configuring DNS. Now you need to wait for all the new records to propagate. Run the following command and wait for the output to show that your domain is now referencing the IP address of the Envoy service. This could take a few minutes.
```
$ watch host $DOMAIN
```

## Install cert-manager

[Cert-manager](https://cert-manager.io) will automate certificate renewal for your services behind Project Contour. When a certificate is set to expire, cert-manager will automatically request a new one from the certificate issuer (you will set this up in the next section). This is especially important when using a project like Let's Encrypt, whose certificates are only valid for 90 days. 

To install cert-manager, this guide uses Helm, for uniformity. As with installing Project Contour, Helm will not create a namespace, so the first step is to create one.
```
$ kubectl create namespace cert-manager
```

If you do not have the Jetstack repo referenced in Helm yet (you can check by running `helm repo list`), you will need to install that reference.
```
helm repo add jetstack https://charts.jetstack.io
```

Once again, update your Helm repositories.
```
helm repo update
```

Next, run `helm install` to install cert-manager.
```
$ helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.0.2 --set installCRDs=true
```

Finally, wait for the Pods to become `READY` before moving on to the next step. This should only take a minute or so.
```
$ watch kubectl get pods -n cert-manager
```

## Set up Let's Encrypt Staging Certificates

When initially setting up your Harbor service, or any service that will be using Let's Encrypt, it is important to start by using certificates from their staging server as opposed to the production server. Staging certificates allow you to test your service without the risk of running up against any API rate limiting, which Let’s Encrypt imposes on its production environment. This is not a requirement, however; production certificates can be used initially. But using the staging ones is a good habit to get into, and will highlight how these certificates are applied. 

Create the deployment YAML for the staging certificate by pasting the block below into a new file. Once applied, this will set up the staging cert configuration along with your email address, for certificate expirations notifications. You won't need to worry about these emails, however, as cert-manager will take care of the renewal for you. 

Notice that this is of `kind: ClusterIssuer`. That means this certificate issuer is scoped to all namespaces in this Kubernetes cluster. For more granular controls in production, you may decide to simply change this to `kind: Issuer`, which will be scoped to a specific namespace and only allow services in that namespace to request certificates from that issuer. But be aware that this will necessitate changing other configuration options throughout this guide. We are using `ClusterIssuer` because it is secure enough for our use case, and presumably you are not using a multi-tenant Kubernetes cluster when following this guide. 

Finally, this sets up a “challenge record" in the `solvers` section, which allows Let's Encrypt to verify that the certificate it is issuing is really controlled by you.
```
$ echo "apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
  namespace: cert-manager
spec:
  acme:
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-staging
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    solvers:
    - http01:
        ingress:
          class: contour" > letsencrypt-staging.yml
```

Now `apply` the file. 
```
$ kubectl apply -f letsencrypt-staging.yml
```

The process of creating the certificate should be fairly quick, but you can confirm it completed successfully by running the following and ensuring the certificate was issued.
```
$ kubectl -n cert-manager logs -l app=cert-manager -c cert-manager
```
The last line in the logs should reflect that the certificate was issued successfully.

## Install Harbor

Now that you have your staging certificate, you can install Harbor, for which this guide uses Helm in combination with the Bitnami repo set up earlier. As with your other install steps, the first thing to do is create the namespace.  
```
$ kubectl create namespace harbor
```

Next, create the values file. The Bitnami Helm chart includes defaults that, for the most part, will work for your needs. However, there are a few configuration options that need to be set. 

Here you will notice that you are giving the TLS secret in Kubernetes a name, `harbor-tls-staging`. You can choose any name you like, but it should be descriptive and reflect that this secret will be distinct from the production certificate you will apply later. 

You are also setting up references to your domain so Harbor and Contour can set up routing. The Annotations section is important as it tells Harbor about our configuration. Notice that for `cert-manager.io/cluster-issuer: letsencrypt-staging` you are telling Harbor to use the `ClusterIssuer` called letsencrypt-staging, the one you set up earlier. This will come up again later when you move to production certificates. Comments are provided in the file for further detail. 

Finally, this values file will disable the Harbor Notary service. At the time of this writing there is a bug in the Bitnami Helm chart (already reported) that doesn't allow a TLS certificate to be applied for both `notary.$DOMAIN` and `$DOMAIN`. I will try to update this post once that bug is fixed.
```
$ echo "service:
  type: ClusterIP
  tls:
    enabled: true
    existingSecret: 'harbor-tls-staging'
    commonName: '$DOMAIN'

ingress:
  enabled: true
  hosts:
    core: $DOMAIN
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging  # use letsencrypt-staging as the cluster issuer for TLS certs
    ingress.kubernetes.io/force-ssl-redirect: \"true\"     # force https, even if http is requested
    kubernetes.io/ingress.class: contour                 # using Contour for ingress
    kubernetes.io/tls-acme: \"true\"                       # using ACME certificates for TLS
externalURL: https://$DOMAIN

portal:
  tls:
    existingSecret: harbor-tls-staging  

notary:
  enabled: false # disabled due to ingress bug" > values.yml
```

Now install Harbor using this values file.
```
$ helm install harbor bitnami/harbor -f values.yml -n harbor
```

And wait for the Pods to become `<READY>`. This may take a minute or two. 
```
$ watch kubectl get pods -n harbor
```

Finally, ensure that the certificate was requested and returned successfully. This should happen fairly quickly, but may take up to an hour. It all depends on the server load at that time. 
```
kubectl describe certificate harbor-tls-staging -n harbor
```

Now open your browser of choice and go to your URL. You will notice that you will need to accept the security warning that the site is "untrusted." This is because you are still using the staging certificates, which are not signed by a trusted certificate authority (CA). 
```
$ echo Visit Site: https://$DOMAIN
```

Once you ensure that Harbor is working as intended, you can move to production certificates. 

## Set Up Let's Encrypt Production Certificates

Similar to how you set up the Let's Encrypt staging certificate, you now need to create the `ClusterIssuer` for production certificates. First, `echo` the following to create the file.
```
$ echo "apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  namespace: cert-manager
spec:
  acme:
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-prod
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
    - http01:
        ingress:
          class: contour" > letsencrypt-prod.yml
```

Then apply it to your Kubernetes cluster.
```
$ kubectl apply -f letsencrypt-prod.yml
```

Again, you can confirm this process completed successfully by running the following and ensuring the certificate was issued.
```
$ kubectl -n cert-manager logs -l app=cert-manager -c cert-manager
```

Recall how earlier in the annotations of the Harbor `values.yml` file you told Harbor to use the `letsencrypt-staging` cluster issuer, as well as the secret `harbor-tls-staging`. You must now tell Harbor to use the production cluster issuer you just created, and trigger it to create a new secret based on that certificate. To do this, you are going to edit the Harbor ingress service directly.

The following command will open a `vim` text editor with the ingress configuration. If you are unfamiliar with Vim, [here](https://coderwall.com/p/adv71w/basic-vim-commands-for-getting-started) are some common commands for how to work with a text file.
```
$ kubectl edit ingress harbor-ingress -n harbor
```

Now find the line that looks like `cert-manager.io/cluster-issuer: letsencrypt-staging` and swap `staging` for `prod`. The final result of the line should look like this: `cert-manager.io/cluster-issuer: letsencrypt-prod`. 

Next, find the line that looks like `secretName: harbor-tls-staging` and swap `staging` for `prod`. This line should be towards the bottom of the ingress configuration. The final result of the line should look like this: `secretName: harbor-tls-prod`. Save and exit.

Harbor is now configured to get its certificates from the `letsencrypt-prod` cluster issuer. And because the ingress service is now configured to look for the `harbor-tls-prod` secret, which does not yet exist, cert-manager will generate a new certificate and secret for the newly configured ingress. 

This process may take as little as a minute or as long as an hour. It just depends on the server load at that time. But in most of my testing, it took less than 10 minutes.
```
$ watch kubectl describe certificate harbor-tls-prod -n harbor
```

Once the certificates are generated successfully, your Harbor instance should be up and running with valid and trusted TLS certificates. Try visiting the site again.
```
$ echo Visit Site: https://$DOMAIN
```

Your browser should no longer present a warning, as the certificate you are now using is signed by a trusted CA.

That's it! You now have a service running in Kubernetes with TLS encryption enforced and certificate generation automated. And by using these patterns, you should be able to install and configure other services as well. Specific steps, especially around the configuration of the service itself, will be different, but after using this guide you should have a leg up in getting started. 

