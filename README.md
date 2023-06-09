# ![VMware](./assets/icons/logo.svg)[![Netlify Status](https://api.netlify.com/api/v1/badges/b28c2754-da62-4450-951b-d4dbd97710d1/deploy-status)](https://app.netlify.com/sites/tanzu-dev-portal/deploys)

- [About The Project](#about-the-project)
- [Getting Started Building a Local Deployment of the Tanzu Developer Center](#getting-started-building-a-local-deployment-of-the-tanzu-developer-center)
  - [Using the Dev Container](#option-1-using-the-dev-container)
  - [Local Build Environment Setup](#option-2-setup-a-local-build-environment)
- [Troubleshooting](#troubleshooting)
  - [Q. I'm receiving an error about cloning `themes/docsy`](#q-im-receiving-an-error-about-cloning-themesdocsy)
  - [Q. `make preview` is throwing a `fatal error: pipe failed` error](#q-make-preview-is-throwing-a-fatal-error-pipe-failed-error)
  - [Q. I am on Windows and `make preview` doesn't work](#q-i-am-on-windows-and-make-preview-doesnt-work)
- [Open Projects, Issues, and Content Backlog](#open-projects-issues-and-content-backlog)
- [Contributing](#contributing)
  - [Contributing Code](#contributing-code)
  - [Contributing Content](#contributing-content)
- [Code of Conduct](#code-of-conduct)
- [Tanzu Developer Center Open Source License](#tanzu-developer-center-open-source-license)

## About The Project

![Tanzu Developer Center Screen Shot](static/images/github/homepage-screenshot.png)

The VMware Tanzu Developer Center is a site specifically built to be a great resource for software development teams. The contributions on the Tanzu Developer Center are from teams across VMware, as well as individuals without.

Our guiding principle is to ensure readers have free, immediate access to all the content on the Tanzu Developer Center. No purchase is ever necessary to access content on the Tanzu Developer Center because it is either open source or an easily accessible trial.

## Getting Started Building a Local Deployment of the Tanzu Developer Center

### Clone this repository

```sh
    git clone --recurse-submodules https://github.com/vmware-tanzu/tanzu-dev-portal.git
```

_These options help speed up the repo setup by initializing submodules during the clone process._

There are two available options for building and running a local preview of the Tanzu Developer Center:

1. [Using the dev container](#option-1-using-the-dev-container)
2. [Setup a local build environment](#option-2-setup-a-local-build-environment)

### Option 1: Using The Dev Container

The Dev Container is offered to simplify a local environment setup for those working with and contributing to the Tanzu Developer Center.

This method requires the following software be installed:

- [GNU make](https://www.gnu.org/software/make/#download) (_Note: `make` should be available on a Mac with Xcode dev tools installed. Linux users can use their distribution's application manager (e.g. apt install make) or follow the manual steps specified by [make](https://www.gnu.org/software/make/). Windows requires [special installation](https://gnuwin32.sourceforge.net/packages/make.htm) to use make._)
- [Docker](https://docs.docker.com/get-docker/) (Testing was done with docker desktop installed via `brew install --cask docker`)

An alternative option if make is unavailable is to utilize `docker` cli commands to setup the dev-container and work with `make` from there.

#### Building the Dev Container Image and Container

_(Note: The docker daemon must be running)_:

```sh
make dev-container
```

This will connect to a bash shell in the container immediately after it has finished the build process.

The default working directory in the shell will be the Tanzu Developer Center git repo directory _(it is mounted as a volume in the container)_. All file edits/additions made from within the container are persistent and saved on the host system.

The container is configured to replicate a fully functional local developer setup.
From within the Dev Container shell prompt, run `make help` to see a list of available actions.

#### Interacting With Dev Container

The Makefile includes several actions to interact with the dev container.
All of the commands are in the following format:

```sh
make dev-container.<action>
```

_Use `make help` to see the full list of actions_

Some examples:

```sh
make dev-container.pr-test # Simulates all github pull request checks using the container in docker and act
```

```sh
make dev-container.shell # Starts the container and connects to a bash shell
```

From the container shell, a preview of the site can be built using:

```sh
make preview
```

### Option 2: Setup A Local Build Environment

These are the software prerequisites needed to build a local preview of the Tanzu Developer Center site.

- [Hugo](https://gohugo.io)
- [Netlify](https://www.netlify.com)
- [npm](https://www.npmjs.com)
- [act](https://github.com/nektos/act)
- [Docker](https://docs.docker.com/get-docker/)
- [make](https://www.gnu.org/software/make/)

### Software Installation Prerequisites

_Note: These instructions were designed for Mac users. Linux and Windows users without access to `make` and `brew` will need to manually install the prerequisites._

- **Install Hugo** — The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally. Make sure you install the extended version with support for SCSS/SASS. This site pins `hugo` to a specific version (currently **0.107.0**) to build so if you're using a different version, your experience may vary. To install `hugo`, follow the instructions for your specific environment as detailed in the [hugo documentation](https://gohugo.io/installation/). Ultimately, you have two main options:

  - Download the correct **extended** binary for your OS from [gohugo GitHub releases page for 0.107.0](https://github.com/gohugoio/hugo/releases/tag/v0.107.0) and then move the `hugo` binary to an appropriate location (ie. `sudo cp hugo /usr/local/bin`) and/or add it to your `PATH`.
  - Use `brew install hugo` and `brew pin hugo` to pin it to the correct version (0.107.0). (MacOS only.)

- **Install Node (and NPM)** — Certain features of the site require Node in order to build (PostCSS, Autoprefixer, etc.), and the Node Package Manager (npm) is also used to manage local packages. If you don’t already have Node installed, you’ll need it in order to build the site. Though it may work with different versions, you should use the same ones that Netlify does, which are Node 16 (as defined in the .nvmrc file at the root) and npm 8 (the corresponding version that comes with Node 16). You may [download and install Node](https://nodejs.org/en/download/current/) or use `brew` to install it:

     ```sh
     brew install node@16
     ```

_Note: The reason the .nvmrc is required even though the default should already be v16 for default image that Netlify is set to use - [Ubuntu Focal 20.04](https://github.com/netlify/build-image/blob/focal/included_software.md) - when the site repository was originally linked Netlify, it was using an older image that defaulted to v12, so it must be specified explicitly in the .nvmrc file. (See [this article](https://answers.netlify.com/t/please-read-end-of-support-for-trusty-build-image-everything-you-need-to-know/39004#how-can-i-make-my-site-work-with-the-new-image-6) for more details._

- **Install [act](https://github.com/nektos/act)** — The Tanzu Developer Center uses GitHub Actions to perform automated testing periodically, and on pull requests. If you plan to run these tests locally, you will need `act`. Follow [these instructions](https://github.com/nektos/act#installation) to install `act`, or use `brew`:

     ```sh
     brew install act
     ```
     Hugo Server

- **Install Docker** — The `act` tool depends upon Docker to build images for local automated tests. You can download [Docker Desktop](https://www.docker.com/products/docker-desktop/) or use `brew`:

     ```sh
     brew install docker --cask
     ```

    _Note: Mac OS X requires Docker Desktop 2.4 or later_

With all the dependencies installed, use `make help` to see the available actions.

## Troubleshooting

### Q. I'm receiving an error about cloning `themes/docsy`

With the change with how the theme files are overridden, the first time you update your branch you may see the following issue when running `make preview`:

```sh
git submodule update --init --recursive
Submodule 'themes/docsy' (https://github.com/google/docsy.git) registered for path 'themes/docsy'
fatal: not a git repository: /private/tmp/tanzu-dev-portal/themes/docsy/../../.git/modules/themes/docsy
Failed to clone 'themes/docsy'. Retry scheduled
BUG: submodule considered for cloning, doesn't need cloning any more?
fatal: could not get a repository handle for submodule 'themes/docsy'
make: *** [theme] Error 1
```

You can run the following command for a one-time fix:

```sh
make clean-submodule
```

### Q. `make preview` is throwing a `fatal error: pipe failed` error

This is due to the number of files that are opened during the process of building the site. If you're on OSX, this can be addressed with the following command:

```sh
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
```

### Q. I am on Windows and `make preview` doesn't work

On Windows, you may need to use `hugo server -D` to start the application. The site will then be available on `http://localhost:1313/`

## Open Projects, Issues, and Content Backlog

See the [open issues](https://github.com/vmware-tanzu/tanzu-dev-portal/issues) and [project boards](https://github.com/vmware-tanzu/tanzu-dev-portal/projects) for a list of proposed features, content backlog, and known issues.

## Contributing

Content contributions are what make open source and the developer community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### Contributing Code

The code contribution process is documented in [CONTRIBUTING.md](https://github.com/vmware-tanzu/tanzu-dev-portal/blob/main/CONTRIBUTING.md).

### Contributing Content

The content contribution process is documented fully on our GitHub [wiki site](https://github.com/vmware-tanzu/tanzu-dev-portal/wiki) and includes methods for both VMware employees as well as non-employees to contribute to content or bug fixes.

## Code of Conduct

We, the Admin team of the Tanzu Developer Center adhere to a code of conduct available here: [CODE_OF_CONDUCT.md](https://github.com/vmware-tanzu/tanzu-dev-portal/blob/main/CODE_OF_CONDUCT.md).

## Tanzu Developer Center Open Source License

The Tanzu Developer Center is distributed under the Apache License. For more information, see [LICENSE](https://github.com/vmware-tanzu/tanzu-dev-portal/blob/main/LICENSE).
