---
canonical: https://spring.io/blog/2022/09/27/delete-passwords-passwordless-connections-for-spring-boot-apps-to-azure-services
date: 2022-09-27
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
title: 'Delete Passwords: Passwordless Connections for Spring Boot  Apps to Azure Services'
---

<div>
 <p> Using username/password credentials to access one application from another presents a huge security risk for many reasons. Today, we are announcing the preview of passwordless connections for Java applications to Azure database and eventing services, letting you finally shift away from using passwords. </p>
 <h2>Security Challenges with Passwords</h2>
 <p>Passwords should be used with caution, and developers must never place passwords in an unsecure location. Many Java applications connect to backend data, cache, messaging, and eventing services using usernames and passwords, <span>or other sensitive credentials such as access tokens or connection strings</span>. If exposed, the passwords could be used to gain unauthorized access to sensitive information such as a sales catalog that you built for an upcoming campaign, or simply all customer data that must be private.</p>
 <p>Embedding passwords in an application itself presents a huge security risk for many reasons, including discovery through a code repository (see Figure 1 below). Many developers externalize such passwords using environment variables so that applications can load them from different environments. However, this only shifts the risk from the code itself to an execution environment. Anyone who gains access to the environment can steal passwords, which in turn, increases your data exfiltration risk.</p>
 <p><span> <img width="540" height="304" src="https://raw.githubusercontent.com/joshlong/blog-images/master/passwordless-connections-2022-09-27/1.jpg"> </span></p>
 <p><i>Figure 1 ? shows Java code with an embedded username and password to connect to a database</i></p>
 <p>Our customers can have strict security requirements to connect to Azure services without exposing passwords to developers, operators, or anyone else. They often use a vault to store and load passwords into applications, and they further reduce the risk by adding password-rotation requirements and procedures. This, in turn, increases the operational complexity and can lead to application connection outages.</p>
 <h2>Passwordless Connections ? Zero-Trust</h2>
 <p>Now you can use passwordless connections in your apps to connect to Azure-based services with a code-free configuration. You no longer need to rotate passwords. Using the principle of "never trust, always verify and credential-free", Zero-Trust helps to secure all communications by trusting machines or users only after verifying identity before granting them access to backend services.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/X6nR3AjIwJw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 <div> <em> "Every password and every Key Vault we have is a potential liability, which adds more overhead and management cost. I'm always happy to see more of the authentication and authorization handled for us and shipped as simple integrations into the Java and Spring ecosystem on Azure. And I won't shed any tears when I delete our Key Vault, now PostgreSQL supports passwordless connections." </em>
 </div>
 <p></p>
 <div style="margin-left: 1em">
  -Jonathan Jones, Lead Solutions Architect, <strong>Swiss Re Management Ltd</strong>. (Switzerland) 
 </div>
 <p></p>
 <p></p>
 <p>Using managed identities and Azure RBAC (role-based access control) combination is the recommended authentication option for secure, passwordless connections from Java applications to Azure services. Developers or operators do not need to manually track and manage many different secrets for managed identities because these tasks are securely handled internally by Azure.</p>
 <p>You can configure passwordless connections to Azure services using <a href="https://learn.microsoft.com/azure/service-connector/overview">Service Connector</a> (see Figure 2 below), or you can manually configure them. Service Connector enables managed identities in app hosting services like Azure Spring Apps, App Service and Azure Container Apps. It configures backend services with passwordless connections using managed identities and Azure RBAC, and supplies applications with necessary connection information ? no more passwords.</p>
 <p><img border="0" width="540" height="182" src="https://raw.githubusercontent.com/joshlong/blog-images/master/passwordless-connections-2022-09-27/3.png"></p>
 <p><i>Figure 2 ? Service Connector configures passwordless connection for a Java app to a PostgreSQL database</i></p>
 <p>If you inspect the running environment of an application configured for passwordless connections, you can see the full connection string. For example, Figure 3 shows how it carries database server address, database name, and an instruction to delegate authentication to Microsoft?s Azure?s JDBC authentication plugin.</p>
 <p><img border="0" width="540" height="306" src="https://raw.githubusercontent.com/joshlong/blog-images/master/passwordless-connections-2022-09-27/4.jpg"></p>
 <p><i>Figure 3 ? datasource configuration ?spring.datasource.url? shows passwordless connection</i></p>
 <p>Let?s consider a Spring Boot application that connects to a PostgreSQL database that uses Spring Cloud Azure starter. The starter composes a connection string without password for a Spring Data JPA module. From the connection string, the driver understands that it must load the Azure?s JDBC authentication plugin which uses the Azure Identity Client Library to get an access token. The driver logs into a database using the token as password - no more passwords. </p>
 <p>For local development and testing, developers can use the same arrangement to connect to services without using passwords. You will authenticate through Azure CLI, IntelliJ or any development tool and use that identity to secure access for the application to connect with Azure services without passwords. </p>
 <h2>Learn More and Delete Passwords!</h2>
 <p>You can shift away from using passwords in your apps. Migrate your existing Java applications to use passwordless connections for Azure services today!</p>
 <p><span>Read more about passwordless connections ? </span><a href="https://aka.ms/Delete-Passwords"><span>https://aka.ms/Delete-Passwords</span></a></p>
 <h2>Resources</h2>
 <table>
  <tbody>
   <tr>
    <td>Azure Service</td>
    <td>Java Quickstart</td>
    <td>Spring Quickstart</td>
    <td>Migration Guide</td>
   </tr>
   <tr>
    <td> Azure Database for MySQL</td>
    <td><a href="https://learn.microsoft.com/en-us/azure/mysql/single-server/connect-java?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=passwordless">JDBC</a></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-mysql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>
     </div>
     <div><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-mysql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-mysql-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=sign-in-azure-cli%2Cjava%2Capp-service%2Capp-service-identity">Delete passwords</a>
     </div></td>
   </tr>
   <tr>
    <td>
     <div>
      Azure Database for PostgreSQL
     </div></td>
    <td><a href="https://learn.microsoft.com/en-us/azure/postgresql/single-server/connect-java?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=passwordless">JDBC</a></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>
     </div>
     <div><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-postgresql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-postgresql-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=sign-in-azure-cli%2Cjava%2Cservice-connector%2Cservice-connector-identity%2Cassign-role-service-connector">Delete passwords</a>
     </div></td>
   </tr>
   <tr>
    <td> Azure SQL Database</td>
    <td> JDBC ? coming soon</td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app?tabs=sqlserver&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>
     </div>
     <div><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app?tabs=sqlserver&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-sql-database-to-passwordless-connection?tabs=java%2Cservice-connector%2Cservice-connector-identity%2Cassign-role-service-connector">Delete passwords</a>
     </div></td>
   </tr>
   <tr>
    <td> Event Hubs ? Kafka </td>
    <td> <a href="https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-kafka-enabled-event-hubs?tabs=passwordless">Apache Kafka</a> </td>
    <td> <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Cloud Stream Binder for Kafka</a> </td>
    <td> <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-kafka-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=azure-portal%2Csign-in-azure-cli%2Cjava-kafka%2Cservice-connector%2Cservice-connector-identity%2Cassign-role-service-connector">Delete passwords</a> </td>
   </tr>
   <tr>
    <td colspan="4"><a href="https://learn.microsoft.com/en-us/azure/storage/common/multiple-identity-scenarios?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=java">Developer guide</a></td>
   </tr>
  </tbody>
 </table>
 <p>You can use Service Connector to configure passwordless connections from Azure ?compute? services such as Azure Spring Apps, App Service, Azure Container Apps, Azure Kubernetes Service and Virtual Machines to backend services:</p>
 <table>
  <tbody>
   <tr>
    <td> Service Connector</td>
    <td> Azure Spring Apps</td>
    <td> App Service</td>
    <td> Azure Container Apps</td>
   </tr>
   <tr>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/service-connector/how-to-integrate-sql-database">Azure SQL Database</a>
     </div>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/service-connector/how-to-integrate-mysql">Azure Database for MySQL</a>
     </div>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/service-connector/how-to-integrate-postgres">Azure Database for PostgreSQL</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/spring-apps/connect-managed-identity-to-azure-sql?tabs=service-connector">Integrate with SQL Database</a>
     </div>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/spring-apps/how-to-bind-mysql?tabs=Passwordless">Integrate with MySQL</a>
     </div>
     <div><a href="https://learn.microsoft.com/en-us/azure/spring-apps/how-to-bind-postgres?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=Passwordless">Integrate with PostgreSQL</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/app-service/tutorial-java-tomcat-connect-managed-identity-postgresql-database?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Tutorial</a>
     </div></td>
    <td>
     <div>
      <a href="https://learn.microsoft.com/en-us/azure/container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Tutorial</a>
     </div></td>
   </tr>
  </tbody>
 </table>
 <p>Check out this ready-to-deploy sample code for <a href="https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps/tree/main/SpringBoot">Spring Boot</a></p>
 <p></p>
 <p>Want to learn more about Azure Spring Apps and the ways you can leverage Spring on Microsoft Azure? <strong>SpringOne 2022</strong> is almost here! I feel like it?s that anxious, exciting time before sort of important holiday where you get given gifts! And with it, Spring Boot 3 and Spring Framework 6. We?re going to be announcing everything right here on the Spring blog, of course, but if you want a chance to learn from the source, then I hope you?ll join us 6-8 December, 2022, right here in my hometown of San Francisco, my favorite west coast city in the USA, and my hometown. (Psst.: If you register now, there?s a $200 discount from the pass price with this code <code>S1VM22_Advocate_200</code>.)</p>
 <p></p>
 <p></p>
</div>

