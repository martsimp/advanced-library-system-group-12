### Advanced Media Library (AML)
## Architecture Style
## Context and Problem Statement

Advanced Media Library (AML) is a nationwide network of libraries offering a variety of media services.
Users have trouble accessing books, journals, and other media, especially as the number of user using the library increased. 
The goal is to build a system that works seamlessly for both online and in physical branches, so users can easily search for, borrow, reserve, and return media.
AML’s current system is outdated, with a lot of manual processes for inventory tracking and media requests that slow things down. The new system needs to be accessible to everyone, including people with disabilities, and be available online 24/7 and handle many users. 

## Decision Drivers

* {decision driver 1, e.g., scalability, the system must handle thousands of users simultaneously without having a problem.}
* {decision driver 2, e.g., availablity, the system must sure access to media 24/7 for both online and in store.}
* {decision driver 3, e.g., security, as users’ personal data, payments and sensitive data are involved, the system must be secure and protected.}
* {decision driver 4, e.g., faster time to market, the development of the AML system must be completed within a shortened timeframe to meet user requirements.}
* {decision driver 5, e.g., flexibility, the design must support updates and easy integration of new features when needed.}

## Considered Options

* Service Oriented Architecture (SOA)
* Three-tier Architecture
* Microservice Architecture

## Decision Outcome

We chose Service-Oriented Architecture (SOA) for AML because it offers several benefits:

* Scalability: SOA allows services to be stateless, which makes it easier to run them across multiple servers and scale the system across different data centers (Microsoft, 2024).

* Efficient Maintenance: With SOA, working with small, independent services makes updates and debugging easier. This supports faster development and quicker time to market, as changes to one service don't affect the entire business process (Amazon Web Services, 2024)

* Integration: SOA offers flexible infrastructure that can be used as a full solution or broken into parts, helping integrate various platforms and components of the library system (Oracle & Hansen, 2008)

* Flexibility: SOA’s modular approach allows each service to function independently, meaning they can be developed, tested, and deployed without relying on others, making the system more adaptable to changes (Chen, 2024).
Adaptability: SOA reduces complexity and cost while enabling faster development and updates, making it easier to introduce new features quickly (Outsystems, 2024).

## Consequences

# Positive (geeksforgeeks, 2023)
* Service reusability: Applications built with SOA are created from existing services. As a result, many apps can be created by reusing services.
* Reliability: Because small services are easier to debug than large codes, SOA applications are more dependable.
* Simple maintenance: Because services are not dependent on one another, they may be quickly updated and changed without impacting other services.

# Negative (Linkedin, 2024)
* Performance Issues: Network delays and service dependencies can lead to slower response times and even system failures.

## Pros and Cons of the other Options

# Microservices (IBM, n.d)

* Good because of Independent Scaling: Microservices allow each service to be scaled independently without affecting others, enabling better resource management and scalability compared to SOA
* Good because of Flexibility: Microservices offer greater technological flexibility, as each service can use different programming languages and technologies, making 
development more adaptable and modern

* Bad because of Higher Complexity: Managing multiple independent services can increase system complexity, as more components mean more potential points of failure and a higher demand for robust coordination
* Bad because of Inter-Service Dependencies: Failures in one microservice can impact multiple applications relying on it, highlighting a need for effective fault isolation

# Three-tier Architecture (Tutorialspoint, 2024)

* Good because of Security: Since clients do not have direct access to the database, it’s harder for unauthorized users to access sensitive data. Centralized business logic further improves security.
* Good because of Modularity and Scalability: The modular architecture allows for the scaling of components, increasing the availability of the system. Each tier can be updated independently without affecting the others, making maintenance easier.

* Bad because of Higher Maintenance: With more tiers, there are more points of contact and dependencies, making it more difficult to maintain and manage.
* Bad because of Performance Issues: Increased complexity and the need for extra work in the middle-tier process may slow performance to the development time