---
date: '2020-05-06'
description: Leverage Apache Kafka, a distributed streaming platform built for storing
  and processing streams of records, while focusing on performance.
lastmod: '2021-03-07'
linkTitle: Kafka
patterns:
- Eventing
subsection: Kafka
tags:
- Kafka
- Event Streaming
team:
- Brian McClain
title: Getting Started with Kafka
topics:
- Event Streaming
- Messaging and Integration
oldPath: "/content/guides/messaging-and-integration/kafka-gs.md"
aliases:
- "/guides/messaging-and-integration/kafka-gs"
level1: Building Modern Applications
level2: Services
---

## What Is Kafka?
[Apache Kafka](https://kafka.apache.org/) is a distributed streaming platform built for publishing, consuming, storing, and processing streams of records. It’s built to run as a cluster of servers potentially across multiple data centers, and to focus on performance and reliability. 

## Before You Begin

Before you begin, there are a few tools you will need:

- [Docker Desktop](https://docs.docker.com/get-docker/). You’ll run your Kafka server in a container to ease the setup. If you’d prefer to run Kafka natively, checkout the 
- [Kafka Quickstart guide](https://kafka.apache.org/quickstart).
- [Docker Compose](https://docs.docker.com/compose/install/). Kafka has a dependency on [Zookeeper](https://zookeeper.apache.org/), so instead you can use a `docker-compose.yml` file, referenced later, to make standing up your Kafka server easier.
Your text editor or IDE of choice.
- [JDK 1.8](https://www.oracle.com/java/technologies/javase-downloads.html) or newer.

This example has been written in Java, but if you’d like to see the example in other languages, to see the whole thing put together, you can find these [on GitHub](https://github.com/BrianMMcClain/kafka-getting-started)

## Using Kafka

To ease the setup of your Kafka server, you can run Kafka and Zookeeper in containers, already built and configured, ready to go. Ensure that Docker is running, and then stand up your Kafka server by running the following:

```
$ curl  https://raw.githubusercontent.com/BrianMMcClain/kafka-getting-started/master/docker-compose.yml -o docker-compose.yml

$ docker-compose up
```

This will do a few things:

Start the Zookeeper container and expose port 2182
Start the Kafka container and expose ports 9092 and 29092
Configure Kafka so it knows where Zookeeper is

You’ll see quite a few logs fly by, but it should end with something like the following, letting you know that Kafka is up and running:

```
kafka_1      | [2020-04-17 16:36:02,261] INFO Kafka startTimeMs: 1587141362239 (org.apache.kafka.common.utils.AppInfoParser)
kafka_1      | [2020-04-17 16:36:02,263] INFO [KafkaServer id=1001] started (kafka.server.KafkaServer)
```
## Building the Application
The application has two parts: the emitter, which will generate and send messages to Kafka, and the receiver, which will constantly listen for messages from Kafka and print them to the console. Both applications share a similar `pom.xml` file, which only has one dependency:

```
<dependency>
    <groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>2.5.0</version>
</dependency>
```

This Kafka client will handle everything from the connection to the server, to sending messages, to polling the server for new messages.

### Building The Emitter

The entirety of the code for the emitter can be found in the `emitter.java` file. There’s a few things going on in this code, so as usual it’s best to walk through it step  by step:

```java
// Set the properties to use when connecting to Kafka
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:29092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

Producer<String, String> producer = new KafkaProducer<String, String>(props);
```

Here is where the connection and communication with Kafka is configured. First, `bootstrap.servers` is defined, providing one or more servers to the client to make the initial connection with Kafka. In this example, there’s only one server, but in a production cluster you could provide multiple servers. This will tell the Kafka client who to talk to so that it can find out the information for the rest of the Kafka cluster.

The `key.serializer` and `value.serializer` tell the client how to serialize the data sent to the Kafka server. There’s a couple of options for which serializer to use, but to keep the example simple and knowing you’ll only be sending strings to Kafka, you can set both to use the `StringSerializer`. As always, if you’re interested in learning more, make sure to check out the [documentation](https://kafka.apache.org/090/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html).

```java
//Begin reading user input
System.out.println("Ready to send messages. Type \"exit\" to quit.");
while (true) {
    System.out.print("> ");
    String message = System.console().readLine();

    // Close application when user types "exit"
    if (message.equalsIgnoreCase("exit")) {
    	producer.close();
		System.exit(0);
	}

	// Send the message to the queue
	producer.send(new ProducerRecord<String, String>(TOPIC_NAME, "key-" + message, message));
    System.out.println("Sent '" + message + "'");
}
```

Once connected to Kafka, the code begins a loop of taking the user input, checking if they wish to exit, and—if not—sending their input to Kafka. Earlier in the code, the constant `TOPIC_NAME` is set to `hello`, which is where all messages will be sent to. None  of this code is specific to Kafka, except for this line:

```java
producer.send(new ProducerRecord<String, String>(TOPIC_NAME, null, message));
```

This creates a new `ProducerRecord`, taking in three arguments: a topic, key, and message. This record is then sent to Kafka using the `producer` created earlier in the code. While the `message` is simply the input that was read from the user, the `key` is a bit less obvious. In short, keys in Kafka are used to figure out how to distribute messages. This key can be set to the same value for all messages if you want to guarantee all messages go to one consumer. This could be a unique key to distribute messages across multiple consumers. In this case, the key is set to `null` so that the consumer will be chosen at random.

With this, your producer is ready to start sending messages! Now it’s time to focus on the other end: receiving messages.

### Building the Consumer

Much of the consumer code, found in the [consumer.java file](https://github.com/BrianMMcClain/kafka-getting-started/blob/master/java/consumer/src/main/java/com/github/brianmmcclain/kafkagettingstarted/consumer.java), will look similar to the producer. Or at least setting up the connection will.

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:29092");
props.put("group.id", "kafka-getting-started");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
```

The one additional property that’s set here is `group.id`. This property defines which consumer group the consumer is part of. A consumer group controls how consumers are assigned partitions of a topic, and every consumer that connects with the same group ID will be placed in the same consumer group. Other than that, the other properties are the same as the emitter.

```java
// Subscribe to the topic in Kafka
consumer.subscribe(Arrays.asList(TOPIC_NAME));
```

Once the consumer is created and connected, it is then subscribed to a topic. Much like the emitter, `TOPIC_NAME` is defined earlier in the code as a string.

```java
// Begin polling Kafka for new messages
System.out.println("Waiting for messages. To exit press CTRL+C\n");

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

    for (ConsumerRecord<String, String> record : records)
        System.out.println(record.value());
}
```

Finally, the consumer begins polling Kafka for new messages. For each new message that it received, it prints it out to the console.

## Running the Example

With Kafka running from earlier in the example, all that’s left is to run the emitter and the consumer. Open two terminals, one in the `java/emitter` directory and one in the `java/consumer` directory. To run the consumer, you can run the following:

```
./mvnw clean package
java -jar target/kafka-getting-started-consumer-0.0.1-SNAPSHOT.jar
```

Likewise, you can run the emitter with the following command:

```
./mvnw clean package
java -jar target/kafka-getting-started-emitter-0.0.1-SNAPSHOT.jar
```

After a few moments, both will be running. You’ll be greeted with a prompt for input from the emitter, and you can start sending messages to Kafka!

```
Ready to send messages. Type "exit" to quit.
> 1
Sent '1'
> 2
Sent '2'
> 3
Sent '3'
>
```

As you send messages from the emitter, you should start seeing them arrive on the consumer:

```
1
2
3
```

## Keep Learning

This example covers just the very basics of using Kafka in your code, but there’s a whole lot more to learn. More than anything, if you’re looking to learn more about Kafka, make sure to check out the [official documentation](https://kafka.apache.org/documentation/) and just the [Apache Kafka](https://kafka.apache.org/) site in general.