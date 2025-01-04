# Backend Testing Documentation

This document shows the steps to run tests for the backend of mediaTransfer service.

## Setup

1. Clone the repository (if you haven't already)
2. Navigate to the project directory
3. Install dependencies:
   ```

   npm install
   
   ```

## Running Tests

To run the tests, use the following command in the backend directory:

```

npm run test1

```

## Test Structure

**Helper file:** `src/services/mediaTransfer/Tests/helper.js`

The helper file sets up global configurations for the tests, including chai assertions and hooks for setup and teardown.

## Troubleshooting

If you encounter any issues while running the tests, try the following:

1. Ensure all dependencies are correctly installed:
   ```

   npm install

   ```

2. If Mocha is not recognized, install it:
   ```

   npm install mocha

   ```