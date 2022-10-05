---
date: '2022-09-22'
description: RSocket Security with Spring Boot
lastmod: '2022-08-11'
linkTitle: RSocket Security with Spring Boot
metaTitle: RSocket Security with Spring Boot via Spring Security
patterns:
- API
tags:
- Security
- Getting Started
- Kotlin
- Reactive
- Spring Boot
- Spring Security
team:
- Mario Gray
title: Implementing Secure RSocket services with Spring Boot
oldPath: "/content/guides/spring/reactive-rsocket-security-spring-boot-pt1.md"
aliases:
- "/guides/spring/reactive-distributed-tracing"
level1: Building Modern Applications
level2: Frameworks and Languages
---

This guide will discuss RSocket service security with Spring Boot, by way of Spring Security. We will surface RSocket routes that enforce specific security measures and describe what this means internally. This guide will inform you of the additional configuration options provided when configuring for Spring Security on a Spring Boot 2.7.x/RSocket application.

It is assumed the developer knows Kotlin, uses Spring Boot, and has an understanding of the [Reactive Streams](https://github.com/reactive-streams/reactive-streams-jvm) on the JVM. If you're new to Spring Security for Reactive streams, then this guide should help shed light on the subject. Of course, the best place to understand are [the reference docs](https://docs.spring.io/spring-security/reference/5.6.5/reactive/integrations/rsocket.html#page-title), so please read them!

## Authorization vs Authentication

[Authentication](https://docs.spring.io/spring-security/reference/features/authentication/index.html) is the process which lets our apps identify a user. Authentication systems are methods which describe a secure process of identification. For example you're familiar with [multi factor authentication](https://www.cisa.gov/publication/multi-factor-authentication-mfa) which uses username and password followed by a side-channel delivered code (via text message, Email, etc..). You might also have used [SSO](https://www.cloudflare.com/learning/access-management/what-is-sso/) (Single Sign-n) which aggregates multiple backends that coordinate a single authentication session for the user. At the end of the day, they still rely on some form of user input - maybe a face, a fingerprint, or plain old username and password.

This example will focus on username and password authentication to illustrate the mechanism underneath which are similar regardless of authentication method.

[Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html) (access control) is the process which lets your application determine how access is granted to users. This begins to sound straight forward, but can be surfaced in our application in a number of ways. [OAuth](https://developer.okta.com/docs/concepts/oauth-openid/) is popular since it allows an application share user-rights with an unrelated system. On top of OAuth is usually Role Based Access Control - in which a user may have granted privileges given by role 'names' - e.g. 'WRITE', 'READ' for a given resource. Additionally, RBAC relies on the application to make these decisions as you will see later in this guide.

## The Application

The [Example app](https://github.com/Mario5Gray/simple-spring-reactive-security) is an RSocket service we will use to test authentication and authorization.

The service interface is as follows:

```kotlin
interface TreeService {
    fun shakeForLeaf(): Mono<String> // 1
    fun rakeForLeaves(): Flux<String> // 2

    companion object {
        val LEAF_COLORS = listOf("Green", "Yellow", "Orange", "Brown", "Red")
    }
}
```

Above, we have 2 functions and a static list that:

1) Return a `Mono<String>` of leaf colors.
2) Return a `Flux<String>` of leaf colors.

We can then write the backing implementation:

```kotlin
class TreeServiceImpl : TreeService {

    override fun shakeForLeaf(): Mono<String> = Mono.just(LEAF_COLORS.get(Random.nextInt(LEAF_COLORS.size)))

    override fun rakeForLeaves(): Flux<String> = Flux
            .fromStream(
                    Stream.generate { Random.nextInt(LEAF_COLORS.size) }
                            .limit(10)
            ).map { LEAF_COLORS[it] }
}
```

Subclass the service interface to create the RSocket controller using [@MessageMapping](https://github.com/spring-projects/spring-framework/blob/main/spring-messaging/src/main/java/org/springframework/messaging/handler/annotation/MessageMapping.java):

```kotlin
interface TreeControllerMapping : TreeService {
    @MessageMapping("shake")
    override fun shakeForLeaf(): Mono<String>

    @MessageMapping("rake")
    override fun rakeForLeaves(): Flux<String>
}
```

Next, subclass our service once more and apply Spring Security annotations. Use [@PreAuthorize](https://docs.spring.io/spring-security/reference/5.6.8/servlet/authorization/expression-based.html#_access_control_using_preauthorize_and_postauthorize), which is the preferred way for securing reactive streams through annotation.

```kotlin
interface TreeServiceSecurity : TreeService {

    @PreAuthorize("hasRole('SHAKE')")
    override fun shakeForLeaf(): Mono<String>

    @PreAuthorize("hasRole('RAKE')")
    override fun rakeForLeaves(): Flux<String>
}
```

Finally, we can put the whole thing together and expose it as an RSocket server with help from Spring Boot!

### Putting the App together

The production application will merge security rules, messaging routes and backing implementation. Using Spring Security's supp and provide a user database where run-time authentication and authorization can be derived. In the next listing, we will look at enabling Spring Security for RSocket services.

```kotlin
@EnableReactiveMethodSecurity  // 1
@EnableRSocketSecurity // 2
@SpringBootApplication
class App {

 // ...

    @Controller
    class ServerTreeController : TreeControllerMapping,
            TreeServiceSecurity, TreeService by TreeServiceImpl() {  // 3
        fun status(@AuthenticationPrincipal user: Mono<UserDetails>): Mono<String> =
                user.hasElement().map (Boolean::toString)
    }

// ...

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<App>(*args)
        }
    }
}
```

Spring Security uses a [ReactiveSecurityContextHolder](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/context/ReactiveSecurityContextHolder.html) to place the [SecurityContext](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/context/SecurityContext.html) into [Reactor's Context](https://projectreactor.io/docs/core/release/reference/#context).

Since reactive operators like map, flatmap, etc.. have access to this `SecurityContext`, Spring Security (or the developer) can then apply an advice to determine things like the current logged in user and its privileges. The way to enable this goes as follows:

1) Enabled the [RSocketSecurity](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/annotation/rsocket/RSocketSecurity.java) bean by decorating a configuration class with [@EnableRSocketSecurity](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/annotation/rsocket/EnableRSocketSecurity.java). What this does is as stated in documentation -  it allows configuring RSocket based security. 
2) Enable security-specific annotations on Reactive Streams (return types of [Publisher](https://www.reactive-streams.org/reactive-streams-1.0.3-javadoc/org/reactivestreams/Publisher.html?is-external=true)), add the @[EnableReactiveMethodSecurity](https://github.com/spring-projects/spring-security/blob/210693eb6bd0cba51874ce150c73090c95d4e08b/docs/modules/ROOT/pages/reactive/authorization/method.adoc) annotation to the main configuration class. 
3) The RSocket messaging controller is fully configured here, along with the third unsecure `status` route. The status route is decorated by [@AuthenticationPrincipal](https://github.com/spring-projects/spring-security/blob/main/web/src/main/java/org/springframework/security/web/bind/annotation/AuthenticationPrincipal.java) which uses the `SecurityContext` to inject - if available - the UserDetails object.

> **_Customize the User:_** There is a nice to know informal example that describes how one would resolve a custom User object with the [AuthenticationPrincipalArgumentResolver](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/bind/support/AuthenticationPrincipalArgumentResolver.html).

## Application Users

Spring Security provides concrete [User](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/userdetails/User.java) objects that implement the [UserDetails](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/userdetails/UserDetails.java) interface. This interface is used internally and should be subclassed when you have specific needs. The [User.UserBuilder](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/userdetails/User.java#L215) object provides a fluent builder for describing instances of UserDetail.

Spring Security comes with components to handle UserDetail storage. This activity is exposed for Reactive services, through [ReactiveUserDetailsService](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/userdetails/ReactiveUserDetailsService.java). The easiest way to use this is by creating an instance of the in-memory [MapReactiveUserDetailService](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/userdetails/MapReactiveUserDetailsService.java).

To review, we can completely populate a `ReactiveUserDetailService` in our production app:

```kotlin
class App {
    // ...
    @Bean
    open fun userDetailService(): ReactiveUserDetailsService =
            MapReactiveUserDetailsService(
                    User.builder()
                            .username("plumber")
                            .password("{noop}nopassword")   // 1
                            .roles("SHAKE")
                            .build(),
                    User.builder()
                            .username("gardner")
                            .password("{noop}superuser")
                            .roles("RAKE", "LOGIN")
                            .build()
            )
}
```

The above code sample reads well, but there is some nuance with password setup:

 1) The builder supports the algorithm hint using curly braces. Here we specify `noop` (plaintext) password encoding. In the background, Spring Security uses an [DelegatingPasswordEncoder](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/password/DelegatingPasswordEncoder.html) to determine the proper encoder to use such as pbkdf2, scrypt, sha256, etc...

> **_WARNING:_**  Please do not use plaintext `{noop}` in production!
### Review of RSocket Server Security

By using `@EnableRSocketSecurity`, we gain RSocket security through [Payload Interceptors](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/rsocket/api/PayloadInterceptor.html). Interceptors themselves are cross-cutting, and Spring Security uses them to work on processing at various parts of an interaction such as:

* Transport level
* At the level of accepting new connections
* Performing requests
* Responding to requests

Since a payload can have many metadata formats to confer credential exchange, Spring's [RSocketSecurity](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/annotation/rsocket/RSocketSecurity.java) bean provides a fluent builder for configuring [Simple](https://github.com/rsocket/rsocket/blob/master/Extensions/Security/Simple.md), Basic, JWT, and custom authentication methods, in addition to RBAC authorization.

The `RSocketSecurity` provided builder will describe a set of [AuthenticationPayloadInterceptors](https://github.com/spring-projects/spring-security/blob/main/rsocket/src/main/java/org/springframework/security/rsocket/authentication/AuthenticationPayloadInterceptor.java) that converts payload metadata into an [Authentication](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/core/Authentication.java) instances inside the `SecurityContext`. 

To further our understanding of the configuration, lets examine the [SecuritySocketAcceptorInterceptorConfiguration](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/annotation/rsocket/SecuritySocketAcceptorInterceptorConfiguration.java) class, which sets up the default security configuration for RSocket.

 This class, imported by `@EnableRSocketSecurty`, will configure a [PayloadSocketAcceptorInterceptor](https://github.com/spring-projects/spring-security/blob/main/rsocket/src/main/java/org/springframework/security/rsocket/core/PayloadSocketAcceptorInterceptor.java) for [Simple](https://github.com/rsocket/rsocket/blob/master/Extensions/Security/Simple.md) and basic (deprecated) authentications. The [PayloadExchangeMatchers](https://github.com/spring-projects/spring-security/blob/main/rsocket/src/main/java/org/springframework/security/rsocket/util/matcher/PayloadExchangeMatcher.java) describe which exchanges require authentication:

```java
package org.springframework.security.config.annotation.rsocket;

class SecuritySocketAcceptorInterceptorConfiguration {
    //...
	private PayloadSocketAcceptorInterceptor defaultInterceptor(ObjectProvider<RSocketSecurity> rsocketSecurity) {
		rsocket.basicAuthentication(Customizer.withDefaults())  // 1
			.simpleAuthentication(Customizer.withDefaults())    // 2
			.authorizePayload((authz) -> authz                  // 3
				.setup().authenticated()                        // 4
				.anyRequest().authenticated()                   // 5
				.matcher((e) -> MatchResult.match()).permitAll() // 6
			);
    //...
}
```

The `authorizePayload` method decides how we can apply authorization at the server setup and request exchange. The default exchange we see configured above include:

1) Basic credential passing for backwards compatibility; this is deprecated in favor of #2
2) [Simple](https://github.com/rsocket/rsocket/blob/master/Extensions/Security/Simple.md) credential passing is supported by default; this is the winning spec and supersedes Basic.
3) Access control rules that specifies which exchanges must be authenticated before being granted access to the server. 
4) Builds a PayloadExchangeMatcher to ensures that `SETUP` exchanges require authentication metadata.
5) Builds another PayloadExchangeMatcher for `request` exchanges requiring authentication.
6) This custom matcher matches everything, and permits access.

> **_Request vs Setup:_** The [PayloadExchangeType](https://github.com/spring-projects/spring-security/blob/main/rsocket/src/main/java/org/springframework/security/rsocket/api/PayloadExchangeType.java) defines any `request` exchange as one of the following internal [RSocket Protocol](https://github.com/rsocket/rsocket/blob/master/Protocol.md#terminology) units of operation; FIRE_AND_FORGET, REQUEST_RESPONSE, REQUEST_STREAM, REQUEST_CHANNEL and METADATA_PUSH. SETUP and PAYLOAD (payload frames can have metadata) units are considered `SETUP` exchanges.

### Security in Reactive Streams

With the usage of `@EnableReactiveMethodSecurity` in our main class, we gained the ability to annotate reactive streams with rules for authorization. This happens mainly in the [ReactiveAuthorizationManager](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/authorization/ReactiveAuthorizationManager.java) instances for specific use cases. Out of the box, we get the support for a variety of expressions with [@PreAuthorize](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/access/prepost/PostAuthorize.java) to introspect the authenticated user for necessary privileges. There are a variety of built-in expressions that we can use. 

Here are built-in expressions supported as defined in [SecurityExpressionOperations](https://github.com/spring-projects/spring-security/blob/main/core/src/main/java/org/springframework/security/access/expression/SecurityExpressionOperations.java) and described in [the Docs](https://docs.spring.io/spring-security/reference/servlet/authorization/expression-based.html):

| Expression | Description |
|------------|-------------|
|hasRole(role: String) | Returns true if the current principal has the specified role.
For example, hasRole('admin') By default if the supplied role does not start with 'ROLE_' it will be added. This can be customized by modifying the defaultRolePrefix on DefaultWebSecurityExpressionHandler. |
|hasAnyRole(vararg roles: String)|	Returns true if the current principal has any of the supplied roles (given as a comma-separated list of strings)|
|hasAuthority(authority: String)|Returns true if the current principal has the specified authority. For example, `hasAuthority('read')`|
|hasAnyAuthority(vararg authorities: String)|Returns true if the current principal has any of the supplied authorities (given as a comma-separated list of strings) For example, `hasAnyAuthority('read', 'write')`|
|principal|	Allows direct access to the principal object representing the current user|
|authentication|	Allows direct access to the current Authentication object obtained from the SecurityContext|
|permitAll	|Always evaluates to true|
|denyAll|	Always evaluates to false|
|isAnonymous()|	Returns true if the current principal is an anonymous user|
|isRememberMe()|	Returns true if the current principal is a remember-me user|
|isAuthenticated()|	Returns true if the user is not anonymous|
|isFullyAuthenticated()|	Returns true if the user is not an anonymous or a remember-me user|
|hasPermission(target: Any, permission: Any)| Returns true if the user has access to the provided target for the given permission. For example, `hasPermission(domainObject, 'read')`|
|hasPermission(targetId: Any, targetType: String, permission: Any)|Returns true if the user has access to the provided target for the given permission. For example, `hasPermission(1, 'com.example.domain.Message', 'read'`)|

To gain fundamental understanding of the underpinnings of Authorization, I encourage you to read the [Spring Docs](https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html). This documentation is robust and does well in describing exactly how Authorization operates under the hood - especially for situations where you have legacy framework code and want to customize.

> **_CURRENTLY:_** For custom expressions, Spring Security supports return values of `boolean` and cannot be wrapped in deferred values such as a reactive `Publisher`. As such, the expressions must not block.

## Security at the Client

Spring RSocket creates a [RSocketRequesterBuilder](https://github.com/spring-projects/spring-framework/blob/main/spring-messaging/src/main/java/org/springframework/messaging/rsocket/RSocketRequester.java#L164) bean at startup. This bean provides a builder for creating new [RSocketRequesters](https://github.com/spring-projects/spring-framework/blob/main/spring-messaging/src/main/java/org/springframework/messaging/rsocket/RSocketRequester.java). An `RSocketRequester` provides a single connection interface to RSocket operations usually across a network.

RSocket Security can be applied at the setup and or request levels. If a connection is shared across multiple users, then it is recommended to authenticate the setup with its own 'connectivity' user,then each request with its specific user. We will discuss both methods below.  

### Authentication Styles on the Client

We can secure the entire RSocket connection by sending metadata in the [SETUP](https://github.com/rsocket/rsocket/blob/master/Protocol.md#frame-setup) frame. The `RSocketRequester.Builder` builder lets us specify `setupMetadata` that contains authentication metadata.

Our custom `RequestFactory` class makes it so we don't repeat the connection builder every time a requester is needed. We either need an authenticated connection or a non-authenticated connection. We will create the authenticating Requester below:

```kotlin
open class RequesterFactory(private val port: String) {
        companion object {
        val SIMPLE_AUTH = MimeTypeUtils.parseMimeType(WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION.string) // 1
    }
    open fun authenticatedRequester(username: String, password: String): RSocketRequester =
            RSocketRequester
                    .builder()
                    .rsocketStrategies { strategiesBuilder ->
                        strategiesBuilder.encoder(SimpleAuthenticationEncoder())
                    } // 2
                    .setupMetadata(UsernamePasswordMetadata(username, password), SIMPLE_AUTH) //3
                    .connectTcp("localhost", port.toInt())
                    .block()!!
 //..
}    
```
The lines of code we want to inspect here relate to the specifics for setup frame authentication metadata:

1) Requester needs to know how to encode our `Simple` authentication metadata.
2) Which needs to be registered as an encoder in Spring's [RSocketStrategies](https://github.com/spring-projects/spring-framework/blob/main/spring-messaging/src/main/java/org/springframework/messaging/rsocket/RSocketStrategies.java).
3) Then use `setupMetadata` to encode credentials going into the setup frame.

Next, we need a non-authenticated setup requester:

```kotlin
    open fun requester(): RSocketRequester =
            RSocketRequester
                    .builder()
                    .rsocketStrategies { strategiesBuilder ->
                        strategiesBuilder.encoder(SimpleAuthenticationEncoder())
                    }
                    .connectTcp("localhost", port.toInt())
                    .block()!!
```

We need to keep the strategy encoder for `Simple` authentication so that we can still send authenticated requests at request time. Other than that, nothing else is different.

Next, we can create some tests to demonstrate connectivity and test whether our configuration is valid.

## Testing the Client and Server

Lets produce some integration tests. We want to standup the RSocketServer on it's network port, then send real authenticated frames over the wire. We will also know whether authenticated connections are acting secure by ensuring proper rejection of an unauthenticated setup. In this listing, we will look at the options chosen in this test case:

```kotlin
@SpringBootTest         // 1
class RequesterFactoryTests {
    @Test
    fun `no setup authentication is REJECTEDSETUP`(@Autowired requesterFactory: RequesterFactory) {
        val requester = requesterFactory.requester()    // 2

        val request = requester
                .route("status")
                .retrieveMono<String>() // 3

        StepVerifier
                .create(request)
                .verifyError(RejectedSetupException::class.java)  //4
    }

```
Whats happening is a usual test setup, but lets inspect what our test means:

1) Using `@SpringBootTest` ensures we get full autowiring of our production code to setup the RSocket server.
2) Create a requester that omits setup authentication metadata.
3) The test site is simple and merely sends a request to the `status` route that returns whether we are authenticated or not.
4) Because our server configuration states that setup must be authenticated, we should expect a [RejectedSetupExeption](https://github.com/rsocket/rsocket-java/blob/master/rsocket-core/src/main/java/io/rsocket/exceptions/RejectedSetupException.java) error upon request.

Next, we will test when we send authenticated requests without authentication setup:

```kotlin
    @Test
    fun `sends credential metadata in request is REJECTEDSETUP`(@Autowired requesterFactory: RequesterFactory) {
        val requester = requesterFactory.requester()

        val request = requester
                .route("status")
                .metadata(UsernamePasswordMetadata("shaker", "nopassword"), RequesterFactory.SIMPLE_AUTH) // 1
                .retrieveMono<String>()

        StepVerifier
                .create(request)
                .verifyError(RejectedSetupException::class.java)    // 2
    }
```

This test case is very similar to the previous one except:

1) We only authenticate the request with `Simple` authentication. 
2) This wont work, and will result with RejectedSetupException since our server expects authentication in the `setup` frame.

### Authorization integration tests

Next, we will test for authentication and to check that our `@PreAuthorize` rules are functioning. Recall earlier we have a `TreeServiceSecurity` class that adds `@PreAuthorize` to our service methods. Lets test this using a user of insufficient privilege:

```kotlin
    @Test
    fun `underprivileged shake request is APPLICATIONERROR Denied`(@Autowired requesterFactory: RequesterFactory) {
        val request = requesterFactory
                .requester("raker", "nopassword") //1
                .route("shake")  // 2
                .retrieveMono<String>()

        StepVerifier
                .create(request)
                .verifyError(ApplicationErrorException::class.java) //3
    }
```

This test will:

1) create the authenticated requester. But this user is the 'raker' and does not have 'shake' authority.
2) sends a request to the 'shake' route. This route is `@PreAuthorized` protected for users having 'shake' authority.
3) Since we don't have this kind of permission for the 'raker' user, we will get [ApplicationErrorException](https://github.com/rsocket/rsocket-java/blob/master/rsocket-core/src/main/java/io/rsocket/exceptions/ApplicationErrorException.java) with the message 'Denied'.

> **_NOTE TO FUTURE:_** To ensure safer communication while using `Simple` authentication, you might apply TLS security across the transport. This way, no one can snoop the network for credential payloads.

## Method Security tests

We can get closer to unit isolation by removing the RSocketServer, and issuing requests directly to the service instance.  This can be done using a compliment of [method testing supports](https://docs.spring.io/spring-security/reference/servlet/test/method.html) provided out of the box by Spring Security.

For example, we want to test that authorization on the 'shake' method works. The 'shakeForLeaf' method requires a user with 'shake' privileges. We can mock a user having such authority:

```kotlin
@SpringBootTest
class MethodSecurityTests {
    @Test
    @WithMockUser("testuser", roles = ["SHAKE"])
    fun `should serve the mock user`(@Autowired svc: TreeService) {
        StepVerifier
                .create(svc.shakeForLeaf())
                .assertNext {
                    Assertions
                            .assertThat(it)
                            .isNotNull
                            .containsAnyOf(*TreeService.LEAF_COLORS.toTypedArray())
                }
    }
```

We can also test with users populated from our own `ReactiveUserDetailsService` with help from the [WithUserDetails](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/test/context/support/WithUserDetails.html) annotation as follows:

```kotlin
    @Test
    @WithUserDetails("shaker")
    fun `should serve the withUserDetails user`(@Autowired svc: TreeService) {
        StepVerifier
                .create(svc.shakeForLeaf())
                .assertNext {
                    Assertions
                            .assertThat(it)
                            .isNotNull
                            .containsAnyOf(*TreeService.LEAF_COLORS.toTypedArray())
                }
                .verifyComplete()
    }
```

There is more to testing secure methods in reactive environments. To learn more about Spring Security test support, check out the [docs](https://docs.spring.io/spring-security/reference/servlet/test/index.html) which give detailed explanation and examples for the above mentioned supports and more!

## Closing and Next Step

This guide introduced you to Spring Boot and Spring Security with RSocket. One key take-away, that Spring Security configuration can allow `Simple` or other authentication schemes such as JWT and Kerberos. Understanding how permissions work out of the box in Spring Security, and applying authorization to Reactive Methods helps when custom logic is needed. Then next step on this topic will take advantage of Spring Security's JWT interface. For in-depth implementation details on that topic now, please see the [Spring Security Samples](https://github.com/spring-projects/spring-security-samples) project on Github. 

## Informational and Learning Material

Ben Wilcock's [Getting Started to RSocket Security](https://spring.io/blog/2020/06/17/getting-started-with-rsocket-spring-security)

[Going coroutine with Reactive Spring Boot](https://spring.io/blog/2019/04/12/going-reactive-with-spring-coroutines-and-kotlin-flow)

[Spring Security Reference](https://docs.spring.io/spring-security/reference/)

[Spring Security Testing](https://docs.spring.io/spring-security/reference/servlet/test/index.html)

[Spring Shell Reference](https://docs.spring.io/spring-shell/docs/2.1.0/site/reference/htmlsingle/#_what_is_spring_shell)

[Building WebApps with Spring-Boot and Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/)

[JWT RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)

[XACML for when RBAC is not enough](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=xacml)