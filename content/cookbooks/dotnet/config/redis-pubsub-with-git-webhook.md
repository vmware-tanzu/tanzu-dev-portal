+++
title = "Config Refresh With Git Webhook"
date = 2018-07-18T13:32:38-05:00
+++

#### Configure github hooked with an application for publishing it events, used for configuration reload and other purposes)

##### There are 2 ways to capture the github events (Options)

  - Using Redis pub/sub as described in this sample 
  - Directly adding a controller into the application with Actions using WebHook attributes [Attribute: `GitHubWebHook`] and other specific WebHook attributes. 
  {{% callout note %}}
  The target url to the controller should be `/api/webhooks/incoming/github`
  {{% /callout %}}

##### Step 1: Configuring GitHub WebHook ([Reference](https://developer.github.com/webhooks/creating/))
- Navigate to `repository` --> `settings` --> `webhook`
- provide the url to which the event to be posted, make sure the url is in the format `http://<hostname>/api/webhooks/incoming/github`
- Select an appropriate `ContentType`
- Create a random `SecretKey` and paste it into the box, note this will be passed on as a header to the `POST` for security purposes. The same `SecretKey` should be provided into the configuration of the application which is using the WebHook, in this case publisher application
- Select appropriate events for which you need the events to be published, as an alternate you can handle the same in the `WebHook Action Methods` as well

##### Step 2: Application to be hooked up with Github
- Add a controller named `GitHubController`
- Add an Action method as below
 
    ```c#
    public IActionResult GitHubHandler(string id, string @event, JObject data)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        if(@event == "push")
        {
            //Add anything you want to perform during a PUSH event like IConfigurationRoot.Reload(), if you want to reload the configurations (as mentioned on Option #1)
            //In this example, we publish to a redis channel using IPublisher (option #2)
        }
        return Ok();
    }
    ```

- Add method attribute `[GitHubWebHook]` to the above Action method
- Add `SecretKey` to the configuration file as below

    ```json
    "WebHooks": {
        "GitHub": {
            "SecretKey": {
                "default": "<Secret Key you added in webhook configuration of github repository>"
            }
        }
    }
```

- Add reference to webhook nuget package as below

    ```xml
    <PackageReference Include="Microsoft.AspNetCore.WebHooks.Receivers.GitHub" Version="1.0.0-preview2-final" />
    ```

- In `Startup.cs`, inject `GithubWebHooks` as below

    ```c#
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1).AddGitHubWebHooks();
    }
    ```

##### Projects in this example

- Redis Messaging Library (`redis_messaging.csproj`) 
     - Simple library eases out using redis pub/sub events    
- Consumer Application (`subscriber.csproj`)
    - This application subscribes to a Redis channel from where it listens for messages published in that channel
- Producer Application (`publisher.csproj`)
    - This application is hooked with github (WebHook) which upon receiving a `POST` from github publishes a message to a redis channel

##### To run this sample

- Clone the code from github to you local directory using below command

    ```sh
    git clone https://github.com/pivotalservices/redis_pub_sub_with_git_webhook.git
    ```

- Follow step #1 to configure your git repo
- Modify the `appsettings.json` file to reflect your new `SecretKey`
- Open terminal from the root and run `dotnet build` command to compile the application
- Make sure redis is running in your local machine, if not install and start Redis, before running this application, for more info on installation of Redis please refer to [their site](https://redis.io/download).
- Since we are running the application in local, github cannot connect to the local application. This can be easily be achieved by using `ngrok`, which can act as a reverse proxy for your local applicaiton to the internet. For more information on ngrok, please refer to [their getting started guide](https://dashboard.ngrok.com/get-started).
- After installation of ngrok setup the proxy by running the below command

    ```sh
    ./ngrok http 5001
    ```

    as the sample publisher application runs on port `5001`.

- Navigate to publisher folder and run `dotnet run` command to start publisher app, which waits for github `POST` events and then publishes to redis on a channel specified in the configuration
- Navigate to subscriber folder and run `dotnet run` command to start publisher app, which listens to redis events on the channel specified in the configuration
- Make sure the redis channel name is same on the publisher and subscriber `appsettings.json`
- Now you are all set to do a test commit and push to the git reposiory. You should see the messages flowing through your publisher and the to subscriber
- `Subscriber App` --> `MessageProcessor` --> `OnMessageReceived` can be used for configuration reload or any other purposes as below

    ```c#
    private void OnMessageReceived(Message message)
    {
      config.Reload(); //config is IConfigurationRoot
    }
    ```

#### Configure gitlab hooked with an application for publishing it events

- There is no prebuilt webhook api available for gitlab
- So we can create our own controller with `POST` action and route as described in the sample publisher app code (`GitLabController`)
- In this example your path should be `/api/webhooks/incoming/gitlab`, made it similar to github for convenience
- For setting up Webhook integration in gitlab, please refer to [their documentation](https://docs.gitlab.com/ce/user/project/integrations/webhooks.html). There are minor differences in navigation compared to github.
- There is also change in the structure of the posted body, so created a concrete model for a clear picture
- In `Startup.cs`, no need of any special injection for webhooks, so below should suffice

    ```c#
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }
    ```

- Otherwise, please follow the above steps to configure and execute the sample
- In addition, you can add middlewares/filters to add more security/signature validation kind of stuff.

##### Hope you have fun!
