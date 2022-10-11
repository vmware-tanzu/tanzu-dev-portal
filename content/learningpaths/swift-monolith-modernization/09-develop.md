---
title: Designing a Software Application Architecture Following Event Storming
weight: 2
layout: single
team:
- Jelle Aret
tags: []
---

## Introduction
This post explains how to translate the outcomes of an Event Storming workshop into a flexible software architecture. Our example scenario pertains to a chain of restaurants where different meals can be ordered and will be delivered by an external fulfillment service. (More on this shortly.)

Let's set the stage with the results of a theoretical event storming followed by a Boris, and SNAP exercises:
- business processes are defined
- domain events are mapped
- first slice of functionality is defined (using the Swift Method)
- a notional architecture exists (using BORIS)
- SNAP stickies are written, defining APIs, the accompanying data flow, and the necessary external systems

How do you proceed from this point to develop the first functionality? What about application architecture? Is it necessary to model that first or can you begin coding features? And what level of maintainability and interoperability with the external systems is necessary and sufficient?

This article will address these questions, describe some technical application architecture(s) and provide a sample code base that could be used to fast-start application development and allow future change without introducing technical debt. Then we’ll show how to iterate on those initial decisions in response to what we learn about the business and the technology along the way.

## Event Storming Artifacts
Together with the domain experts from our restaurant chain, we’ve agreed on this workflow, which we will use as input for our Software Design.

![Event Storm](/learningpaths/swift-monolith-modernization/images/event-storm-01-part01.jpg#center)
![Event Storm](/learningpaths/swift-monolith-modernization/images/event-storm-01-part02.jpg#center)

### Actors
From the diagram, these actors and their actions are defined:
- Customer that wants to order a Meal from a specific Restaurant
- Chef that needs to know what to prepare and when
- Restaurant Owner that manages the  business
- Driver that is picks up and delivers the meals

### Notional Architecture (a.k.a. Boris Diagram)
This diagram is the result of collaboration with the technical stakeholder to determine what Services (blue) and interactions between those Services should exist.

![Notional Architecture](/learningpaths/swift-monolith-modernization/images/notional-architecture-01.jpg#center)

And the SNAP diagrams, which documents the API definitions, corresponding data, and external systems needed to support the flow:

![SNAP Diagram](/learningpaths/swift-monolith-modernization/images/snap-01.jpg#center)

## Implementation
In this article, we’re going to focus on the Restaurant and Driver business capabilities and not implement the User Interface, but implement the API so the User Interfaces could be developed separately.

### Options

While there are many ways to implement the business capabilities, from my experience, these  options appear the most promising:

1. The first option is a three-layered architecture where Business Layer Services are able to execute CRUD (Create Read Update Delete) operations on multiple entities at the Data Access Layer. The Presentation Layer provides the API which translates the API model into one or multiple Business Layer Services method calls. Note that the Business Layer Services usually consists of more fine grained methods than the API.


2. A second option is also a three-layered architecture in which Business Layer Services apply the Repository Pattern to load and persist entities as a whole aggregate (combination of multiple (database) entities) to make sure the aggregate is always in a valid state. The Business Layer Services are then modeled after the API and the  Presentation Layer is only translating the API model towards the Business model. This strategy limits the logic in the Presentation Layer which is a good thing as business decisions are done within the Business Layer and the Presentation Layer can easily be extended with other (technology) channels.


3. A third option is to combine Hexagonal Architecture with a core containing Domain Driven Design (DDD) Aggregates and Services. Hexagonal Architecture is also known as Ports and Adapters as the core is available by defined interfaces (Ports) and the core can communicate with dependent services by interfaces. These Ports are implemented by Adapters which are technology dependent, e.g. database interaction or user interaction by HTTP JSON/API. More information about Driving (Primary) and/or Driven (Secondary) adapters can be found here.
Every Aggregate Root will handle Commands and submit Domain events and make sure the Aggregate is always in a consistent and valid state. The persistence of the Aggregate will be taken care of by Repositories, implemented as an Adapter. Another Adapter provides the API as HTTP/JSON endpoint.

![Implementation options](/learningpaths/swift-monolith-modernization/images/implementation-options.jpg#center)

The first two options have the benefit of implementing a common application architecture in which a lot of functionality is bundled in a single runtime.

With the first option the Business Layer is able to read all the database entities or create even an intermediate view upon multiple entity states to handle business logic. A downside of this is the potential tight-coupling between entities that is not necessarily needed. Another potential problem is that in order to test the Business Layer correctly one should have a lot of test data combinations, scattered over multiple entities, available to support the business logic. In the future, this same highly coupled architecture can quickly make the codebase unmaintainable, especially after a few iterations or if the shared knowledge base is compromised because a development team member rotates out. In order to test one needs both the Business Layer and Data Layer in place.

The second option already provides some safeguards regarding tight-coupling: using the Repository Pattern the Business Layer could only load and persist whole Aggregates: entities that are always in valid state according to business rules. This option makes it also easier to test: the Aggregate can be tested in isolation, apart from the loading and persisting: separating the concerns.

A possible downside of the third option is that time is required upfront to model what belongs to the Core. During the Event Storming and Boris exercise the Aggregates are already roughly sketched. As the Aggregates are part of the Core and do not share any technology dependency (except the programming language constructs) one could test the business logic in isolation. Any dependency -like persistence of Aggregates or messaging infrastructure- are modeled as Ports and can be tested in isolation with the technology of the implementation (e.g. ORM Framework).

As each Aggregate has its own Repository, and communication between Aggregates is via Ports (or via Domain Events) it is fairly easy to separate out multiple microservices in the future.

Eventually, this Hexagonal Architecture could be extended with other application architectures such as Event Sourcing for Aggregate state and Command Query Responsibility Segregation (CQRS) to separate read from write models.

For this article we'll continue with the third option as it provides an improved modularity.


## First iteration
In the first iteration, let’s work on two stories:

1. As a customer
   I want to know what meals are available
   so that I can make an informed decision on what to order.
   Acceptance criteria:
   When I retrieve the menu I get all meals that are available


2. As a restaurant owner
   I want to add new meals to the menu (register the meal)
   so that a customer can order these meals.
   Acceptance criteria:
- When I enter the same meal again it gets rejected.


Event Storming leads naturally to Domain-Driven Design (DDD); Boris to an Event-Driven architecture, and SNAP to CQRS. But we still have to choose a layering architecture and which patterns to apply. Should we use an ORM? What persistence technology do we need?

Hexagonal Architecture is a good layering choice as it separates the core domain neatly from the technology. In this scenario we have at least one Domain Object which can serve as an Aggregate Root: `Restaurant`.

The requirement to register a meal implies the need for long-term persistence, and, as we do not want to write plain SQL queries and do not have extreme requirements in terms of performance (yet!), an ORM framework that abstracts away the persistence technology is preferable.

### Infrastructure & Technology Stack
There are many technology stacks and platforms available. For this article we’re going to use Spring Boot , PostgreSQL for the persistence of Entity states  and Tanzu Application Platform for both the CI/CD pipelines as well the deployment platform (built upon Kubernetes and Knative). Java provides us with a good Object Oriented paradigm usable for Hexagonal Architecture and Spring Boot provides us a HTTP web server for our API exposure. PostgreSQL is a well-known open-source database supporting ACID transactions for which paid support is available.

### RetrieveMenu
#### Core
The core domain for retrieving the menu is fairly simple: every Restaurant has a menu listing meals it can prepare. The core service needs to be able to provide a list of menus for the API. Starting with the domain we will start testing that if a Restaurant has a menu it can provide these.

{{% callout %}}
The tests written in this article are developed using the Spock Framework: a test framework that provides a good `given`, `when`, `then` syntax, which aligns with our story structure. In a real product development scenario, tests are developed incrementally using TDD; however, that is out of scope for this article, so I have provided completed tests for the stories at hand.
{{% /callout %}}

````groovy
class RestaurantSpec extends Specification {

   def "Given a Restaurant with two registered Meals, when the customer requests the Menu they get all Meals registered"() {
       given:
           def subject = new Restaurant("Washington DC", ["italian-spaghetti", "couscous"])
       when:
           List<String> result = subject.getMenu();
       then:
           result == ["italian-spaghetti", "couscous"]
   }
   
   def "Given a Restaurant without any registered Meals, when the customer requests the Menu they get an empty Menu"() {
       given:
           def subject = new Restaurant("Washington DC", [])
       when:
           List<String> result = subject.getMenu();
       then:
           result == []
   }
   
   def "Given a Restaurant without any registered Meals, when the customer requests the Menu they get at least the name of any Restaurant"() {
       given:
           def subject = new Restaurant("Washington DC", [])
       when:
           String result = subject.getName();
       then:
           result == "Washington DC"
   }
}
````

This results in the following Aggregate:

````java
public class Restaurant {
   private final String name;
   private final List<String> meals = new ArrayList<>();

   public Restaurant(String name, List<String> meals) {
      this.name = name;
      this.meals.addAll(meals);
   }

   public String getName() {
      return this.name;
   }

   public List<String> getMenu() {
      return this.meals;
   }
}
````

#### API
Although the core Domain is `Restaurant` the API prescribes that a Customer be able to see the menus of all Restaurants. To test that `RetrieveMenu` works, we verify that the public facing API is using a new core port `RestaurantApplicationPort` to retrieve the menu, and that the menu is translated to JSON.

Here we make use of Spring Web to expose a JSON based API. It provides annotations for classes and methods to designate certain methods as handlers for API routes. It also serializes and deserializes HTTP Request and Response bodies to and from Java classes, so there is no need to develop your own parser or serializer.

````groovy
@WebMvcTest(value = RestaurantAPI.class)
class RestaurantAPISpec extends Specification {

   @Autowired
   private MockMvc mvc;

   @Autowired
   private RestaurantApplicationPort restaurantApplicationPort;

   def "Given two restaurants with a menu each, when asking to retrieve the menu, we expect the whole menu is returned"() {
      given:
         def menus = [
            new RestaurantMenu("Restaurant New York", ["italian-spaghetti", "pizza"]),
            new RestaurantMenu("Restaurant Washington-DC", ["italian-macaroni"]),
         ]

       when:
           def result = mvc.perform(get('/api/restaurant/v1/retrieve-menu'))
       then:
           1 * restaurantApplicationPort.retrieveMenu() >> menus
           result.andExpect(status().isOk())
           result.andExpect(jsonPath("\$.menus.[0].restaurant").value("Restaurant New York"))
           result.andExpect(jsonPath("\$.menus.[0].meals").value(["italian-spaghetti", "pizza"]))
           result.andExpect(jsonPath("\$.menus.[1].restaurant").value("Restaurant Washington-DC"))
           result.andExpect(jsonPath("\$.menus.[1].meals").value(["italian-macaroni"]))
   }
}
````

This results in the following Spring `@RestController` component, which is basically an `Adapter` using the core `Port`. As this `Adapter` supports interaction with the end user, we can call this a Primary Adapter or Driving Adapter.

````java
@RestController
@RequestMapping("/api/restaurant/v1")
@AllArgsConstructor
public class RestaurantAPI {
   
   private final RestaurantApplicationPort restaurantApplicationPort;
   
   @GetMapping("/retrieve-menu")
   public RetrieveMenuResponse retrieveMenu() {
      final List<RestaurantMenu> menus = this.restaurantApplicationPort.retrieveMenu();
      return new RetrieveMenuResponse(menus);
   }

   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public static class RetrieveMenuResponse {
      private List<RestaurantMenu> menus;
   }
}
````

And the corresponding `RestaurantApplication` implementation (using dummy data):

````java
@Service
@AllArgsConstructor
public class RestaurantApplicationService implements RestaurantApplicationPort {

   @Override
   public List<RestaurantMenu> retrieveMenu() {
      return Collections.singletonList(new RestaurantMenu("Restaurant New York", Arrays.asList("pizza")));
   }
}
````

#### Persistence
The Restaurant name and its menu is to be retrieved from a persistent data store. As said, we will use PostgreSQL as a datastore. Java provides JDBC as the primary database connection driver. Java EE provides JPA (Java Persistence API) as ORM, which has been implemented by multiple vendors. By leveraging the Spring Framework we opt in to use Spring Data JPA, an abstraction to read and persist JPA entities without the boilerplate code. We need only define the JPA Entity and a Spring Data Repository.

To make our Aggregate consistent when persisting it, we keep the simple rule: One Aggregate = One Repository. This makes it easy to persist the whole Aggregate in the database in a single database transaction.

Let’s first get `RestaurantApplicationService` to read Restaurant Aggregates from `RestaurantRepositoryPort`:

````groovy
class RestaurantApplicationServiceSpec extends Specification {

   def restaurantRepositoryPort = Mock(RestaurantRepositoryPort)

   private RestaurantApplicationService subject = new RestaurantApplicationService(restaurantRepositoryPort)

   def "When retrieving the menu we expect the menu is composed from all Restaurants available in the repository"() {
      given:
         def restaurantOne = new Restaurant("New York", ["pizza"])
         def restaurantTwo = new Restaurant("Washington DC", ["spaghetti"])
      when:
         def result = subject.retrieveMenu()
      then:
         result == [
            new RestaurantMenu("New York", ["pizza"]),
            new RestaurantMenu("Washington DC", ["spaghetti"])
         ]
         1 * restaurantRepositoryPort.getAll() >> [restaurantOne, restaurantTwo]
   }
}
````

We have defined in the test the repository and its port method:

````java
public interface RestaurantRepositoryPort {

   List<Restaurant> getAll();
}
````

{{% callout %}}
Instead of passing an JPA entity through the Port, we deliberately instruct the Port to return Domain Object `Restaurant`. Whenever a business transaction is run in the future against the `Restaurant` instance, it will for sure be in a valid state. In contrast, a valid state cannot be guaranteed if getter and setter of individual attributes are allowed against JPA entities.
{{% /callout %}}

To have the above test pass, we implement RestaurantApplicationService:

````java
@Service
@AllArgsConstructor
public class RestaurantApplicationService implements RestaurantApplicationPort {

   private final RestaurantRepositoryPort restaurantRepositoryPort;

   @Override
   public List<Menu> retrieveMenu() {
      final List<Restaurant> restaurants = this.restaurantRepositoryPort.getAll();
      return restaurants.stream()
         .map((restaurant -> new Menu(restaurant.getName(), restaurant.getMenu())))
         .collect(Collectors.toList());
   }
}
````

Let's implement the `RestaurantRepositoryPort` by using Spring Data JPA. See Spring Data JPA Repositories for more information about how Spring Data JPA works by defining marker interfaces, ID and Entity types.

````groovy
class JpaRestaurantRepositoryAdapterSpec extends Specification {
   def repositoryMock = Mock(RestaurantRepository)
   def subject = new JpaRestaurantRepositoryAdapter(repositoryMock)

   def "Given a repository having one Restaurant, when we retrieve all we expect that the RestaurantEntity is loaded and transformed to the Aggregate"() {
      given:
         def restaurant = new RestaurantEntity()
         def id = new RestaurantId()
         id.name = "New York"
         restaurant.id = id
         
         def meal = new MealEntity()
         def mealId = new MealId()
         mealId.restaurantId = id
         mealId.name = "pizza"
         meal.id = mealId

         restaurant.meals = Collections.singleton(meal)
      when:
         def result = subject.getAll()
      then:
         result == [
                new Restaurant("New York", ["pizza"])
         ]
         1 * repositoryMock.findAll() >> [restaurant]
   }
}
````

The code above will test if loaded JPA Entities are transformed properly to Aggregate by asserting the state of the Restaurant and by asserting the behavior towards the Spring Data JPA Repository RestaurantRepository.


This leads us to the following classes:

````java
@Entity
@Table(name="restaurants")
public class RestaurantEntity {

   @Getter
   @Setter
   @EmbeddedId
   private RestaurantId id;
   
   @Getter
   @Setter
   @Version
   @Column
   private Long version;
   
   @Getter
   @Setter
   @OneToMany(mappedBy="restaurant", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
   private Set<MealEntity> meals;
}
````

````java
@Embeddable
public class RestaurantId implements Serializable {

   @Column(name = "name")
   @Getter
   @Setter
   public String name;
}
````

````java
@Entity
@Table(name="meals")
public class MealEntity {

   @Getter
   @Setter
   @EmbeddedId
   private MealId id;
   
   @MapsId("restaurantId")
   @ManyToOne
   @JoinColumn(name="restaurant_name", referencedColumnName = "name")
   private RestaurantEntity restaurant;
}
````

````java
@Embeddable
public class MealId implements Serializable {

   @Getter
   @Setter
   private RestaurantId restaurantId;
   
   @Getter
   @Setter
   @Column(name = "name")
   public String name;
}
````

````java
@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantEntity, String> {
}
````

To let JPA work, we create the database tables. It's not necessary to create them manually. By using a Spring Boot integration Flyway, they are created dynamically in a version-aware way.

Just put the DDL `.sql` files in the `src/main/resources/db/migration` folder:

`V1.0__create_restaurant_aggregate_tables`:
````sql
CREATE TABLE restaurants (
   "version" int8 NOT NULL DEFAULT 0,
   name text NOT NULL,
   CONSTRAINT "pk-restaurants" PRIMARY KEY (name)
);

CREATE TABLE meals (
   restaurant_name text NOT NULL references restaurants (name),
   name text NOT NULL,
   CONSTRAINT "pk-meals" PRIMARY KEY (restaurant_name, name)
);
````

{{% callout %}}
I've chosen not to generate a primary key for the Restaurant aggregate. The name is functionally unique and therefore can also be the technical storage key. The downside of this method is that the JPA Join declaration is getting bigger as we have to have separate classes for the @Id definition.
{{% /callout %}}

{{% callout %}}
The `version` attribute is (already) part of the JPA Entity. This provides out of the box optimistic locking. Persisting changes to the aggregate should be done sequentially, to be sure that it stays in a consistent state and not to overwrite concurrent changes.
{{% /callout %}}

Finally the adapter itself:

````java
@Component
@AllArgsConstructor
public class JpaRestaurantRepositoryAdapter implements RestaurantRepositoryPort {

   private final RestaurantRepository repository;

   @Override
   public List<Restaurant> getAll() {
      return repository.findAll().stream().map(this::convert).collect(Collectors.toList());
   }

   private Restaurant convert(RestaurantEntity entity) {
      return new Restaurant(
         entity.getId().getName(),
         entity.getMeals().stream()
            .map((meal) -> meal.getId().getName()).collect(Collectors.toList())
      );
   }
}
````

#### Application
Up to this point, during testing the code is working in isolation. But to start up the Spring Container and the (integrated) web server, we need to add the main method along with an (external) configuration. Fortunately, Spring Boot provides an Inversion of Control (IoC) mechanism so the components work together, injecting each dependency as required.

````java
@SpringBootApplication
public class RestaurantServiceApplication {

   public static void main(String[] args) {
      SpringApplication.run(RestaurantServiceApplication.class, args);
   }
}
````

The following configuration is to configure Spring: know which database to use, Jackson for JSON serialization and enabling Flyway:

````yaml
spring:
   datasource:
      driver-class-name: org.postgresql.Driver
      url: jdbc:postgresql://<hostname>/<databasename>
      username: <username>
      password: <password>

   flyway:
      enabled: true

   jackson:
      serialization:
         write-enums-using-to-string: true
         write-dates-as-timestamps: false

   jpa:
      open-in-view: false

logging:
   level:
      root: INFO
````

With the code changes above we now have a working application. You can start it with `mvn spring-boot:run`.

### RegisterMeal
#### Core
Let's implement the story to register meals, so that a menu is built up for a Restaurant.
We start by developing the behavior of the core Domain Object: Restaurant. As `Restaurant` is our Aggregate Root, the Menu will be another Entity within the same Aggregate. The Root will make sure the Aggregate is in consistent state: checking that a meal cannot be registered twice.

We add two more tests for registering meals: one happy path, one exceptional path.

````groovy
class RestaurantSpec extends Specification {

   def "Given a Restaurant without any Meals, when the owner registers a Meal it becomes part of the Menu"() {
      given:
         def subject = new Restaurant("New York")
      when:
         subject.registerMeal("italian-spaghetti")
      then:
         subject.getMenu() == ["italian-spaghetti"]
   }

   def "Given a Restaurant with two registered Meals, when the owner registers the same Meal again it gets rejected"() {
      given:
         def subject = new Restaurant("Washington DC", ["italian-spaghetti", "couscous"])
      when:
         subject.registerMeal("italian-spaghetti")
      then:
         thrown(MealAlreadyRegisteredException)
   }
}
````

With the above tests we need to extend the `Restaurant` core domain model with extra behavior, this will turn our Restaurant into the Root of the Aggregate:

````java
@EqualsAndHashCode
public class Restaurant {
   private final String name;
   private final List<String> meals = new ArrayList<>();

   public Restaurant(String name) {
      this.name = name;
   }

   public Restaurant(String name, List<String> meals) {
      this.name = name;
      this.meals.addAll(meals);
   }

   public void registerMeal(String meal) {
      if (this.meals.contains(meal)) {
         throw new MealAlreadyRegisteredException();
      }
      this.meals.add(meal);
   }

   public String getName() {
      return this.name;
   }

   public List<String> getMenu() {
      return this.meals;
   }
}
````

#### API
Let's define a test for registering a meal that will drive our internal API:

````groovy
@WebMvcTest(value = RestaurantAPI.class)
class RestaurantAPISpec extends Specification {

   @Autowired
   private MockMvc mvc;

   @Autowired
   private RestaurantApplicationPort restaurantApplicationPort

   def "Given a request for registering a meal, we expect that it is stored and new identifier has been returned"() {
      given:
         def body = """{
            "restaurant": "Washington-DC",
            "meal": "italian spaghetti"
         }"""
      when:
         def results = mvc.perform(post('/api/restaurant/v1/register-meal')
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
      then:
         1 * restaurantApplicationPort.registerMeal("Washington-DC", "italian spaghetti")
         results.andExpect(status().isOk())
   }

   @TestConfiguration
   static class Config {

       def detachedMockFactory = new DetachedMockFactory()

       @Bean
       RestaurantApplicationPort restaurantApplicationPort() {
           return detachedMockFactory.Mock(RestaurantApplicationPort)
       }
   }
}
````

{{% callout %}}
`registerMeal` method represents a Command: a task to execute with the intention to change state. Hence it will not return a value but it does have the side-effect of changing the menu of the restaurant (or maybe an exception when some business rule is violated). Currently it is a synchronous call, which can be easily changed to an asynchronous execution in the future if needed.
{{% /callout %}}

The above will change our `RestaurantAPI`:

````java
@RestController
@RequestMapping("/api/restaurant/v1")
@AllArgsConstructor
public class RestaurantAPI {
   private final RestaurantApplicationPort restaurantApplicationPort;

   @PostMapping("/register-meal")
   public void registerMeal(@RequestBody RegisterMealRequest body) {
      this.restaurantApplicationPort.registerMeal(body.getRestaurant(), body.getMeal());
   }

   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public static class RegisterMealRequest {
      private String restaurant;
      private String meal;
   }
}
````

HTTP Status 200 will be returned when successfully registered. Any exception thrown by `registerMeal` will result in an HTTP error code.

#### Core
When `registerMeal` command is being handled it must read the Restaurant Aggregate from the repository, register the meal and persist it.

````groovy
class RestaurantApplicationServiceSpec extends Specification {

   def restaurantRepositoryPort = Mock(RestaurantRepositoryPort)
   private RestaurantApplicationService subject =
      new RestaurantApplicationService(restaurantRepositoryPort)

   def "When registering a meal we expect the Restaurant aggregate is loaded, meal is added and new Restaurant is persisted."() {
      given:
         def restaurant = "Washington DC"
         def name = "italian-spaghetti"
      when:
         subject.registerMeal(restaurant, name)
      then:
         1 * restaurantRepositoryPort.getById("Washington DC") >> new Restaurant("Washington DC")
         1 * restaurantRepositoryPort.persist(new Restaurant("Washington DC", ["italian-spaghetti"]))
   }
}
````

And the corresponding production code:

````java
@Service
@AllArgsConstructor
public class RestaurantApplicationService implements RestaurantApplicationPort {

   private final RestaurantRepositoryPort restaurantRepositoryPort;

   public void registerMeal(String restaurant, String name) {
      Restaurant restaurantAgg = this.restaurantRepositoryPort.getById(restaurant);
      restaurantAgg.registerMeal(name);
      this.restaurantRepositoryPort.persist(restaurantAgg);
   }
}
````

#### Persistence
Let's implement the `JpaRestaurantRepositoryAdapter` to be able to store the meal as part of the Restaurant.

````groovy
class JpaRestaurantRepositoryAdapterSpec extends Specification {
   def repositoryMock = Mock(RestaurantRepository)
   def subject = new JpaRestaurantRepositoryAdapter(repositoryMock)

   def "Given an Restaurant, when we persist it, we expect that it is translated to the RestaurantEntity and persisted"() {
      given:
         def restaurant = new Restaurant("New York,", ["pizza salami"])
      when:
         subject.persist(restaurant)
      then:
         1 * repositoryMock.save(createRestaurantEntity("New York", ["pizza salami"]))
   }

   RestaurantEntity createRestaurantEntity(String name, List<String> meals) {
      def restaurant = new RestaurantEntity()
      def id = new RestaurantId()
      id.name = name
      restaurant.id = id

      restaurant.meals = meals.stream().map(meal -> {
         def mealEntity = new MealEntity()
         def mealId = new MealId()
         mealId.restaurantId = id
         mealId.name = "pizza"
         mealEntity.id = mealId
         return mealEntity
      }).collect(Collectors.toList())

      return restaurant
   }
}
````

This is the completion of the first iteration. Source code of all the above can be found at GitHub: https://github.com/vmware-jaret/app-architecture-sample-restaurant/  

## Deployment

Having a Tanzu Application Platform (TAP) available it is really easy to deploy this iteration and see if it deploys successfully. Add the following file to the config directory and execute the tanzu command.

The Tanzu Application Platform (TAP) will perform the following:
1. detect technology stack,
2. build the application
3. execute the tests
4. create a Docker image
5. push it to the environment Docker Registry (Harbor),
6. deploy the application as a Knative Deployment providing you an URL.

````yaml
apiVersion: carto.run/v1alpha1
kind: Workload
metadata:
name: app-architecture-sample-restaurant-service
labels:
   apps.tanzu.vmware.com/workload-type: web
   app.kubernetes.io/part-of: app-architecture-sample
spec:
   params:
      - name: annotations
        value:
          autoscaling.knative.dev/minScale: "1"
   source:
      git:
         url: https://github.com/vmware-jaret/app-architecture-sample-restaurant.git
      ref:
         branch: main
````

#### Future Iterations
Next up is the iteration in which the Restaurant Service will consume and process the message from other parts of the system: messaging infrastructure will be introduced. Stay tuned.