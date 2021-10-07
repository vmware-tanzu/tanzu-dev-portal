---
title: Route Naming
weight: 31
layout: single
team:
  - VMware Tanzu Labs
---

You will use the following instructions in the
[Pipelines](../pipelines/)
and
[Deploy Distributed System](../deploy-distributed-system/)
labs to create a unique routes
for your applications.
This will help avoid route naming collisions with others on the
same foundation.

## Routes

[*Tanzu Application Service* Routes](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#routes)
are *domain name resolvable addresses* used in the
*Tanzu Application Service* architecture to route network traffic to
mapped applications.

A route consists of two parts:

1.  `domain`:
    A
    [domain](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#domains)
    with DNS configuration to resolve to a load balancer
    forwarding requests to *Tanzu Application Service* routers.
1.  `hostname`:
    A subdomain of the [domain](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#domains) associated with the load
    balancer forwarding requests to *Tanzu Application Service* routers.

The route specification is as follows:

`<hostname>.<domain>`

For example, if the route is `pal-tracker.apps.tas.example.com`,
the hostname is `pal-tracker` and the domain is
`apps.tas.example.com`.

## Route uniqueness

When you push an application to *Tanzu Application Service*,
if you do not explicitly tell the `cf push` command to exclude the route
via the `--no-route` options,
or map an automatically generated route via the `--random-route` option,
it will attempt to map a route with the application name as the
hostname component of the route.

This may result in collisions with other applications of the same name
running on the same foundation.

**Remember that the route is a fully qualified domain name resolvable**
**address that must be unique.**

You will need to map a route with a unique hostname component.

The following specify how to construct a unique route.

## Determine the domain for your route

Run the `cf domains` command to find the value for the domain argument.

An example output will look like this,
but your domain will be specific to your foundation and/or organization:

```no-highlight
Getting domains in org bill as bill...
name                             status   type   details
apps.tas.example.com             shared
mesh.apps.tas.example.com        shared
apps.internal                    shared          internal
```

In this example,
the `apps.tas.example.com` is the desired domain.

**Do not use the `mesh` or `internal` domains.**

## Determine a unique host

Try appending a unique string to the end of your application name.
You can use your initials,
the hex code of your favorite color,
or even a generated UUID
(try running `uuid` from the command line).

Here are some examples:

1.  `pal-tracker-ben-smith`

1.  `pal-tracker-47BFE3`

1.  `pal-tracker-12E51872-1682-4E1B-97D2-55D0EB44432B`

## Verify your route is unique

Once you have decided on a route based from an existing domain,
use `cf check-route` to verify that it is unique for your foundation's
domain.

Here is an example of checking that the route
`pal-tracker-besmith` is unique in the `apps.tas.example.com`
domain.

```bash
cf check-route pal-tracker-besmith apps.tas.example.com
```

The output will verify whether the route is already claimed on the
foundation.

If the route is available for use:

```no-highlight
Checking for route...
OK
Route pal-tracker-besmith.apps.tas.example.com does not exist
```

If the route is **not** available for use:

```no-highlight
Checking for route...
OK
Route pal-tracker-besmith.apps.tas.example.com does exist
```

## Reserving routes

If the route is available for use,
you can also *reserve* a route in a space by running the
`cf create-route` command.
The route will exist,
but not be mapped to any application.

```bash
cf create-route <space> <domain> --hostname <hostname>
```

Example:

```bash
cf create-route sandbox apps.tas.example.com --hostname pal-tracker-besmith
```

Output:

```no-highlight
Creating route pal-tracker-besmith.apps.tas.example.com for org <redacted> / space sandbox as <redacted>...
Route pal-tracker-besmith.apps.tas.example.com has been created.
OK
```

If you attempt to reserve a route already reserved or mapped to an
existing application on the *Tanzu Application Service* foundation,
you will get this message:

```no-highlight
Creating route pal-tracker-besmith.apps.tas.example.com for org <redacted> / space sandbox as <redacted>...
Route pal-tracker-besmith.apps.tas.example.com already exists.

OK
```
