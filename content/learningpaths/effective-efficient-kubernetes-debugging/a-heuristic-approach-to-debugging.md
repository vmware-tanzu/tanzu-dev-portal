---
date: '2022-02-23'
layout: single
team:
- David Wu
- Carlos Nunez
title: A heuristic approach to debugging
weight: 20
tags:
- Debugging
- Kubernetes
---

In the previous section on [Kubernetes debugging workflow and
techniques](learningpaths/effective-efficient-kubernetes-debugging/kubernetes-debugging-workflow-and-techniques), a general workflow
with a set of debugging commands were established to resolve most direct issues, including mistyped text
that causes crash loopback errors. It also provides a glimpse
as to the cause of an issue. At best, an error message or code is
obtained to search through documentation or the internet to find
the cause. On average, a number of avenues is found where the cause of
the problem may lie. At worst, no apparent leads are available. Can we do better?
Can we limit the number of places we can search or is there a way we can
short-circuit towards understanding causes of a problem more quickly?
 
## What You Will Learn
 
In this section, you will learn:
- The top six common sources of problems.
- How to use a heuristic approach to debugging.
 
## Top Six Common Sources of Problems
 
The following are the top six sources of problems in the field:
 
- **Bugs** - There is always a chance that the problem is a software bug,
 and you are going to need assistance. However, in many instances, it is one of the
 other sources of problems in this list that are more likely to be the cause of an issue,
 and not a software bug.
- **Certificates** - A simple idea with highly complex components
 marred by varying implementations and different nomenclatures provides
 a difficult and confusing concept to understand.
 
   It is highly recommended that you have a good understanding of how
 certificate work is developed. The key requirement is a formation of a
 valid chain of trust that starts on a host from a server/leaf certificate to
 multiple, intermediate certificates, and finally a Root/CA
 certificate. It is through a formed trust, that an encrypted communication
 session can begin between a host and a server. This [Kaspersky
 article](https://www.kaspersky.com/resource-center/definitions/what-is-a-ssl-certificate)
 covers most of the basics described in detail above. For readers
 desiring an interactive example, use [dawu415's certificate
 tool](https://github.com/dawu415/PCFToolkit/tree/master/cert) to
 learn about certificates. 
 
   The following is an example of directly querying `www.google.com` and building
 a trust chain from the perspective of the host computer.
 
   Note the certificate tree is going from the server/lead certificate
 (top) to the pre installed root certificate where the `Subject` and `Issuer`
 are identical on the host computer's trust store (bottom).
 
   ```sh
      ./cert info --host www.google.com 443
 
      ---------------------------------------------------------------------
      Details of www.google.com:443
      ---------------------------------------------------------------------
 
          Type: Server Certificate
 
          Subject: CN=www.google.com,O=Google LLC,L=Mountain View,ST=California,C=US
 
          Issuer: CN=GTS CA 1O1,O=Google Trust Services,C=US
 
          CN: www.google.com
 
          SANS:
              www.google.com
 
      Trust Chain:
      .
      └── www.google.com:443
          ├── Subject: www.google.com
          ├── Issuer: GTS CA 1O1
          ├───┐
          └── www.google.com:443
              ├── Subject: GTS CA 1O1
              ├── Issuer: GlobalSign
              ├───┐
              └── System Trust Store: GlobalSign
                  ├── Subject: GlobalSign
                  └── Issuer: GlobalSign
   ```
 
- **Configuration Error**: This is usually caused by typing incorrect text that may
 include non-obvious characters such as spaces and tabs.
- **DNS**: [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System)
 resolves the hostname to IP addresses. For example, when an application is unable to reach the
 DNS server or the DNS server doesn’t contain the record. There are also less
 obvious issues in the field. For example, a bug in base OS images that doesn't allow
 DNS IPV4, but does allow IPV6.
- **Firewall**: Some firewall rules can prevent access to resources. For example, a firewall is allowed access to a resource via Layer 4 (TCP), but it also bars access to that resource via Layer 7 (HTTP).
- **Routing and Proxy**: This issue occurs when network packets do not route
 to where they are expected, or when they go through a proxy in order to
 reach their intended destination. Certificates and DNS issues both lead to
 inaccessible route errors. Another type of routing issue occurs when packets
 take a much longer, incorrect route than necessary to reach their destination that results in high latency.
 
## A Heuristic Approach to Debugging
 
This section describes how to use the heuristic approach to debug the top six common sources of problems (see the previous section, *Top Six Common Sources of Problems*). The heuretics approach is an effective, efficient way for you to identify the cause of a problem.
 
If information gleaned from the initial debugging workflow yield no results, or had
multiple possibilities, you could start to reason about where to begin and use
the sources as heuristic to help pin-point the cause of your problems, for example, NTP.
The next section dives deeper into refining heuristic through context test debugging.
 
Test validations and tools are required to use heuristics. The following are a couple of common tests and tools for each source:
 
1. **Bug**: Be cognizant of bugs, and don’t be quick to provide a conclusion 
without first checking release notes, having discussions with authors and teams, and having concrete findings documented in logs. If possible, look through the
source code to reference lines in your discussions, or to build tests against to validate your assumptions.
 
2. **Certificates**: While implementation specific, CA root certificates are
installed with the intermediate certificate, in the trust store of a
node, in order for a full trust to occur. Do note that some components require a
specific certificate order to put an intermediate certificate
first, followed by the root, and vice-versa. See the component documentation
for more details. In some systems, only having the intermediate
certificate in the trust store is sufficient because it implies that a
server already trusts the root CA. Refer to documentation on how to install the
CAs to be trusted target hosts
 
   There are tools to assist with determining whether there is a trust chain,
for example, openssl.
 
   ```sh
   openssl s_client -connect <fqdn/ip>:<port>
   ```
 
   This command retrieves all the certificates and display them. There is an option in `openssl` to also check
certificate trust,
 
   ```sh
   openssl verify -CAfile rootcert.pem -untrusted intermediateCert.pem servercert.pem
   ``` 
  
   Alternative tools, such as [dawu415’s cert tool](https://github.com/dawu415/PCFToolkit/tree/master/cert),
retrieve certificates from hosts and make it easier to check the trust chain from a set of
certificates maintained in a file, or from a server.
 
   A secondary issue with certificates is the line break of PEM encoded certificates. There should only
be `\n` (linefeed (LF) ) and not `\r\n` (carriage return + linefeed (CRLF)), as
is usually inserted when working on Windows machines. Text editors like Visual Studio
Code can convert CRLF to LF. In some situations, applications require
a single line PEM and escaped line breaks, that is, the 'invisible' LF character
is converted to a character pair `\n`.  To do this, enter the following command
in Linux:
  
   ```sh
   cat certificates.pem | awk -v ORS='\\n' '1' | tr -d '\r'
   ```
 
   Some applications are going to require a restart in order to recognize the new CA certificates after installing a CA certificate on the host that is running the docker daemon.

   For example, the docker CLI throws the error, `x509: certificate signed by unknown authority` when connecting to an internal container registry that uses an internally signed CA untrusted on
the user's machine. The docker daemon service also needs to be restarted after installing a CA certificate so that it can pick it up.
 
   To restart the docker daemon, enter the following command:
 
   ```sh
   sudo systemctl restart docker
   ```
 
   If you are on MacOS or Windows, restart the service that is available on the graphical user interface.
 
   Some proxies will return zero bytes for SSL connections being made to IP
addresses/DNS records that are not in its main list. It usually manifests as
an `SSL_SYSCALL_ERROR` in the browser, or as an SSL handshake failure in `cURL`. Use
`openssl s_client` as documented above to debug.
 
3. **Configuration Error**: Be aware of applications that introduce
unwanted characters such as tabs, spaces and newlines.
 
   For example, Kubernetes secrets require a base64 input. This could conveniently
be performed with the command `echo 'xxx' | base64`. However, echo also appends a newline
character to the string `xxx`.
 
   To avoid this, use `echo -n 'xxx' | base64`, to remove the extra newline character
appended after the `xxx` string.
 
   For a generic configuration, use a text editor or raw character output
to check the ASCII characters. Text editors such as Vim and Visual Studio Code can
assist with viewing these characters.
 
   For small strings, the Linux command, `echo 'xxx' | od -t x1` can assist in
displaying the hex output of the echoed string. You could then use an
[ASCII](https://www.asciitable.com/) table to assist with translating the
characters, which in this situation are the numbers 10 decimal (0x0A hex) and 13
decimal (0x0D hex) for the LF and CR characters, respectively. 
 
   If the above fails, revert back to the last known working configuration or
known defaults, then incrementally test configuration changes going forward.
 
4. **DNS**: The command,
 
   ```sh
   nc -vz <ip-of-dns> 53
   ```
 
   Use this command to check connectivity to a DNS server. Alternatively, you can use `ping <fqdn>` to check if a hostname can be resolved. This is usually indicated on the
first line of the ping output. You can also use similar tools, such as `dig`, `nslookup`
or `host` commands to test access to DNS or to see if the DNS server can
resolve a hostname. Be aware of DNS caching results that are stale.
While it is not possible to change the caching behavior of a DNS, this could be
alleviated with,
 
   ```sh
   dig example.com +trace
   ```
   This forces a trace output of the name resolution all the way through to an
   authoritative DNS.   
   
   While the above serves as a general recommendation for validating DNS for
where most common issues lie, another aspect to consider is name resolution of
services and pods within a Kubernetes cluster via CoreDNS. First, check if the
pods are running on a cluster. If not, follow the general workflow and techniques
in the previous section to see what else is preventing
the CoreDNS pods from starting. Once they are working, access a container to
test the in-cluster DNS resolution. See ["Accessing containers"](learningpaths/effective-efficient-kubernetes-debugging/kubernetes-debugging-workflow-and-techniques#accessing-containers)
for more details on how to get onto a container.  You can also read this
[Kubernetes
document](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
for tips on how to debug in-cluster DNS resolution. 
 
5. **Firewall**: The same debugging tools for routing can be used for firewalls.
To check Layer 7, do a `curl -kL <fqdn/ip>` command.
 
   Note that `-k` only skips SSL validation for cases where HTTPS is not used or
when using untrusted/self-signed certificates. Be aware that it is possible for Layer 7
HTTP firewall rules that are in place, and sometimes Layer 4 TCP/IP & UDP is not
blocked when running a Netcat check command. This could indicate that there is a firewall in place.
 
   `tcpdump` is tool that you can use to inspect packets on the host machine, including TCP packets
for an `RST` or `Reject` on `ACK`.  A reference for `tcpdump` can be found [here]
(https://gist.github.com/jforge/27962c52223ea9b8003b22b8189d93fb).
 
6. **Routing & Proxy** - To see if a server can be accessed, use
netcat,
 
   ```sh
     nc -vz <ip/fqdn> <port>
   ```
 
   Or, if `nc` is not available,
 
   ```sh
   curl -kL telnet://<ip/fqdn>:<port> -vvv
   ```
 
   This does a Layer 4 check that tests connectivity.
 
   Proxy servers are another aspect to consider. Check for
`HTTP_PROXY` and `HTTPS_PROXY` environment variables to verify if the
servers are set, or need to be set. In some instances, complex configuration requires
the `NO_PROXY` environment variable to be set for hosts that should not go through
a proxy. The existence of these environment variables in Linux can be checked by
entering the following command:
 
   ```sh
   env | grep -i proxy
   ```
 
   For incorrect routing that causes high latency, use perform load test
tools to ascertain access time or simple checks using `curl`'s
[write out timing variables](https://everything.curl.dev/usingcurl/verbose/writeout#available-write-out-variables).
This provides useful information such as total time, and hostname
resolution time. The following is an example of usage:
 
   ```sh
   curl -s -w 'Total time: %{time_total}s\n' https://tanzu.vmware.com
   ```
 
   You need to compare the timing results to a gold standard, or be
able to reason why it is taking a long time. For example, if loading a page
typically takes 300 milliseconds, but now  it is taking 5 minutes, there's likely an issue.
 
   Finally, you can print the system's route table if there is suspicion of a
route misconfiguration on a host. There are several ways to do this, depending on
the operating system that you are using to troubleshoot an issue:
 
   - **MacOS**: `netstat -rn` (`netstat -rnf inet` to only see IPv4 routes)
   - **Linux**: `route -n`
   - **Windows**: `route print`
 
   You can also test routing by using a traceroute tool to see which gateway
   serves the initial hop,
 
   ```sh
       traceroute <ip_address>
   ```
 
   On Windows, the command is `tracert`.  Note that this uses ICMP ECHO by
default. Consult the `main` page for your version of `traceroute` to find options
that enable TCP- or UDP-based `traceroute` and ensure that ICMP packets are allowed.