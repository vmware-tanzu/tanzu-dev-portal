---
date: 2020-10-12
description: This article describes a Spring Boot JMX Notification listener application.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Implementing a Spring Boot JMX Notification Listener for Apache Geode
type: blog
---

## Introduction
Apache Geode issues JMX Notifications for specific [system events](https://geode.apache.org/docs/guide/14/managing/management/list_of_mbean_notifications.html) and system alerts (e.g. warning and severe messages).

JMX Notifications include but are not limited to:
 * when members join and leave the DistributedSystem
 * when Regions are created and destroyed
 * when GatewaySenders are created, started and stopped
 * when warning or above messages are logged (depending on the DistributedSystemMXBean [alert level](https://github.com/apache/geode/blob/c78dddd28f5dd18861668a83327b54bac8c7050b/geode-core/src/main/java/org/apache/geode/management/DistributedSystemMXBean.java#L157))
 
 This article describes a Spring Boot JMX Notification listener application that connects to and listens for JMX Notifications from Apache Geode members.
 
 ## Implementation
 
 All source code described in this article is available [here](https://github.com/boglesby/jmx-notification-listener).
 
 The [GeodeJmxNotificationListener](https://github.com/boglesby/jmx-notification-listener/blob/master/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java):
 
 * connects to the MBeanServer running in the JMX manager (the locator)
 * changes the DistributedSystemMXBean’s alert level from severe (the default) to warning
 * adds itself as a NotificationListener to the DistributedSystemMXBean
 * handles JMX Notifications by handing them off to a [JmxNotificationHandler](https://github.com/boglesby/jmx-notification-listener/blob/master/src/main/java/example/client/jmx/JmxNotificationHandler.java) for processing
 * implements the [JmxConnectionHandler](https://github.com/boglesby/jmx-notification-listener/blob/master/src/main/java/example/client/jmx/JmxConnectionHandler.java) interface to manipulate the JMX connection
 * implements the [JmxNotificationsAccessor](https://github.com/boglesby/jmx-notification-listener/blob/master/src/main/java/example/client/jmx/JmxNotificationsAccessor.java) interface to provide access to the JMX Notifications.
 
 The [JmxNotificationClient](https://github.com/boglesby/jmx-notification-listener/blob/master/src/main/java/example/client/JmxNotificationClient.java) application class autowires the **GeodeJmxNotificationListener** as a **JmxConnectionHandler**, and its [connectJmxConnectionHandler](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/JmxNotificationClient.java#L32) Bean method causes the connection to the JMX manager to be made.
 
 The [GeodeJmxNotificationController](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/controller/GeodeJmxNotificationController.java) REST controller class autowires the **GeodeJmxNotificationListener** as a **JmxNotificationsAccessor** to access the JMX Notifications.
 
 ### Connect to the MBeanServer
The [connectToMBeanServer](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L55) method repeatedly attempts to connect to the MBeanServer in the JMX manager until it succeeds. A connection attempt will be made every 5 seconds by default (controlled by the *jmx.listener.connection.retry.delay* property).

The [attemptToConnectToMBeanServer](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L73) method actually makes the connection like:

```java
private void attemptToConnectToMBeanServer() throws Exception {
  // Create JMXServiceURL
  String urlStr = String.format(CONNECTION_URL, this.hostName, this.hostName, this.port);
  JMXServiceURL url = new JMXServiceURL(urlStr);
  logger.info("Attempting to connect to {}", url);

  // Create the JMXConnector
  JMXConnector jmxConnector = JMXConnectorFactory.connect(url);
  logger.info("Connected to {}", url);

  // Get the MBeanServerConnection
  this.serverConnection = jmxConnector.getMBeanServerConnection();
  this.connected = true;

  // Initialize the system mbean name
  this.distributedSystem = new ObjectName(DISTRIBUTED_SYSTEM_MBEAN_NAME);
  logger.info("Monitoring {}", this.distributedSystem);
}
```

If the connection cannot be made, messages like these will be logged:

```
2020-10-06 08:40:01.631  INFO 14635 --- [         task-1] e.c.jmx.GeodeJmxNotificationListener     : Attempting to connect to service:jmx:rmi://localhost/jndi/rmi://localhost:1099/jmxrmi
2020-10-06 08:40:01.634  WARN 14635 --- [         task-1] e.c.jmx.GeodeJmxNotificationListener     : Caught the following exception attempting to connect to the JMX manager at localhost:1099. Will retry in 5000 ms.
java.io.IOException: Failed to retrieve RMIServer stub: javax.naming.ServiceUnavailableException [Root exception is java.rmi.ConnectException: Connection refused to host: localhost; nested exception is: 
  java.net.ConnectException: Connection refused (Connection refused)]
  at javax.management.remote.rmi.RMIConnector.connect(RMIConnector.java:369) ~[na:1.8.0_151]
  at javax.management.remote.JMXConnectorFactory.connect(JMXConnectorFactory.java:270) ~[na:1.8.0_151]
  at javax.management.remote.JMXConnectorFactory.connect(JMXConnectorFactory.java:229) ~[na:1.8.0_151]
  at example.client.jmx.GeodeJmxNotificationListener.attemptToConnectToMBeanServer(GeodeJmxNotificationListener.java:80) ~[main/:na]
  at example.client.jmx.GeodeJmxNotificationListener.connectToMBeanServer(GeodeJmxNotificationListener.java:58) ~[main/:na]
Caused by: javax.naming.ServiceUnavailableException: null
  at com.sun.jndi.rmi.registry.RegistryContext.lookup(RegistryContext.java:136) ~[na:1.8.0_151]
  at com.sun.jndi.toolkit.url.GenericURLContext.lookup(GenericURLContext.java:205) ~[na:1.8.0_151]
  at javax.naming.InitialContext.lookup(InitialContext.java:417) ~[na:1.8.0_151]
  at javax.management.remote.rmi.RMIConnector.findRMIServerJNDI(RMIConnector.java:1955) ~[na:1.8.0_151]
  at javax.management.remote.rmi.RMIConnector.findRMIServer(RMIConnector.java:1922) ~[na:1.8.0_151]
  at javax.management.remote.rmi.RMIConnector.connect(RMIConnector.java:287) ~[na:1.8.0_151]
Caused by: java.rmi.ConnectException: Connection refused to host: localhost; nested exception is: 
  java.net.ConnectException: Connection refused (Connection refused)
  at sun.rmi.transport.tcp.TCPEndpoint.newSocket(TCPEndpoint.java:619) ~[na:1.8.0_151]
  at sun.rmi.transport.tcp.TCPChannel.createConnection(TCPChannel.java:216) ~[na:1.8.0_151]
  at sun.rmi.transport.tcp.TCPChannel.newConnection(TCPChannel.java:202) ~[na:1.8.0_151]
  at sun.rmi.server.UnicastRef.newCall(UnicastRef.java:338) ~[na:1.8.0_151]
  at sun.rmi.registry.RegistryImpl_Stub.lookup(RegistryImpl_Stub.java:112) ~[na:1.8.0_151]
  at com.sun.jndi.rmi.registry.RegistryContext.lookup(RegistryContext.java:132) ~[na:1.8.0_151]
Caused by: java.net.ConnectException: Connection refused (Connection refused)
  at java.net.PlainSocketImpl.socketConnect(Native Method) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188) ~[na:1.8.0_151]
  at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392) ~[na:1.8.0_151]
  at java.net.Socket.connect(Socket.java:589) ~[na:1.8.0_151]
  at java.net.Socket.connect(Socket.java:538) ~[na:1.8.0_151]
  at java.net.Socket.<init>(Socket.java:434) ~[na:1.8.0_151]
  at java.net.Socket.<init>(Socket.java:211) ~[na:1.8.0_151]
  at sun.rmi.transport.proxy.RMIDirectSocketFactory.createSocket(RMIDirectSocketFactory.java:40) ~[na:1.8.0_151]
  at sun.rmi.transport.proxy.RMIMasterSocketFactory.createSocket(RMIMasterSocketFactory.java:148) ~[na:1.8.0_151]
```

Once the connection is made, messages like these will be logged:

```
2020-10-06 08:45:11.048  INFO 14848 --- [         task-1] e.c.jmx.GeodeJmxNotificationListener     : Attempting to connect to service:jmx:rmi://localhost/jndi/rmi://localhost:1099/jmxrmi
2020-10-06 08:45:11.121  INFO 14848 --- [         task-1] e.c.jmx.GeodeJmxNotificationListener     : Connected to service:jmx:rmi://localhost/jndi/rmi://localhost:1099/jmxrmi
2020-10-06 08:45:11.122  INFO 14848 --- [         task-1] e.c.jmx.GeodeJmxNotificationListener     : Monitoring GemFire:service=System,type=Distributed
```

### Change Alert Level

The [changeAlertLevel](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L92) method invokes the changeAlertLevel operation on the DistributedSystemMXBean to change the alert level from severe to warning like:

```java
private void changeAlertLevel() throws Exception {
  this.serverConnection.invoke(this.distributedSystem, "changeAlertLevel", new String[] {"warning"}, new String[] {"java.lang.String"});
}
```

### Add NotificationListener
The [addNotificationListener](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L96) method adds the **GeodeJmxNotificationListener** as a NotificationListener to the DistributedSystemMXBean like:

```java
private void addNotificationListener() throws Exception {
  this.serverConnection.addNotificationListener(this.distributedSystem, this, null, null);
}
```

### Handle Notifications

The [handleNotification](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L121) method handles **JMX Notifications** by handing them off to each JMXNotificationHandler like:

```java
public void handleNotification(Notification notification, Object handback) {
  this.notifications.add(notification);
  this.notificationHandlers.forEach(handler -> handler.handleNotification(notification, handback));
}
```

### Check Connection to the MBeanServer
The [checkConnection](https://github.com/boglesby/jmx-notification-listener/blob/a3b5d04134e29a42bd227aa33be95ad7191801b3/src/main/java/example/client/jmx/GeodeJmxNotificationListener.java#L102) method verifies the connection to the MBeanServer in the JMX manager is still valid. This method is scheduled to run every 1 second by default (controlled by the *jmx.listener.check.connection.delay* property).

```java
public void checkConnection() {
  if (this.connected) {
    // Verify the default domain is accessible.
    // See ClientCommunicatorAdmin checkConnection and RemoteMBeanServerConnection getDefaultDomain.
    try {
      this.serverConnection.getDefaultDomain();
    } catch (IOException ioe) {
      this.connected = false;
      try {
        connectToMBeanServer();
      } catch (Exception e) {
        logger.warn("Caught the following exception attempting to re-establish the connection:", e);
      }
    }
  }
}
```

If the connection is lost, output like this will be logged and the connection will be re-attempted using the [connectToMBeanServer](https://medium.com/@boglesby_2508/implementing-a-spring-boot-jmx-notification-listener-for-apache-geode-f50b743549e1#294c) method described above:

```
2020-10-11 08:17:25.226  WARN 1906 --- [   scheduling-1] e.c.jmx.GeodeJmxNotificationListener     : Lost the connection to the JMX manager and will attempt to reconnect:

java.rmi.ConnectException: Connection refused to host: localhost; nested exception is: 
  java.net.ConnectException: Connection refused (Connection refused)
  at sun.rmi.transport.tcp.TCPEndpoint.newSocket(TCPEndpoint.java:619) ~[na:1.8.0_151]
  at sun.rmi.transport.tcp.TCPChannel.createConnection(TCPChannel.java:216) ~[na:1.8.0_151]
  at sun.rmi.transport.tcp.TCPChannel.newConnection(TCPChannel.java:202) ~[na:1.8.0_151]
  at sun.rmi.server.UnicastRef.invoke(UnicastRef.java:129) ~[na:1.8.0_151]
  at com.sun.jmx.remote.internal.PRef.invoke(Unknown Source) ~[na:na]
  at javax.management.remote.rmi.RMIConnectionImpl_Stub.getDefaultDomain(Unknown Source) ~[na:1.8.0_151]
  at javax.management.remote.rmi.RMIConnector$RemoteMBeanServerConnection.getDefaultDomain(RMIConnector.java:1045) ~[na:1.8.0_151]
  at example.client.jmx.GeodeJmxNotificationListener.checkConnection(GeodeJmxNotificationListener.java:107) ~[main/:na]
Caused by: java.net.ConnectException: Connection refused (Connection refused)
  at java.net.PlainSocketImpl.socketConnect(Native Method) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206) ~[na:1.8.0_151]
  at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188) ~[na:1.8.0_151]
  at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392) ~[na:1.8.0_151]
```

### Logging

Implementations of the **JmxNotificationHandler** interface do the actual handling of the JMX Notification. The example provides one implementation called **LoggingJmxNotificationHandler** which just logs the JMX Notification. Other implementations could post the JMX Notification to Slack, email it or store it in an external database, for example.

Examples of logged Notifications include:

DiskStore disk usage warning:

```
2020-10-06 11:01:43.781  INFO 17214 --- [otifForwarder-1] e.c.jmx.LoggingJmxNotificationHandler    : LoggingJmxNotificationHandler received notification[source=DistributedSystem(1); type=system.alert; sequence number=12; time stamp=1602018103778; message=The disk volume . for disk store DEFAULT has exceeded the warning usage threshold and is 95% full; userData={AlertLevel=warning, Member=server-1, Thread=DiskStoreMonitor1 tid=0x2e}]
```

GatewaySender remote locator warning:

```
2020-10-06 11:01:51.702  INFO 17214 --- [otifForwarder-1] e.c.jmx.LoggingJmxNotificationHandler    : LoggingJmxNotificationHandler received notification[source=DistributedSystem(1); type=system.alert; sequence number=30; time stamp=1602018111699; message=Remote locator host port information for remote site 2 is not available in local locator 192.168.1.10[10334].; userData={AlertLevel=warning, Member=server-1, Thread=Event Processor for GatewaySender_ny_0 tid=0x44}]
```

Member joined:

```
2020-10-06 11:01:33.413  INFO 17214 --- [otifForwarder-1] e.c.jmx.LoggingJmxNotificationHandler    : LoggingJmxNotificationHandler received notification[source=server-1; type=gemfire.distributedsystem.cache.member.joined; sequence number=5; time stamp=1602018093392; message=Member Joined server-1; userData=null]
```

Member departed / crashed:

```
2020-10-06 11:03:16.463  INFO 17214 --- [otifForwarder-1] e.c.jmx.LoggingJmxNotificationHandler    : LoggingJmxNotificationHandler received notification[source=server-1; type=gemfire.distributedsystem.cache.member.departed; sequence number=71; time stamp=1602018196460; message=Member Departed server-1 has crashed = true; userData=null]
```

Region created:
```
2020-10-06 11:02:08.961  INFO 17214 --- [otifForwarder-1] e.c.jmx.LoggingJmxNotificationHandler    : LoggingJmxNotificationHandler received notification[source=server-1; type=gemfire.distributedsystem.cache.region.created; sequence number=63; time stamp=1602018128958; message=Region Created With Name /PartitionedTrade; userData=server-1]
```

### REST APIs

The **GeodeJmxNotificationController** provides several REST APIs for accessing the JMX Notifications including:

* getting the JMX Notifications as JSON
* clearing the JMX Notifications



#### **Getting the JMX Notifications**

Each JMX Notification is added to a list as it is received. The list of JMX Notifications can be retrieved using the getnotifications request method like:

```
curl http://localhost:8080/getnotifications
```

The JMX Notifications are returned as JSON strings. Some examples are:

DiskStore disk usage warning:

```json
"source": "DistributedSystem(1)",
"type": "system.alert",
"sequenceNumber": 12,
"timeStamp": 1601942062695,
"userData": {
 "AlertLevel": "warning",
 "Member": "server-1",
 "Thread": "DiskStoreMonitor1 tid=0x2f"
},
"message": "The disk volume . for disk store DEFAULT has exceeded the warning usage threshold and is 95.2% full"
```

`GatewaySender` remote locator warning:

```json
"source": "DistributedSystem(1)",
"type": "system.alert",
"sequenceNumber": 21,
"timeStamp": 1601942071601,
"userData": {
  "AlertLevel": "warning",
  "Member": "server-1",
  "Thread": "Event Processor for GatewaySender_ny_0 tid=0x43"
},
"message": "Remote locator host port information for remote site 2 is not available in local locator localhost[10334]."
```

Member joined:

```json
"source": "server-1",
"type": "gemfire.distributedsystem.cache.member.joined",
"sequenceNumber": 13,
"timeStamp": 1601942068493,
"userData": null,
"message": "Member Joined server-1"
```

Member departed / crashed:

```json
"source": "server-1",
"type": "gemfire.distributedsystem.cache.member.departed",
"sequenceNumber": 68,
"timeStamp": 1601942310608,
"userData": null,
"message": "Member Departed server-2 has crashed = true"
```

Region created: 
```json
"source": "server-1",
"type": "gemfire.distributedsystem.cache.region.created",
"sequenceNumber": 59,
"timeStamp": 1601942089284,
"userData": "server-1",
"message": "Region Created With Name /PartitionedTrade"
```



#### **Clearing the JMX Notifications**
The list of JMX Notifications can be cleared using the clearnotifications request method like:

```
curl -X POST http://localhost:8080/clearnotifications
```

Note: the list of JMX Notifications is cleared automatically every 24 hours by default (controlled by the `jmx.listener.clear.notifications.delay` property) using the scheduled `clearNotifications` method.

## Future
An out-of-the-box Spring Boot JMX Notification client with various supported `JmxNotificationHandler` plugins would be a useful addition to Apache Geode.