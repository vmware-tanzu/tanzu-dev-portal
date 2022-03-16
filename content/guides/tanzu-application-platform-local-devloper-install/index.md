---
title: "TAP on Your Lap: Running VMware Tanzu Application Platform Locally on Your Laptop "
description: TODO  
date: 2022-03-15
lastmod: 2022-03-15
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
tags:
- Tanzu
- Tanzu Application Platform
tanzu:
  label: tap
  featured: false
  featuredweight: 3
  gettingstarted: true
  gettingstartedweight: 3
# Author(s)
team:
- Ben Wilcock
---

## Introduction 
 
The installation of VMware Tanzu Application Platform (TAP for short) is possibly more involved than some other development tools you’re used to. That’s because TAP is DevOps in a box, with all the functionality you’d expect. Installed on the public cloud or in a data center, TAP brings a fully-featured development platform that can serve the needs of hundreds of developers and operators at the same time. Stick with this tutorial and you’ll gain access to a modern software supply chain, effortless Kubernetes application scheduling, and even serverless computing. Let’s begin! 

{{% callout %}}
These steps have been verified against version 1.0.1 of Tanzu Application platform, the most current at the time of writing (March 2022). The official documentation for Tanzu Application Platform can be found [here](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-overview.html). 
{{% /callout %}}

## Before You Start 
 
There are a few things you must have ready before you begin your TAP installation: 

* **Hardware**: A PC or Laptop with a modern Intel i7 or AMD Ryzen 7 processor (or better) with at least 8 threads, 16GB of RAM, and 40 GB of disk space. 
* **Operating System**: Windows 10, MacOS (_coming soon_), or Ubuntu 20.04 LTS (_coming soon_) and full administrator access. 
* **Software**: [Minikube]() (a laptop friendly version of Kubernetes which is supported by TAP). [Kubectl](https://kubernetes.io/docs/tasks/tools/) (the command-line tool used to work with Kubernetes). (Windows only ) Hyper-V (The hypervisor we tested with Minikube, which [can be added as a Windows feature](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)). 
* **Accounts**: You’ll need the username and password for your [Docker Hub](https://hub.docker.com/) account and the username and password for your account on the [Tanzu Network](https://network.pivotal.io) (registration is free). 
* **Time**: About 1 hour (but this can vary depending on your bandwidth, processor, RAM, etc.). 
* **Connectivity**: A stable broadband connection capable of at least 30 Mb/s download and 10 Mb/s upload. 

## Stage 1: Installing the Tanzu CLI Tool v0.11.1.

This process installs the Tanzu CLI command-line tool that you’ll use to install TAP and interact with it. This guide assumes you have not done this before. If you have installed this version of the tanzu cli before, you can skip this step. The instructions for replacing older versions are in the [TAP documentation](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-install-tanzu-cli.html).

First, download the Tanzu CLI from the [Tanzu Application Platform page](https://network.pivotal.io/products/tanzu-application-platform/) on the Tanzu Network. Choose `tanzu-cli-v0.11.1` and then choose the download link for the `tanzu-framework-bundle` binary that matches your operating system (either -windows, -mac, or -linux).

![The Tanzu Application Platform download page](images/screenshots/image1.png "Download the proper package for your OS")

{{% callout %}}
**Note**: You will be asked to agree to the Tanzu Application Platform EULA (the VMware End User License Agreement) in order to download the Tanzu CLI application.
{{% /callout %}}

1. Open a new PowerShell window with administrator privileges, or on macOS or Ubuntu, begin a new Terminal window.  

{{< tabpane >}}
{{< tab header="Windows" >}}

`Click the Windows Start Menu > Right-click Terminal > More > Run as administrator`

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

2. Next, create a new folder for the Tanzu CLI tool.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Create a new home for the Tanzu CLI in "Program Files"
mkdir "C:\Program Files\tanzu"
```

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

3. Add the location of this new folder to your System’s PATH environment variable as follows:

{{< tabpane >}}
{{< tab header="Windows" >}}

1.  Use Windows Search to search for `environment`. 
2.  Select **Edit the system environment variables** to open the System Properties dialogue. 
3.  Click the **Environment Variables** button to open the user and system environment variables dialogue box.
4.  Under the System variables list, find the entry for `PATH` and double click it
5.  Add a new entry for `C:\Program Files\tanzu\tanzu.exe` as shown in the image below.
6.  Click `OK`.

    ![The front page of the Tanzu Network](images/screenshots/image2.png "Click **Create** in the left-hand navigation bar")
    
    _Add an environment variable to your system’s PATH for the directory where you installed the Tanzu CLI tool._

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

3. Next, back in your PowerShell or Terminal window, extract `tanzu` cli tool, install it, and install the plug-ins that it requires in order to work with TAP.  Follow these steps (assuming the downloaded file is in your `Downloads` folder):

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Move to the folder containing the file you downloaded.
cd "C:\Users\$env:USERNAME\Downloads"

# Extract the zip
Expand-Archive .\tanzu-framework-windows-amd64.zip
 
# Move to the extracted Tanzu CLI directory
cd tanzu-framework-windows-amd64

# Copy the Tanzu CLI tool to Program Files
cp "cli\core\v0.11.1\tanzu-core-windows_amd64.exe" "C:\Program Files\tanzu\tanzu.exe"

# Install the tanzu cli plugins needed for TAP
$Env:TANZU_CLI_NO_INIT = "true"
tanzu plugin install --local cli all
```

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

4. Check if the Tanzu CLI and the plug-ins are installed correctly by checking the output from the following commands:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Expect version: v0.11.1
tanzu version 

# Expect a list of installed plugins
tanzu plugin list 
```
{{% callout %}}
Check that you have the package, secret, apps, services, and accelerator plugins available to you.
{{% /callout %}}

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

## Stage 2: Running Minikube

1. Start Minikube with 8 CPUs, and version 1.22 of Kubernetes using the following command:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Start Minikube
minikube start --cpus='8' --memory='12g' --kubernetes-version='1.22.6' 
```
{{% callout %}}
On Windows, we used Hyper-V as the VM driver in our testing. To discover your VM driver, after you have run `minikube start` use the command ‘minikube profile list’.
{{% /callout %}}

{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

If you have existing applications running on Minikube, it may be best to define a new profile for your TAP install using `–p <profile-name>`. Remember to give the same profile name for each Minikube command.

2. Next, find the IP address for the Minikube cluster and make a note of it:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Get the minikube IP address
minikube ip
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

3. Next, add a couple of network hostname entries to your operating systems hosts file using a combination of the IP address for Minikube and the web addresses we will use locally once TAP is fully installed:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Open the hosts in Notepad (as Admin).
Start-Process notepad -Verb runas "c:\Windows\System32\Drivers\etc\hosts"

# Manually add a new line to the hosts file as follows...
<your-minikube-ip-address> tap-gui.made-up-name.net tanzu-java-web-app.default.apps.made-up-name.net
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

    When working locally like this, workloads that you deploy to TAP will need to have their name added to this file. This is necessary for your calls to be routed properly in this kind of local environment.

4. Finally, open the ‘Minikube Tunnel.’ This allows Kubernetes services of type ‘LoadBalancer’ to be addressable from your PC. You will need this tunnel running whenever you want to access your developer workloads or the TAP GUI.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
minikube tunnel
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

Leave Minikube tunnel running in the current PowerShell or Terminal and open a new Admin PowerShell or Terminal for the next stage.

## Stage 3: Installing Tanzu Cluster Essentials onto Minikube

The Tanzu CLI acts as an agent. It passes your instructions to the TAP system so they can be carried out inside of Kubernetes. For this to work, the agent needs a command broker (in the form of a [`kapp-controller`](https://carvel.dev/kapp-controller/)) and a method for managing the generation of platform secrets (in the form of a [`secretgen-controller`](https://github.com/vmware-tanzu/carvel-secretgen-controller)). 

The `kapp-controller` and `secretgen-controller` both form part of Cluster Essentials for VMware Tanzu which you will install next. For Windows, this involves issuing some kubectl commands. For macOS and Ubuntu, there is a dedicated installer.

1. Set up the cluster with the necessary packages.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# First, create the required Kubernetes namespaces.
kubectl create namespace tanzu-cluster-essentials
kubectl create namespace kapp-controller
kubectl create namespace secretgen-controller
# Next, apply the YAML configurations for the required apps:
kubectl apply -f https://github.com/vmware-tanzu/carvel-kapp-controller/releases/download/v0.30.0/release.yml -n kapp-controller

kubectl apply -f https://github.com/vmware-tanzu/carvel-secretgen-controller/releases/download/v0.7.1/release.yml -n secretgen-controller
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

2. Wait until the `kapp-controller` and `secretgen-controller` pods reach the `running` state before continuing to the next stage. You can view their current state with this command:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Ensure that kapp-controller and secretgen-controller are ‘running’ 
kubectl get pods --all-namespaces 
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

## Stage 4: Installing Tanzu Application Platform onto Minikube

1. You are now ready to install TAP onto your Minikube cluster. First, to make the process much easier, create some environment variables in the shell you’ll be using for the rest of the installation.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Tanzu Cluster Essentials & TAP Environment Variables
$Env:TAP_VERSION = "1.0.2"
$Env:TAP_NAMESPACE = "tap-install"
 
# Installation registry (holds the TAP system images)
$Env:INSTALL_REGISTRY_HOSTNAME = "registry.tanzu.vmware.com"
$Env:INSTALL_REGISTRY_USERNAME = "" # < insert tanzu network username
$Env:INSTALL_REGISTRY_PASSWORD = "" # < insert tanzu network password

# Developer’s ‘push able’ container registry
$Env:DOCKER_SERVER = "https://index.docker.io/v1/"
$Env:DOCKER_USERNAME = "" # < insert docker username
$Env:DOCKER_PASSWORD = "" # < insert docker password
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

2. Next, create a Kubernetes namespace for the TAP installation.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
kubectl create ns $env:TAP_NAMESPACE 
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

3. Then, add a secret needed to pull container images from the Tanzu Network to the Tanzu CLI.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
tanzu secret registry add tap-registry `
  --username $env:INSTALL_REGISTRY_USERNAME `
  --password $env:INSTALL_REGISTRY_PASSWORD `
  --server $env:INSTALL_REGISTRY_HOSTNAME `
  --namespace $env:TAP_NAMESPACE `
  --export-to-all-namespaces `
  --yes
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

4. Now, add a `package repository` record for the TAP container registry to the Tanzu CLI:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
tanzu package repository add tanzu-tap-repository `
  --url $env:INSTALL_REGISTRY_HOSTNAME/tanzu-application-platform/tap-packages:$env:TAP_VERSION `
  --namespace $env:TAP_NAMESPACE
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

5. The above step will take a few minutes to complete. When finished, the final status should read ‘reconcile succeeded.’ If it gets interrupted for any reason it has failed. You can check the status of the process at any time with the following commands:

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
# Check for STATUS: “Reconcile succeeded”
tanzu package repository get tanzu-tap-repository --namespace $env:TAP_NAMESPACE 

# Check for a big list of ready to use packages
tanzu package available list --namespace $env:TAP_NAMESPACE 
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

6. Now that all the TAP packages, registries, and secrets have been added to the cluster we are almost ready to install TAP. Installing TAP requires a set of configuration instructions. These configuration instructions take the form of a YAML file. The file has setup instructions required by various components in the TAP system and must be customized to fit your setup. To make this easier for you, a template file called `template-tap-values.yml` file can be downloaded from GitHub to your local working directory and customized using your favorite text editor or IDE.

{{< tabpane >}}
{{< tab header="Windows" >}}

```sh
curl.exe -o tap-values.yml https://raw.githubusercontent.com/benwilcock/tanzu-application-platform-scripts/main/minikube-win/template-tap-values.yml
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

7. Open the downloaded tap-values.yml file in your editor and manually replace all the capitalized placeholders in the file with the same information you used for your environment variables earlier.

{{< tabpane >}}
{{< tab header="Windows" >}}

For example: 
```
In the downloaded `tap-values.yml` file, replace the placeholder DOCKER_USERNAME with the same details you used earlier for the environment variable $Env:DOCKER_USERNAME

Do this for each of the placeholders in the tap-values.yml file.
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

{{% callout %}}
Take care with the above step. Mistakes made here can be hard to rectify and could prevent TAP from working properly or at all.
{{% /callout %}}

8. With your `tap-values.yml` file fully edited, you are ready to install TAP into Minikube. This process can take a long time (30 minutes or more) and will needs many gigabytes of internet bandwidth. If you share a home network with others, you may prefer to do this off-peak so that you don’t disrupt other users on the same network.

    Install TAP onto Minikube with the following command. Notice that the location of the YAML file that you edited earlier step is required by the –f argument:

{{< tabpane >}}
{{< tab header="Windows" >}}
```
tanzu package install tap -p tap.tanzu.vmware.com -v $env:TAP_VERSION --values-file tap-values.yml --namespace $env:TAP_NAMESPACE
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

{{% callout %}}
**Warning: Patience Required!**
Installing Tanzu Application Platform can take 30 minutes or more. TAP is essentially an integrated collection of 40+ microservice components. It takes lots of time, significant CPU, memory, and network bandwidth to fully stand up the system. 
{{% /callout %}}

8. You can check the installation’s progress at any time by asking the Tanzu CLI for the status of the TAP package installation:

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
tanzu package installed list -A
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

Eventually, all the TAP packages should reach the status “Reconcile Succeeded”, but this is dependent on the Minikube Tunnel being active as described in Stage 1. 

Once fully reconciled, you can pause for a moment to check out the TAP user interface. In your web browser open the URL [http:// tap-gui.made-up-name.net](http://tap-gui.made-up-name.net). If minikube tunnel is active, and your hosts file has been edited as described in Step 1, you should see the TAP server’s user interface. 

_Tanzu Application Platform is designed to make everyone's life easier. For example, check out the ‘Accelerators’ dashboard which allows developers in your organization to easily start and customize coding projects using templates you collectively own._

## Step 5: Creating A Developer Workspace

Developers using TAP need a Kubernetes workspace where they can work in isolation from the rest of the TAP system. This developer namespace also needs access to a container registry where it can store the application containers (docker images) built by TAP’s on-board build system.  The developer namespace also needs certain roles and privileges to integrate with the TAP system.

1. Add your developer namespace, registry, roles, and privileges as follows:

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
$Env:TAP_DEV_NAMESPACE = "default"

# Create a namespace for the developer to work in
kubectl create ns $env:TAP_DEV_NAMESPACE

# Add the secret for the BUILD Container Registry
tanzu secret registry add registry-credentials `
  --server $env:DOCKER_SERVER `
  --username $env:DOCKER_USERNAME `
  --password $env:DOCKER_PASSWORD `
  --namespace $env:TAP_DEV_NAMESPACE

# Obtain the service accounts file
curl.exe -o serviceaccounts.yml https://raw.githubusercontent.com/benwilcock/tanzu-application-platform-scripts/main/minikube-win/serviceaccounts.yml

# Add the necessary RBAC Roles, Accounts, Bindings etc...
kubectl -n $env:TAP_DEV_NAMESPACE apply -f "serviceaccounts.yml"
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

## Step 6: Using TAP to Run Application Workloads

TAP uses the term ‘workload’ to describe applications running in containers on TAP. Now that TAP is installed, building and running your code on the platform requires only one simple instruction.

1. Add your first workload to TAP with the following command:

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
tanzu apps workload create tanzu-java-web-app `
  --git-repo https://github.com/sample-accelerators/tanzu-java-web-app `
  --git-branch main `
  --type web `
  --label app.kubernetes.io/part-of=tanzu-java-web-app `
  --label tanzu.app.live.view=true `
  --label tanzu.app.live.view.application.name=tanzu-java-web-app `
  --namespace $env:TAP_DEV_NAMESPACE `
  --yes
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

TAP does not need an application binary or a container image in order to build and deploy applications. TAP features an integrated ‘build-service’ — part of what is called a supply-chain in TAP parlance. TAP only needs the URL of the source code repository and a branch name of the code you wish to run (in this case a Java application written in Spring, but other languages are supported). If this code ever changes, the application will be rebuilt and redeployed automatically. 

Second, the workload type of ‘web’ allows TAP to follow some simple conventions, for example, assigning the application a HTTP route in its built-in ingress system.

2. Check the progress of the workload with the following command. It will take several minutes to become `Ready` as TAP must obtain the source code, compile it, create a hardened container, store it, and run the application.

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
tanzu apps workload get tanzu-java-web-app
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

3. Once deployed, the workload has a status of `Ready` and has the URL:  http://tanzu-java-web-app.default.apps.made-up-name.net. Test the application using a browser or by issuing a CURL command:

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
curl.exe http://tanzu-java-web-app.default.apps.made-up-name.net
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}

4. After a few seconds (in your browser window or as curl output) you should see the following text:

```
Greetings from Spring Boot + Tanzu!
```

## Wrapping Up

Although it took a while, you’ve done something amazing! You’ve manually installed an enterprise-grade software platform onto Minikube on your local Laptop or PC which you can experiment with and show to others. Using a single command, you’ve made the platform build raw source code into a binary application, created a hardened container for the application and run the container inside Kubernetes — all without having to write any of the YAML usually needed to describe pods, replica sets, deployments, or services. Plus, if the code ever changes, the application will automatically get rebuilt and redeployed. And that’s just the tip of the iceberg. TAP is a fully customizable platform, so the opportunities for improved developer productivity and supply-chain excellence are endless.

## Tearing Down

Once you’re done with TAP for the day, you can shut it down with the command ‘minikube stop’ and start it up again the next day with ‘minikube start’. If you want to remove TAP on Minikube completely, use the simplest approach is to use ‘minikube delete’. 

1. You can remove the Tanzu CLI with the following command:

{{< tabpane >}}
{{< tab header="Windows" >}}
```sh
rmdir  "C:\Program Files\tanzu"
```
{{< /tab >}}
{{< tab header="MacOS" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< tab header="Linux" >}}

{{% callout %}}
Coming soon!
{{% /callout %}}

{{< /tab >}}
{{< /tabpane >}}
