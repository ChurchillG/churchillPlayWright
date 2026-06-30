// src/helpers/base-page.ts

import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Foundation class for all page objects
 * 
 * This class contains common reusable methods that ALL pages can use.
 * Every page object (LoginPage, HomePage, InvoicePage, etc.) will EXTEND this class.
 * 
 * Key concepts:
 * - 'public page: Page' in constructor is TypeScript shorthand
 *   It automatically creates this.page = page for you
 * - All methods start with 'basePage' prefix to indicate they're from BasePage
 * - These methods can be used by any page that extends BasePage
 * 
 * @example
 * class LoginPage extends BasePage {
 *   async login() {
 *     await this.basePageEnterText(usernameField, 'admin');
 *     await this.basePageClickElement(loginButton);
 *   }
 * }
 */
export class BasePage {
    
    /**
     * Constructor
     * @param page - Playwright Page object
     * 'public page: Page' automatically assigns the parameter to this.page
     */
    constructor(public page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url - The URL to navigate to (full URL or relative path)
     * 
     * Usage: await this.basePageGoToUrl('/login');
     */
    async basePageGoToUrl(url: string) {
        await this.page.goto(url);
    }

    /**
     * Click an element on the page
     * @param locator - The Playwright locator for the element
     * 
     * Usage: await this.basePageClickElement(submitButton);
     */
    async basePageClickElement(locator: Locator) {
        await locator.click();
    }

    /**
     * Enter text into an input field
     * First clears the field, then fills it with the provided text
     * @param locator - The Playwright locator for the input field
     * @param text - The text to enter
     * 
     * Usage: await this.basePageEnterText(usernameInput, 'admin');
     */
    async basePageEnterText(locator: Locator, text: string) {
        await locator.clear();    // Clear any existing text first
        await locator.fill(text);  // Fill with new text
    }

    /**
     * Get the text value from an input field
     * @param locator - The Playwright locator for the input field
     * @returns Promise<string> - The current value of the input field
     * 
     * Usage: const username = await this.basePageGetTextValue(usernameInput);
     */
    async basePageGetTextValue(locator: Locator): Promise<string> {
        return await locator.inputValue();
    }

    /**
     * Verify that an element is visible on the page
     * This is an assertion - if element is not visible, the test will fail
     * @param locator - The Playwright locator for the element
     * 
     * Usage: await this.basePageVerifyElementIsVisible(welcomeMessage);
     */
    async basePageVerifyElementIsVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    /**
     * Verify that an element contains specific text
     * @param locator - The Playwright locator for the element
     * @param text - The text to check for
     * 
     * Usage: await this.basePageVerifyElementHasText(errorMsg, 'Invalid password');
     */
    async basePageVerifyElementHasText(locator: Locator, text: string) {
        await expect(locator).toHaveText(text);
    }

    /**
     * Verify that an element contains partial text
     * @param locator - The Playwright locator for the element
     * @param text - The text that should be present
     * 
     * Usage: await this.basePageVerifyElementContainsText(successMsg, 'created');
     */
    async basePageVerifyElementContainsText(locator: Locator, text: string) {
        await expect(locator).toContainText(text);
    }

    /**
     * Select an option from a dropdown/select element
     * @param locator - The Playwright locator for the select element
     * @param value - The value or label to select
     * 
     * Usage: await this.basePageSelectOption(statusDropdown, 'Paid');
     */
    async basePageSelectOption(locator: Locator, value: string) {
        await locator.selectOption(value);
    }

    /**
     * Get the visible text content from an element
     * @param locator - The Playwright locator for the element
     * @returns Promise<string> - The text content of the element
     * 
     * Usage: const heading = await this.basePageGetElementText(pageHeading);
     */
    async basePageGetElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    /**
     * Wait for an element to be visible on the page
     * @param locator - The Playwright locator for the element
     * @param timeout - How long to wait in milliseconds (default: 30000)
     * 
     * Usage: await this.basePageWaitForElement(loadingSpinner, 10000);
     */
    async basePageWaitForElement(locator: Locator, timeout: number = 30000) {
        await locator.waitFor({ state: 'visible', timeout: timeout });
    }

    /**
     * Check if an element is visible on the page
     * @param locator - The Playwright locator for the element
     * @returns Promise<boolean> - true if visible, false if not
     * 
     * Usage: if (await this.basePageIsElementVisible(errorMsg)) { ... }
     */
    async basePageIsElementVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    /**
     * Wait for the page to finish loading
     * Waits for network activity to be idle
     * 
     * Usage: await this.basePageWaitForLoad();
     */
    async basePageWaitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}