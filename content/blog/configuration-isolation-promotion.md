---
title: "Configuration Isolation and Promotion: Why did the config property cross the road?"
description: Configuration (config) should exist in the environment and not be packaged with apps. Each build of an app is a single artifact that has many deployments in different environments. A deployment in one environment must have its config isolated from others to avoid config pollution. Teams need to determine a promotion strategy for moving config between environments.
date: "2023-02-16"
lastmod: "2023-02-16"
level1: Building Modern Applications
level2: Modern Development Practices
tags:
- configuration
- config
- Applications
# Author(s)
team:
- Scott Steele
---

**Dig, if you will, this real world example…** In which some engineers believe that they can better meet their product’s service level objectives (SLOs) by tuning their database connection pooling. They decide to conduct an experiment in development by making changes to connection pooling properties in a base configuration file shared by all applications in the environment because *they believe* the change will benefit all apps (i.e., they want to make a global change to just their development environment). The change is aimed towards measuring its impact before and after.

All of this is well-intentioned and good, except for the fact that the change to the base configuration file is visible to applications in other environments, including production. Eventually, one of the apps in production restarts and fetches its configuration that now includes the change that was only intended for development. The connection pooling change adversely impacts its performance, and now your customers are affected. How did this happen?

Production’s configuration set was polluted by a development configuration change. The problem is that the same backing configuration repository was used across environments. Let’s say that engineers even had separate configuration files for environment-specific properties and assumed that file-based seclusion would be enough. It was not.

This article explores some simple ways to cope with moving changes in externalized configuration through multiple environments.

## Key Terms

Before digging into the content, it is necessary to align on the meaning of some key terms:

- **Configuration** – Anything that can change between different deployments of a single artifact.

- **Externalized configuration** – When config exists in the deployment environment and is not packaged as part of an artifact. It is one of the factors defined in the [12 factor methodology](https://12factor.net/config).

- **Config pollution** – When a set of configuration contains unintended properties or values. This is caused by config targeting one environment being used at runtime in another. This is a separate issue from config sprawl, which is essentially just poorly organized configuration that is difficult to understand or change with confidence. Avoiding config sprawl is beyond the scope of this article.

- **Config isolation** – Preventing config in one environment from polluting another. Only the config for a given environment is accessible in that environment.

- **Config promotion** – The process for moving config from one environment to another. A good promotion process provides:
  - Easy ways to differentiate between the old and new states
  - Clear records of change
  - Convenient means of reverting the promotion

- **Config server** – A service that provides config to applications at runtime. Configuration may be blended with secrets in a way that is hidden from the application. Secret management is beyond the scope of this article. (For clarification, use of the term “config server” in this article does not necessarily refer to Spring Cloud Config Server—although that can be an excellent choice!)

## Config isolation and promotion practices

The following practices all take a [GitOps](https://tanzu.vmware.com/gitops) approach for isolation and promotion. If config exists as part of the environment, we should treat it as [Infrastructure-as-Code](https://www.vmware.com/topics/glossary/content/infrastructure-as-code.html). It is just as important to have a clearly defined promotion strategy for config as it is for code. It is up to the team to select the approach that best suits their product, because none of them are a one-size-fits-all solution.

These practices assume all configuration that is provided to applications at runtime is backed by a Git repository, and that promotion between environments occurs via a pull request. Whether the values in version control are used to automate the creation of environment variables, [Kubernetes ConfigMap manifests](https://tanzu.vmware.com/developer/guides/app-enhancements-externalizing-configuration/), or files to be read by a config server, the means by which config is delivered to an environment does not necessarily dictate the isolation and promotion strategies used. Promotion-through-pull-request has the advantage of meeting the requirements for a good promotion in the process outlined above as the

- Git diff itself shows the difference between old state and new
- Git commit log is a record of change
- Git revert provides a means of restoring config to a known, stable state

The means by which isolation is accomplished is therefore the main difference between the practices that follow.

## Configuration packaged with the app

Through packaging configuration with the application, config promotion and isolation are managed through differences in its builds. This approach makes operating in a cloud native model more difficult. It is discussed here simply to show how it slows down software development.

How *would* it look if changes to config were moved with the application code?
When config is packaged with the app, it becomes part of the artifact. In order to make a config change, a new artifact must be built—which would require having multiple builds for each special deployment. If all goes well, the pipeline is just slower because it has to execute multiple, nearly redundant builds.

With this approach, what is the difference between hard coding a bunch of strings in the code versus using some YAML or JSON files packaged with the app?

Perilously, packaging config with application code would preclude it from being truly promoted to environments. For example, a team would build and deploy an app to development and all would seem okay. They would then take their changes forward and do another build and deploy it to staging. After being thoroughly tested and scanned along the way, they would then be ready for production. The new artifact built for prod would run for the very first time in production without going through any of the rigorous gates in the team’s [Path-to-Production](https://tanzu.vmware.com/developer/practices/path-to-production-mapping/) because it was not the same artifact as what was in dev or staging! Fingers crossed.

Now there are easier ways.

## File and profile isolation, a.k.a. the danger zone

File isolation separates properties targeting various environments by file. Profile isolation does the same through profiles that are either active or inactive at runtime.

File and profile isolation are treated together because they belie the same assumption: that they can prevent config pollution through conventions enforced by human consistency and discipline. Human errors will be made; conventions erode. Eventually, somehow, the wrong properties will be exposed to the wrong environment. Mistakes of this class are easier when properties are visible to applications for which they are not intended. Access of any kind should be limited on an as-needed basis. Why would config be any different?

Sprawling profiles also have the disadvantage of being difficult to diff or understand. They often contribute to config sprawl because it can be difficult to track down the source of a given property or make it easier to accidentally overwrite one.

The connection pooling change mentioned earlier is an example of file isolation. It is common to have some base config file that applies to all applications. It is dangerous for it to be visible to all environments because there is no way to make an isolated change to it—there is no promotion as it is already visible to all environments. Welcome to the danger zone.

## Branch isolation

With branch isolation, a single repository is used, and the config for each environment lives on its own branch. Promotion with this approach is as simple as a pull request from one branch to another. It is easy to determine what properties are being promoted because the Git diff between branches is the same as the difference between the two environments. It balances the need for isolation with ease of promotion.

Going back to our connection pooling example, say that staging is the next environment after development in the application’s path to production. Then, moving the new setting out of development is just a pull request from the dev branch to staging. Since the production config server is backed by the production branch, there is no chance of polluting the environment with configuration from lower environments because it does not yet exist in the production branch.

## Repository isolation

Repository isolation is perhaps the most extreme form of isolation. Configuration for each environment is segregated into separate repositories. The config server is then backed by a completely isolated repository. This approach has the drawback that—unless these repositories are upstreams of each other—promotion may be more tedious. Diffing might occur between different directories on a developer’s local machine. Nevertheless, teams may find this level of isolation necessary. The actual change is still a Git pull request, which retains the advantages listed above.

## An \[In\]conclusion

If you were hoping to find a definitive—even absolute—recommendation, you will find this article lacking. Although it presents a strong bias towards branch and repository isolation, the right solution depends on the needs and practices of the team. This article’s aim is to shed light on an underrecognized problem and put options on the table for dealing with it.

Why did the config property cross the road? Because someone promoted it?

I am not a comedian.

**Credit where it is due**, *the isolation and promotion practices examined in this article owe much to numerous conversations I have had with fellow engineers around patterns for externalizing configuration, including Brian Kelly, Doug Saus, and DaShaun Carter.*

**Confession**, *the real world example is actually a shameless amalgamation of examples observed in the wild. Nevertheless, it seemed like it would convey more truth than a single incident.*

About the author
Scott Steele is a software engineer, XP practitioner, fierce advocate for new classical music, and coffee drinker. When he is not on a mountain somewhere, you can find him at home with a book because who leaves home that much these days?
