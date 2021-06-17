# Tanzu Developer Center Contribution Guide


## Commiting Content to be Published

After your content piece has been [drafted](gh3-drafting-content.md), [edited](gh4-editing-content.md), and [tested locally](gh5-testing-content.md), it's time to commit your content and open a pull request back to the Tanzu Developer Center GitHub repository. 

### I need to commit and push my code back to my branch, and open a pull request

1. **`add`, `commit`, and `push` your content to your branch**. If you are following this guide, it is assumed you know how to do this part. 

2. **Open the pull request**. Again, if you are following this guide, it is assumed you know how to do this part.
    **NOTE**: Adding a `[WIP]` to your pull request title will let the team know not to merge your PR yet, and that you are just looking for reviews or comments. Please add additional comments to your PR if using this tag detailing what you are looking for.

3. **Here's what to expect next**. Once you open the pull request, a few things are going to happen:
   1. **Automated tests are run** - Just like the tests you ran locally, the tests will run again once you open the pull request. These will take a few minutes to run.
   2. **A deployment preview is generated** - At the end of the list of tests in the pull request, there is one called `netlify/tanzu-dev-portal/deploy-preview — Deploy Preview ready!` along with a `Details` link. Clinking that link will take you to a deploy preview of the site with your changes. Use this as a last review of your content to make sure it all looks like you expect.
   3. **A team review** - Once all tests are passed, someone from the team will review your pull request and files changed to ensure everything looks okay. Once the review is complete, the reviewer will either merge your content into the `main` branch where it will be published, or provide additional comments or questions in the PR conversation. 

4. **Review your published content**. Upon being merged, within a few minutes the site will rebuild, and your content will be live. Review it again just to make sure it looks as you expect.

---

| Previous Step | Next Step |
| ------------- | --------- |
| **[Editing content](gh5-testing-content.md)** | **[Creating an Author page](gh7-team-content.md)** (If you have not yet done it)|