---
date: 2021-01-07
description: Setting up JupyterHub on Kubernetes
featured: false
lastmod: '2021-05-19'
patterns:
- Deployment
tags:
- Python
- Kubernetes
team:
- Thomas Kraus
title: Data Science with Python & JupyterHub on Kubernetes - Part 1
topics:
- Python
weight: 3
faqs:
  faq:
    - question: What is the difference between Jupyter Notebooks and JupyterHub?
      answer: Jupyter Notebook is an easy to manage web-based development environment for multiple languages that simplifies the creation and sharing of code, equations, visualizations, output, and markup within the same text document. JupyterHub, in contrast, is an encapsulated multiuser environment that spawns, manages, isolates, and proxies multiple instances of a single user Jupyter Notebook server.
    - question: How do you modify the configuration of a Helm chart for a JupyterHub Helm package?
      answer: The configuration of a Helm chart can be modified at the time of deployment with a values YAML file. The value file will need to be configured to pull the required Docker images and to change the default Jupyter Notebook interface to the new Jupyter Lab interface.
    - question: How do you access JupyterHub web UI on Mac?
      answer: Jupyter web UI can be accessed using your web browser and local IP address with the specified port (8080) at http://localhost:8080/.
    - question: How do you monitor and troubleshoot JupyterHub installation?
      answer: JupyterHub installation errors can be monitored and troubleshooted by placing a watch on Kubernetes events occurring during the install of the Helm release, or watching the pod creation in the jupyter namespace.
    - question: How do you install JupyterHub into a Kubernetes cluster?
      answer: After installing kind, Helm CLI, and creating a Kubernetes cluster, to install JupyterHub into a Kubernetes cluster, leverage the Helm package manager for Kubernetes to install JupyterHub. First, add the Jupyter Helm chart repo to Helm, then, on a Linux machine, generate a random hex string to be used as a security token. Next, confirm the existence of the "standard" storage class and modify the configuration of the Helm chart with a values YAML file. In the YAML file, enter your Docker Hub username, email, and password as well as the security token hex string. Finally, create a dedicated Kubernetes namespace and install JupyterHub using the Helm chart, being sure to reference the values file you previously modified.
---

Provisioning environments for data scientists and analysts to run simulations, test new models, or experiment with new datasets can be time-consuming and error-prone. Python is a popular choice for data science use cases, and one of the easiest ways to leverage Python is through Jupyter Notebooks. A web-based development environment for multiple languages, Jupyter Notebooks support the creation and sharing of documents that contain code, equations, visualizations, output, and markup text all in the same document. Because Jupyter Notebooks are just text files, they can be easily stored and managed in a source code repository such as GitLab or GitHub. JupyterHub, meanwhile, is a multiuser hub that spawns, manages, isolates, and proxies multiple instances of a single-user Jupyter Notebook server.  

Kubernetes provides the perfect abstractions and API to automate consistent and isolated environments for data scientists to conduct their work. Combining these three things—Jupyter Notebooks, Python, and Kubernetes—into one powerful platform therefore makes a lot of sense.

In the first post in this two-part series, you will learn how to deploy a Kubernetes cluster using kind on a Mac, then how to install JupyterHub into that cluster. In the second post, we will show you how to use the data science and machine learning notebooks you have created on your newly deployed JupyterHub service running on Kubernetes.

![Example notebook in JupyterHub](/images/blogs/jupyter-hub-on-k8s/p1-jh-ex.png)

## Before You Begin

There are a few things you’ll need before getting started with Jupyter Notebooks on Kubernetes. These instructions leverage the kind project (https://kind.sigs.k8s.io/), which stands for Kubernetes in Docker. I ran through this example on my MacBook, but any system that has Docker installed can be used; kind will create a default storage class for your cluster using a local path persistent volume. For a production deployment of JupyterHub, you want to make sure you have persistent storage (using the CSI) that maps to a shared storage solution such as NFS, iSCSI, or FC. The default JupyterHub Helm chart settings create a service type load balancer because most managed Kubernetes offerings come configured with a cloud load balancer. To keep this tutorial brief, we will use Kubernetes port forwarding to forward a local port to our proxy-public service, which would normally be exposed through the cloud load balancer.

## Install kind and Create Your Kubernetes Cluster

Start by taking the following steps: 
1. Open your favorite terminal emulator on your Mac, which should be running OS X
2. Use the Brew package manager, which makes installing kind on Mac OS X simple 

```bash
❯ brew install kind

==> Downloading https://homebrew.bintray.com/bottles/kind-0.9.0.catalina.bottle.1.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/e5ba99b5f14711e0dcb121a992d74c5ee6c6b0468b27e5200bf796d4987e13c0?response-content-disposition=attachme
######################################################################## 100.0%
==> Pouring kind-0.9.0.catalina.bottle.1.tar.gz
==> Caveats
zsh completions have been installed to:
  /usr/local/share/zsh/site-functions

/usr/local/share/zsh/site-functions is not in your zsh FPATH!
Add it by following these steps:
  https://docs.brew.sh/Shell-Completion#configuring-completions-in-zsh
==> Summary
🍺  /usr/local/Cellar/kind/0.9.0: 8 files, 9.2MB
==> `brew cleanup` has not been run in 30 days, running now...
Removing: /Users/kraustvmware.com/Library/Caches/Homebrew/pcre2--10.35.catalina.bottle.tar.gz... (2.0MB)
Removing: /Users/kraustvmware.com/Library/Caches/Homebrew/sqlite--3.33.0.catalina.bottle.tar.gz... (1.9MB)
Removing: /Users/kraustvmware.com/Library/Caches/Homebrew/Cask/iterm2--3.3.12.zip... (13.5MB)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/fdupes... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/gdbm... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/readline... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/sqlite... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/xz... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/pcre2... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/openssl@1.1... (64B)
Removing: /Users/kraustvmware.com/Library/Logs/Homebrew/python@3.8... (3 files, 172.3KB)
Pruned 1 symbolic links from /usr/local
```

3. Download a kind cluster configuration manifest or create your own. This is my config:

```bash
❯ cat multinode-conf.yaml

kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: "127.0.0.1"
  apiServerPort: 6443
nodes:
- role: control-plane
- role: worker
- role: worker
```

4. Create your local Kubernetes cluster:

```bash
❯ kind create cluster --config ./multinode-conf.yaml --name jupyter
Creating cluster "jupyter" ...
 ✓ Ensuring node image (kindest/node:v1.19.1) 🖼
 ✓ Preparing nodes 📦 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-jupyter"
You can now use your cluster with:

kubectl cluster-info --context kind-jupyter

Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
```                                         

5. Test your Kubernetes cluster:
```bash
❯ kubectl config get-contexts
CURRENT   NAME           CLUSTER        AUTHINFO       NAMESPACE
*         kind-jupyter   kind-jupyter   kind-jupyter

❯ kubectl get nodes
NAME                    STATUS   ROLES    AGE     VERSION
jupyter-control-plane   Ready    master   2m31s   v1.19.1
jupyter-worker          Ready    <none>   2m1s    v1.19.1
jupyter-worker2         Ready    <none>   2m1s    v1.19.1
```

## HELM Install

Before we can install the JupyterHub Helm chart, we need to ensure Helm is installed. If you don’t already have it, follow the instructions below for OS X or reference this [Getting Started Guide](/guides/kubernetes/helm-gs/). 

On your Mac, download and install the [Helm CLI](https://github.com/helm/helm/releases) if you haven't already done so.

```bash
❯ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
❯ chmod 700 get_helm.sh
❯ ./get_helm.sh
Downloading https://get.helm.sh/helm-v3.4.1-darwin-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
Password:
helm installed into /usr/local/bin/helm
```

## Install JupyterHub

We are now going to leverage the Helm package manager for Kubernetes to install JupyterHub. Follow the instructions below to deploy JupyterHub notebooks on your Kubernetes cluster.

Add the Jupyter Helm chart repo to Helm:
```bash
❯ helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
❯ helm repo update
```

On a Linux machine, generate a random hex string to be used as a security token by JupyterHub:
```bash
❯ openssl rand -hex 32
  c46350ed823f94.......20dff86cc63a570d3be
```

Confirm the existence of the “standard” storage class, which will be used for the persistent volume for each instance spawned by JupyterHub. This will allow each user to have a 10GB persistent volume so that their work will persist through restarts of their instance or pod and be mounted to their home directory.  

```bash
❯ kubectl get storageclass                                      

NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  3m
```

Modify the configuration of a Helm chart. This is done at deployment time with a values YAML file. To simplify your experience, we have already created a [configuration YAML](https://raw.githubusercontent.com/tkrausjr/k8s-manifests/master/jupyter-hub/scipy-jhub-values-kind.yaml) file for the JupyterHub Helm package, which you can download and edit. We have preconfigured this values file to configure several things for your JupyterHub installation:

- Thanks to the new Docker image pull changes on Docker Hub, you will need to configure an `imagePullSecret` with your Docker Hub account to pull the required images. Read more about it [here](https://docs.docker.com/docker-hub/download-rate-limit/).
- Change the default interface to the newer [Jupyter Lab](https://jupyter.org/#:~:text=JupyterLab%20is%20a%20web%2Dbased,scientific%20computing%2C%20and%20machine%20learning.) interface. This recent improvement provides some aesthetic and functional benefits, such as providing a terminal interface to your Jupyter Notebook instance to do things like git checkouts.

```bash
❯ wget https://raw.githubusercontent.com/tkrausjr/k8s-manifests/master/jupyter-hub/scipy-jhub-values-kind.yaml

❯ vi scipy-jhub-values-kind.yaml
```

Change the following in the `scipy-jhub-values-kind.yaml` file:

- Put in your Docker Hub account the username, email, and password.
- Put in the generated hex string from Step 1.

```yaml
# imagePullSecret is configuration to create a k8s Secret that Helm chart's pods
# can get credentials from to pull their images.
imagePullSecret:
  create: true
  automaticReferenceInjection: true
registry: 
  username: '<DockerHub-Username>' ## <<Change to your User Name>>
  email: '<DockerHub-Email>' ## <<Change to your Email>>
  password: '<DockerHub-Password>' ## <<Change to your Pass>>
hub:
  service:
    type: ClusterIP
  uid: 1000
  fsGid: 1000
  deploymentStrategy:
    type: Recreate
  db:
    type: sqlite-pvc
    upgrade:
    pvc:
      accessModes:
        - ReadWriteOnce
      storage: 3Gi
      storageClassName: standard  ## <Change to your Storage Class>
singleuser:
  image:
    name: jupyter/scipy-notebook
    tag: latest
  memory:
    limit: 5G
    guarantee: 2.5G
  defaultUrl: "/lab"
  storage:
    type: dynamic
    dynamic:
      storageClass: standard  ## <Change to your Storage Class>
proxy:
  service:
    type: ClusterIP
  secretToken: "c86a373144e4e8b1341fa5661cdc70f165856ba48eb54028eb844d41f1f2aeb4d4a0cca29b9548d52cb9b4c2fb901aa00537a9d37451a6f77953add34039ca56" ## <<Change the token to your random hex string from Step 1>>
```
{{% callout %}}
**Note**: We have chosen the latest version of the `jupyter/scipy-notebook`, which comes with all the required libraries for the machine learning and data science use cases we will demonstrate in the second post of this two-part series. Specifically, the `scipy-notebook` comes preinstalled with pandas, matplotlib, scikit-learn, beautifulsoup, and seaborn. For a list of the Docker images that the Jupyter team maintains, you can look [here](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/selecting.html).
{{% /callout %}}


Create a dedicated Kubernetes namespace to house the JupyterHub Kubernetes components:  

```bash
❯  kubectl create namespace jupyter
```

Install JupyterHub using the Helm chart and reference the values file you modified in Step 3:

```bash
❯  helm install jhub-datascience jupyterhub/jupyterhub -f scipy-jhub-values-kind.yaml -n jupyter --timeout 180s
WARNING: You should switch to "https://charts.helm.sh/stable"
NAME: jhub-datascience
LAST DEPLOYED: Thu Oct 29 13:58:01 2020
NAMESPACE: jupyter
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing JupyterHub!
Your release is named jhub-datascience and installed into the namespace jupyter.
You can find if the hub and proxy is ready by doing:
 kubectl --namespace=jupyter get pod
and watching for both those pods to be in status 'Running'.
You can find the public IP of the JupyterHub by doing:
 kubectl --namespace=jupyter get svc proxy-public
It might take a few minutes for it to appear!
Note that this is still an alpha release! If you have questions, feel free to
  1. Read the guide at https://z2jh.jupyter.org
  2. Chat with us at https://gitter.im/jupyterhub/jupyterhub
  3. File issues at https://github.com/jupyterhub/zero-to-jupyterhub-k8s/issues
directly instead.
```
{{% callout %}}
**Note**: This installation will take a while to pull down all the images required to use JupyterHub and bootstrap the installation process.
{{% /callout %}}


You can monitor and troubleshoot the JupyterHub installation by watching the pod creations in the `jupyter` namespace.

```bash
❯  kubectl get po -n jupyter -w                        

NAME                              READY   STATUS    RESTARTS   AGE
continuous-image-puller-4lpbv     1/1     Running   0          90s
continuous-image-puller-cw8vd     1/1     Running   0          90s
continuous-image-puller-hr75f     1/1     Running   0          90s
continuous-image-puller-skspt     1/1     Running   0          90s
hub-7d9698c5d4-dh4ld              1/1     Running   0          90s
proxy-7c5f54cb77-t8l4d            1/1     Running   0          90s
user-scheduler-67f756d5d6-4gb6b   1/1     Running   0          90s
user-scheduler-67f756d5d6-f4z4c   1/1     Running   0          90s
```

You can also monitor for errors by putting a watch on Kubernetes events happening during the installation of the Helm release inside the `jupyter` namespace.  

```bash
❯  kubectl get events -n jupyter -w

0s          Normal    Pulled                   pod/continuous-image-puller-6ksn9      Container image "k8s.gcr.io/pause:3.2" already present on machine
0s          Normal    Created                  pod/continuous-image-puller-6ksn9      Created container pause
0s          Normal    Started                  pod/continuous-image-puller-6ksn9      Started container pause
0s          Normal    EnsuringLoadBalancer     service/proxy-public                   Ensuring load balancer
0s          Normal    EnsuredLoadBalancer      service/proxy-public                   Ensured load balancer
0s          Warning   FailedScheduling         pod/hub-7b9c7b96d5-2l4sd               running "VolumeBinding" filter plugin for pod "hub-7b9c7b96d5-2l4sd": pod has unbound immediate PersistentVolumeClaims
0s          Warning   ProvisioningFailed       persistentvolumeclaim/hub-db-dir       storageclass.storage.k8s.io "standard" not found
```

To look at a failed Helm release in Kubernetes: 

```bash
❯  helm list -A                              
WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.
WARNING: You should switch to "https://charts.helm.sh/stable"
NAME      	NAMESPACE	REVISION	UPDATED                                	STATUS	CHART            	APP VERSION
jhub-scipy	jupyter  	1       	2020-11-04 09:25:17.906053349 -0800 PST	failed	jupyterhub-0.10.0	1.2.0
```

To uninstall a failed Helm release in Kubernetes:  

```bash
❯  helm uninstall jhub-scipy -n jupyter                                                                                               

WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.
WARNING: You should switch to "https://charts.helm.sh/stable"
release "jhub-scipy" uninstalled
```

## Jupyter Hub Access

To verify that your Jupyter Hub deployment is successful, the following Kubernetes objects should be running in the `jupyter` namespace:  

```bash
❯  kubectl get deploy,po,svc,pvc -n jupyter     

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hub              1/1     1            1           3m
deployment.apps/proxy            1/1     1            1           3m
deployment.apps/user-scheduler   2/2     2            2           3m

NAME                                  READY   STATUS    RESTARTS   AGE
pod/continuous-image-puller-4lpbv     1/1     Running   0          3m
pod/continuous-image-puller-cw8vd     1/1     Running   0          3m
pod/continuous-image-puller-hr75f     1/1     Running   0          3m
pod/continuous-image-puller-skspt     1/1     Running   0          3m
pod/hub-7d9698c5d4-dh4ld              1/1     Running   0          3m
pod/proxy-7c5f54cb77-t8l4d            1/1     Running   0          3m
pod/user-scheduler-67f756d5d6-4gb6b   1/1     Running   0          3m
pod/user-scheduler-67f756d5d6-f4z4c   1/1     Running   0          3m

NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
hub            ClusterIP   10.96.151.178   <none>        8081/TCP   3m
proxy-api      ClusterIP   10.96.90.242    <none>        8001/TCP   3m
proxy-public   ClusterIP   10.96.66.108    <none>        80/TCP     3m

NAME          STATUS   VOLUME            CAPACITY   ACCESS MODES   STORAGECLASS   AGE
claim-admin   Bound    pvc-46f13b00-580a-435a-b263-22b4cfd2376d   10Gi       RWO            
standard       20m
hub-db-dir    Bound    pvc-96243b44-2088-44df-828a-d9abf75cea46   3Gi        RWO            standard       51m
```

The final step is to expose the proxy-public Kubernetes service locally on your Mac using port forwarding. 

```bash
❯ kubectl port-forward -n jupyter svc/proxy-public 8080:80 &
[2] 39859
Forwarding from 127.0.0.1:8080 -> 8000                                                     
Forwarding from [::1]:8080 -> 8000
```

 
To access the JupyterHub web UI from your Mac, use your web browser and enter your local IP address with the port specified above (8080), so http://localhost:8080/.

![JupyterHub login screen](/images/blogs/jupyter-hub-on-k8s/p1-jh-login.png)
 
Congratulations! You are now ready to consume the service you have created and developed using Python Jupyter Notebooks running on JupyterHub on Kubernetes. In [Part 2 of this series](/blog/data-science-with-python-jupyterhub-on-kubernetes-part-2/), we will focus on how to use JupyterHub and use Jupyter Notebooks on Kubernetes.