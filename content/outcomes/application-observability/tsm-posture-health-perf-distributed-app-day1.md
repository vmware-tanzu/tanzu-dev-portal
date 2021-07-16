---
date: '2021-07-13'
lastmod: '2021-07-13'
layout: single
team:
  - Mark Schweighardt
  - Niran Even-Chen
  - Andrew Huffman
title: "Tanzu Service Mesh: Understand the posture (health and performance) of your distributed application"
weight: 100
---

## Introduction

As microservices applications become more distributed and get deployed across different infrastructures it is becoming more complicated to understand where things live and much harder to manage and troubleshoot. Tanzu Service Mesh helps with that problem by providing the organization with information across different dashboards that allows application owners and operators to understand how their applications are working and their health which makes it also easier to identify where issues are coming from when troubleshooting is required.  

To better understand how to take advantage of the observability capabilities within Tanzu Service mesh let's look at day 1 and day 2 views of the application management with Tanzu Service Mesh.

In very simple terms, a "modern application" is one that the functions and components are broken into a separate set of micro-services. Each function is considered a service, which is an app on its own, where together they create the "Application". These micro-services communicate with each other over the network and because they can be placed on different infrastructures and clouds, it requires the organization to be able to understand the application posture so that it is easier and faster to figure out what is the problem in case that issues arise. 

The following views in Tanzu Service Mesh help the application owner get insight into how the application is built. Each view can be set to 5 minute, 15 minute, 30 minute, and 1 hour data sets. This is configured in the top right hand of the screen.

  * Topology maps - the topology maps, which exist on both the cluster view and the global namespace view, provide a map of the application services, the communication patterns between them and some health status. These maps are generated dynamically by observing the traffic that is flowing between the proxy sidecars on the services and they provide insights into the service dependencies of the application as they instantiated from the traffic patterns.  We can also see some health metrics of those services which we call the "Golden metrics" which are the service's incoming RPS (requests per second), the error rates as seen in the http errors and the P99 Latency to the services response (additional latency metrics can be found in other views). The importance of understanding the dependencies between services in a distributed application is significant as it provides faster detection of cascading as many times issues observed on one service are actually caused by a dependent service. For example, a front end service that seems slow only due to the fact that its data service is overloaded. Knowing how the applications works makes it also easier to know which areas can be bottle necks and even how to model the security policy of the application (which service should talk with which services).  

In the following example you can see the "Global namespace topology map" of an application that is distributed across two clusters in different clouds and the relationship between the services. You can also see the health of the service in a glance by hovering over the specific service and viewing the "Golden metrics". In addition, we can see the amount of RPS that is running between the services. In the top of the screen, you can see the total requests, p99 latency and error rates as well.  
![Tanzu Service Mesh topology map](/images/outcomes/app-observability/tsm-topology-map.png)  
In addition, in the Global namespace screen you can see if there are any issues at a glance by viewing the top status widget. Clicking on it will provide additional information of the status of the globalnamespace:  
![Tanzu Service Mesh Global namespace](/images/outcomes/app-observability/tsm-global-namespace-view.png)
  * Inventory - The inventory pane has 3 boards that show the following:  
    * Services inventory - In this view the operator can see the following:  
      * Services provides with a list of the services that are deployed in this tenant, where they are deployed and the number of instances from each service.  
      ![Tanzu Service Mesh Services catalog](/images/outcomes/app-observability/tsm-services-catalog.png)
      * Service instances - provides a view of all the instances deployed in your organization, their versions and the correlation to the physical environment they are running on  
      ![Tanzu Service Mesh service instances](/images/outcomes/app-observability/tsm-service-instances.png)
      * Service groups - provides a list of the operator-defined service groups from which you can click and get into the specified group  
      ![Tanzu Service Mesh service groups](/images/outcomes/app-observability/tsm-service-groups.png)
      * Infrastructure inventory - In this view you can see the following:  
        * Nodes - a view of all the nodes where you have services running and their nodes information such as number of services on them, instances and performance information        
        ![Tanzu Service Mesh infrastructure inventory](/images/outcomes/app-observability/tsm-infra-inventory.png)
        * Clusters - shows the clusters that are configured in the system, the number of services, nodes, requests and errors on each
        ![Tanzu Service Mesh clusters](/images/outcomes/app-observability/tsm-clusters.png)
      * Global namespaces - shows a list of the configured global namespaces for easier access  
      ![Tanzu Service Mesh global namespaces](/images/outcomes/app-observability/tsm-global-namespaces.png)

