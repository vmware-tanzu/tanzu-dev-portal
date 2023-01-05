---
title: CKAD Practice Questions
description: 'CKAD practice questions for the updated exam that was changed in September 2021'
date: '2022-12-31'
publishDate: '2022-12-31'
lastmod: '2022-12-31'
slug: ckad-practice-questions-sept-21
tags:
- Kubernetes
team:
- Tiffany Jernigan
languages:
---


The Linux Foundation has multiple exams available for Kubernetes certifications. One is the Certified Kubernetes Application Developer (CKAD) exam which “certifies that candidates can design, build and deploy cloud-native applications for Kubernetes”.

In terms of knowledge, the exams go in the following order with difficulty increasing:
- [Kubernetes and Cloud Native Associate (KCNA)](https://www.cncf.io/certification/kcna/)
- [Certified Kubernetes Application Developer (CKAD)](https://www.cncf.io/certification/ckad/)
- [Certified Kubernetes Administrator (CKA)](https://www.cncf.io/certification/cka/)
- [Certified Kubernetes Security Specialist (CKS)](https://www.cncf.io/certification/cks/)

When I took the CKAD exam in March 2022, it was the September 2021 version, and its curriculum was broken into the following sections (which looks the same as it does now at the writing of this blog, though the detailed outline is a little different):
- Application Design and Build (20%)
- Application Deployment (20%)
- Application Observability and Maintenance (15%)
- Application Environment, Configuration and Security (25%)
- Services and Networking (20%)

Check out [this blog post](https://training.linuxfoundation.org/ckad-program-change-2021/) to see more details about each section; You can also go to the [GitHub CNCF curriculum page](https://github.com/cncf/curriculum) to see them per Kubernetes version for the various exams.

When preparing for the exam, I gathered questions and ideas from other folks, and I'd like to share these questions with you as well so that you can use them to prepare for the CKAD exam (or just practice your Kubernetes-fu). Of course, sharing the content of the actual exam isn't allowed, so I made sure to gather questions only from folks who *had not* passed the CKAD exam. I don't think that I'm even allowed to tell you whether these questions are close or not to what you'll experience during the exam itself, but I'm proud to report that I passed the exam and I think these questions definitely helped! I hope they will help you too.

One of the very handy parts of the exam is that you don’t have to memorize everything. You’re allowed to use the Kubernetes documentation and a few other resources (listed in the [exam instructions](https://docs.linuxfoundation.org/tc-docs/certification/certification-resources-allowed#certified-kubernetes-administrator-cka-and-certified-kubernetes-application-developer-ckad). You will want to get very familiar with using the kubectl CLI though.


{{% callout note %}}
To save time during the exam, set up auto completion and alias `kubectl` to just `k`. Check out the [Kubernetes documentation for how to do this](https://kubernetes.io/docs/reference/kubectl/cheatsheet/).

Also, `kubectl explain` is your friend for figuring out where things need to go when editing YAML.
{{% /callout %}}

Create a new namespace `ckad` so at the end we can just delete the namespace to clear up the resources at the end.
```
k create namespace ckad
```

If you have the super useful [`kubens` CLI](https://github.com/ahmetb/kubectx) you can run the following to switch to the `ckad` namespace context (so you can run kubernetes commands in a specific namespace without having to specify `-ns` every time):
```
kubens ckad
```

Otherwise, run the following:
```
k config set-context --current --namespace=ckad
```

All answers below are done with Kubernetes v1.25.


## Application Design and Build (20%)
### 1. We have a specific job (say, image "busybox") that needs to run once a day. How do we do that?

The following would run the job once a day at 2am. If you're not familiar with crontab syntax, check out [crontab.guru](https://crontab.guru/) for a refresher (but keep in mind that you wouldn't be able to use crontab.guru during the exam).
```
k create cronjob test-job --image=busybox --schedule="0 2 * * *"
```

### 2. Let’s assume that the job typically takes an hour. Sometimes however it remains stuck forever. How can we avoid that?

We can use a [liveness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command).

From the Kubernetes docs: “Many applications running for long periods of time eventually transition to broken states, and cannot recover except by being restarted. Kubernetes provides liveness probes to detect and remedy such situations.”

### 3. Provide YAML for a deployment running NGINX with the official NGINX image.
```
k create deploy nginx --image=nginx -o yaml --dry-run=client
```

If you want to test it out you can dump it into a file and run it, e.g.:
```
k create deploy nginx --image=nginx -o yaml --dry-run=client > ckad-nginx.yaml

k apply -f ckad-nginx.yaml
```

Then you can use `port-forward`
```
k port-forward deploy/nginx 1234:80
```

Go to your browser for [http://localhost:1234](http://localhost:1234). You should see an Welcome to NGINX webpage.

And run `ctrl-c` to terminate the port-forward.

### 4. The official NGINX image serves files from `/usr/share/nginx/html/`; provide a deployment YAML that runs NGINX but serves files downloaded from a git repo (hint: use a volume and an initContainer).

If we follow the provided hint, we will want to put the files of the git repo into the volume. The volume will be mounted into the NGINX container (in the /usr/share/nginx/html directory), and it will also be mounted into an initContainer that will take care of downloading the files (e.g. by cloning the repo).

Since we need a git repo to test the whole thing, I'm using one of my GitHub repositories in the example below. My GitHub repository has a few static HTML files for the purpose of this example.
The easiest way to produce the YAML is probably to start with the NGINX YAML from the previous question (and use `kubectl apply` to try it out and iterate until we get it right). Alternatively, you could also create a Deployment, and then tweak it with `kubectl edit`. We need to make three changes in the Deployment manifest:
1. Add the volume
2. Mount the volume in the NGINX container, at /usr/share/nginx/html/
3. Add the initContainer that will also mount the volume, and clone the git repo

The mount path in the initContainer doesn't matter, as long as the git command is set to clone the repo in that same path.

When we put all these changes together, we get a YAML manifest looking like the one below:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: nginx-github
spec:
 selector:
   matchLabels:
     app: nginx-github
 replicas: 1
 template:
   metadata:
     labels:
       app: nginx-github
   spec:
     containers:
     - name: nginx
       image: nginx
       ports:
       - containerPort: 80
       volumeMounts:
       - name: www-data
         mountPath: /usr/share/nginx/html
     # These containers are run during pod initialization
     initContainers:
     - name: git
       image: alpine/git
       command:
       - git
       - clone
       - https://github.com/tiffanyfay/space-app.git
       - /data
       volumeMounts:
       - name: www-data
         mountPath: /data # You can choose a different name if you want
     volumes:
     - name: www-data
       emptyDir: {}
```
## Application Deployment (20%)
### 1. Provide YAML for deployment called "blue" running NGINX
```
k create deploy blue --image=nginx -o yaml --dry-run=client > nginx-blue.yaml

k apply -f nginx-blue.yaml
```

### 2. Provide YAML for deployment called "green" running NGINX
```
k create deploy green --image=nginx -o yaml --dry-run=client > nginx-green.yaml

k apply -f nginx-green.yaml
```

### 3. Provide YAML for an internal service called "prod" sending traffic to deployment "blue"

We can either use `k expose` or `k create svc` here. With `expose` we don’t have to do anything afterwards since it is associated with an existing resource so it knows what selector to use.
```
k expose deployment blue --name=prod --port=80 > -o yaml --dry-run=client > prod-svc.yaml

k apply -f prod-svc.yaml
```

Another way to do this is with `k create svc clusterip prod` and then change the selector to `app: blue`. If you don’t have a resource you’re creating a service for already you’ll have to use `create svc` instead of `expose`.

We can check this worked by getting the IP addresses for blue and green and seeing what endpoints we have for our service. 
```
k get pods -l 'app in (blue,green)' -o wide
```

The endpoint listed for the `prod` service should be `<blue-IP>:80`.
```
k get ep prod
```

### 4. Switch the traffic to mix of blue+green
To switch traffic we can add a new label to blue and green and have the service selector use this new label. For instance this could be `svc: prod`. 

We can add `svc: prod` at the level of `spec.template.metadata.labels` on a line next to `app: <green or blue>` and do a `k apply -f` on the files again.

Solely for the purpose of testing, you could just label those pods for now. This doesn’t work in the long term though because if the pods terminate and new ones create they won’t have the label.

```
kubectl label pods --selector app=blue svc=prod
kubectl label pods --selector app=green svc=prod
```

Edit the service YAML to change the `selector` from `app: blue` to `svc: prod` then apply it:
```
kubectl apply -f 
```

We can see that this worked by checking the endpoints again. There should be two now.
```
k get ep prod
```

Switch traffic back to blue only.
You could do this by removing the `svc: prod` label line from the green pods or change the service selector back to `app: blue` using `kubectl edit`

## Application Observability and Maintenance (15%)
### 1. What is the difference between liveness and readiness probes?
Readiness: Detect if the thing is not ready, e.g. if it’s overloaded, busy. It’s like putting a little sign on saying “I am busy!” or “Gone for a break!”, and we leave it alone; we don’t send requests to it until it’s ready again.

Liveness: Detect if the thing is dead. When it’s dead it won’t come back so we need to replace it with a new one (=restart it) because Kubernetes is not the walking dead.

### 2. Provide YAML for deployment running NGINX, with HTTP readiness probe
```
k create deploy nginx-readiness --image=nginx
k edit deploy nginx-readiness
```

Add the following under the `template.spec.containers` level. So this should be in line with name, image, etc.
```yaml
       readinessProbe:
         httpGet:
           path: /index.html
           port: 80
         initialDelaySeconds: 5
         periodSeconds: 5 # how long to wait after first try
```

Watch for the deployment to become ready:
```
k get deploy nginx-readiness -w
```

Run `ctrl-c` to stop the watch.
## Application Environment, Configuration and Security (25%)
### 1. Create deployment "purple" running NGINX**
```
k create deploy purple --image=nginx --port=80
```

### 2. Create service account named "scaler"
```
k create sa scaler
```

### 3. Create a pod named `scaler` with the following requirements:
### - it should use that `scaler` serviceaccount
### - it should be possible to obtain an interactive shell in it
### - it should have kubectl installed (install it manually somehow or use e.g. nixery.dev/shell/kubectl)

The following will run forever so we can get an interactive shell, otherwise the pod will just terminate. And we don’t have a flag for serviceaccount so we need to use an override or you could add the serviceaccount with `kubectl edit` or do `-o yaml --dry-run=client > some file name`, add it, and then `kubectl apply -f`.
```
k run kubectl --image=nixery.dev/shell/kubectl --overrides='{ "spec": { "serviceAccount": "scaler" } }' -- /bin/bash -c "while true; do sleep 30; done;"
```

### 4. Create a role/rolebinding such as serviceaccount `scaler` can scale up/down the deployment `purple` but cannot do anything else (not delete the deployment, not edit it other than scaling, not view/touch other resources)
	
Unfortunately `kubectl create role` doesn’t let you have multiple API groups so either you need to create two separate ones and merge them manually e.g.
```
k create role scaler --verb=get --resource=deployments --resource-name=purple -o yaml --dry-run=client > scaler-get.yaml

k create role scaler --verb=patch --resource=deployments/scale --resource-name=purple -o yaml --dry-run=client > scaler-patch.yaml
```

Or just create a YAML file:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
 name: scaler
rules:
- apiGroups: ["apps"]
 resources: ["deployments"]
 verbs: ["get"]
 resourceNames: ["purple"]
- apiGroups: ["apps"]
 resources: ["deployments/scale"]
 verbs: ["patch"]
 resourceNames: ["purple"]
```

Create the rolebinding
```
k create rolebinding scaler --serviceaccount=ckad:scaler --role=scaler
```

Now let’s open an interactive shell:
```
k exec -it kubectl -- sh
```

Let’s see what we have permissions to do:
```
kubectl auth can-i --list
```

We should see the following two:
```
deployments.apps                                []                                    [purple]         [get]
deployments.apps/scale                          []                                    [purple]         [patch]
```

Now let’s scale up to 2 replicas:
```
kubectl scale deploy purple --replicas=2
kubectl get deploy purple
```
	
Run `exit` to exit the container.
## Services and Networking (20%)
### 1. Create deployment "yellow" running `nginx:alpine`
```
k create deploy yellow --image=nginx:alpine
```

### 2. Create deployment "orange" running `nginx:alpine`
```
k create deploy orange --image=nginx:alpine
```

### 3. Block access to pods of deployment "yellow"

This is where we involve network policies. We can block all traffic into (ingress) the yellow pods. Unfortunately at this time we can’t use `kubectl` to do this so we need YAML.

`k apply -f` the following as a file.
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
 name: block-to-yellow
spec:
 podSelector:
   matchLabels:
     app: yellow
 policyTypes:
 - Ingress
 ingress: []
```

Now let’s test this.
	
First, get our pods’ IP addresses.

```
k get pods -l 'app in (yellow,orange)' -o wide
```

First let’s see that we can ping orange.
```
kubectl run --rm -it ping --image=alpine --restart=Never -- ping <orange-ip>
```

You should see something like:
```
If you don't see a command prompt, try pressing enter.
64 bytes from 10.47.0.1: seq=1 ttl=64 time=1.301 ms
64 bytes from 10.47.0.1: seq=2 ttl=64 time=1.264 ms
```

Now try with yellow. You shouldn’t see any traffic.
```
kubectl run --rm -it ping --image=alpine --restart=Never -- ping <yellow-ip>
```

Run `ctrl-c` to terminate it.

Allow pods of "orange" to ping pods of "yellow"
Now we need a new network policy that allows ingress traffic from orange to yellow. Create the following YAML and `k apply -f <file>`.
```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-orange-to-yellow
spec:
  podSelector:
    matchLabels:
      app: yellow
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: orange
```

This time we need to enter the orange pod and to ping yellow. We will need to use yellow’s IP. And we should see traffic.
```
k exec -it <orange-pod-name> -- ping <yellow-ip>
```

## Clean Up
Switch back to the `default` namespace or whatever one you were using:
```
kubens default
``` 

Or
```
k config set-context --current --namespace=default
```

And delete the `ckad` namespace:
```
k delete ns ckad
```

Best of luck with your CKAD exam!!
