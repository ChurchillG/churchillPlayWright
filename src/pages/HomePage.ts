import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';
import { AdminPage } from './AdminPage';
import { InvoicePage } from './InvoicePage';

/**
 * HomePage - Represents the dashboard/home page after login
 * 
 * EXTENDS BasePage:
 * This means HomePage inherits all methods from BasePage
 * Examples of inherited methods:
 * - this.basePageGoToUrl()
 * - this.basePageClickElement()
 * - this.basePageEnterText()
 * - this.basePageVerifyElementIsVisible()
 * - this.basePageWaitForElement()
 * - this.basePageIsElementVisible()
 * - this.basePageGetElementText()
 * 
 * This page handles navigation from the dashboard:
 * Step 1: Click the menu button to reveal the dropdown
 * Step 2: Click Admin Panel option from dropdown
 * Step 3: Verify we're on the Admin Panel page
 * 
 * Uses getByRole() for better accessibility and reliability
 */
export class HomePage extends BasePage {
    
    /**
     * Locators - Using getByRole() for accessibility-first selectors
     * 
     * Benefits of getByRole():
     * - More reliable than CSS selectors
     * - Better for accessibility testing
     * - Closer to how users actually interact with the page
     * - Built-in ARIA role support
     */
    
    // STEP 1: Menu button that reveals the dropdown
    private get menuButton(): Locator {
       return this.page.getByRole('button', { name: /Menu/i });
    }

    // STEP 2: Admin Panel option in the dropdown menu
    private get adminPanelDropdownOption(): Locator {
        return this.page.getByRole('button', { name: /Admin Panel/i });
    }

    // Page indicators - Welcome message
    private get welcomeMessage(): Locator {
        return this.page.getByRole('heading', { name: /Welcome back, Admin! Here's an overview of your platform./i });
    }

    // Dashboard content indicator
    private get dashboardContent(): Locator {
        return this.page.getByRole('heading', { name: /🔐 Admin Dashboard/i });
    }

    // Dropdown menu container (to verify dropdown is visible)
    private get dropdownMenu(): Locator {
        return this.page.locator('.nav-dropdown.open');
    }

    // Admin Panel indicator (to verify we're on admin page)
    private get adminPanelIndicator(): Locator {
        return this.page.getByRole('heading', { name: /🔧 Admin Panel/i });
    }

    constructor(page: Page) {
        super(page); // Call BasePage constructor - REQUIRED when extending
    }

    /**
     * Wait for the home page to fully load
     * Uses inherited basePageWaitForElement and basePageWaitForLoad methods
     */
    async waitForHomePage(): Promise<void> {
        await this.basePageWaitForLoad();
        try {
            await this.basePageWaitForElement(this.dashboardContent, 15000);
        } catch {
            await this.basePageWaitForElement(this.welcomeMessage, 10000);
        }
    }

    /**
     * Verify that we are on the home page
     * Uses inherited basePageWaitForLoad method
     */
    async verifyOnHomePage(): Promise<void> {
        await this.page.waitForURL('**/dashboard**', { timeout: 10000 });
        await this.waitForHomePage();
    }

    /**
     * STEP 1: Click the menu button to reveal the dropdown
     * Uses inherited basePageClickElement and basePageWaitForElement methods
     */
    async clickMenuButton(): Promise<void> {
        console.log('Step 1: Clicking menu button to reveal dropdown');
        await this.basePageClickElement(this.menuButton);
        await this.basePageWaitForLoad();
        
        // Wait for the dropdown menu to appear
        await this.basePageWaitForElement(this.dropdownMenu, 10000);
        console.log('✓ Dropdown menu is now visible');
    }

    /**
     * STEP 2: Click Admin Panel option from the dropdown menu
     * This will navigate to the Admin Panel page
     * Uses inherited basePageClickElement, basePageWaitForLoad, and basePageWaitForElement methods
     */
    async clickAdminPanelFromDropdown(): Promise<void> {
        console.log('Step 2: Clicking Admin Panel option from dropdown');
        await this.basePageClickElement(this.adminPanelDropdownOption);
        await this.basePageWaitForLoad();
        
        // Wait for Admin Panel page to load
        await this.basePageWaitForElement(this.adminPanelIndicator, 10000);
        console.log('✓ Admin Panel page loaded');
    }

    /**
     * Navigate to Admin Panel using the dropdown menu
     * Step 1: Click menu button to reveal dropdown
     * Step 2: Click Admin Panel option from dropdown
     * Step 3: Verify we're on Admin Panel page
     * 
     * @returns AdminPanelPage - Returns an AdminPanelPage object for method chaining
     * 
     * Usage:
     * const adminPanelPage = await homePage.navigateToAdminPanel();
     * await adminPanelPage.clickInvoicesButton();
     */
    async navigateToAdminPanel(): Promise<AdminPage> {
        console.log('Navigating to Admin Panel...');
        
        // STEP 1: Click menu button to reveal dropdown
        await this.clickMenuButton();
        
        // STEP 2: Click Admin Panel option from dropdown
        await this.clickAdminPanelFromDropdown();
        
        // STEP 3: Verify we're on Admin Panel page
        await this.verifyOnAdminPanel();
        console.log('✓ Successfully navigated to Admin Panel');
        
        return new AdminPage(this.page);
    }

    /**
     * FIXED: Navigate directly to Invoice page through Admin Panel
     * This method was missing and causing the test to fail
     * 
     * @returns InvoicePage - Returns an InvoicePage object for method chaining
     * 
     * Usage:
     * const invoicePage = await homePage.navigateToInvoices();
     */
    async navigateToInvoices(): Promise<InvoicePage> {
        console.log('Navigating to Invoice page...');
        
        // STEP 1: Click menu button to reveal dropdown
        await this.clickMenuButton();
        
        // STEP 2: Click Admin Panel option from dropdown
        await this.clickAdminPanelFromDropdown();
        
        // STEP 3: Click Invoices button from Admin Panel
        const adminPage = new AdminPage(this.page);
        await adminPage.clickInvoicesButton();
        
        // STEP 4: Verify we're on Invoices page
        await adminPage.verifyOnInvoicesPage();
        
        // STEP 5: Click New Invoice button
        await adminPage.clickNewInvoiceButton();
        
        console.log('✓ Successfully navigated to Invoice page');
        return new InvoicePage(this.page);
    }

    /**
     * Verify that we are on the Admin Panel page
     * Uses inherited basePageWaitForElement method
     */
    async verifyOnAdminPanel(): Promise<void> {
        await this.basePageWaitForElement(this.adminPanelIndicator, 10000);
    }

    /**
     * Check if dropdown menu is currently visible
     * @returns boolean - true if dropdown is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isDropdownVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.dropdownMenu);
    }

    /**
     * Wait for the dropdown menu to appear
     * Uses inherited basePageWaitForElement method
     */
    async waitForDropdownMenu(): Promise<void> {
        await this.basePageWaitForElement(this.dropdownMenu, 10000);
    }

    /**
     * Get all visible options from the dropdown menu
     * @returns string[] - Array of option texts
     * Uses inherited basePageClickElement method
     */
    async getDropdownOptions(): Promise<string[]> {
        // Click menu to ensure dropdown is open
        await this.clickMenuButton();
        
        // Get all menu items
        const menuItems = this.page.getByRole('menuitem');
        const options: string[] = [];
        
        const count = await menuItems.count();
        for (let i = 0; i < count; i++) {
            const text = await menuItems.nth(i).textContent();
            if (text) options.push(text.trim());
        }
        
        return options;
    }
}