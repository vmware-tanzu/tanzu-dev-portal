---
Date: '2022-01-04T12:00:00-08:00'
PublishDate: '2020-09-24T00:00:00-07:00'
Description: "Secure Production with Spring Authorization Server and SPIFFE/SPIRE"
aliases:
- /tv/tanzu-tuesdays/79
draft: false
episode: '79'
explicit: 'no'
guests:
- Joe Grandja
hosts:
- Tiffany Jernigan
- Whitney Lee
- Leigh Capili
lastmod: '2021-11-30'
minutes: 60
title: "Secure Production with Spring Authorization Server and SPIFFE/SPIRE"
truncate: ''
twitch: vmwaretanzu
youtube: ""
type: tv-episode
---

The [Spring Authorization Server](https://github.com/spring-projects/spring-authorization-server) project provides support for OAuth 2.1 Authorization Framework, OpenID Connect Core 1.0 and the numerous extension specifications.  

[SPIFFE](https://spiffe.io/docs/latest/spiffe-about/overview/), the Secure Production Identity Framework for Everyone, is a set of open-source standards for securely identifying software systems in dynamic and heterogeneous environments. Systems that adopt SPIFFE can easily and reliably mutually authenticate (e.g. Mutual TLS) wherever they are running.  

[SPIRE](https://spiffe.io/docs/latest/spire-about/) is a production-ready implementation of the SPIFFE APIs that performs node and workload attestation in order to securely issue identities to workloads and verify identities of other workloads.  

The primary goal of this talk is to demonstrate how to securely configure Spring Authorization Server, Client and Resource Server with SPIRE for the purpose of issuing identities via SVIDs (SPIFFE Verifiable Identity Document).  

The following will be discussed and demonstrated:  

* Configure SPIRE
* Integrate Spring Authorization Server, Client and Resource Server with SPIRE
* Configure Mutual TLS communication between Spring Authorization Server, Client and Resource Server
* Configure OAuth 2.0 Mutual-TLS Client Authentication
* Configure OAuth 2.0 Certificate-Bound Access Tokens

The sample that will be demonstrated provides a reference implementation of [RFC 8705](https://datatracker.ietf.org/doc/html/rfc8705) OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens.

