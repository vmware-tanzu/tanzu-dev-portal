---
date: '2021-08-06'
description: Install Concourse CI workers onto remote Kubernetes clusters.
lastmod: '2021-08-06'
linkTitle: Concourse CI Remote Workers
metaTitle: Concourse CI Remote Workers
parent: Concourse CI
patterns:
- Deployment
tags:
- CI-CD
- Concourse
- Kubernetes
team:
- Luke Short
title: Deploying Remote Concourse CI Workers
oldPath: "/content/guides/ci-cd/concourse-remote-workers.md"
aliases:
- "/guides/ci-cd/concourse-remote-workers"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

There are many use-cases for having remote Concourse worker hosts deployed across different sites. This fits into the hybrid cloud model, helps to distribute resources, and can be used for failover scenarios. This guide walks through setting up local and remote worker hosts in a Concourse cluster that is deployed on Kubernetes.

The first step is to create a new Concourse CI cluster with at least the web hosts. The full Helm chart values.yaml can be found [here](https://github.com/concourse/concourse-chart/blob/master/values.yaml).

Generate the [required SSH keys](https://concourse-ci.org/concourse-generate-key.html) for production use. The upcoming examples will assume these have been generated. For testing purposes, this can be skipped as the Helm chart provides default public and private SSH keys.

```bash
$ ssh-keygen -t rsa -b 4096 -m PEM -f ./concourse_sessionSigningKey
$ ssh-keygen -t rsa -b 4096 -m PEM -f ./concourse_hostKey
$ ssh-keygen -t rsa -b 4096 -m PEM -f ./concourse_workerKey
$ ls -1
concourse_hostKey
concourse_hostKey.pub
concourse_sessionSigningKey
concourse_sessionSigningKey.pub
concourse_workerKey
concourse_workerKey.pub
```

If no local worker hosts are required, set `worker.enabled: false`. In the example below, they are enabled. For the Secrets, define all of the required values for SSH keys (`secrets.hostKeyPub`, `secrets.hostKey`, `secrets.sessionSigningKey`, `secrets.workerKeyPub`, and `secrets.workerKey`). This will allow cross-communication between web and worker hosts.

```yaml
---
# values.yaml file.
concourse:
  web:
    # Define the URL to use for Concourse.
    # Use "http://" for simplified testing purposes.
    # This needs to use the domain defined in "web.ingress.hosts".
    externalUrl: http://concourse.example.com
    auth:
      mainTeam:
        # The default user to create.
        localUser: admin
# Automatically create Secret objects for the default user account and SSH keys.
secrets:
  # Define the password for the "admin" user as "password123".
  localUsers: admin:password123
  # Public and private SSH keys for the web hosts.
  hostKeyPub: |-
    ssh-rsa <OMITTED>
  hostKey: |-
    -----BEGIN RSA PRIVATE KEY-----
    <OMITTED>
    -----END RSA PRIVATE KEY----
  # Private SSH key for the web hosts to securely sign HTTP session tokens.
  # No public key is required.
  sessionSigningKey: |-
    -----BEGIN RSA PRIVATE KEY-----
    <OMITTED>
    -----END RSA PRIVATE KEY----
  # Public and private SSH keys for the worker hosts.
  workerKeyPub: |-
    ssh-rsa <OMITTED>
  workerKey: |-
    -----BEGIN RSA PRIVATE KEY-----
    <OMITTED>
    -----END RSA PRIVATE KEY----
web:
  service:
    workerGateway:
      type: NodePort
      # The web hosts port to use for remote worker hosts to SSH into.
      NodePort: 32222
  ingress:
    enabled: true
    hosts:
      # Define the domain name for Concourse.
      # This needs to match what is defined for 'concourse.web.externalURL'.
      - concourse.example.com
# Disable PersistentVolumeClaims for testing purposes.
persistence:
  enabled: false
postgresql:
  persistence:
    enabled: false
```

```bash
$ helm install -f values.yaml --namespace concourse --create-namespace concourse concourse/concourse
```

Find the Ingress external IP address that is in use. A valid DNS A record needs to be setup for the domain used which is `concourse.example.com` in our example.

```bash
$ kubectl get ingress --namespace concourse
```

Login into `http://concourse.example.com` with the username `admin` and password `password123` to verify it is up and functional.

Switch Kubernetes context to a different/remote cluster.

```bash
$ kubectl config get-contexts
$ kubectl config set-context <CONTEXT>
```

Disable components that are not required for a workers-only deployment with `web.enabled: false` and `postgresql.enabled: false`. For the Secrets, only define `secrets.hostKeyPub` and `secrets.workerKey` (do not define `secrets.hostKey`, `secrets.sessionSigningKey`, or  `secrets.workerKeyPub`). The remote worker hosts will SSH into the web hosts to add themselves to the cluster. Along with this, a SSH tunnel back from the web to remote worker hosts is created. This way, the web hosts can delegate pipelines to the hosts.

```yaml
---
# values-remote.yaml file.
# Disable the web and PostgreSQL components
# since this is a workers-only deployment.
web:
  enabled: false
postgresql:
  enabled: false
# Automatically create Secret objects for the SSH keys.
secrets:
  create: true
concourse:
  worker:
    tsa:
      hosts:
        # This needs to be the same domain and NodePort used for the original Concourse deployment.
        # The worker hosts will SSH into original deployment to add itself to the Concourse cluster.
        - concourse.exampe.com:32222
    # This tag is used in Concourse pipelines for running on specified work hosts.
    tag: remote_worker
    env:
      # The networking values can be changed to anything.
      # All traffic will be tunneled by the Kubernetes CNI plugin.
      - name: CONCOURSE_GARDEN_NETWORK_POOL
        value: "10.254.0.0/16"
      - name: CONCOURSE_GARDEN_DENY_NETWORK
        value: "169.254.169.254/32"
      - name: CONCOURSE_GARDEN_MAX_CONTAINERS
        value: "50"
secrets:
  hostKeyPub: |-
    ssh-rsa <OMITTED>
  workerKey: |-
    -----BEGIN RSA PRIVATE KEY-----
    <OMITTED>
    -----END RSA PRIVATE KEY----
# Disable PersistentVolumeClaims for testing purposes.
persistence:
  enabled: false
```

Deploy a remote worker in a different namespace. The remote worker hosts listen on a non-standard SSH port 2222/TCP. The remote workers need to allow the web hosts via providing their public SSH key.

```bash
$ helm install -f values-remote.yaml --namespace concourse-remote --create-namespace concourse concourse/concourse
```

Log into the Concourse web dashboard by going to ``http://concourse.example.com``. Then download the `fly` binary for the operating system of the workstation.

Verify that the local and remote worker hosts are being listed.

```bash
$ fly login --insecure -c http://concourse.example.com -u admin -p password123 -t concourse
$ fly -t concourse workers
name                       containers  platform  tags           team  state    version  age
concourse-remote-worker-0  0           linux     remote_worker  none  running  2.3      4m16s
concourse-remote-worker-1  0           linux     remote_worker  none  running  2.3      4m14s
concourse-worker-0         0           linux     none           none  running  2.3      7m21s
concourse-worker-1         0           linux     none           none  running  2.3      7m21s
```

Run a demo pipeline that only runs on the remote workers. It has two jobs: one to record the time and the second to read the time. Notice how the pipeline has various places where a list of `tags` associated with worker hosts need to be specified. The pipeline will run on any worker host matching at least one of the tags. Without these tags, the pipeline could be scheduled on any worker host in the Concourse cluster.

```bash
$ cat <<EOF > /tmp/hello-world-remote-pipeline.yaml
resources:
- name: time
  tags:
  - remote_worker
  type: time
  source:
    location: America/Denver
    interval: 60s
jobs:
- name: sli-test
  serial: true
  build_log_retention:
    builds: 100
  plan:
  - get: time
    tags:
    - remote_worker
    trigger: true
  - task: thing-one
    tags:
    - remote_worker
    config:
      platform: linux
      image_resource:
        type: registry-image
        source:
          repository: alpine
      inputs:
      - name: time
      outputs:
      - name: some-output
      run:
        path: sh
        args:
        - -ec
        - |
          echo "hello-world" > some-output/hi-everybody.txt
          echo ""
          [ -f time/input ] && echo "Time is reporting"
  - task: thing-two
    tags:
    - remote_worker
    config:
      platform: linux
      image_resource:
        type: registry-image
        source:
          repository: alpine
      inputs:
      - name: some-output
      run:
        path: sh
        args:
        - -ec
        - |
          cat some-output/hi-everybody.txt
EOF
```

```bash
$ fly -t concourse set-pipeline -p hello-world-remote -c /tmp/hello-world-remote-pipeline.yaml
$ fly -t concourse unpause-pipeline -p /tmp/hello-world-remote
```

Find the latest build for one of the pipeline tasks.

```bash
$ fly -t concourse builds | grep "hello-world-remote" | head -n 1
2427  hello-world-remote/sli-test/13  succeeded  2021-08-04@13:03:14-0600  2021-08-04@13:03:31-0600  17s  main  system
```

Verify that it is only running on the remote worker hosts.

```bash
$ fly -t concourse watch --job hello-world-remote/sli-test --build 13 | grep "selected worker:"
selected worker: concourse-remote-worker-0
selected worker: concourse-remote-worker-0
selected worker: concourse-remote-worker-1
selected worker: concourse-remote-worker-0
selected worker: concourse-remote-worker-1
selected worker: concourse-remote-worker-0
```
