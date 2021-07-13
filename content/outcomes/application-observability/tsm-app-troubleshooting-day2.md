---
date: '2021-07-13'
lastmod: '2021-07-13'
layout: single
team:
  - Mark Schweighardt
  - Niran Even-Chen
  - Andrew Huffman
title: "Tanzu Service Mesh: Application Troubleshooting (day 2)"
weight: 102
---

When a distributed application is experiencing issues it's not an easy task to figure out where to look. Tanzu service mesh provides views which can pinpoint faster where problems are coming from and reduce the time to identify the issue. One could start from the views we discussed in the day 1 section to see whether the application is experiencing issues and where the issues are, by looking at the "Golden metrics" and the dependencies between the different services. In addition, Tanzu service mesh provides more extensive views which can become helpful in the troubleshooting task. After identifying an area of possible cause within Tanzu service mesh, the operator would need to use an APM tool like Tanzu Observability to perform more extensive research into the root cause as the problem. APM tools have more capabilities when it comes to providing historical data, performing data analysis and bringing more information such as additional metrics and logs that may not exists in TSM or insights into additional layers that Tanzu service mesh does not touch. The following are the additional views that can be used for troubleshooting:

  * Performance tab - in the performance tab we can see performance information on the services and the infrastructure. While the same information is visible in different places, this is a more granular and focused view of this information for better insights. Each subsection can be viewed as Charts which shows the "golden metrics" for each object or the cards which shows an aggregate of all objects depending on how one opts to view the information:
    * Services - shows each service with its instances and performance information on it: rps, P99 latency and errors rates. Here is the cards view:
    ![Tanzu Service Mesh services cards view](/images/outcomes/app-observability/tsm-services-cards-view.png)  
    Here is the charts view:
    ![Tanzu Service Mesh services charts view](/images/outcomes/app-observability/tsm-services-charts-view.png) 
    * Infrastructure - similarly to the services page in the infrastructure we can see the information on the nodes where the services run in a charts view and a cards view. This covers the nodes' instances count, cpu usage, memory usage, disk usage, and network IO. Here is the cards view:
    ![Tanzu Service Mesh infrastructure cards view](/images/outcomes/app-observability/tsm-infra-cards-view.png)      
    The following is the charts view:  
    ![Tanzu Service Mesh infrastructure charts view](/images/outcomes/app-observability/tsm-infra-charts-view.png)
  * Cluster view - one of the biggest challenges in distributed applications is correlating between physical and logical objects. Tanzu service mesh addresses that in the cluster view and the node heatmaps. When clicking into the cluster we get a few tabs that allow us to dig a bit deeper into our application health with the following views:
    * Service topology - similarly to the Global namespaces topology maps, we can see here a dependencies between he services deployed on the cluster, if we click on any of the services we can see the dependencies clearer with the addition of the node heatmap for these specific services. The node heatmap is very useful to correlate between a service and the nodes they are running on while seeing the health of both. In this way we can pinpoint to a overloaded node or if there are any issues coming from the infrastructure.  
    ![Tanzu Service Mesh service dependencies view](/images/outcomes/app-observability/tsm-service-dependencies-view.png)
    * Performance - for each cluster we have a focused performance tab to see that specific cluster's performance metrics. 
  * Node heatmap - similarly to the cluster node heatmap we have a wide "node heatmap" view where we can see all the services, the nodes they are deployed on and the health of them so that we can better and faster correlate any potential performance issues coming from the nodes
  ![Tanzu Service Mesh node heatmap](/images/outcomes/app-observability/tsm-node-heatmap.png)

