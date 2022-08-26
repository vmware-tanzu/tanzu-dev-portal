---
date: 2022-08-16
description: In this blog, we'll demonstrate how VMware Tanzu Data Service Postgres for Kubernetes installed in Cluster 1 can be consumed by VMware Tanzu Application Platform Services Toolkit via secret, as well as facilitate workload deployment in Cluster 2.
lastmod: '2022-08-16'
team:
- Vasanth Desikan
title: Consuming VMware Tanzu Data Service Postgres for Kubernetes Using Tanzu Application Platform Services Toolkit
---

In this blog, we'll demonstrate how VMware Tanzu Data Service Postgres for Kubernetes installed in Cluster 1 can be consumed by VMware Tanzu Application Platform Services Toolkit via secret, as well as facilitate workload deployment in Cluster 2.


## Prerequisites



* Two VMware Tanzu Kubernetes Grid 1.5.4 Workload Clusters on vSphere (Cluster 1 will have Tanzu Data Service Postgres for Kubernetes v1.8 installed. Cluster 2 will have Tanzu Application Platform’s full profile installed.)
* Access to VMware Tanzu Network
* Docker running on a local machine/client
* Tanzu command line interface
* kubectl
* Helm v3
* Tanzu Application Platform 1.2.0


## Installing Tanzu Data Service


### Install Postgres operator on Cluster 1



1. Create a namespace `cert-manager` and install `cert-manager`.

```bash
~$ kubectl create ns cert-manager
~$ tanzu package install cert-manager -p cert-manager.tanzu.vmware.com.1.5.3+vmware.2-tkg.1  -n cert-manager
```


2. Log in to network.tanzu.vmware.com via Helm.

```bash
~$ export HELM_EXPERIMENTAL_OCI=1
~$ helm registry login registry.tanzu.vmware.com
```


3. Pull the Helm chart and images to a local docker registry and export the artifacts into a local test management protocol directory.

```bash
~$ helm chart pull registry.tanzu.vmware.com/tanzu-sql-postgres/postgres-operator-chart:v1.8.0
~$ mkdir tmp
~$ helm chart export registry.tanzu.vmware.com/tanzu-sql-postgres/postgres-operator-chart:v1.8.0  --destination=tmp
```

4. Create a namespace and set your kubectl context to the newly created namespace.

```bash
kubectl create namespace tanzu-postgres-for-kubernetes-system
kubectl config set-context --current --namespace=tanzu-postgres-for-kubernetes-system
```

5. Create a Kubernetes secret for accessing the registry containing the Tanzu MySQL images.

```bash
kubectl create secret docker-registry regsecret \
    --docker-server=https://registry.tanzu.vmware.com/ \
    --docker-username=$USERNAME \
    --docker-password=$PASSWORD -n tanzu-postgres-for-kubernetes-system
```

6. Install Postgres operator.

```bash
helm install --wait my-postgres-operator tmp/postgres-operator/
```

7. Ensure that the operator is running correctly.

```bash
~$ kubectl get all

NAME                                    READY   STATUS    RESTARTS   AGE
pod/postgres-operator-98565cb59-4f4z4   1/1     Running   0          58s

NAME                                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/postgres-operator-webhook-service   ClusterIP   100.68.36.166   &lt;none>        443/TCP   58s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/postgres-operator   1/1     1            1           58s

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/postgres-operator-98565cb59   1         1         1       58s
```

### Create and access Postgres instance on Cluster 1



1. Download postgres-for-kubernetes-v1.3.0.tar.gz from Tanzu Network and extract it.

```bash
~$ pivnet download-product-files --product-slug='tanzu-sql-postgres' --release-version='1.8.0' --product-file-id=1260935
~$ tar -xvf postgres-for-kubernetes-v1.8.0.tar.gz
```

2. Create a namespace and set your kubectl context to the newly created namespace.

```bash
~$ kubectl create namespace postgres-tap
~$ kubectl config set-context --current --namespace=postgres-ta
```

3. Create a Kubernetes secret for accessing the registry containing the Tanzu Postgres images.

```bash
~$ kubectl create secret --namespace=postgres-tap \
 docker-registry regsecret  \
 --docker-server=https://registry.tanzu.vmware.com/ \
 --docker-username=$USERNAME  \
 --docker-password=$PASSWORD
```

4. Create a copy of the postgres.yaml file and give it a unique name.

```bash
cp postgres-for-kubernetes-v1.8.0/samples/postgres.yaml postgresdb.yaml
```

5. Make modifications to the file according to the configuration required. In this example we've enabled high availability configuration and modified service of type to `LoadBalancer`. Note that the StorageClass has also been modified per the one available in the cluster and with the default storage size.

```bash
~$ kubectl get storageclass

NAME                PROVISIONER              RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
default (default)   csi.vsphere.vmware.com   Delete          Immediate           true                   4d2h

$ cat postgresdb.yaml 

---
apiVersion: sql.tanzu.vmware.com/v1
kind: Postgres
metadata:
  name: postgres-sample
spec:
  #
  # Global features
  #
  pgConfig:
    dbname: postgres-sample
    username: pgadmin
    appUser: pgappuser
  postgresVersion:
    name: postgres-14 # View available versions with `kubectl get postgresversion`
  serviceType: LoadBalancer
#  serviceAnnotations:
  seccompProfile:
    type: RuntimeDefault
  imagePullSecret:
    name: regsecret
  highAvailability:
    enabled: true
#  logLevel: Debug
#  backupLocation:
#    name: backuplocation-sample
#  certificateSecretName:
#  deploymentOptions:
#    continuousRestoreTarget: true
#    sourceStanzaName: <sample-stanza-from-prod-instance>
 
  #
  # Data Pod features
  #
  storageClassName: default
  storageSize: 10G
  dataPodConfig:
#    tolerations:
#      - key:
#        operator:
#        value:
#        effect:
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - podAffinityTerm:
              labelSelector:
                matchExpressions:
                  - key: type
                    operator: In
                    values:
                      - data
                      - monitor
                  - key: postgres-instance
                    operator: In
                    values:
                      - postgres-sample
              topologyKey: kubernetes.io/hostname
            weight: 100
 
 
  #
  # Monitor Pod features
  #
  monitorStorageClassName: default
  monitorStorageSize: 10G
  monitorPodConfig:
#    tolerations:
#      - key:
#        operator:
#        value:
#        effect:
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - podAffinityTerm:
              labelSelector:
                matchExpressions:
                  - key: type
                    operator: In
                    values:
                      - data
                      - monitor
                  - key: postgres-instance
                    operator: In
                    values:
                      - postgres-sample
              topologyKey: kubernetes.io/hostname
            weight: 100
 
  #
  # Resources
  #
  resources:
    data:
      limits:
        cpu: 800m
        memory: 800Mi
      requests:
        cpu: 800m
        memory: 800Mi
    monitor:
      limits:
        cpu: 800m
        memory: 800Mi
      requests:
        cpu: 800m
        memory: 800Mi
    metrics:
      limits:
        cpu: 100m
        memory: 100Mi
      requests:
        cpu: 100m
        memory: 100Mi
```



6. Create Postgres instance and verify that it went through properly.

```bash
~$ kubectl apply -f postgresdb.yaml 
~$ kubectl get all

NAME                            READY   STATUS    RESTARTS      AGE
pod/postgres-sample-0           5/5     Running   1 (22s ago)   2m4s
pod/postgres-sample-1           5/5     Running   0             2m3s
pod/postgres-sample-monitor-0   4/4     Running   0             3m14s

NAME                            TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)          AGE
service/postgres-sample         LoadBalancer   100.69.226.28   10.221.42.50   5432:31622/TCP   3m15s
service/postgres-sample-agent   ClusterIP      None            &lt;none>         &lt;none>           3m15s

NAME                                       READY   AGE
statefulset.apps/postgres-sample           2/2     2m4s
statefulset.apps/postgres-sample-monitor   1/1     3m14s

NAME                                            STATUS    DB VERSION   BACKUP LOCATION   AGE
postgres.sql.tanzu.vmware.com/postgres-sample   Running   14.4                           3m15s
```

7. Since the Postgres instance is configured for high availability, identify the primary (writable) pod of the Postgres instance by running the following command.

```bash
~$ kubectl exec -ti pod/postgres-sample-1 -- pg_autoctl show state

Defaulted container "pg-container" out of: pg-container, instance-logging, reconfigure-instance, postgres-metrics-exporter, postgres-sidecar

  Name |  Node |                                                                   Host:Port |       TLI: LSN |   Connection |      Reported State |      Assigned State
-------+-------+-----------------------------------------------------------------------------+----------------+--------------+---------------------+--------------------
node_1 |     1 | postgres-sample-1.postgres-sample-agent.postgres-tap.svc.cluster.local:5432 |   1: 0/3000148 |   read-write |             primary |             primary
node_2 |     2 | postgres-sample-0.postgres-sample-agent.postgres-tap.svc.cluster.local:5432 |   1: 0/3000148 |    read-only |           secondary |           secondary
```

8. Log in to the primary pod to PostgreSQL and create a database, user, and grant database privileges to the user.

```bash
$ kubectl exec -it postgres-sample-1 -- psql 
Defaulted container "pg-container" out of: pg-container, instance-logging, reconfigure-instance, postgres-metrics-exporter, postgres-sidecar
psql (14.4 (VMware Postgres 14.4.0))
Type "help" for help.

postgres=# create database tap_pg_db;
CREATE DATABASE
postgres=# create user $DB_USER with encrypted password $DB_PASSWORD;
CREATE ROLE
postgres=# grant all privileges on database tap_pg_db to $DB_USER;
GRANT
postgres=# \q
```

9. Get the `hba_file` location.

```bash
$ kubectl exec -it postgres-sample-1 -- psql 
Defaulted container "pg-container" out of: pg-container, instance-logging, reconfigure-instance, postgres-metrics-exporter, postgres-sidecar
psql (14.4 (VMware Postgres 14.4.0))
Type "help" for help.

postgres=# show hba_file;
        hba_file         
-------------------------
 /pgsql/data/pg_hba.conf
(1 row)

postgres=# \q
```

10. Append the entry (host `tap_pg_db $DB_USER 0.0.0.0/0 scram-sha-256`) to the file so as to provide access to the other host on both of the instances; then, reload the instance.

```bash
~$ kubectl exec -it postgres-sample-0 -- /bin/bash                                                                      
Defaulted container "pg-container" out of: pg-container, instance-logging, reconfigure-instance, postgres-metrics-exporter, postgres-sidecar, wait-for-monitor (init), create-postgres (init)
postgres@postgres-sample-0:/$
postgres@postgres-sample-0:/$ echo "host tap_pg_db $DB_USER 0.0.0.0/0 scram-sha-256" >> /pgsql/data/pg_hba.conf  
postgres@postgres-sample-0:/$ pg_ctl reload
server signaled
postgres@postgres-sample-0:/$ exit

~$ kubectl exec -it postgres-sample-1 -- /bin/bash                                                                      
Defaulted container "pg-container" out of: pg-container, instance-logging, reconfigure-instance, postgres-metrics-exporter, postgres-sidecar, wait-for-monitor (init), create-postgres (init)
postgres@postgres-sample-1:/$
postgres@postgres-sample-1:/$ echo "host tap_pg_db $DB_USER 0.0.0.0/0 scram-sha-256" >> /pgsql/data/pg_hba.conf  
postgres@postgres-sample-1:/$ pg_ctl reload
server signaled
postgres@postgres-sample-1:/$ exit
```

11. Use PL/SQL to access the database.

```bash
$ PGPASSWORD=$DB_PASSWORD psql -h 10.221.42.50 -p 5432 -d tap_pg_db -U $DB_USER
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1), server 14.4 (VMware Postgres 14.4.0))
WARNING: psql major version 12, server major version 14.
         Some psql features might not work.
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

tap_pg_db=> \q
```

## Consuming Tanzu Data Service



1. On Custer 2 where Tanzu Application Platform (full profile) is installed, create a Kubernetes secret resource for the Tanzu Data Service Postgres database created above.

```bash
~$ more external-tds-postgresdb-binding-compatible.yaml 
# external-tds-postgresdb-binding-compatible.yaml

---
apiVersion: v1
kind: Secret
metadata:
  name: external-tds-postgresdb-binding-compatible
type: Opaque
stringData:
  type: postgresql
  provider: azure
  host: 10.221.42.50
  port: "5432"
  database: "tap_pg_db"
  username: $DB_USER
  password: $DB_PASSWORD
```

2. Apply the YAML file on Cluster 2.

```bash
$ kubectl apply -f external-tds-postgresdb-binding-compatible.yaml -n my-apps
```

3. Give sufficient role-based access control (RBAC) permissions to Services Toolkit to be able to read the secrets.

```bash
~$ more stk-secret-reader.yaml
# stk-secret-reader.yaml

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: stk-secret-reader
  labels:
    servicebinding.io/controller: "true"
rules:
- apiGroups:
  - ""
  resources:
  - secrets
  verbs:
  - get
  - list
  - watch
```

4. Apply the RBAC permissions.

```bash
~$ kubectl apply -f stk-secret-reader.yaml -n my-apps
```

5. Create a claim for the secret created.

```bash
~$ tanzu service claim create  external-tds-postgresdb-claim --resource-name external-tds-postgresdb-binding-compatible --resource-kind Secret --resource-api-version v1 -n my-apps
```

6. Check that the claim reference was created.

```bash
~$ tanzu services claims get external-tds-postgresdb-claim --namespace my-apps
Name: external-tds-postgresdb-claim
Status: 
  Ready: True
Namespace: my-apps
Claim Reference: services.apps.tanzu.vmware.com/v1alpha1:ResourceClaim:external-tds-postgresdb-claim
Resource to Claim: 
  Name: external-tds-postgresdb-binding-compatible
  Namespace: my-apps
  Group: 
  Version: v1
  Kind: Secret
```

7. Create a workload like the following to consume the Tanzu Data Service Postgres exposed via secret.

```bash
~$ tanzu apps workload create spring-petclinic-tds \
   --git-repo https://github.com/sample-accelerators/spring-petclinic \
   --git-branch main \
   --git-tag tap-1.2 \
   --type web \
   --label app.kubernetes.io/part-of=spring-petclinic \
   --annotation autoscaling.knative.dev/minScale=1 \
   --env SPRING_PROFILES_ACTIVE=postgres \
   --service-ref db=services.apps.tanzu.vmware.com/v1alpha1:ResourceClaim:external-tds-postgresdb-claim \
   --namespace my-apps
```

8. Check that the workload was successful.

```bash
~$ tanzu apps workload get spring-petclinic-tds --namespace my-apps
---
# spring-petclinic-tds: Ready
---
Source
type:     git
url:      https://github.com/sample-accelerators/spring-petclinic
branch:   main
tag:      tap-1.2
 
Supply Chain
name:          source-to-url
last update:   9m18s
ready:         True
 
RESOURCE          READY   TIME
source-provider   True    19m
deliverable       True    19m
image-builder     True    10m
config-provider   True    10m
app-config        True    10m
config-writer     True    9m18s
 
Issues
No issues reported.
 
Services
CLAIM   NAME                            KIND            API VERSION
db      external-tds-postgresdb-claim   ResourceClaim   services.apps.tanzu.vmware.com/v1alpha1
 
Pods
NAME                                                     STATUS      RESTARTS   AGE
spring-petclinic-tds-00001-deployment-5475fc8968-kfxq6   Running     6          9m12s
spring-petclinic-tds-00002-deployment-7db8cc7bc5-q2wdl   Running     0          9m12s
spring-petclinic-tds-build-1-build-pod                   Succeeded   0          19m
spring-petclinic-tds-config-writer-k9cvb-pod             Succeeded   0          10m
 
Knative Services
NAME                   READY   URL
spring-petclinic-tds   Ready   http://spring-petclinic-tds.my-apps.apps.tapcluster.tapl.net
 
To see logs: "tanzu apps workload tail spring-petclinic-tds --namespace my-apps"
```

9. You can log in to the database to check that the tables were created for the` spring-petclinic` workload that we deployed.

```bash
dapuser@vdesikan-tkgm-bastion:~$ PGPASSWORD=$DB_PASSWORD psql -h 10.221.42.50 -p 5432 -d tap_pg_db -U $DB_USER
psql (12.11 (Ubuntu 12.11-0ubuntu0.20.04.1), server 14.4 (VMware Postgres 14.4.0))
WARNING: psql major version 12, server major version 14.
         Some psql features might not work.
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.
 
tap_pg_db=> \dt
             List of relations
 Schema |      Name       | Type  |  Owner  
--------+-----------------+-------+---------
 public | owners          | table | tapuser
 public | pets            | table | tapuser
 public | specialties     | table | tapuser
 public | types           | table | tapuser
 public | vet_specialties | table | tapuser
 public | vets            | table | tapuser
 public | visits          | table | tapuser
(7 rows)
 
tap_pg_db=> \q
```