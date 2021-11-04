---
date: 2021-11-04
description: Sealed Secrets is a Kubernetes controller and a tool for one-way encrypted Secrets. In this blog post you will learn how to deploy the Sealed Secrets Helm chart through VMware Application Catalog (TM) and use it to encrypt an application running on your cluster.  
lastmod: '2021-11-02'
patterns:
- Deployment
tags:
- Kubernetes
- Sealed Secrets
team:
- Raquel Campuzano
title: Deploy Applications with Confidence and Control with VMware Application Catalog and Sealed Secrets  
topics:
- Kubernetes
---

*Raquel Campuzano and Juan Ariza co-wrote this post*

First published on [https://blog.bitnami.com/2021/11/deploy-applications-with-confidence-vmware-application.html](https://blog.bitnami.com/2021/11/deploy-applications-with-confidence-vmware-application.html)

As more organizations adopt Kubernetes as the preferred infrastructure for running their IT resources, enterprise SRE teams tend to adopt a GitOps mindset.  

The GitOps approach consists of embracing different practices that manage infrastructure configuration as a code. This means that Git becomes the single source of truth and as such, all operations are tracked via commits and pull requests. Thus, every action performed on the infrastructure will leave a trace and can be reverted if needed.  

This practice brings a lot of benefits to IT admins, since automation and ease of managing Kubernetes configurations are extremely important to them. 

Despite this, there's a high probability of discovering security risks when managing the access to the applications running in a Kubernetes cluster. This is where Sealed Secrets comes in. Sealed Secrets is a  Kubernetes controller and a tool for one-way encrypted Secrets.  

## Why should every cluster controller use Sealed Secrets to protect their deployments?  

When cluster operators and administrators follow the GitOps approach, they usually find that they can manage all Kubernetes configurations through Git except secrets. Sealed Secrets solves this problem by encrypting the secret into a new Kubernetes object called “SealedSecret” which is safe to store even in public repositories.  

Sealed Secrets is a popular Open-Source project led by Bitnami that helps Kubernetes operators and administrators keep their deployments safe and under control. Sealed Secrets can only be decrypted by those who have access to the sealing private key — usually the cluster administrator — ensuring that nobody else, even the original author, is able to obtain the secret given in a Sealed Secret manifest file. 

Sealed Secrets is now available as a Helm chart in VMware Application Catalog! VMware Application Catalog is a customizable selection of trusted, pre-packaged open-source application components that are continuously maintained and verifiably tested for use in enterprise production environments – the ideal option to procure secure application building blocks.  

Depending on your requirements, you can either navigate to the ongoing Open-Source project located in the [Bitnami GitHub repository and download the tool and test it out](https://github.com/bitnami-labs/sealed-secrets), or if your organization requires a more stable, secure, and compliant image, you can deploy Sealed Secrets on your cluster through VMware Application Catalog.  

## Deploy Sealed Secrets on Kubernetes through VMware Application Catalog 

The following steps describe how to navigate to VMware Application Catalog — [formerly known as Tanzu Application Catalog](https://tanzu.vmware.com/content/blog/announcing-evolution-vmware-application-catalog) — and deploy Sealed Secrets in your cluster. Once you have it installed, you will be able to deploy any application — this blog post uses MariaDB as an example, but you can pick another solution existing in your catalog — and encrypt its secrets using a Sealed Secret.  

This post assumes that you already have: 

* Sealed Secrets and MariaDB added to your VMware Application Catalog 
* [Kubeseal](https://github.com/bitnami-labs/sealed-secrets#overview) was previously installed on your computer. 

1. Navigate to [app-catalog.vmware.com](app-catalog.vmware.com) and sign in with your VMware account to your catalog. 

2. In "My Applications" section, search for Sealed Secrets Helm chart and click "Details".

![VMware Application Catalog Sealed Secrets Helm chart](images/vac-sealed-secrets.png)

3. On the next screen, you will find the instructions for deploying the chart on your cluster. Make sure that your cluster is up and running by executing `kubectl cluster-info`. Then, run the commands you will find under the "Consume your Helm Chart" section.

![VMware Application Catalog Sealed Secrets Helm chart details page](images/sealed-secrets-helm-deployment-details.png)

4. Once you have installed the Sealed Secrets chart, it is time to use it to encrypt the required secrets to manage the MariaDB credentials. Fortunately, the MariaDB Helm chart supports retrieving the credentials from an existing secret. 

   To use that feature, you must make sure that you know which is the expected format for the MariaDB secret. You can obtain that information by checking in the MariaDB chart's README file the "common parameters" section as shown below: 

   ![MariaDB deployment parameters](images/mariadb-parameters.png) 

5. Based on this information, you can use [kubeseal](https://github.com/bitnami-labs/sealed-secrets#overview) to create a Sealed Secret with encrypted credentials for MariaDB by executing the command below: 

~~~bash
kubectl create secret generic mariadb-secret --dry-run=client \ 
  --from-literal=mariadb-root-password=ROOT_PASSWORD \ 
  --from-literal=mariadb-replication-password=REPLICATION_PASSWORD \ 
  --from-literal=mariadb-password=SOME_PASSWORD \ 
  -o yaml | kubeseal --controller-name=CONTROLLER_NAME \ 
  --controller-name=CONTROLLER_NAMESPACE \ 
  --format yaml > mariadb-sealedsecret.yaml 
~~~

| NOTE: Remember to replace the ROOT_PASSWORD, REPLICATION_PASSWORD and SOME_PASSWORD placeholders with the passwords you want to use to configure MariaDB. Also, replace the CONTROLLER_NAME and CONTROLLER_NAMESPACE with the name and namespace of your Sealed Secrets controller, respectively. This information is displayed in the NOTES when installing the Sealed Secret chart.

The command above creates a new `.yaml` file named `mariadb-sealedsecret.yaml` which contains the encrypted MariaDB credentials. That file should look like it is shown below:  

![MariaDB Sealed Secret yaml file](images/mariadb-sealed-secrets.png)

At this point, you can safely add this file to your Git repository. Once you have a Sealed Secret manifest, you can deploy it in your Kubernetes cluster running the command below: 

~~~bash
kubectl create -f mariadb-sealedsecret.yaml 
~~~

6. Use the following command to double-check that the Sealed Secret — and the associated secret — was successfully created: 

~~~bash
kubectl get sealedsecret mariadb-secret 
kubectl get secret mariadb-secret  
~~~

7. Now, you can deploy the MariaDB Helm chart retrieving the credentials from the existing "mariadb-secret" secret. To do so, back to the VMware Application Catalog and search for the MariaDB details page. Then, execute the command you will find in the "Consume your Helm Chart" by appending the following flag: 

~~~bash
--set auth.existingSecret=mariadb-secret 
~~~

   Once the chart is installed, you can start to operate your MariaDB database as described in its installation notes. 

8. The last step is to obtain the chart installation values and save them in a file using the command below: 

~~~bash
helm get values MARIADB_RELEASE > mariadb-values.yaml 
~~~

| NOTE: Remember to replace the MARIADB_RELEASE placeholder with the name you used for your MariaDB release. 

You can now add this `mariadb-values.yaml` to your Git repository.  

**By committing both this and the `mariadb-sealedsecret.yaml` file in your repository you can record the status of your infrastructure in a reproducible manner – allowing to again embrace the GitOps mindset**. Thanks to Sealed Secrets, now you can also publish your changes in any public repository without exposing your database credentials. 

## Deploy Applications with Confidence and Control 

As shown in this blog post, the combination of Sealed Secrets and VMware Application Catalog allows you to deploy applications in your cluster with complete confidence. Apart from keeping your applications automatically updated and monitored thanks to VMware Application Catalog, now you can rely on the efficiency of Sealed Secrets for keeping your deployments locked and safe against misuse.  

Learn more about VMware Application Catalog by checking its [product page on vmware.com](https://tanzu.vmware.com/application-catalog). You can also check out technical documentation for VMware Application catalog here. You can also contact the VMware Application Catalog team directly at vac@vmware.com  

If you are interested in contributing to the Sealed Secrets Open Source project, [check out the GitHub repository](https://github.com/bitnami-labs/sealed-secrets) and do not hesitate to [send us a pull request](https://github.com/bitnami-labs/sealed-secrets/pulls). The Bitnami engineering team will check it and guide you in the process for a successful merge.   
