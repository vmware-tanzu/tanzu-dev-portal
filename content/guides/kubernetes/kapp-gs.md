---
title: Getting Started with kapp
parent: Carvel 
topics:
- Kubernetes
tags:
- kapp
- Carvel
patterns:
- Deployment
team: 
- Tiffany Jernigan
---

[kapp](https://carvel.dev/kapp/) (part of the open source [Carvel](https://carvel.dev) suite) is a lightweight application-centric tool for deploying resources on Kubernetes. Being both explicit and application-centric it provides an easier way to deploy and view all resources created together regardless of what namespace they’re in. Being dependency-aware, it is able to wait for resources to be created, updated, or deleted, and provides a live status on the progress of the actions. Continue on to see how to get started with kapp.

## Prerequisites
Before you get started you will need to do the following:
* *Create a Kubernetes cluster*: 
* Install *`kubectl`* locally
* *Install the `kapp` CLI* via one of these options:
  * [Homebrew](https://github.com/vmware-tanzu/homebrew-carvel): 
  ```
  brew tap vmware-tanzu/carvel
  brew install kapp
  ```
	* [GitHub releases](https://github.com/vmware-tanzu/carvel-kapp/releases/tag/v0.35.0): move it to `/usr/local/bin` or add it to your `$PATH` and run `chmod +x` to make it executable

> Note: This guide uses Kapp v0.35.0, and we suggest you download and install the same version to ensure the best experience as you follow through this guide.

## Deploy App
Let’s go ahead and deploy our first application with kapp!

### First Run

1.  Create a namespace to use as a [state namespace](https://carvel.dev/kapp/docs/latest/state-namespace/):
    ```
    kubectl create namespace kapp-demo
    ```

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
    kubectl -n spring-petclinic get all
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

1.  If we had other applications running in the `spring-petclinic` namespace when we ran `kubectl -n spring-petclinic get all`, then we would see everything there and not just our application. We could add labels and filter on them, but then we have to make sure to do that with everything in that application. Well, the good news is that kapp does it for you. You can see the labels by running this:
    ```
    kubectl -n spring-petclinic get all --show-labels
    ```

    And if we want to dig into one resource we can see labels there:
    ```
    kubectl -n spring-petclinic get deployment spring-petclinic -o=jsonpath='{.metadata.labels}'
    ```

    To see all of the resources `kapp` created for the app, we use `kapp inspect`:
    ```
    kapp -n kapp-demo inspect -a spring-petclinic
    ```

    We’ll come back to this in a bit to dig further into what kapp does to keep track of resources and changes.

1.  We can also look at logs, which is especially useful if something fails after the pods are up. `kapp logs` will show all pod logs in the app.
    ```
    kapp -n kapp-demo logs -a spring-petclinic
    ```

### Update App
Well, now we want to make it so we can share our app with other people without them needing to be in the cluster.

1.  Let’s make a change to the YAML file and try running it again. 
    To reach the service externally, we can change it to type `LoadBalancer`. 
    ```
    echo '  type: LoadBalancer' >> kapp-spring-petclinic.yaml
    ```

    And let’s run our `kapp` command again.
    ```
    kapp deploy -n kapp-demo -a spring-petclinic -f kapp-spring-petclinic.yaml
    ```

    This time our output should like this where we see the change is that the service is being updated.
    ```
    Target cluster 'https://35.247.3.14' (nodes: demo-default-pool-0f8526ab-rb7b, 2+)

    Changes

    Namespace         Name              Kind     Conds.  Age  Op      Op st.  Wait to    Rs  Ri
    spring-petclinic  spring-petclinic  Service  -       1m   update  -       reconcile  ok  -  

    Op:      0 create, 0 delete, 1 update, 0 noop
    Wait to: 1 reconcile, 0 delete, 0 noop
    ```

    Here we can see that kapp knows that only the service should be changing. Kapp keeps track by creating a [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) when the resources are first created and then every time there is a change. To see the ConfigMaps in this namespace you can run:
    ```
    kubectl -n spring-petclinic get configmaps
    ```

    Let’s continue on.

1.  Now if we run `kubectl get`, we should see an `EXTERNAL_IP` for the service.
    ```
    kubectl -n spring-petclinic get all
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
    spring-petclinic  spring-petclinic                   Deployment  2/2 t   4h   delete  -       delete   ok  -
    ^                 spring-petclinic                   Endpoints   -       4h   -       -       delete   ok  -
    ^                 spring-petclinic                   Service     -       4h   delete  -       delete   ok  -
    ^                 spring-petclinic-6bdff5c97c        ReplicaSet  -       4h   -       -       delete   ok  -
    ^                 spring-petclinic-6bdff5c97c-84ksw  Pod         4/4 t   4h   -       -       delete   ok  -
    ^                 spring-petclinic-6bdff5c97c-bdhd5  Pod         4/4 t   4h   -       -       delete   ok  -
    ^                 spring-petclinic-6bdff5c97c-bdhd5  PodMetrics  -       1s   -       -       delete   ok  -

    Op:      0 create, 2 delete, 0 update, 5 noop
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


