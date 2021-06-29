---
date: 2020-05-27
description: Spring Security is an extremely powerful and highly customizable framework
  that provides authentication, authorization, and protection against common attacks,
  it is the de-facto standard for securing Spring-based applications.
lastmod: '2021-04-22'
team:
- Juan Jose Ramos
title: Spring Security & Geode
type: blog
---

## Introduction
[Apache Geode](https://geode.apache.org/) is an in-memory data grid that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Starting with Geode 1.0.0, the *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* interface was introduced to manage the authentication and authorization mechanisms in a single place, simplifying the implementation and interactions with all components in a consistent manner.

[Spring Security](https://spring.io/projects/spring-security) is an extremely powerful and highly customizable framework that provides authentication, authorization, and protection against common attacks, it is the de-facto standard for securing Spring-based applications.

## Why?
To secure an [Apache Geode](https://geode.apache.org/) cluster, the user needs to provide a custom implementation for the *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* interface, so that the authentication and authorization logic is entirely encapsulated within the implementation itself.

The above is, generally speaking, a pretty straightforward task: connect to the external data source (database, LDAP server, text file, etc.) where users and roles are loaded from, validate the user and password, and load into the user object the required roles. I’m oversimplifying things here but, in general, it’s certainly pretty straightforward.

The problem, though, is the huge amount of boilerplate code we need to write and test to get this working: connect and manage the pool of connections to the database or active directory server, encode/decode the passwords, handle errors and checked exceptions, the list goes on and on…

How would we feel if, once that everything’s up and running, a customer requests to change the datastore where the credentials are loaded from? (remember: no matter what the context is, ***the customer is always right!)***… ugh! we’ll have to start from scratch!!.

Why would we want to develop a tool to authenticate users against a database, if *[spring-security](https://spring.io/projects/spring-security)* already provides those implementations, fully tested and supported by the community, out of the box?. On the same page, why would we want to deal with the low-level code required to access and search an LDAP server, if *[spring-security](https://spring.io/projects/spring-security)* also does that for us?. The answer is easy: we don’t want to deal with all that low-level stuff and boilerplate code anymore, we just want to focus on our use case and business needs, that’s it.

So why reinvent the wheel and implement the *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* to do the same things *[spring-security](https://spring.io/projects/spring-security)* already does for us?, it’s way easier (and more secure) to just choose an existing *[AuthenticationProvider](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/AuthenticationProvider.html)* and integrate it with our *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* instead.

## How?
   We will implement a *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* that, for authentication purposes, simply delegates to an already configured *[AuthenticationManager](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/AuthenticationManager.html)*, provided (and previously initialized) by *[spring-security](https://spring.io/projects/spring-security)*. For the authorization part, we’ll just verify whether or not the principal has granted permission to carry out the operation.
   
### GeodeGrantedAuthority
Apache Geode uses the *[ResourcePermission](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/ResourcePermission.java)* class to define the resource, operation, region, and the key involved in the action to be authorized. Instances of this class are passed into the *[SecurityManager.authorize](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java#L78)* method to determine whether to allow or deny the operation.

[Spring-Security](https://spring.io/projects/spring-security), instead, uses the *[GrantedAuthority](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/GrantedAuthority.html)* class to represent an authority granted to a principal.

To connect both implementations, we’ll define a wrapper class, *GeodeGrantedAuthority*, that simply implements the *[GrantedAuthority](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/GrantedAuthority.html)* interface from [spring-security](https://spring.io/projects/spring-security) and encapsulates a *[ResourcePermission](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/ResourcePermission.java)* instance from [Apache Geode](https://geode.apache.org/).

```java
public class GeodeGrantedAuthority implements GrantedAuthority {
  private final ResourcePermission resourcePermission;

  public ResourcePermission getResourcePermission() {
    return resourcePermission;
  }

  public GeodeGrantedAuthority(String resource, String operation, String target, String key) {
    this.resourcePermission = new ResourcePermission(resource, operation, target, key);
  }

  @Override
  public String getAuthority() {
    return resourcePermission.toString();
  }
}
```

### GeodeAuthoritiesMapper
We don’t want to change our current stored roles and/or authorities, though, no matter what they are or how they are represented, to match the ones used by [Apache Geode](https://geode.apache.org/).

Instead, and to integrate both representations seamlessly, we’ll implement the *[GrantedAuthoritiesMapper](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/authority/mapping/GrantedAuthoritiesMapper.html)* interface, which can be injected into the authentication layer to convert the authorities loaded from the storage into those which will be stored in the *[Authentication](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/Authentication.html)* object.

```java
public class GeodeAuthoritiesMapper implements GrantedAuthoritiesMapper {
  public static final String INVALID_AUTHORITY_ERROR = "The authority can not be mapped to a valid Geode ResourcePermission: ";

  GeodeGrantedAuthority parseAuthority(String stringAuthority) {
    try {
      // TODO: Mapping logic here.
    } catch (Exception exception) {
      throw new IllegalArgumentException(INVALID_AUTHORITY_ERROR + stringAuthority, exception);
    }
  }

  @Override
  public Collection<? extends GrantedAuthority> mapAuthorities(Collection<? extends GrantedAuthority> authorities) {
    Collection<GeodeGrantedAuthority> geodeGrantedAuthorities = new ArrayList<>();
    authorities.forEach(grantedAuthority -> geodeGrantedAuthorities.add(parseAuthority(grantedAuthority.getAuthority())));

    return geodeGrantedAuthorities;
  }
}
```

### GeodeAuthenticationProvider
Even though the *[GrantedAuthoritiesMapper](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/authority/mapping/GrantedAuthoritiesMapper.html)* interface is public and supposed to be implemented to convert loaded authorities from storage during the authentication phase, not every *[AuthenticationProvider](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/AuthenticationProvider.html)* has a public setter method to configure it (at least I couldn’t find it).

That said, the whole purpose of the *[GeodeAuthenticationProvider](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html)* class is to make that setter method available to users, it simply delegates everything else to the parent DaoAuthenticationProvider class.

```java
public class GeodeAuthenticationProvider extends DaoAuthenticationProvider {

  @Override
  public void setAuthoritiesMapper(GrantedAuthoritiesMapper authoritiesMapper) {
    super.setAuthoritiesMapper(authoritiesMapper);
  }
}
```

### SpringSecurityManager
This is the main class, which implements the [SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java) interface from [Apache Geode](https://geode.apache.org/) and encapsulates both the authentication and authorization logic.

During initialization, we create the application context using the properties passed by [Apache Geode](https://geode.apache.org/) to the *[SecurityManager.init](http://more%20easily%20and%20quickly%2C/)* method, and obtain the single configured *[AuthenticationManager](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/AuthenticationManager.html)* instance.

We only require a single property to work: *security-spring-security-xml*, which should refer to the spring-security XML configuration. To load the application context, we use the *[FileSystemXmlApplicationContext](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/support/FileSystemXmlApplicationContext.html)* class, so the configuration file itself could be either in the filesystem *(“file:/path/to/file.xml”)* or within the classpath *(“classpath:/path/to/file.xml”)*. The “beauty” of this approach is that we can change the authentication layer entirely by just pointing to another configuration file, **without changing a single line of code**.

```java
@Override
public void init(Properties securityProps) {
  if (!securityProps.containsKey(SECURITY_CONFIGURATION_XML)) {
    throw new IllegalArgumentException(NO_SECURITY_CONFIGURATION_FOUND_ERROR);
  }

  if (springContext == null) {
    synchronized (LOCK) {
      if (springContext == null) {
        String springConfigurationPath = securityProps.getProperty(SECURITY_CONFIGURATION_XML);
        springContext = new FileSystemXmlApplicationContext(springConfigurationPath);
        springContext.registerShutdownHook();
      }
    }
  }

  authenticationManager = springContext.getBean(AuthenticationManager.class);
}
```

For the authentication part, we just obtain the credentials passed by [Apache Geode](https://geode.apache.org/) and delegate to the already initialized *[AuthenticationManager](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/authentication/AuthenticationManager.html)* instance.

```java
@Override
public Object authenticate(Properties credentials) throws AuthenticationFailedException {
  String user = credentials.getProperty(USER_NAME);
  String password = credentials.getProperty(PASSWORD);
  Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user, password));

  if (authentication == null) {
    throw new AuthenticationFailedException(INVALID_CREDENTIALS_ERROR);
  }

  return authentication;
}
```

For the authorization part, we just get the *[GrantedAuthority](https://javadoc.io/doc/org.springframework.security/spring-security-core/latest/org/springframework/security/core/GrantedAuthority.html)* list (all were transformed by our *GeodeAuthoritiesMapper* already) from the principal passed by [Apache Geode](https://geode.apache.org/) and decide whether it has the required permissions to execute the action or not.

```java
@Override
public boolean authorize(Object principal, ResourcePermission context) {
  Authentication authentication = (Authentication) principal;
  Collection<? extends GrantedAuthority> grantedAuthorities = authentication.getAuthorities();

  for (GrantedAuthority grantedAuthority : grantedAuthorities) {
    if (grantedAuthority instanceof GeodeGrantedAuthority) {
      GeodeGrantedAuthority geodeGrantedAuthority = (GeodeGrantedAuthority) grantedAuthority;

      if (geodeGrantedAuthority.getResourcePermission().implies(context)) {
        return true;
      }
    }
  }

  return false;
}
```

## Examples
The code itself is simple and self-explanatory, the only “hard part” is configuring *[spring-security](https://spring.io/projects/spring-security)* using the “old-school” XML approach instead of the new annotation or java configuration options (sorry about that, I still prefer to configure things step by step using XML, which in this case also has the benefit of not shipping the configuration with the actual implementation).

### Compile and Deploy
The first step is to download the project and build it, we’ll also need to add some dependencies to the [Apache Geode](https://geode.apache.org/) member’s classpath later on, so it’s a good time to get the dependencies generated now.

```
geode-spring-security (master): ./gradlew build copyDependencies

BUILD SUCCESSFUL in 2m 20s
6 actionable tasks: 6 executed
```

### Update Member Configuration
There are some extra libraries required for the integration to work as they’re not included in the member’s classpath by default. We have to carefully chose the spring version to match the one used by [Apache Geode](https://geode.apache.org/), having different versions of the same library within the class path can cause several headaches…

Below is the list of extra libraries that need to be added, all can be found under the directory build/dependencies (copied by the *copyDependencies* [gradle](https://gradle.org/) task):

```
ls -l /workspace/extraLibs/
geode-spring-security-1.0.0.jar
spring-aop-5.2.1.RELEASE.jar
spring-beans-5.2.1.RELEASE.jar
spring-context-5.2.1.RELEASE.jar
spring-expression-5.2.1.RELEASE.jar
spring-security-config-5.2.1.RELEASE.jar
spring-security-core-5.2.1.RELEASE.jar
```

Aside from that, we’ll also need to define some extra properties for Apache Geode to pick up our *[SecurityManager](https://github.com/apache/geode/blob/support/1.13/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* implementation (see [here](https://geode.apache.org/docs/guide/112/managing/security/enable_security.html)), and to allow our servers to authenticate against the running locator.

```
/workspace/config/locator.properties
security-manager=org.apache.geode.tools.security.SpringSecurityManager
security-spring-security-xml=file:/workspace/config/inMemory-security-config.xml
/workspace/config/server.properties
security-username=clusterManager
security-password=clusterManagerPassword
security-spring-security-xml=file:/workspace/config/inMemory-security-config.xml
/workspace/config/inMemory-security-config.xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/security"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:beans="http://www.springframework.org/schema/beans"
             xsi:schemaLocation="
                http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security.xsd">
<user-service id="inMemoryUserDetailsManager">
        <user name="clientReader" password="{noop}clientReaderPassword" authorities="DATA:READ"/>
        <user name="clientWriter" password="{noop}clientWriterPassword" authorities="DATA:WRITE"/>
        <user name="clusterReader" password="{noop}clusterReaderPassword" authorities="CLUSTER:READ"/>
        <user name="clusterManager" password="{noop}clusterManagerPassword" authorities="CLUSTER:MANAGE"/>
    </user-service>
<beans:bean id="geodeAuthenticationProvider" class="org.apache.geode.tools.security.GeodeAuthenticationProvider">
        <beans:property name="authoritiesMapper">
            <beans:bean class="org.apache.geode.tools.security.GeodeAuthoritiesMapper"/>
        </beans:property>
        <beans:property name="userDetailsService" ref="inMemoryUserDetailsManager"/>
</beans:bean>
<authentication-manager>
        <authentication-provider ref="geodeAuthenticationProvider"/>
    </authentication-manager>
</beans:beans>
```

### Start The Cluster
Now that all configuration steps are done, it’s time to start our secured Apache Geode cluster!.

```
gfsh>set variable --name=CURRENT_DIRECTORY --value=/workspace
Value for variable CURRENT_DIRECTORY is now: /workspace.
------------------------------------------------------------------
gfsh>start locator --name=locator1 --security-properties-file=${CURRENT_DIRECTORY}/config/locator.properties --classpath=${CURRENT_DIRECTORY}/extraLibs/geode-spring-security-1.0.0.jar:${CURRENT_DIRECTORY}/extraLibs/spring-security-core-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-security-config-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-context-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-beans-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-aop-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-expression-5.2.1.RELEASE.jar
Starting a Geode Locator in /Users/jramos/Desktop/Tickets/temporal/locator1...
........
Locator in /Users/jramos/Desktop/Tickets/temporal/locator1 on 192.168.8.102[10334] as locator1 is currently online.
Process ID: 56700
Uptime: 9 seconds
Geode Version: 1.12.0
Java Version: 1.8.0_221
Log File: /Users/jramos/Desktop/Tickets/temporal/locator1/locator1.log
JVM Arguments: -DgemfireSecurityPropertyFile=/Users/jramos/Desktop/Tickets/temporal/config/locator.properties -Dgemfire.enable-cluster-configuration=true -Dgemfire.load-cluster-configuration-from-dir=false -Dgemfire.launcher.registerSignalHandlers=true -Djava.awt.headless=true -Dsun.rmi.dgc.server.gcInterval=9223372036854775806
Class-Path: /Users/jramos/Applications/Apache/Geode/1.12.0/apache-geode-1.12.0/lib/geode-core-1.12.0.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/geode-spring-security-1.0.0.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-security-core-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-security-config-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-context-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-beans-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-aop-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-expression-5.2.1.RELEASE.jar:/Users/jramos/Applications/Apache/Geode/1.12.0/apache-geode-1.12.0/lib/geode-dependencies.jar
Unable to auto-connect (Security Manager may be enabled). Please use "connect --locator=192.168.8.102[10334] --user --password" to connect Gfsh to the locator.
Authentication required to connect to the Manager.
------------------------------------------------------------------
gfsh>start server --name=server1 --security-properties-file=${CURRENT_DIRECTORY}/config/server.properties --locators=localhost[10334] --classpath=${CURRENT_DIRECTORY}/extraLibs/geode-spring-security-1.0.0.jar:${CURRENT_DIRECTORY}/extraLibs/spring-security-core-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-security-config-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-context-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-beans-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-aop-5.2.1.RELEASE.jar:${CURRENT_DIRECTORY}/extraLibs/spring-expression-5.2.1.RELEASE.jar
Starting a Geode Server in /Users/jramos/Desktop/Tickets/temporal/server1...
.....
Server in /Users/jramos/Desktop/Tickets/temporal/server1 on 192.168.8.102[40404] as server1 is currently online.
Process ID: 56756
Uptime: 6 seconds
Geode Version: 1.12.0
Java Version: 1.8.0_221
Log File: /Users/jramos/Desktop/Tickets/temporal/server1/server1.log
JVM Arguments: -DgemfireSecurityPropertyFile=/Users/jramos/Desktop/Tickets/temporal/config/server.properties -Dgemfire.locators=localhost[10334] -Dgemfire.start-dev-rest-api=false -Dgemfire.use-cluster-configuration=true -XX:OnOutOfMemoryError=kill -KILL %p -Dgemfire.launcher.registerSignalHandlers=true -Djava.awt.headless=true -Dsun.rmi.dgc.server.gcInterval=9223372036854775806
Class-Path: /Users/jramos/Applications/Apache/Geode/1.12.0/apache-geode-1.12.0/lib/geode-core-1.12.0.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/geode-spring-security-1.0.0.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-security-core-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-security-config-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-context-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-beans-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-aop-5.2.1.RELEASE.jar:/Users/jramos/Desktop/Tickets/temporal/extraLibs/spring-expression-5.2.1.RELEASE.jar:/Users/jramos/Applications/Apache/Geode/1.12.0/apache-geode-1.12.0/lib/geode-dependencies.jar
```

At this point the secured cluster is up and running, we must provide a valid user and password to be able to connect to it, and make sure we have the required privileges to execute the operations we want.

```
------------------------------------------------------------------
Valid User - CLUSTER:MANAGE authority not granted
------------------------------------------------------------------
gfsh>connect --user=clusterReader --password=clusterReaderPassword
Connecting to Locator at [host=localhost, port=10334] ..
Connecting to Manager at [host=192.168.8.102, port=1099] ..
Successfully connected to: [host=192.168.8.102, port=1099]
gfsh>shutdown --include-locators=true
As a lot of data in memory will be lost, including possibly events in queues, do you really want to shutdown the entire distributed system? (Y/n): Y
Unauthorized. Reason : org.springframework.security.authentication.UsernamePasswordAuthenticationToken@2d88af7c: Principal: org.springframework.security.core.userdetails.User@902a735d: Username: clusterReader; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: CLUSTER:READ; Credentials: [PROTECTED]; Authenticated: true; Details: null; Granted Authorities: org.apache.geode.tools.security.GeodeGrantedAuthority@425d23e5 not authorized for CLUSTER:MANAGE
------------------------------------------------------------------
Valid User - CLUSTER:MANAGE authority granted
------------------------------------------------------------------
gfsh>connect --user=clusterManager --password=clusterManagerPassword
Connecting to Locator at [host=localhost, port=10334] ..
Connecting to Manager at [host=192.168.8.102, port=1099] ..
Successfully connected to: [host=192.168.8.102, port=1099]
gfsh>shutdown --include-locators=true
As a lot of data in memory will be lost, including possibly events in queues, do you really want to shutdown the entire distributed system? (Y/n): Y
Shutdown is triggered
gfsh>
No longer connected to 192.168.8.102[1099].
```

## What next?
Check out the [geode-spring-security](https://github.com/jujoramos/geode-spring-security) project and play around with it, the *SpringSecurityManagerDistributedTest* it’s a great starting point as it shows how to set different authentication mechanisms and stores (dataBase, in-Memory, and LDAP) ***without changing a single line of code***.

Check out [Spring Data for Apache Geode](https://spring.io/projects/spring-data-geode), you can do way more things (including what we’ve done here) more easily and quickly, with just some extra annotations!.

Looking for other interesting use cases? check the following articles:
* [Geode Distributed Sequences](https://medium.com/@jujoramos/geode-distributed-sequences-12626251d5e3)
* [The Command Region Pattern](https://medium.com/@jujoramos/the-command-region-pattern-14bc49594eca)
* [Publishing Apache Geode Metrics to Wavefront](https://medium.com/@huynhja/publishing-apache-geode-metrics-to-wavefront-6e9a6cf5992b)
* [Converting All Apache Geode Statistics to Micrometer Meters](https://medium.com/@boglesby_2508/converting-all-apache-geode-statistics-to-micrometer-meters-e5c94fdc1c56)
* [Removing Unused PdxTypes from an Apache Geode Distributed System](https://medium.com/@boglesby_2508/remove-unused-pdxtypes-from-an-apache-geode-distributed-system-5a4f0e199e34)
* [Ingest, Store and Search JSON data with Apache Kafka and Apache Geode](https://medium.com/@huynhja/ingest-store-and-search-json-data-with-apache-kafka-and-apache-geode-fc6d0d2f9d9f)

Need help with a complex problem or want to validate your solution? share some details with the [user](https://markmail.org/search/?q=list%3Aorg.apache.geode.user+order%3Adate-backward) list.

## References
* [Apache Geode Repository](https://github.com/apache/geode)
* [Spring Security Repository](https://github.com/spring-projects/spring-security)
* [Spring Data Geode Repository](https://github.com/spring-projects/spring-data-geode)
* [Geode Spring Security Repository](https://github.com/jujoramos/geode-spring-security)