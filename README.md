# VMware Tanzu Developer Center

## Building the Site

The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally. Make sure you install the extended version with SCSS/SASS support built in.

### Run locally

To install the latest version of `hugo` you can use `brew install hugo` if you are on a Mac. This site pins hugo to a specific version (currently 0.82.0) to build so if you're using a different version, your experience may vary.

To build the site:

```
git clone --recurse-submodules https://github.com/vmware-tanzu/tanzu-dev-portal
cd tanzu-dev-portal
make preview
```

A preview of the dev portal will be available at: [http://localhost:1313/developer](http://localhost:1313/developer).

If you do not have the extended version installed, you will get an error similar to this when you run `make preview`:

```
hugo server -b http://localhost:1313/developer
Start building sites …
ERROR 2021/04/26 14:34:41 TOCSS: failed to transform "css/light-theme.css" (text/x-scss). Check your Hugo installation; you need the extended version to build SCSS/SASS.
Built in 1366 ms
Error: Error building site: TOCSS: failed to transform "css/main.css" (text/x-scss). Check your Hugo installation; you need the extended version to build SCSS/SASS.
make: *** [Makefile:22: preview] Error 255
```

### Run tests locally

> Note: requires Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

1. Install [act](https://github.com/nektos/act/releases/tag/v0.2.20) (NOTE: Currently, the tests break on `act` > v0.2.20, be sure to install v0.2.20)
2. Run `make test`

#### Spell Check

A GitHub action will run after opening a Pull Request that checks spelling. (You may test this locally using `make spell`.) You can add entries to the `custom_dict.txt` file for words that should not be flagged. This file gets sorted as a pre-commit hook so you can just add your entries to the end of the file and not worry about the order.

### Publish to Staging

After running and testing locally, opened Pull Requests will be automatically staged by Netlify.

## Contributing Content

See the [Contributors guide](CONTRIBUTING.md).
