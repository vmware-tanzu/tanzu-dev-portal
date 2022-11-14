---
title: "Deploying Kubernetes Apps Using VMware Tanzu Application Platform and Tanzu Service Mesh (Beta)"
description: Modern applications are comprised of microservices and require services such as service discovery, encryption, traffic controls, and access controls. For applications created on VMware Tanzu Application Platform, these network and security services are enabled with VMware Tanzu Service Mesh, an Istio-based solution that connects and secures microservices across any cluster or cloud boundary. This document showcases the first phase of the integration, where Tanzu Application Platform Kubernetes workloads are connected and secured within clusters, across clusters and across clouds.
date: "2022-11-14"
lastmod: "2022-11-14"
level1: 
level2: 
tags:
- 
# Author(s)
team:
- 
---

## Deploying Kubernetes Apps using VMware Tanzu Application Platform and Tanzu Service Mesh (Beta)

Modern applications are comprised of microservices and require services such as service discovery, encryption, traffic controls, and access controls. For applications created on VMware Tanzu Application Platform, these network and security services are enabled with VMware Tanzu Service Mesh, an Istio-based solution that connects and secures microservices across any cluster or cloud boundary. This document showcases the first phase of the integration, where Tanzu Application Platform Kubernetes workloads are connected and secured within clusters, across clusters and across clouds. The Tanzu Service Mesh global namespace provides secure connectivity with mutual transport layer security (mTLS) and service discovery, resiliency with actionable service-level objectives (SLO) and global server load balancing (GSLB) integration, and security with micro-segmentation and API security across Kubernetes clusters and clouds. You can learn more about Tanzu Service Mesh global namespaces in [this blog and demo](https://tanzu.vmware.com/content/blog/using-global-namespaces-zero-trust-policies-vmware-tanzu-service-mesh).

Please follow the subsequent instructions to set up a Tanzu Application Platform application deployed on Kubernetes with Tanzu Service Mesh.

### Tanzu Service Mesh setup

#### Step 0: Check prerequisites

* [Confirm prerequisites](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/tanzu-service-mesh-environment-requirements-and-supported-platforms/GUID-D0B939BE-474E-4075-9A65-3D72B5B9F237.html#:~:text=Tanzu%20Service%20Mesh%20requires%20a,any%20node%20on%20the%20cluster) for Tanzu Service Mesh by checking that you are:
  * On a supported Kubernetes platform
    * Have the right resource configuration (number of nodes, CPUs, RAM, etc.)
    * Have the required connectivity requirements (Note that connectivity is only required from your local clusters out to Tanzu Service Mesh and not inwards. This can traverse a corporate proxy as well. In addition, connectivity in the data plane is required between the clusters that need to communicate, specifically egress to ingress gateways. No data plane traffic needs to reach the Tanzu Service Mesh software as a service (SaaS) management plane. See the following diagram as an example.

![alt_text](images/image1.png "image_tooltip")


* Activate your Tanzu Service Mesh subscription in [cloud.vmware.com](cloud.vmware.com). Upon purchasing your Tanzu Service Mesh subscription, you should receive instructions from the VMware Cloud team, otherwise follow [these instructions](https://pathfinder.vmware.com/v3/path/tsm_activation).


#### Step 1: Onboard clusters



* Once the prerequisites captured above are set, onboard your clusters to Tanzu Service Mesh per this [document](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/getting-started-guide/GUID-DE9746FD-8369-4B1E-922C-67CF4FB22D21.html). This will deploy the Tanzu Service Mesh local control plane and OSS Istio onto your Kubernetes cluster and will connect the local control plane to your Tanzu Service Mesh tenant.
* As part of the onboarding of the cluster and  Tanzu Application Platform 1.3 integration, these namespaces should remain excluded while getting the Envoy proxy sidecars injected (for Run profiles). Including them may cause the components to stop working at some point in the future when a pod within them is rescheduled or updated. The following list needs to be specified as part of the onboarding process per this [documentation](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/getting-started-guide/GUID-DE9746FD-8369-4B1E-922C-67CF4FB22D21.html#:~:text=To%20exclude%20a%20specific%20namespace,the%20right%20drop%2Ddown%20menu.).

    The following is the list of namespaces to be excluded: 

    * api-auto-registration
    * app-live-view-connector
    * appsso
    * cartographer-system
    * cert-manager
    * cosign-system
    * default
    * flux-system
    * image-policy-system
    * kapp-controller
    * knative-eventing
    * knative-serving
    * knative-sources
    * kube-node-lease
    * kube-public
    * kube-system
    * secretgen-controller
    * service-bindings
    * services-toolkit
    * source-system
    * tanzu-cluster-essentials
    * tanzu-package-repo-global
    * tanzu-system-ingress
    * tap-install
    * tap-telemetry
    * triggermesh
    * vmware-sources


### Tanzu Application Platform run cluster setup

You can now follow the standard [Tanzu Application Platform 1.3 install instructions](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-install-intro.html) to install TAP on the run cluster.


### End-to-end workload build and deployment scenario


#### Workload build

Workloads can be built using a Tanzu Application Platform supply chain by applying a _workload_ resource to a build cluster. At this time, Tanzu Service Mesh and Tanzu Application Platform cannot use the Knative resources that are the default runtime target when using the _web_ service type. Tanzu Application Platform _web_ resources will need to be modified to use the _server_ workload type that does not target Knative. In Tanzu Application Platform 1.3, two workload types will support this desired deployment: server and worker.

To work with Tanzu Service Mesh, _web_ workloads will need to be converted to the _server_ or _worker_ workload type. Server workloads result in a Kubernetes _Deployment_ resource being created along with a _Service_ resource that defaults to using port 8080. If the desired service port is 80 or some other port, you will need to add port information to the `workload.yaml`. The following is an example of changes needed to be made from the _web_ to _server_ workload type.

Original:


```
apiVersion: carto.run/v1alpha1
kind: Workload
metadata:
  name: hungryman
  labels:
    apps.tanzu.vmware.com/workload-type: web
    app.kubernetes.io/part-of: hungryman-api-gateway
spec:
  params:
  - name: annotations
value:
autoscaling.knative.dev/minScale: "1"
  source:
    git:
      url: https://github.com/gm2552/hungryman.git
    ref:
      branch: main
    subPath: hungryman-api-gateway
```


Modified for Tanzu Service Mesh (note the main differences in **bold**, and that the auto scaling annotation is removed):


```
apiVersion: carto.run/v1alpha1
kind: Workload
metadata:
  name: hungryman
  labels:
	apps.tanzu.vmware.com/workload-type: server
	app.kubernetes.io/part-of: hungryman-api-gateway
spec:
  params:
  - name: ports
	value:
  - port: 80
  	containerPort: 8080
  	name: http
  source:
	git:
  	  url: https://github.com/gm2552/hungryman.git
  	ref:
    	  branch: main
	subPath: hungryman-api-gateway
```


This will result in a Deployment and a Service that will be listening on port 80 and forwarding traffic to port 8080 on the pod’s “workload” container.

To build this workload, submit the modified YAML above to your build cluster. The following example assumes the file name is `workload.yaml` and the build cluster uses a namespace named “workloads” for building.

    tanzu apps workload apply --file workload.yaml

If the build is successful, a _Deliverable_ resource should be created.


#### Create a global namespace

Using the Tanzu Service Mesh portal or API, create a [global namespace](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/concepts-guide/GUID-9E3F1F90-4310-415B-98C8-C06E59B8A5EE.html) (GNS) that includes the namespaces where your application components will be deployed. Whether in a single or multiple clusters, within the same site or across clouds, once you add a namespace selection to the GNS, the services that will be deployed by Tanzu Application Platform will get connected based on the GNS configuration for service discovery and connectivity policies. If a service needs to be accessible through the ingress from the outside, it can be configured through the public service option in Tanzu Service Mesh or directly through Istio on the clusters where that service resides. It is preferable to configure the service’s accessibility through the GNS.


#### Run cluster deployment

**NOTE:** Before deploying a workload to a run cluster, ensure that any prerequisite resources have already been created on the run cluster. This includes, but is not limited to, concepts such as data, messaging, routing, security services, RBAC, and ResourceClaims.

After a successful build in a build cluster, workloads can be deployed to the run cluster by applying resulting deliverable_ _resources to the run cluster as described in the “[Getting Started with Multicluster Tanzu Application Platform](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-multicluster-getting-started.html)” guide. Another potential option is to create a kapp application that references a GitOps repository to include all deliverable resources for a given cluster. The following is an example of a kapp definition that points to a GitOps repository. \



```
apiVersion: kappctrl.k14s.io/v1alpha1
kind: App
metadata:
  name: deliverable-gitops
  namespace: hungryman
spec:
  serviceAccountName: default
  fetch:
  - git:
  	url: https://github.com/gm2552/tap-play-gitops
  	ref: origin/deliverables-tap-east01
  	subPath: config
  template:
  - ytt: {}
  deploy:
  - kapp: {}
```


The advantage of this model is that applications can be deployed or uninstalled from a cluster by managing the contents of the deliverable resources from within the GitOps repository, and enabling a GitOps workflow for application and service change control.


### Deployment use case: Hungryman

The following instructions describe an end-to-end process for configuring, building, and deploying the Hungryman application into a Tanzu Service Mesh global namespace. These instructions will use the default configuration of Hungryman which consists of only needing a single node RabbitMQ cluster, an in-memory database, and no security. The application will be deployed across two Tanzu Application Platform run clusters. It will require the use of the ytt command to execute the build and deployment commands.

The configuration resources referenced in this scenario are located in the Git repository [here](https://github.com/gm2552/hungryman-tap-tsm).


#### Initial configuration generation from an accelerator (for reference)

This use case deployment includes a pre-built set of configuration files in a Git repository; however, they were created from a set of configuration files via a bootstrapped process using the Hungryman accelerator, and later modified. If desired (and for reference purposes), you can create an initial set of configuration files from the Hungryman accelerator which is available in Tanzu Application Platform 1.3. Note that this section does not include instructions for modifying the configuration files from the accelerator into configuration files used in a later section.

From the accelerator, accept all of the default options with the following exceptions: \




* Workload namespace – Update this field with the name of the namespace you will use to build the application in your build cluster.
* Service namespace – Update this field with the name of the namespace you will use to deploy a RabbitMQ cluster in your Tanzu Application Platform run cluster.


#### Workload build

To build the application services, execute the following command to apply the workload_ _resources to your build cluster. Modify the _&lt;workloadNamespace> _placeholder with the name of your build namespace. You can also clone or fork the repository in the command below to either use the YAML files locally, or point to your own Git repository.

ytt -f workloads.yaml -v workloadNamespace=&lt;workloadNamespace> | kubectl apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/workloads.yaml -v workloadNamespace=workloads | kubectl apply -f-

Assuming you are using a GitOps workflow with your build cluster, once the workloads have been successfully built, the deployment information will be pushed to your GitOps repository.

**NOTE: **If you execute the instructions above without pull requests in the GitOps workflow, it is possible that the `config-writer` pods that commit deployment information to the GtiOps repository may fail due to concurrency conflicts. A dirty (but usable) workaround for this is to delete the failed workloads from the build cluster and re-run the command provided in the instructions above.


#### Service and resource claim installation

Hungryman requires a RabbitMQ cluster installed into your run cluster. You will need to install RabbitMQ onto the same run cluster that will be noted as _RunCluster01_ in the deployment section. Additionally, you will need to install service claim resources into this cluster.

If you haven’t already done so, install the RabbitMQ Cluster Operator into the run cluster by using the following command.

kubectl apply -f "[https://github.com/rabbitmq/cluster-operator/releases/download/v1.13.1/cluster-operator.yml](https://github.com/rabbitmq/cluster-operator/releases/download/v1.13.1/cluster-operator.yml)"

Next, spin up an instance of a RabbitMQ cluster by running the commands below. Modify the _&lt;servicesNamespace> _placeholder with the namespace of where you want to deploy your RabbitMQ cluster.

kubectl create ns &lt;serviceNamespace>

ytt -f rmqCluster.yaml -v serviceNamespace=&lt;serviceNamespace> | kubectl apply -f-

For example:

kubectl create ns service-instances

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/rmqCluster.yaml -v serviceNamespace=service-instances | kubectl apply -f-

Finally, create service toolkit resources for the RabbitMQ class and resource claim by running the command below. Modify the _&lt;servicesNamespace> _and_ &lt;workloadNamespace> _placeholder with the namespaces where you deployed your RabbitMQ cluster and the namespace where the application service will run.

ytt -f rmqResourceClaim.yaml -v serviceNamespace=&lt;serviceNamespace> -v workloadNamespace=&lt;workloadNamespace> | kubectl apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/rmqResourceClaim.yaml -v serviceNamespace=service-instances -v workloadNamespace=hungryman | kubectl apply -f-


#### Run cluster deployment

Workloads are deployed to the run cluster using deliverable_ _resources. This section will apply the deliverable resources directly to the run clusters instead of using a kapp application. This deployment will assume that two clusters are part of the Tanzu Service Mesh GNS Hungryman. For the sake of naming, we will simply call these clusters RunCluster01 and RunCluster02. The majority of the workload will be deployed to RunCluster01, while the _crawler_ workload will be deployed to RunCluster02_._

The deliverable objects will reference the GitOps repository, where the build cluster has written deployment information, and will need to reference this repository in the command below. To deploy the workloads to the run clusters, use the commands below against their respective clusters, and replace the following placeholders:



* **&lt;workloadNamespace>** – Namespace where the workloads will be deployed
* **&lt;gitOpsSecret>** – GitOps secret used to access the GitOps repository
* **&lt;gitOpsRepo>** – URL of the GitOps repository where the build cluster wrote out deployment configuration information

ytt -f cluster01Deliverables.yaml -v workloadNamespace=&lt;workloadNamespace> -v gitOpsSecret=&lt;gitOpsSecret> -v gitOpsRepo=&lt;gitOpsRepo> | kubectl apply -f-

ytt -f cluster02Deliverables.yaml -v workloadNamespace=&lt;workloadNamespace> -v gitOpsSecret=&lt;gitOpsSecret> -v gitOpsRepo=&lt;gitOpsRepo> | kubectl apply -f-

For example:

RunCluster01 deployment:

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/cluster01Deliverables.yaml -v workloadNamespace=hungryman -v gitOpsSecret=tap-play-gitops-secret -v gitOpsRepo=https://github.com/gm2552/tap-play-gitops.git | kubectl apply -f-

RunCluster02 deployment:

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/cluster02Deliverables.yaml -v workloadNamespace=hungryman -v gitOpsSecret=tap-play-gitops-secret -v gitOpsRepo=https://github.com/gm2552/tap-play-gitops.git | kubectl apply -f-

You can optionally create an Istio ingress resource on RunCluster01 if you do not plan on using the GNS capabilities to expose the application to external networks. To create the ingress, run the command below, modifying the _&lt;domainName> _placeholder with the public domain that will host your application. You will need to create a domain name system address (DNS A) record in your DNS provider’s configuration tool to point to the Istio load balanced IP address of RunCluster01_ _(the DNS configuration is out of the scope of this document). Also update the &lt;workloadNamespace> placeholder with the namespace where the workloads are deployed.

ytt -f ingress.yaml -v workloadNamespace=&lt;workloadNamespace> -v domainName=&lt;domainName> | kubectl apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/hungryman-tap-tsm/main/ingress.yaml -v workloadNamespace=hungryman -v domainName=tsmdemo.perfect300rock.com | kubectl apply -f-


#### Create a global namespace

Load the Tanzu Service Mesh console and create a new GNS. Configure the following settings in each step. The cluster names below will use the generic placeholder names of RunCluster01 and RunCluster02, and assume the workload and service namespaces of Hungryman and service-instances, respectively.



1. General details
    1. **GNS Name:** hungryman
    2. **Domain:** hungryman.lab
2. Namespace mapping
    3. Namespace mapping Rule 1
        1. **Cluster name: **RunCluster01
        2. **Namespace:** hungryman
    4. Namespace Mapping Rule 2
        3. **Cluster name: **RunCluster02
        4. **Namespace:** hungryman
    5. Namespace Mapping Rule 3
        5. **Cluster name: **RunCluster01
        6. **Namespace:** service-instances
3. Autodiscovery (use default settings)
4. Public services
    6. **Service name: **hungryman
    7. **Service port: **80
    8. **Public URL**: http hungryman . (select a domain)
5. Global server load balancing and resiliency (use default settings)

You should be able to access the Hungryman application with the URL configured in Step 4.


### Deployment use case: ACME Fitness Store

The following instructions describe an end-to-end process for configuring, building, and deploying the ACME Fitness Store application into a Tanzu Service Mesh GNS. The application will be deployed across two Tanzu Application Platform run clusters, and will require the use of the ytt command to execute the build and deployment commands.

The configuration resources referenced in this scenario are located in the Git repository [here](https://github.com/gm2552/acme-fitness-tap-tsm).


#### Workload build

To build the application services, execute the following command to apply the workload_ _resources to your build cluster. Modify the _&lt;workloadNamespace> _placeholder with the name of your build namespace, and the &lt;appSSOIssuerURI> placeholder for the URL of the AppSSO authorization server that you will deploy in a later step. You can also clone or fork the repository in the command below to either use the YAML files locally, or point to your own Git repository.

ytt -f workloads.yaml -v workloadNamespace=&lt;workloadNamespace> -v appSSOIssuerURI=&lt;appSSOIssuerURL> | kubectl apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/workloads.yaml -v workloadNamespace=workloads -v appSSOIssuerURI=http://authserver.tsmdemo.perfect300rock.com | kubectl apply -f-

Assuming you are using a GitOps workflow with your build cluster, once the workloads have  successfully been built, the deployment information will be pushed to your GitOps repository.

**NOTE: **If you execute the instructions above without pull requests in the GitOps workflow, it is possible that the `config-writer` pods that commit deployment information to the GitOps repository may fail due to concurrency conflicts. A dirty (but usable) workaround to this is to delete the failed workloads from the build cluster and re-run the command provided in the instructions above.


#### AppSSO deployment

ACME requires the use of an AppSSO authorization server and client registration resource. You will need to install these resources onto the same run cluster that should be noted as RunCluster01 in the deployment section. 

Deploy the authorization server instance by running the following commands and replacing these placeholders:



* **&lt;workloadNamespace>** – Namespace where the workloads will be deployed
* **&lt;appDomain>** – DNS domain that the application will use externally (This should be the publicly facing DNS name and **not** an internal Kubernetes domain name)
* **&lt;appSSOName>** – Authorization server resource instance
* **&lt;appSSOIssuerURI>** - Public Uniform Resource Identifier (URI) used to access the authorization server (This should be the same as the appSSO Issuer URI placeholder used in the previous section)
* **&lt;devDefaultAccountUsername>** – Username for the ACME application authentication
* **&lt;devDefaultAccountPassword>** – Password for the ACME application authentication

ytt -f appSSOInstance.yaml -v workloadNamespace=&lt;workloadNamespace> -v appDomainName=&lt;appDomain> -v appSSOName=&lt;appssoName> -v appSSOIssuerURI=&lt;appSSOIssuerURI> -v devDefaultAccountUsername=&lt;devDefaultAccountUsername> -v devDefaultAccountPassword=&lt;devDefaultAccountPassword> | kubectl apply -f-

For example:

ytt -f [https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/appSSOInstance.yaml](https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/appSSOInstance.yaml) -v workloadNamespace=acme -v appDomainName=tsmdemo.perfect300rock.com -v appSSOName=appsso-acme-fitness -v appSSOIssuerURI=http://authserver.tsmdemo.perfect300rock.com -v devDefaultAccountUsername=acme -v devDefaultAccountPassword=fitness | kubectl apply -f-

Next, create a ClientRegistration resource by running the following command and replacing these placeholders:



* **&lt;workloadNamespace>** – Namespace where the workloads will be deployed
* **&lt;appSSOName>** - Authorization server resource instance
* **&lt;appSSORedirectURI>** - Public URI that the authorization server will redirect to after a successful login

ytt -f appSSOInstance.yaml -v workloadNamespace=&lt;workloadNamespace> -v appSSOName=&lt;appssoName> -v appSSORedirectURI=&lt;appSSORedirectURI> | kubectl apply –f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/clientRegistrationResourceClaim.yaml -v workloadNamespace=acme -v appSSOName=appsso-acme-fitness -v appSSORedirectURI=[http://acme-fitness.tsmdemo.perfect300rock.com/login/oauth2/code/sso](http://acme-fitness.tsmdemo.perfect300rock.com/login/oauth2/code/sso) | kubectl apply -f-


#### Istio ingress

The authorization server requires a publicly accessible URL and is required to be available before the Spring Cloud Gateway will deploy properly. The authorization server will be deployed at the URI authserver &lt;appDomain>_. _Run the following command to create the Istio ingress resources replacing _&lt;workloadNamespace> _and _&lt;appDomain>_ placeholders with the name of your build namespace and the application’s DNS domain. You will need to create a DNS A record in your DNS provider’s configuration tool to point to the Istio load balanced IP address of RunCluster01_ _(the DNS configuration is out of the scope of this document).

ytt -f istioGateway.yaml -v workloadNamespace=&lt;workloadNamespace> -v appDomainName=&lt;appDomain> | kubectl apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/istioGateway.yaml -v workloadNamespace=acme -v appDomainName=tsmdemo.perfect300rock.com | kubectl apply -f-


#### Redis deployment

A Redis instance is needed for caching the ACME fitness store cart service.. To deploy the Redis instance, run the command below, replacing the _&lt;workloadNamespace> _placeholder with the namespace where the workloads will be deployed and the_ &lt;redisPassword>_ placeholder to an arbitrary password.

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/redis.yaml -v workloadNamespace=&lt;workloadNamespace> -v redisPassword=&lt;redisPassword> | kb apply -f-

For example:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/redis.yaml -v workloadNamespace=acme -v redisPassword=fitness | kubectl apply -f-


#### Run cluster deployment

Workloads are deployed to the run cluster using deliverable_ _resources. This section will apply the deliverable resources directly to the run clusters, as opposed to using a kapp application. This deployment will assume that two clusters are part of the Tanzu Service Mesh GNS ACME. For the sake of naming, we will simply call these clusters RunCluster01 and RunCluster02. 

The deliverable objects will reference the GitOps repository, where the build cluster has written deployment information, and will need to reference this repository in the command below. To deploy the workloads to the run clusters, use the commands below against their respective clusters, and replace the following placeholders:



* **&lt;workloadNamespace>** – Namespace where the workloads will be deployed
* **&lt;gitOpsSecret>** – GitOps secret used to access the GitOps repository
* **&lt;gitOpsRepo>** – URL of the GitOps repository where the build cluster wrote out deployment configuration information

ytt -f cluster01Deliverables.yaml -v workloadNamespace=&lt;workloadNamespace> -v gitOpsSecret=&lt;gitOpsSecret> -v gitOpsRepo=&lt;gitOpsRepo> | kubectl apply -f-

ytt -f cluster02Deliverables.yaml -v workloadNamespace=&lt;workloadNamespace> -v gitOpsSecret=&lt;gitOpsSecret> -v gitOpsRepo=&lt;gitOpsRepo> | kubectl apply -f-

For example:

RunCluster01 deployment:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/cluster01Deliverables.yaml -v workloadNamespace=acme -v gitOpsSecret=tap-play-gitops-secret -v gitOpsRepo=https://github.com/gm2552/tap-play-gitops.git | kubectl apply -f-

RunCluster02 deployment:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/cluster02Deliverables.yaml -v workloadNamespace=acme -v gitOpsSecret=tap-play-gitops-secret -v gitOpsRepo=https://github.com/gm2552/tap-play-gitops.git | kubectl apply -f-


#### Spring Cloud Gateway deployment

The section requires that the Spring Cloud Gateway for Kubernetes package be [installed](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.2/scg-k8s/GUID-installation-tanzu-cli.html) in RunCluster01.

**NOTE: **The Spring Cloud Gateway _spec.service.name _configuration was not built with multi, cross-cluster support. The configuration for the gateway routes implements a workaround for now, which is brittle in terms of where certain services are deployed; however, better support for this use case may come in future releases of the gateway.

The Tanzu Application Platform fork of the ACME fitness store uses Spring Cloud Gateway for routing API classes from the web frontend to the microservices. To deploy the gateway along with applicable routes, run the following command replacing the _&lt;workloadNamespace>_ placeholder with the namespace where the workloads will be deployed.

ytt -f scgInstance.yaml -v workloadNamespace=&lt;workloadNamespace>

ytt -f scgRoutes.yaml -v workloadNamespace=&lt;workloadNamespace>

For example:

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/scgInstance.yaml -v workloadNamespace=acme | kubectl apply -f-

ytt -f https://raw.githubusercontent.com/gm2552/acme-fitness-tap-tsm/main/scgRoutes.yaml -v workloadNamespace=acme | kubectl apply -f-


#### Create a global namespace

Load the Tanzu Service Mesh console and create a new global namespace. Configure the settings below  in each step. The cluster names provided will use the generic placeholder names of RunCluster01 and RunCluster02 and assume a workload namespace of ACME.



1. General details
    1. **GNS name:** acme-tap
    2. **Domain:** acme-tap.lab
2. Namespace mapping
    3. Namespace mapping Rule 1
        1. **Cluster name: **RunCluster01
        2. **Namespace:** acme
    4. Namespace Mapping Rule 2
        3. **Cluster name: **RunCluster02
        4. **Namespace:** acme
3. Autodiscovery (use default settings)
4. Public Services
    5. No Public service.
5. Global server load balancing and resiliency (use default settings)

You can access the application by going to the URL: [http://acme-fitness](http://acmeem-fitness).


### Summary

This process enables customers to set up Tanzu Service Mesh managed clusters and deploy Tanzu Application Platform on these clusters. As demonstrated with the sample application, a global namespace provides a network for Kubernetes workloads that are connected and secured within and across clusters, as well as across clouds.
