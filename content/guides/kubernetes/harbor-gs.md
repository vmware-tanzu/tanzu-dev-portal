---
date: '2020-11-02'
description: Looking to run a private container image for self-hosting or enterprise
  purposes? This guide walks through deploying Harbor to Kubernetes.
lastmod: '2021-03-07'
linkTitle: Harbor
metaTitle: Deploying Harbor to Kubernetes
patterns:
- Deployment
subsection: Harbor
tags:
- Kubernetes
- Containers
team:
- Tony Vetter
- Paul Czarkowski
title: Installing Harbor on Kubernetes with Project Contour, Cert Manager, and Let’s
  Encrypt
topics:
- Kubernetes
weight: 7
oldPath: "/content/guides/kubernetes/harbor-gs.md"
aliases:
- "/guides/kubernetes/harbor-gs"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Running a private container image registry has been a staple in many enterprise
environments for years. These registries allow full control over access,
updates, and the software platform itself. And while your organization may have
an official image registry, having your own can also be a benefit!

Maybe it's just for learning. Or maybe you like the idea of self-hosting your
own services. Or maybe, like so many companies that have also made the decision
to self-host, you are concerned about security and access. Whatever the reason,
you have made the decision to deploy your own. But this process includes a lot
more than just an initial install.

A container image registry needs to be accessible to many online services to be
useful, not the least of which is your desktop. It’s what makes pulling and
pushing images possible. And you probably want it to be accessible from outside
your own network, too, so that you can collaborate and share your projects.
These days, to be secure, this requires TLS encryption to enable HTTPS traffic.

In this guide, you will deploy Harbor to Kubernetes as the actual image registry
application. You will also use Project Contour to manage ingress to your
Kubernetes cluster.

{{< youtube id="SXSqrgYKO4s" class="youtube-video-shortcode" >}}

## Harbor and Contour

[Harbor](https://goharbor.io) is a powerful registry for containers and Helm
charts. It is fully open source and backed by the
[Cloud Native Computing Foundation (CNCF)](https://landscape.cncf.io/selected=harbor).
But getting it up and running, with automated TLS certificate renewal in
particular, can be a challenge—especially with the multiple services Harbor uses
that require east-west and north-south network communication.

[Contour](https://projectcontour.io), also a CNCF project, is an ingress
controller built for Kubernetes. It functions as a control plane for Envoy while
also offering advanced routing functionality beyond the default ingress
controller provided by Kubernetes.

You will deploy Harbor and Contour, and use
[cert-manager](https://cert-manager.io/docs/) and
[Let's Encrypt](https://letsencrypt.org) to automate TLS certificate generation
and renewal for your Harbor installation. This will allow you to keep your
Harbor installation up and running and utilizing HTTPS without manually
generating and applying new certificates.

Also, using the patterns in this guide, you should be able to deploy other
services to Kubernetes and secure their ingress as well. And once you understand
the basics of certificate management, ingress, and routing services, you’ll be
able to keep on deploying other services to Kubernetes and enabling secure
access over the internet!

## Prerequisites

Before you get started, you’ll need to do the following:

- **Install Helm 3**: Helm is used in this guide to install Contour and Harbor.
  A guide for installing Helm can be found
  [here](https://helm.sh/docs/intro/install/).

- **Create a Kubernetes cluster**: This guide was built using Google Kubernetes
  Engine (GKE) with Kubernetes version 1.17. Any Kubernetes cluster with access
  to the internet should work fine, but your results may vary depending on the
  version you use. Initial testing with 1.16 resulted in errors during the
  Harbor install. For a guide on creating a GKE cluster, see
  [this page](https://cloud.google.com/kubernetes-engine/docs/quickstart) from
  Google. Ensure your
  [`kubectl` context](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
  is using this cluster.

- **Install watch**: watch is a small command-line utility that continually
  shows the output of a command being run. This allows you to monitor
  `kubectl get pods`, for example, without explicitly re-running the command
  multiple times. Instructions for installing on macOS are
  [here](https://osxdaily.com/2010/08/22/install-watch-command-on-os-x/).

- **About 30 minutes**: It could take more time than that; it will depend on how
  long the Let’s Encrypt servers take to issue certificates. But in most of my
  testing for writing this post, it took about 30 minutes.

- *Optional - buy a domain name*: You can use `.xip.io` (a
  [service](http://xip.io) that provides dynamic DNS based on IP address)
  addresses to avoid needing to buy a domain. Otherwise you will need a domain
  name that you control in order to configure DNS. This guide uses a
  Google-managed domain and DNS zone, but instructions can be modified for other
  providers. Note: if you do decide to use `.xip.io`, you may experience issues
  using the `letsencrypt-prod` ClusterIssuer later in the demo due to rate
  limiting. Often you can just wait a few hours and it'll eventually work. For
  best results, we recommend using your own domain.

## Prepare the Environment

Create a Kubernetes cluster.  In GKE this can be as simple as running:

```bash
gcloud container clusters create jan8 --num-nodes 3
```

Being organized is key to any successful project. So before you dig in, create a
new project directory and `cd` into it.

```bash
mkdir harbor-install && cd $_
```

## Install Project Contour

While you are going to use Helm to install Project Contour, Helm will not create
the namespace for you. So the first step in this installation is to create that
namespace.
```
$ kubectl create namespace projectcontour
```

If you do not have the Bitnami repo referenced in Helm yet (you can check by
running `helm repo list`), you will need to install it.

```
helm repo add bitnami https://charts.bitnami.com/bitnami
```

You will also need to update your Helm repositories.

```
helm repo update
```

Next, run `helm install` to finish the installation. Here you will install
Bitnami's image for Contour. This chart includes defaults that will work out of
the box for this guide. And since it comes from Bitnami, you can trust that the
image has been thoroughly tested and scanned.

```
helm install ingress bitnami/contour -n projectcontour --version 3.3.1
```

Now simply wait for the Pods to become `READY`.

```
watch kubectl get pods -n projectcontour
```


Then define some environment variables for your proposed Harbor domain and your
email address. It is recommended that you use a subdomain under the domain
procured in the prerequisites section (e.g., harbor.example.com). This way you
can use other subdomain URLs to access other services you may deploy in the
future. The email address will be used for your Let's Encrypt certificate so the
cert authority can notify you about expirations.

Defining these variables will make the rest of the commands in this guide more
simple to run. The email address and the domain do not have to use the same
domain (a Gmail address is fine).

If you do not have a custom domain run:

```bash
IP=$(kubectl describe svc ingress-contour-envoy --namespace projectcontour | grep Ingress | awk '{print $3}')
export DOMAIN=$IP.xip.io
```

Otherwise run:

```bash
export DOMAIN=your.domain.com
```

Set your email address for cert-manager:

```bash
export EMAIL_ADDRESS=username@example.com
```



## Set Up DNS

{{% aside type="warning" title="You may skip this section" %}}
This section is not applicable for those using `xip.io`.
If that's you, please skip this entire section.
{{% /aside %}}

In this section, things can vary a bit. Because this guide was written using
Google Cloud Platform (GCP) tooling, the instructions below will reflect that.
But should you be using another provider, I will try to provide a generalized
description of what is being done so you can look up those specific steps. I
have also numbered these steps for clarity.

1. In order to set up DNS records, you need the IP address of the Envoy ingress
   router installed by Project Contour. Use the following command to describe
   the service. If the `EXTERNAL-IP` is still in a `<pending>` state, just wait
   until one is assigned. Record this value for a future step.

```bash
watch kubectl get service ingress-contour-envoy -n projectcontour -o wide
```

2. Now set up a DNS zone within your cloud provider.

  - For GCP, this can be found in the GCP web UI, under Networking Services,
    Cloud DNS. Click `Create Zone` and follow the instructions to give the zone
    a descriptive name, as well as provide the DNS name. The DNS name will be
    whatever domain you have registered (e.g., `example.com`).

  - For AWS, this is done via a service called
    [Route 53](https://aws.amazon.com/route53/faqs/), and for Azure,
    [this is done](https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal_)
    by creating a resource in the Azure Portal.

  - Once completed, the important part is that you now have a list of name
    servers. For example, one or more of the format
    `ns-cloud-x1.googledomains.com.` Record these for a future step.

3. Next, add an A record to your DNS zone for a wildcard (`*`) subdomain. An A
   record is an "Address" record, one of the most fundamental types of DNS
   records; it maps the more user-friendly URL (harbor.example.com) to an IP
   address. Setting this up as a wildcard will allow you to configure any
   traffic coming into any subdomain to first be resolved by Project Contour and
   Envoy, then be routed to its final destination based on the specific
   subdomain requested.

- For GCP, click into the DNS zone you just created and select `Add Record Set`.
  From here, add a `*` as the DNS name field so the full DNS name reads
  `*.example.com`. In the IPv4 address field, enter the `EXTERNAL_IP` of the
  Envoy service recorded earlier in Step 1. Then click create.

- For AWS and Azure, this is done via the respective services listed in the previous step.

- Once completed, your DNS zone should have an A record set up for any subdomain
  (`*`) to be mapped to the IP address of the Envoy service running in
  Kubernetes.

4. For the last of the somewhat confusing UI-based steps, you need to add the
   list of name servers from Step 2 to your personal domain. This will allow any
   HTTP/HTTPS requests for your domain to reference the records you set up
   previously in your DNS zone.

- For Google-managed domains, in the Google Domains UI, click `manage` next to
  the domain you want to modify. Then click on `DNS`. In the Name Servers
  section at the top, click `edit`. Now, one at a time, simply paste in the list
  of name servers recorded in Step 2. There should be four name server
  addresses. Then click `Save`.

- For other domain name registrars, the process is similar. Contact your
  registrar if you require further assistance with this process.

That's it for configuring DNS. Now you need to wait for all the new records to
propagate. Run the following command and wait for the output to show that your
domain is now referencing the IP address of the Envoy service. This could take a
few minutes.

```bash
watch host $DOMAIN
```

## Install cert-manager

[Cert-manager](https://cert-manager.io) will automate certificate renewal for
your services behind Project Contour. When a certificate is set to expire,
cert-manager will automatically request a new one from the certificate issuer
(you will set this up in the next section). This is especially important when
using a project like Let's Encrypt, whose certificates are only valid for 90
days.

To install cert-manager, this guide uses Helm, for uniformity. As with
installing Project Contour, Helm will not create a namespace, so the first step
is to create one.

```bash
kubectl create namespace cert-manager
```

If you do not have the Jetstack repo referenced in Helm yet (you can check by
running `helm repo list`), you will need to install that reference.

```bash
helm repo add jetstack https://charts.jetstack.io
```

Once again, update your Helm repositories.

```bash
helm repo update
```

Next, run `helm install` to install cert-manager.

```bash
helm install cert-manager jetstack/cert-manager --namespace cert-manager \
   --version v1.0.2 --set installCRDs=true
```

Finally, wait for the Pods to become `READY` before moving on to the next step.
This should only take a minute or so.

```bash
watch kubectl get pods -n cert-manager
```

## Set up Let's Encrypt Staging Certificates

When initially setting up your Harbor service, or any service that will be using
Let's Encrypt, it is important to start by using certificates from their staging
server as opposed to the production server. Staging certificates allow you to
test your service without the risk of running up against any API rate limiting,
which Let’s Encrypt imposes on its production environment. This is not a
requirement, however; production certificates can be used initially. But using
the staging ones is a good habit to get into, and will highlight how these
certificates are applied.

Create the deployment YAML for the staging certificate by pasting the block
below into a new file. Once applied, this will set up the staging cert
configuration along with your email address, for certificate expirations
notifications. You won't need to worry about these emails, however, as
cert-manager will take care of the renewal for you.

Notice that this is of `kind: ClusterIssuer`. That means this certificate issuer
is scoped to all namespaces in this Kubernetes cluster. For more granular
controls in production, you may decide to simply change this to `kind: Issuer`,
which will be scoped to a specific namespace and only allow services in that
namespace to request certificates from that issuer. But be aware that this will
necessitate changing other configuration options throughout this guide. We are
using `ClusterIssuer` because it is secure enough for our use case, and
presumably you are not using a multi-tenant Kubernetes cluster when following
this guide.

Finally, this sets up a “challenge record" in the `solvers` section, which
allows Let's Encrypt to verify that the certificate it is issuing is really
controlled by you.

```bash
cat << EOF > letsencrypt-staging.yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-staging
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    solvers:
    - http01:
        ingress:
          class: contour
EOF
```

Now `apply` the file.

```bash
kubectl apply -f letsencrypt-staging.yaml
```

The process of creating the cluster issuer should be fairly quick, but you can
confirm it completed successfully by running the following and ensuring the
cluster issuer was issued.

```bash
$ kubectl get clusterissuers.cert-manager.io
NAME                  READY   AGE
letsencrypt-staging   True    74s
```

## Install Harbor

Now that you have your staging certificate, you can install Harbor, for which
this guide uses Helm in combination with the Bitnami repo set up earlier. As
with your other install steps, the first thing to do is create the namespace.

```
kubectl create namespace harbor
```

Next, create the values file. The Bitnami Helm chart includes defaults that, for
the most part, will work for your needs. However, there are a few configuration
options that need to be set.

Here you will notice that you are giving the TLS secret in Kubernetes a name,
`harbor-tls-staging`. You can choose any name you like, but it should be
descriptive and reflect that this secret will be distinct from the production
certificate you will apply later.

You are also setting up references to your domain so Harbor and Contour can set
up routing. The Annotations section is important as it tells Harbor about our
configuration. Notice that for
`cert-manager.io/cluster-issuer: letsencrypt-staging` you are telling Harbor to
use the `ClusterIssuer` called letsencrypt-staging, the one you set up earlier.
This will come up again later when you move to production certificates. Comments
are provided in the file for further detail.

Finally, this values file will disable the Harbor Notary service. At the time of
this writing there is a bug in the Bitnami Helm chart (already reported) that
doesn't allow a TLS certificate to be applied for both `notary.$DOMAIN` and
`registry.$DOMAIN`. I will try to update this post once that bug is fixed.

```bash
cat << EOF > harbor-values.yaml
harborAdminPassword: Password12345

service:
  type: ClusterIP
  tls:
    enabled: true
    existingSecret: harbor-tls-staging
    notaryExistingSecret: notary-tls-staging

ingress:
  enabled: true
  hosts:
    core: registry.$DOMAIN
    notary: notary.$DOMAIN
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging  # use letsencrypt-staging as the cluster issuer for TLS certs
    ingress.kubernetes.io/force-ssl-redirect: "true"     # force https, even if http is requested
    kubernetes.io/ingress.class: contour                 # using Contour for ingress
    kubernetes.io/tls-acme: "true"                       # using ACME certificates for TLS
externalURL: https://registry.$DOMAIN

portal:
  tls:
    existingSecret: harbor-tls-staging
EOF
```

Now install Harbor using this values file.

```bash
helm install harbor bitnami/harbor -f harbor-values.yaml -n harbor --version 9.4.4
```

And wait for the Pods to become `<READY>`. This may take a minute or two.

```bash
watch kubectl get pods -n harbor
```

Finally, ensure that the certificates were requested and returned successfully.
This should happen fairly quickly, but may take up to an hour. It all depends on
the server load at that time.

```bash
$ kubectl -n harbor get certificate
NAME                 READY   SECRET               AGE
harbor-tls-staging   True    harbor-tls-staging   2m26s
notary-tls-staging   True    notary-tls-staging   2m26s
```

Print out the URL, username, and password:

```bash
cat << EOF
url: https://registry.$DOMAIN
username: admin
password: $(kubectl get secret --namespace harbor harbor-core-envvars -o jsonpath="{.data.HARBOR_ADMIN_PASSWORD}" | base64 --decode)
EOF
```

Now open your browser of choice and go to your URL. You will notice that you
will need to accept the security warning that the site is "untrusted." This is
because you are still using the staging certificates, which are not signed by a
trusted certificate authority (CA).

Once you ensure that you can log in and that Harbor is working as intended, you
can move to production certificates.

## Set Up Let's Encrypt Production Certificates

{{% aside type="warning" title="Rate Limits" %}}
Reminder, if using `.xip.io` you may encounter rate limit issues with Lets
Encrypt causing major delays in the certificate issuance.
{{% /aside %}}

Similar to how you set up the Let's Encrypt staging certificate, you now need to
create the `ClusterIssuer` for production certificates. First, `echo` the
following to create the file.

```bash
cat << EOF > letsencrypt-prod.yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-prod
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
    - http01:
        ingress:
          class: contour
EOF
```

Then apply it to your Kubernetes cluster.

```bash
kubectl apply -f letsencrypt-prod.yaml
```

Again, you can confirm this process completed successfully by running the
following and ensuring the cluster issuer was issued.

```bash
kubectl get clusterissuers
```

Recall how earlier in the annotations of the Harbor `values.yml` file you told
Harbor to use the `letsencrypt-staging` cluster issuer, as well as the secret
`harbor-tls-staging`. You must now tell Harbor to use the production cluster
issuer you just created, and trigger it to create a new secret based on that
certificate. To do this, you are going to update the `harbor-values.yaml` file
using `sed`:

```
sed -i 's/-staging/-prod/' harbor-values.yaml
```

Run `helm delete` then `helm install` to uninstall and reinstall Harbor:

Note: The persistent volumes are not deleted during the `helm delete` so any
changes in Harbor you may have made should persist.

```bash
helm delete -n harbor harbor
helm install harbor bitnami/harbor -f harbor-values.yaml -n harbor --version 9.4.4
```

Wait for the new Pods to become `<READY>`. This may take a minute or two.

```bash
watch kubectl get pods -n harbor
```

This process may take as little as a minute or as long as an hour. It just
depends on the server load at that time. But in most of my testing, it took less
than 10 minutes.

```bash
watch kubectl get certificate harbor-tls-prod -n harbor
```

Once the certificates are generated successfully, your Harbor instance should be
up and running with valid and trusted TLS certificates. Try logging into Harbor
again.

Your browser should no longer present a warning, as the certificate you are now
using is signed by a trusted CA.

Note: If you still see certificate warnings, you may need to re-open it from a
fresh browser.

## Test Harbor

Run `docker login` to log into your new registry:

```bash
docker login https://registry.$DOMAIN
```

Push an image to the new registry:

```bash
docker pull nginx:latest
docker tag nginx:latest registry.$DOMAIN/library/nginx:latest
docker push registry.$DOMAIN/library/nginx:latest
```

Test that Kubernetes can access the new image:

```bash
kubectl create deployment nginx --image=registry.$DOMAIN/library/nginx:latest
```

Wait a few moments and check that the Pod is running:

```bash
$ NAME                         READY   STATUS    RESTARTS   AGE
pod/nginx-7cdffc88cf-p8v9r   1/1     Running   0          5s

NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.123.240.1   <none>        443/TCP   166m

NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx   1/1     1            1           5s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-7cdffc88cf   1         1         1       5s
```

## Summary

That's it! You now have a service running in Kubernetes with TLS encryption
enforced and certificate generation automated. And by using these patterns, you
should be able to install and configure other services as well. Specific steps,
especially around the configuration of the service itself, will be different,
but after using this guide you should have a leg up in getting started.