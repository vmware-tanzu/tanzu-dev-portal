+++
date = 2020-11-30T15:59:56Z
title = "Logging"
+++

For many applications, logging is written to a rolling log file or the `Windows Event Log`. In a cloud application, this becomes an anti-pattern because you need to either depend on a distributed logging system, or a platform feature.
To move away from these dependencies, the [12 factor application methodology](https://12factor.net/) recomends [outputting logs](https://12factor.net/logs) as a stream to stdout/stderror.

When migrating a legacy application, we often recomend configuring any existing logging framework to output to stdout/stderror.
Each recipe in this section documents a set of steps that were taken when working with a 3rd party logging framework.

{{< children  >}}
