### Advanced Media Library (AML)
## Technology Choice for Backend
## Context and Problem Statement
The Advanced Library Management System (ALMS) requires a user-friendly interface that supports multiple features, including user registration and media borrowing for customers, as well as administrative tasks such as managing inventory and transferring media. To achieve this, the frontend should use interactive components designed to align with a Service-Oriented Architecture (SOA) approach. Frontend components must communicate reliably with multiple backend services while maintaining fast performance.
## Decision Drivers

* { Decision driver 1, e.g., Friendly user interface : The system should have clear layouts and navigation that make tasks, like borrowing media, simple and straightforward for users.}
* { Decision driver 2, e.g., Modular Design: the frontend should follows the SOA principles, with features like user registration and inventory management as a separate independent components that interact with backend services through API.}
* { Decision driver 3, e.g., Accessibility : The system should be easy to use for people with different abilities. It must support screen readers and keyboard navigation, and meet accessibility standards like WCAG (Web Content Accessibility Guidelines).}
* { Decision driver 4, e.g., Maintainability: The frontend should be easy to update, debug, and enhance over time, ensuring long-term reliability and reducing development costs.}

## Considered Options

React with Tailwind 
Next.js with Tailwind

## Decision outcome

# React with Tailwind
React is a great choice for our library management system because it makes front-end development easy with reusable components, providing consistency and flexibility. It fits well with SOA by allowing modular design, where each component can connect to specific backend services (Skryl, 2024).
Meanwhile, according to Material Tailwind articles, Tailwind CSS provides an efficient and flexible way to design websites, making the process more adaptable and easier to use.

## Pros and Cons of the options

# React (Ibrahim, 2023)
Good because Performance: React's Virtual DOM improves performance by making HTML updates faster, which is helpful for applications that need quick changes.
Good because even for beginners, React is simple and quick to learn because it works properly with Typescript and JavaScript.
Good because React makes it simpler to create and manage huge apps by enabling the integration of smaller components into larger ones.
Bad because advanced React features frequently require complicated JavaScript, which makes it more difficult for developers to learn.

# Next.js (codewalnut, 2024)
Good because Next.js automatically splits the code to adapt the application and ensure faster user load times.
Good because The use of file-based routing by Next.js makes it easier to construct server-side delivered websites and APIs.
Bad because it still has a learning curve for developers new to the framework, even though Next.js simplifies many tasks.