---
date: '2021-02-24'
lastmod: '2021-02-26'
subsection: Service Routing
team:
- Craig Tracey
title: Service Routing
topics:
- Kubernetes
weight: 67
oldPath: "/content/guides/kubernetes/service-routing.md"
aliases:
- "/guides/kubernetes/service-routing"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Fundamental to the deployment of most software is the ability to route traffic
to network services. This is especially true when the software platform adopts a
microservices architecture.

Traditionally, exposing such services has been an arduous task. Concerns such as
service discovery, port contention, and even load balancing were often left as
an exercise for the operator. These capabilities were, no doubt, available, but
were often configured and operated through manual user intervention.

Fortunately, Kubernetes provides a number of primitives that allow us to route
service traffic across the cluster as well as from external sources. Just as all
other Kubernetes resources, these are configured in a declarative way.

## The Kubernetes Service Resource

The Kubernetes Service resource is a core API type that allows users to define
how service endpoints may be exposed to client applications. This construct
operates between layer 3 and 4 of the OSI networking stack. This resource,
natively, offers three types of services that provide various levels of service
exposure.

An example Service declaration may take the following form:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: myapp
spec:
  type: ClusterIP # this is the default value if unspecified
  selector:
    app: mysql
  ports:
    - protocol: TCP
      port: 3307
      targetPort: 3306
```

This Service will provide Layer 3/4 access to mysql Pods that are labeled with
the `app: mysql` key-value pair within the `myapp` namespace. While the Pod
exposes the service on the standard mysql port (3306), the Service may
selectively expose it on an alternate port (in this case, 3307).

Each of the Service types build on the previous type, beginning with ClusterIP
as the most basic type.

![Service Routing](/images/guides/kubernetes/service-routing/diagrams/service-routing.png)

### ClusterIP

The ClusterIP Service type is used to expose a Pod's layer 4 endpoint to the
rest of the cluster. As stated earlier, this service type serves as the most
basic of all of the types. This construct is namespaced, and has two primary
functions: to provide a cluster-local virtual IP and an associated DNS entry.
This virtual IP is pulled from an IP pool that is dedicated for all services,
and once created it is used as the target for a consistent DNS record.

These DNS records take the fully-qualified form of:

`<service name>.<namespace>.svc.cluster.local`

From the example above, this record would take the form:

`mysql.myapp.svc.cluster.local`

These records may be used for service discovery from within the cluster. They
may be used to address services across namespaces as well as within the same
namespace. In the case of intra-namespace resolution, they may be addressed with
just the short name of the record.

When a service type is not specified, ClusterIP is the default.

### NodePort

NodePort services provide a mechanism for exposing services to external
entities. In this case, a high port will be opened on all Nodes in the cluster.
The range from which this port will be allocated may be specified through the
`--service-node-port-range` `kube-api-server` configuration parameter. The
default port range can be consulted in the
[official documentation.](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)
While a valid, unused port that falls within the range may be specified in the
declaration, the most common case calls for the port to be selected
automatically by Kubernetes itself.

When a NodePort service type is specified, this functionality will build upon
the ClusterIP construct. In other words, when specified, NodePort will
instantiate the functionality of both NodePort as well as ClusterIP. An external
user will be able to address an in-cluster service by connecting to any single
node in the cluster at the high port which has been dedicated to the service.
Likewise, clients that originate their connection from within the cluster may
utilize either the virtual IP and/or DNS entries provided by the ClusterIP
functionality.

This functionality can be a critical component for exposing services to external
clients, but it can be a bit cumbersome. An external client would need to know
the IP address of cluster Nodes as well as the ephemeral high port that has been
delegated to the Service. While custom service discovery mechanisms may be
reliably configured with this ephemeral data, in the next section we will
demonstrate how NodePort may be utilized to front Services with an external load
balancer.

Node ports are opened on all Nodes within the cluster. Therefore, there is no
guarantee that your destination Pod is also colocated on that Node. Once the
traffic hits the Node port, it will be forwarded through the ClusterIP service
that may direct it to a Pod on another Node, even if a suitable Pod is running
on that Node. This behavior can be controlled by configuring your Service with
an `externalTrafficPolicy`.

An `externalTrafficPolicy` denotes if the traffic received is desired to be
routed to node-local or cluster-wide endpoints. The default value for this
parameter is `Cluster`, which as described above will forward the NodePort
traffic to any Pod running in the cluster, even if it is running on a Node
different than the one receiving the traffic. When choosing `Local` for this
setting, the client source IP is preserved and a second hop to another node is
avoided, but this potentially limits the load-spread across the cluster and
risks imbalanced traffic spreading.

### LoadBalancer

The LoadBalancer Service type, again, builds on the foundation provided by the
NodePort and ClusterIP functionality. When this type is specified, both
in-cluster and external access is configured as outlined above. Additionally, an
external load balancer will also be configured to front all of the NodePort
services.

This Service type requires the cluster is built on top of infrastructure that
provides load balancing functionality. Nearly all cloud IaaS providers (i.e. AWS,
GCP, Azure, etc.), provide support for these services through Kubernetes cloud
provider integrations. Additionally, there are third-party integrations (i.e. F5,
NSX, etc.) that may also provide load balancing functionality that implements
the Kubernetes Service resource.

## Ingress

As web-based services continue to grow in popularity, whether those are
user-facing interfaces or REST/GraphQL APIs, it is likely that these types of
applications will constitute the majority of what gets deployed on an average
cluster. With these types of applications, there are a number of features that
are necessary for a production deployment. First and foremost, these
applications will require redundancy, and this is typically achieved by
deploying a number of discreet instances of the web-based application and, in
turn, fronting these with a layer 7 proxy. This reverse proxy will register a
number of upstream instances of the application, ensuring that each is reachable
by way of a health check, and forwarding traffic to healthy upstreams according
to the declared configuration.

These configurations will provide mechanisms for the traffic to be qualified by
a number of rules before it is forwarded on to the upstream instances of the
application. These rules for evaluation may include conditions such as the value
of the `Host` header in the HTTP request, as well as the specific paths that are
being requested. Once a rule has evaluated to a known upstream, the traffic may
be passed as-is or forwarded on with specified modifications (i.e. header
changes, path rewrites, etc).

Kubernetes provides a mechanism for easy configuration of an in-cluster reverse
proxy deployment with its Ingress resource. This resource serves as a generic
configuration for nearly any reverse proxy. As Pods for a Service scale up or
down (again, these are determined by label selectors), the Ingress controller
will, in turn, add or remove the Pod's IP from the pool of upstream Endpoints.
Endpoints for a Service may be queried with the `kubectl get endpoints` command.

![Service Routing Ingress](/images/guides/kubernetes/service-routing/diagrams/service-routing-ingress.png)

Some proxies, however, also provide functionality above and beyond what would be
considered a common feature set. In this case, custom features may be
supplemented with annotations on the resource.

In addition to specific implementation details, annotations may be utilized for
adjacent and/or complementary functionality. For instance, with the
[cert-manager](https://github.com/jetstack/cert-manager) project, annotations
are placed on an Ingress resource so that the reverse proxy may secure the
deployment with TLS certificates.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - http:
        paths:
          - path: /testpath
            backend:
              serviceName: test
              servicePort: 80
```

As with any Kubernetes controller, a user may declare a desired state and the
controller is responsible for reconciling that configuration towards that
desired state. The case for Ingress controllers is no different. The controller
will watch for any updates to the full collection of Ingress objects and, in
turn, configure the reverse proxy to reflect the desired state. In the case of
proxies such as nginx, this will amount to the controller writing a collection
of nginx configuration files, and reloading the nginx service. Alternatively,
with more modern proxies (e.g. Envoy managed by the Contour Controller),
upstreams and other configurations may be manipulated with an API, and thus do
not require reloads. This functionality is advantageous as it will not disrupt
any in-flight connections.

## Service Mesh

As mentioned earlier, natively, Kubernetes service routing is concerned with
providing the layer 3 and 4 plumbing that will connect a client to a network
service that is being served from within the cluster. There is, however, a
desire amongst the industry to provide additional routing capabilities. While
layer 3 and 4 can provide adequate mechanisms for connectivity, it is incapable
of providing any data or features for application-centric concerns. As one
extends into the higher layers, we can start to change the way we deploy and
observe these applications.

Service mesh deployments make use of the native Kubernetes service constructs,
but layer on features implemented with layers 5 through 7. Some of the features
afforded by service mesh controllers include mutual TLS, tracing, circuit
breaking, dynamic routing, rate limiting, load balancing, and more. This is
typically implemented by placing lightweight proxies at application boundaries
within the Kubernetes cluster. Specifically, in the case of projects like
[Istio](https://istio.io) this is accomplished by automatically attaching an
Envoy proxy container to all Pods. Envoy, when deployed in this way, can provide
the features mentioned above. This does, however, come at the price of
additional resource utilization.

While service mesh implementations are relatively nascent in the wild, it is
quickly becoming a must-have feature set. And, we fully expect that service mesh
deployments will continue to expand in size and scope. Let's review some of the
common service mesh features.

### Mutual TLS

Mutual TLS provides some very attractive features for application developers and
platform operators alike. As with most deployments, there will be requirements
for adhering to security constraints before going to production. One of the most
popular requests is that all network traffic should be encrypted. While this may
be achieved with some CNI implementations, many do not provide this type of
overlay capability. Regardless of what the nature of our network fabric looks
like, we can provide this capability seamlessly with a service mesh operating at
layer 5 and 7 of the OSI model.

In addition to the requirement that all traffic be encrypted, mutual TLS also
provides service-to-service identity. In other words, we can ensure that only
services that we have been authorized to transact with one another may do so. Of
course we can implement firewall policies that would also provide similar
capabilities, but these are not nearly as advanced as what TLS can provide.
Firewall rules merely indicate which IP and port combinations may initiate and
complete connections. Mutual TLS, however, can ensure cryptographically which
layer 7 connections will be able to be initiated and completed.

### Tracing

In dynamic environments like Kubernetes, there is often a desire to understand
how microservices are connected to one another. Not only are we concerned with
what services speak to each other, we are also concerned with understanding to
what degree they do so. How many connections are there, and how frequently? Or,
are there some service-to-service connections that are slower than others?

Due to service mesh-placed proxies alongside the application, we can now
automatically add Open Tracing headers to help us understand how services
interact. And, this is precisely how tracing works with service mesh
technologies: headers are placed on intra-service traffic, and may then be
analyzed by tools such as [Jaeger](https://jaegertracing.io).

### Circuit Breaking

Circuit breaking allows for advanced patterns concerning failure detection. Now,
instead of relying on the, relatively simplistic, health checks offered by layer
3 and layer 4 (i.e. can we connect?), we can now programmatically remove
upstreams based on more qualified data. Because service mesh operates at the
application layer, we can add criteria concerning HTTP status codes, response
times, number of pending requests and the like. Utilizing application data in
this way helps to provide a better end-user experience.

### Advanced Request Routing

Service mesh implementations also allow for routing traffic based upon policy
that extend above and beyond what is capable with native Kubernetes constructs
alone. Advanced patterns, such as canary, weighted, and/or blue/green
deployments, are available through service mesh-specific resource types.
Likewise, this capability also enables advanced development patterns. Users may
be directed to specific application instances based on designated headers and
even the request's attached user identity.

### Load Balancing

While Kubernetes Ingress controllers are implemented with load balancing reverse
proxies, service mesh is capable of providing features above what is typically
provided by these third-party controllers. Whereas most Ingress controllers are
a bit limited with regard to how they maybe configured through the Ingress
resource type, service mesh provides additional resource types that allow a user
to be more expressive. Service mesh also typically provides for some advanced
capabilities like locality-based balancing, with failover based upon priority
designations.

## Popular Tooling and Approaches

### Ingress

#### NGINX Ingress Controller

The [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx) is
the most commonly deployed Ingress controller within the Kubernetes ecosystem.
It is maintained in the open as a Kubernetes community project. It is built on
the decades-old NGINX reverse proxy and, is therefore, well understood and a
technology that many organizations have already operationalized and/or have
familiarity with.

**Pros:**

- Broad adoption.
- Well-tested in production scenarios.
- Extends the Ingress resource with dozens of implementation-specific
  annotations.
- Functionality may be extended with Lua scripting.

**Cons:**

- Technology is not well-suited for highly dynamic environments.
  - All Ingress changes require that NGINX reloads the process in order to apply
    the changes. This may have a detrimental impacts on in-flight connections.

#### Contour

[Contour](https://projectcontour.io) is an Ingress controller that is developed
and maintained by VMware. Built on top of the
[Envoy](https://www.envoyproxy.io/) proxy from Lyft. It offers a performant,
cloud native solution for Ingress control.

Because Envoy is configurable via gRPC APIs, this means that new route
configurations may be applied dynamically and without disrupting any in-flight
connections.

Contour adds a Custom Resource Definition called HTTPProxy, which enables
advanced capabilities that may not be expressed with Ingress normally. Features
such as route delegation, multi-service routes, weighted endpoints, and load
balancing strategies allow end users to craft highly-specific application
rollout patterns, thus further enabling CI/CD.

**Pros:**

- Built on top of Envoy, a highly performant and scalable reverse proxy.
- Ingress configuration is applied via an API; not static configuration files.
- Extends Ingress control to support multi-team environments.
  - HTTPProxy provides richer configuration than is available with the Ingress
    resource alone. Some of these extended features include weighted routes
    and specification of load balancing strategies without the use of
    annotations.

**Cons:**

- Relatively new within the ecosystem, only reaching GA recently.
  - Features that already exist for other Ingress controllers may not yet be
    available for Contour.

#### Traefik

[Traefik](https://containo.us/traefik/) bills itself as the "Cloud Native Edge
Router." While we have seen limited numbers of deployments leveraging Traefik,
it has often been utilized in cases where other solutions did not provide
equivalent functionality. Specifically, features like header-based routing have
been implemented with Traefik in the past, but as this functionality becomes
more commonplace, the need for Traefik to fill this gap will likely diminish.

Traefik is supported by [Containous](https://containo.us) and is developed as
open source software.

**Pros:**

- Has some extended features that may not be available with other Ingress
  solutions.
- Seamless integrations with services such as Let's Encrypt
- Full-featured dashboard
- Multi-platform support beyond Kubernetes alone.
  - Docker
  - Rancher
  - Marathon

**Cons:**

- Has not seen strong traction within the community.
- Deep feature list, but configuration can be a bit complicated.
- Some Enterprise features are not open sourced.

### Service Mesh

#### Linkerd

[Linkerd](https://linkerd.io/) is an ultra lightweight service mesh for
Kubernetes. It provides end users with the features that they would expect from
a service mesh solution: runtime debugging, observability, reliability, and
security. Linkerd is a fully open source solution falling under the Apache 2
license.

Features:

- HTTP, HTTP/2, and gRPC Proxying
- TCP Proxying and Protocol Detection
- Retries and Timeouts
- Automatic mTLS
- Ingress
- Telemetry and Monitoring
- Automatic Proxy Injection
- Dashboard and Grafana
- Distributed Tracing
- Fault Injection
- High Availability
- Service Profiles
- Traffic Split (canaries, blue/green deploys)

**Pros:**

- Lightweight service mesh solution which requires absolutely no changes to
  application code.
- Contains all of the features that would be expected from a service mesh
  solution.
- Was one of the first service mesh options and is quite mature as a result.
- Recently rewritten in the aim of improving performance.

**Cons:**

- Linkerd doesn't provide an Ingress Controller. The [project
  documentation](https://linkerd.io/2/tasks/using-ingress/) has information
  about integrating with Nginx, Contour, and others. This means Linkerd requires
  managing Ingress as additional operational overhead.
- Traffic splitting syntax can be cumbersome.

#### Istio

[Istio](https://istio.io) is perhaps the most popular service mesh offering
today. It is an open source project that is being maintained by Google, IBM, and
Red Hat. Just as with Linkerd, it has dozens of features that one would expect
to see in a service mesh solution.

Istio makes it easy to create a network of deployed services with load
balancing, service-to-service authentication, monitoring, and more, with few or
no code changes in service code. You add Istio support to services by deploying
a special sidecar proxy throughout your environment that intercepts all network
communication between microservices, then configure and manage Istio using its
control plane functionality, which includes:

- Automatic load balancing for HTTP, gRPC, WebSocket, and TCP traffic.
- Fine-grained control of traffic behavior with rich routing rules, retries,
  failovers, and fault injection.
- A pluggable policy layer and configuration API supporting access controls,
  rate limits and quotas.
- Automatic metrics, logs, and traces for all traffic within a cluster,
  including cluster ingress and egress.
- Secure service-to-service communication in a cluster with strong
  identity-based authentication and authorization.

**Pros:**

- Istio has a huge amount of momentum behind it. It is currently the most
  popular service mesh offering on the market.
- It forms the basis of VMware's NSX-SM solution.
- It is extraordinarily full-featured, but this also creates a large degree of
  complexity.
- Istio may be used as both an Ingress and a service mesh with the Ingress
  Gateway feature.

**Cons:**

- Istio does not have an open governance model. Its steering committee is run by
  IBM, Google, and Red Hat.
- Istio is in rapid development and many features are at various levels of
  stability, some of which may not be suitable for production.
- Configuration can be extraordinarily complex.
- You may be required to leverage the Istio ingress controller exclusively in
  order to leverage the features you are interested in.
- The complexity that Istio introduces to a Kubernetes deployment often mandates
  a team dedicated to its operation and support.