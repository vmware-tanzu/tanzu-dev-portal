---
date: '2021-02-05'
description: This tutorial will show you which are the best practices that any chart
  developer should follow.
lastmod: '2021-02-16'
parent: Packaging
patterns:
- Deployment
tags:
- Helm
- Bitnami
- Kubernetes
featured: true
team:
- Javier Salmeron
title: Best Practices for Creating Production-Ready Helm Charts
weight: 5
oldPath: "/content/guides/kubernetes/production-ready-helm.md"
aliases:
- "/guides/kubernetes/production-ready-helm"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Three years have passed since [the first release of Helm](https://github.com/helm/helm/releases?after=v1.1), and it has indeed made a name for itself. Both avowed fans and fervent haters agree that the Kubernetes "apt-get equivalent" is the standard way of deploying to production (at least for now, let's see what Operators end up bringing to the table). During this time, Bitnami has contributed to the project in many ways. You can find us in PRs in Helm's code, in solutions like [Kubeapps](https://hub.kubeapps.com/charts/bitnami), and especially in what we are mostly known for: [our huge application library](https://bitnami.com/stacks/helm).

As maintainers of a collection of more than [45 Helm charts](https://github.com/bitnami/charts/), we know that creating a maintainable, secure and production-ready chart is far from trivial. In this sense, this blog post shows essential features that any chart developer should know.

## Use non-root containers

Ensuring that a container is able to perform only a very limited set of operations is vital for production deployments. This is possible thanks to the **use of non-root containers, which are executed by a user different from *root*.** Although creating a non-root container is a bit more complex than a root container (especially regarding filesystem permissions), it is absolutely worth it. Also, in environments like OpenShift, [using non-root containers is mandatory](https://engineering.bitnami.com/articles/running-non-root-containers-on-openshift.html).

In order to make your Helm chart work with non-root containers, add the [*securityContext*](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) section to your *yaml* files.

This is what we do, for instance, in the Bitnami Elasticsearch Helm chart. This chart deploys several Elasticsearch *StatefulSets* and *Deployments* (data, ingestion, coordinating and master nodes), all of them with non-root containers. If we check the master node *StatefulSet*, we see the following:

```yaml
spec:
  {{- if .Values.securityContext.enabled }}
  securityContext:
    fsGroup: {{ .Values.securityContext.fsGroup }}
  {{- end }}
```

The snippet above changes the permissions of the mounted volumes, so the container user can access them for read/write operations. In addition to this, inside the container definition, we see another *securityContext* block:

```yaml
{{- if .Values.securityContext.enabled }}
securityContext:
  runAsUser: {{ .Values.securityContext.runAsUser }}
{{- end }}
```

In this part we specify the user running the container. In the *values.yaml* file, we set the default values for these parameters:

```yaml
## Pod Security Context
## ref: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
##
securityContext:
  enabled: true
  fsGroup: 1001
  runAsUser: 1001
```

With these changes, the chart will work as non-root in platforms like GKE, Minikube or OpenShift.

## Do not persist the configuration

Adding persistence is an essential part of deploying stateful applications. In our experience, deciding what or what not to persist can be tricky. After several iterations in our charts, we found that **persisting the application configuration is not a recommended practice**. One advantage of Kubernetes is that you can change the deployment parameters very easily by just doing `kubectl edit deployment` or `helm upgrade`. If the configuration is persisted, none of the changes would be applied. So, when developing a production-ready Helm chart, make sure that the configuration can be easily changed with `kubectl` or `helm upgrade`. One common practice is to create a *ConfigMap* with the configuration and have it mounted in the container. Let's use the [Bitnami RabbitMQ chart](https://github.com/bitnami/charts/tree/master/bitnami/rabbitmq) as an example:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ template "rabbitmq.fullname" . }}-config
  labels:
    app: {{ template "rabbitmq.name" . }}
    chart: {{ template "rabbitmq.chart" .  }}
    release: "{{ .Release.Name }}"
    heritage: "{{ .Release.Service }}"
data:
  enabled_plugins: |-
{{ template "rabbitmq.plugins" . }}
  rabbitmq.conf: |-
    ##username and password
    default_user={{.Values.rabbitmq.username}}
    default_pass=CHANGEME
{{ .Values.rabbitmq.configuration | indent 4 }}
{{ .Values.rabbitmq.extraConfiguration | indent 4 }}
```

Note that there is a section in the *values.yaml* file that allows you to include any custom configuration:

```yaml
  ## Configuration file content: required cluster configuration
  ## Do not override unless you know what you are doing. To add more configuration, use `extraConfiguration` instead
  configuration: |-
    ## Clustering
    cluster_formation.peer_discovery_backend  = rabbit_peer_discovery_k8s
    cluster_formation.k8s.host = kubernetes.default.svc.cluster.local
    cluster_formation.node_cleanup.interval = 10
    cluster_formation.node_cleanup.only_log_warning = true
    cluster_partition_handling = autoheal
    # queue master locator
    queue_master_locator=min-masters
    # enable guest user
    loopback_users.guest = false
  ## Configuration file content: extra configuration
  ## Use this instead of  `configuration` to add more configuration
  extraConfiguration: |-
    #disk_free_limit.absolute = 50MB
    #management.load_definitions = /app/load_definition.json
```

This *ConfigMap* then gets mounted in the container filesystem, as shown in this extract of the *StatefulSet* spec:

```yaml
volumes:
- name: config-volume
    configMap:
    name: {{ template "rabbitmq.fullname" . }}-config
```

If the application needs to write in the configuration file, then you'll need to create a copy inside the container, as *ConfigMaps* are mounted as read-only. This is done in the same spec:

```yaml
containers:
- name: rabbitmq
image: {{ template "rabbitmq.image" . }}
imagePullPolicy: {{ .Values.image.pullPolicy | quote }}
command:
      # ...
      #copy the mounted configuration to both places
      cp  /opt/bitnami/rabbitmq/conf/* /opt/bitnami/rabbitmq/etc/rabbitmq
      # ...
```

This will make your chart not only easy to upgrade, but also more adaptable to user needs, as they can provide their custom configuration file.

## Integrate charts with logging and monitoring tools

If we are talking about production environments, we are talking about observability. It is essential having our deployments properly monitored so we can early detect potential issues. It also essential to have application usage, cost and resource consumption metrics. In order to gather this information, you would commonly deploy logging stacks like EFK ([ElasticSearch](https://www.elastic.co/), [Fluentd](https://www.fluentd.org/), and [Kibana](https://www.elastic.co/products/kibana) and monitoring tools like [Prometheus](https://prometheus.io/). Bitnami offers the [Bitnami Kubernetes Production Runtime (BKPR)](https://kubeprod.io/) that easily installs these tools (along with others) so your cluster is ready to handle production workloads.

When writing your chart, make sure that your deployment is able to work with the above tools seamlessly. To do so, ensure the following:

* All the containers log to stdout/stderr (so the EFK stack can easily ingest all the logging information)
* Prometheus exporters are included (either using sidecar containers or having a separate deployment)

All Bitnami charts work with BKPR (which includes EFK and Prometheus) out of the box. Let's take a look at the [Bitnami PostgreSQL chart](https://github.com/bitnami/charts/tree/master/bitnami/postgresql) and [Bitnami PostgreSQL container](https://github.com/bitnami/bitnami-docker-postgresql) to see how we did it.

To begin with, the process inside the container runs at the foreground, so all the logging information is written to stdout/stderr, as shown below:

```bash
info "** Starting PostgreSQL **"
if am_i_root; then
    exec gosu "$POSTGRESQL_DAEMON_USER" "${cmd}" "${flags[@]}"
else
    exec "${cmd}" "${flags[@]}"
fi
```

With this, we ensured that it works with EFK. Then, in the chart we added a sidecar container for the Prometheus metrics:

```yaml
{{- if .Values.metrics.enabled }}
        - name: metrics
          image: {{ template "postgresql.metrics.image" . }}
          imagePullPolicy: {{ .Values.metrics.image.pullPolicy | quote }}
         {{- if .Values.metrics.securityContext.enabled }}
          securityContext:
            runAsUser: {{ .Values.metrics.securityContext.runAsUser }}
        {{- end }}
          env:
            {{- $database := required "In order to enable metrics you need to specify a database (.Values.postgresqlDatabase or .Values.global.postgresql.postgresqlDatabase)" (include "postgresql.database" .) }}
            - name: DATA_SOURCE_URI
              value: {{ printf "127.0.0.1:%d/%s?sslmode=disable" (int (include "postgresql.port" .)) $database | quote }}
            {{- if .Values.usePasswordFile }}
            - name: DATA_SOURCE_PASS_FILE
              value: "/opt/bitnami/postgresql/secrets/postgresql-password"
            {{- else }}
            - name: DATA_SOURCE_PASS
              valueFrom:
                secretKeyRef:
                  name: {{ template "postgresql.secretName" . }}
                  key: postgresql-password
            {{- end }}
            - name: DATA_SOURCE_USER
              value: {{ template "postgresql.username" . }}
          {{- if .Values.livenessProbe.enabled }}
          livenessProbe:
            httpGet:
              path: /
              port: http-metrics
            initialDelaySeconds: {{ .Values.metrics.livenessProbe.initialDelaySeconds }}
            periodSeconds: {{ .Values.metrics.livenessProbe.periodSeconds }}
            timeoutSeconds: {{ .Values.metrics.livenessProbe.timeoutSeconds }}
            successThreshold: {{ .Values.metrics.livenessProbe.successThreshold }}
            failureThreshold: {{ .Values.metrics.livenessProbe.failureThreshold }}
          {{- end }}
          {{- if .Values.readinessProbe.enabled }}
          readinessProbe:
            httpGet:
              path: /
              port: http-metrics
            initialDelaySeconds: {{ .Values.metrics.readinessProbe.initialDelaySeconds }}
            periodSeconds: {{ .Values.metrics.readinessProbe.periodSeconds }}
            timeoutSeconds: {{ .Values.metrics.readinessProbe.timeoutSeconds }}
            successThreshold: {{ .Values.metrics.readinessProbe.successThreshold }}
            failureThreshold: {{ .Values.metrics.readinessProbe.failureThreshold }}
          {{- end }}
          volumeMounts:
            {{- if .Values.usePasswordFile }}
            - name: postgresql-password
              mountPath: /opt/bitnami/postgresql/secrets/
            {{- end }}
            {{- if .Values.metrics.customMetrics }}
            - name: custom-metrics
              mountPath: /conf
              readOnly: true
          args: ["--extend.query-path", "/conf/custom-metrics.yaml"]
            {{- end }}
          ports:
            - name: http-metrics
              containerPort: 9187
          {{- if .Values.metrics.resources }}
          resources: {{- toYaml .Values.metrics.resources | nindent 12 }}
          {{- end }}
{{- end }}
```

We also made sure that the pods or services contain the proper annotations that Prometheus uses to detect exporters. In this case, we defined them in the chart's *values.yaml* file, as shown below:

```yaml
metrics:
  enabled: false
  service:
    type: ClusterIP
    annotations:
      prometheus.io/scrape: "true"
      prometheus.io/port: "9187"
  #...  
```

In the case of the PostgreSQL chart, these annotations go to a metrics service, separate from the PostgreSQL service, which is defined as below:

```yaml
{{- if .Values.metrics.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ template "postgresql.fullname" . }}-metrics
  labels:
    app: {{ template "postgresql.name" . }}
    chart: {{ template "postgresql.chart" . }}
    release: {{ .Release.Name | quote }}
    heritage: {{ .Release.Service | quote }}
  annotations:
{{ toYaml .Values.metrics.service.annotations | indent 4 }}
spec:
  type: {{ .Values.metrics.service.type }}
  {{- if and (eq .Values.metrics.service.type "LoadBalancer") .Values.metrics.service.loadBalancerIP }}
  loadBalancerIP: {{ .Values.metrics.service.loadBalancerIP }}
  {{- end }}
  ports:
    - name: http-metrics
      port: 9187
      targetPort: http-metrics
  selector:
    app: {{ template "postgresql.name" . }}
    release: {{ .Release.Name }}
    role: master
{{- end }}
```

With these modifications, your chart will seamlessly integrate with your monitoring platform. All the obtained metrics will be crucial for maintaining the deployment in good shape.

## Production workloads in Kubernetes are possible

Now you know some essential guidelines for creating secured (with non-root containers), adaptable (with proper configuration management), and observable (with proper monitoring) charts. With these features, you have covered the basics to ensure that your application can be deployed to production. However, this is just another step in your journey to mastering Helm. You should also take into account other features like upgradability, usability, stability and testing.

## Useful Links

To learn more, check the following links:

* [Official Helm chart good practice guidelines](https://helm.sh/docs/chart_best_practices/)
* [Helm best practices by CodeFresh](https://codefresh.io/docs/docs/new-helm/helm-best-practices/)
* [Bitnami Kubernetes Production Runtime](https://kubeprod.io/)
* [Bitnami Helm charts](https://github.com/bitnami/charts/)
* [Kubeapps Hub](https://hub.kubeapps.com/)