---
date: '2021-04-14'
lastmod: '2021-04-14'
parent: Carvel
patterns:
- Deployment
tags:
- kapp
- Carvel
team:
- Tiffany Jernigan
title: Getting Started with kapp
topics:
- Kubernetes
oldPath: "/content/guides/kubernetes/kapp-gs.md"
aliases:
- "/guides/kubernetes/kapp-gs"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

[kapp](https://carvel.dev/kapp/) (part of the open source [Carvel](https://carvel.dev) suite) is a lightweight application-centric tool for deploying resources on Kubernetes. Being both explicit and application-centric it provides an easier way to deploy and view all resources created together regardless of what namespace they’re in. Being dependency-aware, it is able to wait for resources to be created, updated, or deleted, and provides a live status on the progress of the actions. Continue on to see how to get started with kapp.

{{< youtube id="ShWVyyY2E3o" class="youtube-video-shortcode" >}}

## Prerequisites
Before you get started you will need to do the following:
* Create a Kubernetes cluster
* Install `kubectl` locally
* Install the `kapp` CLI via one of these options:
  * [Homebrew](https://github.com/vmware-tanzu/homebrew-carvel): 
  ```
  brew tap vmware-tanzu/carvel
  brew install kapp
  ```
	* [GitHub releases](https://github.com/vmware-tanzu/carvel-kapp/releases/tag/v0.37.0): move the binary to `/usr/local/bin` or add it to your `$PATH` and run `chmod +x` to make it executable

{{% callout %}}
**Note**: This guide uses kapp v0.37.0, and we suggest you download and install the same version to ensure the best experience as you follow through this guide.
{{% /callout %}}


## Deploy App
Let’s go ahead and deploy our first application with kapp!

### First Run

1.  Create a namespace to use as a [state namespace](https://carvel.dev/kapp/docs/latest/state-namespace/):
    ```
    kubectl create namespace kapp-demo
    ```

    The state namespace is the namespace kapp uses for state storage.

1.  Create `kapp-spring-petclinic.yaml` file with a [Spring PetClinic](https://spring-petclinic.github.io/) namespace, deployment, and service:
    ```yaml
    cat <<EOF > kapp-spring-petclinic.yaml
    ---
    apiVersion: v1
    kind: Namespace
    metadata:
      name: spring-petclinic
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-petclinic
      namespace: spring-petclinic
    spec:
      selector:
        matchLabels:
          app: spring-petclinic
      replicas: 2
      template:
        metadata:
          labels:
            app: spring-petclinic
        spec:
          containers:
          - name: spring-petclinic
            image: springcommunity/spring-framework-petclinic
            ports:
            - name: http
              containerPort: 8080
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: spring-petclinic
      namespace: spring-petclinic
      labels:
        app: spring-petclinic
    spec:
      ports:
      - port: 80
        protocol: TCP
        targetPort: 8080
      selector:
        app: spring-petclinic
      type: ClusterIP
    EOF
    ```

1.  Here is where  `kapp` gets involved. We will use it to create our deployment and service.
    ```
    kapp deploy -n kapp-demo -a spring-petclinic -f kapp-spring-petclinic.yaml
    ```

    This format is fairly similar to `kubectl apply -f kapp-spring-petclinic.yaml`, but it also has an application name. You can also provide a directory instead of a single file.

    The next difference you will notice is it prompts you if you want to actually run the command. You can shortcut this by adding the `-y` flag. 

    It should give you an output similar to the following before hit `y`.
    ```
    Target cluster 'https://35.247.3.14' (nodes: demo-default-pool-0f8526ab-rb7b, 2+)

    Changes

    Namespace         Name              Kind        Conds.  Age  Op      Op st.  Wait to    Rs  Ri
    (cluster)         spring-petclinic  Namespace   -       -    create  -       reconcile  -   -  
    spring-petclinic  spring-petclinic  Deployment  -       -    create  -       reconcile  -   -  
    ^                 spring-petclinic  Service     -       -    create  -       reconcile  -   -  

    Op:      3 create, 0 delete, 0 update, 0 noop
    Wait to: 3 reconcile, 0 delete, 0 noop
    ```
    You can see that it’s creating the `spring-petclinic` namespace, deployment, and service inside that namespace.

    Here is a more significant difference with `kubectl`. `kapp` will wait on the resources to become available before terminating and will also show the progress for each resource and tell you if it succeeded or failed. Don’t worry, I didn’t set you up for failure :). 

1.  Now that we have the deployment and service up, we can verify it’s working properly. First we can just take a look and see that they are up.
    ```
    kubectl -n spring-petclinic get deployment,service spring-petclinic
    ```

    And then we can create a container and curl the service from within it. We need to do this right now since the service type is `ClusterIP` (default) so we can’t see it from outside of the cluster itself.
    ```
    kubectl run -it --rm --restart=Never curl --image=curlimages/curl spring-petclinic.spring-petclinic.svc.cluster.local
    ```
### Looking At the App with kapp
Okay, so let’s use kapp instead to take a look at our application. 

1.  We can take a look at everything we have running with kapp using the following command:
    ```
    kapp list -A
    ```

    If you didn’t run anything else prior, we should just see Spring PetClinic. You will notice here kapp uses `kapp-demo` as the state namespace. This is separate from the `spring-petclinic` namespace(s) used in the deployment/service.

    ```
    Target cluster 'https://35.247.3.14' (nodes: demo-default-pool-0f8526ab-rb7b, 2+)

    Apps in namespace 'kapp-demo'

    Name              Namespaces             Lcs    Lca
    spring-petclinic  spring-petclinic       false  22h

    Lcs: Last Change Successful
    Lca: Last Change Age

    1 apps
    ```

1.  If we didn’t have kapp and wanted to see all of the resources for this application, we could try running `kubectl -n spring-petclinic get all`. But there are a few issues here. First, `get all` doesn’t actually get all resource types. Second, we might have multiple applications running in this namespace. We would need something like a label to be able to filter on. kapp does this for you. Let’s take a look at the deployment and service.
    ```
    kubectl -n spring-petclinic get deployment,service spring-petclinic --show-labels

    ```

    To see all of the resources `kapp` created for the app, we use `kapp inspect`:
    ```
    kapp -n kapp-demo inspect -a spring-petclinic
    ```

1.  We can also look at logs, which is especially useful if something fails after the pods are up. `kapp logs` will show all pod logs in the app.
    ```
    kapp -n kapp-demo logs -a spring-petclinic
    ```

### Update App
Well, now we want to make it so we can share our app with other people without them needing to be in the cluster.

1.  Let’s make a change to the YAML file and try running it again.

    To reach the service externally, we can **change the service type** from it`ClusterIP` to type `LoadBalancer` in kapp-spring-petclinic.yaml. 

    And then let’s run our `kapp` command again, but with `-c` to see a diff of the changes.

    ```
    kapp deploy -n kapp-demo -a spring-petclinic -c -f kapp-spring-petclinic.yaml
    ```

    This time our output should look like this where we see the change is that the service is being updated.
    ```
    Target cluster 'https://35.247.3.14' (nodes: demo-default-pool-0f8526ab-rb7b, 2+)

    @@ update service/spring-petclinic (v1) namespace: spring-petclinic @@
      ...
    53, 53       kapp.k14s.io/app: "1627000710481082000"
    54     -   type: ClusterIP
        54 +   type: LoadBalancer
    55, 55   status:
    56, 56     loadBalancer: {}

    Changes

    Namespace         Name              Kind     Conds.  Age  Op      Op st.  Wait to    Rs  Ri
    spring-petclinic  spring-petclinic  Service  -       3h   update  -       reconcile  ok  -

    Op:      0 create, 0 delete, 1 update, 0 noop
    Wait to: 1 reconcile, 0 delete, 0 noop
    ```

1.  Now if we run `kubectl get`, we should see an `EXTERNAL_IP` for the service.
    ```
    kubectl -n spring-petclinic get svc
    ```

    You can use curl, or you can open that IP in your browser which will look like the following:
    ![](/images/guides/kubernetes/kapp/spring-petclinic-main.png)

    Congrats, you did it!

    To see what else you can do, run the following or go to the [docs](https://carvel.dev/kapp/docs/latest/).
    ```
    kapp -h
    ```

## Cleanup
Now, if you want, you can delete what was created in this guide.

1.  To delete the app you can run the following command. Make sure it is wanting to only delete what you are trying to delete before agreeing.
    ```
    kapp delete -n kapp-demo -a spring-petclinic
    ```

    Mine looks like the following:
    ```
    Target cluster 'https://35.247.3.14' (nodes: demo-default-pool-0f8526ab-rb7b, 2+)

    Changes

    Namespace         Name                               Kind        Conds.  Age  Op      Op st.  Wait to  Rs  Ri
    (cluster)         spring-petclinic                   Namespace   -       3h   delete  -       delete   ok  -
    spring-petclinic  spring-petclinic                   Deployment  2/2 t   3h   delete  -       delete   ok  -
    ^                 spring-petclinic                   Endpoints   -       3h   -       -       delete   ok  -
    ^                 spring-petclinic                   Service     -       3h   delete  -       delete   ok  -
    ^                 spring-petclinic-7bbb794698        ReplicaSet  -       3h   -       -       delete   ok  -
    ^                 spring-petclinic-7bbb794698-h89vr  Pod         4/4 t   3h   -       -       delete   ok  -
    ^                 spring-petclinic-7bbb794698-x4gbk  Pod         4/4 t   3h   -       -       delete   ok  -

    Op:      0 create, 3 delete, 0 update, 4 noop
    Wait to: 0 reconcile, 7 delete, 0 noop
    ```

1.  Delete namespace:
    ```
    kubectl delete namespace kapp-demo
    ```

## Learn More
To learn more, here are some resources: 

* [kapp](https://carvel.dev/kapp/)
* [kapp-controller](https://github.com/vmware-tanzu/carvel-kapp-controller)
* [CNCF Live Webinar: How to Manage Kubernetes Application Lifecycle Using Carvel (Feb 9, 2021)](https://www.cncf.io/webinars/cncf-live-webinar-how-to-manage-kubernetes-application-lifecycle-using-carvel/)
* [Carvel Toolset](https://carvel.dev/)