# Choice of Database

## Context and Problem Statement

The system requires that data including user information, available media, bookings, etc. be available persistently.
We must choose which database system will be used to store this data.

## Decision Drivers

* Scalability is a key concern for the database - the specification states it must be able to handle millions of users with an annual userbase growth of 10%.
* Availability is also important, with the online portion of the system required to be available 24/7, and in-branch and phone services available during standard working hours.
* For both of the above conditions, the database should be distributable -- meaning it does not need necessarily hosted on the same machine as the application servers.

## Considered Options

* **MySQL**
* **PostgreSQL**
* **SQLite**

## Decision Outcome

The chosen option is PostgreSQL, because:

- it can scale extremely well, which is important to the application. This is helped by it being distributed, so it is not limited to running on the same machine as the application itself.
- it supports redundancy, meaning that if one machine serving the database goes offline, the data is still accessible from elsewhere. This meets our availability target.
- the development team already has familiarity with it.

### Consequences

* Good, because Postgres has a large featureset than can be leveraged by our database design.
* Good, because Postgres' features will allow us to meet our availability and scalability targets.
* Bad, because designing and hosting the database will require additional effort. 

## Pros and Cons of the Options

### MySQL

* Good, because it is well-documented with official and third-party resources.
* Good, because the team has prior experience with it.
* Good, because it has been proven for scalability and reliability

### PostgreSQL

* Good, because it is well-documented and well-designed.
* Good, because it is known for its stability
* Good, because the team has prior experience with it.
* Bad, as it tends to be the hardest to use of the three options

### SQLite

* Good, because it is extremely simple
* Good, because it is extremely prevalent: implementations are available for basically every programming language and environment
* Bad, because it cannot be distributed: databases can only live on the server hosting them
* Bad, because it is not concurrent: databases can only be accessed by one program at a time.
