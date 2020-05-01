---
title:  "CF-for-k8s: Getting Started with Deploying CF-for-k8s locally on Kubernetes"
sortTitle: "cf-for-k8s"
weight: 2
topics:
- kubernetes
tags:
- cf-for-k8s
patterns:
- deployment
---

## Getting Started with CF-for-k8s: Deploying CF-for-k8s developer platform on Kubernetes

### What is cf-for-k8s?

[CF-for-k8s](https://github.com/cloudfoundry/cf-for-k8s.git) is a new implementation of Cloud Foundry on Kubernetes. 

Cloud Foundry is an open source, multi-cloud application platform as a service governed by the Cloud Foundry Foundation, a 501 organization.

Cloud Foundry on Kubernetes is a very powerful tool for operators and developers. If you are a developer with CF you only concentrate on writting and delivering code. When finished writting code a dev enters `cf push` into the command line and their app will be deployed and immediately receive an endpoint using most popular languages. 

CF takes care of the depenedencies and can be configured to bind to a db or services, and connects to a marketplace. Operators don't have to worry about wiring the backend, multitenancy is simple to configure, scaling is one command, and built to be secure. There are many more features to Cloud Foundry. 

CF for K8s adds a higher level of abstraction and removes the sharp learning curve for teams to adopt Kubernetes,  don't build a platform use CF-for-k8s. Kubernetes also adds new possibilities to CF it opens up the massive Kubernetes ecosystem, it installs in minutes, and it's light weight.      

In this guide you'll deploy Cloud Foundry on Kubernetes locally.

### Before you begin

> You will need a few tools before begining, many of you might already have, once set up installation takes 10 mins or less.
- You will need `kubectl` to interact with your cluster [kubectl install instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
    * on mac 
        ```
        brew install kubectl
        # verify install 
        kubectl version --client
        ```
- KinD (Kubernetes in Docker) to instantiate your local cluster [Kind install instructions](https://kind.sigs.k8s.io/docs/user/quick-start/) 
    * on mac 
        ```
        brew install kind
        # verify install 
        kind version
        ```

- [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) (v6.50+) to talk to Cloud Foundry
    * on mac 
        ```
        brew install cloudfoundry/tap/cf-cli
        # verify install 
        cf version
        ```
- [Bosh CLI](https://bosh.io/docs/cli-v2-install/) the `./hack/generate-values.sh` script will use the Bosh CLI to generate certificates, keys, and passwords in the file `./cf-install-values.yml`
    * on mac
        ```
        brew install cloudfoundry/tap/bosh-cli
        ```

- [kapp](https://k14s.io/#install) (v0.21.0+) will aid you to deploy cf-for-k8s to your cluster
    * on mac 
        ```
        brew tap k14s/tap
        brew install ytt kapp
        kapp --version
        ```

- [`ytt`](https://k14s.io/#install) (v0.26.0+) will help create templates to deploy cf-for-k8s
    * on mac you should have this installed from the above command, to verify:
        ```
        ytt version
        ```
### Clone the CF for K8s repo

Clone the repo to preffered location and cd into it.
```
git clone https://github.com/cloudfoundry/cf-for-k8s.git && cd cf-for-k8s
```        

### Setup your local k8s cluster with KinD  

Create your cluster using the the config yaml from the repo above
```
kind create cluster --config=./deploy/kind/cluster.yml
```
Point your kubeconfig to the cluster you created above
```
kubectl cluster-info --context kind-kind
```

### Generate the yaml used to deploy CF for k8s

In this script you use `vcap.me` as your CF domain with the flag `-d`, if not installing locally you would use the domain you wanted for your Cloud Foundry instance.

The `./hack/generate-values.sh` script will generate certificates, keys, passwords, and configuration needed to deploy into `./cf-install-values.yml'
```
./hack/generate-values.sh -d vcap.me > ./cf-install-values.yml
```

### Install a metrics-server
Metrics Server is a scalable source of container resource metrics for Kubernetes built-in autoscaling pipelines, making it easier to debug autoscaling pipelines.
```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.3.6/components.yaml
```

### Time to Deploy CF for k8s 

Deploy CF for k8s using the `./cf-install-values.yml` file created above. 

Also, to successfully install locally you remove superflous requirements using the template `config-optional/remove-resource-requirements.yml`.

Finally, we would like to open up the nodeport in our local k8s cluster for our ingress gateway with `config-optional/remove-ingressgateway-service.yml`.
```
kapp deploy -a cf -f <(ytt -f config -f ./cf-install-values.yml -f ./config-optional/remove-resource-requirements.yml -f ./config-optional/remove-ingressgateway-service.yml)
```

---

### Validate the deployment


Target your CF CLI to point to the new CF instance
```
cf api --skip-ssl-validation https://api.vcap.me
```

Set the CF_ADMIN_PASSWORD environment variable to the CF administrative password, stored in the cf_admin_password key in the configuration-values/deployment-values.yml file:
```
CF_ADMIN_PASSWORD="$(bosh interpolate ./cf-install-values.yml --path /cf_admin_password)"
```

Log into the installation as the admin user
```
cf auth admin "$CF_ADMIN_PASSWORD"
```

```
cf enable-feature-flag diego_docker
```

A powerful feature provided by CF is multitennacy, where you can create a space for a team, an app or whatever your workflow requires. 

Create and target an organization and space
```
cf create-org test-org
cf create-space -o test-org test-space
cf target -o test-org -s test-space
```

At last you can push the included sample `test-node-app`
```
cf push test-node-app -p ./tests/smoke/assets/test-node-app
```
Or you can push any app you wish just cd into the directory and push the app with the following command
```
cf push APP-NAME
```



### Delete the cf-for-k8s deployment
You can delete the cf-for-k8s deployment from your cluster by running the following command.

Assuming that you ran `bin/install.sh...` or `kapp deploy -a cf...`
```
kapp delete -a cf
```

to delete the KinD cluster
```
kind delete cluster
```
