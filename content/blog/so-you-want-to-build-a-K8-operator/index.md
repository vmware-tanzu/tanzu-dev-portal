---
title: "So You want to Build an Operator?"
description: An introduction to the primary concerns organizations should consider when building a Kubernetes application platform.
date: "2021-11-03"
level1: Building a Kubernetes Runtime
level2: Building Your Kubernetes Platform
tags:
- Kubernetes
# Author(s)
team:
- Rich Lander
---

Well, of course you do! It’s the reason you enrolled in online training, became part of the Kubernetes Community and read case studies on all things Kubernetes. You put a lot of time and effort into learning how to build a Kubernetes Operator to manage software and reduce operational toil for your company.

Get ready for all your hard work to pay off. You are about to build a Kubernetes Operator. Your first order of business is to assemble a team of Kubernetes enthusiasts. There are some things that the team is collectively going to need to discuss, including the foundational feature set for building the operator, and the type of operations that the operator is going to control like upgrades, backups, restores, and failovers. It’s also a good idea to collaborate over design considerations so that the team is effectively working with, and not fighting against, Kubernetes patterns.

## Assemble a Development Team to Build the Operator

Assemble a development team that collectively know how to use:

1. Kubernetes and the Kubernetes Control Plane.
2. The programming language and tools to build the operator.
3. The application the operator is going to control.

Keep in mind that the operator you are building is an extension to the Kubernetes control plane.  Understanding how that control plane works so that you can seamlessly extend it is crucial.  Having deep knowledge and experience in both using and operating Kubernetes clusters will be a huge benefit in this effort.

To start, look at the backgrounds of the app and platform developers at your company to see if anyone has experience working with Kubernetes. If there are no Kubernetes experts, try taking one more look at the skillset of the developers. Not everyone on the team has to be a Kubernetes expert to help build the operator, especially now that you have a good understanding of Kubernetes principles and can guide others. 

## Programming Language

Being proficient in the programming language in use is also extremely helpful. Building an effective Kubernetes Operator is relatively involved. If the developers have comfortable familiarity or even expertise with the language, it will make the details of implementing the operator pattern that much more surmountable.

Depending on your circumstances, it may not be essential to have deep experience in both of these areas. For example, if the team has strong Kubernetes experts that are beginning Go programmers (assuming they are using Go), they will often have success and improve their Go skills as they work. Alternatively, if you have expert Go programmers that are somewhat new to Kubernetes, they could ramp up their understanding of how Kubernetes works and be successful. However, the reality is that most teams that are new to Kubernetes and Go programming will struggle on an operator project.

## Application Knowledge

Finally, it cannot be forgotten that an operator usually exists to manage another software system. A detailed understanding of the application under management is indispensable. If the operator development team includes someone with the relevant detailed understanding, that will be optimum. However, having access to the dev team that manages the workload is perfectly acceptable. Just factor in the time for that knowledge transfer when planning the project.

## Kubernetes Operator Building Tools

There are a couple of different ways to build a Kubernetes Operator. You can use:

- Operator SDK, and leverage tools like Ansible and Helm.  
- Metacontroller, which gives you the freedom to use almost any programming language.  
- The Go programming language and Kubebuilder. This is the most common approach, and the one we most commonly recommend.

### Operator SDK

Operator SDK is now a Kubebuilder plugin that you can use together with the Go programming language to build an operator. Operator SDKs distinction is that it lets you use Ansible or Helm to manage Kubernetes resources. This is an attractive alternative to those that have used these tools extensively, but we recommend that you use a general purpose programming language such as Go because it provides flexibility in defining the logic that will control the actions of your operator.

### Metacontroller

Metacontroller lets you use the programming language of your choice to build an operator. Metacontroller takes care of the interactions with the Kubernetes API so that you can concentrate on the business logic necessary to achieve your objectives.

### Kubebuilder

Kubebuilder is primarily a command line tool that will scaffold the skeleton of a codebase for a Kubernetes operator. Your job is to implement the custom API and reconciliation logic in Go. Kubebuilder requires you to use Go, the most supported language in the Kubernetes ecosystem. Kubernetes is written in Go, after all. This is critical because when you build an operator, you are building an extension to the Kubernetes control plane.

Kubebuilder also supports plugins. This allows for more specific functionality to be enabled.  Operator SDK and Operator Builder are examples of these plugins. 

### Operator Builder

Operator Builder can consume YAML manifests for the resources you wish to manage with your operator and will generate all the source code needed to manage the creation, mutation and deletion of those resources. It gives you a useful head-start if it fits the pattern of implementation that you desire.

### Go Programming Language

Go is the best open-source programming language in the Kubernetes ecosystem. Kubernetes is written in Go. Compared to other programming languages, the syntax for Go is small. If there are members on the team who have worked with Kubernetes in a Java or Python environment, it is feasible that they can effectively learn Go to help build the Kubernetes Operator. 

Go has an official client library known as client-go. Kubernetes can access this feature-rich library internally via kubectl. This library can also be accessed by numerous, external operators like etcd and prometheus.

The Go programming language is so popular in the Kubernetes community that countless unofficial libraries have been created by developers to make it faster to build Kubernetes Operators because there are so many Go tools out there to facilitate it. 

One of the benefits of Kubernetes being written in Go is that you can import objects from the Kubernetes API. This is critical because when you build an operator, you are building an extension to the Kubernetes control plane.

## Foundational Feature Set 

The foundational feature set refers to the ability to create, update and delete the Kubernetes resources under management by the operator.  Those resources often include config map resources, deployment resources, secret resources and stateful sets for databases to manage workloads and deploy applications. 

The number of base level resources that the operator manages depends on whether the project is simple or complex. A simple project may only require six to eight resources, whereas a more complex project may require well over 100 resources. Side note: The more resources under management, the greater the toil reduction available with an operator.

For example, the first thing an operator does when you say to deploy an instance of an application is to create all the base resources for the application in Kubernetes. The operator then ties them together in such a way that the instance of the application works after being deployed. Thereafter, the operator should be able to make reasonable changes to their custom resource and have those changes reflected in the underlying resources that compose their app. Finally, when developers or admins need to decommission an instance of the application, all they have to do is remove the custom resource and all the underlying resources will be removed for them.

An operator that provides just this foundational feature set can deliver considerable value. Instead of the app developers having to manage all the base resources, they only have to manage a single custom resource that represents the application. The time-to-value that a Kubernetes Operator custom resource provides the app development team when it comes to managing other resources in the application remains unrivaled by any other human or software operator today. 

## Kubernetes Operator Activities

There are all sorts of activities that the Kubernetes Operator can do faster and more reliably than a human operator, including automating workload activities like upgrades, backups, restores, and failovers.

### Upgrades

An application upgrade is a labor intensive process that is manually cumbersome and error prone. This is an excellent feature to build into a Kubernetes Operator because it can do the upgrades much faster and more reliably than a human operator.

When performing manual upgrades, it is not uncommon for IT teams to run upgrades in the middle of the night. This is so they can turn off the application for a short period of time when nobody is using it to make changes to the schema or the arrangement of tables in the database. 

In order to make the schema or database change, someone must manually do all the following:

- Disconnect the application
- Upgrade the database
- Upgrade the application
- Reconnect the application 

If the application is not reconnected before running the upgrade, errors will occur because the application is expecting the schema to look a certain way. Errors will also occur if the application upgrades, but the database does not. 

Replacing your manual upgrade process with a Kubernetes Operator automated upgrade process is a winning game changer in the areas of efficiency, effectiveness and time-to-value.

### Backups

All databases and stored information that are part of an app require regular backups. This is usually done by a system admin who is also responsible for the custom system that performs the routine backups of the app data, and then for validating each backup through testing. Backups often result in a lot of routine toil that a system admin has to do repeatedly, even when there are scripts in place.

The power of a Kubernetes Operator can effortlessly transform the routine steps of a backup into an automated process guaranteed to eliminate toil in the workday of the system admin.

### Restoring

Restoring is the opposite end of a backup. When an application goes down, or a database is corrupted, or fails, you can build a Kubernetes Operator that will trigger a set of automated processes to restore the data from a backup and bring the application back to life. Automating the restore process with an operator has the added benefit of using it to do test restores to validate the backups that were taken. After all, a backup is only worthwhile if it is restorable.  You should never leave this to chance! 

### Failovers

Failovers are one of the great unexplored potentials for Kubernetes Operators. This is where the power of operators can really shine by having a piece of software manage the failover of the application from one region to another, including the management of the global load balancers that direct traffic from one datacenter to another, and actually make those failovers seamless and fast.

Keep in mind that it is relatively expensive to engineer this kind of functionality and that testing is only going to increase the cost. Before your company makes the investment to build an operator, it is important to consider the value of the workloads because to do all this engineering for inconsequential workloads is a waste of time and money. The only time it makes good sense to do this is for business critical applications. This is because you build in a guarantee that even if a plane crashes into the datacenter, your application will failover automatically, and its downtime will be minimal. This protection is vital for a business critical application.

### Design Considerations

Kubernetes popularized a new paradigm when it brought existing controllers and declarative states together into a cohesive design system that makes a lot of sense. Working with these systems require an in-depth knowledge of Kubernetes designs and of using the same design patterns

For example, if you use one controller for each custom resource, you declare the state, then reconcile the state with a 1-1 relationship. Use of this design is advisable, though not essential.

Another way you can do this is to have a controller reconcile the state for a bunch of different resources. The problem with this design is you often end up with tangled logic. It is usually difficult to manage such a codebase because of the convoluted relationship between elements and entangled dependencies. You are already dealing with complex systems. Keeping the design relationship simple is a good start.

### Endless Controller Reconciliation and `BackOff`

A controller will continue to attempt to reconcile a state for something forever. It will never stop trying to reconcile that step until the step is reconciled.

A controller tries very quickly to reconcile the state of a custom resource. If a controller attempts to reconcile the state for a custom resource and it fails because some external condition prevents reconciliation, it will keep trying on the assumption that the condition will be remedied. This process is known as a `BackOff`. 

A `BackOff` is the amount of time that the controller waits between attempts to reconcile the state of the custom resource. If the controller cannot reconcile the state, it will increase the time that it waits between each attempt until it reconciles the state, or until it reaches a predefined maximum interval. 

Too many futile reconciliation attempts can result in additional network traffic, and a computational load for the controller that is not productive. One way to try and prevent this is to adjust the time intervals. 

For example, the scheduler is a component in Kubernetes that assigns where a container will run. When the cluster is filled to compute capacity, no more containers can be run. The scheduler will keep trying to schedule a pod. If it cannot, the pod will enter a pending state until the scheduler can find another cluster node for the pod to run.

After the first instance of not being able to schedule the pod, the scheduler immediately tries to schedule it again. This time, if it still cannot schedule the pod, the scheduler is going to wait, or `BackOff`. This is because the scheduler now correctly determines that it should stop trying every 100th of a second to schedule the pod because there is not enough space in the cluster. 

To remedy the problem of not enough space in the cluster, you can add new nodes to add more capacity, or shutdown other workloads. Even better, if you leverage cluster autoscaling, capacity is automatically added. When the scheduler discovers this, it schedules the pending pods.

### Extensibility

When building an operator, the automation built on top of the system is tied to its custom resource specification and the custom resource status.

The custom resource specification is the desired state of the system.
The custom resource status is where your controller or operator communicates the state of the system it controls to other systems. 

One way to ensure automation continues to be built on top of the system is to publish useful statuses for the system. So, when determining what to include in your custom resource status, give some thought to the other systems that may consume it in future.

For example, many companies like to use the deployment resource because of its high-level, feature-rich performance, but they are missing out on the extensible power of autonomous software by not building a Kubernetes Operator to control the deployments.

If you are reading this and evaluating the effort to build a Kubernetes Operator to manage workloads, you likely recognize the value of following this pattern because you understand that your company will need to follow it again. 

In the future, multi-cluster and platform operators are probably going to install your application as a part of a larger system. 
Keep this in mind and understand that you may want to leave features out of the scope of your project that would best belong to another operator that extends the work you are doing now.
