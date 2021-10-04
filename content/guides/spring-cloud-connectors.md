---
date: '2021-02-24'
lastmod: '2021-02-24'
linkTitle: Spring Cloud Connectors
patterns:
- API
subsection: Spring Cloud Connectors
tags:
- Kafka
- Spring
- Spring Data
- Spring Cloud
- Spring Cloud Connectors
title: What are Spring Cloud Connectors?
weight: 5
oldPath: "/content/guides/spring/spring-cloud-connectors.md"
aliases:
- "/guides/spring/spring-cloud-connectors"
level1: Building Modern Applications
level2: Frameworks and Languages
---

[Spring Cloud Connectors](https://cloud.spring.io/spring-cloud-connectors/) is a project that simplifies the process of connecting Spring applications to services in cloud platforms and gaining operational awareness of those platforms. It is designed for extensibility: you can use one of the provided cloud connectors or write one for your cloud platform, you can use the built-in support for commonly-used services (like relational databases, MongoDB, Redis, RabbitMQ), or extend Spring Cloud Connectors to work with your own services.

## Cloud Platform Support

Out of the box, Spring Cloud Connectors offers support for the Cloud Foundry and Heroku platforms. You can also extend Spring Cloud Connectors to provide support for other cloud platforms and providers.

Spring Cloud Connectors uses the `CloudConnector` interface to provide cloud platform support. A `CloudConnector` implementation for a particular cloud platform is responsible for detecting when the application is running in that cloud platform, obtaining information about the application from the cloud platform, and obtaining information about the services that are bound to the application.

## Cloud Service Support

You can extend Spring Cloud Connectors to support additional services, including services that are specific to your own environment or application. Spring Cloud Connectors uses two interfaces to provide cloud service support:

* `ServiceInfo` models the information required to connect to the service. In the case of a database service, a ServiceInfo implementation might include fields for host, port, database name, username, and password; in the case of a web service, it might include fields for URL and API key.

* `ServiceInfoCreator` creates `ServiceInfo` objects based on the service information collected by a cloud connector. A ServiceInfoCreator implementation is specific to a cloud platform.

## Application Framework Support

The Spring Cloud Spring Service Connector creates service connectors with Spring Data data types. You can extend Spring Cloud Connectors to provide service connection objects using another framework.

Spring Cloud Connectors uses the `ServiceConnectorCreator` interface to provide framework support. A `ServiceConnectorCreator` creates service connectors using the service connection information provided by a `ServiceInfo` object.

## Examples

### Using the Cloud Foundry Connector
The Cloud Foundry connector discovers services that are bound to an application running in Cloud Foundry. (Since Cloud Foundry enumerates each service in a consistent format, Spring Cloud Connectors does not care which service provider is providing it.)

This connector checks for the presence of a `VCAP_APPLICATION` environment variable. This is a system-provided environment variable which is specific to Cloud Foundry. If the variable exists, the connector will be activated.

Cloud Foundry users may define their own user-provided service using the `cf` CLI. The command is of the format:

```shell
cf cups [service-name] -p "comma,separated,list,of,params"
```

Example: `cf cups oracle-db-service -p "jdbcUrl"`

Once the service is defined, you bind the service to your application and then consume the `VCAP_SERVICES` environment variable, which stores connection and identification information for service instances that are bound to Cloud Foundry apps. 

A sample `VCAP_SERVICES` entry looks like:

```yml
{
 "VCAP_SERVICES": {
  "user-provided": [
   {
	"credentials": {
 	"jdbcUrl": "oracle://$user:$password@$hostname:$port/$name"
	},
	"label": "user-provided",
	"name": "oracle-db-service",
	"syslog_drain_url": "",
	"tags": [],
	"volume_mounts": []
   },
   {
	"credentials": {
 	"hosts": "localhost:8080",
 	"password": "welcome",
 	"username": "user"
	},
	"label": "user-provided",
	"name": "cassandra-service",
	"syslog_drain_url": "",
	"tags": [],
	"volume_mounts": []
   }
  ]
 }
}
```

In your code, you can parse this information to retrieve connection details or create a custom Spring Cloud connector.


### Creating a Kafka Connector

Let’s look at creating a Kafka connector to consume a Kafka user-provided service. This is accomplished in three steps:

**1. Create a `KafkaServiceInfo` by extending the `BaseServiceInfo` from the spring-cloud-connector library:**

```java
package com.example.kafka;

import org.springframework.cloud.service.BaseServiceInfo;

public class KafkaServiceInfo extends BaseServiceInfo {

    public KafkaServiceInfo(String id) {
   	 super(id);
    }

    public KafkaServiceInfo(String id, String url, String username, String password) {
   	 super(id);
   	 this.url = url;
   	 this.username = username;
   	 this.password = password;
    }

    private String url;
    private String username;
    private String password;

    @ServiceProperty
    public String getUrl() {
   	 return url;
    }

    @ServiceProperty
    public String getUsername() {
   	 return username;
    }

    @ServiceProperty
    public String getPassword() {
   	 return password;
    }

    @Override
    public String toString() {
   	 return "KafkaServiceInfo [url=" + url + ", username=" + username + ", password=" + password + "]";
    }

}
```

**2. Create a `KafkaServiceInfoCreator` by extending `CloudFoundryServiceInfoCreator`**

```java
package com.example.kafka;

import java.util.Map;

import org.springframework.cloud.cloudfoundry.CloudFoundryServiceInfoCreator;
import org.springframework.cloud.cloudfoundry.Tags;

public class KafkaServiceInfoCreator extends CloudFoundryServiceInfoCreator<KafkaServiceInfo> {

    public KafkaServiceInfoCreator() {
   	 super(new Tags(""), "kafka");
    }

    @Override
    public KafkaServiceInfo createServiceInfo(Map<String, Object> serviceData) {
   	 @SuppressWarnings("unchecked")
   	 Map<String, Object> credentials = (Map<String, Object>) serviceData.get("credentials");

   	 String id = (String) serviceData.get("name");
   	 String servers = (String) credentials.get("servers");
   	 String clientId = (String) credentials.get("clientId");

   	 return new KafkaServiceInfo(id, servers, clientId);
    }

    @Override
    public boolean accept(Map<String, Object> serviceData) {
   	 String name = (String) serviceData.get("name");
   	 return name.startsWith("kafka"); // Kicks in only if the service name starts with kafka
    }

}
```

The `KafkaServiceInfoCreator` parses the JSON presented by the `VCAP_SERVICES` and creates the `KafkaServiceInfo` and it's ready for use in the code.

**3. To allow these classes to be discovered by spring cloud connectors when using Cloud Foundry, create a file `org.springframework.cloud.cloudfoundry.CloudFoundryServiceInfoCreator` in `src/main/resources/META-INF/services/` and add the `com.example.kafka.KafkaServiceInfoCreator` to it**

-    To consume the `kafka-service` that is created using the `cf cli``cf cups kafka-service -p 'servers,clientId'`

- The following code is required:

```java
  Cloud cloud = new CloudFactory().getCloud();
  KafkaServiceInfo kafkaServiceInfo = (KafkaServiceInfo) cloud.getServiceInfo("kafka-service");
```

-    Now the `KafkaServiceInfo` is ready for creating a connection to Kafka service

### Creating a Cloud Database Connection
Creating and using a cloud database connection is a simple three-step process.

#### 1. Include the maven dependency

```xml
<dependency>
   <groupId>org.springframework.boot</group>
   <artifactId>spring-boot-starter-cloud-connectors</artifactId>
</dependency>
```

#### 2. Create a Cloud Configuration class

```java
@Configuration
@Profile("cloud")
public class CloudConfig extends AbstractCloudConfig {

    @Bean
    public DataSource dataSource() {
        return connectionFactory().dataSource();
    }

}
```

#### 3. Optionally, create an `application-cloud.properties` file
This file should contain information about the DB used in the cloud if different than test/standalone. For example:

```property
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5Dialects
spring.datasource.platform=mysql
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```


## Keep Learning
For more information about Spring Cloud Connectors and a Quick Start tutorial, refer to the [Spring Cloud Connectors page on Spring.io](https://cloud.spring.io/spring-cloud-connectors/). You may also want to learn more about [Extending Spring Cloud Connectors](http://cloud.spring.io/spring-cloud-connectors/spring-cloud-connectors.html#_extending_spring_cloud_connectors). 

To learn about connecting to external datasources, see the guide [Spring Cloud Connectors and Datasources](/guides/spring/spring-cloud-connectors-datasources).