---
date: '2021-08-16'
lastmod: '2021-08-16'
parent: Carvel
description: This guide will walk you through the basics of ytt and help you get started with it.
patterns:
- Deployment
tags:
- ytt
- Carvel
team:
- Leigh Capili
- Tiffany Jernigan
title: Getting Started with ytt
topics:
- Kubernetes
oldPath: "/content/guides/kubernetes/ytt-gs.md"
aliases:
- "/guides/kubernetes/ytt-gs"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

[ytt](https://carvel.dev/ytt/) (part of the open source [Carvel](https://carvel.dev) suite) is a tool that can templatize, combine, and patch any YAML content.
ytt understands the structure of YAML. 
This eliminates the need to count spaces or escape quotes in traditional text-based templating.
ytt uses a sandboxed, Pythonic language, embedded within YAML comments, to provide a natural, programming extension for YAML.

ytt can simplify and variate any YAML content, including Kubernetes configuration, Concourse pipelines, Docker Compose files, and more.

This guide will cover the basics of using ytt to configure Kubernetes apps.
## Prerequisites
Before you get started you will need to do the following:
* Create a Kubernetes cluster
* Install [`kubectl`](https://kubernetes.io/docs/tasks/tools/) locally
* Install the `ytt` CLI via one of these options:
  * [Homebrew](https://github.com/vmware-tanzu/homebrew-carvel)
  ```
  brew tap vmware-tanzu/carvel
  brew install ytt
  ```
  * [GitHub releases](https://github.com/vmware-tanzu/carvel-ytt/releases/tag/v0.36.0) -- move it to `/usr/local/bin` or add it to your `$PATH` and run `chmod +x` to make it executable

{{% callout %}}
**Note**: This guide uses ytt v0.36.0, and we suggest you download and install the same version to ensure the best experience as you follow through this guide.
{{% /callout %}}


## Clone the Examples Repo
Now that we have ytt installed, let’s clone the main ytt repo so we can look at some examples:
```shell
git clone https://github.com/vmware-tanzu/carvel-ytt
cd carvel-ytt/examples
```


## Usage
You can execute ytt by running the command on individual files or a directory of files.
ytt will build the configuration and write it to STDOUT by default.
Run the following command to see an example with a plain YAML file.

```shell
ytt -f playground/basics/example-plain-yaml
```

We can use the interactive playground for this YAML at the following link. It will show all files for the example and you can then run them and see the output you’d see with running the ytt CLI. Going forward you can choose to use the ytt CLI or the playground for the majority of the examples. 
You can see this file in the playground here:
https://carvel.dev/ytt/#example:example-plain-yaml 

Using the `--output pos` flag with the CLI is also a great debugging tool -- It shows you where each change comes from!
You can also choose to write out to separate YAML files using the `--output-files` flag.


## Directives and Annotations
ytt uses YAML comments for ytt annotations and ytt directives.
Annotations, such as `#@data/values`, do not have a space and attach metadata to a YAML node.

ytt directives, on the other hand, have a space such as `#@ if` and `#@ load` and are used to direct ytt to execute the arguments after it. 

Additionally, instead of using just `#` for standard comments, they should be `#!` to avoid “linting” errors.

## Types and Control Flow
Within the comments, ytt uses a slightly modified version of the [Starlark](https://github.com/google/starlark-go/blob/master/doc/spec.md) programming language which is a dialect of Python.

When we need to process data, declaring data using ytt directives instead of plain YAML nodes can be helpful. ytt will convert these values to their respective YAML types.
For a quick example of all of the types and how they output to YAML, see [this example](https://carvel.dev/ytt/#example:example-datatypes) on the ytt playground.

The [ytt language reference](https://carvel.dev/ytt/docs/latest/lang/) shows the standard methods you can use on strings and collections. And it details the if statement, for-loop, and function control-flow structures.

One example of using an if statement is as follows:
```
#@ if True:
test1: 123
#@ else:
test2: 124
#@ end
```


And here is a for loop:
```
array:
#@ for i in range(0,3):
- #@ i
- #@ i+1
#@ end
```
## Variables, Functions, and Fragments
In this example variables are used to store the app name and version in a single place.
A function is then used to define a repeatable set of labels using a [YAML Fragment](https://carvel.dev/ytt/docs/latest/lang-ref-yaml-fragment/) with an optional parameter to include the version number.

Variable definition:
```yaml
#@ app_name = "prometheus-operator"
#@ version = "v0.39.0"
```

Function with YAML Fragment in it:
```yaml
#@ def labels(with_version=False):
  app.kubernetes.io/component: controller
  app.kubernetes.io/name: #@ app_name
  #@ if with_version:
  app.kubernetes.io/version: #@ version
  #@ end
#@ end
```

ytt comments are then used to calculate Starlark expressions to insert and concatenate this name, label, and version information into YAML nodes in multiple places like the metadata, labelSelector, and container image tag.

```yaml
#@ version
#@ labels(with_version=True)
#@ app_name + "-service"
```

Look at the example file and run it in interactive playground:
https://carvel.dev/ytt/#example:example-extract-yaml-fragments 

Or run it locally:
```shell
ytt -f playground/getting-started/example-extract-yaml-fragments/config.yml
```

## Load
We saw `#@ load` when we were first looking at directives.
So what does `load` do? 
Basically it is used to load functions from other libraries. These could be [built-in modules](https://carvel.dev/ytt/docs/latest/lang-ref-ytt/) or ones you define in another file.
```
#@ load("@ytt:template", "template")
#@ load("@ytt:data", "data")


#@ load("helpers.lib.yml", "mod")
```

## Overlays
ytt has a feature and module called [overlay](https://carvel.dev/ytt/docs/latest/lang-ref-ytt-overlay/#overview) which allows you to patch YAML structures. 
By patching, you could use it for matching, inserting, replacing or removing items, etc. 
They are used to update YAML nodes which don’t have any externally exposed ways to configure data.
Overlays are applied in the order provided. 

To use an overlay, you need to load the built-in overlay function:
```shell
#@ load("@ytt:overlay", "overlay")
```

In the `playground/basics/example-overlay-files` directory we have four files. 
Two are clipped Kubernetes YAML files and the other two have ytt functionality. 
We can see that both ops files are using the above load directive at the beginning. 
Then there is an overlay action to do a match so the operations are only performed on specific data. For these it’s checking the name of the resource e.g.
```
#@overlay/match by=overlay.subset({"metadata":{"name":"example-ingress1"}})
```

The other parts either are removing items or adding lines if they’re missing.
```yaml
#@overlay/remove
ingress.kubernetes.io/rewrite-target:

#@overlay/match missing_ok=True
nginx.ingress.kubernetes.io/enable-access-log: "true"
```

Look at files and run in the interactive playground:
https://carvel.dev/ytt/#example:example-overlay-files 

Or run it locally:
```shell
ytt -f playground/basics/example-overlay-files
```

## Data Values and Schema
The data module, `#@ load("@ytt:data", "data")`, can be used to give users a configuration interface. It allows you to pass in files with a schema module, `#@data/values-schema`, or via command line. To see all of the options run `ytt -h` to see flags.

Note: If you are using an old version of ytt, the following ytt commands will fail.

The `k8s-add-global-label/add-label.yml` file uses the annotation `​​#@ data.values.build_num` along with an overlay to check if it’s missing. If it’s missing it will be filled in with the line below.

```
#@ load("@ytt:overlay", "overlay")
#@ load("@ytt:data", "data")

#@overlay/match by=overlay.all,expects="1+"
---
metadata:
  #@overlay/match missing_ok=True
  labels:
    #@overlay/match missing_ok=True
    build: #@ data.values.build_num
```

The first run here will use build number from k8s-add-global-label/values.yml. There is a warning since the directory has a text file (it just contains the expected output). You could avoid this by passing in the three YAML files separately using the `-f` flag multiple times. 
```
#@data/values-schema
---
build_num: unknown
```

Run:
```shell
# uses defaults
ytt -f k8s-add-global-label
```

And the second run of it has the build number passed via a flag which will override it with “123”. 
```
# overrides the default
ytt -f k8s-add-global-label -v build_num=123

```

## Deploying to Kubernetes
ytt is purely a configuration tool. As you saw, ytt just outputs YAML files, but doesn’t apply or run them.
Let’s use these in conjunction with Kubernetes.
In order to deploy our applications to Kubernetes, we need to use tools like kubectl or [kapp (also part of the Carvel tool suite)](https://tanzu.vmware.com/developer/guides/kubernetes/kapp-gs/) with the output from ytt. 

We have seen a bunch of different things we can do with ytt, and the files in `playground/getting-started/example-overlay-on-templates` put a lot of them together. There is a README that explains everything that is happening here. You can also look at it on the playground:
https://carvel.dev/ytt/#example:example-overlay-on-templates 

We can take a look at the output which is YAML for a deployment and service for the [Prometheus](https://prometheus.io/) operator in the above web page or via ytt:

```
ytt -f playground/getting-started/example-overlay-on-templates
```

Now let’s deploy it by passing it into `kubectl`:
```shell
kubectl create namespace prometheus-system
ytt -f playground/getting-started/example-overlay-on-templates | kubectl apply -f-
```

We can then check if the deployment and service are running in the `prometheus-system` namespace.
```
kubectl -n prometheus-system get deployment prometheus-operator
kubectl -n prometheus-system get service prometheus-operator-service
```

To clean up you can just run the same command, but with `delete` instead of `apply`:
```shell
kubectl delete namespace prometheus-system
ytt -f playground/getting-started/example-extract-yaml-fragments/config.yml | kubectl delete -f-
```

### Variants & Environments
Finally, a true superpower of ytt is that it flexibly expresses configuration without restricting what modifications can be made later on.

We can always append additional directories or individual files of ytt programs to add or override data-values and overlay any portion of our configuration.

This means that we can use a small number of base configurations for many environments where the variations for each environment are stored in purposeful files or directories that only contain the differences necessary.

## Learn More
One of the best ways to learn more about using ytt is to try the different examples in the ytt interactive playground at the bottom of https://carvel.dev/ytt. The Getting Started examples have full blown explanations of the different files and what is happening.