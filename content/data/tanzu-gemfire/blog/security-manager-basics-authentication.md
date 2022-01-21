---
date: 2022-01-19
description: This a basic implementation of the GemFire / Geode security manager for an authentication only system.   
lastmod: '2022-01-19'
team:
- John Martin
title: GemFire Security Manager Basics - Authentication
type: blog
---

[VMware Tanzu GemFire](https://tanzu.vmware.com/gemfire) is an in-memory data grid that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Starting with Geode 1.0.0 (Geode is the Open Source version of GemFire), the *[SecurityManager](https://github.com/apache/geode/blob/support/1.14/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* interface was introduced to manage the authentication and authorization mechanisms in a single place, simplifying the implementation and interactions with all components in a consistent manner.

In this example we’ll go through a very basic implementation of a custom security manager implementation for an authentication only system.


>**It’s important to note that I am not a security expert. The purpose of this article is to introduce the GemFire `SecurityManager`.**
>
>**This example is not meant for use in a production environment.**

## The Security Manager
To secure a GemFire cluster, the user needs to deploy a custom implementation of the *[SecurityManager](https://github.com/apache/geode/blob/support/1.14/geode-core/src/main/java/org/apache/geode/security/SecurityManager.java)* interface, so that the authentication logic is entirely encapsulated within the implementation itself.

This example focuses on a basic authentication example, with the goal of understanding how the `SecurityManager` works on the server and how to connect a Java application to the cluster.

In this example we’ll
- Create a basic security manager implementation
- Start a GemFire cluster with that security manager
- Create a basic Java client application that authenticates against the application and puts and gets some data.

## Implementing the Security Manager Interface
First we'll create a basic `SecurityManager` implementation. The `SecurityManager` interface requires the `authenticate` method to be implemented in your custom solution. In the example below we have hardcoded an expected username (“default") and password “reallyBadPassword”) for the cluster.    

```java  
package BasicSecurityManager;

import java.util.Properties;

import org.apache.geode.security.AuthenticationFailedException;
import org.apache.geode.security.SecurityManager;

public class BasicSecurityManager implements SecurityManager {

  @Override

  public Object authenticate(Properties credentials) throws AuthenticationFailedException {

    Boolean isAuthenticated = false;
    String username = credentials.getProperty("security-username");
    String password = credentials.getProperty("security-password");

    if ("default".equals(username) && "reallyBadPassword".equals(password) ) {
      isAuthenticated = true;
    } else{
      throw new AuthenticationFailedException("Wrong username/password");
    }
    return isAuthenticated;
  }

}
```

The `Properties` object passed into the `authenticate` method has two credential properties used for the `authenticate` method.  These properties must be set by the client application when connecting to the GemFire cluster (which we’ll see below):

- `security-username`
- `security-password`

After evaluating the credentials that are passed into the `SecurityManager`, a Boolean is returned from the method. If the credentials passed in match, the user is authenticated and can interact with the GemFire cluster. If the credentials don’t match, then the authentication fails, and the user cannot interact with the GemFire cluster and receives an exception with the message “Wrong username/password". 

---
## Starting a GemFire Cluster with the Security Manager 
Now that we have our `BasicSecurityManager` implementation, we need to include it when starting the GemFire cluster.

1. Build the jar file for the `BasicSecurityManager` we created above. Note the directory and file path that the jar file is created in, it will be used in Step 3.
2. Start GemFire’s shell (gfsh) by running the `gfsh` command in a console / terminal.
3. Start a locator and include the path to the jar file and class name of the `BasicSecurityManager`. The start locator command will look something like this:
      ```
        start locator --name=locator1 --J=-Dgemfire.securitymanager=BasicSecurityManager.BasicSecurityManager --classpath=[path to your jar file]/BasicSecurityManager-1.0-SNAPSHOT.jar
      ```
    - **`--J=-Dgemfire.securitymanager=BasicSecurityManager.BasicSecurityManager`** - Defines the package and class for your security manager and allows GemFire to find the class when starting up.
    - **`--classpath=[path to your jar file]/BasicSecurityManager-1.0-SNAPSHOT.jar`** - Defines the path to the jar file that GemFire should use as the security manager.  

4. Once the locator has started you will see an output similar to this:

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

There's a problem though.  The locator started, but it says that it was Unable to connect? 

Once the security manager is included to start the cluster, it is immediately used to authenticate the user. To continue you must now connect to the cluster (in gfsh) using the username and password we defined in the `BasicSecurityManager` class above.

In gfsh, the command would look similar to the following:
    
```text
    connect --locator= [IP Address that GemFire is running on] [10334] --user=default --password=reallyBadPassword
```

We should now be connected to the locator. Next, we will start a server. This will be very similar to starting the locator. In gfsh, use the `start server` command which will include the path to the same `BasicSecurityManager` jar file used when starting the locator.
```text 
    start server --name=server1 --locators=localhost [10334] --classpath=[path to your security mnanager]/BasicSecurityManager-1.0-SNAPSHOT.jar --user=default --password=reallyBadPassword
```
- Repeat this step for each server you need to start, but make sure you change the `--name=` parameter to be unique for each server.


Good work!  We now have a GemFire cluster running with our `BasicSecurityManager` !

---
## Connect a Java Client Application to a Secure GemFire Cluster

Before we create the client application, we need to create a Region on the GemFire cluster for the app to interact with.

In the gfsh terminal run the following command to create a Region call `helloWorld`.  This will create a [partitioned region](https://gemfire.docs.pivotal.io/910/geode/developing/partitioned_regions/chapter_overview.html) in your GemFire cluster that we can PUT and GET data from.

```
create region --name=helloWorld --type=PARTITION
```

  
There are three important steps to connecting our client application to the GemFire cluster.


1. The client application must have a class that implements the `AuthInitialize` interface.  This class is used by GemFire to provide the credentials to the cluster.
2. The client application must set its credentials composed of two properties - `security username` and `security-password`.
3. The client application must set the `security-client-auth-init property` which indicates to GemFire the class that implements the `AuthInitialize` interface.


In this example we’ll be setting the `security-username` and `security-password` in the class that implements the `AuthInitialize` interface. In your company these credentials may come from an external source such as a credentials database, ActiveDirectory, or some other external system.  The goal for this article is to keep things as simple as possible to help get a basic understanding of how the security manager works, so we'll be hard-coding them into the application.


First let’s create our class that implements the `AuthInitialize` interface.

```java
import java.util.Properties;

import org.apache.geode.distributed.DistributedMember;
import org.apache.geode.security.AuthInitialize;
import org.apache.geode.security.AuthenticationFailedException;

public class UserPasswordAuthInit implements AuthInitialize {

@Override
public Properties getCredentials(Properties properties, DistributedMember distributedMember, boolean isPeer) throws AuthenticationFailedException {
      properties.setProperty("security-username", "default"); 
      properties.setProperty("security-password", "reallyBadPassword"); 
      return properties; 
    } 
}
```

This basic class sets two properties (`security-username` & `security-password`) that match the credentials we declared in our `BasicSecurityManager` class.


Next, we’ll set the `security-client-auth-init` property in our `Main` class and pass it to the `ClientCacheFactory`.


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

Run the app and you should see an output in your console/terminal like the following

```
ERROR StatusLogger Log4j2 could not find a logging implementation. Please add log4j-core to the classpath. Using SimpleLogger to log to the console...

SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.

HelloWorldValue


Process finished with exit code 0
```

It worked! It prints out the value we put in for key “1” - "HelloWorldValue". We can ignore the `ERROR` for the sake of this example.  If your application includes an authentication error though, confirm you have the correct username and password in your AuthInitialize class.

We now have a GemFire system running with security enabled to aithenticate all clients trying to connect, and we have a client application that can connect and interact with our GemFire cluster.

However, now everyone and every app gets the same username, password, AND access level! 
- What if we need an Admin to be able to create the GemFire clusters but not have access to the data?
- What if we need the application developers to be able to interact with the data, without accidentally deleting the cluster? 
  
Check out this article for an example of how to implement **Authentication** and **Authorization** in a GemFire cluster. 


