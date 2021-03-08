
Hi there! This guide aims to teach people unfamiliar with Github how to suggest edits to the [Tanzu Agile Practices site](https://tanzu.vmware.com/developer/practices/). Follow the steps below to get started!


# Workflow overview

It takes many clicks to suggest an edit, but these are the 5 big stages you have to go through.

1. **Prepare**: Type up your suggested edits 
1. **Fork**: Forking just means creating a copy of the practices site code for your GitHub account
1. **Edit**: Copy and paste suggested edits into the code in your copy of the practices site through the GitHub UI and save it in a branch
1. **Submit a Pull Request**: Submitting a Pull Request is the technical term for submitting the suggested edits to be reviewed, approved by someone else and updated on the site. It is so named because the reviewer will be 'pulling' your code into the vmware repository to merge it. 
1. **Delete**: When the change is approved, delete your copy of the practices site.

Repeat steps when you want to suggest new edits to the site.

# Step by Step Instructions 

## 1. Prepare
1. Type up the changes you want to make for the Practices site. Any word editor will do for this, Microsoft Word, Google Docs, Notes on Mac. For your first suggestion, try adding something small, such as a few sentences. This will make it easier for the suggestion to be approved and merged.
1. Create a Github account, if you don’t have one. Login to your Github account, if you do.
1. If you’re doing this for the first time, set aside around 35 minutes to go through these steps.

## 2. Fork (Create a copy of Practices site)
1. Go to the [VMware practices repository on Github](https://github.com/vmware-tanzu/tanzu-dev-portal/tree/main/content/practices) - this is where all the code for the site sits. It is also open to the public for contribution. 
1.  Click on fork to make a copy of the code to your own github account.

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork2.png" />
1. Check the title of the repository to make sure that you are editing on your own copy of the code. It should show your github account name/tanzu-dev-portal, as you can see below:

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork3.png" />


1. Click on Content

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork4.png" />
1. Click on Practices. You’ll see a list of all the practices currently on the site.
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork5.png" />
1. Click on the practice you want to add to. For this example, I clicked on design-studio.
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork6.png" />
1. Click on index.md. This shows you what the page looks like in plain text. 

1. Click on the pencil edit icon. This shows you what the page looks like in markdown language. Don’t worry, markdown is a simplified HTML/CSS script.   

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Fork8.png" />. 

## 3. Edit (Make Edits and save as branch)

1. Paste your edits into the right section. Just note that if you’re adding a ‘header’, ‘callout’ or any form of special formatted text, take a look to see how headers have been written, so you can copy the syntax. 

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Edit1.png" />
    For example, I added a tip in the example above.   

    A tip is written like this:
     {{%callout%}}
    This is a tip
     {{/%callout%}}. 

    Try to also keep to the indentation format so that the text looks neat and readable.

    Unfortunately, at this point in time, it is not possible to preview what it will look like on the actual website, but you can click on the Preview Changes tab to see if the edits show up in the right places. 


1. Scroll down to the Commit Changes section, and fill in the title. It defaults to ‘Update index.md’, but delete that and give it a short summary of **what you did** in less that 50 words. Refer to the image below for an example.
1. Fill up the extended description with the reason **why** the update was needed, or the context around the update. This will be read by the reviewers - help them understand why they should approve this edit!
1. Select ‘Create a new branch for this commit’
1. Create a name for the new branch that explains **what it is** 
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Edit2.png" />. 
1. Click Propose Changes. 
1. Click on the Pull Requests tab. Do NOT click the green ‘Create Pull Request’ button that appears at the bottom of the next screen.

    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Edit7.png" />

## 4. Submit a Pull Request (Submit edits for review)

1. Click ‘New Pull Request’. 
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/PR1.png" />
1. Make sure that your base repository is vmware-tanzu/tanzu-dev-po..., and the head repository is your account.  

1. Change the dropdown for your “compare: main” to the name of the branch you have created. 
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/PR2.png" />
1. Scroll down to check that text highlighted in green is the change you want to make.   
1. Click Create Pull Request
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/PR5.png" />
1. Click Create Pull Request again. 
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/PR6.png" />
1. If you scroll down, you can see that the edits are going through some automated checks. 
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/PR7.png" />
1. If you want to, you can keep the screen running until all the tests have passed, just to have a peace of mind. In the list of checks, some people can see a row below WIP called netlify. If you see it, you can click on the netlify row after all the checks have completed to preview how it will look on the site.
1. Otherwise, feel free to close GitHub and continue with your life. The checks will continue running even if you leave the page. Once the change passes through all the checks, it will land on the reviewers’s plate, and all you have to do is wait for it to be reviewed, approved and merged. 

1. You’ve successfully suggested a change to the practices site! 


> ## Short FAQ
>
> ### How will I know if the changes have passed the checks, been rejected, approved or merged?
> If there’s a change to the status of your pull request, Github will alert you via the email linked to your Github account, and add a notification to the  notifications icon of your Github account. Here's how to check from the Github site:
> 1. Click on the notification icon.
>    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Notification1.png" />.   
> 1. Click on the notification with the name of the branch you submitted for pull request
>    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Notification2.png" />.   
Github/Images%20for%20Guide/Notification%202.png"/>
>
> 1. Check out the status under the title! (Some possible statuses are: Open, Rejected, Merged, etc)
>    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Notification3.png" />.   
> 
> ### How can I make a change to the pull request if it doesn’t pass a test, or there’s a request for edits from the reviewers?
> 1. Go to your copy of the Tanzu Practices site, making sure that you are in the right branch to make the edits.  
>    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/MkChanges1.png" />.   
> 1. Click on the 'Content' folder, 'Practices' folder, the folder of the practice you edited, and then index.md. Click on the pencil icon to edit it.    
> 1. When saving the edits, under Commit Changes, fill in the title and description for the change.    
> 1. This time, commit directly to the branch. Do NOT create a new branch. This updates your pull request with your latest edits.     
>    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/MkChanges2.png" />.   
> That’s it!

## 5. Delete (delete repo)

Once you’re sure your edits have been merged, you can delete your repo with these steps:

1. Click on settings
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Delete1.png" />.   
1. Scroll all the way down to the Danger Zone, and click Delete this repository
    <img style="float: left;" src="https://github.com/Weimankow/tanzu-dev-portal/blob/Guide-for-Contributors-New-to-Github/static/images/guides/guide-for-contributors-new-to-github/Delete2.png" />.   
1. Follow the instructions to type the name of your repo, and enter your password. Done!
