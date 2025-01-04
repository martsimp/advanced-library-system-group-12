### Advanced Media Library (AML)
## Technology Choice for Backend
## Context and Problem Statement

The advanced management library system requires the backend solution to align and support Service-Oriented Architecture (SOA) principles, to ensure scalability, security and efficient integration between services. The services must be independent and support inter-service communication, and align with the frontend user-interface and database.

## Decision Drivers

* { Decision driver 1, e.g., Scalability: the system should support the growing numbers of users, media and service requests.}
* { Decision driver 2, e.g., Flexibility: the system support modular service design for easier updates and integration.}
* { Decision driver 3, e.g.,Performance: the system should minimize the slow response times between services as much as possible.}
* { Decision driver 4, e.g., Productivity between developer: tools, libraries, and a framework are needed to enhance the development speed and code quality.}

## Considered Options

* Node.js with Express Framework
* PHP with Laravel Framework

## Decision outcome

* We chose Node.js for backend solutions because it is common using in SOA and Node.js is great for building apps that can grow and handle lots of traffic. Its way of handling tasks without blocking makes it perfect for operations that deal with a lot of data input and output, like in SOA (coda.io, 2024).
* Meanwhile, Express.js is a framework that makes building apps with Node.js easier. It provides tools for routing, handling requests, and managing middleware, helping developers create organized and scalable web applications and APIs (Dainis, 2024).

## Pros and Cons of the options

# Node.js (GeeksforGeeks, 2024)

* Good because Node.js handles many requests at once using non-blocking I/O, making it great for dynamic and real-time applications.
* Good because Node.js lets you catch and manage errors easily during runtime, keeping apps stable and easier to debug.
* Good because building apps with Node.js is faster compared to other languages, especially when creating modular systems like SOA.

* Bad because Node.js APIs can change frequently, which might break existing code if you don't keep up with updates.
* Bad because compared to older languages, Node.js has fewer libraries, and some are less feature-rich, making certain tasks more challenging.

# Express framework (DataFlair Team, n.d)

* Good because Express.js is simple to use, great for beginners and experts. It works with Node.js, so you can use many Node.js tools and libraries.
* Good because of Express.js handles many user requests at the same time with its event-driven model.
* Good because it makes routing simple. Express.js makes managing different URLs and HTTP requests easy, including handling dynamic routes.

* Bad because Express.js doesn’t enforce a specific way to organize your code, which can make projects messy and hard to manage, especially for larger teams.
* Bad because Express.js has limited built-in features. Developers often need extra tools or libraries to add advanced features.

# PHP (Vidjikant, 2024)

* Good because PHP can handle large projects well and is used in popular platforms like Facebook and WordPress. It loads quickly, making it ideal for complex web * applications.
* Good because Frameworks like MVC simplify maintenance, provide real-time insights, improve performance, and offer cross-platform flexibility with strong security.

* Bad because PHP isn’t ideal for advanced technologies like AI, machine learning, or big data, which limits its use in cutting-edge applications.
* Bad because PHP lacks robust debugging tools, making error handling more challenging and time-consuming compared to other scripting languages.

# Laravel Framework ( Guru Staff , 2021)

* Good because Laravel comes with many pre-built functionalities, reducing the amount of manual coding needed.
* Good because it offers strong security features, like encrypted password storage and built-in access controls, ensuring safer web applications.

* Bad because Laravel is classified as lightweight framework with fewer features compared to more popular frameworks.
* Bad because compared to other frameworks, Laravel can be slower, which might impact the speed of web development projects.
