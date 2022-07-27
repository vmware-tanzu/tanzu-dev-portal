+++
title = "Config Server Health Contributor"
date = 2018-08-08T12:51:40-05:00
+++

## ConfigServer Health Contributor .NET/.NET Core

Config server health contributor will be part of eventual release of `Steeltoe.Extensions.Configuration.CloudFoundryCore` package. For now I created a `HealthContributor` class for use until we get it. Code snippets and instructions are given below.

## Additional Notes
- Package references required

    ```xml
    <PackageReference Include="Pivotal.Extensions.Configuration.ConfigServerCore" Version="2.0.1" />
    <PackageReference Include="Steeltoe.Extensions.Configuration.CloudFoundryCore" Version="2.0.1"/>
    <PackageReference Include="Steeltoe.Management.CloudFoundryCore" Version="2.0.1"/>
    ```

- To be added in `Startup.cs` --> `ConfigureServices` method

    ```c#
    services.ConfigureConfigServerClientOptions(Configuration);
    services.AddScoped<IHealthContributor, ConfigServerHealthContributor>();
    ```

- `HealthContributor` class file

    ```c#
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using Pivotal.Extensions.Configuration.ConfigServer;
    using Steeltoe.Common.Http;
    using Steeltoe.Management.Endpoint.Health;

    namespace ConfigServer.Vault.Health
    {
        public class ConfigServerHealthContributor : IHealthContributor
        {
            private ConfigServerClientSettingsOptions _settings;
            private HttpClient _client;
            private const string TOKEN_HEADER = "X-Config-Token";

            public ConfigServerHealthContributor(IOptions<ConfigServerClientSettingsOptions> confgServerSettings)
            {
                _settings = confgServerSettings.Value;
            }

            public string Id => "ConfigServer";

            public IOptions<ConfigServerClientSettingsOptions> ConfgServerSettings { get; }

            public Steeltoe.Management.Endpoint.Health.Health Health()
            {
                if (_client == null)
                    _client = GetHttpClient();

                var requestUri = GetConfigServerUri();
                var request = GetRequestMessage(requestUri);
                bool isSuccess = false;
                var health = new Steeltoe.Management.Endpoint.Health.Health();
                try
                {
                    var result = Task.Run(async () => await _client.SendAsync(request)).Result;
                    isSuccess = result.IsSuccessStatusCode;
                    if (isSuccess)
                    {
                        health.Details.Add("status", HealthStatus.UP.ToString());
                    }
                    else
                    {
                        health.Details.Add("status", $"Failure to retrieve config data");
                        health.Details.Add("server-reply",result.Content.ReadAsStringAsync().Result);
                    }
                }
                catch (Exception e)
                {
                    health.Details.Add("status", "DOWN");
                }
                
                health.Status = isSuccess ? HealthStatus.UP : HealthStatus.OUT_OF_SERVICE;
                
                
                return health;
            }

            private HttpClient GetHttpClient() => HttpClientHelper.GetHttpClient(_settings.ValidateCertificates, _settings.Timeout);

            private string GetConfigServerUri()
            {
                var path = _settings.Name + "/" + _settings.Environment;

                if (!_settings.Uri.EndsWith("/"))
                    path = "/" + path;

                return _settings.Uri + path;
            }

            private HttpRequestMessage GetRequestMessage(string requestUri)
            {
                var request = HttpClientHelper.GetRequestMessage(HttpMethod.Get, requestUri, _settings.Username, _settings.Password);

                if (!string.IsNullOrEmpty(_settings.Token))
                    request.Headers.Add(TOKEN_HEADER, _settings.Token);

                return request;
            }
        }
    }
    ```
