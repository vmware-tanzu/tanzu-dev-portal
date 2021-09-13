---
date: '2020-09-08'
description: Discover how to gather both standard and custom metrics from Spring Boot
  using Prometheus and visualize them in Grafana.
lastmod: '2021-03-07'
linkTitle: Prometheus and Grafana
metaTitle: Gather Metrics with Spring Boot using Prometheus & Grafana
parent: Spring Boot
patterns:
- Observability
tags:
- Spring
- Observability
- Prometheus
- Grafana
team:
- Brian McClain
title: Gathering Metrics from Spring Boot on Kubernetes with Prometheus and Grafana
topics:
- Spring
weight: 5
oldPath: "/content/guides/spring/spring-prometheus.md"
aliases:
- "/guides/spring/spring-prometheus"
level1: Managing and Operating Applications
level2: Metrics, Tracing, and Monitoring
faqs:
  faq:
    - question: When using Prometheus and Grafana on Kubernetes, can you add metrics from an application?
      answer: Yes, Spring Boot developers are used to making metrics available from their application using Spring Boot Actuator and Micrometer, but Prometheus expects metrics to be in a specific format.
    - question: What is Spring Boot Actuator?
      answer: Spring Boot Actuator auto-configures all enabled endpoints to be exposed over HTTP if you are developing a web application. It also includes the ability to view and configure the log levels of your application at runtime and provides dependency management and auto-configuration for Micrometer.
    - question: What is Micrometer?
      answer: Micrometer is an instrumentation facade that allows you to instrument your code with dimensional metrics with a vendor-neutral interface and decide on the monitoring system as a last step. In addition, it provides several tools which Prometheus automatically gathers.	
    - question: How do I set up Prometheus and Grafana?
      answer: Check out our thorough guide that walks through [how to set up Prometheus and Grafana](https://tanzu.vmware.com/developer/guides/kubernetes/observability-prometheus-grafana-p1/) for the first time.
    - question: Can you add custom metrics in Spring Boot Actuator and Prometheus?
      answer: Yes, custom metrics are taken care of by Spring Boot Actuator, and any metric generated is picked up by Prometheus as well.
---

If you read the guide on how to run [Prometheus and Grafana on Kubernetes](/guides/kubernetes/observability-prometheus-grafana-p1/), you might be wondering: How do I add metrics from my application? Spring Boot developers are used to making metrics available from their application using [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready) and [Micrometer](https://micrometer.io/), but Prometheus expects metrics to be in a specific format. In this guide, you’ll learn how to expose both standard and custom metrics in your Spring Boot application, gather them using Prometheus, and visualize them in Grafana.

All of the code for this guide can be found [on GitHub](https://github.com/BrianMMcClain/spring-prometheus-demo).
## Export Metrics for Prometheus from Spring Boot

Thanks to [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready) there are only a couple of steps you need to take to start exporting basic metrics from your application that Prometheus can gather. By default, Spring Boot Actuator provides [a lot of metrics out of the box](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-metrics-meter), including insight into the JVM, the machine the application is running on, and the web server that’s backing the application. To enable these insights, you can include the Spring Boot Actuator dependency in your `pom.xml` file, as well as the dependency that will provide them for Prometheus:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Internally, including these dependencies makes an additional metrics endpoint available at `/actuator/prometheus`, but by default this endpoint isn’t reachable by outside services. You can expose the new endpoint by explicitly enabling it in your `application.yml` file, alongside the default `health` and `metrics` endpoints. You’ll also want to provide an `application` tag to your metrics so Grafana knows how to organize the metrics. Below, the `application` tag is set to match the name of the application, defined in the `spring.application.name` property:

```yaml
spring:
  application:
    name: spring-prometheus-demo
management:
  endpoints:
    web:
      exposure:
        include: health, metrics, prometheus
  metrics:
    tags:
      application: ${spring.application.name}
```

That’s it! Upon running your application, you’ll see a new endpoint available that you can point Prometheus to. As with any Spring Boot application, you can start it with the following command:

```bash
./mvnw spring-boot:run
```

Once started, you’ll find a huge list of metrics made available at [http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus)!

## Adding a Custom Metric

Insight into the machine running your application and the JVM it’s on is a great start. But what if you want to track custom metrics? If your application is running a website, maybe you want to track how many page hits certain endpoints are receiving, or how many times a resource with a specific ID is requested. 

Since these metrics are being taken care of by Spring Boot Actuator, any [custom metrics](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-metrics-custom) you generate are picked up by Prometheus as well! Consider a scenario in which you want to track how many times the main page of the website receives a request. For this, you’d use a simple [counter](https://docs.spring.io/spring-metrics/docs/current/public/prometheus#counters), increasing it every time the page is requested. Take a look at the following `RestController`, which sets up a counter called `visitCounter` and adds it to the default `MeterRegistry`. Additionally, the `visitCounter` is incremented every time the `/` endpoint is requested, fulfilled by the `index()` method:

```java
@RestController
public class WebController {

    Counter visitCounter;

    public WebController(MeterRegistry registry) {
        visitCounter = Counter.builder("visit_counter")
            .description("Number of visits to the site")
            .register(registry);
    }

    @GetMapping("/")
    public String index() {
        visitCounter.increment();
        return "Hello World!";
    }    
}
```

Restart the application and visit it running at [http://localhost:8080/](http://localhost:8080/) a few times to increase the counter. You can then see the value of this counter by visiting [http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus):

`visit_counter_total 5.0`

This same method can be used for [timers](https://docs.spring.io/spring-metrics/docs/current/public/prometheus#timers) and [gauges](https://docs.spring.io/spring-metrics/docs/current/public/prometheus#gauges) as well.

## Deploying the Application in Kubernetes
This guide assumes you’ve already deployed Prometheus to the Kubernetes cluster that you’re deploying your application to, but if not, be sure to check out the [Prometheus and Grafana: Gathering Metrics from Kubernetes](/guides/kubernetes/observability-prometheus-grafana-p1/) guide. You’ll also need to first build a container for your application, which you can do using the Maven `spring-boot:build-image` command as described in [this guide on the Spring website](https://spring.io/guides/gs/spring-boot-docker/). Once built and pushed to the container repository of your choice, you’re ready to deploy to Kubernetes!

You’ll need to deploy three things: a `Deployment` to run the application, a `Service` to access the application, and a `ServiceMonitor` to tell Prometheus how to gather metrics from your application. You can [find the full deployment YAML here](https://github.com/BrianMMcClain/spring-prometheus-demo/blob/main/deploy.yaml). First, take a look at the `Deployment` and the `Service`:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-prometheus-demo
  labels:
    app: spring-prometheus-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spring-prometheus-demo
  template:
    metadata:
      labels:
        app: spring-prometheus-demo
    spec:
      containers:
      - name: spring-prometheus-demo
        image: brianmmcclain/spring-prometheus-demo:0.0.1-SNAPSHOT
        imagePullPolicy: Always
        ports:
        - containerPort: 8080

---
apiVersion: v1
kind: Service
metadata:
  name: spring-prometheus-demo-service
  labels:
    app: spring-prometheus-demo
spec:
  selector:
    app: spring-prometheus-demo
  ports:
    - protocol: TCP
      name: http-traffic
      port: 8080
      targetPort: 8080
```

The above creates a `Deployment` from the container image of the application, in this case pointing to my personal build at `brianmmcclain/spring-prometheus-demo:0.0.1-SNAPSHOT`. It also gives it the label of `app: spring-prometheus-demo`. The `Service` then uses that label as a selector to know how to attach to the application. The `Service` also receives a label of `app: spring-prometheus-demo`, which the `ServiceMonitor` will use to find the `Service`. One thing to note is that the `port` receives a name of `http-traffic`, which you can see the `ServiceMonitor` reference below:

```yaml
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: spring-prometheus-demo-service-monitor
spec:
  selector:
    matchLabels:
      app: spring-prometheus-demo
  endpoints:
  - port: http-traffic
    path: "/actuator/prometheus"
```

Here a `ServiceMonitor` is created, which looks for a `Service` with the label `app: spring-prometheus-demo`. It then defines an endpoint to use to scrape metrics, referring to the port named `http-traffic` and the path `/actuator/prometheus`, which as you saw is where Spring Boot exposes the Prometheus-formatted metrics.

You can verify that Prometheus is scraping the new endpoint by checking the targets it has registered, found under “Status” drop-down menu:

![Spring application scrape information in Prometheus](/images/guides/spring/screenshots/spring-prometheus-001.png)

## Visualizing the JVM Metrics

The Grafana website maintains a great repository of community-made dashboards, including one for visualizing [JVM metrics from Micrometer](https://grafana.com/grafana/dashboards/4701). Even better, Grafana makes it very easy to import existing dashboards, as shown in [this guide](/guides/kubernetes/observability-prometheus-grafana-p1/#visualizing-prometheus-data-in-grafana). While it may take a few minutes for Prometheus to pick up some of the metrics, upon importing the dashboard, you’ll see a whole plethora of metrics start to be populated.

![JVM metrics in Grafana](/images/guides/spring/screenshots/spring-prometheus-002.png)

But what about the custom metric added to the code? For this, you can create a new panel by clicking the graph with the plus sign symbol on the top of the dashboard. You’ll be presented with a screen with a number of options. What you’re interested in is the query, however just entering the name of the visits metric (`visit_counter_total`) will show the cumulative total number of visits over time rather than a pattern of spikes and dips. This is where we need the help of the [`rate` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate), which “calculates the per-second average rate of increase of the time series in the range vector.” Put in simpler terms, it turns the accumulative counter into a time-series measurement. One-second intervals can also inject a lot of noise into the graph, so you can further modify the query to look at it in 5-minute intervals as well. In all, this turns the query into:

`rate(visit_counter_total[5m])`

![Adding a panel for the custom metric](/images/guides/spring/screenshots/spring-prometheus-003.png)

Apply your changes, and you’ll see the new graph added to the dashboard!

![New panel added to the Grafana dashboard](/images/guides/spring/screenshots/spring-prometheus-004.png)

## What’s Next?
Hopefully this gave you an idea of how to start gathering metrics, both standard and custom, from your Spring Boot applications using Prometheus. [Micrometer](https://micrometer.io/) provides a huge  array of tools you can take advantage of, all of which are automatically gathered by Prometheus. Grafana also provides a rich set of features for [building your own queries](https://grafana.com/docs/grafana/latest/panels/queries/), which may look intimidating at first, but is made easier thanks to [great documentation](https://prometheus.io/docs/prometheus/latest/querying/functions/) and [examples](https://prometheus.io/docs/prometheus/latest/querying/examples/). If you’re setting up Prometheus and Grafana for the first time, we have a guide on how you can [get started on your own!](/guides/kubernetes/observability-prometheus-grafana-p1/)