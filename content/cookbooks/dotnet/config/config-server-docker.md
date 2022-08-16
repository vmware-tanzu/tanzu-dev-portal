+++
title = "Config Server and Docker"
date = 2018-07-18T13:26:58-05:00
+++

## Run config-server locally in Docker

Config-server on Docker can be setup to connect to either git or read from local files. For local development it's a little simpler to clone the repository locally and point the docker instance to the directory. This avoids any potential authentication challenges and means you can test configuration prior to committing to git.

### Steps to configure

- Clone Config Repository locally

- Execute the following `Docker run` command which will create and start the `steeltoeoss/config-server` docker image.

    ```sh
    Docker run -d -ti -p 8888:8888 -v [path-to-repo]:/config --name steeltoe-config steeltoeoss/config-server --spring.profiles.active=native
    ```

- Test config-server is running

    ```sh
    curl -X GET http://localhost:8888/MyApp/Local
    ```

- The `Steeltoe` Service Discovery libraries default to localhost and port `8888`.

## Enable Encryption

The `steeltoeoss/config-server` Docker image supports the encryption feature of config-server.

### Steps to configure

- Generate a key:

    ```sh
    `openssl genpkey -algorithm RSA -outform PEM -pkeyopt rsa_keygen_bits:2048 > server.key`
    `openssl rsa -in server.key | tr -d '\n' > server_rsa.key`
    ```

Refer [here](https://docs.pivotal.io/spring-cloud-services/1-3/common/config-server/configuring-with-git.html#encryption-and-encrypted-values) for more details.

- Execute the following `Docker run` command which will create and start the `steeltoeoss/config-server` docker image. Note that the key from the previous step should be provided.

    ```sh
    Docker run -d -ti -p 8888:8888 -v [path-to-repo]:/config --name steeltoe-config steeltoeoss/config-server --spring.profiles.active=native --spring.cloud.config.server.encrypt.enabled=true --spring.cloud.config.server.encrypt.key=[generatedkey]
    ```

- Test config-server is running and encryption is enabled

    ```sh
    # Ensure config-server is healthy and serving configuration
    curl -X GET http://localhost:8888/MyApp/Local

    # Test the encrypt endppoint is enabled and encrypting strings
    curl -X POST  http://localhost:8888/encrypt -d IAmASecret
    ```

- The response from the `POST` above can be used within the YAML files like so:

    ```yaml
    MyConfigValue: "{cipher}AQCKf2HKWXfvQJ9Y4hi+MGyFmYCehsFfiqC3XZw5TUH1ygmDmKeFuc4Ww1DH7NzHsWKdBKFUMyE+IUL4tHwzHf8ilXNX61RalQBC9kphm0maC9YbaYRVDpTP5CkCeEQEhgq5aXIk7fWzpXLwGc9Wr5yWzF9rbTTf/3EJngq+cByjH96Ur4Zo0bmjWEutER6QP/Czm1B0S55FVqeXQ0RsHRYAA6EI8/ReRp3jlmBv6JGnpNBPbuJKmejTHtAWkOEG/1TUuaYfpp1C8+S3XI6ASB7L17CBDWA/hYMOvH/Fj6q4qbSpr9+RaLV0jwErQzFcNu/tqBNgd+6c4XsU48kGZSU7IYC2G4d8ti7691XqbFHodJuFqNxucF3L9LwpAlCGtlg="
    ```

- Subsequent configuration `GET` should return the decrypted value. Note that config-server returns the string `<N/A>` if decryption fails.

    ```sh
    # Response should contain only decrypted strings
    curl -X GET http://localhost:8888/MyApp/Local
    {
        "name": "MyApp",
        "profiles": [
            "Local"
        ],
        "label": null,
        "version": null,
        "state": null,
        "propertySources": [
            {
                "name": "file:config/application.yml",
                "source": {
                    "MyConfigValue": "IAmASecret"
                }
            }
        ]
    }
```
