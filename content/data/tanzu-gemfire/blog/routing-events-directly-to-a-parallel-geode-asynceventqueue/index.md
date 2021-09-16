---
date: 2020-08-29
description: This article shows how to route events directly to a parallel AsyncEventQueue
  using Functions.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Routing Events Directly to a Parallel Apache Geode AsyncEventQueue
type: blog
---

## Introduction

An Apache Geode [AsyncEventQueue](https://geode.apache.org/docs/guide/112/developing/events/implementing_write_behind_event_handler.html) is used to asynchronously process events after they have been applied to a Region. They are normally used to replay Region events into a relational database or other remote data store. Other use cases want to take advantage of asynchronously processing events in parallel without actually storing entries in a Region. In these cases, each event just needs to be routed directly to the AsyncEventQueue. This behavior is effectively possible with serial AsyncEventQueues and replicated Regions. All servers can define a Region as a [REPLICATE_PROXY](https://geode.apache.org/docs/guide/11/reference/topics/region_shortcuts_reference.html#reference_n1q_jpy_lk) and operations are allowed on that Region. Events go through the Region without being applied to it and are delivered to the serial AsyncEventQueue. The same cannot be done with parallel AsyncEventQueues and partitioned Regions. If all servers define a Region as [PARTITION_PROXY](https://geode.apache.org/docs/guide/11/reference/topics/region_shortcuts_reference.html#reference_v4m_jpy_lk), an operation on that Region will fail with a [PartitionedRegionStorageException](https://geode.apache.org/releases/latest/javadoc/org/apache/geode/cache/PartitionedRegionStorageException.html).

This article shows how to route events directly to a parallel AsyncEventQueue using Functions.

## Parallel AsyncEventQueue Architecture

### Normal Usage With Region Operations

Normally, events get delivered to AsyncEventsQueues as a result of Region operations like create, update and destroy. Here is a simplified diagram of that architecture:

![img](images/barry_08_29_arch_diagram1.png#diagram)

### Usage With Function Invocations
An alternate architecture bypasses the Region operation and replication in the diagram above and instead uses Function invocations to route the data between the primary and redundant servers. Here is a simplified diagram of that architecture:

![img](images/barry_08_29_arch_diagram2.png#diagram)

## Implementation

All of the code for this example is [here](https://github.com/boglesby/route-to-async-event-queue).

The implementation consists mainly of a [PrimaryRoutingFunction](https://github.com/boglesby/route-to-async-event-queue/blob/master/server/src/main/java/example/server/function/PrimaryRoutingFunction.java) and a [SecondaryRoutingFunction](https://github.com/boglesby/route-to-async-event-queue/blob/master/server/src/main/java/example/server/function/SecondaryRoutingFunction.java).

The **PrimaryRoutingFunction**:

* Retrieves the routing partitioned Region
* Creates an EntryEventImpl with the Region, key, value and EventID as parameters
** Uses the key’s BucketRegion to set the EntryEventImpl’s tail key (which is the key in the AsyncEventQueue queue Region)
* Gets the redundant DistributedMembers for the key
* Invokes the **SecondaryRoutingFunction** on those DistributedMembers with the Region name, key, value, EventID and tail key as arguments
* Gets the (primary) AsyncEventQueue for the routing Region
* Gets the AsyncEventQueue’s GatewaySender
* Distributes the EntryEventImpl to the GatewaySender

The **SecondaryRoutingFunction**:

* Retrieves the routing partitioned Region
* Creates an EntryEventImpl with the Region, key, value, EventID and tail key as parameters
* Gets the (secondary) AsyncEventQueue for the routing Region
* Gets the AsyncEventQueue’s GatewaySender
* Distributes the EntryEventImpl to the GatewaySender

The [BaseFunction](https://github.com/boglesby/route-to-async-event-queue/blob/master/server/src/main/java/example/server/function/BaseFunction.java) provides methods common to both functions.

The [RoutingAsyncEventListener](https://github.com/boglesby/route-to-async-event-queue/blob/master/server/src/main/java/example/server/aeq/RoutingAsyncEventListener.java) is an [AsyncEventListener](https://geode.apache.org/releases/latest/javadoc/org/apache/geode/cache/asyncqueue/AsyncEventListener.html) that processes AsyncEvents by logging and counting them.

### Create EntryEventImpl
An EntryEventImpl is created by both functions. It represents the Region operation and is delivered to the AsyncEventQueue.

The [createEvent](https://github.com/boglesby/route-to-async-event-queue/blob/e47ab33c29f88da3a15af36a7f59ba83ea47fcfd/server/src/main/java/example/server/function/BaseFunction.java#L29) method:

* creates the EntryEventImpl with the Region, key, value and EventID as parameters
* sets the tail key (in the constructor if secondary; through the BucketRegion if primary)

```java
protected EntryEventImpl createEvent(PartitionedRegion pr, Object key, Object value,
  EventID eventId, long tailKey) {
  // Create the EntryEventImpl
  EntryEventImpl event = this.entryEventFactory
    .create(pr, Operation.CREATE, key, value, null, true, pr.getCache().getMyId(), false, eventId);

  // Set the event's tail key. If the input tailKey == -1, then this is the primary.
  // The tailKey is set directly in the event in the secondary.
  if (tailKey != -1) {
    event.setTailKey(tailKey);
  }

  // The tailKey is set by handleWANEvent in the event in the primary.
  // handleWANEvent also updates the BucketRegion's most recent tail key.
  pr.getBucketRegion(key).handleWANEvent(event);

  return event;
}
```

### Invoke SecondaryRoutingFunction

The **PrimaryRoutingFunction** invokes the **SecondaryRoutingFunction** on any redundant DistributedMembers. This invocation replaces the Region event replication in the normal usage. The [routeToSecondaryMembers](https://github.com/boglesby/route-to-async-event-queue/blob/e47ab33c29f88da3a15af36a7f59ba83ea47fcfd/server/src/main/java/example/server/function/PrimaryRoutingFunction.java#L49) method:

* gets the redundant DistributedMembers for the key
* invokes the **SecondaryRoutingFunction** on those redundant DistributedMembers

```java
private void routeToSecondaryMembers(PartitionedRegion pr, EntryEventImpl event) {
  // Get the redundant members for this key
  Set<DistributedMember> redundantMembers = PartitionRegionHelper
    .getRedundantMembersForKey(pr, event.getKey());

  // Create and execute the SecondaryRoutingFunction on those members if necessary
  if (!redundantMembers.isEmpty()) {
    Object[] args = new Object[] {
      pr.getFullPath(), event.getKey(), event.getValue(), event.getEventId(), event.getTailKey()
    };
    try {
      FunctionService.onMembers(redundantMembers)
        .setArguments(args)
        .execute("SecondaryRoutingFunction")
        .getResult();
    } catch (FunctionException e) {
      // If the remote member is killed, a FunctionException is thrown. Log a warning and continue.
      pr.getCache().getLogger()
        .warning("PrimaryRoutingFunction caught exception executing SecondaryRoutingFunction for key="
          + event.getKey() + "; value=" + event.getNewValue(), e);
    }
  }
}
```

### Deliver EntryEventImpl to AsyncEventQueue

The EntryEventImpl is delivered to the AsyncEventQueue by both functions. The [deliverToAsyncEventQueue](https://github.com/boglesby/route-to-async-event-queue/blob/e47ab33c29f88da3a15af36a7f59ba83ea47fcfd/server/src/main/java/example/server/function/BaseFunction.java#L46) method:

* gets the AsyncEventQueue for the event’s Region
* gets the AsyncEventQueue’s GatewaySender
* distributes the event to the GatewaySender

```java
protected void deliverToAsyncEventQueue(EntryEventImpl event) {
  // Get the AsyncEventQueue
  String queueId = (String) event.getRegion().getAsyncEventQueueIds().iterator().next();  
  AsyncEventQueueImpl queue = (AsyncEventQueueImpl) event.getRegion()
    .getCache().getAsyncEventQueue(queueId);

  // Get the GatewaySender
  AbstractGatewaySender sender = (AbstractGatewaySender) queue.getSender();

  // Distribute the EntryEvent to the GatewaySender
  sender.distribute(EnumListenerEvent.AFTER_CREATE, event, REMOTE_DS_IDS);
}
```

### Server Logging Output

#### Normal Usage

In normal usage, the **PrimaryRoutingFunction** and **RoutingAsyncEventListener** in the primary server will log messages like:

```
[info 2020/08/23 13:12:13.750 HST <ServerConnection on port 51965 Thread 1> tid=0x5b] PrimaryRoutingFunction processing args= [PDX[14273398,example.client.domain.Trade]{id=2}, EventID[id=31 bytes;threadID=1;sequenceID=2]]

[info 2020/08/23 13:12:13.762 HST <ServerConnection on port 51965 Thread 1> tid=0x5b] PrimaryRoutingFunction processing args= [PDX[14273398,example.client.domain.Trade]{id=3}, EventID[id=31 bytes;threadID=1;sequenceID=3]]

[info 2020/08/23 13:12:13.789 HST <ServerConnection on port 51965 Thread 1> tid=0x5b] PrimaryRoutingFunction processing args= [PDX[14273398,example.client.domain.Trade]{id=8}, EventID[id=31 bytes;threadID=1;sequenceID=8]]

[info 2020/08/23 13:12:13.797 HST <ServerConnection on port 51965 Thread 1> tid=0x5b] PrimaryRoutingFunction processing args= [PDX[14273398,example.client.domain.Trade]{id=9}, EventID[id=31 bytes;threadID=1;sequenceID=9]]

[info 2020/08/23 13:12:14.412 HST <Event Processor for GatewaySender_AsyncEventQueue_routing_aeq_0> tid=0x47] RoutingAsyncEventListener: Processing 4 events (total=4; possibleDuplicate=0)
  key=2; value=PDX[14273398,example.client.domain.Trade]{id=2}; possibleDuplicate=false
  key=3; value=PDX[14273398,example.client.domain.Trade]{id=3}; possibleDuplicate=false
  key=8; value=PDX[14273398,example.client.domain.Trade]{id=8}; possibleDuplicate=false
  key=9; value=PDX[14273398,example.client.domain.Trade]{id=9}; possibleDuplicate=false
```

The **SecondaryRoutingFunction** in the secondary servers will log messages like:

```
[info 2020/08/23 13:12:13.756 HST <Function Execution Processor2> tid=0x3d] SecondaryRoutingFunction processing args= [/Router, 2, PDX[14273398,example.client.domain.Trade]{id=2}, EventID[id=31 bytes;threadID=1;sequenceID=2], 163]

[info 2020/08/23 13:12:13.763 HST <Function Execution Processor2> tid=0x3d] SecondaryRoutingFunction processing args= [/Router, 3, PDX[14273398,example.client.domain.Trade]{id=3}, EventID[id=31 bytes;threadID=1;sequenceID=3], 164]

[info 2020/08/23 13:12:13.790 HST <Function Execution Processor2> tid=0x3d] SecondaryRoutingFunction processing args= [/Router, 8, PDX[14273398,example.client.domain.Trade]{id=8}, EventID[id=31 bytes;threadID=1;sequenceID=8], 169]

[info 2020/08/23 13:12:13.799 HST <Function Execution Processor2> tid=0x39] SecondaryRoutingFunction processing args= [/Router, 9, PDX[14273398,example.client.domain.Trade]{id=9}, EventID[id=31 bytes;threadID=1;sequenceID=9], 170]
```

### Killed Server

If a server is killed while routing events, the server logs will contain messages like below.

In this example, the last log messages from the **PrimaryRoutingFunction** in the killed server were:

```
[info 2020/08/23 14:17:05.681 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=756}, EventID[id=31 bytes;threadID=1;sequenceID=756]]

[info 2020/08/23 14:17:05.691 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=758}, EventID[id=31 bytes;threadID=1;sequenceID=758]]

[info 2020/08/23 14:17:05.709 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=764}, EventID[id=31 bytes;threadID=1;sequenceID=764]]

[info 2020/08/23 14:17:05.717 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=766}, EventID[id=31 bytes;threadID=1;sequenceID=766]]

[info 2020/08/23 14:17:05.742 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=769}, EventID[id=31 bytes;threadID=1;sequenceID=769]]

[info 2020/08/23 14:17:05.757 HST <ServerConnection on port 56033 Thread 1> tid=0x5a] PrimaryRoutingFunction processing args= [PDX[8290614,example.client.domain.Trade]{id=772}, EventID[id=31 bytes;threadID=1;sequenceID=772]]
```

This server was killed before the **RoutingAsyncEventListener** could process these six events.

Of these six events, three of them were processed by the **SecondaryRoutingFunction** in one redundant server. Once the server was killed, these events were processed as possible duplicates by the **RoutingAsyncEventListener**:

```
[info 2020/08/23 14:17:05.682 HST <Function Execution Processor2> tid=0x3a] SecondaryRoutingFunction processing args= [/Router, 756, PDX[8290614,example.client.domain.Trade]{id=756}, EventID[id=31 bytes;threadID=1;sequenceID=756], 990]

[info 2020/08/23 14:17:05.692 HST <Function Execution Processor2> tid=0x3a] SecondaryRoutingFunction processing args= [/Router, 758, PDX[8290614,example.client.domain.Trade]{id=758}, EventID[id=31 bytes;threadID=1;sequenceID=758], 766]

[info 2020/08/23 14:17:05.718 HST <Function Execution Processor2> tid=0x3a] SecondaryRoutingFunction processing args= [/Router, 766, PDX[8290614,example.client.domain.Trade]{id=766}, EventID[id=31 bytes;threadID=1;sequenceID=766], 908]

[info 2020/08/23 14:17:11.505 HST <Event Processor for GatewaySender_AsyncEventQueue_routing_aeq_0> tid=0x45] RoutingAsyncEventListener: Processing 5 events (total=266; possibleDuplicate=3)
  key=758; value=PDX[8290614,example.client.domain.Trade]{id=758}; possibleDuplicate=true
  key=766; value=PDX[8290614,example.client.domain.Trade]{id=766}; possibleDuplicate=true
  key=756; value=PDX[8290614,example.client.domain.Trade]{id=756}; possibleDuplicate=true
```

The other redundant server processed the other three events in the same way:

```
[info 2020/08/23 14:17:05.710 HST <Function Execution Processor2> tid=0x37] SecondaryRoutingFunction processing args= [/Router, 764, PDX[8290614,example.client.domain.Trade]{id=764}, EventID[id=31 bytes;threadID=1;sequenceID=764], 793]

[info 2020/08/23 14:17:05.744 HST <Function Execution Processor2> tid=0x37] SecondaryRoutingFunction processing args= [/Router, 769, PDX[8290614,example.client.domain.Trade]{id=769}, EventID[id=31 bytes;threadID=1;sequenceID=769], 572]

[info 2020/08/23 14:17:05.758 HST <Function Execution Processor2> tid=0x37] SecondaryRoutingFunction processing args= [/Router, 772, PDX[8290614,example.client.domain.Trade]{id=772}, EventID[id=31 bytes;threadID=1;sequenceID=772], 822]

[info 2020/08/23 14:17:11.490 HST <Event Processor for GatewaySender_AsyncEventQueue_routing_aeq_0> tid=0x45] RoutingAsyncEventListener: Processing 4 events (total=266; possibleDuplicate=3)
  key=769; value=PDX[8290614,example.client.domain.Trade]{id=769}; possibleDuplicate=true
  key=764; value=PDX[8290614,example.client.domain.Trade]{id=764}; possibleDuplicate=true
  key=772; value=PDX[8290614,example.client.domain.Trade]{id=772}; possibleDuplicate=true
```

## Future

Two useful additions to Apache Geode would be:
* Allowing configuration of a PARTITION_PROXY Region on all members into which operations can be done
* An API to deliver events directly to AsyncEventQueues