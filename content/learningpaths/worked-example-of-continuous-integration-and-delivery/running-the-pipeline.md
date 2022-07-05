---
layout: single
team:
- Paul Kelly
title: Running The Pipeline
weight: 50
---

At this point, you should have successfully created jobs in Jenkins and have kpack running and ready to go. 

You can now trigger the pipeline and watch it run. To start the first job running, make a change to the main branch of your toybank repository and push it to GitHub. 

The job will take a few minutes to run, and if it completes successfully, it will merge the latest changes to the image-build-branch of the toybank repository and push them to GitHub. 

When kpack picks up the changes, it will build a container image and push it to Docker Hub. If you run the following command, you can see when kpack starts building the image and when it finishes.

`watch kp image status toybank` 

As explained earlier, the next job (02-toybank-e2e) should be triggered by a webhook call from your image repository. However, to keep this example as easy to reproduce as possible, the shortcuts of using minikube for the cluster and Docker Hub for your repository make it difficult to make this work as intended. In a more realistic scenario, you might either be hosting your own image repository using Harbor (or something similar), or you might be running your pipeline on a cluster hosted on the public cloud, in which case you would connect the repository webhook directly to your Jenkins endpoint. Instead, we have a workaround explained in the next section. 


## Running the end-to-end tests

To trigger the end-to-end tests, you can use Postman to trigger this job directly from the local machine. You are acting as a kind of manual proxy for the webhook trigger from Docker Hub. 



1. Start Postman and create a POST request to URL: \
 \
<code>http://localhost:<em>port</em>/generic-webhook-trigger/invoke?token=1231</code> \
 \
where <code><em>port</em></code> is the one provided by the Minikube tunnel to Jenkins (see "Configure Your Jenkins Installation"). 
2. Set header <code>Content-Type</code> to <code>application/json</code>. 
3. Set the Body to raw, and include the payload from the Docker Hub webhook. 

If you were able to set up the webhook-listener as described in "Viewing Webhook Calls" you can use the actual data that was sent by the repository when kpack pushed your image. If you weren’t able to do that, the data looks like this (although it won’t have been formatted for readability like the example here): 


```
{
   "callback_url":"https://registry.hub.docker.com/u/account/toybank/hook/GUID/",
   "push_data":{
      "pusher":"account",
      "pushed_at":1648226578,
      "tag":"tag",
      "images":[


      ]
   },
   "repository":{
      "status":"Active",
      "namespace":"pkatpivotal",
      "name":"toybank",
      "repo_name":"account/toybank",
      "repo_url":"https://hub.docker.com/r/account/toybank",
      "description":"Example image",
      "full_description":"",
      "star_count":0,
      "comment_count":0,
      "is_private":false,
      "is_trusted":false,
      "is_official":false,
      "owner":"account",
      "date_created":1646218129
   }
}
```


 \
In the above data, change **_account_** to your Docker Hub account name, and set the tag to the value of the latest toybank image pushed to your repository. You can see the tags by looking at your Docker Hub toybank repository and then clicking the Tags tab. Every time kpack builds an image, it creates two tags in the repository, `latest` and one in the form <code>b<em>nn</em>.<em>yyyymmdd</em>.<em>hhmmss </em></code>(for example: <code>b19.20220401.114546</code>).

Use the edited JSON as the body for your POST request and post it to Jenkins. If you set the tag to latest, the filter in job 02-toybank-e2e will ignore the trigger. If you use the long tag that identifies a particular image, the build is triggered for that image. 

Once the job is running, it will take a couple of minutes to build and run the tests. If the tests pass, it will trigger the next job. 


## Deploying to production

When job 02-toybank-e2e completes successfully, it triggers the final job in the sequence 03-toybank-deploy. Once this has run, you should be able to see the toybank running in the production namespace: 

` kubectl get service -n production` 
