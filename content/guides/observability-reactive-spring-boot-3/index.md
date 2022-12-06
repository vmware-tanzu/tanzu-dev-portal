---
date: '2022-11-18'
description: This guide will introduce you to Micrometer in Spring Boot 3, gathering metrics from WebFlux, Reactive streams and producing output to a host of observation infrastructure.
lastmod: '2022-11-18'
linkTitle: Micrometer Observability with Reactive Spring Boot 3
metaTitle: Using Micrometer Observation API with Reactive Spring Boot 3
patterns:
- API
tags:
- Observability
- Metrics
- Distributed Tracing
- Log aggregation
- Java
- Reactive
- Spring Boot
- Micrometer
- Grafana
- Prometheus
team:
- Mario Gray
title: Observability in Reactive Spring Boot 3
oldPath: "/content/guides/spring/observability-reactive-spring-boot-3.md"
aliases:
- "/guides/microservices/observability-reactive-spring-boot-3"
level1: Managing and Operating Applications
level2: Metrics, Tracing, and Monitoring
---

Since Spring Framework 6, metrics and tracing get handled by [Micrometer](https://micrometer.io) - a vendor-neutral API for instrumenting code. Micrometer also makes available and sends metrics to aggregators such as [Prometheus](https://prometheus.io), [InfluxDB](https://influxdata.com), [Netflix Atlas](https://netflix.github.io/atlas-docs/overview/) and more. Furthermore, Spring Actuator and Micrometer work together - Micrometer gathers metrics and can make them available on `management` endpoints via Actuator.

In this guide, we will take a look at the updated support for [Micrometer Tracing](https://micrometer.io/docs/tracing), which replaces [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) support. There is a great [write-up](https://spring.io/blog/2022/10/12/observability-with-spring-boot-3) on this, which takes care of explaining a good chunk of details in a `WebMVC` setting.

In case you are looking to migrate from Sleuth to Micrometer, please see [this useful WIKI](https://github.com/micrometer-metrics/micrometer/wiki/Migrating-to-new-1.10.0-Observation-API)
as it describes and gives samples related to the scenarios you will encounter when deciding/making the change from Sleuth to the new Micrometer API.

## Start with an Observation example

Lets start with a quick example that demonstrates Micrometer's Observation API in an imperative thread-friendly setting. This kind of observation can be applied to a `Runnable` that might be submitted to an `Executor`. In this sample (that can be browsed [here](https://github.com/marios-code-path/path-to-springboot-3/tree/main/manual-observation)), we wrap a method call or code block in an Observation `Runnable` closure on the main thread.

This simple app will not can be started with the following settings in `start.spring.io`:

Dependencies: 

  * Lombok

Platform Version:

  * 3.0.0

Packaging: 

  * Jar

JvmVersion:

  * 17

Type:

  * Maven

We also need to add the Micrometer dependencies as for now we just need to exercise the basic Observation capability.

```xml
		<dependency>
			<groupId>io.micrometer</groupId>
			<artifactId>micrometer-observation</artifactId>
			<version>1.10.0</version>
		</dependency>
		<dependency>
			<groupId>io.micrometer</groupId>
			<artifactId>micrometer-core</artifactId>
			<version>1.10.1</version>
			<scope>compile</scope>
		</dependency>
```

The full sample listing follows in SimpleObservationApplication.java:

```java
@Slf4j
@SpringBootApplication
public class SimpleObservationApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SimpleObservationApplication.class, args);
    }

    @Autowired
	  ObservationRegistry registry;

    @Bean
    public ApplicationListener<ApplicationStartedEvent> doOnStart() {
        return event -> {
            generateString();
        };
    }

    public void generateString() {
        String something = Observation
                .createNotStarted("server.job", registry)    // 1
                .lowCardinalityKeyValue("jobType", "string") // 2                
                .observe(() -> {    // 3
                    log.info("Generating a String...");
                    try {
                        // do something taking time on the thread
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                        return "NOTHING";
                    }
                    return "SOMETHING";
                });

        log.info("Result was: " + something);
    }
}
```

A few things are happening in this code: 
 1. Create an instance of `Observation` and bind it to an `ObservationRegistry` as stated in [The Doc](https://micrometer.io/docs/observation).
 2. To better track our invocation, set Low cardinality keys - these are tags which have little or no variations in value. For High cardinality keys - which is many value possibilities - use the `.highCardinalityKeyValue()` method.
 3. Rather than manually calling `.start()` and `.stop()`, use the `observe(Runnable)]` method to isolate the monitored code in it's own `Runnable` closure.

## How Micrometer observation works

Micrometer's [Observation](https://github.com/micrometer-metrics/micrometer/tree/main/micrometer-observation/src/main/java/io/micrometer/observation) API employs "handlers" that are notified about the lifecycle event of an observation. An [ObservationHandler](https://github.com/micrometer-metrics/micrometer/blob/main/micrometer-observation/src/main/java/io/micrometer/observation/ObservationHandler.java) wraps around the observation lifecycle and execute it's methods on lifecycle events. An `ObservationHandler` reacts only to supported implementations of an `Observation.Context` - this context passes state between handler methods - and can create all kinds of instrumentation like metrics, spans or logs by reacting to the lifecycle events of an observation, such as:

* `start` - Observation has been started. Happens when the `Observation#start()` method gets called.
* `stop` - Observation has been stopped. Happens when the `Observation#stop()` method gets called.
* `error` - An error occurred while observing. Happens when the `Observation#error(exception)` method gets called.
* `event` - An event happened when observing. Happens when the `Observation#event(event)` method gets called.
* `scope started` - Observation opens a scope. The scope must be closed when no longer used. Handlers can create thread local variables on start that are cleared upon closing of the scope. Happens when the `Observation#openScope()` method gets called.
* `scope stopped` - Observation stops a scope. Happens when the `Observation.Scope#close()` method gets called.

An observation state diagram looks like:

<img src="images/observation-state-dia.png" alt="observation state diagram" width="480">

For observation scopes, the state diagram looks like:

<img src="images/observation-scope-state-dia.png" alt="observation scope state diagram" width="480">

The autoconfiguration in Spring Boot will create an `ObservationRegistry` which is responsible for managing the state of observations. Additionally, we get multiple `ObservationHandlers` that handle various instrumentation objectives (e.g. tracing, metrics, logging, etc..). As an  example, the [MeterObservationHandler](https://github.com/micrometer-metrics/micrometer/blob/main/micrometer-core/src/main/java/io/micrometer/core/instrument/observation/DefaultMeterObservationHandler.java#L23) provides micrometer [Timer](https://micrometer.io/docs/concepts#_timers) and [Counter](https://micrometer.io/docs/concepts#_counters) metrics to observations. 

Additionally, non auto-configured handlers exist such as the [ObservationTextPublisher](https://github.com/micrometer-metrics/micrometer/blob/main/micrometer-observation/src/main/java/io/micrometer/observation/ObservationTextPublisher.java#L24). This handler logs the context during each handled event.

Our simple app can be made to log observation events by declaring a bean of this type `ObservationTextPublisher`:

```java
@Component
public class TextPublishingObservationHandler extends ObservationTextPublisher { }
```

When we execute our `SimpleObservationApplication`, we will see logs that `ObservationTextPublisher` emitted. Timestamps are removed, while just 1 descriptive log line appear to keep things brief in this sample.

```log
INFO 90538 --- [           main] i.m.o.ObservationTextPublisher           : START - name='server.job', contextualName='null', error='null', lowCardinalityKeyValues=[jobType='string'], highCardinalityKeyValues=[], map=[]
INFO 90538 --- [           main] i.m.o.ObservationTextPublisher           :  OPEN - 
name='server.job', contextualName='null', error='null', lowCardinalityKeyValues=
[jobType='string'], highCardinalityKeyValues=[], map=[class io.micrometer.core.instrument.
Timer$Sample='io.micrometer.core.instrument.Timer$Sample@205bed61', class io.micrometer.core.
instrument.LongTaskTimer$Sample='SampleImpl{duration(seconds)=5.60409E-4, duration(nanos)
=560409.0, startTimeNanos=}']
INFO 90538 --- [           main] c.e.o.ManualObservationApplication       : Generating a String...
INFO 90538 --- [           main] i.m.o.ObservationTextPublisher           : CLOSE - name='server.job',...]
INFO 90538 --- [           main] i.m.o.ObservationTextPublisher           :  STOP - name='server.job',...]
INFO 90538 --- [           main] c.e.o.ManualObservationApplication       : Result was: SOMETHING
```

Our `ObservationTextPublisher` shows the various stages this Observation went through, along with it's metadata.  Notice that we have no `traceId` or `spanId` as usual since the bare minimum tracers are of the `NOOP` variety. The next section will add `Zipkin/Brave` implementations that are auto-configured with additional dependencies. 

## The reactive sample setup

The main goal of this guide is to introduce the Observation API for Reactive apps. We will begin by creating a REST controller application. It can be started by either starting at our favorite website - [start dot spring dot io](https://start.spring.io) - there by selecting a few options:

Dependencies: 

  * Webflux
  * Actuator
  * Prometheus
  * Lombok

Platform Version:

  * 3.0.0

Packaging: 

  * Jar

JvmVersion:

  * 17

Type:

  * Maven

Here is a screenshot (for reference) of what the configuration on `start.spring.io` looks like:

![start dot spring io](images/start-spring-io.png)

Alternatively, if you have the `curl` client installed then copy and paste the following script as it will execute a similar function from the command-line.

```shell
curl -G https://start.spring.io/starter.zip -o observable.zip -d dependencies=web,actuator,prometheus,lombok -d packageName=com.example.observation \
-d description=REST%20Observation%20Demo -d type=maven-project -d language=java -d platformVersion=3.0.0-SNAPSHOT \
-d packaging=jar -d jvmVersion=17 -d groupId=com.example -d artifactId=observation -d name=observation  
```

First thing after we unzip this, is to add 2 necessary dependencies: `micrometer-tracing-bridge-brave` and `zipkin-reporter-brave` that bring in Micrometer Observation, the Micrometer tracing API and Zipkin reporting bridge for reporting traces to Zipkin compatible tracing endpoints. 

Additional dependencies in pom.xml:

```xml
		<dependency>
			<groupId>io.micrometer</groupId>
			<artifactId>micrometer-tracing-bridge-brave</artifactId>
		</dependency>
		<dependency>
			<groupId>io.zipkin.reporter2</groupId>
			<artifactId>zipkin-reporter-brave</artifactId>
		</dependency>
```

Open this project in your favorite IDE and follow along, or simply [browse](https://github.com/marios-code-path/path-to-springboot-3/tree/main/webflux-observation) the source for reference. For clarification, we will be adding dependencies as this guide progresses.

Lets move on and establish some basic application properties; app name, server port and logging format.

application.properties:

```properties
spring.application.name=test-service
server.port=8787
spring.main.web-application-type=reactive
logging.pattern.level=%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]
```

### A greeting service

The example will use a REST endpoint which calls a service for a small amount of indirection, allowing us to establish service hand-offs during traces. In this example, we only return a specific payload: `Greeting`.

The payload is a simple record:

Greeting.java:
```java
record Greeting(String name) {}
```

The service we want to use in our REST controller:

GreetingService.java:
```java
@Service
@Slf4j
class GreetingService {
    private final Supplier<Long> latencySupplier = () -> new Random(System.currentTimeMillis()).nextLong(250);

    private final ObservationRegistry registry;

    GreetingService(ObservationRegistry registry) {
        this.registry = registry;
    }

    public Mono<Greeting> greeting(String name) {

        Long lat = latencySupplier.get();
        return Mono
                .just(new Greeting(name))
                .delayElement(Duration.ofMillis(lat))
                ;
    }
}
```

This is a standard REST endpoint, with nothing notable except the inclusion of an `ObservationRegistry` we will make use of as we describe reactive observation in the following sections.

### Add a REST endpoint

Next, we will add a REST endpoint that returns a salutations/greetings to a name derived from the path parameter `{name}`:

```kotlin
@RestController
class GreetingController {
    private final GreetingService service;
 
    GreetingController(GreetingService service) { this.service = service; }

    @GetMapping("/hello/{name}")
    public Mono<Greeting> greeting(@PathVariable("name") String name) {
        return service
                .greeting(name);
    }
}
```

> **_TIP:_** [WebFluxObservationAutoConfiguration](https://github.com/spring-projects/spring-boot/blob/main/spring-boot-project/spring-boot-actuator-autoconfigure/src/main/java/org/springframework/boot/actuate/autoconfigure/observation/web/reactive/WebFluxObservationAutoConfiguration.java) is the autoconfiguration class for observation in WebFlux. It includes all of the `ObservationHandler` and `WebFilter`s needed to observe (draw traces and meters from) HTTP requests and responses.

Now, with the basic shape of our main sample out of the way, we can gain some insights as to how observation gets injected into raw reactive streams. The next section will review necessary steps to gain full interoperability between reactor and micrometer.

## Reactive stream observation

Project reactor comes with [built-in support for micrometer](https://github.com/reactor/reactor-core/blob/main/docs/asciidoc/metrics.adoc) instrumentation including opt-in API dependencies that turn `no-op` instrumentation into ones that are fully implemented. 

We will make use of the reactive `tap` operator to instrument the streams in this sample. The `tap` operator makes use of a stateful per-subscription [SignalListener](https://projectreactor.io/docs/core/3.5.0-M2/api/reactor/core/observability/SignalListener.html) to manage the state of the observation in progress.

To get a micrometer signal listener, import the [reactor-core-micrometer](https://github.com/reactor/reactor-core/tree/main/reactor-core-micrometer) dependency. This API provides all of the necessary components that supply Observation and Meter metrics gathering in Reactive streams. Note, that this API also relies on [context-propagation](https://micrometer.io/docs/contextPropagation) to populate thread locals around the opening of Observations/Meters upon stream subscription.

Here are the additions we will add to pom.xml to enable micrometer reactive stream APIs:

```xml
		<!-- Micrometer API -->
		<dependency>
			<groupId>io.projectreactor</groupId>
			<artifactId>reactor-core-micrometer</artifactId>
		</dependency>
		<dependency>
			<groupId>io.micrometer</groupId>
			<artifactId>context-propagation</artifactId>
			<version>1.0.0</version>
		</dependency>
```

In this example, we are interested in the `reactor.core.observability.micrometer.Micrometer` API that provides us the StreamListener needed to observe the stream. This API supports instrumentation of `reactor.core.scheduler.Scheudler`'s, as well as applying Meters and Observations on a per-subscription basis to the reactive stream. This example will observe our stream using the `Micrometer.observation` API that hooks into micrometer's Observation framework.

We can take our `GreetingService` from earlier and embellish it with additional observation related sections.

GreetingService.java:
```java
        return Mono
                .just(new Greeting(name))
                .delayElement(Duration.ofMillis(lat))
                .name("greeting.call")                  // 1
                .tag("latency", lat.toString())         // 2
                .tap(Micrometer.observation(registry))  // 3
```

Given the above, we will have a child span for the parent HTTP controller span. The main additions are as follows:

1. Using `.name` to specify the `Observation` name.
2. Add low cardinality tags add attributes to the measurements with `.tag`.
3. Produce the `Observation` specific signal listener for the `tap` operator. This covers the entire length of the sequence.

The core details of how you can further work in micrometer metrics into your streams can be read at the [Micrometer Observation Docs](https://micrometer.io/docs/observation).

## Introduction of the Monitoring Platform

In this guide, we will have the experience of a single page observation. With this idea going forward, we can move through logs, traces and metrics in one location. In order to achieve this kind of integration, we will make use of a specific `operations` service infrastructure:

Infra:

  * [Prometheus](https://prometheus.io) - Metrics

  * [Loki](https://grafana.com/go/webinar/getting-started-with-logging-and-grafana-loki/?pg=hp&plcmt=upcoming-events-3) - Log Aggregation

  * [Tempo](https://grafana.com/go/webinar/getting-started-with-tracing-and-grafana-tempo-emea/?pg=hp&plcmt=upcoming-events-2) - Trace Backend
  
  * [Grafana](https://grafana.com/grafana/) - Dashboard Visualization

For this example, there are pre-configured instances of Prometheus, Grafana, Tempo, and Loki located within the `infra` directory. Provided in this directory are the docker compose scripts, and server configuration files. You can bring the whole thing up with the following command:

```bash
cd infra/
docker compose up
```

This might take a minute or two since containers need to be transferred over the network. Next, we can move on and examine this infrastructure as it relates to our example app.

### Prometheus Setup

On the application-facing side of our Prometheus setup, we need to configure a set of [scrape config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) for ingesting our app's `/actuator/prometheus` endpoint. 

The specific `scrape config` is listed below:

```yaml
global:
    scrape_interval: 2s
    evaluation_interval: 2s

scrape_configs:
    - job_name: 'prometheus'
      static_configs:
          - targets: ['host.docker.internal:9090']
    - job_name: 'spring-apps'
      metrics_path: '/actuator/prometheus'
      static_configs:
        - targets: ['host.docker.internal:8787']
```

### Enable the Prometheus Actuator endpoint

Here, we will configure our app to expose the specific `/actuator/prometheus` endpoint used during the scrape process in Prometheus:

In `application.properties`, add:
```properties
management.endpoints.web.exposure.include=prometheus
```

Micrometer [supports](https://micrometer.io/docs/concepts#_histograms_and_percentiles) publishing histograms for computing percentile distributions with the `management.metrics.distribution.percentiles-histogram` property. We can apply a [per meter customization](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metrics.customizing.per-meter-properties) to the WebFlux/WebMVC `http.server.requests` metrics and produce the target percentiles histogram as follows:

In `application.properties`, add:
```properties
management.metrics.distribution.percentiles-histogram.http.server.requests=true
```

> **NOTE:_** That percentiles histograms are needed for Exemplars to function. This has no effect on systems that do not support histogram-based percentile approximations.

### Configure Loki log aggregation

Loki will be queried by Grafana to add log correlation with our traces and metrics. We will configure a logback appender to emit our logs directly to Loki. This appender comes from [loki4j](https://loki4j.github.io/loki-logback-appender/) and is implemented in `com.github.loki4j.logback.Loki4jAppender`.

Simply place `logback-spring.xml` into `src/main/resources` of the project and ensure the appender for loki has the right URL configured.

To make this work, we use the `loki-logback-appender` dependency as configured with maven:

```xml
		<dependency>
			<groupId>com.github.loki4j</groupId>
			<artifactId>loki-logback-appender</artifactId>
			<version>1.4.0-rc1</version>
		</dependency>
```

And the source to our `logback-spring.xml` should be found under `resources`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml" />
    <springProperty scope="context" name="appName" source="spring.application.name"/>

    <appender name="LOKI" class="com.github.loki4j.logback.Loki4jAppender">
        <http>
            <url>http://localhost:3100/loki/api/v1/push</url>
        </http>
        <format>
            <label>
                <pattern>app=${appName},host=${HOSTNAME},traceID=%X{traceId:-NONE},level=%level</pattern>
            </label>
            <message>
                <pattern>${FILE_LOG_PATTERN}</pattern>
            </message>
            <sortByTime>true</sortByTime>
        </format>
    </appender>

    <root level="INFO">
        <appender-ref ref="LOKI"/>
    </root>
</configuration>
```

### Tempo configuration

This example will use [Micrometer tracing](https://micrometer.io/docs/tracing) that ships traces over to Tempo. We can ship traces to Tempo's Zipkin receiver With help of [Openzipkin Brave](https://github.com/openzipkin/zipkin-reporter-java/tree/master/brave) and the [Micrometer bridge for Brave](https://github.com/micrometer-metrics/tracing/tree/main/micrometer-tracing-bridges). No additional items in terms of project dependencies are required because we already placed them during sample setup. However, for reference, they are: `micrometer-tracing-bridge-brave` and `zipkin-reporter-brave`.

We will make use of local filesystem storage, since provisioning a block storage is a bit complex for this example. 

Note that enabling the Zipkin receiver will create a demand for TCP port `9411` (Zipkin). This configuration is using the 'Push with HTTP' option per [Tempo documentation](https://grafana.com/docs/tempo/latest/api_docs/pushing-spans-with-http/).


tempo-local.yaml:
```yaml
server:
    http_listen_port: 3200

distributor:
    receivers:
        zipkin:

storage:
    trace:
        backend: local
        local:
            path: /tmp/tempo/blocks
```

Finally, we will ensure every trace gets to our Zipkin receiver endpoints by adding the following lines to `application.properties`:

```properties
management.tracing.enabled=true
management.tracing.sampling.probability=1.0
```

### Grafana dashboards

Grafana will be provisioned with external data given from configuration within [infra/docker/grafana/provisioning/datasources/datasource.yml](https://github.com/marios-code-path/path-to-springboot-3/blob/main/infra/docker/grafana/provisioning/datasources/datasource.yml). This tells grafana where to find each external source of data we will be querying. We will be tracking spans from Tempo, logs from Loki and Metrics from Prometheus.

This dashboard configuration is provided in [infra/docker/grafana/provisioning/dashboards/logs_traces_metrics.json](https://raw.githubusercontent.com/marios-code-path/path-to-springboot-3/main/infra/docker/grafana/provisioning/dashboards/logs_traces_metrics.json) and acts as our standard example dashboard called `logs_traces_metrics`. This bit of dashboard code is borrowed mainly from [a recent observability blog post](https://spring.io/blog/2022/10/12/observability-with-spring-boot-3).

## Observing the WebFlux app

We now can execute the application as-is:

```shell
mvn spring-boot:run
```

Once the application is started, a number of metrics will be populated because of scraping activity from Prometheus to the `/actuator/prometheus` endpoint. To add our own service activity, lets create some traffic.

```bash
while true; do http :8787/hello/spring-boot-3 ; sleep 1; done
```

This will call our endpoint every second. Allow it run for a minute or two so Prometheus can collect metrics. Then browse over to `http://localhost:3000/dashboards` and select 'General', then 'Logs, Traces, Metrics' dashboard. You would be facing a screen similar to the following screenshot:

![dashboard 1st](images/first-dashboard-screen.png)

Notice, we have a several gray squares - these are the `exemplars` correlating metrics with traces. The exemplar data is located by hovering over a square and revealing the popup DIV. 

<img src="images/exemplar-data.png" alt="exemplar" width="480">

 The trace can be searched for in Loki at the top of this dashboard, for which Tempo data will be displayed. Clicking on 'Query with Tempo' will produce similar information.

![dashboard 2nd](images/second-dashboard-screen.png)

A full trace view can be expanded. Note we also see the trace generated through our service
call - the reactive stream observation made as a child trace to the main HTTP request.

![dashboard full](images/full-trace-view.png)

## Conclusion

We learned to configure Spring Boot 3 reactive apps with Micrometer. With additional supports,
we were able to broaden the scope of our monitoring objectives and provide tracing and distributed logging alongside metrics. Furthermore tying concerns together allowed us to demonstrate the powerful `exemplar` feature in Prometheus. 

As we learned, project reactor comes with baked-in support for micrometer instrumentation through opt-in API dependencies.  A fully observed reactive application can be brought up in just a few minutes with Spring Boot 3!

## Links and Readings

[Spring Actuator Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.enabling)

[Spring Metrics Docs](https://docs.spring.io/spring-metrics/docs/current/public/prometheus)

[Micrometer Docs](https://micrometer.io/docs)

[Prometheus Docs](https://prometheus.io/docs/introduction/overview/)

[Grafana Tempo Docs](https://grafana.com/docs/tempo/latest/?pg=oss-tempo)

[Grafana Loki Docs](https://grafana.com/docs/loki/latest/?pg=oss-loki)

[Grafana Docs](https://grafana.com/docs/grafana/latest/introduction/)

[When to use the Pushgateway?](https://prometheus.io/docs/practices/pushing/)

[Observability in Spring Boot 3 write-up](https://spring.io/blog/2022/10/12/observability-with-spring-boot-3)

[Exposing Reactor metrics with Micrometer](https://projectreactor.io/docs/core/release/reference/#metrics)

[Observability Migration from Sleuth](https://github.com/micrometer-metrics/micrometer/wiki/Migrating-to-new-1.10.0-Observation-API)

[Reactor - Contextual Logging Pattern](https://projectreactor.io/docs/core/release/reference/#faq.mdc)

[Tempo configuration](https://grafana.com/docs/tempo/latest/configuration/) 