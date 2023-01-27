---
canonical: https://spring.io/blog/2023/01/26/spring-cloud-azure-5-0-is-now-generally-available
date: 2023-01-26
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
title: 'Spring Cloud Azure 5.0 is now Generally Available'
---

<div>
 <p>We?re very pleased to announce that Spring Cloud Azure 5.0 is now generally available.</p>
 <p>This major release includes the following features, improvements, and documentation updates:</p>
 <ul>
  <li>Compatible with Spring Boot 3 and Spring Cloud 2022.0.0</li>
  <li>Supports <a href="https://learn.microsoft.com/azure/developer/intro/passwordless-overview">Passwordless Connections</a></li>
  <li>Updated <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring/">Azure for Spring developers documentation</a> to help Spring developers code, deploy and scale Spring applications on Azure</li>
  <li>Redesigned <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/">Spring Cloud Azure documentation</a> with improved scenarios</li>
 </ul>
 <img src="https://github.com/joshlong/blog-images/raw/master/spring-cloud-azure-5-ga/upgrades.jpg">
 <p>To try Spring Cloud Azure 5.0, simply add the following dependency BOM to your project:</p>
 <pre><code class="prettyprint">&lt;dependencyManagement&gt;
  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;com.azure.spring&lt;/groupId&gt;
      &lt;artifactId&gt;spring-cloud-azure-dependencies&lt;/artifactId&gt;
      &lt;version&gt;5.0.0&lt;/version&gt;
      &lt;type&gt;pom&lt;/type&gt;
      &lt;scope&gt;import&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/dependencyManagement&gt;

</code></pre>
 <h2><a href="#spring-boot-3-and-spring-cloud-2022-0-0-integration" class="anchor" name="spring-boot-3-and-spring-cloud-2022-0-0-integration"></a>Spring Boot 3 and Spring Cloud 2022.0.0 integration</h2>
 <p>Spring Boot 3 and Spring Cloud 2022.0.0 bring many exciting features, requiring some significant changes to Spring Cloud Azure to fully leverage them.</p>
 <h3><a href="#noteworthy-changes-in-this-version" class="anchor" name="noteworthy-changes-in-this-version"></a>Noteworthy changes in this version</h3>
 <ul>
  <li><p>Deprecated API upgrades, <a href="https://github.com/Azure/azure-sdk-for-java/pull/31543">Azure/azure-sdk-for-java#31543</a>:<br><code>com.azure.spring.cloud.autoconfigure.aad.implementation.oauth2.AadOAuth2AuthenticatedPrincipal</code> class removed<br><code>com.azure.spring.cloud.autoconfigure.aad.implementation.webapi.AadOboOAuth2AuthorizedClientProvider</code> class removed<br><code>com.azure.spring.cloud.autoconfigure.aad.properties.AadAuthorizationGrantType</code> class removed<br><code>com.azure.spring.cloud.autoconfigure.aad.AadJwtBearerTokenAuthenticationConverter</code> class removed<br><code>AuthorizationGrantType.PASSWORD</code> no longer supported<br><code>com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier#DefaultJWTClaimsVerifier(com.nimbusds.jwt.JWTClaimsSet, java.util.Set&lt;java.lang.String&gt;)</code> method replaces <code>com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier#DefaultJWTClaimsVerifier()</code><br><code>AbstractHttpConfigurer</code> replaces <code>org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter</code><br><code>spring-cloud-azure-trace-sleuth</code> artifact removed</p></li>
  <li><p>Spring Security 6 dependencies upgrades, <a href="https://Azure/azure-sdk-for-java#31808">Azure/azure-sdk-for-java#31808</a>:<br><code>org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity</code> annotation replaces <code>org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity</code><br><code>org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken</code> class replaces <code>org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken</code></p></li>
  <li><p>Class package path updates and API polishing/refinement, including reducing the number of public APIs: <a href="https://github.com/Azure/azure-sdk-for-java#32552">#32552</a>, <a href="https://github.com/Azure/azure-sdk-for-java#32552">#32582</a>, <a href="https://github.com/Azure/azure-sdk-for-java#32597">#32597</a> , <a href="https://github.com/Azure/azure-sdk-for-java#32616">#32616</a>, <a href="https://Azure/azure-sdk-for-java#32716">#32716</a> .</p></li>
 </ul>
 <p>The following features are planned for future releases:</p>
 <ul>
  <li>GraalVM native image**</li>
  <li>Spring Data Cosmos DB</li>
  <li>App Configuration Config and Feature Management</li>
 </ul>
 <p>** Currently available for beta testing, please visit <a href="https://github.com/Azure/azure-sdk-for-java/tree/feature/spring-boot-3/sdk/spring/spring-cloud-azure-native-reachability">Spring Cloud Azure Native Reachability client library for Java</a> to give it a try.</p>
 <p>Stay tuned for updates!</p>
 <h2><a href="#passwordless-connections" class="anchor" name="passwordless-connections"></a>Passwordless connections</h2>
 <p>Using username/password credentials to access one application from another significantly increases overall risk profile. An unauthorized user can gain access to the application using a connection string accidentally checked into source control, sent through an insecure email, pasted into the wrong chat, or otherwise illegitimately obtained. Updating your application to use passwordless connections provides dramatically improved security.</p>
 <p>Passwordless connections for Java applications to Azure databases and eventing services are generally available with Spring Cloud Azure 5.0, enabling you to access services securely without passing usernames and passwords over the wire.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/spring-cloud-azure-5-ga/passwordless.png">
 <p>These Azure Services currently support passwordless connections:</p>
 <table>
  <thead>
   <tr>
    <th align="left">Azure Service </th>
    <th align="left">Quickstart </th>
    <th align="left">Migration guide </th>
   </tr>
  </thead>
  <tbody>
   <tr>
    <td align="left">Azue Database for MySQL </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-mysql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>, <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-mysql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a> </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-mysql-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=sign-in-azure-cli%2Cjava%2Capp-service%2Capp-service-identity">Delete passwords and migrate</a> </td>
   </tr>
   <tr>
    <td align="left">Azure Database for PostgreSQL </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-postgresql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>, <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql?tabs=passwordless&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a> </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-sql-database-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=java%2Capp-service%2Cassign-role-service-connector">Delete passwords and migrate</a> </td>
   </tr>
   <tr>
    <td align="left">Azure SQL Database </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app?tabs=sqlserver&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JDBC</a>, <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app?tabs=sqlserver&amp;toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json">Spring Data JPA</a> </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-sql-database-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=java%2Capp-service%2Cassign-role-service-connector">Delete passwords and migrate</a> </td>
   </tr>
   <tr>
    <td align="left">Event Hubs ? Kafka </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-kafka-to-passwordless-connection?tabs=azure-portal%2Csign-in-azure-cli%2Cspring-cloud-stream-kafka%2Cservice-connector%2Cassign-role-azure-portal">Spring Cloud Stream Binder for Kafka</a>, <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-kafka-to-passwordless-connection?tabs=azure-portal%2Csign-in-azure-cli%2Cspring-cloud-stream-kafka%2Cservice-connector%2Cassign-role-azure-portal">Spring Kafka</a> </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/migrate-kafka-to-passwordless-connection?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=azure-portal%2Csign-in-azure-cli%2Cjava-kafka%2Cservice-connector%2Cservice-connector-identity%2Cassign-role-service-connector">Delete passwords and migrate</a> </td>
   </tr>
   <tr>
    <td align="left">Storage </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-java?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=powershell%2Cmanaged-identity%2Croles-azure-portal%2Csign-in-azure-cli">Storage Blob</a>, <a href="https://learn.microsoft.com/en-us/azure/storage/queues/storage-quickstart-queues-java?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=powershell%2Cpasswordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli">Storage Queues</a> </td>
    <td align="left"><a href="https://learn.microsoft.com/en-us/azure/storage/common/migrate-azure-credentials?toc=%2Fazure%2Fdeveloper%2Fintro%2Ftoc.json&amp;bc=%2Fazure%2Fdeveloper%2Fintro%2Fbreadcrumb%2Ftoc.json&amp;tabs=roles-azure-portal%2Csign-in-azure-cli%2Cservice-connector%2Cservice-connector-identity%2Cassign-role-service-connector">Delete passwords and migrate</a> </td>
   </tr>
  </tbody>
 </table>
 <p>Our passwordless journey does not end here. Support for additional Azure services is planned and under development.</p>
 <h2><a href="#spring-initializr" class="anchor" name="spring-initializr"></a>Spring Initializr</h2>
 <p>The Azure Support module in Spring Initializr now supports Spring Boot 3, so you can begin your Spring Cloud Azure 5.0 journey directly from the Spring Initializr.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/spring-cloud-azure-5-ga/initializr.png">
 <h2><a href="#documentation" class="anchor" name="documentation"></a>Documentation</h2>
 <p>Good documentation is a key part of Spring Cloud Azure. We?ve created a new online resource, <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring/">Azure for Spring developers</a>, to help Spring developers code, deploy, and scale their Spring applications on Azure. Whether developers are familiar with Spring and unfamiliar with Azure Service or the other way around ? or new to both! ? they can come to this site to learn. Content will be expanded and updated continuously.</p>
 <p>In addition, we?ve redesigned the <a href="https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/">Spring Cloud Azure</a> documentation to help developers more easily find what they need, combined with useful scenarios.</p>
 <img src="https://github.com/joshlong/blog-images/raw/master/spring-cloud-azure-5-ga/docs.png">
 <h2><a href="#other-bug-fixes-and-feature-improvements" class="anchor" name="other-bug-fixes-and-feature-improvements"></a>Other bug fixes and feature improvements</h2>
 <ul>
  <li>Support auto startup for the autoconfigured Service Bus Processor client by enabling new property <code>spring.cloud.azure.servicebus.processor.auto-startup</code> <a href="https://github.com/Azure/azure-sdk-for-java#29997">#29997</a></li>
  <li>Provide property <code>spring.cloud.azure.eventhubs.kafka.enabled</code> to enable/disable Spring Cloud Azure OAuth2 support for Event Hubs for Kafka <a href="https://github.com/Azure/azure-sdk-for-java#30574">#30574</a></li>
  <li>Support connecting to Azure AD via proxy (NOTE: custom <code>RestTemplateCustomizer</code> bean must be provided) <a href="https://github.com/Azure/azure-sdk-for-java#26493">#26493</a></li>
  <li>Support spring-cloud-azure-stream-binder-eventhubs connection to Azure China eventhub <a href="https://github.com/Azure/azure-sdk-for-java#30936">#30936</a></li>
  <li>Resolved issues in Spring Cloud Stream Azure Kafka with Managed Identity credential refresh <a href="https://github.com/Azure/azure-sdk-for-java#30719">#30719</a></li>
  <li>Removed logged warnings for Kafka passwordless autoconfiguration <a href="https://github.com/Azure/azure-sdk-for-java#31182">#31182</a></li>
  <li>Enabled the token authentication converter and Azure AD Resource Server configurer adapter to accept custom JWT granted authorities converter <a href="https://github.com/Azure/azure-sdk-for-java#28665">#28665</a></li>
  <li>Deleted properties <a href="https://github.com/Azure/azure-sdk-for-java#32465">#32465</a>: <code>spring.jms.servicebus.username</code>,<br><code>spring.jms.servicebus.password</code>, <code>spring.jms.servicebus.remote-uri</code></li>
  <li><code>JacksonHttpSessionOAuth2AuthorizedClientRepository.getAuthorizedClients</code> now returns an unmodifiable <code>Map</code> <a href="https://github.com/Azure/azure-sdk-for-java#31190">#31190</a></li>
  <li><code>RestTemplate</code> used to get access token now contains only the two required converters <a href="https://github.com/Azure/azure-sdk-for-java#31482">#31482</a></li>
  <li><code>RestOperations</code> now properly configured when <code>jwkResolver</code> is <code>null</code> <a href="https://github.com/Azure/azure-sdk-for-java#31218">#31218</a></li>
  <li>Fixed duplicated <code>scope</code> parameter <a href="https://github.com/Azure/azure-sdk-for-java#31191">#31191</a></li>
  <li>Updated <code>NimbusJwtDecoder</code> to use <code>RestTemplateBuilder</code> instead of <code>RestTemplate</code> <a href="https://github.com/Azure/azure-sdk-for-java#31233">#31233</a></li>
  <li>Resolved <code>NoClassDefFoundError</code> for <code>JSONArray</code> <a href="https://github.com/Azure/azure-sdk-for-java#31716">#31716</a></li>
  <li>Resolve issues appending <code>spring.main.sources</code> configuration from Spring Cloud Stream Kafka binder <a href="https://github.com/Azure/azure-sdk-for-java#31715">#31715</a></li>
 </ul>
 <h2><a href="#feedback" class="anchor" name="feedback"></a>Feedback</h2>
 <p>Feedback and contributions are always welcome. Please contact us on <a href="https://stackoverflow.com/questions/tagged/spring-cloud-azure">StackOverflow</a> or <a href="https://github.com/Azure/azure-sdk-for-java/issues?q=is%3Aissue%20is%3Aopen%20label%3Aazure-spring">GitHub</a>.</p>
 <h2><a href="#resources" class="anchor" name="resources"></a>Resources</h2>
 <p>To learn more about Spring Cloud Azure, please visit the following links:</p>
 <ul>
  <li><a href="https://microsoft.github.io/spring-cloud-azure/current/reference/html/index.html">Reference documentation</a></li>
  <li><a href="https://aka.ms/spring/msdocs">Conceptual documentation</a></li>
  <li><a href="https://aka.ms/spring/samples">Code samples</a></li>
  <li><a href="https://aka.ms/spring/versions">Spring versions mapping</a></li>
 </ul>
</div>

