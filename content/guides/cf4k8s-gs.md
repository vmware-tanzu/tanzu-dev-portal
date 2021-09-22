---
date: '2020-04-29'
description: Learn about the tools required to use Cloud Foundry on Kubernetes with
  the CF-for-k8s platform to add a higher level of abstraction.
lastmod: '2021-05-05'
linkTitle: Cloud Foundry for Kubernetes
patterns:
- Deployment
tags:
- cf-for-k8s
- Kubernetes
- Cloud Foundry
team:
- Ivan Tarin
title: Getting Started with Cloud Foundry for Kubernetes
weight: 4
oldPath: "/content/guides/kubernetes/cf4k8s-gs.md"
aliases:
- "/guides/kubernetes/cf4k8s-gs"
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
---

{{% callout %}}
Updated October 2020: CF CLI version 7+ and 6 CPU availability now required, removed metrics server install, new values added to the install yaml eliminate steps from before, and new Kubernetes rendering file. Overall this simplifies installation from previous iterations.
{{% /callout %}}


[CF-for-k8s](https://github.com/cloudfoundry/cf-for-k8s.git) brings Cloud Foundry to Kubernetes. 

Cloud Foundry is an open-source, multi-cloud application platform as a service governed by the Cloud Foundry Foundation, a 501 organization.

Using Cloud Foundry developers only have to focus on writing and delivering code as CF takes care of the rest. Developers enter `cf push` into the command line and their app will be deployed immediately receiving an endpoint. The CF platform will take care of containerizing the source code into a working app with the required dependencies, can be configured to bind to a database, connect to a market place and much more.

The cf-for-k8s platform adds a higher level of abstraction to Kubernetes by removing the sharp learning curve required for teams, developers don't have to know Kubernetes they only have to `cf push`. Kubernetes adds new possibilities to Cloud Foundry opening up the massive Kubernetes ecosystem.

In this guide you'll deploy Cloud Foundry on Kubernetes locally.

## Before you begin

### Machine Requirements

Currently cf-for-k8s supports Kubernetes 1.15.x or 1.16.x, the config yaml file we are using to make our kind cluster will make a cluster with the following requirements, see that your computer can handle them:
- have a minimum of 1 node
- have a minimum of 6 CPU, 8GB memory per node

### Tools required

You will need a few tools before beginning and once set up installation usually takes 10 minutes or less.

**CF CLI version requirement changed to version 7+**
- [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) (version 7+) to talk to Cloud Foundry
    * on mac 
        ```
        brew install cloudfoundry/tap/cf-cli
        # verify install 
        cf version
        ```

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

- [ytt](https://k14s.io/#install) (v0.26.0+) will help create templates to deploy cf-for-k8s
    * on mac you should have this installed from the above command, to verify:
        ```
        ytt version
        ```
- [DockerHub](https://hub.docker.com/) is the image registry used in this guide please make an account if you don't have one they are free and quickly made.

## Clone the CF for K8s repo

Clone the repo to preferred location and cd into it.
```
git clone https://github.com/cloudfoundry/cf-for-k8s.git && cd cf-for-k8s
```        

## Setup your local k8s cluster with KinD  

Create your cluster using the config yaml from the cf-for-k8s repo obtained above.
```
kind create cluster --config=./deploy/kind/cluster.yml
```
Point your kubeconfig to your new cluster.
```
kubectl cluster-info --context kind-kind
```

## Generate the yaml used to deploy CF for k8s

In this script you use `vcap.me` as your CF domain with the flag `-d`, this way you can avoid configuring DNS for a domain.

The `./hack/generate-values.sh` script will generate certificates, keys, passwords, and configuration needed to deploy into `./cf-install-values.yml'. 
```
./hack/generate-values.sh -d vcap.me > ./cf-install-values.yml
```
Append the app_registry credentials to your DockerHub registry to the bottom of the `./cf-install-values.yml` replacing with your information. You can copy/paste  or use the following command.

{{% callout %}}
**Note**: The repeated username is a requirement for DockerHub, this setting changes with some container registries. Also, don't forget to add the quotes.
{{% /callout %}}


{{% callout %}}
**Note**: To use another container registry follow the [instructions under step 3](https://github.com/cloudfoundry/cf-for-k8s/blob/master/docs/deploy.md).
{{% /callout %}}


```
cat >> cf-install-values.yml << EOL
app_registry:
  hostname: https://index.docker.io/v1/
  repository_prefix: "<DockerHub-username>"
  username: "<DockerHub-username>"
  password: "<DockerHub-password>"
EOL
```

There are a few more lines to add to your cf-install-values.yml, like adding a metrics server because KinD doesn't come with one.

```
cat >> cf-install-values.yml << EOL
add_metrics_server_components: true
enable_automount_service_account_token: true
metrics_server_prefer_internal_kubelet_address: true
remove_resource_requirements: true
use_first_party_jwt_tokens: true

load_balancer:
  enable: false
EOL
```

Now, use cf-install-values.yml to render the final Kubernetes template to raw Kubernetes configuration.

```
ytt -f config -f ./cf-install-values.yml > ./cf-for-k8s-rendered.yml
```

## Deploy CF for k8s 

You are ready to deploy cf-for-k8s using the `./cf-for-k8s-rendered.yml` file created above. Once you deploy it should take around 10 minutes to finish. 

{{% callout %}}
**Note**: The deployment has a timer and will exit with a timeout error if it takes too long. Assuming all previous steps were followed correctly enter the deployment command again to finish if it exits early.
{{% /callout %}}


```
kapp deploy -a cf -f ./cf-for-k8s-rendered.yml -y
```

## Validate the deployment

Target your CF CLI to point to the new CF instance.
```
cf api --skip-ssl-validation https://api.vcap.me
```

Set the CF_ADMIN_PASSWORD environment variable to the CF administrative password, stored in the cf_admin_password key in the configuration-values/deployment-values.yml file:
```
CF_ADMIN_PASSWORD="$(bosh interpolate ./cf-install-values.yml --path /cf_admin_password)"
```

Log into the installation as the admin user.
```
cf auth admin "$CF_ADMIN_PASSWORD"
```

Enable Docker
```
cf enable-feature-flag diego_docker
```

A powerful feature provided by CF is multi-tenancy, where you can create a space for a team, an app or whatever your workflow requires. 

Create and target an organization and space.
```
cf create-org test-org
cf create-space -o test-org test-space
cf target -o test-org -s test-space
```

## Deploy an application with `cf push`

At last you can push the included sample `test-node-app`.
```
cf push test-node-app -p ./tests/smoke/assets/test-node-app
```

Or you can push any app you wish just cd into the directory and push the app with the following command.
```
cf push APP-NAME
```

Once your app stages you can find it in Cloud Foundry with this command.
```
cf apps
```
The output in the terminal should look something as follows.
```
Getting apps in org test-org / space test-space as admin...
OK

name            requested state   instances   memory   disk   urls
test-node-app   started           1/1         1G       1G     test-node-app.vcap.me
```

To see the pods that have applications on your Cloud Foundry instance look in the `cf-workloads` namespace.
```
kubectl get pods -n cf-workloads
```

You can now play with cf for k8s and deploy other apps and observe how it affects the Kubernetes infrastructure. Try other cf commands like `cf delete test-node-app` and see what changes, enjoy you new cf for k8s instance.

## Delete the cf-for-k8s deployment

You can delete the cf-for-k8s deployment from your cluster by running the following command.
```
kapp delete -a cf
```

## Delete your Kind cluster

To delete your KinD cluster.
```
kind delete cluster
```

## Next Steps

Learn more about Cloud Foundry with the links below:

- [cf-for-k8s GitHub](https://github.com/cloudfoundry/cf-for-k8s.git)
- [cloudfoundry.org](https://www.cloudfoundry.org/)
- [Online CF Tutorial](https://katacoda.com/cloudfoundry-tutorials/scenarios/trycf)