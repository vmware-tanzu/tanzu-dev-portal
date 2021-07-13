---
date: '2021-02-24'
description: Implement a deny-all network policy in Kubernetes
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Network Policy Implementation
parent: Container Networking
tags:
- networking
- Calico
title: Network Policy Implementation
oldPath: "/content/guides/kubernetes/container-networking-network-policy.md"
aliases:
- "/guides/kubernetes/container-networking-network-policy"
level1: Managing and Operating Kubernetes
level2: Kubernetes Architecture
---

This directory demonstrates how to implement default deny-all network rules in a
Kubernetes cluster. This is achieved using Calico's
[GlobalNetworkPolicy](https://docs.projectcalico.org/v3.5/reference/calicoctl/resources/globalnetworkpolicy)
and the Kubernetes
[NetworkPolicy](https://docs.kubernetes.io/concepts/services-networking/network-policies/)
objects. It operates based on labels attached to namespaces.

Creating rules that allow traffic is done by adding Kubernetes `NetworkPolicy`
objects to the namespace. These objects are portable across CNI plugins that
enforce Kubernetes `NetworkPolicy`. Calico supports mixing Calico-specific
policies with Kubernetes policy. This is not true for all CNI plugins such as
Cilium. Calico-specific policies honor an `order` attribute for specifying
precedence of policy evaluation. Lower values take precedence. Kubernetes policy
does not support order, as it only supports additive allow rules. Under the
hood, Calico sets Kubernetes policy to an order of `100`. Thus, Calico policies
must have their order set above `100`.

To allow the blocked traffic in the above diagram, a `NetworkPolicy` such as the
following would be applied.

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tomcat-netpol
  namespace: team-a
spec:
  policyTypes:
    - Ingress
    - Egress
  podSelector:
    matchLabels:
      app: tomcat
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress
        - podSelector:
            matchLabels:
              app: nginx
      ports:
        - protocol: TCP
          port: 80
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: team-a
        - podSelector:
            matchLabels:
              app: mysql
      ports:
        - protocol: TCP
          port: 3306
```

Note: this policy, unlike `GlobalNetworkPolicy`, is scoped within namespace and
owned by team-a.

### Namespace Ownership

This design assumes administrative ownership of namespaces. In most multi-tenant
environments, namespaces are provisioned for teams. This allows limits, quotas,
and other sensible defaults to be configured by administrators or
programmatically with automation.

### Alternative Designs

**a. Use only Kubernetes `NetworkPolicy`**

This approach is portable between multiple CNI Plugins. However, it requires
creating a default deny-all network policy and adding it to every namespace that
gets created. Should you need to modify how default-deny all works in your
cluster and your cluster hosts 500 namespaces, you now have 500 locations to
update the policy. Additionally, Calico's `GlobalNetworkPolicy` is far more
capable than Kubernetes `NetworkPolicy`.

**b. Other CNI Plugins**

Since Calico is used by the majority of our customers and recommended in our
Validated Designs, Calico is used here. Should a customer desire using a
different CNI plugin, similar mechanic may be available. Do note that some
plugins do not allow you to mix their CRDs with Kubernetes `NetworkPolicy`
objects.

## Deploying and Testing

This section walks you through step-by-step applying of network policies in a
running cluster. Each section has a diagram demonstrating how ingress and egress
traffic will behave once you complete the section. There are validation steps
throughout where you will make requests to ensure policy is blocked or allowed.

_**This section assumes you have a Kubernetes cluster running Calico 3.2+**_.

### Environment Setup

Start by creating the resources and network paths shown in the diagram below.
For now, all traffic will be allowed.

![Allow All Traffic](/images/guides/kubernetes/container-networking/diagrams/netpol-example-allowed.png)

1. Download `calicoctl`.

   ```
   curl -O -L  https://github.com/projectcalico/calicoctl/releases/download/v3.5.1/calicoctl &&\
     chmod +x calicoctl &&\
     sudo mv calicoctl /usr/local/bin
   ```

1. Configure `calicoctl`.

   ```
   export DATASTORE_TYPE=kubernetes
   export KUBECONFIG=~/.kube/config
   calicoctl get node
   ```

   ```
   NAME
   ip-10-192-192-10
   ip-10-192-192-4
   ip-10-192-192-8
   ```

   This assumes Calico is installed in Kubernetes API datastore mode. If it is
   installed in etcd datastore mode, see
   https://docs.projectcalico.org/getting-started/clis/calicoctl/configure/etcd

1. Create the following GlobalNetworkPolicy

   ```yaml
   # deny-all.yaml

   # This GlobalNetworkPolicy uses Calico's CRD
   # (https://docs.projectcalico.org/v3.5/reference/calicoctl/resources/globalnetworkpolicy) to
   # disable all traffic on namespace containing the label: value of netpol_deny_all: true. The only
   # exception is UDP (port 53) traffic, which is allowed.
   apiVersion: projectcalico.org/v3
   kind: GlobalNetworkPolicy
   metadata:
     name: global-deny-all
   spec:
     # order controls the precedence. Calico applies the policy with the lowest value first.
     # Kubernetes NetworkPolicy do not support order. They are automatically converted to an order
     # value of 1000 by Calico. Setting this value to 2000, provides flexibility for 999 additional
     # GlobalNetworkPolicies to be added and ensures Kubernetes namespace-scoped policies always take
     # precedence.
     order: 2000

     # types describes the direction of traffic this policy impacts. In this case, Ingress and Egress.
     types:
     - Ingress
     - Egress

     # egress network rules
     egress:
     # Allow all egress traffic when the netpol_deny_all label is not present.
     - action: Allow
   	destination: {}
   	source:
   	  namespaceSelector: '!has(netpol_deny_all)'

     # Allow all egress traffic when the netpol_deny_all label has value 'disabled'.
     - action: Allow
   	destination: {}
   	source:
   	  namespaceSelector: netpol_deny_all == 'disabled'

     # Allow egress DNS traffic to any destination. This assumes DNS traffic will be over UDP and
     # never TCP.
     - action: Allow
   	protocol: UDP
   	source:
   	  namespaceSelector: netpol_deny_all == 'enabled'
   	destination:
   	  nets:
   		- 0.0.0.0/0
   	  ports:
   		- 53

     # ingress network rules
     ingress:
     # Allow all ingress traffic when the netpol_deny_all label is not present.
     - action: Allow
   	destination:
   	  namespaceSelector: '!has(netpol_deny_all)'
   	source: {}

     # Allow all ingress traffic when the netpol_deny_all label has value 'enabled'.
     - action: Allow
   	destination:
   	  namespaceSelector: netpol_deny_all == 'disabled'
   	source: {}
   ```

1. Apply the GlobalNetworkPolicy

   ```
   calicoctl apply -f deny-all.yaml
   ```

   This applies the default deny-all policy described in the design section. It
   will have no impact initially as namespaces are not properly labeled.

1. Create namespaces `ingress` and `team-a`.

   ```
   kubectl create ns ingress
   kubectl create ns team-a
   ```

1. Create a Contour manifest

   ```yaml
   # contour.yaml

   apiVersion: v1
   kind: Namespace
   metadata:
     name: ingress
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: contour
     namespace: ingress
   ---
   apiVersion: apiextensions.k8s.io/v1beta1
   kind: CustomResourceDefinition
   metadata:
     name: ingressroutes.contour.heptio.com
     labels:
   	component: ingressroute
   spec:
     group: contour.heptio.com
     version: v1beta1
     scope: Namespaced
     names:
   	plural: ingressroutes
   	kind: IngressRoute
     additionalPrinterColumns:
   	- name: FQDN
   	  type: string
   	  description: Fully qualified domain name
   	  JSONPath: .spec.virtualhost.fqdn
   	- name: TLS Secret
   	  type: string
   	  description: Secret with TLS credentials
   	  JSONPath: .spec.virtualhost.tls.secretName
   	- name: First route
   	  type: string
   	  description: First routes defined
   	  JSONPath: .spec.routes[0].match
   	- name: Status
   	  type: string
   	  description: The current status of the IngressRoute
   	  JSONPath: .status.currentStatus
   	- name: Status Description
   	  type: string
   	  description: Description of the current status
   	  JSONPath: .status.description
     validation:
   	openAPIV3Schema:
   	  properties:
   		spec:
   		  properties:
   			virtualhost:
   			  properties:
   				fqdn:
   				  type: string
   				  pattern: ^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z0-9]{2,}$
   				tls:
   				  properties:
   					secretName:
   					  type: string
   					  pattern: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$ # DNS-1123 subdomain
   					minimumProtocolVersion:
   					  type: string
   					  enum:
   						- "1.3"
   						- "1.2"
   						- "1.1"
   			strategy:
   			  type: string
   			  enum:
   				- RoundRobin
   				- WeightedLeastRequest
   				- Random
   				- RingHash
   				- Maglev
   			healthCheck:
   			  type: object
   			  required:
   				- path
   			  properties:
   				path:
   				  type: string
   				  pattern: ^\/.*$
   				intervalSeconds:
   				  type: integer
   				timeoutSeconds:
   				  type: integer
   				unhealthyThresholdCount:
   				  type: integer
   				healthyThresholdCount:
   				  type: integer
   			routes:
   			  type: array
   			  items:
   				required:
   				  - match
   				properties:
   				  match:
   					type: string
   					pattern: ^\/.*$
   				  delegate:
   					type: object
   					required:
   					  - name
   					properties:
   					  name:
   						type: string
   						pattern: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$ # DNS-1123 subdomain
   					  namespace:
   						type: string
   						pattern: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$ # DNS-1123 label
   				  services:
   					type: array
   					items:
   					  type: object
   					  required:
   						- name
   						- port
   					  properties:
   						name:
   						  type: string
   						  pattern: ^[a-z]([-a-z0-9]*[a-z0-9])?$ # DNS-1035 label
   						port:
   						  type: integer
   						weight:
   						  type: integer
   						strategy:
   						  type: string
   						  enum:
   							- RoundRobin
   							- WeightedLeastRequest
   							- Random
   							- RingHash
   							- Maglev
   						healthCheck:
   						  type: object
   						  required:
   							- path
   						  properties:
   							path:
   							  type: string
   							  pattern: ^\/.*$
   							intervalSeconds:
   							  type: integer
   							timeoutSeconds:
   							  type: integer
   							unhealthyThresholdCount:
   							  type: integer
   							healthyThresholdCount:
   							  type: integer
   ---
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
     labels:
   	app: contour
     name: contour
     namespace: ingress
   spec:
     selector:
   	matchLabels:
   	  app: contour
     template:
   	metadata:
   	  labels:
   		app: contour
   	  annotations:
   		prometheus.io/scrape: "true"
   		prometheus.io/port: "8002"
   		prometheus.io/path: "/stats"
   		prometheus.io/format: "prometheus"
   	spec:
   	  containers:
   	  - image: gcr.io/heptio-images/contour:master
   		imagePullPolicy: Always
   		name: contour
   		command: ["contour"]
   		args:
   		- serve
   		- --incluster
   		- --envoy-external-http-port=8080
   		- --envoy-external-https-port=8443
   		- --envoy-service-http-port=8080
   		- --envoy-service-https-port=8443
   	  - image: docker.io/envoyproxy/envoy-alpine:v1.9.0
   		name: envoy
   		ports:
   		- containerPort: 8080
   		  name: http
   		  hostPort: 8080
   		- containerPort: 8443
   		  name: https
   		  hostPort: 8443
   		command: ["envoy"]
   		args:
   		- --config-path /config/contour.yaml
   		- --service-cluster cluster0
   		- --service-node node0
   		- --log-level info
   		- --v2-config-only
   		readinessProbe:
   		  httpGet:
   			path: /healthz
   			port: 8002
   		  initialDelaySeconds: 3
   		  periodSeconds: 3
   		volumeMounts:
   		- name: contour-config
   		  mountPath: /config
   		lifecycle:
   		  preStop:
   			exec:
   			  command: ["wget", "-qO-", "http://localhost:9001/healthcheck/fail"]
   	  initContainers:
   	  - image: gcr.io/heptio-images/contour:master
   		imagePullPolicy: Always
   		name: envoy-initconfig
   		command: ["contour"]
   		args:
   		- bootstrap
   		# Uncomment the statsd-enable to enable statsd metrics
   		#- --statsd-enable
   		# Uncomment to set a custom stats emission address and port
   		#- --stats-address=0.0.0.0
   		#- --stats-port=8002
   		- /config/contour.yaml
   		volumeMounts:
   		- name: contour-config
   		  mountPath: /config
   	  volumes:
   	  - name: contour-config
   		emptyDir: {}
   	  dnsPolicy: ClusterFirst
   	  serviceAccountName: contour
   	  terminationGracePeriodSeconds: 30
   ---
   apiVersion: rbac.authorization.k8s.io/v1beta1
   kind: ClusterRoleBinding
   metadata:
     name: contour
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: contour
   subjects:
   - kind: ServiceAccount
     name: contour
     namespace: ingress
   ---
   apiVersion: rbac.authorization.k8s.io/v1beta1
   kind: ClusterRole
   metadata:
     name: contour
   rules:
   - apiGroups:
     - ""
     resources:
     - configmaps
     - endpoints
     - nodes
     - pods
     - secrets
     verbs:
     - list
     - watch
   - apiGroups:
     - ""
     resources:
     - nodes
     verbs:
     - get
   - apiGroups:
     - ""
     resources:
     - services
     verbs:
     - get
     - list
     - watch
   - apiGroups:
     - extensions
     resources:
     - ingresses
     verbs:
     - get
     - list
     - watch
   - apiGroups: ["contour.heptio.com"]
     resources: ["ingressroutes"]
     verbs:
     - get
     - list
     - watch
     - put
     - post
     - patch
   ```

1. Deploy [Contour](https://github.com/projectcontour/contour) in the ingress namespace.

   ```
   kubectl apply -f contour.yaml
   ```

   Contour will be deployed as a DaemonSet attaching to a host's port 8080.
   Testing assumes you will be able to route directly to a node's IP.

1. Create a manifest for a simple echo server

   ```yaml
   # echoserver.yaml

   apiVersion: v1
   kind: Service
   metadata:
     name: echoserver
     namespace: team-a
   spec:
     ports:
   	- port: 80
   	  targetPort: 8080
   	  protocol: TCP
   	  name: http
     selector:
   	app: echoserver

   ---
   apiVersion: extensions/v1beta1
   kind: Ingress
   metadata:
     name: echoserver
     namespace: team-a
   spec:
     rules:
   	- http:
   		paths:
   		  - path: /echo
   			backend:
   			  serviceName: echoserver
   			  servicePort: 80

   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: echoserver
     namespace: team-a
   spec:
     replicas: 2
     selector:
   	matchLabels:
   	  app: echoserver
     template:
   	metadata:
   	  labels:
   		app: echoserver
   	spec:
   	  containers:
   		- name: echoserver
   		  image: gcr.io/kubernetes-e2e-test-images/echoserver:2.1
   		  ports:
   			- containerPort: 8080
   ```

1. Deploy the manifest in the team-a namespace.

   ```
   kubectl apply -f echoserver.yaml
   ```

   This deploys a `Deployment`, `Service`, and `Ingress` to satisfy the diagram
   above.

1. Create a manifest for `lorem-ipsum`

   ```yaml
   # lorem-ipsum.yaml

   apiVersion: v1
   kind: Service
   metadata:
     name: lorem-ipsum
     namespace: team-a
   spec:
     ports:
       - port: 80
         targetPort: 80
         protocol: TCP
         name: http
     selector:
       app: lorem-ipsum

   ---
   apiVersion: extensions/v1beta1
   kind: Ingress
   metadata:
     name: lorem-ipsum
     namespace: team-a
   spec:
     rules:
       - http:
           paths:
             - path: /
               backend:
                 serviceName: lorem-ipsum
                 servicePort: 80

   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: lorem-ipsum
     namespace: team-a
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: lorem-ipsum
     template:
       metadata:
         labels:
           app: lorem-ipsum
       spec:
         containers:
           - name: lorem-ipsum
             image: ksdn117/lorem-ipsum:latest
             ports:
               - containerPort: 80
   ```

1. Deploy the manifest in the team-a namespace.

   ```
   kubectl apply -f lorem-ipsum.yaml
   ```

   This deploys a `Deployment`, `Service`, and `Ingress` to satisfy the diagram
   above.

1. Validate ingress by requesting a worker node's **public** IP at port `8080`
   on path `/echo` to ensure traffic is routable.

   ```
   curl 34.219.198.115:8080/echo
   ```

   ```
   Hostname: echoserver-578989d5f6-sh5f4

   Pod Information:
           -no pod information available-

   Server values:
           server_version=nginx: 1.12.2 - lua: 10010

   Request Information:
           client_address=192.168.2.3
           method=GET
           real path=/echo
           query=
           request_version=1.1
           request_scheme=http
           request_uri=http://34.219.198.115:8080/echo

   Request Headers:
           accept=*/*
           content-length=0
           host=34.219.198.115:8080
           user-agent=curl/7.54.0
           x-envoy-expected-rq-timeout-ms=15000
           x-envoy-external-address=174.16.148.64
           x-forwarded-for=174.16.148.64
           x-forwarded-proto=http
           x-request-id=dc54cb4c-1586-42ca-8ebd-5a831a4e3b6f
           x-request-start=t=1550689433.206

   Request Body:
           -no body in request-
   ```

1. Validate ingress by requesting a worker node's **public** IP at port `8080`
   on path `/` to ensure traffic is routable.

   ![Validate Ingress](/images/guides/kubernetes/container-networking/lorem-ipsum.png)

1. Attach to the `lorem-ipsum` pod.

   ```
   LOREM_POD=$(kubectl -n team-a get pod -l app=lorem-ipsum -o jsonpath='{.items[0].metadata.name}')

   kubectl exec -n team-a -it $LOREM_POD /bin/sh
   ```

1. Add `curl` to the `lorem-ipsum` pod

   ```
   # apt update && apt install -y curl
   ```

1. Validate pod-to-pod egress by curling `echoserver`.

   ```
   # curl echoserver
   ```

   ```
   Hostname: echoserver-578989d5f6-sh5f4

   Pod Information:
   -no pod information available-
   ```

### Enforce Network Policy

Next, apply labels to the namespace so that Calico enforces the deny-all. This
would typically be handled by an administrator or automation that ensures proper
labels are attached to namespaces when teams are on boarded. After labels are
added, the network should behave as diagrammed below.

![Network Policy Denied](/images/guides/kubernetes/container-networking/diagrams/netpol-example-denied.png)

1. Add `netpol_deny_all` labels to namespaces.

   ```
   kubectl label ns ingress netpol_deny_all=disabled &&\
     kubectl label ns team-a netpol_deny_all=enabled
   ```

1. Add `name` labels to namespaces.

   ```
   kubectl label ns ingress name=ingress &&\
     kubectl label ns team-a name=team-a
   ```

1. Validate labels are as expected.

   ```
   kubectl get ns --show-labels
   ```

   ```
   NAME          STATUS   AGE     LABELS
   default       Active   10m     <none>
   ingress       Active   3m53s   name=ingress,netpol_deny_all=disabled
   kube-public   Active   10m     <none>
   kube-system   Active   10m     <none>
   team-a        Active   3m53s   name=team-a,netpol_deny_all=enabled
   ```

1. Validate ingress is blocked by requesting a worker node's **public** IP at port `8080`
   on paths `/` and `/echo`.

   ```
   curl -v 34.219.198.115:8080/echo
   ```

   ```
   *   Trying 34.219.198.115...
   * TCP_NODELAY set
   * Connected to 34.219.198.115 (34.219.198.115) port 8080 (#0)
   > GET /echo HTTP/1.1
   > Host: 34.219.198.115:8080
   > User-Agent: curl/7.54.0
   > Accept: */*
   >
   < HTTP/1.1 503 Service Unavailable
   < content-length: 57
   < content-type: text/plain
   < date: Wed, 20 Feb 2019 20:00:47 GMT
   < server: envoy
   <
   * Connection #0 to host 34.219.198.115 left intact
   ```

   Note: the `503` is from envoy, representing the upstream server (echoserver)
   was not reachable.

1. Attach to the echoserver pod.

   ```
   ECHO_POD=$(kubectl -n team-a get pod -l app=echoserver -o jsonpath='{.items[0].metadata.name}')

   kubectl exec -n team-a -it $ECHO_POD /bin/sh
   ```

1. Ping `google.com`; verify it cannot be reached.

   ```
   # ping -w 1 google.com
   ```

   ```
   PING google.com (216.58.193.78): 56 data bytes

   --- google.com ping statistics ---
   1 packets transmitted, 0 packets received, 100% packet loss
   ```

   You can do the same to `lorem-ipsum` to demonstrate that a pod in the
   cluster is not reachable.

1. Resolve DNS of `google.com`; verify it resolves.

   ```
   # nslookup google.com
   ```

   ```
   nslookup: can't resolve '(null)': Name does not resolve

   Name:      google.com
   Address 1: 172.217.6.46 sfo03s08-in-f14.1e100.net
   Address 2: 2607:f8b0:400a:800::200e sea15s07-in-x0e.1e100.net
   ```

   DNS (UDP:53) is allowed in all namespaces.

### Allow Restricted Access

The current state of network rules for team-a is what every team will experience
going forward when a namespace is created for them. In order for team-a to allow
specific traffic, they must add `NetworkPolicy`. The diagram below demonstrates
the desired network access.

![Network Policy Restricted](/images/guides/kubernetes/container-networking/diagrams/netpol-example-restricted.png)

1. Create a network policy manifest

   ```yaml
   # lorem-netpol.yaml

   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: lorem-ipsum-netpol
     namespace: team-a
   spec:
     policyTypes:
       - Ingress
       - Egress
     podSelector:
       matchLabels:
         app: lorem-ipsum

     # allow ingress traffic from the contour/envoy pod
     ingress:
       - from:
           - namespaceSelector:
               matchLabels:
                 name: ingress
           - podSelector:
               matchLabels:
                 app: contour
         ports:
           - protocol: TCP
             port: 80

     # allow egress traffic to the echoserver pod in the team-a namespace
     egress:
       - to:
           - namespaceSelector:
               matchLabels:
                 name: team-a
           - podSelector:
               matchLabels:
                 app: echoserver
         ports:
           - port: 8080
             protocol: TCP
   ```

1. Apply the `NetworkPolicy` containing `ingress` and `egress` rules for lorem-ipsum pods.

   ```
   kubectl apply -f lorem-netpol.yaml
   ```

   This applies rules to allow ingress traffic originating from Contour pods to
   reach the lorem-ipsum pods. It also applies rules to allow egress from the
   `lorem-ipsum` pod to the `echoserver` pod. Note that the ingress rules have
   yet to be added to the `echoserver` pod. Thus when the `lorem-ipsum` pod
   attempts to connect to it, `echoserver` will not allow the traffic in.

#### Validation

1. Verify ingress is allowed to `lorem-ipsum` through Contour.

   ![Verify Ingress](/images/guides/kubernetes/container-networking/lorem-ipsum.png)

1. Verify ingress is denied to echoserver through Contour.

   ```
   curl -v 34.219.198.115:8080/echo
   ```

   ```
   *   Trying 34.219.198.115...
   * TCP_NODELAY set
   * Connected to 34.219.198.115 (34.219.198.115) port 8080 (#0)
   > GET /echo HTTP/1.1
   > Host: 34.219.198.115:8080
   > User-Agent: curl/7.54.0
   > Accept: */*
   >
   < HTTP/1.1 503 Service Unavailable
   < content-length: 57
   < content-type: text/plain
   < date: Wed, 20 Feb 2019 21:06:54 GMT
   < server: envoy
   <
   * Connection #0 to host 34.219.198.115 left intact
   ```

1. Create an echoserver network policy

   ```yaml
   # echo-netpol.yaml

   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: echoserver-netpol
     namespace: team-a
   spec:
     policyTypes:
   	- Ingress
     podSelector:
   	matchLabels:
   	  app: echoserver

     # allow ingress traffic from the contour/envoy pod
     ingress:
   	- from:
   	  - namespaceSelector:
   		  matchLabels:
   			namespace: echoserver
   	  - podSelector: {}
   ```

1. Apply the echoserver ingress `NetworkPolicy` to allow ingress from all pods in the `team-a` namespace.

   ```
   kubectl apply -f echo-netpol.yaml
   ```

   Unlike the lorem-ipsum policy, this policy allows **all** ingress traffic
   originating from pods that belong to the `team-a` namespace. Note that with
   this configuration, lorem-ipsum will be able to communicate to echoserver
   but echoserver will not be able to communicate with lorem-ipsum.

1. Attach to the lorem-ipsum pod.

   ```
   kubectl exec -n team-a -it $LOREM_POD /bin/sh
   ```

1. Verify egress is allowed to the echoserver pod.

   ```
   # curl echoserver
   ```

   ```
   Hostname: echoserver-578989d5f6-sh5f4

   Pod Information:
   -no pod information available-
   ```

1. Attach to the echoserver pod.

   ```
   kubectl exec -n team-a -it $ECHO_POD /bin/sh
   ```

1. Verify egress is denied from echoserver to lorem-ipsum.

   ```
   # wget -T 1 lorem-ipsum
   ```

   ```
   Connecting to lorem-ipsum (10.109.11.137:80)
   wget: download timed out
   ```