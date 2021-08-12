---
title: Introduction
weight: 5
layout: single
team:
  - VMware Tanzu Labs
---

This lab will walk you through steps necessary to setup your lab
environment should you choose to run the labs.

Make sure to review the
[Introduction slides](https://docs.google.com/presentation/d/16TP2QgOiYvU6ZcOJ1nhha2UlgETdR2AoO5mXiMCdsFE/present) before
proceeding.

## Outcomes

After completing the lab, you will have and environment with the
following:

- Your lab codebase setup on a local workstation
- Your Github repository will be set up with a Personal Access Token.

You will also be able to navigate the lab codebase start and solution
points,
in case you wish to checkout the solution,
or get stuck.

## Project structure and codebase

The codebase structure will include a local git repo:

1.  Create the following directory in your user profile,
    also known as the `HOME` directory:

    ```bash
    mkdir ~/workspace
    ```

    **NOTE:**
    **The lab instructions assume you will run all your terminal**
    **commands**
    **from a `bash` shell.**

    **Notice the use of the `~` shortcut for the home directory.**

1.  Navigate to the `workspace` sub-directory of your home directory.

    Vmware Tanzu Labs engineers practice [pair programming](https://en.wikipedia.org/wiki/Pair_programming)
    and rotate pairs quite frequently, usually two to three times per
    week.
    Because of this, a developer may be assigned to a different
    workstation on any given day.
    To reduce friction, Vmware Tanzu Labs engineers adopted this
    standard setup for where all project code is located.

    These lab instructions will assume from now on that your code is in
    this directory.

1.  The
    [pal-tracker codebase](https://github.com/platform-acceleration-lab/pal-tracker/archive/refs/tags/platform-acceleration-release-12.3.52.zip)
    contains a local Git repository with the starting points and the
    solutions for all the labs in this unit.
    Download the linked zip file and extract the codebase in the
    `~/workspace` directory.
    The extracted directory will contains a single text file as well as
    the (hidden) Git files.
    You will be building up the code in this directory bit by bit, and
    we have provided reference implementations at each stage identified
    by tags in the Git repository.

## Git

This course makes extensive use of the git command line interface.
You can use UI tools of your choice,
but you will get better understanding of how git works by using
its CLI.

You may wonder why there is so much emphasis on Git in this course.
That is because source control versioning and
[trunk-based development](https://trunkbaseddevelopment.com) are
fundamental to modern development practices.

If you are not proficient using the git command line client,
make sure to checkout the
[Git Primer](#git-primer) section at the end of this lab.

## Github

You will use Github as your remote repository in this course,
as well as Github Actions as your pipeline automation tool.

You will do some set up to prepare:

1.  [Create a Github Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).
    Make sure to record this for future reference when you are prompted
    to authenticate to Github.

1.  [Create a Github repository](https://help.github.com/articles/create-a-repo/)
    called _pal-tracker_ in your GitHub account.

1.  [Add this repository as a remote](https://help.github.com/articles/adding-a-remote/)
    called _origin_ of your local repository.
    You will push all of your work to this repository during the next
    few labs.

    You can make the repository public or private,
    but
    **do select any of the *initialize this repository with***
    **options.**

1.  Before your push your local repository to the remote,
    set up a repository scoped configuration when you authenticate to
    Github in the next step:

    ```bash
    git config credentials.https://github.com.username <your github username>
    git config credential.helper cache
    git config --global credential.helper 'cache --timeout=7200'
    ```

    This will make sure that if have any other github or gitlab
    credentials you are using on your local workstation will not
    conflict with your personal github credentials you use for this
    repository,
    and will cache your credentials
    (after the first time you authenticate) for up to the `--timeout`
    setting in seconds.
    The example is set for 2 hours,
    but you can set lower or higher as your comfort level dictates.

1.  You will start by pushing the initial commit to GitHub,
    complete with the start and solutions tags.

    ```bash
    git push origin main --tags
    ```

1.  You can then navigate to GitHub and view the solution tags.
    This is handy when you get stuck during a lab and need a little help.

    You can also use [GitHub's compare functionality](https://help.github.com/articles/comparing-commits-across-time/)
    to compare your code to the solution.

## Bootstrap a gradle project

You will use Gradle as your build and dependency management system.

1.  Create a [gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:adding_wrapper)
    in the project root directory (`~/workspace/pal-tracker`) with
    a `gradle-version` of `7.1.1` and `distribution-type` of `all`.

    ```bash
    gradle wrapper --gradle-version 7.7.1 --distribution-type all
    ```

1.  Create an empty `build.gradle` file in the same directory.

1.  Stage and commit your changes locally with a commit message of
    "added gradle wrapper to initial project":

    ```bash
    git commit -m'added gradle wrapper to initial project'
    ```

## TAS CLI

You will interact with Tanzu Application Service is via the _Tanzu
Application Services CLI_.

1.  Verify the CLI is installed correctly by running

    ```bash
    cf --help
    ```

    which will show a list of available tasks.

1.  To view more information about each task, use the `--help` flag.
    For example, use the following command to find more information
    about the `login` command:

    ```bash
    cf login --help
    ```

### CF target

The CF CLI can interact with multiple installations of TAS so you need
to *target* a specific installation (also called a foundation).
Targeting means telling your CLI about the API endpoint for a
foundation.

1.  Use the `login` command to log in to your Tanzu Application Services foundation's
    API endpoint.

1.  Verify the CLI has targeted the correct foundation by using the
    `target` command.


## Wrap up

You have set up your lab environment and are ready to start building
an application.

Review the
[Concepts slides](https://docs.google.com/presentation/d/18XyFmx1SoHU03arGPNVNfplJDxEKSi6dXdl5U_Atylk/present#slide=id.ge9c23810de_0_0)
to get familiar with some basic concepts.

## Git Primer

If you are not proficient with the Git CLI,
you will get value from reviewing this section.

Becoming proficient with Git can take a lot of time.
There are a lot of features,
a lot of ways of doing the same things.

This course will use git in specific ways,
the following sub-sections list some common uses of Git that
you will encounter in this course.

### Navigating the codebase

1.  Take some time to navigate through the tags and branches using the
    following command:

    ```bash
    git log --graph --decorate --oneline --all
    ```

    You can also set a git `lola` alias for this command as follows:

    ```bash
    git config alias.lola "log --graph --decorate --oneline --all"
    ```

1.  You will see start and solution tags for each of the coming labs,
    with the most recent commit at the top,
    and the initial commit at the bottom.

    ```no-highlight
    * 307c6b2 (tag: rolling-upgrade-solution) rolling update
    * 5e66cdf (tag: scaling-availability-solution) harden cloud foundry configuration for production
    * 0297055 (tag: scaling-availability-start) Add production tuning parameters to manifest, autoscaling scripts
    * cd0aaa3 (tag: actuator-solution) Add actuator dependency and configuration
    * a6305cf (tag: actuator-start) Add instrumentation for pal-tracker failure
    * 38decca (tag: jdbc-solution) Persist time entries in database
    * 00974ae (tag: jdbc-start) Add tests for persisting time entries in database
    * 087905f (tag: migration-solution) Add migrations and pipeline changes
    * c5a3bdf (tag: migration-start) Add task for migrating databases
    * 18e4e96 (tag: mvc-solution) Add TimeEntry MVC in memory
    * bc09138 (tag: mvc-start) Add tests and inmemory repo implementation for MVC lab
    * 5929ac7 (tag: pipeline-solution) Update route
    * 25bc37f (tag: pipeline-start) Add deployment pipeline
    * 3fc69ee (tag: configuration-solution) Add manifest file for configuration and deployment to PCF
    * 02e3279 (tag: configuration-start) Add tests for configuration lab
    * 5457bea (tag: spring-boot-solution) Simple Spring Boot app
    * 0ac8b7f (HEAD -> main, tag: spring-boot-start, origin/main, origin/HEAD) Initial commit
    ```

1.  Notice that `HEAD` is pointed to the first (initial) commit.
    This is the start point for the course,
    and as you complete each lab,
    you will create your own history and commits separate from the
    solutions.

    The `--all` and `--graph` options will show you the entire branch
    history in a graphical form.

1.  If you are only interested in seeing a summary of your current
    branch,
    you can run the following command:

    ```bash
    git log --graph --decorate --oneline
    ```

    You can also set a git `lol` alias for this command as follows:

    ```bash
    git config alias.lol "log --graph --decorate --oneline"
    ```

### Git Ignored files

1.  Take a look at the `.gitignore` file:

    ```bash
    cat .gitignore
    ```

1.  This file tells Git to ignore certain files that should not be
    stored in version control such as:
    - built artifacts
    - temporary files
    - editor or IDE generated files

### View a solution

Sometimes you will want to peek at a solution file if you get stuck.

1.  Use the following command:

    ```bash
    git show <solution tag>:<path to file>
    ```

1.  An example:

    You want to view the `WelcomeController` class you will author in
    the next lesson:

    ```bash
    git show spring-boot-solution:src/main/java/io/pivotal/pal/tracker/WelcomeController.java
    ```

    The output will be the contents of the file.

1.  You can also view all the solution commits in git diff form:

    ```bash
    git show <solution tag>
    ```

### Comparing your workspace to a solution

You can run the `git diff` command to view differences:

1.  View the different in a file:

    ```bash
    git diff <solution tag>:<path to file> <path to workspace file>
    ```

1.  For example,
    If wanting to view the difference for the `build.gradle` file you
    create later in this lab,
    to the one in the next lab:

    ```bash
    git diff spring-boot-solution:build.gradle build.gradle
    ```

    The output will be in a git diff format.

    You may find IDEs have better diff viewers.

### Checking out a file from a solution

If you get stuck,
and merely want to take solution files into your workspace,
you can run the `git checkout` command:

1.  Run the following:

    ```bash
    git checkout <solution tag> <path to file>
    ```

1.  An example:
    In the next lab you will add contents to the `build.gradle` file
    that you create later in this lab.
    You want to go directly to the solution:

    ```bash
    git checkout spring-boot-solution build.gradle
    ```

1.  The outcome of running the command will be to overwrite your
    workspace changes with the solution,
    and it will be staged.

### Clean your workspace

Sometimes you may what to clean your workspace,
and revert to the last local committed state.

Run the following command:

```bash
git stash --include-untracked
```

This will tuck away any changes that you did in a hidden,
local, private branch in case you wish to recover your work via
`git stash pop` command.

If you are sure to want to throw out any stashed work out permanently,
run `git stash clear` command.

### Staging and commiting your changes

Many IDEs and UIs mask the local git workflow.
When using the command line CLI,
make sure you are using the following workflow when making and pushing
changes to your remote:

1.  Verify the state of your workspace with the `git status` command.
    Unstaged changes will be annotated in *red*,
    staged changes will be annotated in *green*.
    Everything else in your workspace is either ignored
    (annotated in the `.gitignore` file),
    or already committed in your local repository.

1.  Stage your changes with the `git add` command.

    Run `git status` to verify your staged changes appear in *green*.

1.  Commit your changes with the `git commit` command.
    Add the `-m` option with the commit message in single or double
    quotes.

    Run `git status` to verify your committed changes no longer appear
    in either staged or unchanged list.

### Fast-forward

In this course you will be directed to *fast-forward* in some of the
labs by "cherry picking" git repo commits or tags.

In most cases,
the lab instructions will have you pull in pre-authored tests or
solution files that you will not have to author.

1.  The `git cherry-pick` command is used to apply a pre-existing commit
    into your workspace.

    If you want to pull in the commit for the entire solution of a lab that
    you are working,
    you can run the cherry-pick as follows:

    ```bash
    git cherry-pick <solution tag>
    ```

    If you want to skip certain labs,
    you can cherry-pick your way to it.

    **But there is a caveat:**
    **You must have a clean workspace,**
    **with no unstaged changed.**
    **[Clean your workspace](#clean-your-workspace) if necessary.**

1.  An example:

    -   You want to skip ahead to the start of the
        [Deployment Pipelines Lab](../pipelines/) after this
        introduction lab.

    -   You will need to fast-forward from start of the spring boot
        application lab to the start of the deployment pipeline labs:

        ```bash
        git cherry-pick spring-boot-solution
        git cherry-pick configuration-start
        git cherry-pick configuration-solution
        git cherry-pick pipeline-start
        ```

    -   Review the status of your workspace:

        ```bash
        git status
        ```

        You will see that your local history is ahead of your
        remote by 4 commits that you just cherry-picked:

        ```no-highlight
        On branch main
        Your branch is ahead of 'origin/main' by 4 commits.
          (use "git push" to publish your local commits)

        nothing to commit, working tree clean
        ```

    -   Review the git log:

        ```bash
        git log --oneline --decorate --graph --all
        ```

        You will see:
        -   4 new commits on a divergent branch from those
            associated with the start and solution points.

        -   The 4 new commits have the same commit patch and
            commit messages as those associated with the tags
            cherry-picked.
            **But they are not the same commits**.

        -   Local `HEAD` is pointed to the last commit generated
            by the last cherry-pick,
            but the remote `HEAD` still points to the initial
            commit.

        and that `HEAD` is at the last commit generated with
        the cherry-pick.

        ```no-highlight
        * 6fa5aa2 (HEAD -> main) Add deployment pipeline
        * c6df538 Add manifest file for configuration and deployment to PCF
        * 88c30fc Add tests for configuration lab
        * 9f4286d Simple Spring Boot app
        | * 307c6b2 (tag: rolling-upgrade-solution) rolling update
        | * 5e66cdf (tag: scaling-availability-solution) harden cloud foundry configuration for production
        | * 0297055 (tag: scaling-availability-start) Add production tuning parameters to manifest, autoscaling scripts
        | * cd0aaa3 (tag: actuator-solution) Add actuator dependency and configuration
        | * a6305cf (tag: actuator-start) Add instrumentation for pal-tracker failure
        | * 38decca (tag: jdbc-solution) Persist time entries in database
        | * 00974ae (tag: jdbc-start) Add tests for persisting time entries in database
        | * 087905f (tag: migration-solution) Add migrations and pipeline changes
        | * c5a3bdf (tag: migration-start) Add task for migrating databases
        | * 18e4e96 (tag: mvc-solution) Add TimeEntry MVC in memory
        | * bc09138 (tag: mvc-start) Add tests and inmemory repo implementation for MVC lab
        | * 5929ac7 (tag: pipeline-solution) Update route
        | * 25bc37f (tag: pipeline-start) Add deployment pipeline
        | * 3fc69ee (tag: configuration-solution) Add manifest file for configuration and deployment to PCF
        | * 02e3279 (tag: configuration-start) Add tests for configuration lab
        | * 5457bea (tag: spring-boot-solution) Simple Spring Boot app
        |/
        * 0ac8b7f (tag: spring-boot-start, origin/main, origin/HEAD) Initial commit
        ```

    -   You need to push your changes to the remote to complete
        the fast forward:

        ```bash
        git push origin main
        ```

    Note that the fast-forward is the for the codebase only,
    you will also have to push your application to TAS.
