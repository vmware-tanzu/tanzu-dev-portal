---
date: 2022-08-08
description: Enabling arbitrary services to be Kubernetes service binding compliant with SecretTemplates
lastmod: '2022-08-00'
linkTitle: Tanzu Application Platform Service Enablement With SecretTemplates
tags:
- Tanzu Application Platform
- Tanzu
- Kubernetes
- ServiceBinding
team:
- Greg Meyer
title: Tanzu Service "Secret" Sauce - Enabling Binding to Arbitrary Services
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
---

## Introduction

Many modern and legacy applications have a common need: connecting to and consuming services such as databases, messaging queues, caches, or even external APIs.  Depending on your application platform (or lack thereof), service connectivity and auth configuration is in many cases deployed alongside the application via properties files or other means of configuration management, and the process of communicating, authoring, and updating configuration over the lifetime of an application can be cumbersome.  Some platforms offer *service bindings* which are intended to simplify the discovery of connectivity and auth configuration.  However, service offerings need to be compliant with the service binding specification for a given platform in order for applications to realize value.

There are a number of services available on Kubernetes, meaning in theory, developers have a plethora of options when it comes to what services they can deploy and consume.  In addition, Tanzu Application Platform (TAP) implements the [Kubernetes service binding specification](https://github.com/servicebinding/spec) allowing developers and DevOps personnel to exploit the power of service bindings and reduce the burden of configuration management in the context of consuming services.  The limitation of TAP service bindings is not grounded in the capabilities of the platform but instead by the small number of services that create configuration that is conformant with the Kubernetes service binding spec.  How can you transform a service’s configuration data into configuration that is compliant with the service binding specification?  A very powerful and clever option is through the use of [SecretTemplates](https://github.com/vmware-tanzu/carvel-secretgen-controller/blob/develop/docs/secret-template.md).

In this guide, you will be introduced to the new _SecretTemplate_ custom resource, deploy an instance of a Redis service, aggregate the Redis configuration and secrets into a service binding compliant secret, and finally, build and deploy a trivial Spring Boot application that consumes the Redis service through the [TAP services toolkit](https://docs.vmware.com/en/Services-Toolkit-for-VMware-Tanzu-Application-Platform/0.6/svc-tlk/GUID-overview.html).  The examples in this guide are derived from a SecretTemplate [POC available on GitHub.](https://github.com/gm2552/redis-secret-template) 

## Prerequisites

This guide assumes the following prerequisites are met:


* **Tanzu Cluster Essentials (TCE)** - This is a prerequisite of Tanzu Application Platform.  This guide uses resources that require TCE 1.2 or greater. 
* **Tanzu Application Platform (TAP)** – Installation of TAP 1.2.x or greater utilizing the “iterate” profile or other profile that has deployed out-of-the-box supply chains, out-of-the-box templates, services toolkit, and service bindings.
* **kubectl** – You will use this to manage Kubernetes resources. Installation instructions are[ here](https://kubernetes.io/docs/tasks/tools/).
* **Tanzu CLI** – You will use this to execute Tanzu specific operations. Install instructions are[ here](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.2/tap/GUID-install-tanzu-cli.html).
* **YTT** – You will use this to install a supply chain with user provided values. Install instructions are[ here](https://carvel.dev/ytt/docs/v0.42.0/install/).
* You will need permissive access to the TAP Kubernetes cluster with kubectl and Tanzu cli tools

## Service Bindings

Service bindings are a powerful feature in many application platforms, and one of their key value propositions is to reduce the amount of configuration needed for an application or component to connect to, and optionally authenticate to, a service.  Service binding specifications and implementations can be specific to an application platform, and service vendors are required to comply with those specifications if they intend to yield promised value.  Projects like the [Open Service Broker](https://www.openservicebrokerapi.org/) attempt to standardize specifications and implementations, but at times are still coupled to specific platform offerings.  

The [Kubernetes service binding specification](https://github.com/servicebinding/spec) “aims to create a Kubernetes-wide specification for communicating service secrets to workloads in a consistent way.”  Its intention is to offer applications the same value enjoyed by developers on other platforms such as Cloud Foundry.  Language and framework specific libraries such as the [spring-cloud-bindings](https://github.com/spring-cloud/spring-cloud-bindings) project further extend that value.

**SecretTemplate**

The Kubernetes specification is relatively new and currently not widely adopted by vendors or OSS projects offering Kubernetes deployments and/or off platform connectivity options.  Although not done in a consistent and standardized manner, many of these offerings do create enough configuration via secrets and other resources that an application could potentially utilize to bind to a service.  The question is how would the system aggregate and transform the configuration into a standardized format.  This is where [SecretTemplates](https://github.com/vmware-tanzu/carvel-secretgen-controller/blob/develop/docs/secret-template.md) come to the rescue.

SecretTemplates “provides a way of defining ‘input resources’ (other Kubernetes Resources) and allows the templating of a new Secret using information found on these resources. It will continuously pick up changes to these resources and update the templated Secret as necessary.”  In our service scenario where configuration is spread across one or multiple resources, we can use a SecretTemplate to aggregate the necessary information into a single serviced binding compliant secret.  Once the secret is available, service and application operators can create TAP services toolkit resources and expose the service via “ResourceClaims” to applications in a consistent manner just like they would with any other service that natively supported the Kubernetes service binding specification.  This makes SecretTemplates an incredibly powerful tool for extending the value of TAP.

## Redis Deployment

There are several options available to demonstrate the power of SecretTemplates; this guide will use [Redis](https://redis.io/) as its Guinea pig.  Redis is a good sample candidate as it is a very popular service that is used in many production applications.  It also has multiple distributions available for Kubernetes, but to the author’s knowledge, none support the Kubernetes service binding specification.  In this section, you will install a Redis Kubernetes operator, deploy an instance of a Redis cluster and database, and create a service binding compliant secret using a SecretTemplate.

Installing the Redis operator is a relatively simple task as all the necessary resource definitions are contained in a single yaml file that is available at public URL.  You will use the [Redis Enterprise Cluster](https://docs.redis.com/latest/kubernetes/) operator in this guide.  To install the Redis operator, run the following commands:
```sh
kubectl create ns service-instances

kubectl apply -f https://raw.githubusercontent.com/RedisLabs/redis-enterprise-k8s-docs/v6.2.10-45/bundle.yaml -n service-instances
```

Validate the operator is installed with the following command:
```sh
kubectl get pods -l name=redis-enterprise-operator -n service-instances
```

You should see an output similar to the following:
```text
NAME                                         READY   STATUS    RESTARTS   AGE
redis-enterprise-operator-74849d8c69-pnqvq   2/2     Running   0          39s
```

Now that the operator is deployed, you can create a Redis cluster and database.  To deploy the cluster and database, run the command below.  The configuration referenced in the following command also deploys a SecretTemplate resource to convert the subsequent Redis configuration into a service binding compliant secret:
```sh
ytt -f https://raw.githubusercontent.com/gm2552/redis-secret-template/main/templates/redisEnterpriseClusterOperator/redisEnterpriseClusterTemplate.yaml -v service_namespace=service-instances -v instance_name=redis-test | kubectl apply -f-
```

This will create a cluster and database named `redis-test`.  Once the cluster is ready, its configuration is written to a secret and service resource.

First validate that the cluster has been created and is operational by running the following command:
```sh
kubectl get sts redis-test-cluster -n service-instances
```

You should see an output similar to the following:
```text
NAME             	 READY   AGE
redis-test-cluster   1/1 	 108s
```

Next, validate that the database is operational by running the following command:
```sh
kubectl get redisenterprisedatabase redis-test-db -n service-instances
```

You should see an output similar to the following:
```text
NAME            VERSION   PORT	 CLUSTER               SHARDS   STATUS   SPEC STATUS   AGE
redis-test-db   6.0.13    10745  redis-test-cluster    1        active   Valid         5m55s
```

Next, validate the SecretTemplate was able to reconcile the Redis configuration into a service binding compliant secret by running the following command:
```sh
kubectl get secrettemplate redis-test-redis-secret -n service-instances
```

You should see an output similar to the following:
```text
NAME                  	  DESCRIPTION       	AGE
redis-test-redis-secret   Reconcile succeeded   8m57s
```

Finally, validate that the service binding compliant secret exists by running the following command:
```sh
kubectl get secret redis-test-redis-secret -n service-instances
```

You should see an output similar to the following:
```text
NAME                  	  TYPE 	   DATA   AGE
redis-test-redis-secret   Opaque   5  	  9m22s
```

If you inspect the secret further, you will see it incorporates all the necessary fields to describe the binding as well as provides necessary connectivity and authentication information:
```sh
kubectl describe secret redis-test-redis-secret -n service-instances
```

You should see an output similar to the following:
```text
Name:     	redis-test-redis-secret
Namespace:	service-instances
Labels:   	app.kubernetes.io/component=redis
          	app.kubernetes.io/instance=redis-test
          	services.apps.tanzu.vmware.com/class=redis-enterprise-cluster
Annotations:  <none>

Type:  Opaque

Data
====
provider:  16 bytes
type:  	5 bytes
host:  	31 bytes
password:  8 bytes
port:  	5 bytes
```


## Service Class and Resource Claim Installation

With the Redis instance running and the service binding compliant secret in place, you can view your Redis instance(s) using the tanzu cli “service” plugin.  The first step is to create a “ClusterInstanceClass” (referred to from this point on as a “service class”) which is used to identify and categorize service offerings on a TAP cluster.  If you are familiar with service “plans” in Cloud Foundry, a service class is a very similar concept.  Service class definitions are generally created by the service operator role and use Kubernetes selectors to find all instances of a given service class on a cluster.  To create the Redis service class, run the following command:
```sh
kubectl apply -f https://raw.githubusercontent.com/gm2552/redis-secret-template/main/templates/redisEnterpriseClusterOperator/redisInstanceClasses.yaml
```

Validate that you can see your new Redis Enterprise Cluster service class by running the following command:
```sh
tanzu service class list
```

You should see an output similar to the following:
```text
NAME                      DESCRIPTION	
...
redis-enterprise-cluster  Redis Enterprise Cluster
```

In order for an application on TAP to bind to an instance of a service residing in a different namespace, you are required to create “resource claims” (it is recommended even if both are in the same namespace).  At this point, your Redis instance has not been claimed, and you can view the list of all unclaimed service instances in your cluster.  Viewing unclaimed service instances requires that you specify a service class.  To view all the unclaimed instances of the Redis service class, run the following command:
```sh
tanzu service claimable list --class redis-enterprise-cluster -n service-instances
```

You should see an output similar to the following which should include the Redis instance’s secret you created earlier in this guide:
```text
NAME                     NAMESPACE          KIND    APIVERSION 
redis-test-redis-secret  service-instances  Secret  v1
```

Next, you will create a claim for your Redis instance and make it available for use by applications. Run the following command to create the resource claim (this assumes that you will deploy applications to a namespace named workloads):
```sh
ytt -f https://raw.githubusercontent.com/gm2552/redis-secret-template/main/templates/redisResourceClaimTemplate.yaml -v service_namespace=service-instances -v instance_name=redis-test -v workload_namespace=workloads | kubectl apply -f-
```

Verify that your Redis instance has now been claimed by running the following command:
```sh
tanzu service claims list -n workloads
```

You should see an output similar to the following which should include the Redis instance you deployed earlier in this guide:
```text
NAME       	READY  REASON
redis-test 	True   Ready
```

## Workload Build and Deployment

With Redis running and all the necessary configuration in place to bind to your Redis instance, you can start deploying applications that will consume your Redis instance.  Kubernetes applications are abstracted in TAP using the Cartographer [workload](https://cartographer.sh/docs/v0.4.0/reference/workload/) resource, and part of the workload resource includes referencing a claimed resource ultimately resulting in the service binding that you desire.

This guide will use the “student-redis-sample” application that is located in the [Git repo](https://github.com/gm2552/redis-secret-template) referenced in the introduction of this guide.  To build and deploy the application on your TAP cluster using the workload resource, run the following command (again assuming that you will deploy the application to a namespace named “workloads”):
```sh
ytt -f https://raw.githubusercontent.com/gm2552/redis-secret-template/main/templates/workloadTemplate.yaml -v instance_name=redis-test -v workload_namespace=workloads | kubectl apply -f-
```

This will kick off the build and eventual deployment process of the application. If you wish to follow and monitor the build, you can submit the following command:
```sh
tanzu apps workloads tail student-redis-sample -n workloads --since 10m --timestamp
```

Depending on existing cached artifacts, network speed and latency, and other factors, it may take a little while (possibly more than 10 minutes) for the application to finally reach the state of being successfully deployed. To verify that the application has successfully deployed and is running, execute the following command:
```sh
tanzu apps workloads get student-redis-sample -n workloads
```

If the application was deployed successfully, you should see an output similar to the following:
```text
---
# student-redis-sample: Ready
.
.
.
Pods
NAME                                                     STATUS      RESTARTS   AGE
student-redis-sample-00002-deployment-7cc94b89cc-xtkzp   Running     0          2m45s
student-redis-sample-build-1-build-pod                   Succeeded   0          15m
student-redis-sample-config-writer-4kgjw-pod             Succeeded   0          3m20s

Knative Services
NAME                   READY   URL
student-redis-sample   Ready   https://student-redis-sample.perfect300rock.com
---
```

To test that the application is working properly including reading and writing to Redis, you can navigate to the URL in the above output, and append /student to the end of the URL.  You should see an output similar to the following:
```text
[{"id":"Eng2015001","name":"John Doe","gender":"MALE","grade":1}]
```

## What’s Next?

Congratulations! You have successfully built and deployed an application that binds to a service that does not natively support Kubernetes service binding.  The Redis example in this guide is just one of several possible services that you can convert into a service binding compliant offering.  The real work is in defining a SecretTemplate for the specific service offering you choose to consume, and one could imagine a [curated catalog ](https://github.com/vmware-tanzu/tanzu-application-platform-reference-service-packages)of out-of-the-box SecretTemplates to support a wide range of already available services.  The optimal vision of nirvana would be for every service to support Kubernetes service bindings as first class citizens, but in the meantime, SecretTemplates are a powerful tool to add value from arbitrary services to your TAP implementation.
