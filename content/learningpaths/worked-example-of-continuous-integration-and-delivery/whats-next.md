---
layout: single
team:
- Paul Kelly
title: What's Next?
weight: 60
---

# What next?

I hope this is a helpful example to get you started with creating an automated pipeline and to get you thinking about all the ways you can improve on it to run something similar in production. Some of the configuration and technology choices were driven by the desire to keep it as simple as possible, but there is a lot of room to iterate on this design and improve it. 

Here’s a starter list of things that could be improved, but there are likely many more depending on what you are trying to build, as well as your environment: 



1. Set up a Persistent Volume for Jenkins that you can manage and back up. The [Jenkins instructions for deploying to Kubernetes](https://www.jenkins.io/doc/book/installing/kubernetes/) show you how to do this for minikube, but you could easily adapt those instructions for any Kubernetes cluster.
2. Use a Persistent Volume that can be shared between Jenkins agents to persist the Maven repository. At the moment, every build downloads all the Maven dependencies every time, which increases the build time. 
3. Host your own image repository for builds rather than using Docker Hub. This makes it easier to set up webhook triggers back to Jenkins. It also avoids the problem of rate limiting for image pulls that happens with free Docker Hub accounts. We recommend [Harbor](https://goharbor.io), but there are other choices. 
4. This example used kpack for builds because it is free and relatively easy to set up. But you should take a look at [VMware Tanzu Build Service](https://docs.vmware.com/en/VMware-Tanzu-Build-Service/index.html), which is based on kpack but adds features that make it more suitable for an enterprise environment. 

Thank you for reading to the end! 
