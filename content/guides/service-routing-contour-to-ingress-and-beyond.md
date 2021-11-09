---
date: '2021-02-24'
lastmod: '2021-02-25'
linkTitle: Contour to Ingress and Beyond
parent: Service Routing
tags:
- Kubernetes
- Tanzu
- Contour
- Ingress
- httproxy
- istio
- service mesh
- network
team:
- Paul Czarkowski
title: Getting Started with Contour - To Ingress and Beyond
weight: 2
oldPath: "/content/guides/kubernetes/service-routing-contour-to-ingress-and-beyond.md"
aliases:
- "/guides/kubernetes/service-routing-contour-to-ingress-and-beyond"
level1: Building Kubernetes Runtime
level2: Building Your Kubernetes Platform
---

### Introduction to Contour

[Contour](https://projectcontour.io/) is an open source Kubernetes
[Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
that acts as a control plane for the Envoy edge and service proxy (see below).​
Contour supports dynamic configuration updates and multi-team ingress delegation
while maintaining a lightweight profile.

Contour is built for Kubernetes to empower you to quickly deploy cloud native
applications by using the flexible HTTPProxy API which is a lightweight system
that provides many of the advanced routing features of a Service Mesh.

Contour deploys the
[Envoy](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy) proxy
as a reverse proxy and load balancer. Envoy is a Layer 7 (application layer) bus
for proxy and communication in modern service-oriented architectures, such as
Kubernetes clusters. Envoy strives to make the network transparent to
applications while maximizing observability to ease troubleshooting.

### Before You Begin

You'll need a Kubernetes cluster. This guide uses a
[Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid) cluster, but
any Kubernetes Cluster whether they're running on a Public Cloud, in your
[Home] Lab, or on your desktop such as [KIND](https://kind.sigs.k8s.io/) or
[minikube](https://minikube.sigs.k8s.io/docs/start/). You'll also need the
Kubernetes CLI
[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

1. Verify access to your Kubernetes cluster

    ```bash
    $ kubectl version --short
    Client Version: v1.20.2
    Server Version: v1.19.3+vmware.1
    ```

1. Create a scratch directory to work from

    ```bash
    mkdir ~/scratch/contour-demo
    cd ~/scratch/contour-demo
    ```

### Installing Contour 1.12.0

Since version 1.11.0 we've got two primary options for installing Contour, A
singleton install from manifests, or by using the
[Operator](https://projectcontour.io/resources/deprecation-policy/) (which is
currently in Alpha). Since we only plan to install Contour once on the cluster,
we can stick to the safer method of using the Contour provided manifests.

You can install Contour directly from the manifests provided by the project,
however best practice would have you download them locally first for validation
and repeatability.

1. Download contour installation manifests
    ```bash
    wget https://projectcontour.io/quickstart/v1.12.0/contour.yaml
    ```

1. View the manifests in your favorite local text editor

    ```bash
    less contour.yaml
    ```

1. Validate even further by doing a dry run install

    ```bash
    kubectl apply -f contour.yaml --dry-run=client
    ```

1. If that all looks good (and it should!), perform the actual install

    ```bash
    kubectl apply -f contour.yaml
    ```

1. After a few moments you can confirm that its ready.

    You're looking for both the **deployment** and **DaemonSet** to show as fully
    Available, and a valid IP (or hostname) in the `EXTERNAL-IP` field of your
    envoy **service**.

    ```bash
    $ kubectl -n projectcontour get deployment,daemonset,service

      NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
      deployment.apps/contour   2/2     2            2           2m18s

      NAME                   DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
      daemonset.apps/envoy   3         3         3       3            3           <none>          2m17s

      NAME              TYPE           CLUSTER-IP       EXTERNAL-IP
      PORT(S)                      AGE
      service/contour   ClusterIP      100.71.191.199   <none>
      8001/TCP                     2m18s
      service/envoy     LoadBalancer   100.66.114.136   a36c85343e9284c1cb4236d844c31aab-1691151764.us-east-2.elb.amazonaws.com   80:30825/TCP,443:30515/TCP   2m18s
    ```

  1. Save the Ingress `EXTERNAL-IP` for later use as a [xip.io](http://xip.io) dynamic DNS host.

  {{% aside title="Note for AWS Users" %}}
  Since this is deployed in Amazon Web Services I had to resolve the hostname
  using the `host` command, but in other clouds you will probably get an IP
  address.
  {{% /aside %}}

  ```bash
  INGRESS_HOST=<external ip address from above>.xip.io
  ```

### Creating an Ingress using Contour 1.12.0

Now that Contour is installed we can validate it is functioning correctly by
deploying an application, exposing it as a service, then creating an Ingress
resource. As well as creating the resources we'll output the manifests to a file
for later re-use.

1. Create a namespace

    ```bash
    kubectl create namespace my-ingress-app -o yaml > my-ingress-app-namespace.yaml
    ```

1. Create a deployment containing a basic nginx pod

    ```bash
    kubectl -n my-ingress-app create deployment --image=nginx \
      nginx -o yaml > my-ingress-app-deployment.yaml
    ```

1. Create a service for the deployment

    ```bash
    kubectl -n my-ingress-app expose deployment nginx --port 80 -o yaml > my-ingress-app-service.yaml
    ```

1. Finally create an Ingress for the service

    ```bash
    kubectl -n my-ingress-app create ingress nginx --class=default \
      --rule="nginx.$INGRESS_HOST/*=nginx:80" -o yaml > my-ingress-app-ingress.yaml
    ```

1. Validate that your resources are deployed and ready

    ```bash
    $ kubectl -n my-ingress-app get all,ingress

    Warning: extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress
    NAME                         READY   STATUS    RESTARTS   AGE
    pod/nginx-6799fc88d8-dphdt   1/1     Running   0          13m

    NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
    service/nginx   ClusterIP   100.69.247.38   <none>        80/TCP    12m

    NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/nginx   1/1     1            1           13m

    NAME                               DESIRED   CURRENT   READY   AGE
    replicaset.apps/nginx-6799fc88d8   1         1         1       13m

    NAME                       CLASS     HOSTS                                                                     ADDRESS                                                                   PORTS   AGE
    ingress.extensions/nginx   default   a36c85343e9284c1cb4236d844c31acb-1691151764.us-east-2.elb.amazonaws.com   a36c85343e9284c1cb4236d844c31acb-1691151764.us-east-2.elb.amazonaws.com   80      51s
    ```

1. Validate that you can access the application

    ```bash
    $ curl -s nginx.3.13.150.109.xip.io  | grep h1

    <h1>Welcome to nginx!</h1>
    ```

Congratulations! If you see the **Welcome to nginx!** message, that means you've
successfully installed and tested Contour as an Ingress Controller. However its
so much more than that, so lets explore further.

However let's clean up our resources before we move on. Since all of our
resources are in a single namespace we could use
`kubectl delete namespace my-ingress-app`, However we also saved the manifests
so we can use those like so:

{{% aside title="Caution" type="warning" %}}
We created these manifests in the same directory as our contour manifests, so
we will move them into a subdirectory to ensure we only delete the app itself.
This is a lesson learned that we should have created them in a subdirectory
in the first place for organizational purposes.
{{% /aside %}}

```bash
mkdir my-ingress-app
mv my-ingress-app-* my-ingress-app/
kubectl delete -f my-ingress-app
```

### Beyond Ingress with Contour 1.12.0

As well as **Ingress** Contour supports a resource type **HTTPProxy** which
extends the concept of **Ingress** to add many features that you would normally
have to reach for **Istio** or a similar service mesh to get. We can explore
some of those features here.

Having learned our lesson about sub directories above, lets create a directory
for our exploration of HTTPProxy.

```bash
mkdir http-proxy
cd http-proxy
```

As we did earlier we'll start by deploying a nginx **Pod** and a **Service**.

1. Create a namespace

    ```bash
    kubectl create namespace http-proxy -o yaml > http-proxy-namespace.yaml
    ```

1. Create a Deployment containing a basic nginx pod

    ```bash
    kubectl -n http-proxy create deployment --image=nginx \
      nginx -o yaml > http-proxy-nginx-deployment.yaml
    ```

1. Create a service for the deployment

    ```bash
    kubectl -n http-proxy expose deployment nginx --port 80 -o yaml \
      > http-proxy-nginx-service.yaml
    ```

Now that we have the Deployment and Service created we can create the HTTPProxy
resource. Unfortunately we can't just sling a `kubectl create httpproxy` like we
could with the other resources so we'll need to get creative.

1. Create a HTTPProxy manifest

    ```bash
    cat << EOF > http-proxy.yaml
    apiVersion: projectcontour.io/v1
    kind: HTTPProxy
    metadata:
      name: www
      namespace: http-proxy
    spec:
      virtualhost:
        fqdn: www.$INGRESS_HOST
      routes:
        - conditions:
          - prefix: /
          services:
            - name: nginx
              port: 80
    EOF
    ```

1. Apply the HTTPProxy manifest

    ```bash
    kubectl apply -n http-proxy -f http-proxy.yaml
    ```

1. Wait a few moments and then attempt to access the nginx service

    ```bash
    curl -s www.3.13.150.109.xip.io | grep h1
    <h1>Welcome to nginx!</h1>
    ```

#### Rate Limiting

Now that your nginx is working via **HTTPProxy** we can look at some of the more
advanced features. Let's start with Rate limiting. Contour 1.12.0 supports doing
*local* rate limiting, which means that each Envoy **Pod** will have its own
limits, vs a *global* rate limit which would need further coordination between
the Envoy **Pods**. You can also set the Rate limit for the virtualhost, or for
a specific route.

Let's create a fairly aggressive rate limit so we can see the affects of it
fairly quickly. The example cluster I am using has three worker nodes, which
means three Envoy **Pods** so if I set a rate limit of 2 per minute we should be
able to hit the limit after 6 requests.

1. Create a new **HTTPProxy** resource with rate limiting enabled

    ```bash
    cat << EOF > rate-limit.yaml
    apiVersion: projectcontour.io/v1
    kind: HTTPProxy
    metadata:
      name: rate
      namespace: http-proxy
    spec:
      virtualhost:
        fqdn: rate.$INGRESS_HOST
        rateLimitPolicy:
          local:
            requests: 2
            unit: minute
      routes:
        - conditions:
          - prefix: /
          services:
            - name: nginx
              port: 80
    EOF
    ```

1. Apply the new rate limited manifest:

    ```bash
    kubectl -n http-proxy apply -f rate-limit.yaml
    ```

1. Wait a few moments and then fire up a while loop to connecting to the service
   and watch it hit the limit after a few hits.

   Note: You'll need to hit CTRL-C to break the while loop.

    ```bash
    $ while true; do curl -s rate.$INGRESS_HOST | grep -E 'h1|rate' ; done

    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    local_rate_limited
    local_rate_limited
    local_rate_limited
    ^C
    ```

That's it, rate limiting is enabled. This is incredibly useful if you have a
service with known limitations or you want to restrict any one user from
overwhelming the service.

#### Weighted routing

The **HTTPProxy** resource can also route a Virtual Host to multiple services,
this is a great feature if you want to perform Blue/Green deployments, or you
want to send a small percentage of requests to a special debug endpoint. Let's
explore Weighted routing by adding an Apache service to receive 10% of the
requests.

1. Create a Deployment containing a basic httpd pod

    ```bash
    kubectl -n http-proxy create deployment --image=httpd \
      httpd -o yaml > http-proxy-httpd-deployment.yaml
    ```

1. Create a service for the deployment

    ```bash
    kubectl -n http-proxy expose deployment httpd --port 80 -o yaml \
      > http-proxy-httpd-service.yaml
    ```

1. Ensure the new **Pod** is available beside the existing nginx one.

    ```bash
    kubectl get pods -n http-proxy
    NAME                     READY   STATUS    RESTARTS   AGE
    httpd-757fb56c8d-kz476   1/1     Running   0          23s
    nginx-6799fc88d8-jxvj7   1/1     Running   0          163m
    ```

1. Create a **HTTPProxy** resource to perform weighted routing across the two services

    ```bash
    cat << EOF > weighted.yaml
    apiVersion: projectcontour.io/v1
    kind: HTTPProxy
    metadata:
      name: weight
      namespace: http-proxy
    spec:
      virtualhost:
        fqdn: weight.$INGRESS_HOST
      routes:
        - conditions:
          - prefix: /
          services:
            - name: httpd
              port: 80
              weight: 10
            - name: nginx
              port: 80
              weight: 90
    EOF
    ```

1. Apply the new resource

    ```bash
    kubectl -n http-proxy apply -f weighted.yaml
    ```

1. Test the weighting

   Note: It's not clear in the documentation, but it appears that the weighting
   is applied per Envoy **Pod**, so it might not be exactly 10% for small test
   runs, but would statistically work out over time.

    ```bash
    $ while true; do curl -s weight.$INGRESS_HOST | grep h1 ; done
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <h1>Welcome to nginx!</h1>
    <html><body><h1>It works!</h1></body></html>
    ^C
    ```

That's it! we've successfully done a walk through of some of the new features of
Contour 1.12.0 and tested out both Rate Limiting and Weighted Routing. Let's
clean up.

#### Cleanup

1. Delete your http-proxy namespace and resources

    ```bash
    kubectl -n http-proxy delete -f .
    ```

1. Uninstall Contour

    ```bash
    cd ..
    kubectl delete -f contour.yaml
    ```

### Conclusion

As you can see Contour 1.12.0 is more than just an Ingress Controller as it
brings some of the more advanced features of a service mesh but without all the
extra resources required. Next time you find yourself looking to run Istio,
remember to check in with Contour and see if it will do what you need.