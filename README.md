# AiraloT1C
Automate API Requests and Verify Responses

## About This Project

This project provides an automated solution for the coding exercise described in `task.txt`. It uses Cypress to automate API requests and verify responses for the Airalo Partner API, as required by the exercise instructions. The solution covers authentication, order creation, and eSIM list validation, with all tests and assertions automated and reproducible.

### Covered Test Cases

1. **Order Creation Test**
   - Automates a POST request to create an order for 6 "merhaba-7days-1gb" eSIMs and verifies the response.
2. **Order Verification after Creation Test**
   - Automates a GET request to retrieve an order for 6 "merhaba-7days-1gb" eSIMs after the POST is made to create the order for all the 6 "merhaba-7days-1gb" eSIMs package.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/LiviuHolban/AiraloT1C.git
   cd AiraloT1C
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Project Structure

- `cypress/e2e/` - Cypress test specs
- `cypress/support/` - Custom commands and support files
- `cypress/fixtures/` - Test data and fixtures
- `cypress.config.js` - Cypress configuration

## Running Tests

To open the Cypress Test Runner UI:
```sh
npx cypress open
```

To run tests in headless mode (logs will be saved to `cypress/logs/`):
```sh
npx cypress run
```

## Running a Specific Test

To run a specific test file, use the `--spec` option with the path to your test file. For example:

```sh
npx cypress run --spec cypress/e2e/airalo/6merhaba_order.cy.js
```

You can also use the Test Runner UI to select and run individual tests interactively:

```sh
npx cypress open
```

Then, select the desired test file from the UI.

## Logging

- Test logs are saved in the `cypress/logs/` directory as `run-log.txt` and `run-log.json`.
- Console logs are always printed during test runs.

## Notes

- All dependencies are managed via `package.json` (do not use `requirements.txt` for Node.js projects).
- For troubleshooting, ensure the `cypress/logs/` directory exists before running tests.

## Customization

- Update `cypress.config.js` to change base URL or logging options.
- Add or modify test specs in `cypress/e2e/`.

## Using npm Scripts

You can also use the provided npm scripts for common tasks:

- Run all tests in headless mode:
  ```sh
  npm test
  ```
- Open the Cypress Test Runner UI:
  ```sh
  npm run test:open
  ```
- Run all tests and save the output to a file:
  ```sh
  npm run test:log
  ```
  The results will be saved in `cypress/testruns/result.txt`.

## Support

For issues, open a ticket at [GitHub Issues](https://github.com/LiviuHolban/AiraloT1C/issues).
