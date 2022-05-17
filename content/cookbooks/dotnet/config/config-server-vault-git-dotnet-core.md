+++
title = "Config Server with Vault & Git"
date = 2018-07-18T13:26:58-05:00
+++

#### Configure config-server with vault & Git together as backend for .NET Core application(including a sample .NET Core application)

##### Steps to configure

- Create vault instance in PCF

    ```sh
    cf create-service p-vault standard <vault-service-name>
    ```

- Bind it to a simple application to get the vault parameters like host, port and token via environment variables (`Apps Manager` --> `Application` --> `Settings` --> `REVEAL ENV VARS`). Settings should be something similar to below..

    ```json
    "p-vault": [
    {
        "name": "<vault-service-name>",
        "instance_name": "<vault-service-name>",
        "credentials": {
            "host":"vault........com",
            "port":80
        }
    },
    ```

- Setup a github repo and add file `mysampleconfigserver.yml` and add the below contents to it

    ```yaml
    ---
    AppName: ServiceNameFromGitHubConfigFile
    Detail:
        Description: My config description from Git
    ---
    ```

- Make sure you have the `yml` file in github repository you are targeting at. Point to note is that the name of the `yml` file should match with the `spring:application:name` in `appsettings.json`, in this case it is `mysampleconfigserver.yml`
- Make a note of the git repo url, username and password

- Create an instance of config-server in PCF with the below vault configuration

    ```json
    {
    	"spring":{
    		"profiles":{
    			"active":"git,vault"
    		}
    	},
    	"composite": [
    		{ 
    			"git": {
    				"uri": "http://your-git-uri-here",
    				"username": "gitlab+deploy-token-10",
    				"password": "password-goes-here",
    				"skipSslValidation": "true",
    				"order": 2
    			}
    		},
    		{
    			"vault": {
    				"host": "vault.sys.....net",
    				"port": "443",
    				"scheme": "https",
    				"backend": "secret/some-guid-here",
    				"defaultKey": "application",
    				"order": 1
    			}
    		}			
        ]	  				
    }
    ```

- The order tells the priority of the profiles and their configurations over each other, here git takes priority over vault, which we can observer when we run the sample application

- Command(s) to create the config-server service instance..

    ```sh
    cf create-service p-config-server standard <config-server—instance-name> -c "{"spring":{"profiles":{"active":"git,vault"}},"composite":[{"vault":{"host":"<vault-host-name-excluding-http>","port":"80","scheme":"http","backend":"secret","defaultKey":"mysampleconfigserver","order":1},"git":{"uri":"<github-repo-url>","skipSslValidation":false,"username":"<git_username>","password":"<git_password>","order":1}}]}"
    ```

    **OR** (https)

    ```sh
    cf create-service p-config-server standard <config-server—instance-name> -c "{"spring":{"profiles":{"active":"git,vault"}},"composite":[{"vault":{"host":"<vault-host-name-excluding-https>","port":"443","scheme":"https","backend":"secret","defaultKey":"mysampleconfigserver","order":1},"git":{"uri":"<github-repo-url>","skipSslValidation":false,"username":"<git_username>","password":"<git_password>","order":1}}]}"
    ```

- Clone this sample application from git 

    ```sh
    git clone https://github.com/pivotalservices/config_server_vault_git_dotnet_core
    ```

- Follow the instructions `Readme.md` to compile, publish and push the application to cloud.

- Use the below commands to setup your vault client (cli)

    ```sh
    export VAULT_ADDR=<vault-host-from-step#2>
    export VAULT_TOKEN=<vault-token-from-step#2>
    ```

- You can add configuration(s) into the vault using below command

    ```sh
    vault kv put secret/mysampleconfigserver AppName='ServiceNameFromVaultConfigFile' Detail:Description='My config description from vault' Detail:Url='http://foo/bar' Logging:Level:Default=Debug
    ```

- To verify you can curl the config server as below

    ```sh
    curl -X "GET" "http://<config-server-host>/mysampleconfigserver/default" -H "X-Config-Token: <vault-token-from-step#2>"
    ```

- Above command should respond a JSON output similar to below combining data from both vault and github

    ```json
    {
      "name": "mysampleconfigserver",
      "profiles": [
        "default"
      ],
      "label": null,
      "version": null,
      "state": null,
      "propertySources": [
        {
          "name": "https://github.com/.../mysampleconfigserver.yml (document #1)",
          "source": {
            "document": ""
          }
        },
        {
          "name": "https://github.com/.../mysampleconfigserver.yml (document #0)",
          "source": {
            "AppName": "ServiceNameFromGitHubConfigFile",
            "Detail.Description": "My config description from Git"
          }
        },
        {
          "name": "vault:mysampleconfigserver",
          "source": {
            "Logging:Level:Default": "Debug",
            "Detail:Url": "http://foo/bar",
            "Detail:Description": "My config description from vault",
            "AppName": "ServiceNameFromVaultConfigFile"
          }
        }
      ]
    }
    ```

- Now that the sample application is in PCF, you can launch the application to verify if is able to pull your configurations from vault
- Upon clicking [`Config From Vault`] link, you should see the configurations from git overrides the ones from vault, based on the order of profiles we specified, as below

    ```
    Property appname=ServiceNameFromGitHubConfigFile
    Property detail.url=http://foo/bar
    Property detail.description=My config description from Git
    Property logging:level=Debug
    ```

- Now you can modify the `yml` file in github and vault entries to test the dynamic reload of configurations without restarting the application. To trigger the refresh, click the link [`Reload Config From Vault`] on the app.

- You can make this auto refresh upon any change and push on the GitHub `yml` file as well. To get more info please refer to [this guide](https://github.com/pivotalservices/redis_pub_sub_with_git_webhook) and follow the instructions on `ReadMe`

#### Important points to keep in mind

1. Nuget package to use `Pivotal.Extensions.Configuration.ConfigServerCore`, version `2.0.1`

2. `Application.json` should have the below configuration

    ```json	
    "spring": {
    	"application": {
    		"name": "application-name-which-is-the-name-of-yml-file-OR-vault-key-name"
    	},
    	"cloud": {
    		"config": {
                "uri": "<config-server-url>",
                "token": "<vault-token-from-step#2>"
    		}
       	}
    }
    ```

3. Add additional configuration to the `webhostbuilder` as below (in `Program.cs`)

    ```c#
    .ConfigureAppConfiguration((envBuilder, configBuilder)=>
    {
     	configBuilder.AddConfigServer(new LoggerFactory().AddConsole(LogLevel.Trace));
    })
    ```

4. Here my sample .NET Core application's name is `mysampleconfigserver`, you should see this referenced most of the places

#### If you prefer to dynamically reload configurations, please follow the below

1. Add below under `ConfigureServices` method in `Startup.cs`. This injects type of `IConfigurationRoot` into the services collection

    ```c#
    services.AddConfiguration(Configuration);
    ```

2. Just add `IConfigurationRoot` as one of the constructor arguments, where you want to trigger the reload and call `Reload()` method of `IConfigurationRoot`, as below

    ```
    Imp: Please make sure all the configuration options are wrapped by IOptionsSnapshot (as below)
    ```

    ```c#
    public HomeController(IConfigurationRoot config, IOptionsSnapshot<ConfigOptions> configurationOptions)
    {
        this.config = config ?? throw new ArgumentException(nameof(config));
        this.configurationOptions = configurationOptions?? throw new ArgumentException(nameof(config));
    }
    ```

    ```c#
    public void Reload()
    {
        config.Reload();
    }
    ```

#### Interesting stuff down here, enabling dynamic configuration refresh...

- This application is integrated with `redis_messaging_library` ([found here](https://github.com/pivotalservices/redis_pub_sub_with_git_webhook/tree/master/redis_messaging/src)) to enable dynamic refresh of configuration.

- Refer to the `ReadMe` [here](https://github.com/pivotalservices/redis_pub_sub_with_git_webhook) to have the publisher app running

- Add `RedisConnector` and `Consumer` services into service collection

    ```c#
    services.AddRedisConnectionMultiplexer(Configuration);
            
    services.AddSingleton<IConsumer, Consumer>();
    ```

- Inject into `Configure` method of `Startup.cs`, as below

    ```c#
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, IConsumer consumer, IConfigurationRoot configurationRoot)
    {
        ...

        consumer.StartConsumption(Configuration["redis:channel"]);

        consumer.MessageReceived += ((message) =>
        {
            Console.Out.WriteLine($"Received Message, {message.Id}, refreshing the configuration...");
            configurationRoot.Reload();
        });
    }
    ```

##### Hope you have fun!
