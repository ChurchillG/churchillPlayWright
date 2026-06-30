# Churchill Playwright - End-to-End Testing Framework

A Playwright-based test automation framework designed for comprehensive end-to-end testing.

## Project Structure

```
churchillPlaywright/
├── src/                          # Source code for test infrastructure
│   ├── fixtures/                 # Playwright custom fixtures
│   │   └── [fixture files]       # Reusable fixtures for tests
│   ├── helpers/                  # Utility functions and helpers
│   │   └── [helper files]        # Helper functions for common operations
│   ├── pages/                    # Page Object Model (POM) classes
│   │   └── [page files]          # Page classes representing application pages
│   ├── test-data/                # Test data and constants
│   │   └── [data files]          # JSON, CSV, or JS files with test data
│   └── README.md                 # Documentation for src directory
│
├── tests/                        # Test specifications
│   ├── example.spec.ts           # Example test file
│   └── [feature].spec.ts         # Test files organized by feature
│
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Directory Guide

### `/src/fixtures`
Contains custom Playwright fixtures for test setup and teardown.
- Use for reusable test setup/teardown logic
- Example: database connections, authentication, API mocking

### `/src/helpers`
Utility functions and helper methods used across tests.
- Common operations (login, navigation, validation)
- Custom assertions
- Utility functions for test data manipulation

### `/src/pages`
Page Object Model (POM) implementation.
- Each page class represents a UI page or component
- Encapsulates selectors and page interactions
- Promotes maintainability and reusability

### `/src/test-data`
Test data files and constants.
- Centralized test data management
- User credentials, test scenarios, expected values
- Keep sensitive data in `.env` files

### `/tests`
Test specifications and scenarios.
- Write tests following Playwright's testing conventions
- Organize by feature or user journey
- Example: `login.spec.ts`, `checkout.spec.ts`, `profile.spec.ts`

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/example.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Run with specific browser
npx playwright test --project=chromium
```

### View Test Reports
```bash
npx playwright show-report
```

## Configuration

The `playwright.config.ts` file contains:
- **Test Directory**: `./tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Execution**: Enabled by default
- **Reporter**: HTML report generation
- **Trace Recording**: On first retry (for debugging)

## Project Features

- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ Parallel test execution
- ✅ HTML reporting
- ✅ Automatic retry on CI
- ✅ Trace recording for failed tests
- ✅ Page Object Model support
- ✅ Custom fixtures support

## CI/CD Integration

Tests are configured to run optimally on CI:
- Sequential execution (1 worker)
- 2 automatic retries on failure
- Prevents accidentally left `test.only()` blocks
- Generates detailed HTML reports

## Best Practices

1. **Use Page Objects**: Model your pages as classes in `/src/pages`
2. **Centralize Test Data**: Keep data in `/src/test-data`
3. **Reuse Fixtures**: Create custom fixtures in `/src/fixtures` for common setup
4. **Meaningful Assertions**: Use clear, descriptive test assertions
5. **Organize Tests**: Group related tests into feature-based spec files

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
