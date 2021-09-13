---
date: 2019-05-13
description: Deploy a Spring Boot container image on Kubernetes using the Bitnami
  Apache Tomcat Helm chart.
lastmod: '2021-02-05'
linkTitle: Spring Boot Production
parent: Bitnami
tags:
- Bitnami
- Spring Boot
- Docker
- Helm
team:
- Raquel Campuzano
title: Move a Custom Spring Boot Application to Production Using Bitnami Helm Charts
topics:
- Containers
- Kubernetes
weight: 4
oldPath: "/content/guides/containers/deploy-spring-boot-application-production-helm.md"
aliases:
- "/guides/containers/deploy-spring-boot-application-production-helm"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

Bitnami provides ready-to-run [Helm charts](https://github.com/bitnami/charts) that can be directly deployed on [Kubernetes](https://kubernetes.io/) and also infrastructure charts that can help you deploy your custom applications. That is the case of the [Bitnami Tomcat Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/tomcat) that with some tweaks can be used to run Java applications in production easily.

This tutorial walks you through the process of deploying a Spring Boot container image on Kubernetes using the Bitnami Apache Tomcat Helm chart. It uses the resulting image created in the [Deploy locally a Spring Boot application using Bitnami containers](../deploy-locally-spring-boot-application-docker) guide as an example. While the Bitnami Tomcat Helm chart will be modified to get the application container from the DockerHub registry, create a secret to secure the application pod and connect it to a MariaDB pod.

## Assumptions and prerequisites

This guide makes the following assumptions:

* You have basic knowledge of [Docker](https://www.docker.com/) containers.
* You have a Docker environment installed and configured. [Learn more about installing Docker](https://docs.docker.com/install/).
* You have a Docker Hub account. [Register for a free account](https://hub.docker.com/).
* You have a [Spring Boot container published](https://docs.bitnami.com/tutorials/deploy-locally-spring-boot-application-docker/#step-6-publish-the-docker-image) in a container registry (this tutorial assumes that you are using [Docker Hub](https://hub.docker.com/)).
* You have a [Kubernetes cluster running](https://docs.bitnami.com/kubernetes/) in the platform of your choice. This tutorial uses [Minikube](https://docs.bitnami.com/kubernetes/get-started-kubernetes/).
* You have the [*kubectl* command line (*kubectl* CLI)](https://docs.bitnami.com/kubernetes/get-started-kubernetes/#step-3-install-kubectl-command-line) installed.
* You have [Helm v3.x](https://docs.bitnami.com/kubernetes/get-started-kubernetes/#step-4-install-helm) installed.

The following are the steps you will complete in this guide:

* Step 1: Create the Helm chart
* Step 2: Adapt the Helm chart to include the source code and database
* Step 3: Create a secret to secure the deployment
* Step 4: Deploy the example application in Kubernetes

{{% callout %}}
**Note**: Learn how to create a Spring Boot Docker container image in the [Deploy locally a Spring Boot application using Bitnami containers](../deploy-locally-spring-boot-application-docker) guide.
{{% /callout %}}


## Step 1: Create the Helm chart

Begin by creating the Helm chart for our application. In this case, the Bitnami Tomcat Helm chart will serve you as a starting point which you can modify to build your custom chart. To do so, execute the following command:

```plaintext
helm fetch bitnami/tomcat --untar
```

This will create a folder in your local system that contains all the files required for deploying Tomcat in a Kubernetes cluster.

## Step 2: Adapt the Helm chart to include the source code and database

The first step consists of adapting the current Bitnami Tomcat Helm chart to include the sample Spring Boot container image and MariaDB as a database. Then, connect both pods when deploying the resulting chart. Follow the instructions below:

* Change to the *tomcat* directory and create a file named *requirements.yaml* with the content below to include MariaDB as a dependency:

  ```plaintext
  dependencies:
  - name: mariadb
    version: 5.x.x
    repository: https://charts.helm.sh/stable/
    condition: mariadb.enabled
    tags:
      - spring-java-app-database
  ```

* Edit the *values.yaml* file and replace the default values with the following to include your image. Remember to replace the DOCKER_USERNAME placeholder with your Docker account username.

  ```plaintext
  [...]
  image:
     registry: docker.io
     repository: DOCKER_USERNAME/spring-java-app
     tag: latest
  ```

* Add the following lines at the end of the *values.yaml* file to specify the database:

  ```plaintext
  [...]
  mariadb:
     Whether to deploy a mariadb server to satisfy the applications database requirements. To use an external database set this to false and configure the externalDatabase parameters
    enabled: true
     Disable MariaDB replication
    replication:
      enabled: false
     Create a database and a database user
     ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.mdcreating-a-database-user-on-first-run

    db:
      name: db_example
      user: springuser
     If the password is not specified, mariadb will generates a random password

    password: ThePassword
  ```

* Edit the *templates/_helpers.tpl* and add the lines below to generate the name of the MariaDB service so the application will be able to connect to it:

  ```plaintext
  {{/*
  Create a default fully qualified app name.
  We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
  */}}
  {{- define "mariadb.fullname" -}}
  {{- printf "%s-%s" .Release.Name "mariadb" | trunc 63 | trimSuffix "-" -}}
  {{- end -}}
  ```

## Step 3: Create a secret to secure the deployment

The next step is to create a secret for the Spring Boot application that secures the connection between the application and the database. Follow these instructions:

* In the *templates* directory, create a file named *spring-secret.yaml* that includes the following content:

  ```plaintext
  apiVersion: v1
  kind: Secret
  metadata:
    name: {{ template "tomcat.fullname" . }}-spring
    labels:
      app: {{ template "tomcat.fullname" . }}
      chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
      release: "{{ .Release.Name }}"
      heritage: "{{ .Release.Service }}"
  type: Opaque
  data:
    spring-db: {{ printf "{\"spring\": {\"datasource\":{\"url\": \"jdbc:mysql://%s:3306/%s\", \"username\": \"%s\", \"password\": \"%s\"}}}" (include "mariadb.fullname" .) .Values.mariadb.db.name .Values.mariadb.db.user .Values.mariadb.db.password | b64enc }}
  ```

* Edit the *templates/deployment.yaml* file to add the lines below. These refer to the secret created in the step above:

  ```plaintext
  [...]
  - name: TOMCAT_PASSWORD
    valueFrom:
      secretKeyRef:
        name: {{ template "tomcat.fullname" . }}
        key: tomcat-password
  - name: SPRING_APPLICATION_JSON
    valueFrom:
      secretKeyRef:
        name: {{ template "tomcat.fullname" . }}-spring
        key: spring-db
  ```

## Step 4: Deploy the example application in Kubernetes

Before deploying the resulting Helm chart, make sure that you can connect to your Kubernetes cluster by running this command:

```plaintext
kubectl cluster-info
```

* Execute the command below to install missing dependencies. In this case, it will install the database that we have indicated in the *requirements.yaml* file:

  ```plaintext
  helm dependency update .
  ```

* Deploy the chart by executing the *helm install* command. It is recommended to install it by passing a name using the */--n* flag.

  ```plaintext
  helm install spring-java .
  ```

* Check that all pods are ready by executing the *kubectl get pods* command. Take into account that the database pod takes more time to be deployed than the Tomcat pod, is possible that the *kubectl logs* command show errors during that time.

  ```plaintext
  kubectl get pods -w
  ```

  You should see an output similar to this:

  ![Pod status](/images/guides/containers/bitnami/deploy-spring-boot-application-production-helm/get-pods.png)

* To test that the Spring Boot application has been successfully deployed it is necessary to make it accessible from your local system. To do so, port forward the Tomcat pod as shown below. Replace *svc/spring-java-tomcat* with the name of the service that appears in your deployment:

  ```plaintext
  kubectl port-forward svc/spring-java-tomcat 8080:80
  Forwarding from 127.0.0.1:8080 -> 8080
  ```

* To test if the application works fine, open a new terminal and insert some data in the database by executing:

  ```plaintext
  curl 'localhost:8080/gs-mysql-data-0.1.0/demo/add?name=First&email=someemail@someemailprovider.com'
  ```

* Query the application again to check if the data is present in the database:

  ```plaintext
  curl 'localhost:8080/gs-mysql-data-0.1.0/demo/all'
  ```

  You should get an output similar to this:

  ```plaintext
  [{"id":1, "name":"First", "email":"someemail@someemailprovider.com"}]
  ```

Congratulations! You have your Spring Boot application running in a Kubernetes production cluster and ready to use!

## Useful links

* [Bitnami Kubernetes projects](https://bitnami.com/kubernetes)
* [Deploy locally a Spring Boot application using Bitnami containers](../deploy-locally-spring-boot-application-docker)
* [Get started with Kubernetes guides](https://docs.bitnami.com//kubernetes/)
* [Deploy, Scale And Upgrade An Application On Kubernetes With Helm](https://docs.bitnami.com/tutorials/deploy-application-kubernetes-helm/)
* [Bitnami Tomcat Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/tomcat)
* [Bitnami Helm charts](https://github.com/bitnami/charts)
* [Docker Hub](https://hub.docker.com/)
* [Spring Boot official site](https://spring.io/projects/spring-boot)
* [Bitnami tutorials repository](https://github.com/bitnami/tutorials)