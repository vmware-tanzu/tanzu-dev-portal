---
layout: single
team:
- Paul Kelly
title: Install Jenkins
weight: 30
---

There are many different ways to deploy Jenkins, but here you will deploy it to a Kubernetes cluster using Helm charts supplied by the Jenkins project. This creates a pair of Jenkins controller pods that provide the Jenkins UI, enable admin tasks, and monitor source code repositories for changes. Jobs are run in Jenkins agent pods, which are created on demand when a job runs. 

Installing Jenkins with Helm is straightforward and easy to customize. We’ll make the following changes to the default installation: 



* Change the Jenkins agent image for one that has some extra command line tools installed and increase the resource limits.
* Add three extra plug-ins that are used by our pipeline jobs.

At a high level, the steps are: 



1. Add the Jenkins repo to your Helm installation 
2. Create a namespace and service account for Jenkins 
3. Edit the installation defaults in the jenkins-values.yaml file 
4. Install Jenkins with Helm  
5. Configure the plug-ins and credentials

These instructions were correct at the time publication, and following them should give you a Jenkins installation running on your Kubernetes cluster. However, software is always being updated, so if you run into problems, please see the official instructions for [installing Jenkins on Kubernetes](https://www.jenkins.io/doc/book/installing/kubernetes/). The Helm charts are stored on this GitHub repository, so similarly, if you run into problems with the Jenkins installation, please check the list of issues maintained on this repository. 


## Add Jenkins repository to Helm 

Run the following two commands: 


```
helm repo add jenkinsci https://charts.jenkins.io
helm repo update
```


You can check the repo with the command: 


```
helm search repo jenkinsci
```


You should see output similar to this (version numbers might be later than these): 

```
NAME             	CHART VERSION	APP VERSION	DESCRIPTION                                       
jenkinsci/jenkins	4.1.12       	2.346.1    	Jenkins - Build great things at any scale! The ...
```


## Create a namespace and service account

Create a Jenkins namespace for the installation: 


```
kubectl create ns jenkins
```


Next, create a Service Account that will give Jenkins permission to interact with the cluster: 



1. Create a `jenkins-sa.yaml` file from the contents of [https://raw.githubusercontent.com/jenkins-infra/jenkins.io/master/content/doc/tutorials/kubernetes/installing-jenkins-on-kubernetes/jenkins-sa.yaml](https://raw.githubusercontent.com/jenkins-infra/jenkins.io/master/content/doc/tutorials/kubernetes/installing-jenkins-on-kubernetes/jenkins-sa.yaml) 
2. Add the following labels and annotations in the metadata section, without deleting the labels and annotations that are already there:  

    ```
     labels: 
        app.kubernetes.io/managed-by: Helm
      annotations: 
        meta.helm.sh/release-name: jenkins
        meta.helm.sh/release-namespace: jenkins 

    ```


 \
Without the label and annotations, Helm will complain about the resources it doesn’t own when you try to install Jenkins. 


## Edit installation defaults

The installation values that may be overridden are defined in a values.yaml that you can pass to Helm at the time of installation. You are going to change the image used for Jenkins agents, increase the amount of memory available, and also specify some extra plug-ins: 



1. Create a file called `jenkins-values.yaml` from the contents here: [https://raw.githubusercontent.com/jenkinsci/helm-charts/main/charts/jenkins/values.yaml](https://raw.githubusercontent.com/jenkinsci/helm-charts/main/charts/jenkins/values.yaml) 
2. Edit this file to increase the memory limit for Jenkins agents to 1024Mi, under

```
agent: 
  resources: 
    limits: 
      memory:
```

3. In the same file, change the image used for creating agents to: `pkatpivotal/jenkins-agent-plus:latest`. Under `agent`:

```
image: "pkatpivotal/jenkins-agent-plus" 
tag: "latest"
```
 
This image is based on image `jenkins/inbound-agent `but adds command line tools kubectl and ytt. Jenkins runs your build jobs inside pods created from the agent image. 
4. In the same file, add the following values under `installPlugins:`  

```
- kubernetes-cli:1.10.3 
- generic-webhook-trigger:1.83 
- pipeline-maven:3.10.0
```

5. Save the changes. 


## Install Jenkins with Helm 

To install Jenkins into the Jenkins namespace: 


```
helm install jenkins -n jenkins -f jenkins-values.yaml jenkinsci/jenkins
```


Depending on the speed of your computer and internet connection, it might take a few minutes to download the images and start the pods. When the installation is complete, check whether the Jenkins pod is running: 


```
kubectl get po -n jenkins 
```


You should see something like the following: 


```
NAME        READY   STATUS    RESTARTS   AGE
jenkins-0   2/2     Running   0           1m
```


If the pod isn't running, you will need to debug the installation. Look at the events in the Jenkins namespace to see whether that highlights any issues: 


```
kubectl get events -n jenkins 
```


The installation runs an init container before starting the Jenkins controller images, so check the logs of the init container: 


```
kubectl logs jenkins-0 init -n jenkins
```


Something to look out for in these logs are problems caused by mismatches between plug-in versions. Plug-ins are updated all the time, and sometimes one plug-in mandates a minimum version of another plug-in it depends on. 


## Configure your Jenkins installation

Jenkins should now be running inside your cluster. You need to expose the service outside the cluster so that you can access the Jenkins UI. The Helm installation has created a Cluster IP service called `jenkins` in namespace `jenkins`. On most Kubernetes clusters you would set up an ingress to access the service, but if you are running on minikube, you can start a tunnel: 


```
minikube service jenkins -n jenkins --url
```


This displays the URL and port you can use to access Jenkins from the host machine. The tunnel is provided by the process you just started, so leave it running. Point your web browser at the URL given and you should see the Jenkins log-in screen. 

This does not work with all minikube drivers; if you have problems getting the tunnel working, try Kubernetes port-forwarding instead: 

```
kubectl port-forward svc/jenkins 8080:8080 -n jenkins
```


In the next few sections, you will: 



* Retrieve the admin password.
* Set up test database credentials
* Set up GitHub credentials
* Create a kubeconfig for Jenkins
* Create an API token
* Configure the Maven plug-in 


### Retrieve the admin password

To keep this example as simple as possible, you won’t be adding new users to Jenkins or changing the Security Realm from the Jenkins default. You’ll use the admin user created by default at install time for everything in this example. Normally, when you set up Jenkins, you would add individual users with the appropriate permissions to do their jobs and you would probably connect it to your corporate directory so that you could manage users through already-established identities. 

Jenkins generates a random administrator password when it is installed. To retrieve it: 


```
kubectl exec --namespace jenkins -it svc/jenkins -c jenkins  \ 
      -- /bin/cat /run/secrets/chart-admin-password
```


This command opens an SSH session with one of the containers in the Jenkins service and echoes the password out to your terminal. Copy the password somewhere safe, and use it to log in to the Jenkins UI with the username **admin**. 


### Set up test database credentials

The end-to-end tests require access to the test database. Store these as Jenkins credentials and they can be injected by Jenkins into the test job when it runs. 



1. From the main Jenkins dashboard, go to Manage Jenkins, Manage Credentials, click the Jenkins Store under “Stores scoped to Jenkins,” click Global Credentials, and then Add Credentials on the left-hand side of the page. 
2. Set the Kind to **Username with password**.
3. Set the ID field to “test-db-credentials”. The ID enables you to refer to the key in your pipeline scripts, and if you don’t set a specific value, Jenkins will assign a UUID. 
4. Set the username to **postgres** and the password to the value you used in Setup Local Database. 


### Set up GitHub credentials

Jenkins needs to be able to access your GitHub repository and be able to push changes to a branch.



5. Create an SSH key without a passphrase and add it to your GitHub account (please see [this GitHub document](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) if you are unsure how).
6. From the main Jenkins dashboard, go to Manage Jenkins, Manage Credentials. Next, click the Jenkins Store under “Stores scoped to Jenkins”, and click Global Credentials, then Add Credentials on the left-hand side of the page. 
7. Set the Kind to **SSH Username with Private Key**.
8. Set the ID field to `git_automation`. The ID enables you to refer to the key in your pipeline scripts, and if you don’t set a specific value, Jenkins will assign a UUID. 
9. Copy and paste the private key into the Key field. 


### Create a Jenkins kubeconfig

You need to provide Jenkins with configuration and credentials to access your cluster. Jenkins has a kubeconfig credential type you can copy and paste a configuration file into. You can see Kubernetes documentation on creating a new configuration file [here](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/). If you already have a local kubeconfig file for accessing the cluster, you can copy the cluster, context, and user entries using `~/.kube/config`, provided the certificate fields contain certificate data and not paths to certificate files. 

If you are using a local minikube cluster, the configuration fields certificate-authority, client-certificate, and client-key for your cluster will all point to local certificate files on the host machine. You can’t use these from Jenkins running on the cluster as it won’t have access to the files on the host. However, you can create the configuration information from this template:

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <BASE64-ENCODED-CA.CRT>
    extensions:
    - extension:
        last-update: Mon, 11 Jul 2022 16:24:32 BST
        provider: minikube.sigs.k8s.io
        version: v1.26.0
      name: cluster_info
    server: https://127.0.0.1:54481
  name: minikube
contexts:
- context:
    cluster: minikube
    extensions:
    - extension:
        last-update: Mon, 11 Jul 2022 16:24:32 BST
        provider: minikube.sigs.k8s.io
        version: v1.26.0
      name: context_info
    namespace: default
    user: minikube
  name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
- name: minikube
  user:
    client-certificate-data: <BASE64-ENCODED-CLIENT.CRT>
    client-key-data: <BASE64-ENCODED-CLIENT.KEY>

```



1. Create a kubeconfig file for accessing your cluster (copy and paste the example file above). 
2. Change the field names to certificate-authority-data, client-certificate-data, and client-key-data in the configuration file. 
3. Get the paths to the certificate authority, client certificate, and key from your own Kubeconfig file (`~/.kube/config`), and get the base64 encoding for each one. For example:

```
cat ~/.minikube/profiles/minikube/client.key | base64
```

4. Copy and paste the text into the placeholders in the example config file. The base 64 encoded text for each file is a single line of text that should be pasted directly next to its corresponding YAML name in the file. 

Now, add the credentials to Jenkins: 



1. From the main Jenkins dashboard, go to Manage Jenkins, Manage Credentials. Next, click the Jenkins Store under “Stores scoped to Jenkins”, and click Global Credentials, then Add Credentials on the left-hand side of the page. 
2. Set the Kind to **Secret file**.
3. Set the ID field to “kubernetes-file”. The ID enables you to refer to the key in your pipeline scripts, and if you don’t set a specific value, Jenkins will assign a UUID. 
4. Click the **Choose** file button and upload your kubeconfig file. 
5. Click **OK**. 


### Generate a Jenkins API token

Generating an API token enables you to create jobs directly from their XML configuration, as well as through the Jenkins UI. To generate a token using the Jenkins UI: 



1. Click Manage Jenkins. 
2. Click Manage Users and click **User Id Admin**. 
3. Click Configure, and under API Token, click Add New Token. Copy the token and store it securely somewhere because once you leave this page you won’t be able to read it again. 
4. Click Save at the bottom of the page. 


### Configure Jenkins Maven plug-in

Finally, configure Jenkins to install Maven: 



1. From the main Jenkins dashboard, go to Manage Jenkins, Global Tool Configuration, and under Maven, click the Add Maven button. 
2. Set the name to **maven-3-8**, select Install automatically, select version 3.8.3 or newer, and select Install from Apache on the Add Installer dropdown. 
3. Click the Save button at the bottom of the Global Tool Configuration page. 

This enables Jenkins to add Maven to agents, if it is not already installed. 
