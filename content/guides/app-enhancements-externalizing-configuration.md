---
date: '2021-02-16'
lastmod: '2021-02-16'
parent: Application Enhancements
tags:
- Kubernetes
team:
- John Harris
title: Externalizing Configuration
oldPath: "/content/guides/kubernetes/app-enhancements-externalizing-configuration.md"
aliases:
- "/guides/kubernetes/app-enhancements-externalizing-configuration"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Application _configuration_ is anything that varies between environments. For
example, stateful applications depend on different database endpoints in testing
and production environments. A best practice in cloud-native development is to
decouple configuration from code. This means keeping database endpoints and
credentials separate from the application's source code. If your application has
environment-specific configuration hard-coded into its repository, VMware
recommends refactoring your application to decouple source code from
configuration.

## Runtime Injection

Once configuration has been decoupled from source code, configure your
application to consume it at runtime by presenting environment variables or
mounting a file in the container.

## Environment Variables

Most programming languages support reading environment variables from the local
environment. The following is an example of this in Go.

```go
package main

import "os"
import "fmt"

func main() {

    fmt.Println("DATABASE_ENDPOINT:", os.Getenv("DATABASE_ENDPOINT"))

}
```

This program produces the following output: 
```shell
$ export DATABASE_ENDPOINT=foo.example.com
$ go run environment-variables-example.go
DATABASE_ENDPOINT: foo.example.com
```

Once your application is configured to consume configuration from environment
variables, configure your container orchestrator to inject them at runtime. The
following example shows how to configure a Kubernetes pod with environment
variables.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: environment-variable-example
spec:
  containers:
  - name: test-container
    image: k8s.gcr.io/busybox
    command: [ "/bin/sh", "-c", "echo $DATABASE_ENDPOINT" ]
    env:
    - name: DATABASE_ENDPOINT
      value: "foo.example.com"
```

## Mounted Files

Another way to inject configuration is through a local file. Most programming
languages support reading from a local file. The following is an example of this
in Go.

```go
package main

import (
    "fmt"
    "io/ioutil"
    "os"
)

func main() {
    dat, err := ioutil.ReadFile("/etc/example-configuration")
    if err != nil {
        panic(e)
    }
    fmt.Print(string(dat))
}
```

This program produces the following output:

```shell
$ echo "DATABASE_ENDPOINT=foo.example.com" > /etc/example-configuration
$ go run read-file-example.go
DATABASE_ENDPOINT=foo.example.com
```

Once your application is configured to consume configuration from a local file,
configure your container orchestrator to mount it at runtime. In Kubernetes, use
a
[_ConfigMap_](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)
to mount a configuration file inside a pod. The following example shows how to
configure a Kubernetes pod with a ConfigMap mounted at `/etc/configuration`.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-configuration
  namespace: default
data:
  DATABASE_ENDPOINT: foo.example.com
---
apiVersion: v1
kind: Pod
metadata:
  name: example-configmap
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "cat /etc/configuration" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/configuration
  volumes:
    - name: config-volume
      configMap:
        name: example-configuration
  restartPolicy: Never
```

These examples cover basic use cases within the context of Kubernetes. For more
details, refer to the Kubernetes documentation on [environment
variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)
and
[ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/).

## Sensitive Information

Some configuration, such as passwords and OAuth tokens, are sensitive
information and should be handled with extra care. This section shows how to
handle sensitive information in the context of Kubernetes using
[_Secrets_](https://kubernetes.io/docs/concepts/configuration/secret/). The
biggest difference between a Secret and ConfigMap is that Secret data is stored
in `base64` encoding, whereas ConfigMap data is stored in plain text.

## Secret Creation

Create a secret using `kubectl` with the following command:
```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

This produces the following object in Kubernetes:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

## Environment Variables

Secrets may be mounted in a pod as an environment variable, just like
configuration.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-secret-environment-variable
spec:
  containers:
  - name: test-container
    image: k8s.gcr.io/busybox
    command: [ "/bin/sh", "-c", "echo $SECRET_USERNAME && echo $SECRET_PASSWORD" ]
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: database-credentials
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: database-credentials
            key: password
  restartPolicy: Never
```

## Mounted Files

Similarly, secrets may also be mounted in a pod as a file.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-secret-file
spec:
  containers:
  - name: test-container
    image: k8s.gcr.io/busybox
    command: [ "/bin/sh", "-c", "cat /etc/credentials" ]
    volumeMounts:
    - name: credential-mount
      mountPath: "/etc/credentials"
      readOnly: true
  volumes:
  - name: credential-mount
    secret:
      secretName: database-credentials
```

## Credential Managers

Your operations team may use a dedicated service to manage the lifecycle of
credentials, such as [HashiCorp's Vault](https://www.vaultproject.io).
Consequently, credentials would not be sourced from Kubernetes. Your deployment
manifest would pull application credentials using an
[_initContainer_](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/).
An `initContainer` is a job that runs in a container before your application is
deployed and uses the same underlying filesystem. This can be used to pull
credential information from outside your Kubernetes cluster and write it to a
location that will later be mounted and read by your application. The
[_vault-kubernetes-authenticator_](https://github.com/sethvargo/vault-kubernetes-authenticator)
project implements this idea by using an `initContainer` to pull credentials
from an instance of HashiCorp's Vault. Below is an example of how you can
configure your Deployment manifest with this tool to integrate your application
with Vault. This example is modified from the project's GitHub page to align
with examples in this document.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-secret-vault
spec:
  securityContext:
    runAsUser: 1001
    fsGroup: 1001
  volumes:
  - name: vault-auth
    emptyDir:
      medium: Memory
  - name: vault-secrets
    emptyDir:
      medium: Memory
  initContainers:
  - name: vault-authenticator
    image: sethvargo/vault-kubernetes-authenticator:0.2.0
    imagePullPolicy: Always
    volumeMounts:
    - name: vault-auth
      mountPath: /var/run/secrets/vaultproject.io
    env:
    - name: VAULT_ROLE
      value: myapp-role
    securityContext:
      allowPrivilegeEscalation: false
  containers:
  - name: test-container
    image: k8s.gcr.io/busybox
    command: [ "/bin/sh", "-c", "ls /home/vault && cat /var/run/secrets/vaultproject.io" ]
    volumeMounts:
    - name: vault-auth
      mountPath: /home/vault
    - name: vault-secrets
      mountPath: /var/run/secrets/vaultproject.io
    env:
    - name: HOME
      value: /home/vault
```

This manifest describes a deployment in which the `vault-authenticator`
container runs as an `initContainer`, pulls a credential from vault and writes
it to `/var/run/secrets/vaultproject.io`. The `stateful-application` container
then mounts this directory and consumes its contents for use as credentials.

## GitOps Credential Management

_GitOps_ refers to the practice of using a `git` repository as a single source
of truth for application source code and configuration. Although storing
application source code and configuration in version control is a best practice,
you should avoid storing sensitive information in version control as plain text.
Bitnami's [_Sealed Secrets_](https://github.com/bitnami-labs/sealed-secrets) and
Soluto's [_Kamus_](https://github.com/Soluto/kamus) projects are two GitOps
solutions for encrypting sensitive information, storing it in version control
and making it available to your application. The best path forward will depend
on your specific requirements. VMware recommends application developers and
platform operators work together to discuss the best solution given their
business requirements and constraints.