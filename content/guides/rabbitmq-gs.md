---
date: '2020-05-06'
description: Leverage RabbitMQ, an open source message broker that is lightweight
  and easy to deploy on premises and in the cloud.
lastmod: '2021-03-23'
linkTitle: RabbitMQ
patterns:
- Eventing
tags:
- RabbitMQ
- Event Streaming
- Getting Started
- Messaging and Integration
featured: true
team:
- Brian McClain
title: Getting Started with RabbitMQ
oldPath: "/content/guides/messaging-and-integration/rabbitmq-gs.md"
aliases:
- "/guides/messaging-and-integration/rabbitmq-gs"
level1: Building Modern Applications
level2: Services
---

## What Is RabbitMQ?
At a high level, [RabbitMQ](https://www.rabbitmq.com/) is an open source message broker. A message broker accepts and translates messages from a producer (the message sender) and holds it in a queue so that a consumer (the message receiver) can retrieve it. This allows for multiple producers and consumers to share the same queue without having to directly pass messages between each other. What RabbitMQ excels at is doing this at scale while staying lightweight and easy to deploy.

## Before You Begin
Before you begin, there are a few tools you will need:
- [Docker](https://docs.docker.com/get-docker/). You’ll run your RabbitMQ server in a container to ease the setup. If you’d prefer to run RabbitMQ natively, checkout the documentation on [RabbitMQ’s website](https://www.rabbitmq.com/download.html).
- Your text editor or IDE of choice.
- [JDK 1.8](https://www.oracle.com/java/technologies/javase-downloads.html) or newer.

You can see the [completed example on GitHub](https://github.com/BrianMMcClain/rabbitmq-getting-started), including examples in other languages.

## Using RabbitMQ
To ease the setup of our RabbitMQ node, you’ll run the RabbitMQ container image from Docker Hub. Luckily, a lot of work has gone into this container image and there’s a lot of settings that you could tweak to meet your exact needs. For this example, you’ll just need a simple single-node RabbitMQ server, so you won’t need to change any of the default settings. You can run the container image with the following:

`docker run -it --rm -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

Here, you’ll run the `3-management tag` of the RabbitMQ container image. The `3-management` tag of this image ships with the [management plug-in](https://www.rabbitmq.com/management.html), which will provide an HTTP API and web-based UI for your RabbitMQ server. You’ll tell Docker to run this with an interactive shell with the `-it` option, as well as tell it to automatically remove the container when it exits with the `-rm` option. You’ll also forward a couple of ports (5672 for the RabbitMQ server and 15672 for the HTTP API and web UI) from your local machine to the container, which means that you can connect to it on `localhost`.

To access the web UI, go to [http://localhost:15672](http://localhost:15672). The `username` and `password` are both `guest`. Here you can change settings, add and remove users, as well as view diagnostic information from the server. 

### Building the Emitter

First, you’ll need some code to emit messages to RabbitMQ. There are [client libraries](https://www.rabbitmq.com/devtools.html) for many languages and frameworks, but this example has been written in Java. You can find examples for other languages, as well as the full example put together, [on GitHub](https://github.com/BrianMMcClain/rabbitmq-getting-started).

Before you can begin sending messages to RabbitMQ, you’ll first need to connect to the server. 

```java
// Connect to the RabbitMQ server
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
try {
  Connection connection = factory.newConnection();
```

Here, a `ConnectionFactory` is used to create the new connection. Since the server does not require a username or password, only the hostname needs to be set. Also, since all of the container’s required ports are published, you can connect on `localhost`. Finally, since the `factory.newConnection()` call can throw both an `IOException` and a `TimeoutException`, you can start the connection in a new `try` block.

Great! You’ve connected to the RabbitMQ server, but now you’ll need to create a [channel](https://www.rabbitmq.com/channels.html) (a logical connection within your physical connection) to communicate over, as well as a [queue](https://www.rabbitmq.com/queues.html) to send messages to. Make sure to refer to the RabbitMQ documentation for more information on both channels and queues. This can be done in a few lines of code:

```java
// Create a channel
Channel channel = connection.createChannel();

// Create and connect to the queue. The arguments, in order, are:
// queue - Name of the queue we are connecting on
// durable - If true, RabbitMQ will write messages to disk
// exclusive - If true, only this connection may connect to the queue
// autoDelete - If true, the queue will be deleted when it is no longer in use
// The final argument takes a Map of additional optional arguments
channel.queueDeclare(QUEUE_NAME, false, false, false, null);
```

As noted in the comments of the code, `connection.createChannel()` will create the channel for you without any arguments. Creating and connecting to the queue with `channel.queueDeclare()`, however, will take a few arguments. Make sure to read the comments explaining each argument. Another thing to note is that if this queue already exists, the code will simply connect to the existing one.

With this code, you’ve successfully done all of the setup needed to start sending messages! 

```java
// Begin reading user input
while (true) {
  System.out.print("> ");
  String message = System.console().readLine();
	
  // Send the message to the queue
  channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
  System.out.println("Sent '" + message + "'");
}
```

The example will continuously loop, prompting the user to input the message  they wish to send, then send it to RabbitMQ with the `channel.basicPublish()` method. From there, all that’s left is to close out the initial `try` block by catching any exceptions that may occur.

```java
} catch (Exception e) {
	System.out.println(e.getMessage());
}
```

For the sake of simplicity, the example will just catch any exception thrown, but as always it’s best practice to catch the specific exceptions that the various methods throw. Connecting to the server may throw a `TimeoutException`, for example, but publishing the message could throw an `IOException`. Once it’s all put together, the code looks like this:

```java
package com.github.brianmmcclain.rabbitmqgettingstarted;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

public class emitter {

	private final static String QUEUE_NAME = "hello";
	public static void main(String[] args) {
		
		// Connect to the RabbitMQ server
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");

		try {
			Connection connection = factory.newConnection();
				
			// Create a channel
			Channel channel = connection.createChannel();
			
			// Create and connect to the queue. The arguments, on order, are:
			// queue - Name of the queue we are connecting on
			// durable - If true, RabbitMQ will write messages to disk
			// exclusive - If true, only this connection may connect to the queue
			// autoDelete - If true, the queue will be deleted when it is no longer in use
			// The final argument takes a Map of additional optional arguments
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
			
			// Begin reading user input
			while (true) {
				System.out.print("> ");
				String message = System.console().readLine();
				
				// Send the message to the queue
				channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
				System.out.println("Sent '" + message + "'");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
```

If you’d like to build the emitter yourself, check out the [complete example on GitHub](https://github.com/BrianMMcClain/rabbitmq-getting-started/tree/master/java/emitter) which includes the `pom.xml` file with all the required dependencies. You can build the code by running:

`./mvnw clean package`

And run it with:

`java -jar target/rabbitmq-getting-started-emitter-0.0.1-SNAPSHOT.jar`

### Building the Consumer

Now that you’re emitting messages to RabbitMQ, you’ll need some code to consume those messages. The code to connect to the server is the same as the emitter. You’ll set up a `ConnectionFactory` to connect on `localhost` as well as create a channel with the `createChannel()` method:

```java
// Connect to the RabbitMQ server
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");

try {
  Connection connection = factory.newConnection();
	// Create a channel and connect it to the queue
  Channel channel = connection.createChannel();

  System.out.println("Waiting for messages. To exit press CTRL+C\n");
```

You’ll need to do something a bit different for consuming messages, however, as the code doesn’t know when messages are coming in. For this limited example, sitting around waiting for the next message may be fine, but that may not be the case for a more realistic use case., So, you’ll need to create a callback. That way any time your code receives a new message, the callback will be invoked with the details of the message.

```java
// Setup the callback to be invoked when a new message is received
DeliverCallback deliverCallback = (consumerTag, delivery) -> {
  // Read the message from the message object and print to stdout
  String message = new String(delivery.getBody(), "UTF-8");
  System.out.println(" > " + message);
};
```

With the callback defined, you’ll then need to tell the server you’re ready to start consuming messages from the queue. You can do this with the `basicConsume()` method by providing it with the queue you wish to consume from as well as the callback to invoke when a message is received:

```java
// Begin consuming messages from the queue. The second argument will tell

 // RabbitMQ to automatically consider the message acknowledged once received.
channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });
```

Finally, as with the emitter, all that remains is to handle any exceptions thrown in the `try` block. Take a look at the whole code put together:

```java
package com.github.brianmmcclain.rabbitmqgettingstarted;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class consumer {

	private final static String QUEUE_NAME = "hello";

	public static void main(String[] args) {
		
		// Connect to the RabbitMQ server
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		
		try {
			Connection connection = factory.newConnection();

			// Create a channel and connect it to the queue
			Channel channel = connection.createChannel();
			System.out.println("Waiting for messages. To exit press CTRL+C\n");

			// Setup the callback to be invoked when a new message is received
			DeliverCallback deliverCallback = (consumerTag, delivery) -> {
				// Read the message from the message object and print to stdout
				String message = new String(delivery.getBody(), "UTF-8");
				System.out.println(" > " + message);
			};

			// Begin consuming messages from the queue. The second argument will tell
			// RabbitMQ to automatically consider the message acknowledged once received.
			channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
```

Much as you can with the emitter, you can see the entire example for the consumer [on GitHub](https://github.com/BrianMMcClain/rabbitmq-getting-started/tree/master/java/consumer) which includes the `pom.xml` file with all the required dependencies. You can build the code by running:

`./mvnw clean package`

And run it with:

`java -jar target/rabbitmq-getting-started-emitter-0.0.1-SNAPSHOT.jar`

## Running the Code 

Assuming you’ve already started the RabbitMQ container, you can run this example by opening two terminals, running the emitter in one and the consumer in the other.

Terminal 1
```
$ java -jar target/rabbitmq-getting-started-emitter-0.0.1-SNAPSHOT.jar
>
```

Terminal 2
```
$ java -jar target/rabbitmq-getting-started-consumer-0.0.1-SNAPSHOT.jar
Waiting for messages. To exit press CTRL+C

```

Now, in the first terminal, you may begin typing the message you’d like to send, pressing [Enter] to send it:

```
$ java -jar target/rabbitmq-getting-started-emitter-0.0.1-SNAPSHOT.jar
> Hello RabbitMQ!
Sent 'Hello RabbitMQ!'
```

In the second terminal, you should see that the message was received:

```
$ java -jar target/rabbitmq-getting-started-consumer-0.0.1-SNAPSHOT.jar
Waiting for messages. To exit press CTRL+C

 > Hello RabbitMQ!
```

Congratulations! You’ve just sent and received your first message using RabbitMQ!

### Multiple Consumers

There’s still so much that RabbitMQ can offer with regards to how messages can be sent and received, different delivery methods, and different ways to include information around your messages. For example, you may wish for all consumers to receive a message, or for exactly one consumer to receive a message. To learn more make sure to [check out the documentation on the RabbitMQ website](https://www.rabbitmq.com/getstarted.html).

One interesting scenario to explore is the case of multiple consumers. You can start multiple consumers and, as you’ll notice,  each message is delivered to only one consumer, alternating which consumer gets which message. Give it a try by opening up a third terminal and running another instance of the consumer. Try sending several messages from the emitter:

```
$ java -jar target/rabbitmq-getting-started-emitter-0.0.1-SNAPSHOT.jar
> 1
Sent '1'
> 2
Sent '2'
> 3
Sent '3'
> 4
Sent '4'
> 5
Sent '5'
> 6
Sent '6'
```

You’ll notice that one consumer only received half of the messages:

```
$ java -jar target/rabbitmq-getting-started-consumer-0.0.1-SNAPSHOT.jar
Waiting for messages. To exit press CTRL+C

 > 1
 > 3
 > 5
```

While the other consumer received the other half:

```
$ java -jar target/rabbitmq-getting-started-consumer-0.0.1-SNAPSHOT.jar
Waiting for messages. To exit press CTRL+C

 > 2
 > 4
 > 6
```

This is one pattern that can be leveraged for scenarios where you only need one consumer to process a message. But it will allow you to easily scale up to meet the workload your environment needs just by adding more consumers.

## Keep Learning

This overview has only scratched the surface of the capabilities of RabbitMQ;  there are many more docs that lay out  [how to route and deliver messages](https://www.rabbitmq.com/getstarted.html), as well as how to [build and configure bigger, more robust and reliable clusters](https://www.rabbitmq.com/clustering.html). The [official RabbitMQ documentation](https://www.rabbitmq.com/documentation.html) is very thorough and covers both operation and development using RabbitMQ.

Additionally, if you’re a Spring developer, make sure to check out [Getting Started With Spring Cloud Stream](/guides/event-streaming/scs-gs), which is a very powerful way of implementing messaging using the message broker of your choice. Or, if you are using Kubernetes, check out [RabbitMQ for Kubernetes](https://tanzu.vmware.com/content/blog/introducing-rabbitmq-for-kubernetes).