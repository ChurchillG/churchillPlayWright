import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { InvoicePage } from '../pages/InvoicePage';

/**
 * Custom Fixtures Type Definition
 * 
 * This defines what custom fixtures are available in tests.
 * Each fixture creates a new instance of a page object.
 * 
 * Think of fixtures as "pre-built tools" that Playwright 
 * automatically provides to your tests.
 */
type CustomFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    adminPage: AdminPage;
    invoicePage: InvoicePage;
};

/**
 * Extended Test Function
 * 
 * This creates our custom test() function with our fixtures.
 * 
 * HOW IT WORKS:
 * 1. We take Playwright's base 'test' and extend it
 * 2. For each fixture, we tell Playwright how to create it
 * 3. The 'use' function provides the fixture to the test
 * 4. Playwright handles cleanup automatically
 * 
 * HOW TO USE IN TESTS:
 * import { test } from '../fixtures/test-fixtures';
 * 
 * test('my test', async ({ loginPage, homePage }) => {
 *   // loginPage is automatically created!
 *   await loginPage.goto();
 * });
 */
export const test = base.extend<CustomFixtures>({
    
    // LoginPage fixture
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    // HomePage fixture
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    // AdminPage fixture
    adminPage: async ({ page }, use) => {
        await use(new AdminPage(page));
    },

    // InvoicePage fixture
    invoicePage: async ({ page }, use) => {
        await use(new InvoicePage(page));
    }
});

// Re-export expect so we can import everything from one place
export { expect } from '@playwright/test';