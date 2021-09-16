---
title: "Transmitting Deltas Between Different Apache Geode Distributed Systems"
description: >
    This article describes a way to send the delta bytes between the DistributedSystems instead of sending the entire object bytes.
date: 2021-03-23
type: blog

# Author(s)
team:
- Barry Oglesby
 
---
## Introduction
Apache Geode provides a [Delta](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/Delta.java) interface that facilitates serializing the changes to an object between two JVMs rather than the entire object when changes are made to that object. For large objects, this provides an optimization that is supported from:

- clients to servers
- servers to servers in the same DistributedSystem
- servers to clients

Sending Deltas from servers in one [DistributedSystem](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/distributed/DistributedSystem.java) to servers in another (e.g. two WAN sites) is not supported. Currently, each event sent between the DistributedSystems contains the entire object. Normally, objects are stored in Regions as byte arrays. For Deltas, that is not the case. Instead, Deltas are represented as fully-deserialized objects. When a change to a Delta is received, it is applied to the in-memory object. Combine this with the fact that sending Deltas between DistributedSystems is not supported, and that means the entire object is serialized each time it is updated in the sending DistributedSystem and deserialized in the receiving one. Since Deltas are mainly used for objects that can grow very large (like sessions), this can be inefficient.

This article describes a way to send the delta bytes between the DistributedSystems instead of sending the entire object bytes.

## Architecture
For this implementation, each event travels the path below between a client in the sending DistributedSystem and a server in the receiving DistributedSystem:

- A client does a put operation on the data Region
- The full or delta bytes of the object are sent from the client to a server depending on whether the operation is a create or update
- The [CacheWriter](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/CacheWriter.java) on the data Region in the server sets the [GatewaySender](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/wan/GatewaySender.java) queue key
- The [CacheListener](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/CacheListener.java) on the data Region in the server creates an [EntryEvent](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/EntryEvent.java) on the proxy Region containing the appropriate bytes (either delta or full) and distributes that event to the GatewaySender attached to the proxy Region
- The GatewaySender attached to the proxy Region sends the event to a server in the receiving DistributedSystem
- A [GatewayReceiver](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/wan/GatewayReceiver.java) in a server on the receiving DistributedSystem receives the event
- The CacheWriter in the proxy Region puts the appropriate bytes (either delta or full) into the data Region

Note: The `GatewaySender` and `GatewayReceiver` in these steps actually encompass several different objects.

This diagram shows the architecture of this implementation with one server in each DistributedSystem for simplicity:

![Sequence Diagram for Sending Deltas Between DistributedSystems](images/barry_2021_03_23_architecture_diagram.png#diagram)
## Region Configuration
The Region configuration of the above architecture looks like this in XML:

### Data Region
```xml
<region name="Trade" refid="PARTITION_REDUNDANT">
  <region-attributes>
    <cache-writer>
      <class-name>example.server.callback.GatewaySenderDeltaCacheWriter</class-name>
    </cache-writer>
    <cache-listener>
      <class-name>example.server.callback.GatewaySenderDeltaCacheListener</class-name>
    </cache-listener>
  </region-attributes>
</region>
```
### Proxy Region
```xml
<region name="Trade_gateway_sender_delta_proxy" refid="PARTITION_REDUNDANT">
  <region-attributes gateway-sender-ids="ny">
    <partition-attributes colocated-with="/Trade" redundant-copies="1"/>
    <cache-writer>
      <class-name>example.server.callback.GatewaySenderProxyCacheWriter</class-name>
    </cache-writer>
  </region-attributes>
</region>
```
## Caveats
There are a few caveats to this implementation:

- The receiving DistributedSystem must have the full object to be able to apply the delta bytes so both DistributedSystems must start from the same state (either both empty or one a copy of the other).
- The receiving DistributedSystem proxy Region stores the most recent bytes for each key.
- Eviction cannot be enabled for the proxy Region. If it is enabled and an entry is evicted, a destroy event received from the sending DistributedSystem is ignored.

## Implementation
All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/send-delta-between-wan-sites).

The implementation consists of the following three [CacheCallback](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/CacheCallback.java) classes:

- A **GatewaySenderDeltaCacheWriter** attached to the data Region
- A **GatewaySenderDeltaCacheListener** attached to the data Region
- A **GatewaySenderProxyCacheWriter** attached to the proxy Region

### GatewaySenderDeltaCacheWriter
The **GatewaySenderDeltaCacheWriter** process method:

- initializes the tail key in the event
- sets the tail key as the callback argument of the event

The tail key is the key in the GatewaySender queue. In normal `GatewaySender-enabled` regions, the tail key is initialized by the primary BucketRegion’s [handleWANEvent](https://github.com/apache/geode/blob/23c373e2e47d9ab9951fc2b2e19a94e29d756a15/geode-core/src/main/java/org/apache/geode/internal/cache/BucketRegion.java#L578) method. It is then replicated to redundant servers. Since the data Region in this case is not `GatewaySender-enabled`, this doesn’t happen. Once the tail key is initialized in the event, it is set into the callback argument. This is done because the tail key is only replicated between servers in `GatewaySender-enabled` Regions. It is ignored in `non-GatewaySender-enabled` Regions.

```java
private void process(EntryEvent event) {
  EntryEventImpl eei = (EntryEventImpl) event;
  if (!isFromRemoteWANSite(eei)) {
    // Update the tailKey (which is the key in the queue)
    // The tailKey is set by handleWANEvent in the event in the primary.
    // It won't be called in this case since the data region is not WAN-enabled.
    setTailKey(eei);
    // Set the callback argument since the tail key is not serialized between members
    // if the region is not wan-enabled.
    eei.setCallbackArgument(eei.getTailKey());
  }
}
```
The **GatewaySenderDeltaCacheWriter** `setTailKey` method invokes the BucketRegion’s `handleWANEvent` method to set the tail key.

```java
private void setTailKey(EntryEventImpl event) {
  PartitionedRegion pr = (PartitionedRegion) getProxyRegion(event.getRegion());
  BucketRegion br = pr.getBucketRegion(event.getKey());
  br.handleWANEvent(event);
}
```
### GatewaySenderDeltaCacheListener
The **GatewaySenderDeltaCacheListener** process method:

- gets the co-located proxy Region
- creates an `EntryEvent` using the proxy Region and input `EntryEvent`
- retrieves the proxy Region’s GatewaySenders
- distributes the `EntryEvent` to each GatewaySender

```java
private void process(EntryEvent event) {
  EntryEventImpl eei = (EntryEventImpl) event;
  if (!isFromRemoteWANSite(eei)) {
    // Get the GatewaySender proxy region
    PartitionedRegion proxyRegion = (PartitionedRegion) getProxyRegion(event.getRegion());
    // Create the appropriate event
    EntryEventImpl proxyEvent = createProxyEntryEvent(eei, proxyRegion);
    // Add the event to any GatewaySender queues
    deliverToGatewaySenderQueues(proxyEvent);
  }
}
```
The **GatewaySenderDeltaCacheListener** `createProxyEntryEvent` method creates the `EntryEvent` on the proxy Region.

The `EntryEvent` contains:

- the [Operation](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/Operation.java) (CREATE, UPDATE, DESTROY)
- the proxy Region
- the key
- the value bytes if CREATE (full object) or UPDATE (delta)
- a boolean callback argument denoting whether the bytes are delta or full
- the tail key generated by the **GatewaySenderDeltaCacheWriter**
- the originating [DistributedMember](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/distributed/DistributedMember.java)
- the originating [EventID](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/EventID.java)
- the originating [ClientProxyMembershipID](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/tier/sockets/ClientProxyMembershipID.java)
- the originating [VersionTag](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/versions/VersionTag.java)

```java
private EntryEventImpl createProxyEntryEvent(EntryEventImpl event, PartitionedRegion proxyRegion) {
  byte[] newValue = null;
  boolean isDelta;
  Operation operation;
  if (event.getDeltaBytes() != null) {
    newValue = event.getDeltaBytes();
    operation = Operation.UPDATE;
    isDelta = true;
  } else if (event.getCachedSerializedNewValue() != null) {
    newValue = event.getCachedSerializedNewValue();
    operation = Operation.CREATE;
    isDelta = false;
  } else {
    operation = Operation.DESTROY;
    isDelta = false;
  }
  EntryEventImpl proxyEvent = EntryEventImpl.create(proxyRegion, operation, event.getKey(), newValue, isDelta /*callbackArg*/, event.isOriginRemote(), event.getDistributedMember(), false /* generateCallbacks */, event.getEventId());
  proxyEvent.setContext(event.getContext());
  proxyEvent.setVersionTag(event.getVersionTag());
  proxyEvent.setTailKey((Long) event.getCallbackArgument());
  return proxyEvent;
}
```
The **GatewaySenderDeltaCacheListener** `deliverToGatewaySenderQueues` method retrieves the proxy Region’s GatewaySenders and distributes the event to each one.

```java
private void deliverToGatewaySenderQueues(EntryEventImpl wanEvent) {
  Region region = wanEvent.getRegion();
  Cache cache = region.getCache();
  Set<String> senderIds = region.getAttributes().getGatewaySenderIds();
  for (String senderId : senderIds) {
    // Get the GatewaySender
    AbstractGatewaySender sender = (AbstractGatewaySender) cache.getGatewaySender(senderId);
    // Distribute the EntryEvent to the GatewaySender
    sender.distribute(getEnumListenerEvent(wanEvent.getOperation()), wanEvent, getRemoteDsIds(cache, senderIds));
  }
}
```
### GatewaySenderProxyCacheWriter
The **GatewaySenderProxyCacheWriter** process method:

- gets the co-located data Region
- invokes the `LocalRegion` [basicBridgePut](https://github.com/apache/geode/blob/23c373e2e47d9ab9951fc2b2e19a94e29d756a15/geode-core/src/main/java/org/apache/geode/internal/cache/LocalRegion.java#L5181) or [basicBridgeDestroy](https://github.com/apache/geode/blob/23c373e2e47d9ab9951fc2b2e19a94e29d756a15/geode-core/src/main/java/org/apache/geode/internal/cache/LocalRegion.java#L5435) method depending on the `EntryEvent`’s operation and boolean callback argument. The basicBridgePut method is invoked with either the full bytes or delta bytes from the input `EntryEvent`.

```java
private void process(EntryEvent event) {
  EntryEventImpl eei = (EntryEventImpl) event;
  if (isFromRemoteWANSite(eei)) {
    byte[] newValue = (byte[]) eei.getNewValue();
    Operation operation = event.getOperation();
    boolean callbackArg = (Boolean) event.getCallbackArgument();
    if (event.getOperation().isDestroy()) {
      getDataRegion(event.getRegion()).basicBridgeDestroy(event.getKey(), eei.getRawCallbackArgument(), eei.getContext(), false, getClientEvent(eei));
    } else {
      Object value = null;
      byte[] deltaBytes = null;
      boolean isObject = false;
      if (callbackArg) {
        deltaBytes = (byte[]) eei.getNewValue();
      } else {
        value = eei.getNewValue();
        isObject = true;
      }
      getDataRegion(event.getRegion()).basicBridgePut(event.getKey(), value, deltaBytes, isObject, eei.getRawCallbackArgument(), eei.getContext(), false, getClientEvent(eei));
    }
  }
}
```
## Future
The [GatewaySenderEventImpl](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/wan/GatewaySenderEventImpl.java) represents an event being sent between two DistributedSystems. It needs to be modified to be able to store the delta bytes in the sending DistributedSystem, and the [GatewayReceiverCommand](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/tier/sockets/command/GatewayReceiverCommand.java) should be modified to be able to apply those delta bytes in the receiving DistributedSystem.

In addition, the sending DistributedSystem currently has no knowledge of the state of the objects in the receiving DistributedSystem. This has to be changed so that the sending DistributedSystem knows when it must send the full bytes rather than the delta bytes in the case where the receiving DistributedSystem doesn’t have the full object.

One potential way to do this is to modify the [AbstractGatewaySenderEventProcessor](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/wan/AbstractGatewaySenderEventProcessor.java). The AbstractGatewaySenderEventProcessor creates `GatewaySenderEventImpls`, builds batches of these and causes them to be sent to the receiving DistributedSystem. It could be modified to track which objects in the receiving DistributedSystem require full object bytes rather than the delta bytes. This can be done by tracking the time when the connection to the receiving DistributedSystem was made and also the last time the full object bytes were sent for each entry. If the entry time is before the connection time, the full bytes would be resent; otherwise the delta bytes would be sent. From the sending DistributedSystem’s perspective, if no connection can be made to any server in the receiving DistributedSystem, it is down. When it comes back up (when the sending DistributedSystem can connect to it), it could potentially be a brand new DistributedSystem. The sending DistributedSystem would have no knowledge of this, so the full bytes would have to be sent.

Another potential way to do this is to modify the [GatewayAck](https://github.com/apache/geode/blob/0abd7667b324da3a88fa341675b68f08118c83cb/geode-wan/src/main/java/org/apache/geode/internal/cache/wan/GatewaySenderEventRemoteDispatcher.java#L581) and [GatewaySenderEventRemoteDispatcher](https://github.com/apache/geode/blob/develop/geode-wan/src/main/java/org/apache/geode/internal/cache/wan/GatewaySenderEventRemoteDispatcher.java). The `GatewayAck` is the acknowledgement returned from the receiving DistributedSystem for each batch of `GatewaySenderEventImpls`. The `GatewaySenderEventRemoteDispatcher` process the `GatewayAcks`. The `GatewayAck` currently contains among other fields a collection of exceptions that occur while processing the batch on the receiving DistributedSystem. The collection could be modified to contain an `InvalidDeltaException` for each entry that doesn’t exist on the remote DistributedSystem. For each one, the `GatewaySenderEventRemoteDispatcher` in the sending DistributedSystem could be modified to create and enqueue a GatewaySenderEventImpl with the full bytes.