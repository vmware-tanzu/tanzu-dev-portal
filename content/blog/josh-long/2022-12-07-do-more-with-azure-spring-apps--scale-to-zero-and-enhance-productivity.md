---
canonical: https://spring.io/blog/2022/12/07/do-more-with-azure-spring-apps-scale-to-zero-and-enhance-productivity
date: 2022-12-07
description: 
featured: false
patterns:
- Deployment
tags:
- Spring
- Kubernetes
- DevOps
- Microservices
- Integration
- Data
- Batch
- Cloud
team:
- Josh Long
title: 'Do more with Azure Spring Apps ??? scale to zero and enhance productivity'
---

<div>
 <p>In 2020, Spotify coined the term <a href="https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem/">"Golden Path?</a> to refer to a supported approach and set of components to build and deploy software. Having these paths simplifies the development process, lets developers focus on their applications instead of infrastructure and speeds time to production. Microsoft and VMware have partnered to make Azure Spring Apps a golden path for deploying and scaling Spring applications in the cloud. And with new capabilities like the scale to zero and developer productivity enhancements, Azure Spring Apps now offers an even more economical and optimized route to get your Spring applications into production.</p>
 <h2><a href="#1-start-from-zero-and-scale-to-zero-consumption-plan" class="anchor" name="1-start-from-zero-and-scale-to-zero-consumption-plan"></a>1. Start from zero and scale to zero ? consumption plan</h2>
 <p>We are introducing a new consumption pricing plan for Azure Spring Apps ? you can start from zero and scale to zero vCPU for efficient resource utilization. With this serverless application-centric plan, apps can scale in response to HTTP requests, events, or simply run as always-on background jobs. The consumption plan does not have a base unit. You can scale to zero and pause billing when apps are not in use. You can use this new plan to build or migrate web apps and web API endpoints, event-driven processing apps, microservice apps, and many more. </p>
 <p>The consumption plan is in private preview. If you would like to try, <a href="https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR9e_wit0rN5LkLw5ybHCSYxUNkxHRDFHMkdNTDNFV1dCWE1CREZKSDRHNi4u">please sign up</a> </p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/ASA-Consumption-Plan-2.jpg">
 <p>Figure 1 ? introduces the Azure Spring Apps consumption plan</p>
 <h2><a href="#2-enhanced-developer-productivity-in-azure-spring-apps-enterprise" class="anchor" name="2-enhanced-developer-productivity-in-azure-spring-apps-enterprise"></a>2. Enhanced developer productivity in Azure Spring Apps Enterprise</h2>
 <h3><a href="#2-1-application-accelerators" class="anchor" name="2-1-application-accelerators"></a>2.1 Application Accelerators</h3>
 <p><a href="https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-accelerator?tabs=Portal">Application Accelerators</a> speed up the process of building and deploying applications. They help you to bootstrap developing your applications and deploy them in a discoverable and repeatable way. Enterprise architects can author and publish accelerator projects that provide developers and app operators in their organization with ready-made, enterprise-conformant code, and configurations. Published accelerators are maintained in Git repositories. The Application Accelerators interface lets you discover available accelerators, configure them, and generate new projects. Application Accelerators (see Figure 2 below) are now available in preview for everyone to use.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/application-accelerators.jpg">
 <p>Figure 2 ? shows Application Accelerators</p>
 <h3><a href="#2-2-application-live-view" class="anchor" name="2-2-application-live-view"></a>2.2 Application Live View</h3>
 <p><a href="https://learn.microsoft.com/en-us/azure/spring-apps/monitor-apps-by-application-live-view">Application Live View</a> is a lightweight insight and troubleshooting tool based on Spring Boot Actuators that helps app developers and app operators look inside running apps. Applications provide information from inside the running processes using HTTP endpoints. Application Live View uses those endpoints to retrieve and interact with the data from applications. </p>
 <p>You can use Application Live View to inspect application info, health, environment, log levels (see Figure 4 below), JVM statistics (see Figure 3 below), HTTP requests, caches, sessions, scheduled tasks, beans, metrics, and more. Application Live View is now available in preview for everyone to use.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/catalog-service-memory-7.jpg">
 <p>Figure 3 ? Application Live View shows memory usage and GC activities for a Spring app instance</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/app-live-view-log-levels.jpg">
 <p>Figure 4 ? Application Live View shows log levels for a Spring app instance</p>
 <h3><a href="#2-3-web-servers-buildpack" class="anchor" name="2-3-web-servers-buildpack"></a>2.3 Web Servers Buildpack</h3>
 <p>You can use the Tanzu Web Servers buildpack to build applications that run web servers like NGINX or Apache HTTP Server. You can use the buildpack for applications that serve static content or build JavaScript source code into production-ready static assets, then automatically configure a web server to serve those assets. Web Servers buildpack support is generally available.</p>
 <h2><a href="#3-spring-framework-6-and-spring-boot-3" class="anchor" name="3-spring-framework-6-and-spring-boot-3"></a>3. Spring Framework 6 and Spring Boot 3</h2>
 <p>In addition to deploying apps built using Spring Boot 2 and Spring Framework 5, you can now deploy and scale apps built using <a href="https://spring.io/blog/2022/11/24/spring-boot-3-0-goes-ga">Spring Boot 3</a> and <a href="https://spring.io/blog/2022/11/16/spring-framework-6-0-goes-ga">Spring Framework 6</a>. Spring Boot 3 includes Java 17 baseline, improved observability with Micrometer and Micrometer Tracing, support for Jakarta EE 10, and many more new features. Support for Spring Boot 3 and Spring Framework 6 is now in preview for everyone to use.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/SB3-SF6.jpg">
 <p>Figure 5 ? deploy and scale Spring Boot 3 and Spring Framework 6 apps on Azure</p>
 <p>Azure Spring Apps will support the latest Spring Boot, Spring Framework, and Spring Cloud major versions starting 30 days after their release. The latest minor versions will be supported as soon as they are released. The Basic and Standard tiers follow the OSSsupported versions and the Enterprise tier carries extended commercial support through VMware Spring Runtime Support entitlements.</p>
 <h2><a href="#4-more-new-features-to-enhance-productivity" class="anchor" name="4-more-new-features-to-enhance-productivity"></a>4. More new features to enhance productivity</h2>
 <h3><a href="#4-1-grpc-and-websocket-support" class="anchor" name="4-1-grpc-and-websocket-support"></a>4.1 gRPC and WebSocket support</h3>
 <p>The gRPC is a high-performance remote procedure call (RPC) framework that can run in any environment. It provides bi-directional streaming. gRPC services can be defined using protocol buffers, a powerful binary serialization toolset, and language, and provides tools for generating clients and servers across different languages. Now you can deploy Spring apps with gRPC support in Azure Spring Apps. </p>
 <p>The WebSocket protocol defines an important capability for web applications: full-duplex, two-way communication between client and server. You can also deploy Spring apps with WebSocket support in Azure Spring Apps.<br>gRPC and WebSocket support are in preview for everyone to use.</p>
 <h3><a href="#4-2-connect-to-app-instance-shell-environment-for-troubleshooting" class="anchor" name="4-2-connect-to-app-instance-shell-environment-for-troubleshooting"></a>4.2 Connect to app instance shell environment for troubleshooting</h3>
 <p>Azure Spring Apps offers many ways to troubleshoot your applications. For developers who like to inspect an app instance running environment, you can <a href="https://learn.microsoft.com/en-us/azure/spring-apps/how-to-connect-to-app-instance-for-troubleshooting?tabs=azure-portal">connect to the app instance?s shell environment</a> and troubleshoot it (see Figure 6 below). </p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/connect-to-app-shell-environment-3.jpg">
 <p>Figure 6 ? show how to connect to an app instance?s shell environment and inspect the environment</p>
 <h3><a href="#4-3-debug-your-apps-remotely-in-azure-spring-apps" class="anchor" name="4-3-debug-your-apps-remotely-in-azure-spring-apps"></a>4.3 Debug your apps remotely in Azure Spring Apps</h3>
 <p>Now, you can <a href="https://learn.microsoft.com/en-us/azure/spring-apps/how-to-remote-debugging-app-instance?tabs=portal%2CIntellij-extension">remotely debug</a> your apps in Azure Spring Apps using IntelliJ (see Figure 7 below) or VS Code. For security reasons, by default, Azure Spring Apps disables remote debugging. You can enable remote debugging for your apps using Azure Portal or Azure CLI and start debugging. </p>
 <p>Remote debugging support is generally available.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/remote-debug-spring-apps.jpeg">
 <p>Figure 7 ? shows how to start remote debugging using IntelliJ</p>
 <h3><a href="#4-4-service-stop-start-is-now-generally-available" class="anchor" name="4-4-service-stop-start-is-now-generally-available"></a>4.4 Service Stop/Start is now generally available</h3>
 <p>You can stop and start your Azure Spring Apps service instance to help you save costs. If you were to stop and start your development and test environment Azure Spring Apps service instances to match your work hours, you could save up to 75%*.</p><span style="font-size:smaller;">\* Assuming usage of Azure Spring Apps service instances for 40 hours a week, then you could save up to 75% by stopping those instances during inactive times. (168 hours - 40 hours) / 168 hours = 75%.</span>
 <h2><a href="#5-try-today" class="anchor" name="5-try-today"></a>5. Try Today</h2>
 <p>In 2019, Microsoft and VMware announced Azure Spring Apps, a fully managed service for Spring applications. We set out to solve many of the common challenges enterprise developers face when running Spring applications at scale. Azure Spring Apps is a golden path to production in the cloud and you can get started today ? <a href="https://learn.microsoft.com/en-us/azure/spring-apps/quickstart?tabs=Azure-CLI&amp;pivots=programming-language-java">deploy</a> your first Spring app to Azure! </p>
 <p>To help you get started, we have <a href="https://aka.ms/costs-less">monthly FREE</a> grants on all tiers ? 50 vCPU Hours and 100 memory GB Hours per tier. These are the number of FREE hours per month BEFORE any usage is billed. </p>
 <img src="https://github.com/joshlong/blog-images/raw/master/do-more-with-spring-boot-3-2022-12-07/Monthly-Free-Grants-3.jpg">
 <h2><a href="#additional-resources" class="anchor" name="additional-resources"></a>Additional Resources</h2>
 <ul>
  <li>Learn using an <a href="https://learn.microsoft.com/en-us/training/modules/azure-spring-cloud-workshop/">MS Learn module</a> or <a href="https://github.com/microsoft/azure-spring-cloud-training">self-paced workshop</a> on GitHub</li>
  <li><a href="https://github.com/Azure-Samples/acme-fitness-store">Deploy</a> the demo Fitness Store Spring Boot app to Azure</li>
  <li><a href="https://github.com/azure-samples/animal-rescue">Deploy</a> the demo Animal Rescue Spring Boot app to Azure</li>
  <li>Learn <a href="https://learn.microsoft.com/en-us/azure/spring-apps/">more</a> about implementing solutions on Azure Spring Apps</li>
  <li>Deploy Spring Boot apps by leveraging enterprise best practices ? <a href="https://learn.microsoft.com/en-us/azure/spring-apps/reference-architecture?tabs=azure-spring-standard">Azure Spring Apps Reference Architecture</a></li>
  <li>Migrate your <a href="https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps">Spring Boot</a>, <a href="https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-spring-cloud-to-azure-spring-apps?pivots=sc-standard-tier">Spring Cloud</a>, and <a href="https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-tomcat-to-azure-spring-apps">Tomcat</a> applications to Azure Spring Apps</li>
  <li>Wire Spring applications to <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/">interact with Azure services</a></li>
 </ul>
</div>

