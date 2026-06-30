// src/pages/LoginPage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';

/**
 * LoginPage - Represents the login page of the application
 * 
 * EXTENDS BasePage:
 * This means LoginPage inherits all methods from BasePage
 * Examples of inherited methods:
 * - this.basePageGoToUrl()
 * - this.basePageClickElement()
 * - this.basePageEnterText()
 * - this.basePageVerifyElementIsVisible()
 * 
 * Think of it like:
 * BasePage = Basic tools (hammer, screwdriver)
 * LoginPage = Basic tools + Login-specific tools (key, lock pick)
 */
export class LoginPage extends BasePage {
    
    /**
     * Locators - These define HOW to find elements on the login page
     * 
     * We use 'get' methods instead of regular properties because:
     * - Locators are re-evaluated each time they're accessed
     * - This ensures we always get the latest state of the element
     * - Important for dynamic pages where elements might change
     */
    
    // Username input field
    private get usernameField(): Locator {
        return this.page.locator('input[name="username"], input#username, [data-testid="username"]');
    }

    // Password input field
    private get passwordField(): Locator {
        return this.page.locator('input[name="password"], input#password, [data-testid="password"]');
    }

    // Login button
    private get loginButton(): Locator {
        return this.page.locator('button[type="submit"], button:has-text("Login"), [data-testid="login-button"]');
    }

    // Error message (shows when login fails)
    private get errorMessage(): Locator {
        return this.page.locator('.error-message, .alert-danger, [data-testid="error"]');
    }

    // Dashboard indicator (shows when login succeeds)
    private get dashboardIndicator(): Locator {
        return this.page.locator('.dashboard, [data-testid="dashboard"], .admin-panel');
    }

    constructor(page: Page) {
        super(page); // Call BasePage constructor - REQUIRED when extending
    }

    /**
     * Navigate to the login page
     * Uses the inherited basePageGoToUrl method from BasePage
     */
    async goto(): Promise<void> {
        await this.basePageGoToUrl('/login');
        await this.basePageWaitForLoad();
    }

    /**
     * Enter username in the username field
     * @param username - The username to type
     * Uses the inherited basePageEnterText method from BasePage
     */
    async enterUsername(username: string): Promise<void> {
        await this.basePageEnterText(this.usernameField, username);
    }

    /**
     * Enter password in the password field
     * @param password - The password to type
     */
    async enterPassword(password: string): Promise<void> {
        await this.basePageEnterText(this.passwordField, password);
    }

    /**
     * Click the login button
     */
    async clickLoginButton(): Promise<void> {
        await this.basePageClickElement(this.loginButton);
    }

    /**
     * Complete login process: enter credentials and click login
     * @param username - Username
     * @param password - Password
     */
    async login(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.basePageWaitForLoad();
    }

    /**
     * Login and verify it was successful
     * @param username - Username
     * @param password - Password
     * 
     * After login, checks if dashboard is visible
     * If not visible, checks for error message
     */
    async loginAndVerify(username: string, password: string): Promise<void> {
        await this.login(username, password);
        
        // Check if we see the dashboard (successful login)
        try {
            await this.basePageWaitForElement(this.dashboardIndicator, 10000);
            console.log('✓ Login successful');
        } catch (error) {
            // If no dashboard, check for error message
            const errorText = await this.basePageGetElementText(this.errorMessage);
            if (errorText) {
                throw new Error(`Login failed: ${errorText}`);
            }
            throw new Error('Login failed - could not verify');
        }
    }

    /**
     * Login as admin user
     * @param username - Admin username
     * @param password - Admin password
     */
    async loginAsAdmin(username: string, password: string): Promise<void> {
        console.log(`Logging in as admin: ${username}`);
        await this.loginAndVerify(username, password);
    }

    /**
     * Get the error message text (when login fails)
     * @returns Error message string or empty string
     */
    async getErrorMessage(): Promise<string> {
        if (await this.basePageIsElementVisible(this.errorMessage)) {
            return await this.basePageGetElementText(this.errorMessage);
        }
        return '';
    }
}