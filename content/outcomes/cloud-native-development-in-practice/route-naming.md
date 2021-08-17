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

## Determine a unique route

Decide on a route that includes the application name to make the route
easier to identify.
Just using your application name as your route name will likely collide
with an existing route.
Try appending a unique string to the end of your application name.
You can use your name, the hex code of your favorite color, or even a
generated UUID (try running `uuid` from the command line).

Here are some examples:

1.  `pal-tracker-ben-smith`

1.  `pal-tracker-47BFE3`

1.  `pal-tracker-12E51872-1682-4E1B-97D2-55D0EB44432B`

## Verify your route is unique

Once you have decided on a route use `cf check-route` to verify that it
is unique for you foundation's domain.
Run the `cf domains` command to find the value for the domain argument.
Here is an example of checking that the route
`pal-tracker-ben-smith` is unique in the `apps.evans.pal.pivotal.io` domain.

```bash
cf check-route pal-tracker-ben-smith apps.evans.pal.pivotal.io
```

The output will verify whether the route is already claimed on the
foundation.
