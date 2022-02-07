---
date: '2022-02-07'
description: Learn how to secure workload traffic in Kubernetes using mutual TLS.
title: Using mutual TLS to secure Kubernetes workload traffic
linkTitle: Securing workload traffic with mutual TLS
metaTitle: Securing workload traffic with mutual TLS
parent: Kubernetes
patterns:
- Deployment
tags:
- Kubernetes
- mutual-TLS
- mTLS
- cert-manager
- Redis
- Spring-Boot
- certificates
team:
- Dmitriy Dubson
topics:
- Kubernetes
- mutual TLS
---

The goal of this guide is to walk you through building a working implementation of Kubernetes workloads communicating
internally using mutual TLS (mTLS). The example client application and service used in this guide is meant to depict a
working instance of such an architecture, and can be applied to many other open source or proprietary services that
support traffic encryption with mTLS.

The service we will be using is Redis, and the client application will be a Spring Boot application with Spring Data
Redis library integration. In part I of this guide, we will define a Redis workload and a Spring Boot client application
workload communicating on the cluster without traffic encryption. In part II, we will update the design to include
mutual TLS, and introduce a certificate manager into our cluster that will aid the creation of required certificates for
powering encrypted traffic using mutual TLS. In part II: extended cut, we will address a potential issue with a
JVM-based CA certificate truststore that readers might find useful -- this section is optional. By the end of the guide,
you should have working knowledge and a working reference implementation of workloads communicating using mutual TLS.

This guide is written for application developers looking to add another layer of security to their Kubernetes workload
traffic using mutual TLS. Additionally, this guide also assumes you have a working knowledge of basic Kubernetes
constructs and command-line operations using `kubectl`.

## Part I: Creating workloads

To start, you will need a working a Kubernetes cluster set up locally, as this guide is for demonstration and evaluation
purposes only -- it is best to work in a sandbox. There are a few options for local Kubernetes clusters available, such
as [minikube](https://minikube.sigs.k8s.io/docs/start/), [kind](https://kind.sigs.k8s.io/docs/user/quick-start/),
or [MicroK8s](https://microk8s.io/). Any of those options set up with a single node should work just fine. I will rely
on a kind cluster for this walk-through.

To verify a working Kubernetes environment, run:

```shell
kubectl cluster-info
```

To ensure you are working in a proper sandbox, verify your current context by running:

```shell
kubectl config current-context
```

You should see a familiar sandbox environment name. Please do verify that this is the context you want to operate in.

Create an empty yaml file called `mtls-demo.yaml` -- we will use this file as one of our primary artifacts for this
guide.

We will start by creating a Kubernetes namespace for this demonstration called `mtls-demo`:

> Append this definition to the empty `mtls-demo.yaml` file

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mtls-demo
```

```shell
kubectl apply -f mtls-demo.yaml
```

Next, we will create a basic Redis server Kubernetes deployment and service within the cluster with the following
definition

> Append this definition to `mtls-demo.yaml` file

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: mtls-demo
  name: redis-server
spec:
  replicas: 1
  selector:
    matchLabels:
      name: redis-server
  template:
    metadata:
      labels:
        name: redis-server
    spec:
      containers:
        - name: redis-server
          image: bitnami/redis:6.2.6
          ports:
            - containerPort: 6379
          env:
            - name: ALLOW_EMPTY_PASSWORD
              value: "yes"
---
apiVersion: v1
kind: Service
metadata:
  name: redis-server
  namespace: mtls-demo
spec:
  ports:
    - port: 6379
      targetPort: 6379
  selector:
    name: redis-server
```

```shell
kubectl apply -f mtls-demo.yaml
```

By default, Redis server does not enable TLS support, and part of the goal is to enable this support in future steps.
For now, we want to get a Redis server running and accessible within the cluster. We explicitly disable password support
in Redis for this demonstration to allow us to focus on enabling TLS support -- please refer to official Redis
guidelines as to the usage of proper password protection.

If all reconciles successfully, we should now have a Redis server running in the cluster. To verify that we can
communicate with the Redis server, we can run:

```shell
kubectl exec deployment/redis-server -n mtls-demo -- redis-cli ping
```

You should see "PONG" as a response. This is Redis' response for a "ping" message which acts as an establishing
dial-tone.

---

Next, we move on to creating a client application that will connect to our Redis instance. For this step, you will use a
sample Spring Boot application with a Spring Data Redis library integration. The Docker image for the application is
built with the help of Spring Boot Gradle plugins' `bootBuildImage` task which relies
on [Cloud Native Buildpacks](https://buildpacks.io/).

You can review the [code for this sample application here](https://github.com/ddubson/spring-boot-redis-mtls-demo).

The re-usable Docker image is published
on [Docker Hub](https://hub.docker.com/repository/docker/ddubson/spring-boot-redis-mtls-demo) with name and
tag `ddubson/spring-boot-redis-mtls-demo:basic`.

We will now create a client application Deployment using the client application Docker image.

> Append this definition to `mtls-demo.yaml` file

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: spring-boot-redis-client-app
  name: spring-boot-redis-client-app
  namespace: mtls-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spring-boot-redis-client-app
  template:
    metadata:
      labels:
        app: spring-boot-redis-client-app
    spec:
      containers:
        - image: ddubson/spring-boot-redis-mtls-demo:basic
          name: spring-boot-redis-client-app
          env:
            - name: SPRING_REDIS_HOST
              value: "redis-server"
            - name: SPRING_REDIS_PORT
              value: "6379"
          ports:
            - containerPort: 8080
              name: app-port
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: spring-boot-redis-client-app
  name: spring-boot-redis-client-app
  namespace: mtls-demo
spec:
  ports:
    - name: service-port
      port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    app: spring-boot-redis-client-app
  type: ClusterIP
```

```shell
kubectl apply -f mtls-demo.yaml
```

The above Deployment definition of a Spring Boot client application relies on Redis Service resource being available on
the cluster at host address `redis-server` on port `6379`. TLS support is not yet enabled, and so the definition does
not have any configuration besides host and port of the Redis server.

The application is configured with a liveness and readiness probe, so if it reconciles successfully, then we know it has
connected to Redis successfully. However, for extra verification, the client application comes with an API endpoint that
can be queried, which specifically interacts with Redis:

```shell
kubectl port-forward svc/spring-boot-redis-client-app 8080:8080 -n mtls-demo

# In another terminal window/tab
curl -XGET http://localhost:8080/

# You should receive a random UUID string as a response.
```

> You can now stop port forwarding and proceed to the next steps.

The client application is able to interact with Redis in the cluster using an unencrypted connection. We can now focus
on securing the traffic between Redis and the client application using mutual TLS.

> Find the full `mtls-demo.yaml` up to this point for [reference here](https://github.com/ddubson/spring-boot-redis-mtls-demo/blob/main/mtls-demo-partI.yaml).

---

## Part II: Enabling mTLS

The mutual TLS (mTLS) scheme requires the use of digital certificates, and so the first step we have to take is to
ensure our cluster has an entity in charge of managing certificates. We will be relying on [**
cert-manager**](https://cert-manager.io/), a CNCF member project and, currently, one of the most popular certificate
management projects for Kubernetes.

As of this writing, the latest cert-manager version is `1.6.1` and so we will follow the installation process for this
version as outlined in [cert-manager install docs](https://cert-manager.io/docs/installation/):

```shell
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.6.1/cert-manager.yaml
```

To verify that cert-manager is installed and operational, run:

```shell
kubectl rollout status deployment/cert-manager -n cert-manager 
# cert-manager should be successfully rolled out
```

Once cert-manager is installed and operational on the cluster, we move on to the next step of defining the required
components for mTLS.

We will be focusing on creating components required for private Public Key Infrastructure (PKI). In this case, "private"
refers to components within an internal or non-public system interacting over encrypted channels using public/private
keys and digital certificates. Our client application and internal Redis server can be thought of as "private", the
traffic between them never leaves the boundaries of the cluster.

For mutual TLS between server and client, we will be required to provide our components certificates. Specifically, we
will need a server certificate, client certificate, and Certificate Authority (CA) certificate. The certificates and the
authorities issuing those certificates within a Kubernetes cluster will be managed by cert-manager, and the final
certificate chain will look like the following:

![Issuer and certificate chain](./images/cert-chain.png)

The "leaf" certificates are server and client certificates. The server certificate will be provided to Redis, and the
client certificate to our client application.

Here is what the final arrangement shall look like:

![Server and client certificate architecture](./images/server-and-client-cert-arch.png)

We start with creating our first cert-manager `Issuer` custom resource. An `Issuer` is responsible for handling the
process of requesting and subsequently issuing certificates to interested parties. The first `Issuer` we will create is
going to be responsible for issuing a root certificate. A root certificate will act as the trusted certificate
authority (CA) certificate within the mTLS scheme.

> IMPORTANT: Add this definition right after the `mtls-demo` namespace definition in `mtls-demo.yaml`

```yaml
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: bootstrap-issuer
  namespace: mtls-demo
spec:
  selfSigned: { }
```

```shell
kubectl apply -f mtls-demo.yaml

# Verify that the Issuer is ready for use
kubectl wait --for=condition=Ready=True issuer bootstrap-issuer -n mtls-demo
# You should receive "condition met" message
```

The type of `Issuer` is [`SelfSigned`](https://cert-manager.io/docs/configuration/selfsigned/) for this demonstration,
but this can be changed to other cert-manager supported types such
as [`CA` Issuer](https://cert-manager.io/docs/configuration/ca/) for production purposes.

Next, we define the root `Certificate` for our namespace, which all components will rely on as the trusted root
certificate:

> Add this definition right after the bootstrap Issuer in `mtls-demo.yaml`

```yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: root-certificate
  namespace: mtls-demo
spec:
  isCA: true
  secretName: root-certificate
  commonName: "Root Certificate"
  privateKey:
    algorithm: RSA
    size: 4096
    encoding: PKCS8
  issuerRef:
    name: bootstrap-issuer
    kind: Issuer
```

```shell
kubectl apply -f mtls-demo.yaml

# Verify that the Certificate has been issued
kubectl wait --for=condition=Ready=True cert root-certificate -n mtls-demo
# You should receive "condition met" message
```

Observe that the `Issuer` for this certificate is the bootstrap `Issuer` from the previous step. Without the
initial `Issuer`, there would be no one to issue the root certificate.

We are now able to define the root `Issuer` (not to be confused with our bootstrapping `Issuer`). The root `Issuer` will
be responsible for issuing certificates geared towards server or client uses.

> Add this definition right after the root `Certificate` definition in `mtls-demo.yaml`

```yaml
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: root-issuer
  namespace: mtls-demo
spec:
  ca:
    secretName: root-certificate
```

```shell
kubectl apply -f mtls-demo.yaml

# Verify that the Issuer is ready for use
kubectl wait --for=condition=Ready=True issuer root-issuer -n mtls-demo
# You should receive "condition met" message
```

For the mutual TLS scheme to work, parties seeking to communicate require two certificates. The providing service (i.e.
Redis) needs a "server certificate", whereas all the clients of the service (i.e. Spring Boot app) will need a "client
certificate". Let us define both types of certificates for this purpose.

To start, we will define a server certificate. TLS support in Redis (and in most other services) is predicated upon
launching the service with a digital certificate (`.crt` file), private key (`.key` file), and CA certificate (`.crt`
file) provided. Check out [Redis TLS support documentation](https://redis.io/topics/encryption) for details.

> Add this definition right after the root `Issuer` definition in `mtls-demo.yaml`

```yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: redis-server-certificate
  namespace: mtls-demo
spec:
  secretName: redis-server-certificate
  privateKey:
    algorithm: RSA
    encoding: PKCS8
    size: 4096
  commonName: "redis demo"
  usages:
    - server auth
    - key encipherment
    - digital signature
  issuerRef:
    name: root-issuer
    kind: Issuer
```

```shell
kubectl apply -f mtls-demo.yaml

# Verify that the Certificate has been issued
kubectl wait --for=condition=Ready=True cert redis-server-certificate -n mtls-demo
# You should receive "condition met" message
```

We have successfully obtained a server certificate for Redis, and now can move on to creating a client certificate for
use by Redis clients.

> Add this definition right after server certificate definition `mtls-demo.yaml`

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: redis-client-certificate-keystore-password
  namespace: mtls-demo
data:
  password: cGFzc3dvcmQxMjM= # "password123"  
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: redis-client-certificate
  namespace: mtls-demo
spec:
  secretName: redis-client-certificate
  privateKey:
    algorithm: RSA
    encoding: PKCS8
    size: 4096
  commonName: "redis demo"
  usages:
    - client auth
    - key encipherment
    - digital signature
  issuerRef:
    name: root-issuer
    kind: Issuer
  keystores:
    pkcs12:
      create: true
      passwordSecretRef:
        name: redis-client-certificate-keystore-password
        key: password
```

```shell
kubectl apply -f mtls-demo.yaml

# Verify that the Certificate has been issued
kubectl wait --for=condition=Ready=True cert redis-client-certificate -n mtls-demo
# You should receive "condition met" message
```

We have now obtained a client certificate to be used with any given Redis client that is TLS-enabled. Above, we define a
Secret resource containing a password for the PKCS#12 keystore and truststore that cert-manager will create as part of
its Certificate issuance process. We need a PKCS#12 keystore and truststore in our case since our client is JVM based,
and the certificate for the client and the CA certificate will be enclosed within these stores and used by the JVM at
runtime. Keystores contain private certificates and truststores contain publicly available certificates like CA
certificates.

We are now ready to enable TLS support in Redis server. Let us revisit the Deployment definition of Redis server.
According to [Redis documentation on TLS support](https://redis.io/topics/encryption), we must tell Redis that TLS is
enabled, and provide the server certificate, the server private key, and the CA certificate.

As an example, Redis may be started in TLS mode over the command line:

```shell
# The certificate, key, and CA cert specified below is an example, we do not have these files locally
redis-server --tls-port 6379 --port 0 \
    --tls-cert-file ./redis.crt \
    --tls-key-file ./redis.key \
    --tls-ca-cert-file ./ca.crt
```

Now we will translate this example in Deployment definition terms.

> Replace the existing definition of `redis-server` Deployment in `mtls-demo.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: mtls-demo
  name: redis-server
spec:
  replicas: 1
  selector:
    matchLabels:
      name: redis-server
  template:
    metadata:
      labels:
        name: redis-server
    spec:
      volumes:
        - name: certs
          secret:
            secretName: redis-server-certificate
      containers:
        - name: redis-server
          image: bitnami/redis:6.2.6
          ports:
            - containerPort: 6379
          volumeMounts:
            - mountPath: /certs
              name: certs
          env:
            - name: ALLOW_EMPTY_PASSWORD
              value: "yes"
            - name: REDIS_TLS_ENABLED
              value: "yes"
            - name: REDIS_TLS_PORT
              value: "6379"
            - name: REDIS_TLS_CERT_FILE
              value: "/certs/tls.crt"
            - name: REDIS_TLS_KEY_FILE
              value: "/certs/tls.key"
            - name: REDIS_TLS_CA_FILE
              value: "/certs/ca.crt"
```

```shell
kubectl apply -f mtls-demo.yaml
```

We mount a server certificate Secret resource as a Volume onto the Redis Pod, and place it into `/certs` directory on
the Pod. The Secret resource is a reference to the Redis server certificate and contains the following
files: `tls.crt` (the server certificate), `tls.key` (the private key), and `ca.crt` (the CA certificate). All files
from the Secret are placed into the `/certs` directory.

We define a few environment variables for the container which direct Redis to look for the server certificate files at
the appropriate locations.

Redis should now be started in TLS mode, and we can check that by running a command we ran previously:

```shell
kubectl exec deployment/redis-server -n mtls-demo -- redis-cli ping
```

You should see the following message: `Error: Connection reset by peer`. The connection cannot be established to Redis
and this is correct -- we now need the client certificate on the client end (in this case, `redis-cli`) to be able to
properly establish a TLS connection. Establishing a connection using `redis-cli` to a TLS-enabled Redis server is an
exercise left to the reader since our focus is on enabling a client Spring Boot application instead.

We now move on to enabling our Spring Boot Redis client application to connect to TLS-enabled Redis.

We will replace the existing Deployment definition of the Spring Boot Redis client application to insert the Redis
client certificate that was issued in a previous step. Additionally, we create a Secret resource to capture Java VM
options which will modify the loaded certificates within the runtime, more on this below.

> Replace the existing definition of `spring-boot-redis-client-app` Deployment in `mtls-demo.yaml`
> Add `spring-boot-redis-client-app-java-opts` Secret before the Deployment.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: spring-boot-redis-client-app-java-opts
  namespace: mtls-demo
stringData:
  JAVA_OPTS: >-
    -Djavax.net.ssl.keyStoreType=PKCS12
    -Djavax.net.ssl.keyStore=/certs/keystore.p12
    -Djavax.net.ssl.keyStorePassword=password123
    -Djavax.net.ssl.trustStoreType=PKCS12
    -Djavax.net.ssl.trustStore=/certs/truststore.p12
    -Djavax.net.ssl.trustStorePassword=password123
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: spring-boot-redis-client-app
  name: spring-boot-redis-client-app
  namespace: mtls-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spring-boot-redis-client-app
  template:
    metadata:
      labels:
        app: spring-boot-redis-client-app
    spec:
      volumes:
        - name: client-certificate
          secret:
            secretName: redis-client-certificate
      containers:
        - image: ddubson/spring-boot-redis-mtls-demo:basic
          name: spring-boot-redis-client-app
          volumeMounts:
            - mountPath: /certs
              name: client-certificate
          env:
            - name: SPRING_REDIS_HOST
              value: "redis-server"
            - name: SPRING_REDIS_PORT
              value: "6379"
            - name: SPRING_REDIS_SSL
              value: "true"
          envFrom:
            - secretRef:
                name: spring-boot-redis-client-app-java-opts
          ports:
            - containerPort: 8080
              name: app-port
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
```

```shell
kubectl apply -f mtls-demo.yaml
```

We mount the Redis client certificate Secret resource as a Volume onto the application Pod, and specify the path
as `/certs`. We notify Spring Data Redis library via configuration environment variable `SPRING_REDIS_SSL` that Redis is
accepting TLS connections. The key part of introducing the Redis client certificate and CA certificate into the
application's JVM is the injection of the `spring-boot-redis-client-app-java-opts` Secret as a set of environment
variables containing a single `JAVA_OPTS`
environment variable, which allows us to define VM options for the JVM. There we
specify [Java Secure Socket Extension (JSSE)](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html)
environment variables: `javax.net.ssl.keyStore` is the container for private certificates - it contains the Redis client
certificate (`tls.crt`); the `javax.net.ssl.trustStore` is the container for public certificates - it contains the CA
certificate (`ca.crt` - our root certificate).

> Refer to [Java Secure Socket Extension (JSSE) Reference Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html#CustomizingStores)
> on more about keystores and truststores.

cert-manager is able to create these keystore and truststore files on the fly as part of its Certificate issuance
process, so we get it out of the box. Keystore and truststore passwords are in plain text -- obfuscating the password is
out-of-scope for this guide but is highly suggested for production definitions. The password referred to in plain text
is and must be the same as the contents of the Secret `redis-client-certificate-keystore-password`.

Verify that the application has now connected to a TLS-enabled Redis server:

```shell
kubectl port-forward svc/spring-boot-redis-client-app 8080:8080 -n mtls-demo

# In another terminal window/tab
curl -XGET http://localhost:8080/

# You should receive a random UUID string as a response.
```

> You can now stop port forwarding and proceed to the next steps.

> ⚠️ Warning
>
> Caveat to be aware of is when you specify an explicit truststore via VM option and pass it to the JVM, it *overrides*
> the default truststore! This can become a problem in cases where you need all the CA certificates from the default
> truststore (usually located in `$JAVA_HOME/lib/security/cacerts`) AND a custom CA certificate truststore that is
> dynamically issued by cert-manager. Read the **Part II Extended Cut: Managing CA certificates using Service Bindings**
> section for more information.

Congratulations! We have now been able to ensure that the traffic within the cluster between Redis and our client
application relies on TLS and is encrypted.

Skip to [Finale](#finale) if you are not interested in the next optional section on CA certificates and JVM truststores.

## Part II Extended Cut: Managing CA certificates using Service Bindings

> You may skip this section if your client application is not Spring Boot or Docker image built with
> Cloud Native Buildpacks

We got our client application communicating with Redis using mutual TLS scheme in the cluster - Excellent!

This is an extra section specifically meant to address the issue of overriding the default JVM truststore in the Spring
Boot client application, built with Cloud Native Buildpacks.

To gracefully add the Redis client CA certificate to the existing default JVM truststore of Cloud Native Buildpack-built
image, we create a [runtime Service Binding](https://paketo.io/docs/howto/configuration/#what-is-a-binding) within the
container and populate it with our CA certificate. Here is what the design of our solution looks like:

![service binding design](./images/service-binding-design.png)

> Replace the existing definition of `spring-boot-redis-client-app` Deployment in `mtls-demo.yaml`.
> Add `cacert-service-binding-type` ConfigMap and modify existing `spring-boot-redis-client-app-java-opts` Secret.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cacert-service-binding-type
  namespace: mtls-demo
data:
  type: "ca-certificates"
---
apiVersion: v1
kind: Secret
metadata:
  name: spring-boot-redis-client-app-java-opts
  namespace: mtls-demo
stringData:
  JAVA_OPTS: >-
    -Djavax.net.ssl.keyStoreType=PKCS12
    -Djavax.net.ssl.keyStore=/certs/keystore.p12
    -Djavax.net.ssl.keyStorePassword=password123
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: spring-boot-redis-client-app
  name: spring-boot-redis-client-app
  namespace: mtls-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spring-boot-redis-client-app
  template:
    metadata:
      labels:
        app: spring-boot-redis-client-app
    spec:
      volumes:
        - name: client-certificate
          secret:
            secretName: redis-client-certificate
        - name: cacert-service-binding
          projected:
            sources:
              - configMap:
                  name: cacert-service-binding-type
              - secret:
                  name: redis-client-certificate
                  items:
                    - key: ca.crt
                      path: ca.crt
      containers:
        - image: ddubson/spring-boot-redis-mtls-demo:basic
          name: spring-boot-redis-client-app
          volumeMounts:
            - mountPath: /certs
              name: client-certificate
            - mountPath: /bindings/cacert-service-binding
              name: cacert-service-binding
          env:
            - name: SERVICE_BINDING_ROOT
              value: "/bindings"
            - name: SPRING_REDIS_HOST
              value: "redis-server"
            - name: SPRING_REDIS_PORT
              value: "6379"
            - name: SPRING_REDIS_SSL
              value: "true"
          envFrom:
            - secretRef:
                name: spring-boot-redis-client-app-java-opts
          ports:
            - containerPort: 8080
              name: app-port
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: app-port
```

```shell
kubectl apply -f mtls-demo.yaml
```

We explicitly remove any VM options previously set regarding the truststore in
the `spring-boot-redis-client-app-java-opts` Secret resource, which will now be loaded in a different fashion using a
Service Binding and a projected Volume.

A [Service Binding](https://paketo.io/docs/howto/configuration/#what-is-a-binding) is a structured folder mounted as a
Volume in the client application Pod. In our case, it contains a file called `type` with literal text `ca-certificates`
as we are using a CA certificates Service Binding type, and the certificate file itself (i.e. `ca.crt`). We create
a `SERVICE_BINDING_ROOT` environment variable where we define the root directory of all bindings. In our case, it is set
to `/bindings` directory in the container.

We use a [Projected Volume](https://kubernetes.io/docs/concepts/storage/projected-volumes/) to gather the required files
into a directory structure with required files. We have created a `ConfigMap` to store a key `type` with
value `ca-certificates`, which we define in the projected volume as one of the sources. We have also taken the `ca.crt`
file from `redis-client-certificate` and used it as a second source for the projected volume. Together, these files
represent a single entity which we can now mount into the client application container.

Here is what our set of Service Bindings looks like as a file tree in the container:

```text
/bindings
   /cacert-service-binding
      ca.crt
      type
```

We only create one binding for this demonstration with the name of `cacert-service-binding`. The Service Binding
mechanism of the Spring Boot image we are using is able to automatically register the `ca-certificates` binding and load
the CA certificate into the default JVM truststore.

To verify that the Service Binding mechanism worked, run:

```shell
kubectl logs deploy/spring-boot-redis-client-app -n mtls-demo | head -n1

# Observe that the line in the log reads:
# "Added 1 additional CA certificate(s) to system truststore"

kubectl port-forward svc/spring-boot-redis-client-app 8080:8080 -n mtls-demo

# In another terminal window/tab
curl -XGET http://localhost:8080/

# You should receive a random UUID string as a response.
```

> You can now stop port forwarding.

This verifies that the Redis client certificate was loaded into the JVM truststore, and you are able to once again
communicate with Redis over a TLS connection.

---

## Finale

Hope this guide was helpful for your needs, and you can find the complete Kubernetes resource definitions for each part
here:

- [Part I](https://github.com/ddubson/spring-boot-redis-mtls-demo/blob/main/mtls-demo-partI.yaml)
- [Part II](https://github.com/ddubson/spring-boot-redis-mtls-demo/blob/main/mtls-demo-partI.yaml) (requires
  cert-manager pre-installed)
- [Part II Extended Cut](https://github.com/ddubson/spring-boot-redis-mtls-demo/blob/main/mtls-demo-partII-extended.yaml) (
  requires cert-manager pre-installed)

Finally, do not forget to clean up your cluster, run:

```shell
kubectl delete namespace mtls-demo
kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/v1.6.1/cert-manager.yaml
```

This will remove all deployments, services, and other configurations specific to the `mtls-demo` namespace as well as
the cert-manager installation from the cluster.
