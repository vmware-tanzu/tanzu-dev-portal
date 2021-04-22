# VMware Tanzu Developer Center

## Building the Site

The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally.

### Run locally

To install the latest version of `hugo` you can use `brew install hugo` if you are on a Mac. This site pins hugo to a specific version (currently 0.82.0) to build so if you're using a different version, your experience may vary.

To build the site:

```
git clone https://github.com/vmware-tanzu/tanzu-dev-portal
cd tanzu-dev-portal
make preview
```

A preview of the dev portal will be available at: [http://localhost:1313/developer](http://localhost:1313/developer).

### Run tests locally

> Note: requires Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

1. Install [act](https://github.com/nektos/act#installation) (`brew install act`)
2. Run `make test`

#### Spell Check

A GitHub action will run after opening a Pull Request that checks spelling. (You may test this locally using `make spell`.) You can add entries to the `custom_dict.txt` file for words that should not be flagged. This file gets sorted as a pre-commit hook so you can just add your entries to the end of the file and not worry about the order.

### Publish to Staging

After running and testing locally, opened Pull Requests will be automatically staged by Netlify.

## Contributing Content

See the [Contributors guide](CONTRIBUTING.md).
