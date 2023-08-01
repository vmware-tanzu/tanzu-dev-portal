---
title: 'Beyond cluster-admin: Getting Started with Kubernetes Users and Permissions'
description: 'Getting Started with Kubernetes users and permissions using certificates, tokens, and RBAC'
date: '2023-07-21'
publishDate: '2023-07-21'
lastmod: '2023-07-28'
slug: beyond-cluster-admin
tags:
- Kubernetes
- Security
team:
- Tiffany Jernigan
- Jérôme Petazzoni
languages:
---

We've all done it: working on our Kubernetes clusters with "cluster-admin" access, the infamous equivalent of "root". It makes sense when we're just getting started and learning about Pods, Deployments, and Services and we're the only one accessing the clusters anyway; but soon enough, we have entire teams of devs and ops and CI/CD pipelines that require access to our precious clusters and namespaces. Are we going to YOLO and give them our admin certificate, token, or whatever else we use to authenticate? Hopefully not!

In this blog post, we are going to explain the various concepts and features that will let us implement fine-grained permissions on Kubernetes clusters. First, we will give some definitions and remind us of the difference between **authentication** and **authorization**. Then, we will talk about the various methods available to provision Kubernetes users. We will see that available strategies vary between on-premises and managed cloud clusters. Finally, we'll explain how **RBAC (Role-Based Access Control)** is used to grant permissions at various levels (namespace or cluster scope).

For a higher level version of this blog, check out the corresponding talk:
{{< youtube id="mD-Dng2QbQ0" class="youtube-video-shortcode" >}}

And [slides](https://speakerdeck.com/tiffanyfay/beyond-cluster-admin-getting-started-with-kubernetes-users-and-permissions).

## Auth-what?
The word "auth" is often used in the context of access control to designate two distinct, security-related concepts : authentication, and authorization. So what are these? 

- **Authentication** (sometimes abbreviated as AuthN)  consists in determining *who* is performing an action (trying to access a resource, making a request…), and verifying their identity. "Authenticating" is conceptually equivalent to showing some form of ID to prove who we are. With computer systems, authentication can rely on passwords, keys, certificates, biometric information, and many more.
- **Authorization** (sometimes abbreviated as AuthZ)  consists in determining if a given user can perform a given action. When authentication serves to establish the identity of someone (or something!), authorization serves to establish what they can (and cannot!) do. With computer systems, authorization can appear as file access permissions or sudo entries, for instance.


## Authentication and user provisioning

Kubernetes is fairly flexible here. The two main authentication mechanisms used to give people access to our clusters are **TLS certificates** and **OIDC tokens**. Most clusters will leverage one of these two mechanisms, but they can be used together (e.g., some users being issued TLS certificates, and others obtaining OIDC tokens).

When using **TLS certificates**, they need to be signed by a specific Certificate Authority (CA). If you have set up the Kubernetes control plane yourself, you can use the CA of your choice, and integrate Kubernetes with other systems like Vault. This is particularly convenient if you are already using such a system to provision users and have them authenticate with other systems. On the other hand, if you are running a managed cluster, it may or may not let you configure the CA used to authenticate users. In any case, you can also use the Kubernetes CSR API to issue certificates. Keep in mind, however, that the initial intent of the CSR API was to issue (and renew) kubelet certificates; and using it to manage user certificates might require developing additional tooling and procedures.

Important warning: the Kubernetes API server doesn't support certificate revocation; therefore, we should use short-lived certs (expiring after a few hours, max) and renew them often. This means that we need to have appropriate tooling, wrappers, plugins… to streamline transparent certificate issuance and renewal for our users.

Using **OIDC tokens** requires an OIDC provider. This is something that you can run in-house (like Dex/Keycloak), or a SAAS like Okta. Some cloud providers use this as an integration point with their IAM systems, for example to map cloud provider users or roles to Kubernetes users.

Just like CA configuration, OIDC configuration is done through API server command-line flags, which means that enabling or customizing it requires you to either run your control plane yourself, or use a managed Kubernetes service that exposes that command-line flag one way or another.

Kubernetes also supports **service accounts**. Service accounts are meant to provide an identity to workloads running on our cluster. For instance, when running a custom autoscaler, and ingress controller, a controller that will create pods and jobs according to messages retrieved from a queue, or really any kind of process that needs to communicate with the Kubernetes API, it is recommended to create a service account for that process and use that service account in the pods of that process. (We will describe later how to do that step by step, and how to assign permissions to a service account, too!)

Fun note: in Kubernetes, we don't "create a user"! Instead, we give permissions to users; for instance, we give "create deployments" permission to "jane.doe", and as long as someone shows up with a valid cert or OIDC token for "jane.doe", they can create deployments. This means that there is no way to list existing users. The closest thing we can do is enumerate all permissions (technically: Role Bindings and Cluster Role Bindings), and gather the list of users referenced by these permissions. On the other hand, it is possible to list Service Accounts since they are standard Kubernetes API resources.


## Service Account Tokens
*
When we run a pod, Kubernetes will automatically expose a **service account token** in that pod. That service account token is a **bound token**, which means that it is generated specifically for that pod; and it is valid only as long as the pod exists. In other words, if the pod gets deleted, the token automatically gets invalidated. (Technically, the token includes the name of the pod, and when the token is used, Kubernetes verifies that the associated pod still exists. If the pod doesn't exist, the token is considered to be invalid and fails to authenticate.) Bound tokens improve security, because if a token leaks one way or another, all that we have to do is delete the associated object (typically, a pod) - we don't need to invalidate or rotate tokens for everyone else.

*Note: bound tokens became the default mechanism in Kubernetes 1.21. Since we're now way past Kubernetes 1.21, we won't even bother discussing legacy tokens here!*

Inside a pod, or rather, inside a container, the service account token is exposed as a regular file: 

`/var/run/secrets/kubernetes.io/serviceaccount/token`

The Kubernetes client library will automatically detect and use that token without needing any kind of configuration. Here are a couple of commands that you can run on any Kubernetes cluster to see that in action.

First, let's look at the service account token exposed in a container.

```shell
kubectl run show-token --image=alpine --rm --restart=Never -it \
         cat /var/run/secrets/kubernetes.io/serviceaccount/token
```

The output is the token, which is technically a JSON Web Token (or JWT). If you want to see the JSON it translates to, you can paste it into [jwt.io](https://jwt.io/).

Then, let's try to execute a kubectl command:
```
kubectl run kubectl-get --image=nixery.dev/kubectl --rm --restart=Never -it kubectl get pods
```
```
Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:default" cannot list resource "pods" in API group "" in the namespace "default"
…
```

The output shows us that `kubectl` somehow automatically figured out that it was running in a pod (technically, it relies on the presence of the `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT` environment variables), retrieved the token, and used it to authenticate with the Kubernetes API server. The Kubernetes API server accepted the token; however, since the `default` service account in the `default` namespace doesn't have any permissions associated with it (that's the default on a new cluster), we get a `Forbidden` error message. We successfully *authenticated* but we weren't *authorized* to perform the action.


## Service accounts for users?

It is possible to (ab)use **service accounts** to provision users. In fact, behind the scenes, a service account is really just a user named `system:serviceaccount:<namespace>:<serviceaccountname>`, as shown in the previous part.

Service accounts are typically used for processes, programs, services running autonomously on a cluster. But, nothing prevents us from using them to manage access and permissions for users, even if that's not what they're meant for in the first place.

This can be particularly convenient if you want to start implementing fine-grained permissions but haven't set up your own certificate authority, OIDC provider, or IAM integration (or even chosen which route you would go to provision users on your clusters).


## Role-based access control (RBAC)

Now that we've discussed AuthN (authentication) at length, it's time to look at AuthZ (authorization) and specifically **Role-based access control (RBAC)**.

In Kubernetes, we can't directly give a specific permission to a user (e.g. "give alice permission to create pods"). Instead, we need to define a **role**, and next, we can **bind** the role to a user.

That level of indirection can feel a bit annoying at first ("I just want to give alice permission to create pods, why do I need all these objects?"), but using roles helps us to factor permissions and avoid redundancy as soon as we assign similar permissions to more than one user!


### Roles

A **role** is a collection of permissions, and a permission is a combination between a *verb*, a *resource*, and optionally a resource name and sub-resource. For instance, if we want someone to be able to view pods, deployments, and replica sets, but not create, update, or delete them, we could have a role combining the following permissions: *get pods, list pods, get deployments, list deployments, get replicasets, list replicasets*. You can check out the Kubernetes docs for [some examples](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-examples). 

Note that there are actually two Kubernetes resources:
- **roles**, which exist within the context of a namespace
- **cluster roles**, which exist at the global cluster scope

If we want to represent permissions on cluster objects (like nodes or even namespaces themselves), we must use a **cluster role**. Cluster roles also have another advantage: they can be defined globally, then used in any namespace, which helps avoid repeating defining commonly used roles in all our namespaces. For instance, Kubernetes ships with 4 pre-defined cluster roles: `view`, `edit`, `admin`, and `cluster-admin`. See the [Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) for more details about these roles. The downside of cluster roles is that they can only be managed by cluster admins.

*Roles* can only be used in the namespace where they're defined, and they cannot give permissions on cluster objects. They are less "powerful" than cluster roles, but on the other hand, they can be created by local namespace admins (they don't require cluster admin privileges).


### Role bindings

To bind a role to a user, we create a *role binding*. A role binding references a role and a user, and means "this user is granted all the permissions enumerated in that role".

There again, we have two levels: role bindings, and cluster role bindings. The logic is the same as with roles, specifically:
- role bindings exist within the context of a namespace, and grant permissions in that namespace exclusively; they can be created by local namespace admins, but cannot grant permissions on cluster-scope objects;
- cluster role bindings exist at the cluster scope, and can grant permissions across all namespaces, and to global objects; but they can only be created by cluster admins.

Good to know: a role (or cluster role) actually doesn't reference a user, but a *list of subjects*, and these subjects can be users, groups, and service accounts (or a mix of the three).


### What goes in a role

If you’re trying to figure out what API version your resource is in, you can use `kubectl api-resources`. Then you can use `kubectl get` to see what actions (or verbs) you can take on the resource.

For instance, the following shows core resources with apiVersion: v1. If you have `jq`, you can pipe this into it to get a more legible JSON output.

```shell
kubectl get --raw /api/v1
```

For pods, you’d see:
```
    {
      "name": "pods",
      "singularName": "",
      "namespaced": true,
      "kind": "Pod",
      "verbs": [
        "create",
        "delete",
        "deletecollection",
        "get",
        "list",
        "patch",
        "update",
        "watch"
      ],
      "shortNames": [
        "po"
      ],
      "categories": [
        "all"
      ],
      "storageVersionHash": "xPOwRZ+Yhw8="
    },
```

The general format for other resources is as follows:

```shell
kubectl get --raw /apis/<group>/<version> 
```

Putting it together, the example role below gives permissions to `get` and `list` pods in the `default` namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: get-pods
  namespace: default
rules:
- apiGroups:
  - ""
  resources:
  - pods
  verbs:
  - get
  - list
```

Similarly, YAML below creates a RoleBinding for the above role tied to the `default` service account in the `default` namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: get-pods
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: get-pods
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
```

### RBAC auditing

Lastly, setting permissions alone is not enough. You should make sure that you actually gave the permissions you think you did by auditing them. You can use the following built-in command:

```shell
kubectl auth can-i --list
```

Or you can use a plugin created by various others as well:
```shell
kubectl who-can # kubectl-who-can by Aqua Security
kubectl access-matrix #Rakkess (Review Access) by Cornelius Weig
kubectl rbac-lookup #RBAC Lookup by FairwindsOps
kubectl rbac-tool #RBAC Tool by insightCloudSec
```

## Want to try it out?

A guide is currently in the works, but in the meantime, you can follow along with service accounts and RBAC from the [slides from the corresponding talk](https://speakerdeck.com/tiffanyfay/beyond-cluster-admin-getting-started-with-kubernetes-users-and-permissions?slide=21).