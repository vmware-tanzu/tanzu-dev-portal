
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Open Projects, Issues, and Content Backlog](#open-projects-issues-and-content-backlog)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)


## About The Project

![Tanzu Developer Center Screen Shot](static/images/github/homepage-screenshot.png)

The VMware Tanzu Developer Center is a site specifically built to be a great resource for  software development teams. Our guiding principle is to ensure readers have free, immediate access to all the content on the Tanzu Developer Center. No purchase is ever necessary to access content on the Tanzu Developer Center because it is either open source or an easily accessible trial.

The contributions on the Tanzu Developer Center,  are from teams across VMware, as well as individuals without. Check out the [contributing](#contributing) section below for more details.


### Built With

* [Hugo](https://gohugo.io)
* [Netlify](https://www.netlify.com)
* [npm](https://www.npmjs.com)


## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

1. **Install hugo** -- The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally. Make sure you install the extended version with SCSS/SASS support built in. This site pins hugo to a specific version (currently 0.82.0) to build so if you're using a different version, your experience may vary. To install this specific version, see the [gohugo GitHub releases page for 0.82.0](https://github.com/gohugoio/hugo/releases/tag/v0.82.0).

     ```sh
     brew install hugo
     ```

2. **Install NPM** -- Hugo uses NPM to manage its local packages. If you don’t already have it installed, you will need it to move further.

     ```sh
     brew install npm
     ```

3. **Install act** -- [act](https://github.com/nektos/act/releases/tag/v0.2.20) is used to run GitHub Actions tests locally. The Tanzu Developer Center uses GitHub Actions to perform automated testing periodically, and on each pull request. 
   
    **NOTE**: Currently, the tests break on `act` > v0.2.20, be sure to install [v0.2.20](https://github.com/nektos/act/releases/tag/v0.2.20).)

4. **Install Docker** -- Running automated test locally will require Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

     ```sh
     brew install docker --cask
     ```

### Installation

1. Clone the repository.

     ```sh
     git clone --recurse-submodules https://github.com/vmware-tanzu/tanzu-dev-portal.git
     ```

2. Build a preview of the website. The website will be available at [`http://localhost:1313/developer`](http://localhost:1313/developer).
    
     ```sh
     make preview
     ```


## Open Projects, Issues, and Content Backlog

See the [open issues](https://github.com/vmware-tanzu/tanzu-dev-portal/issues) and [project boards](https://github.com/vmware-tanzu/tanzu-dev-portal/projects) for a list of proposed features, content backlog, and known issues.


## Contributing

Contributions are what make open source and the developer community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

The contribution process is documented fully on our GitHub [wiki site](https://github.com/vmware-tanzu/tanzu-dev-portal/wiki) and includes methods for both VMware employees as well as non-employees to contribute to content or bug fixes.


## Code of Conduct

We on the admin team of the Tanzu Developer Center adhere to a code of conduct. For more information on this, read the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

## License

Distributed under the Apache License. See [`LICENSE`](LICENSE) for more information.

