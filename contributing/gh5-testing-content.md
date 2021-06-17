# Tanzu Developer Center Contribution Guide


## Testing Content Locally

Once your content is submitted via a pull request, a set of automated tests will be run. To simplify this testing, and speed fixes, most of these tests can be run locally. Most of this section requires that you have gone through the [environment set up](gh2-env-setup.md) process already. 


### I need to run tests locally, prior to submitting

1. **Run the bulk of the automated tests locally**. This will run most of the automated GitHub Actions tests.  
    **NOTE**: Running these tests requires Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

```bash
cd tanzu-dev-portal
make test
```

2. **Run the automated spelling check test**. The automated test for checking spelling needs to be run separately if you want to run it prior to submitting.
```bash
make spell
```

3. **Build a preview of the website**. As a final check, build the website locally and make sure your content looks as you intend. Especially look for markdown errors and images that aren't being shown. The website will be available at `http://localhost:1313/developer`.
    **NOTE**: If your frontmatter date is in the future, it is okay to use a date in the future for a publish date. However this will have implications for previewing the website. If you use a future date for publishing, you will need to use the `hugo serve` command instead of `make preview` and you will need to include the `-F` flag to see the post when running hugo or hugo server to build the site on your local machine.
```bash
make preview
```

4. **Fix any issues that come up during local tests**. Any build issues are unlikely if you are just submitting content. Most common issues, and their mitigation, are as follows:
    * **Broken links** - Broken links are a common issus when running `make test`. Here, simply double check your links and click on every link in your content during the preview of the website.
    * **Spelling Errors** - These are very common errors found during `make spell`. Here, it is preferred that fixes are prioritized as fixing any spelling mistakes, rewording your content to use a different word if possible, then add the word to `custom_dict.txt` for words that should not be flagged. This file is in the repositories root directory. It gets sorted as a pre-commit hook so you can just add your entries to the end of the file and not worry about the order.

---

| Previous Step | Next Step |
| ------------- | --------- |
| **[Editing content](contributing/gh4-editing-content.md)** | **[Commiting Content](contributing/gh6-commiting-content.md)** |