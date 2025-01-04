# Advanced Media Library (AML)
## Architecture Style
## Context and Problem Statement

Advanced Media Library (AML) is a nationwide network of libraries offering a variety of media services. AML’s current system is outdated, with a lot of manual processes for inventory tracking and media requests that slow things down. Users have trouble accessing media, especially as the number of users using the library increases. The goal is to build a system that works seamlessly for both online and in physical branches, so users can easily search for, borrow, reserve, and return media.

## Decision Drivers

* {decision driver 1, e.g., scalability, the system must handle thousands of users simultaneously without having a problem.}
* {decision driver 2, e.g., faster time to market, the development of the AML system must be completed within a shortened timeframe to meet user requirements.}
* {decision driver 3, e.g., Flexibility, the design must support updates and easy integration of new features when needed.}

## Considered Options

* Service Oriented Architecture (SOA)
* Three-tier Architecture
* Microservice Architecture

## Decision Outcome

We chose Service-Oriented Architecture for AML because it offers several benefits:

* Scalability: SOA allows services make it easier to run them across multiple servers and scale the system across different data centers (Microsoft, 2024).
* Integration: SOA offers a flexible infrastructure that can be used as a full solution or broken into parts, helping integrate various components of the library system (Oracle & Hansen, 2008)
* Flexibility: SOA’s modular approach allows each service to function independently. They can be developed, and tested, without relying on others, making the system more adaptable(Chen, 2024).


## Consequences

Positive (geeksforgeeks, 2023)
* Service reusability: Applications built with SOA are created from existing services. Therefore, many apps can be created by reusing services.
* Reliability: Because small services are easier to debug than large codes, SOA applications are more dependable.
* Scalability is enhanced as the ability of services to operate across multiple servers in an environment.
* Simple maintenance: Because services are not dependent on one another, they may be quickly updated and changed without impacting other services.

Negative (Linkedin, 2024)
* Performance Issues: Network delays and service dependencies can lead to slower response times and even system failures.


## Pros and Cons of the other Options

### Microservices (IBM, n.d)
* Good because of Independent Scaling: Microservices allow each service to be scaled independently without affecting others, enabling better scalability compared to SOA​.
* Good because of Flexibility: Each service can use different programming languages and technologies.
* Bad because of Higher Complexity: Managing multiple independent services can increase system complexity, as more components mean more potential points of failure.


### Three-tier Architecture (Tutorialspoint, 2024)
* Good because of Security: Since clients do not have direct access to the database, it’s harder for unauthorized users to access sensitive data.
* Bad because of Performance Issues: Increased complexity and the need for extra work in the middle-tier process may slow the development time.
