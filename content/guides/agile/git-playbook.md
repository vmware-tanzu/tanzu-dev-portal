---
date: '2021-02-24'
lastmod: '2021-05-17'
linkTitle: Git Playbook
patterns:
- Deployment
tags:
- Git
title: Git Playbook
topics:
- Agile
oldPath: "/content/guides/agile/git-playbook.md"
aliases:
- "/guides/agile/git-playbook"
level1: Agile Transformation and Practices
level2: Agile Development
---

Git is a free and open source version control system that is widely used in the open source community, including well known git repositories such as GitHub and GitLab. If you are unfamiliar with Git, it’s worth taking a few moments to familiarize yourself with it.  A simple guide can be found at [http://rogerdudler.github.io/git-guide/](http://rogerdudler.github.io/git-guide/).

## Gitflow

Gitflow enables you to work on your own feature branch in isolation before committing to the main project branches, i.e. develop and master.  Features may be driven from your preferred project planning tool as assigned tasks.  Gitflow helps manage the Git history to reflect the progress against specific issues.

## Install GitFlow

{{< tabpane >}}
{{< tab header="OS X" >}}

```bash
brew install gitflow
```

{{< /tab >}}
{{< tab header="Linux" >}}

```bash
apt-get install gitflow
```

{{< /tab >}}
{{< tab header="Windows (via Cygwin)" >}}

{{% callout %}}
**Note**: `wget` and `util-linux` are required to install gitflow.  For more detailed instructions see [https://github.com/nvie/gitflow/wiki/Windows](https://github.com/nvie/gitflow/wiki/Windows)
{{% /callout %}}

```bash
wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash
```

{{< /tab >}}
{{< /tabpane >}}


## GitFlow initialization and settings

1. From the local repository directory (e.g. /universal-imports),

```bash
git flow init
```

2. Use the following settings when prompted for the gitflow prefixes,

```bash
master = master
develop = develop
feature = feature/
release = release/
hotfix = hotfix/
support = support/
versiontag = -v
```

## GitFlow workflow

1. Before starting a feature branch ensure that you have the latest code from the `develop` branch,

```bash
git checkout develop
git pull
```

2. Start a feature branch by typing, `git flow *feature identifier*` For example, if your feature has an ID of 007, you would execute:

```bash
git flow feature start 007
```

3. Now, start committing changes to your feature.

	- You can propose changes (add it to the Index) using,

    ```bash
    git add <filename>
    ```

    or

    ```bash
    git add *
    ```

	- To commit these changes to your local repository:

    ```bash
    git commit -m "#007 Commit message"
    ```

    (Be sure to start the message with your feature ID or feature name.)

4. Refer to the following [guidelines](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for writing commit messages.  For example,

    ```bash
    > PSE-007: Summarize clearly in one line what the commit is about
    >
    > Describe the problem the commit solves or the use
    > case for a new feature. Justify why you chose
    > the particular solution.
    ```

5. Optionally, publish a feature branch to the remote server so it can be used by other users,

    ```bash
    git flow feature publish 007
    ```

6. When done with the feature, use:

    ```bash
    git flow feature finish 007
    git push
    ```


7. Then delete the remote feature branch (if it was created):

    ```bash
    git push origin :feature/007
    ```

8. Then delete the local branch (if it still exists. git flow will usually delete it for you):

    ```bash
    git branch -d feature/007
    ```

## Resolve Unstaged Change Warnings

Resolve unstaged change warnings using:

```bash
git stash
git push (i.e. push your staged commits)
```

You can switch to another branch to work on another feature, etc.
To bring back your stashed changes:

```bash
git stash pop
```

## Avoid Fast-forward Merges

Suppose you are working on "feature/007" and there have been changes in the meantime to the "develop" branch.

### Approach 1 - Pre-sync the target branch

```bash
git checkout develop
git pull
git checkout feature/007
git flow feature finish 007
```

### Approach 2 - Merge the branches with the "no fast-forward" flag

```bash
git flow feature start 007
git flow feature publish 007
```

Instead of using "git flow feature finish 007" (because it causes a fast forward at this point)

```bash
git checkout develop
git pull
git merge --no-ff feature/007
git push origin develop
```

## Git Tips and Tricks

### Checkout a specific tag

This can be useful if you want to use a specific tagged version for a deployment:

1. List the available tags:

    ```bash
    git tag -l

    ...
    v3.10.0
    v3.11.0
    v3.14.0
    v3.15.0
    v3.16.0
    v3.17.0
    ```

2. Checkout a specific tag:

    ```bash
    git checkout tags/v3.16.0

    M	/universal-imports/modules
    Note: checking out 'tags/v3.16.0'.
    ...
    ```

### Undo or rollback a Git commit

Assuming you have not yet pushed commits to the remote repository, you can rollback to the previous commit:

```bash
git reset --soft HEAD^
```

To rollback the last three commits,

```bash
git reset --hard HEAD~3
```

### Resetting a local branch to exactly match a remote branch

Set your local branch to exactly match the remote branch:

```bash
git fetch origin
git reset --hard origin/develop
```

If you want to save your current branch's state before doing this (just in case),

```bash
git commit -a -m "Saving my work, just in case"
git branch my-saved-work
```

### Rollback a release in the Master branch to a previous tag

**WARNING:  This alters history.  Do not try this on the __DEVELOP__ branch.**

1. Ensure that you are on the __MASTER__ branch,

    ```bash
    git checkout master
    ```

2. Find the commit number of the previous tag (e.g. dc7e7b5 3.15.0.RELEASE),

    ```bash
    git log --oneline

    ecdd645 Merge branch 'release-3.16.0'
    c023314 3.16.0.RELEASE
    72a9524 Added some changes
    f2e68e5 3.16.0.SNAPSHOT
    3414a30 Merge branch 'release-3.15.0' into develop
    5078f25 Merge branch 'release-3.15.0'
    dc7e7b5 3.15.0.RELEASE
    9e5c0d2 Updated some other changes
    ...
    ```

3. Make the previous tag commit the current one (e.g. 3.15.0.RELEASE),

    ```bash
    git reset --hard dc7e7b5
    ```

4. Remove the other release's now uncommitted changes locally:

    ```bash
    git reset HEAD^
    ```

5. Force push the new HEAD commit to the remote repository:

    ```bash
    git push origin +HEAD
    ```

6. If you want to still have it in your local repository and only remove it from the remote, instead use:

    ```bash
    git push origin +HEAD^:master
    ```

### Merging

1. Open the Git merge tool:

    ```bash
    git mergetool
    ```
Fix any merge issues...

2. Execute the merge:

    ```bash
    git merge
    ```

This merges resolved conflicts and resets the merge head appropriately...

### Undo a failed merge

If you see something like the following Git error/warning message: `You have not concluded your merge (MERGE_HEAD exists). Please, commit your changes before you can merge.`

```bash
git merge --abort
```

## Keep Learning

If you’re just getting familiar with git and related tools, you may also want to check out the blog [How and Why to Write Commit Messages First](/blog/how-and-why-to-write-commit-messages-first/), and you’ll find more tips in this blog on [Git Switch and Restore](/blog/git-switch-and-restore-an-improved-user-experience/).

To learn how to take the next steps when your code is ready, check out [From Code to Container](/blog/from-commit-to-container/).