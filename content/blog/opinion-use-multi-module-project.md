---
date: 2022-10-03
description: There are two choices for a product development repository: a multiple 12-factor codebase or a multi-module project in a single repository (monorepo). For me, the only issue with 12-factor applications lies with the first factor of the codebase.
lastmod: '2022-10-03'
team:
- Brad Davidson
title: "Opinion: Use a Multi-module Project Instead of 12-Factor Codebase"
---

There are two choices for a product development repository: a multiple 12-factor [codebase](https://12factor.net/codebase) or a multi-module project in a single repository (monorepo).


## Problems with 12-factor codebase

For me, the only issue with 12-factor applications lies with the first factor of the [codebase](https://12factor.net/codebase). If you follow this first factor, then a web-based product will have many 12-factor codebases; namely, a codebase for a gateway, each service, each shared component, a user interface, and a product/project level repository for system integration, documentation, and potentially continuous integration/continuous delivery (CI/CD) configuration. 

The problem with this is that:



* There is no indication of the related codebases, consequently, the order of checking changes across multiple 12-factor codebases can result in broken builds.
* GitFlow, a branching model for Git, can be more complex since each 12-factor codebase may or may not have the branch. Therefore, making sure all branches are applied to the main branch of each 12-factor codebase could be challenging.
* There’s a question as to when (not if) the project/product level repository will be forgotten or ignored.


## Multi-module project repository a.k.a. monorepo

Using an Apache Maven or Gradle multi-module project structure enables a web-based product to have a single repository with a gateway, services, shared components/jars, a user interface, system integration tests, deployment, product/project documentation, and CI/CD configuration.

If you’d like to learn more, here are some resources on monorepos:



* [Spring multi-module projects](https://spring.io/guides/gs/multi-module/)
* [CircleCI monorepo best practices](https://circleci.com/blog/monorepo-dev-practices/)
* [Application Continuum](https://www.appcontinuum.io/)


### My thoughts on repositories

A monorepo provides a single location for all of the product/project testing, source code, scripts, development, and documentation which results in simplified development.

The structure of the product changes with the addition of services, shared components, requirements, as well as the addition of performance tests. A monorepo makes these changes manageable; and if you are using GitFlow, one feature can span many parts of the product as a single branch. Additionally, a single Git revert to bring back a specific change that had a negative impact is not a roadblock.


#### Services


#### A monorepo enables a development team to create or extract new services within the monorepo. Using 12-factor codebases requires the creation of a new repository that communicates its existence to the developers, and I have seen this overhead become a roadblock in reverting a bad idea, since the development teams do not want to eliminate the new repository.

However with a monorepo, it is as simple as a Git revert of a change while everything remains in the repository, as well as in the history.


#### GitFlow

A monorepo supports GitFlow, as a single check-in can be the entire feature, whereas with a 12-factor codebase, there will be many check-ins across numerous repositories that have to be managed. Creating a feature branch within a monorepo is much easier than multiple branches across 12-factor repositories.


#### Components/jars

The extraction of a component can enable the extraction of common, shared code, or the logic of a service from an application. In fact, Java allows circular dependencies; and in conjunction with a component, these circular dependencies are minimized and isolated within a component.

A monorepo enables a development team to extract shared/common code from services into a component or jar without the overhead of creating a new 12-factor repository and publishing the shared component/jar to an artifact repository. 


#### System integration tests

Since a 12-factor codebase repository has only a single gateway, service or user interfaces support unit and application tests. However, system integration tests require another 12-factor repository. Unfortunately, this separate 12-factor repository with the system integration tests goes out of date quickly because nothing in the building of the other 12-factor codebase forces the execution of the system integration tests.

Monorepo has the gateway, services, and user interface within the same repository-enabled system integration tests that are executed as part of the build, ensuring the product works as expected prior to deployment into an environment.


#### Deployment

A 12-factor repository can support independent deployment of a gateway, service, or user interface, but when the entire web-based product needs a blue-green deployment,  then a project/product level 12-factor repository is needed to deploy the artifacts.

The style of deployment does not change the monorepo, as a monorepo supports any style of deployment (e.g., independent, rolling, canary, and blue-green). The artifacts can be part of the monorepo and does not require an artifact repository, however, 12-factor repositories must use an artifact repository.


#### Product and project documentation

With a twelve-factor repository, the project development setup might have to be duplicated in each of the repositories. In this case, changes are multiplied if a change occurs in the development tooling, or, a project/product twelve-factor repository would be needed. A monorepo is the single source for the documentation and details the steps to set up a development environment.


#### Re-architecture

With a twelve-factor repository, a re-architecture can be challenging with the creation of new, or even elimination of, twelve-factor repositories. The Git history could actually be lost. 

Finally, I have seen a team struggle with reverting a re-architecture that did not deliver the expected results because the time invested in the new direction—or reverting—was too complex.

A monorepo allows for a re-architecture to be a single check in, and if it does not deliver the expected results, enables you to employ a simple Git revert.


## Conclusion

For me, the obvious choice for repositories is a monorepo thanks to its simplicity of a single source for all of the tests (unit, application, and system integration), source code, documentation, deployment, its support for GitFlow branching, and its comprehensive history of changes. And lastly, when a component or service becomes shared by another product, it's time to turn that into its own repository and published artifact.
