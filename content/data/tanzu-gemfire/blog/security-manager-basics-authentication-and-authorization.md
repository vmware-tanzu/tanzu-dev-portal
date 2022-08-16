--- 
date: 2022-01-21
description: This a basic example of the GemFire security manager for an authentication and authorization system.
lastmod: '2022-01-21'
team:
- John Martin
title: "GemFire Security Manager Basics: Authentication/Authorization"
type: blog
---

[VMware Tanzu GemFire](https://tanzu.vmware.com/gemfire) is an in-memory data grid that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Starting with GemFire 9.0.0, the `SecurityManager` interface was introduced to manage the authentication and authorization mechanisms in a single place, simplifying the implementation and interactions with all components in a consistent manner.

In this example you will go through a very basic implementation of a custom security manager implementation for an authentication and authorization system.

{{% callout %}}
It’s important to note that I am not a security expert. The purpose of this article is to introduce the GemFire `SecurityManager`.

This example is not meant for use in a production environment.
{{% /callout %}}

## The Security Manager
To secure a GemFire cluster, the user needs to deploy a custom implementation of the `SecurityManager` interface, so that the authentication logic is entirely encapsulated within the implementation itself.

This example focuses on a basic authentication and authorization example, with the goal of understanding how the `SecurityManager` works on the server and how to connect a Java application to the cluster.


In this example, you will

- Create a list of approved users to authenticate and authorize against
- Create a `BasicSecurityManager` implementation that uses the `SecurityManager` authenticate and authorize methods
- Start a GemFire cluster with the `BasicSecurityManager` security manager
- Create a Java client application that authenticates against the application and `PUTS` and `GETS` data into a region
{{% callout %}}
If you have previously worked through the Authentication example, you will need to delete your server and locator directories, before beginning this example
{{% /callout %}}

## Creating a list of approved users

GemFire offers multiple layers of access to a GemFire cluster, which are defined by the [GemFire resource permissions]( https://gemfire.docs.pivotal.io/910/geode/managing/security/implementing_authorization.html ) In this example, we’ll create two users:

1. An `Operator` user that can manage the GemFire cluster but has no data access.

2. An `Application Developer` who can access the GemFire cluster but cannot manage the GemFire cluster, such as deleting the cluster. This user can manage the data in the cluster.


To keep things simple, you will be creating two `USER`s in the `init` method of the `BasicSecurityManager`. You will have hard-coded the username and password, which does not represent best practices.

The `USER` class looks like this:

```java
import java.io.Serializable;
import java.util.List;


import org.apache.geode.security.ResourcePermission;


public class User implements Serializable {

   List<ResourcePermission> userPermissions;
   String userName;
   String userPassword;

   public User(String userName, String userPassword, List<ResourcePermission> userPermissions) {
      this.userName = userName;
      this.userPassword = userPassword;
      this.userPermissions = userPermissions;
   }

   public String getUserPassword() {
      return userPassword;
   }

   @Override
   public String toString() {
      return userName;
   }

   public List<ResourcePermission> getPermissions() {
      return this.userPermissions;
   }

   public boolean hasPermission(ResourcePermission resourcePermissionRequested) {
      boolean hasPermission = false;

      for (ResourcePermission userPermission : userPermissions) {
         if (userPermission.implies(resourcePermissionRequested)) {
            hasPermission = true;
            break;
         }
      }
      return hasPermission;
   }
}

```
It’s crucial that you implement the `Serializable` interface, as this allows GemFire to deserialize the class when checking the client username.  

Now, in your `BasicSecurityManager` you can:

- Create an Operator user with `CLUSTER MANAGE`, `CLUSTER WRITE`, and `CLUSTER READ` permissions.  Set the username to “operator” and the password to “secret”
- Create an Application Developer user with `CLUSTER READ`, `DATA MANAGE`, `DATA WRITE`, `DATA READ`.  Set the username to “appDeveloper” and the password to “NotSoSecret”.
- Add the users to an “approved users” list, which allows the application to check incoming credentials. 

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.apache.geode.security.AuthenticationFailedException;
import org.apache.geode.security.ResourcePermission;
import org.apache.geode.security.SecurityManager;

public class BasicSecurityManager implements SecurityManager {

   private HashMap<String, User> approvedUsersList = new HashMap<>();

   @Override
   public void init(final Properties securityProperties) {

      List<ResourcePermission> operatorPermissions = new ArrayList<>();
      operatorPermissions.add(new ResourcePermission(ResourcePermission.Resource.CLUSTER,
              ResourcePermission.Operation.MANAGE));
      operatorPermissions.add(new ResourcePermission(ResourcePermission.Resource.CLUSTER,
              ResourcePermission.Operation.WRITE));
      operatorPermissions.add(new Resou rcePermission(ResourcePermission.Resource.CLUSTER,
              ResourcePermission.Operation.READ));

      User operator = new User("operator", "secret", operatorPermissions);

      List<ResourcePermission> appDevPermissions = new ArrayList<>();
      appDevPermissions.add(new ResourcePermission(ResourcePermission.Resource.CLUSTER,
              ResourcePermission.Operation.READ));
      appDevPermissions.add(new ResourcePermission(ResourcePermission.Resource.DATA,
              ResourcePermission.Operation.MANAGE));
      appDevPermissions.add(new ResourcePermission(ResourcePermission.Resource.DATA,
              ResourcePermission.Operation.WRITE));
      appDevPermissions.add(new ResourcePermission(ResourcePermission.Resource.DATA,
              ResourcePermission.Operation.READ));

      User appDeveloper = new User("appDeveloper", "NotSoSecret", appDevPermissions);

      this.approvedUsersList.put("operator", operator);
      this.approvedUsersList.put("appDeveloper", appDeveloper);

   }
}
```

## Authentication

Now that you have an approved users list created, you need to implement the `authentication` and `authorization` methods.

In the `authenticate` method, check the credentials passed into the `BasicSecurityManager` from the client against those in the `approvedUsers` list. If the credentials match, instead of returning a Boolean of `true` and allowing all authenticated users full access to the system, the method returns a `USER` object, `authenticatedUser`.  This is the object that will be passed into the `authorize` method when the client application performs an operation.

```java
public class BasicSecurityManager implements SecurityManager {

   private HashMap<String, User> approvedUsersList = new HashMap<>();

   @Override
   public void init(final Properties securityProperties) {...}

   @Override
   public Object authenticate(Properties credentials) throws AuthenticationFailedException {

      String usernamePassedIn = credentials.getProperty(USER_NAME);
      String passwordPassedIn = credentials.getProperty(PASSWORD);

      User authenticatedUser = this.approvedUsersList.get(usernamePassedIn);

      if (authenticatedUser == null) {
         throw new AuthenticationFailedException("Wrong username/password");
      }

      if (authenticatedUser != null && !authenticatedUser.getUserPassword().equals(passwordPassedIn)
              && !"".equals(authenticatedUser)) {
         throw new AuthenticationFailedException("Wrong username/password");
      }

      return authenticatedUser;
   }
}
```
## Authorization

The object returned from the `authenticate` method above (the `authenticatedUser` object from above) is passed into the `authorize` method as the `Object principal`. This object is used to authorize the action the client is attempting to perform. The `resourcePermissionRequested` (the action the client wants to perform) is compared with the Users given permissions.  If the user is allowed to perform the requested action, then the method returns true, otherwise the method returns false and the action is denied. 

```java
public class BasicSecurityManager implements SecurityManager {

   private HashMap<String, User> approvedUsersList = new HashMap<>();

   @Override
   public void init(final Properties securityProperties) {...}

   @Override
   public Object authenticate(Properties credentials) throws AuthenticationFailedException {...}

   @Override
   public boolean authorize(Object principal, ResourcePermission resourcePermissionRequested) {

      if (principal == null) {
         return false;
      }

      User user = this.approvedUsersList.get(principal.toString());

      if (user == null) {
         return false;
      }

      for (ResourcePermission userPermission : user.getPermissions()) {
         if (userPermission.implies(resourcePermissionRequested)) {
            return true;
         }
      }

      return false;
   }
}
```

You are now ready to use the `BasicSecurityManager` with a GemFire cluster! 

---
## Starting a GemFire cluster with the security manager
Now that you have your `BasicSecurityManager` implementation, you need to include it when starting the GemFire cluster.

1. Build the `.jar` file for the `BasicSecurityManager` created above. Note the directory and file path that the jar file is created in; it will be used in Step 3.
2. Start GemFire’s shell (gfsh) by running the `gfsh` command in a console / terminal.
3. Start a locator and include the path to the jar file and class name of the `BasicSecurityManager`. The start locator command will look something like this:
      ```
        start locator --name=locator1 --J=-Dgemfire.securitymanager=BasicSecurityManager --classpath=[path to your jar file]/BasicSecurityManager-1.0-SNAPSHOT.jar
      ```
    - **`--J=-Dgemfire.securitymanager=BasicSecurityManager`** - Defines the package and class for your security manager and allows GemFire to find the class when starting up.
    - **`--classpath=[path to your jar file]/BasicSecurityManager-1.0-SNAPSHOT.jar`** - Defines the path to the jar file that GemFire should use as the security manager.

4. Once the locator has started, you will see an output similar to this:

    ```text
    Starting a Geode Locator in [path to where GemFire was started] /locator1...  
    
    .........  
    
    Locator in [path to where GemFire was started]/locator1 on [ip address] [10334] as locator1 is currently online.  
    Process ID: 75033  
    Uptime: 11 seconds  
    Geode Version: 1.15.0-build.0  
    Java Version: 1.8.0_292  
    ...  
    
    Unable to auto-connect (Security Manager may be enabled). Please use "connect --locator=[ip address] [10334] --user --password" to connect Gfsh to the locator.  
    
    Authentication required to connect to the Manager.  
    ```

There's a problem though. The locator started, but it says that it was unable to connect.

Once the security manager is included to start the cluster, it is immediately used to authenticate the user. To continue you must now connect to the cluster (in `gfsh`) as the `Operator` as defined in the `BasicSecurityManager` class above. This is the only role we created that has the authorization to manage the cluster.

In `gfsh`, the command would look similar to the following:

```text
    connect --locator= [IP Address that GemFire is running on] [10334] --user=operator --password=secret
```

You should now be connected to the locator. Next, you will start a server. This will be very similar to starting the locator. In `gfsh`, use the `start server` command, which will include the path to the same `BasicSecurityManager` `.jar` file used when starting the locator.
```text 
    start server --name=server1 --locators=localhost[10334] --classpath=[path to your security manager]/BasicSecurityManager-1.0-SNAPSHOT.jar --user=operator --password=secret
```
- Repeat this step for each server you need to start, but make sure you change the `--name=` parameter to be unique for each server.


Good work!  You now have a GemFire cluster running with your `BasicSecurityManager`!

---
## Connect a Java client application to a secure GemFire cluster

Before you create the client application, you need to create a region on the GemFire cluster for the app to interact with.

In the gfsh terminal, run the following command to create a region called `helloWorld`. This will create a [partitioned region](https://gemfire.docs.pivotal.io/910/geode/developing/partitioned_regions/chapter_overview.html) in your GemFire cluster that you can `PUT` and `GET` data from.

```
create region --name=helloWorld --type=PARTITION
```

Something went wrong!

```
Unauthorized. Reason : operator not authorized for DATA:MANAGE
```

This is because you are still connected to the cluster as the Operator, who does not have permission to create regions. To create the region, you must disconnect as the Operator and connect as the `appDevloper`.

Enter the following into your gfsh terminal: 

```text
gfsh: disconnect
gfsh: connect –-user=appDevleoper –-password=NotSoSecret
```

Once connected, run the `create region` command again.

Great! You now have a region you can interact with from a client application.  

There are three important steps to connect a client application to the GemFire cluster.
1. The client application must have a class that implements the `AuthInitialize` interface. This class is used by GemFire to provide the credentials to the cluster
2. The client application must set its credentials composed of two properties,`security username` and `security-password`
3. The client application must set the `security-client-auth-init` property, which indicates to GemFire the class that implements the `AuthInitialize` interface.


In this example you will be setting the `security-username` and `security-password` in the class that implements the `AuthInitialize` interface. In your company, these credentials might come from an external source, such as a credentials database, ActiveDirectory, or some other external system. The goal for this article is to keep things as simple as possible to help get a basic understanding of how the security manager works, so you will be hard-coding them into the application.


First create our class that implements the `AuthInitialize` interface.

```java
import java.util.Properties;
import org.apache.geode.distributed.DistributedMember;
import org.apache.geode.security.AuthInitialize;
import org.apache.geode.security.AuthenticationFailedException;

public class UserPasswordAuthInit implements AuthInitialize { 
  
@Override
public Properties getCredentials(Properties properties, DistributedMember distributedMember, boolean isPeer) throws AuthenticationFailedException {
      properties.setProperty("security-username", "appDeveloper"); 
      properties.setProperty("security-password", "NotSoSecret"); 
      return properties; 
    } 
}
```

This basic class sets two properties (`security-username` & `security-password`) that match the credentials declared for the `appDeveloper` user in the `BasicSecurityManager` class.


Next, set the `security-client-auth-init` property in the `Main` class and pass it to the `ClientCacheFactory`.


```java
import java.util.Properties;
import org.apache.geode.cache.Region;
import org.apache.geode.cache.client.ClientCache;
import org.apache.geode.cache.client.ClientCacheFactory;
import org.apache.geode.cache.client.ClientRegionShortcut;

public class Main {

  public static void main (String[] args) {
    Properties properties = new Properties(); 
    properties.setProperty("security-client-auth-init", UserPasswordAuthInit.class.getName()); 
 
    ClientCache cache = new ClientCacheFactory(properties).addPoolLocator("localhost", 10334).create(); 
 
    Region<String, String> 
        helloWorldRegion = 
        cache.<String, String>createClientRegionFactory(ClientRegionShortcut.PROXY).create("helloWorld"); 
 
    helloWorldRegion.put("1", "HelloWorldValue"); 
    String value1 = helloWorldRegion.get("1"); 
    System.out.println(value1); 
    cache.close(); 
  }
}
```

Run the app and you should see an output in your console/terminal like the following:

```
ERROR StatusLogger Log4j2 could not find a logging implementation. Please add log4j-core to the classpath. Using SimpleLogger to log to the console...
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

HelloWorldValue

Process finished with exit code 0
```

It worked! It prints out the value "HelloWorldValue" you put in for key “1”. You can ignore the `ERROR` for the sake of this example. If your application includes an authentication error though, confirm you have the correct username and password in your `AuthInitialize` class.


### Client authorization error
If you were to remove the `appDevelopers` permission to WRITE to the GemFire cluster, you would get an error that looks similar to this

```text
ERROR StatusLogger Log4j2 could not find a logging implementation. Please add log4j-core to the classpath. Using SimpleLogger to log to the console...
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
Exception in thread "main" org.apache.geode.cache.client.ServerOperationException: remote server on [your IP address]: org.apache.geode.security.NotAuthorizedException: appDeveloper not authorized for DATA:WRITE:helloWorld:1
	at org.apache.geode.cache.client.internal.OpExecutorImpl.handleException(OpExecutorImpl.java:554)
	at org.apache.geode.cache.client.internal.OpExecutorImpl.handleException(OpExecutorImpl.java:615)
	at org.apache.geode.cache.client.internal.OpExecutorImpl.handleException(OpExecutorImpl.java:501)
	at org.apache.geode.cache.client.internal.OpExecutorImpl.execute(OpExecutorImpl.java:142)
	at org.apache.geode.cache.client.internal.OpExecutorImpl.execute(OpExecutorImpl.java:108)
	at org.apache.geode.cache.client.internal.PoolImpl.execute(PoolImpl.java:776)
	at org.apache.geode.cache.client.internal.PutOp.execute(PutOp.java:91)
	at org.apache.geode.cache.client.internal.ServerRegionProxy.put(ServerRegionProxy.java:159)
	at org.apache.geode.internal.cache.LocalRegion.serverPut(LocalRegion.java:3048)
	at org.apache.geode.internal.cache.LocalRegion.cacheWriteBeforePut(LocalRegion.java:3165)
	at org.apache.geode.internal.cache.ProxyRegionMap.basicPut(ProxyRegionMap.java:238)
	at org.apache.geode.internal.cache.LocalRegion.virtualPut(LocalRegion.java:5613)
	at org.apache.geode.internal.cache.LocalRegion.virtualPut(LocalRegion.java:5591)
	at org.apache.geode.internal.cache.LocalRegionDataView.putEntry(LocalRegionDataView.java:156)
	at org.apache.geode.internal.cache.LocalRegion.basicPut(LocalRegion.java:5049)
	at org.apache.geode.internal.cache.LocalRegion.validatedPut(LocalRegion.java:1648)
	at org.apache.geode.internal.cache.LocalRegion.put(LocalRegion.java:1635)
	at org.apache.geode.internal.cache.AbstractRegion.put(AbstractRegion.java:442)
	at Main.main(Main.java:21)
Caused by: org.apache.geode.security.NotAuthorizedException: appDeveloper not authorized for DATA:WRITE:helloWorld:1
	at org.apache.geode.internal.security.IntegratedSecurityService.authorize(IntegratedSecurityService.java:292)
	at org.apache.geode.internal.security.IntegratedSecurityService.authorize(IntegratedSecurityService.java:275)
	at org.apache.geode.internal.security.IntegratedSecurityService.authorize(IntegratedSecurityService.java:269)
	at org.apache.geode.internal.cache.tier.sockets.command.Put70.cmdExecute(Put70.java:246)
	at org.apache.geode.internal.cache.tier.sockets.BaseCommand.execute(BaseCommand.java:187)
	at org.apache.geode.internal.cache.tier.sockets.ServerConnection.doNormalMessage(ServerConnection.java:881)
	at org.apache.geode.internal.cache.tier.sockets.ServerConnection.doOneMessage(ServerConnection.java:1070)
	at org.apache.geode.internal.cache.tier.sockets.ServerConnection.run(ServerConnection.java:1344)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at org.apache.geode.internal.cache.tier.sockets.AcceptorImpl.lambda$initializeServerConnectionThreadPool$3(AcceptorImpl.java:690)
	at org.apache.geode.logging.internal.executors.LoggingThreadFactory.lambda$newThread$0(LoggingThreadFactory.java:120)
	at java.lang.Thread.run(Thread.java:748)
Caused by: org.apache.shiro.authz.UnauthorizedException: Subject does not have permission [DATA:WRITE:helloWorld:1]
	at org.apache.shiro.authz.ModularRealmAuthorizer.checkPermission(ModularRealmAuthorizer.java:334)
	at org.apache.shiro.mgt.AuthorizingSecurityManager.checkPermission(AuthorizingSecurityManager.java:141)
	at org.apache.shiro.subject.support.DelegatingSubject.checkPermission(DelegatingSubject.java:214)
	at org.apache.geode.internal.security.IntegratedSecurityService.authorize(IntegratedSecurityService.java:288)
	... 12 more

Process finished with exit code 1
```

You can see the error message points to an `org.apache.geode.security.NotAuthorizedException: appDeveloper not authorized for DATA:WRITE:helloWorld:1`, showing that the `appDeveloper` does not have the correct permissions to write to the cluster.

---

## What's next?

Working through this article, you learned how to:
- Create your own custom GemFire `SecurityManager` implementation that can authenticate and authorize
- Start a GemFire cluster using a custom `SecurityManager`
- Create a Java client that can securely interact with a secured GemFire cluster.

In a future article will take a more in-depth look at how to implement a `SecurityManager` that interacts with a token-based authentication and authorization system, such as an OAuth2 or Kerberos server.
