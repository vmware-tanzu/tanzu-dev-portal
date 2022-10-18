---
date: 2020-04-15
description: The Command Pattern is a behavioral design pattern in which an object
  is used to encapsulate all information needed to perform an action or trigger an
  event.
lastmod: '2021-04-22'
team:
- Juan Jose Ramos
title: The Command Region Pattern
type: blog
---

## Introduction
[Apache Geode](https://geode.apache.org/) is an in-memory data grid that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Its many features include fault-tolerance, high-availability, and WAN replication.

The multi-site or WAN topology is used to connect distinct clusters, they act as one distributed system when they are coupled, and they act as independent systems when communication between sites fails.

The *Command Pattern* is a behavioral design pattern in which an object is used to encapsulate all information needed to perform an action or trigger an event.


## Why?
Gateway Senders are responsible for transmitting events from one site to another and, by default, only the following operations are replicated across WAN sites:
* Entry put.
* Entry create.
* Entry distributed destroy (not originated through expiration).

Sometimes we want to replicate more than that, specifically (but not limited to) notifying the remote sites about *Region Events* (like *destroy* or *clear*) that happened on the local cluster. In order to do so, we can implement the *Command Region Pattern*.
I’ve seen this pattern successfully and widely applied in a lot of projects over the years but haven’t found a single point of reference about it, now is a good time to share some examples and reasoning behind the pattern itself.

## How?
The idea is pretty straightforward: a custom *distributedCommand* region will be used for distribution purposes, which will have a *DistributedCommandCacheWriter* attached so we can execute the commands locally. The *DistributedCommand Region* itself will exist on all clusters and the commands will be sent across the wire through Geode gateway-senders so remote clusters can receive them through Geode gateway-receivers and execute the unit of work as well.
![img](images/command-region-pattern-diagram.jpeg#diagram)

1. The client application creates a DistributedCommand instance and executes a put operation through the PROXY region.
2. The CacheWriter is invoked and the DistributedCommand is executed locally.
3. The DistributedCommand is added to the gateway-sender queue for distribution to remote clusters.
4. The DistributedCommand is distributed and received by a gateway-receiver on a remote cluster.
5. The DistributedCommand reaches a remote server, where the CacheWriter is invoked and the DistributedCommand is executed locally.

## Implementation

1. Create a *DistributedCommand* interface.

    ```java
    public interface DistributedCommand {
    
      void execute();
      default String getName() {
        return this.getClass().getSimpleName();
      }
    }
    ```
2. Create as many implementations of the DistributedCommand interface as you need. Below is a dummy example, which does nothing but print *“Hello World from ${clientId}!”* in the logs.

    ```java
    public class HelloWorldCommand implements DistributedCommand, Serializable {
      private final static transient Logger logger = LogService.getLogger();
      private String clientId;
      @Override
      public void execute() {
        logger.info("Hello World from {}!.", clientId);
      }
    }
    ```

3. Create a DistributedCommandCacheWriter, its only purpose is to execute the received command.

    ```java
    public class DistributedCommandCacheWriter extends CacheWriterAdapter<Long, DistributedCommand> implements Declarable {
      private final static transient Logger logger = LogService.getLogger();
    
      @Override
      public void initialize(Cache cache, Properties properties) {
      }
    
      @Override
      public void beforeCreate(EntryEvent<Long, DistributedCommand> event) throws CacheWriterException {
        DistributedCommand distributedCommand = event.getNewValue();
        logger.info("Executing distributed command {}...", distributedCommand.getName());
        distributedCommand.execute();
        logger.info("Executing distributed command {}... Done!.", distributedCommand.getName());
      }
    }
    ```

4. Start two clusters (1 locator and 1 server each) for testing purposes.

    ```
    gfsh> start locator --name=cluster1-locator --port=10334 --J=-Dgemfire.remote-locators=localhost[11334] --J=-Dgemfire.distributed-system-id=1 --J=-Dgemfire.jmx-manager-start=true --J=-Dgemfire.jmx-manager-port=1080 --J=-Dgemfire.jmx-manager-http-port=0
    gfsh> start server --name=cluster1-server --locators=localhost[10334] --server-port=40401
    gfsh> start locator --name=cluster2-locator --port=11334 --J=-Dgemfire.remote-locators=localhost[10334] --J=-Dgemfire.distributed-system-id=2 --J=-Dgemfire.jmx-manager-start=true --J=-Dgemfire.jmx-manager-port=1090 --J=-Dgemfire.jmx-manager-http-port=0
    gfsh> start server --name=cluster2-server --locators=localhost[11334] --server-port=40402
    ```

5. Deploy the *Commands* and *CacheWriter* to both clusters (hint: use the **gfsh deploy** command).
6. Connected to cluster1, create the *region* and the *gateway-sender*.

    ```
    gfsh> connect --locator=localhost[10334]
    gfsh> create gateway-sender --id=sender1 --remote-distributed-system-id=2
    gfsh> create region --name=distributedCommand --type=REPLICATE_PROXY --gateway-sender-id=sender1 --cache-writer=org.apache.geode.tools.command.internal.DistributedCommandCacheWriter
    ```

7. Connected to cluster2, create the *region* and the *gateway-receiver*.

    ```
    gfsh> connect --locator=localhost[11334]
    gfsh> create gateway-receiver
    gfsh> create region --name=distributedCommand --type=REPLICATE_PROXY --cache-writer=org.apache.geode.tools.command.internal.DistributedCommandCacheWriter
    ```

That’s it, you’re ready to start replicating your units of work across clusters!.

## Example
The following client application simply connects to cluster1 and inserts the *HelloWorldCommand*.

```java
public class TestClass {

  public static void main(String[] args) {
    ClientCacheFactory clientCacheFactory = new ClientCacheFactory()
        .addPoolLocator("localhost", 10334);
    ClientCache clientCache = clientCacheFactory.create();

    Region<Long, DistributedCommand> region = clientCache
        .<Long, DistributedCommand>createClientRegionFactory(ClientRegionShortcut.PROXY)
        .create("distributedCommand");

    region.put(1L, new HelloWorldCommand("TestApplication1"));
  }
}

```

It’s easy to see in the logs from both servers (*cluster1-server* and *cluster2-server*) that the command was received and correctly executed by both clusters.

```
[info 2020/04/10 13:57:24.341 IST <ServerConnection on port 40401 Thread 2> tid=0x51] Executing distributed command HelloWorldCommand...
[info 2020/04/10 13:57:24.341 IST <ServerConnection on port 40401 Thread 2> tid=0x51] Hello World from TestApplication1!.
[info 2020/04/10 13:57:24.341 IST <ServerConnection on port 40401 Thread 2> tid=0x51] Executing distributed command HelloWorldCommand... Done!.
-------------------------------------------------------------------
[info 2020/04/10 13:57:24.873 IST <ServerConnection on port 5152 Thread 1> tid=0x42] Executing distributed command HelloWorldCommand...
[info 2020/04/10 13:57:24.873 IST <ServerConnection on port 5152 Thread 1> tid=0x42] Hello World from TestApplication1!.
[info 2020/04/10 13:57:24.873 IST <ServerConnection on port 5152 Thread 1> tid=0x42] Executing distributed command HelloWorldCommand... Done!.
```

## What’s Next?
Check out [geode-command-region-pattern](https://github.com/jujoramos/geode-command-region-pattern) and play around with it, it allows you to test your commands in a distributed fashion using the [geode-dunit](https://cwiki.apache.org/confluence/display/GEODE/About+Distributed+Testing) module.

There are several other really useful things that can be done through the usage of this pattern, like distributing a *Region.destroy()* or *Region.clear()* operation, execute a transaction on the remote cluster, the possibilities are endless, give it a try!

Looking for other interesting use cases?, check the following articles:
* [Geode Distributed Sequences](https://medium.com/@jujoramos/geode-distributed-sequences-12626251d5e3)
* [Publishing Apache Geode Metrics to Wavefront](https://medium.com/@huynhja/publishing-apache-geode-metrics-to-wavefront-6e9a6cf5992b)
* [Ingest, Store and Search JSON data with Apache Kafka and Apache Geode](https://medium.com/@huynhja/ingest-store-and-search-json-data-with-apache-kafka-and-apache-geode-fc6d0d2f9d9f)

Need help with a complex problem or want to validate your solution?, share some details with the [users](https://markmail.org/search/?q=list%3Aorg.apache.geode.user+order%3Adate-backward) lists.

## References
* [Apache Geode Repository](https://github.com/apache/geode)
* [Join the Apache Geode Community](https://geode.apache.org/community/)
* [Asynchronous Event Distribution Internals](https://cwiki.apache.org/confluence/display/GEODE/Asynchronous+Event+Distribution+Internals)