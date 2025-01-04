# Choice of Testing Framework

## Context and Problem Statement

The system requires a testing framework that will be used to write unit tests which automatically validate the implementation and functionality of the system.

## Decision Drivers

* Tests must integrate with React frontend and Node.js + Express backend.
* Testing framework must support JavaScript code, since that is what our system is implemented using.

## Considered Options

* **Mocha**
* **Jest**

## Decision Outcome

The chosen option is Mocha, because:

- it is an established and mature framework supporting our system.
- we have prior experience with it.

### Consequences

* Good, because this will allow thoroughly testing our system.
* Good, because the team is familiar with this framework

## Pros and Cons of the Options

### Mocha

* Good, because it is well-documented with official and third-party resources.
* Good, because the team has prior experience with it.
* Bad, since much functionality is in external libraries which can increase complexity.

### Jest

* Good, because it is supported by a large company (Facebook).
* Good, because it can run tests in parallel, increasing test performance
* Neutral, the team is unfamiliar with it, but its documentation means it should be easy to learn.
* Bad, since it has a large amount of external dependencies.

### Jasmine

* Good, because it is easy to get started
* Good, because it is also maure
* Bad, it is not as featureful as the other considered libraries
