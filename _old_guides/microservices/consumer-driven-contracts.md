---
date: '2021-02-24'
lastmod: '2021-05-04'
linkTitle: Consumer Driven Contracts
patterns:
- API
tags:
- Spring Cloud Contract
title: Modernization with Consumer Driven Contracts
topics:
- Spring
- Microservices
weight: 4
oldPath: "/content/guides/microservices/consumer-driven-contracts.md"
aliases:
- "/guides/microservices/consumer-driven-contracts"
level1: Modernizing Legacy Applications
level2: Packaging, Operating, and Outside Enhancements
---

There are multiple approaches to modernizing applications and defining APIs. This guide describes the consumer driven contracts approach. The guide [Understanding API-First Development](/guides/microservices/api-first-development/) describes an alternative approach. 

The consumer driven contracts approach may be useful when a team is building many related services at the same time as part of a modernization effort, and your team knows the "domain language" of the bounded context, but doesn't know the individual properties of each aggregate and event payload.

This approach is also useful when a legacy application contains a large data model and existing service surface area, and your team doesn't want to port 100% of the legacy application to a microservices architecture. (Maybe not all of that legacy functionality is needed anymore.  It's been around for a long time and no one really knows everything it does.)

Consumer driven contracts help address the following issues:

- How can you add to an API without breaking downstream clients?
- How can something be removed from a service without breaking downstream clients?
- How can a service developer find out who is using their service?
- How can a service developer release with short release cycles and continuous delivery?

In a modernization effort, there are several additional problems addressed by consumer driven contracts:
- How can a team know how much of the legacy functionality to add to a new service?
- How can a team decide what order to add new functionality?

## Using Consumer Driven Contracts

In an event-driven architecture, many microservices expose two kinds of APIs: a RESTful API over HTTP and a message-based API for publishing and subscribing to domain events.  The messaging tier provides a mechanism for a constellation of microservices to be loosely coupled as an emergent and reactive system.  The RESTful API provides a means for integrating with these services in a synchronous fashion as well as to provide complex query capability for services that have received events from a service.  By allowing consumers to provide contracts for both of these tiers, we can provide a _prescribed language_ to our consumers that matches their needs.

### Using Separate Test Base Classes for Consumers and Transport Types
[Spring Cloud Contract](https://spring.io/projects/spring-cloud-contract) provides support for consumer driven contracts and service schemas in Spring applications, covering a range of options for writing tests and publishing them as assets, ensuring that a contract is kept by producers and consumers for both HTTP and message-based interactions. 

Spring Cloud Contract allows you to control the base class that generated server tests use, and these allow us to customize the individual tests for our needs with various mocks and configuration.  The DNA project initializer sets up a `contracts` directory in the specification project and configures a single base class for all tests.  Instead, we recommend setting up a directory structure such as the following to allow for tuning tests for individual consumers and to separate HTTP/messaging concerns:

```
contracts/
 |- <consumer1>/
 |--- http/
 |----- shouldReturnResultWhenRequestIsMade.groovy
 |--- messaging/
 |----- shouldProduceSuccessMessageWhenRequestIsProcessed.groovy
 |- <consumer2>/
 |--- http/
 |--- messaging/
 ...
```

In your `build.gradle` file, you'll need to configure how this gets mapped to base classes.  The following will generate tests with a base class made up of the last two segments of the package such as <consumer1>HttpBase or <consumer2>MessagingBase in the `com.rate.auto.autorateablequote.contract` package:

```yaml
contracts {
  packageWithBaseClasses: "com.rate.auto.autorateablequote.contract"
}
```

You can then provide those base class implementations as such:

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = { ServiceApplication.class })
@AutoConfigureMockMvc
@Import(WireMockConfiguration.class)
@ActiveProfiles("mock")
public abstract class Consumer1HttpBase {

	@Autowired
	private MockMvc mvc;

	@Before
	public void test() {
    	RestAssuredMockMvc.mockMvc(this.mvc);
	}

}

@RunWith(SpringRunner.class)
@SpringBootTest(classes = { ServiceApplication.class })
@AutoConfigureMockMvc
@AutoConfigureMessageVerifier
@Import(WireMockConfiguration.class)
@ActiveProfiles("mock")
public abstract class Consumer1MessagingBase {

	@Autowired
	private MockMvc mvc;

	@Before
	public void test() {
    	RestAssuredMockMvc.mockMvc(this.mvc);
	}

	/**
 	* This method is called from the triggeredBy() method in the contract DSL to
 	* publish the message to be tested.
 	*/
	public void requestAutoRateApiIsCalled() {
    	// given:
    	MockMvcRequestSpecification request = RestAssuredMockMvc.given()
            	.header("Content-Type", "application/json;charset=UTF-8")
            	.body("{\"quote\":{\"jurisdiction\":\"NY\",\"policyEffectiveDate\":\"2017-05-25T15:04:05-04:00\",\"policyTransactionType\":\"01\",\"quoteEffectiveDate\":\"2017-05-25T15:04:05-04:00\",\"quoteId\":\"1\"}}");

    	// when:
    	ResponseOptions response = RestAssuredMockMvc.given().spec(request)
            	.post("/rateableQuote");
	}
}
```

### Contracts for RESTful APIs

```yaml
def iso8601FormattedDatePattern = '(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2})\\:(\\d{2})\\:(\\d{2})(\\.\\d+)?[+-](\\d{2})\\:(\\d{2})'

org.springframework.cloud.contract.spec.Contract.make {
	request {
    	method 'POST'
    	urlPath('/rateableQuote') {
        	queryParameters {
        	}
    	}
    	body([
            	quote: [
                	jurisdiction: value(regex('[a-zA-Z]{2}')),
                	policyEffectiveDate: value(producer('2017-05-25T15:04:05.999-04:00'), consumer(regex(iso8601FormattedDatePattern))),
                	policyTransactionType: value(regex('[0-9]{2}')),
                	quoteEffectiveDate: value(producer('2017-05-25T15:04:05.999-04:00'), consumer(regex(iso8601FormattedDatePattern))),
                	quoteId: value(regex('[0-9]+'))
            	]
    	])
    	headers {
        	contentType("application/json;charset=UTF-8")
    	}
	}

	response {
    	status 200
    	headers {
        	header("Content-Type", "application/json;charset=UTF-8")
    	}

    	body([
            	rate: '$5.00'
    	])
	}
}
```

### Contracts for Messaging APIs

In order to create tests and stubs for services that communicate via messages over [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream), you'll need to add a handful of dependencies to your build.gradle:

```yaml
testCompile("org.springframework.cloud:spring-cloud-stream-test-support")
```

In order to test that your API controller emits a message as a side effect of an appropriate message call, you'll need to express that contract in the contract DSL as follows:

```yaml
def iso8601FormattedDatePattern = '(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2})\\:(\\d{2})\\:(\\d{2})(\\.\\d+)?[+-](\\d{2})\\:(\\d{2})'

org.springframework.cloud.contract.spec.Contract.make {

	input {
    	// the contract will be triggered by a method
    	triggeredBy('requestAutoRateApiIsCalled()')
	}

	outputMessage {
    	// in Spring Cloud Stream, this is the destination channel where the message is expected to be published
    	sentTo 'rateable_quote'

    	body([
            	eventId: "1",
            	type: "QUOTE_DATA_COLLECTED",
            	entity: [
                    	id: 1,
                    	quoteId: value(regex('[0-9]+')),
                    	policyEffectiveDate: value(regex(iso8601FormattedDatePattern)),
                    	policyTransactionType: value(regex('[0-9]{2}')),
                    	jurisdiction: value(regex('[a-zA-Z]{2}')),
                    	quoteEffectiveDate: value(regex(iso8601FormattedDatePattern)),
                    	createdAt: value(regex(iso8601FormattedDatePattern)),
                    	lastModified: value(regex(iso8601FormattedDatePattern))
            	]
    	])
	}
}
```

You also need to implement the `requestAutoRateApiIsCalled()` method in your producer implementation's base class as described above so that generated tests will produce the message under test.

## Outcome

This approach results in an environment where a microservice does not dictate the APIs it provides, but reacts to client needs by implementing them in a pull-based fashion. This inverts the classic architecture question "what data should my domain model contain?"  The answer in this pattern is "nothing until a client says it needs something".  It allows the development team to work backwards from the finish line to the starting point, creating a consumer that needs some data and then looking for the service that should provide that data in order to make a contract with it.

How does consumer driven contracts work when all services need *all* of the data in order to interact with other legacy services that assume full access to a large data model?  In this case, it's much harder for a client to say "I need X, Y, and Z" and turns into many clients asking for the same large payload.

## Keep Learning

This [webinar](https://spring.io/blog/2016/10/31/webinar-replay-consumer-driven-contracts-and-your-microservice-architecture) from a few years back also discusses the consumer-driven approach and provides a demo.

As described in the introduction, a consumer-driven approach is sometimes used when breaking down a monolithic legacy application. For more on that topic, see the guide [Breaking Down a Monolith](/guides/microservices/deconstructing-the-monolith/).

The consumer driven contract approach is almost by definition a “bottom up” method. An alternative, “top down” approach is described in the guide  [Understanding API-First Development](/guides/microservices/api-first-development/) in which you create an API contract before doing a full code implementation. The human-readable API specification is the first deliverable, allowing fast feedback from stakeholders.