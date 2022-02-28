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
with a set of debugging commands were established. While seemingly simple, it is
an effective start to resolving most direct issues such as mistype errors
causing crash loopback errors. Further, it provides a glimpse
as to what the cause of an issue is. At best, some error message or code is
obtained, which could be searched through documentation, or on internet, to find
the cause. On average, a number of avenues is found of where the cause of a
problem may lie. At worst, no apparent leads are available. Can we do better?
Can we limit the number of places we can search or is there a way we can
short-circuit towards understanding causes of a problem more quickly? 

## What you will learn

In this section, you will learn:
- The top 6 common sources of problems
- Using a heuristic approach to debugging

## The top 6 common sources of problems

It is generally accepted in the field that the top 6 sources of problems are, 
in no particular order: 

1. **DNS**: [Domain Name System
   (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System) resolves hostname
   to IP addresses. Usual issues are when an application is unable to reach the
   DNS server or the DNS server doesn’t contain the record. Some other less
   obvious issues seen in the field are base OS images having a bug disallowing
   DNS IPV4 but allowing IPV6.

2. **Certificates** - A generally simple idea with highly complex components
   marred by varying implementations and different nomenclatures, leads
   to a very difficult and confusing to understand concept. Before approaching
   certificates, it is highly recommended that a good understanding of how
   certificates work is developed.  The key requirement here is a formation of a
   valid chain of trust, on a host, from a server/leaf certificate, to
   potentially though multiple intermediate certificates and finally a Root/CA
   certificate. It is through a formed trust, that an encrypted communication
   session can begin between a host and a server. This [Kaspersky
   article](https://www.kaspersky.com/resource-center/definitions/what-is-a-ssl-certificate)
   covers most of the basics of what is described above in detail. For readers
   desiring an interactive example, [dawu415's certificate
   tool](https://github.com/dawu415/PCFToolkit/tree/master/cert) can be used to
   learn about certificates.  Below is an example of directly querying
   `www.google.com` and building a trust chain from the perspective of the host
   computer. Note the certificate tree is going from the server/lead certificate 
   (top) to the pre-installed root certificate, where the `Subject` and `Issuer`
   are identical, on the host computer's trust store (bottom). 

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

3. **Routing & Proxy**: These issues arise where network packets do not route
   to where they are expected or that they must go through a proxy in order to
   reach their intended destination.  The two issues described previously lead
   to inaccessible route errors.  Another form of routing issue is where packets
   take a much longer incorrect route than necessary to reach their destination, 
   leading to high latency.

4. **Firewall** - Generally there are firewall rules preventing access to
   resources. These can manifest itself in the form of Layer 4 and Layer 7
   firewalls in the field, that is, it is possible that a firewall is allowed
   access to a resource via Layer 4 (TCP) but bars access to that resource
   via Layer 7 (HTTP)

5. **Configuration Error** - Issues caused by this are generally caused by fat
   fingered configuration, usually induced by non-obvious characters, such as
   spaces and tabs. 

6. **Bugs** - There is a possibility that a problem could be a software bug and
   support will be needed. However, be aware that the other sources of problems
   described above are more likely to occur than a bug. 

## A heuristic approach to debugging

The last section discussed the top 6 common sources from where problems occur.
Let's now look into detail about how we could use these sources as heuristics to
help us to be more effective and efficient in finding causes of a problem. If
information gleaned from our initial debugging workflow yielded no result or had
multiple possibilities, one could start to reason about where to begin and use
the sources as heuristic to help pin-point the cause of our problems. One other
aspect to keep in mind, however, is while this is the top 6 most common sources,
be aware of what other sources that might be involved, for example, NTP.  We'll
dive deeper into this in the next section with refining heuristic through
context test debugging.

In order to use these heuristics, we would require validating tests for each and
tools.  Here, we present some common tests and tools for each source:

1. **DNS** - The command 

    ```sh
    nc -vz <ip-of-dns> 53
    ```

    This can be used to check connectivity to a DNS server. Alternatively, using `ping <fqdn>` can also be
used to check if a hostname can be resolved, which is usually indicated on the
first line of the ping output.  Other similar tools, such as `dig`, `nslookup`
or `host` commands can be used to test access to DNS or if the DNS server can
resolve a hostname. Do be aware of DNS caching of results that maybe stale.
While it is not possible to change the caching behaviour of a DNS, this could be 
alleviated with, 

    ```sh 
    dig example.com +trace
    ```
    This forces a trace output of the name resolution all the way through to an 
    authoritative DNS. 

    While the above serves as a general recommendation for validating DNS for 
where most common issues lie, another aspect to consider is name resolution of 
services and pods within a Kubernetes cluster via CoreDNS. First check if these 
pods are running on a cluster and if not follow through with the general
workflow and techniques in the previous section to see what else is preventing
the CoreDNS pods from starting. Once these are working, access a container to
test out the in-cluster DNS resolution. See ["Accessing containers"](learningpaths/effective-efficient-kubernetes-debugging/kubernetes-debugging-workflow-and-techniques#accessing-containers) 
for more details on how to get on to a container.  For further details, this 
[Kubernetes
document](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/) 
provides tips on how to debug in-cluster DNS resolution.  

2. **Certificates** - While implementation specific, CA root certificates should
be installed together with the intermediate certificate in the trust store of a
node in order for a full trust to occur.  Do note that some components require a
specific certificate order, that is, whether to put an intermediate certificate
first followed by the root and vice-versa.  Check the component documentation
for these details.  In some other systems, having only the intermediate
certificate in the trust store is sufficient, since this is implying that a
server already trusts the root CA.  Refer to documentation on how to install the 
CAs to be trusted the target hosts

    There are tools to assist with determining whether there is a trust chain, 
for example, using openssl, 

    ```sh
    openssl s_client -connect <fqdn/ip>:<port>
    ```

    will retrieve all the certificates and display them. There is an option in `openssl` to check
certificate trust as well, 

    ```sh
    openssl verify -CAfile rootcert.pem -untrusted intermediateCert.pem servercert.pem
    ```  
    
    Alternative tools, such as [dawu415’s cert tool](https://github.com/dawu415/PCFToolkit/tree/master/cert), 
will retrieve certificates from hosts and make it easier to check the trust chain from a set of
certificates in a file that are on hand or from a server.  A secondary issue with 
certificates is the line break of PEM encoded certificates. There should only 
be `\n` (linefeed (LF) ) and not `\r\n` (carriage return + linefeed (CRLF)), as 
is usually inserted when working on Windows machines. Editors like Visual Studio 
Code could help convert CRLF to LF.  In some situations, some applications require 
a single line PEM and escaped line breaks, that is, the 'invisible' LF character 
is converted to a character pair `\n`.  This can be achieved with this command 
in Linux: 
    
    ```sh
    cat certificates.pem | awk -v ORS='\\n' '1' | tr -d '\r'
    ```

    After installing a CA certificate, certain applications usually require a 
restart in order to recognize the new CA certificates. For example, the docker
CLI would throw the error `x509: certificate signed by unknown authority`, when
connecting to an internal container registry that that uses an internally signed
CA that is untrusted on the user's machine. This internally signed CA will need 
to be installed on the host that is running the docker daemon.  After installing 
the CA, the docker daemon service needs to be restarted in order
to pick up the new CA certificate. Restarting the docker daemon is usually performed
with the command:

    ```sh
    sudo systemctl restart docker
    ```

    If on MacOS or Windows, restart the service that is available on the graphical 
    user interface. 

    Some proxies will return zero bytes for SSL connections being made to IP
addresses/DNS records that are not in its whitelist. This usually manifests as
an `SSL_SYSCALL_ERROR` in the browser or an SSL handshake failure in `cURL`. Use
`openssl s_client` as documented above to debug.

3. **Routing & Proxy** - To see if a server can be accessed, use 
netcat, 

    ```sh
      nc -vz <ip/fqdn> <port>
    ```

    Or, if `nc` is not available,

    ```sh
    curl -kL telnet://<ip/fqdn>:<port> -vvv
    ```

    This would do ultimately a Layer 4 check to test for connectivity. 

    Proxy servers are another aspect that should be considered. Check for
`HTTP_PROXY` and `HTTPS_PROXY` environment variables and see if these are set or 
need to be set. In some instances, complex configuration will require the
`NO_PROXY` environment variable to be set for hosts that should not go through
any proxy. The existence of these environment variables in Linux can be checked
via the command 

    ```sh
    env | grep -i proxy
    ```

    For incorrect routing causing high latency, perform load test 
tools could be used to ascertain access time or simpler checks using `curl`'s
[writeout timing variables](https://everything.curl.dev/usingcurl/verbose/writeout#available-write-out-variables)
, which will output useful information such as total time and hostname
resolution time. An example usage of this is: 

    ```sh
    curl -s -w 'Total time: %{time_total}s\n' https://tanzu.vmware.com
    ```

    You would need to compare the timing results to some gold standard or be 
able to reason about whether it is long time, for example, loading a simple page
might take 300 ms, but if it takes 5 minutes, there's likely an issue.

    Finally, one can print the system's route table if there is suspicion of a
route misconfiguration on a host. There are several ways to do this depending on
the operating system that you are troubleshooting from:

    - **MacOS**: `netstat -rn` (`netstat -rnf inet` to only see IPv4 routes)
    - **Linux**: `route -n`
    - **Windows**: `route print`

    You can also test routing by using trace route tool to see which gateway
    serves the initial hop,

    ```sh
        traceroute <ip_address>
    ```

    On Windows, the command is `tracert`.  Note that this uses ICMP ECHO by
default. Consult the `man` page for your version of `traceroute` to find options
that enable TCP- or UDP-based `traceroute` and ensure that ICMP packets are allowed.

4. **Firewall** - The same debugging tools as per routing could be used. In addition, to check 
Layer 7, one would just do a `curl -kL <fqdn/ip>` command. Note that `-k` is just to 
skip SSL validation for cases where HTTPS is not used or is using untrusted/self-signed 
certificates. Be aware that it is possible Layer 7 HTTP firewall rules are in place 
and sometimes Layer 4 TCP/IP & UDP is not blocked when running a netcat check 
command.  This is may be an indicator that there is a firewall in place. `tcpdump` 
is tool that could be used to inspect packets on the host machine, which would 
involve inspecting TCP packets for an `RST` or `Reject` on `ACK`.  A reference 
for `tcpdump` can be found [here](https://gist.github.com/jforge/27962c52223ea9b8003b22b8189d93fb).

5. **Configuration Error** - Be aware of certain applications that introduce
unwanted characters such as tabs, spaces and newlines, for example, Kubernetes 
secrets require a base64 input, which could conveniently performed with the
command `echo 'xxx' | base64`.  However, the echo here appends a newline
character to the string `xxx`. To avoid this, use `echo -n 'xxx' | base64`,
which will remove the extra newline character appended after the `xxx` string. 

    For much more generic configuration, using an editor or raw character output 
to check the ASCII characters, if need be may help. Editors such as vim and
Visual Studio Code can assist with viewing these characters. Alternatively, 
for small strings, the Linux command `echo 'xxx' | od -t x1`, can assist in
displaying the hex output of the echoed string. One could then use an
[ASCII](https://www.asciitable.com/) table to assist with translating the
character, which in this situation are the numbers 10 decimal (0x0A hex) and 13 
decimal (0x0D hex) for the LF and CR characters, respectively.  

    If the above fails, the next best approach is to revert back to the last known
working configuration or known defaults and incrementally test configuration changes 
going forward.

6. **Bug** - Be cognizant of bugs but don’t conclude immediately 
without checking release notes, having discussions with authors/teams and have 
concrete workings with logs on hand.  If possible, try looking through the
source code and reference lines in discussion or build tests against to validate
your assumptions. 