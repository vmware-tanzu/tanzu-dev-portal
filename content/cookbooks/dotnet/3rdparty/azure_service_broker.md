+++
date = "2017-06-14T12:00:00-07:00"
title = "Azure Service Broker"
tags = [ "azure", "service","broker" ]
weight = 11
+++

[Azure Service Broker](https://github.com/Azure/meta-azure-service-broker) is a PCF Tile that brokers Azure Services making them available to apps on PCF. It currently provides the following services:

* Azure Storage Service
* Azure Redis Cache Service
* DocumentDB\CosmosDB Service
* MS SQL Server Service
* Service Bus and Event Hub Service
* MySQL Service
* PostgresSQL Service

{{% notice note %}}
In testing we noticed some failures provisioning services in Azure do not bubble back to PCF. For instance in the region I was using Gen4 MySQL instances were not supported and the deployment would fail yet the broker would create the service and bind to applications, some of the credentials where `undefined`.
{{% /notice %}}

## Steeltoe

The [Steeltoe Connectors](http://steeltoe.io/docs/steeltoe-connectors/) will not work OOB with the brokered Azure Services as the broker escapes or URL encodes the URI in the VCAP SERVICES Credentials. The URI will parse but as Steeltoe never decodes it will fail to connect.

```json
 "vcap": {
    "services": {
      "azure-rediscache": [{
        "name": "myRedisCache",
        "instance_name": "myRedisCache",
        "binding_name": null,
        "credentials": {
          "name": "ua111111111",
          "hostname": "ua111111111.redis.cache.windows.net",
          "port": 6379,
          "sslPort": 6380,
          "primaryKey": "fakehjx1BwbU7YNBaXeI+331eWmpct4xcf7NeMbpl+whhXA=",
          "secondaryKey": "fakehyVyJQKm7u6Tu3oe18I2yLjQa0knbJe45O44Ld+roYY=",
          "redisUrl": "redis://ua111111111:fakehjx1BwbU7YNBaXeI%2B331eWmpct4xcf7NeMbpl%2BwhhXA%3D@ua111111111.redis.cache.windows.net:6379"
        },
        "syslog_drain_url": null,
        "volume_mounts": [],
        "label": "azure-rediscache",
        "provider": null,
        "plan": "basic",
        "tags": [
          "Azure",
          "Redis",
          "Cache"
        ]
      }]
    }
  }
```

A solution is to either read the service options and inject your own `IConnectionMultiplexer` or update the URI in the `IConfiguration` instance and let Steeltoe handle it:

```c#
public static class RedisExtentions
{
    private const string REDIS_URL = "vcap:services:azure-rediscache:0:credentials:redisUrl";

    public static IConfiguration DecodeAzureServiceBrokerRedisUrl(this IConfiguration configuration)
    {
        configuration[REDIS_URL] = HttpUtility.UrlDecode(configuration[REDIS_URL]);
        return configuration;
    }
}
```

For some of the services latter approach won't work as Azure uses characters in some of the fields like username that will confuse the URI parses. MySQL seems to do this, note the `@` in the database username, in these cases you'll not be able to use the Steeltoe connectors.

```json
"credentials": {
  "mysqlServerName": "u1111111111.mysql.database.azure.com",
  "mysqlDatabaseName": "u1111111111",
  "administratorLogin": "u1111111111",
  "administratorLoginPassword": "fakeuhG6JMYvesvAy+K9AHpSdJrPi9x2rLa1FC8a36kgMaU+lMHhLz5gRg==",
  "jdbcUrl": "jdbc:mysql://u1111111111.mysql.database.azure.com:3306/u5a4f51d3098?user=u17ac01eb0d9%40u1111111111&password=fakeuhG6JMYvesvAy%2BK9AHpSdJrPi9x2rLa1FC8a36kgMaU%2BlMHhLz5gRg%3D%3D&verifyServerCertificate=true&useSSL=true&requireSSL=false",
  "port": 3306,
  "name": "u5a4f51d3098",
  "username": "u17ac01eb0d9@u1111111111",
  "password": "fakeuhG6JMYvesvAy+K9AHpSdJrPi9x2rLa1FC8a36kgMaU+lMHhLz5gRg==",
  "uri": "mysql://u17ac01eb0d9%40u1111111111:fakeuhG6JMYvesvAy%2BK9AHpSdJrPi9x2rLa1FC8a36kgMaU%2BlMHhLz5gRg%3D%3D@u1111111111.mysql.database.azure.com:3306/u5a4f51d3098"
}
```
