---
title: Spring Cloud Stream Kafka
linkTitle: Spring Cloud Stream Kafka
subsection: Spring Cloud Stream Kafka (Part 1)
description: A simple demonstration of how to implement your Java application with
  Kafka (Spring Cloud Stream) with the least amount of code in your Spring Boot application.
topics:
- Spring
- Microservices
- Event Streaming
- Messaging and Integration
tags:
- Spring Cloud Stream Kafka
- Event Streaming
- Spring
- Kafka
patterns:
- Eventing
team:
- Jay Ehsaniara
oldPath: "/content/guides/event-streaming/spring-cloud-stream-kafka-p1.md"
aliases:
- "/guides/event-streaming/spring-cloud-stream-kafka-p1"
---


This document provides a simple demonstration of how to implement your Java application with Kafka using the least amount of code. The goal is to achieve a lot out of the box, without having to reinvent the wheel and implement it in your Spring Boot application.

## Audience

This document has been written for:

- Developers with Java (intermediate), Spring Boot (basic) and Maven dependency management.
- Developers interested in migrating from "Java EE" (`J2EE`, please visit [here](https://www.oracle.com/java/technologies/javase/javanaming.html) for naming details) into modern application development ([12Factor](https://12factor.net)) and application containerization.
- Basic Kafka knowledge, including Brokers, Topic, and Partitions.

For more about Spring Boot Background Modern Application Development or Kafka, refer to the following:
- [Spring Boot](https://spring.io/guides/gs/spring-boot/)
- [12 Factor, or Cloud-Native Apps](https://tanzu.vmware.com/content/videos/12-factor-or-cloud-native-apps-what-exactly-does-that-mean-for-spring-developers-thomas-gamble)
- [Kafka Introduction](https://kafka.apache.org/intro)


## Before You Begin

To do this tutorial, make sure that the following software is on your workstation:
- Java 8 (preferably Java 11)
- Maven 2 or greater 
  * (For Gradle builds: Gradle 6.0 or greater, and run `gradle init` to convert current maven into gradle)
- Java Editor such as IntelliJ or Eclipse. 
- Docker (Docker Compose)

The complete running code for this tutorial is available in [Github](https://github.com/ehsaniara/scs-kafka-intro/tree/main/scs-099).

## Spring Cloud Stream Kafka
This tutorial provides examples on how to enable the Apache Kafka binder with Spring Cloud Stream Kafka.

The following diagram shows Spring Cloud Stream Kafka enabling Apache Kafka Binder on top of [https://spring.io/projects/spring-cloud-stream](https://spring.io/projects/spring-cloud-stream).

![General Flow Diagram](/images/guides/event-streaming/kafka-events-intro-099-1.svg)

### Add a Dependency to the Project
For this example, we are using the following dependency: `spring-cloud-stream-binder-kafka` (_[Hoxton.SR11](https://docs.spring.io/spring-cloud/docs/Hoxton.SR11/reference/html/)_). In later versions, the `@EnableBinding` feature will be _~~deprecated~~_ in favor of _Functional Programming_, which we will look into later. (for more information, see [here](https://github.com/spring-cloud/spring-cloud-stream-binder-kafka))


```xml
<dependency>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-stream-binder-kafka</artifactId>
</dependency>
```

### Configure the Binders
The next step is to configure the binders.
For more information, see [MyBinder.java](https://github.com/ehsaniara/scs-kafka-intro/blob/main/scs-099/src/main/java/com/ehsaniara/scs_kafka_intro/scs099/MyBinder.java).


In this example, we are using a modified version of the `sink.class` interface, rather than `@EnableBinding(sink.class)`. Channel has also referred as `order`.

```java
public interface MyBinder {
   String ORDER_IN = "order-in";
   String ORDER_OUT = "order-out";

   @Input(ORDER_IN)
   SubscribableChannel orderIn();

   @Output(ORDER_OUT)
   MessageChannel orderOut();
}
```

In the following example,  the order has been enabled  through `@EnableBinding(value = {MyBinder.class})`. The schedule has also been set to create 10 messages, every 5 seconds  , and write it into our topic (for this example: “`scs-099.order`”).


```java
@Scheduled(initialDelay = 5_000, fixedDelay = 5_000)
public void producer() {
   IntStream.range(0, 10)
      .forEach(value -> {

         var message = String.format("TestString of %s - %s", counter, value);
            myBinder.orderOut()
               .send(MessageBuilder.withPayload(message).build());

         log.warn("message produced: {}", message);

      });
   counter++;
}
```

The following code shows 10 messages publishing  in the topic and logging in the console. The code also increments the counter per every scheduler attempt to keep logs clean.

You can make it a `WARN` log. A `WARN` log has different colors, making it stand out from other logs.
```
.. 08:42:19.433  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 0
.. 08:42:19.434  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 1
.. 08:42:19.434  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 2
.. 08:42:19.435  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 3
.. 08:42:19.435  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 4
.. 08:42:19.435  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 5
.. 08:42:19.435  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 6
.. 08:42:19.436  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 7
.. 08:42:19.436  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 8
.. 08:42:19.436  WARN 47569 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 9
```
So far, we've created messages on the topic. As you can see, Spring Cloud Streams make this job very easy. If you add the following line, you can publish your message.
```java
myBinder.orderOut().send(MessageBuilder.withPayload(“Text…”).build());
```
Now, it’s time to consume the message.

```java
@StreamListener(MyBinder.ORDER_IN)
public void consumer(@Payload String message) {
   log.debug("message consumed: {}", message);
}
```

Here, the application subscribes to our Kafka topic and logs them in the console. Now, you also need to bind your publisher and subscriber channels to the Kafka topic using  the least amount of code:
```yaml
spring:
  cloud.stream.bindings:
    order-out.destination: scs-099.order # Topic Name
    order-in.destination: scs-099.order # Topic Name
```
_TopicName: scs-099_


## It’s Showtime!
Make sure Kafka is running, then run the following [docker-compose](https://github.com/ehsaniara/scs-kafka-intro/blob/main/docker-compose.yml) file in the same path where the docker-compose file is located. Address it by adding `-f path_to_docker_compose_file.yml`.
```shell
docker-compose up -d
```

Build the project:

```shell
mvn clean package
```
Run the generated **jar** file in the `target` folder, Make sure you are in the same directory when you run the **jar** file.  Or, give the full path.

```shell
java -jar scs-099-0.0.1-SNAPSHOT.jar
```
![General Flow Diagram](/images/guides/event-streaming/kafka-events-intro-099-2.svg)

{{% callout %}}
**Note:** _The application starts to listen on port 8080. The port cannot be occupied by any other app. If it is, try to pass the following parameter before `-jar` by adding `-Dserver.port=8081`._
{{% /callout %}}


Now, the console shows  10 messages from the producer (when it’s producing messages) and 10 messages from the consumer.


Based on the current default configuration, the consumer app has only one concurrent threat,   to consume the message: `container-0-C-1`. Note, all messages have been produced from the same thread.

{{% callout %}}
**Note**: _You can simulate a busy consumer and long-running process by adding a 200ms delay._
{{% /callout %}}


```
.. 19:31:51.475  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 0
.. 19:31:51.475  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 1
.. 19:31:51.476  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 2
.. 19:31:51.476  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 3
.. 19:31:51.476  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 4
.. 19:31:51.477  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 5
.. 19:31:51.477  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 6
.. 19:31:51.477  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 7
.. 19:31:51.477  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 8
.. 19:31:51.478  WARN 59692 --- [   scheduling-1] c.e.s.scs099.PobSubService               : message produced: TestString of 0 - 9
.. 19:31:51.708 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 0
.. 19:31:51.913 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 1
.. 19:31:52.118 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 2
.. 19:31:52.321 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 3
.. 19:31:52.526 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 4
.. 19:31:52.731 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 5
.. 19:31:52.932 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 6
.. 19:31:53.137 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 7
.. 19:31:53.343 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 8
.. 19:31:53.544 DEBUG 59692 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 0 - 9
```

## Single Producer and Single Consumer with 3 Threads
What if you want to use parallelism and involve more threads to consume your messages?

Now you can! First, stop the previous Java process. Then, try the following code:

```shell
java -Dspring.profiles.active=test3 -jar scs-099-0.0.1-SNAPSHOT.jar
```
If you look at the logs now, you’ll notice this time is a bit different in the consumer log.
```
.. 19:36:38.380 DEBUG 59798 --- [container-1-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 0
.. 19:36:38.385 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 2
.. 19:36:38.388 DEBUG 59798 --- [container-2-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 3
.. 19:36:38.585 DEBUG 59798 --- [container-1-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 1
.. 19:36:38.598 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 4
.. 19:36:38.603 DEBUG 59798 --- [container-2-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 5
.. 19:36:38.805 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 6
.. 19:36:39.010 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 7
.. 19:36:39.216 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 8
.. 19:36:39.422 DEBUG 59798 --- [container-0-C-1] c.e.s.scs099.PobSubService               : message consumed: TestString of 1 - 9
```

By activating a different profile (test3), a couple of more features append to the current configuration, similar to the following example:
```yaml
spring:
  cloud.stream.bindings:
    Order-out:
      destination: scs-099.order # Topic Name
      producer.partition-count: 10
    Order-in:
      destination: scs-099.order # Topic Name
      group: ${spring.application.name}-group
      consumer.concurrency: 3

cloud.stream.kafka.binder.autoAddPartitions: true
```
### What’s happened so far?

There are **3 concurrent threads** to execute the consumer method. The partition size is sized-up (> consumer number) so that every consumer has its own partition to subscribe. In addition, all consumers are now  in that same consumer group to prevent duplicate processing of the same message by a different consumer (`consumerGroup: scs-099-group`).

As you see, by using Spring Cloud Stream this happened by  only adding a few lines.

![General Flow Diagram](/images/guides/event-streaming/kafka-events-intro-099-4.svg)

All messages have been consumed based on the 200ms delay introduced in the consumer. Therefore, the total number of messages cannot be fully consumed in less than 2 Seconds (200ms  X 10 = 2000ms).

## Single Producer and 3 Consumer App (3 Separate JVM Processes)

Depending on your topic traffic or consumer performance, the best way you can scale up or down is to run your consumer in a different JVM.

{{% callout %}}
**NOTE**: _In future tutorials you’ll see how to containerize and scale this application._
{{% /callout %}}

So now, let's stop the previous Java process to make port 8080 available again.

Run the following java application in **3 different terminals** as follows:

On `Terminal-1:` This app has one producer and one consumer.
```shell
java -Dspring.profiles.active=test2 -jar scs-099-0.0.1-SNAPSHOT.jar
```
_Note: I have added the port check, so you only have one producer for our Kafka topic regardless of the number of apps._

On `Terminal-2:` This app has only one consumer.
```shell
java -Dspring.profiles.active=test2 -Dserver.port=8081 -jar scs-099-0.0.1-SNAPSHOT.jar
```

On `Terminal-3:` This app has only one consumer.
```shell
java -Dspring.profiles.active=test2 -Dserver.port=8082 -jar scs-099-0.0.1-SNAPSHOT.jar
```

![General Flow Diagram](/images/guides/event-streaming/kafka-events-intro-099-3.svg)

{{% callout %}}
**Note**: _To avoid having multiple producers, we just let only one app to create messages in the topic in the **producer** method by checking the (app port == 8080)_
{{% /callout %}}

### What’s happening now?
We only have one application running (producer and consumer on the same app). Similar to the previous example, we basically consume all messages based on the 200ms delay introduced in the consumer. Therefore, the total number of messages cannot be fully consumed in less than 2 seconds _(200ms  X 10 = 2000ms)_.

However, this time it’s running in different (JVM)s. Now, it  can be decoupled out and run in different machines or containers in the future. Our primary intention is to have **horizontal scalability** in the app.

When you run the app in the second terminal, you basically tell Kafka to distribute the message to the newly introduced consumer app. You see the new application start consuming some produced messages, but not the same ones from the first app.

At the same time, when you look at the first application you see Kafka is informing the app that a new consumer has subscribed to your topic on the given consumer group (as `INFO` logs). 

## Conclusion
The environments in which you have a fast producer but slower consumer are good examples and use cases for Kafka. In reality, consumers are slower. You don’t want them affecting your application producer performances.

For example, you want to make a log processing system and do some keyword search in the incoming messages. On the other hand, even though your application is producing a high amount of logs, adding the log processor system should not affect your actual application performance. Also, in case of a changing amount of logs, you want your system to be able to scale up or down easily and have a failover mechanism and resiliency.

The complete running code for this tutorial is available in [Github](https://github.com/ehsaniara/scs-kafka-intro/tree/main/scs-099).


## What’s Next
In the next tutorial [Part 2](/guides/event-streaming/spring-cloud-stream-kafka-p2), I’ll show a real life example such as the **PubSub** module, multiple Kafka topics and failover handling.
