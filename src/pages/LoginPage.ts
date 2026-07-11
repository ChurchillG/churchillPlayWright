import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';


export class LoginPage extends BasePage {
    
    
    // STEP 1: Initial login button that reveals the login form
    private get initialLoginButton(): Locator {
        return this.page.getByRole('button', { name: /🔑 Login/i });
    }

    // STEP 2: Login form elements that appear after clicking initial login button
    
    // Username input field
    private get usernameField(): Locator {
        return this.page.getByRole('textbox', { name: /Email/i });
    }

    // Password input field
    private get passwordField(): Locator {
        return this.page.getByRole('textbox', { name: /Password/i });
    }

    // STEP 2: Submit login button (the actual credential submission)
    private get submitLoginButton(): Locator {
        return this.page.getByRole('button', { name: /Login/i });
    }

    // Login form container (to verify form is visible)
    private get loginForm(): Locator {
        return this.page.locator('#login-card');
    }

    // Error message (shows when login fails)
    private get errorMessage(): Locator {
        return this.page.getByRole('alert');
    }

    // Dashboard indicator (shows when login succeeds)
    private get dashboardIndicator(): Locator {
        return this.page.locator('.dashboard-welcome');
    }

    constructor(page: Page) {
        super(page); // Call BasePage constructor - REQUIRED when extending
    }

    /**
     * Navigate to the login page
     * Uses the inherited basePageGoToUrl method from BasePage
     */
    async goto(): Promise<void> {
        await this.basePageGoToUrl('/');
        await this.basePageWaitForLoad();
    }

    /**
     * STEP 1: Click the initial login button to reveal the login form
     * This is the first click that triggers the login flow
     */
    async clickInitialLoginButton(): Promise<void> {
        console.log('Step 1: Clicking initial login button to reveal form');
        await this.basePageClickElement(this.initialLoginButton);
        await this.basePageWaitForLoad();
        
        // Wait for the login form to appear
        await this.basePageWaitForElement(this.loginForm, 10000);
        console.log('✓ Login form is now visible');
    }

    /**
     * STEP 2: Enter username in the username field
     * @param username - The username to type
     * Uses the inherited basePageEnterText method from BasePage
     */
    async enterUsername(username: string): Promise<void> {
        console.log(`Step 2a: Entering username: ${username}`);
        await this.basePageEnterText(this.usernameField, username);
    }

    /**
     * STEP 2: Enter password in the password field
     * @param password - The password to type
     */
    async enterPassword(password: string): Promise<void> {
        console.log('Step 2b: Entering password');
        await this.basePageEnterText(this.passwordField, password);
    }

    /**
     * STEP 2: Click the submit login button to authenticate
     * This is the second click that submits credentials
     */
    async clickSubmitLoginButton(): Promise<void> {
        console.log('Step 2c: Clicking submit login button');
        await this.basePageClickElement(this.submitLoginButton);
        await this.basePageWaitForLoad();
    }

    /**
     * Complete TWO-STEP login process: 
     * Step 1: Click initial login button
     * Step 2: Enter credentials and submit
     * 
     * @param username - Username
     * @param password - Password
     */
    async login(username: string, password: string): Promise<void> {
        // STEP 1: Click initial login button to reveal form
        await this.clickInitialLoginButton();
        
        // STEP 2: Enter credentials and submit
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickSubmitLoginButton();
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
            const errorText = await this.getErrorMessage();
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

    /**
     * Check if the login form is currently visible
     * @returns boolean - true if form is visible
     */
    async isLoginFormVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.loginForm);
    }

    /**
     * Wait for the login form to appear
     * Useful if you want to separate the steps manually
     */
    async waitForLoginForm(): Promise<void> {
        await this.basePageWaitForElement(this.loginForm, 10000);
    }

    /**
     * Get the current value in the username field
     * @returns string - Current username value
     */
    async getUsernameValue(): Promise<string> {
        return await this.basePageGetTextValue(this.usernameField);
    }

    /**
     * Clear the username field
     */
    async clearUsername(): Promise<void> {
        await this.usernameField.clear();
    }

    /**
     * Clear the password field
     */
    async clearPassword(): Promise<void> {
        await this.passwordField.clear();
    }
}