---
title: Log4Shell Vulnerability Spotlights the Importance of Adopting Trusted Open Source Software Providers for the Enterprise
description: In this blog post, you will learn about the responses and mitigations that have been released to alleviate the impact of the Log4Shell vulnerability, which patches are available to keep your installations secure and how  VMware Application Catalog (VAC) is the definitive alternative for the enterprise to the endless manual fixes and component updates.
date: 2021-12-21
lastmod: 2021-12-21
level1: Building Modern Applications
level2: Services
tags:
- VMware Marketplace
# Author(s)
team:
- Martin Perez
- Raquel Campuzano Godoy
---

On December 9, a vulnerability in one of the most popular Java libraries was revealed. Log4j (version 2) was affected by a zero-day exploit that resulted in Remote Code Execution (RCE), allowing attackers to do remote code execution in vulnerable environments. At this stage, everyone has heard about [CVE-2021-44228](https://www.randori.com/blog/cve-2021-44228/), also known as [Log4Shell](https://www.lunasec.io/docs/blog/log4j-zero-day/). 

Log4j is a library prevalent in Java ecosystems used by millions of applications everywhere, so the impact of this CVE has been massive. Proof of its impact is the high CVSS score given to this CVE: 10 out of 10. 

Also, products from major cloud vendors, such as [AWS](https://aws.amazon.com/security/security-bulletins/AWS-2021-005/), [Intel](https://www.intel.com/content/www/us/en/security-center/advisory/intel-sa-00646.html), [Cisco](https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-apache-log4j-qRuKNEbd?vs_f=Cisco%20Security%20Advisory&vs_cat=Security%20Intelligence&vs_type=RSS&vs_p=Vulnerability%20in%20Apache%20Log4j%20Library%20Affecting%20Cisco%20Products:%20December%202021&vs_k=1#vp), [RedHat, and even VMware](https://www.vmware.com/security/advisories/VMSA-2021-0028.html), have been largely affected by the vulnerability. The impact on businesses was enormous, causing most engineering and operations teams to stop their daily activities and product development in order to prioritize applying patches coming from upstream projects and patching their own in-house built software to attend to this critical vulnerability. Considering the potential effects and risks that this vulnerability can have on applications and sites built using this library, the team behind Log4j immediately started to work on a fix. 

In this blog post, we go over the responses and mitigations that have been released, how some of them didn’t solve the problem, and which patches are available to keep your installations secure against this vulnerability. 

Furthermore, we introduce the VMware Application Catalog as the definitive alternative for the enterprise to the endless manual fixes and component updates that development teams must perform when a huge vulnerability such as Log4Shell happens. As a library of prepackaged open source application components that are continuously maintained and verifiably tested, VMware Application Catalog brings developers and operators a way of consuming open source software without compromising security. 

## A retrospective of Log4Shell fixes and mitigations

Many of the mitigations that were assumed to be viable have already been [discredited](https://logging.apache.org/log4j/2.x/security.html), as new attack vectors have appeared. Initially, it was thought that** newer Java Development Kits (JDK's) **were not affected,** **but some people [did prove](https://twitter.com/royvanrijn/status/1470308995038547969) that it was still possible to easily bypass the limitations introduced by those recent JDK's and reproduce the attack. 

**Disabling remote lookup when logging messages** is another insufficient measure that initially was considered possible, but it was found later that the properties governing remote lookup were not being enforced in all possible scenarios.

Moreover, while RCE was the focus of the original exploit, some [members of the open source community](https://twitter.com/dildog/status/1469786190144585729) demonstrated new vector attacks, such as the ability to leak out secrets that might exist as environment variables in vulnerable servers. These can later be mined by attackers from access logs, which might have already been used in the wild as John Graham-Cumming from [CloudFlare](https://blog.cloudflare.com/actual-cve-2021-44228-payloads-captured-in-the-wild/) explains [in this blog post.   ](https://blog.cloudflare.com/actual-cve-2021-44228-payloads-captured-in-the-wild/)

Another vector attack that was reported is a Denial-of-Service (DOS) attack, where systems can be taken down by triggering thousands of log messages that end up trying to open thousands of remote connections, or triggering uncontrolled recursion from self-referential lookups. This DOS attack triggered the creation of CVE-2021-45105.

Initially, the 2.15 patch pushed to the Log4j2 codebase was insufficient [for completely mitigating the original issue](https://www.lunasec.io/docs/blog/log4j-zero-day-update-on-cve-2021-45046/). For this reason, a new CVE was raised, [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046), and a new Log4j2 version, 2.16, [was released](https://logging.apache.org/log4j/2.x/download.html#). For those who are running on the original, already-deprecated `Log4j1` library, that does not mean they are exempt from danger. This library is also vulnerable in some scenarios, although it is more elaborate, and there is no released fix yet.

On December 19, the Apache Software Foundation released [Log4j2 2.17](https://logging.apache.org/log4j/2.x/download.html), which incrementally solves the DOS problems raised on [CVE-2021-45105](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45105) and which completes, at least for now, a frenzied couple of weeks of activity in the security space around the Apache logging libraries.

If you are affected and on Log4j2, the safest options are to upgrade to Log4j2 2.17 or to remove the JndiLookup.class from the application’s classpath as suggested in [Apache Log4j security notes](https://logging.apache.org/log4j/2.x/security.html). 

## The need for a trusted source for consuming open source components

Against this backdrop, we have learned that when a vulnerability appears in any of the components or libraries upon which our applications are built, all our infrastructure can be  compromised. 

As a consequence, developers and operators must always monitor the upstream code source of their applications and keep all app dependencies up to date. Otherwise, all their systems can easily be exposed to uncountable damage. 

But that is an enormous effort that few organizations can afford. And, the most important question: Is it viable to have dozens of people tracking all these dependencies, making sure that they are kept up to date, healthy, and patched with the latest CVE fixes, while guaranteeing internal compliance, instead of focusing on building new solutions for the company?

Many organizations are becoming more aware of the challenges associated with software supply chain security. This includes governments and federal agencies. Of particular interest is, for example, United States President Joe Biden’s [executive order](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/02/24/executive-order-on-americas-supply-chains/) on [improving the nation’s cybersecurity](https://www.federalregister.gov/d/2021-10460), which directed the National Institute of Standards and Technology (NIST) to give guidance on supply chain security. As part of that, Appendix F of the [Cyber Supply Chain Risk Management Practices for Systems and Organizations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-draft2.pdf) goes over specific OSS controls:

{{% callout %}}
Open Source projects are diverse, numerous, and use a wide range of operating models. Many of these projects’ provenance, integrity, support maintenance, and other underlying functions are not well understood or easy to discover and vary from one project to the next.
{{% /callout %}}

As we see in the Log4j case, this situation [has struck many](https://twitter.com/WeldPond/status/1469313738029289476) companies that were running older versions of Log4j and Java. The Log4j2 patches, for example, require Java 8. Anyone running in Java 7 and below is vulnerable to these attacks. And while the team behind Log4j is working on a fix, it is not clear when that might be delivered. 

When something like Log4Shell turns into “Log4Hell,” having a unique, private, and trusted source for consuming open source application components, such as VMware Application Catalog, is a must. 

VMware Application Catalog provides a rich library of prepackaged and trusted building blocks in the form of containers, Helm charts, and virtual machines delivered directly into a private repository of choice. 

All solutions available in the catalog are continuously updated with upstream code changes, rebuilt, tested—by running several CVE and antivirus scans—and pushed to the customer registry. All the metadata is available to you, so you can always be informed about the versions, the fixes, and the scan results that each package bundles and passes. Thus, VMware Application Catalog users have the confidence of running only trusted and secure components and apps on their production environments.  

In addition to this, VMware Application Catalog allows you to customize the library of available assets by selecting the base OS you want to use for each image. This flexibility enables a superior self-service experience for developers, while seamlessly enforcing compliance, security, and operational best practices.

These capabilities make VMware Application Catalog an invaluable asset for companies that  need to rapidly bring applications to production while improving productivity through automation of manual processes such as monitoring and keeping application dependencies updated.  

To learn more, read about VMware Application Catalog on our [product page](https://tanzu.vmware.com/application-catalog), browse through all [applications available on VMware Application Catalog](https://app-catalog.vmware.com/catalog), or read our [newly updated technical documentation](https://docs.vmware.com/en/VMware-Application-Catalog/index.html). For more questions, reach out to the product team directly at <app-catalog@vmware.com>.   
