import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';
import { InvoicePage } from './InvoicePage';

/**
 * AdminPage - Represents the admin panel of the application
 * 
 * EXTENDS BasePage:
 * This means AdminPage inherits all methods from BasePage
 * Examples of inherited methods:
 * - this.basePageGoToUrl()
 * - this.basePageClickElement()
 * - this.basePageEnterText()
 * - this.basePageVerifyElementIsVisible()
 * - this.basePageWaitForElement()
 * - this.basePageIsElementVisible()
 * - this.basePageGetElementText()
 * 
 * This page is accessible after clicking "Admin Panel" from the HomePage
 * Contains administrative features and settings
 * 
 * Flow:
 * Step 1: Click Invoices button
 * Step 2: Verify we're on the Invoices page
 * Step 3: Click New Invoice button
 * 
 * Uses getByRole() for better accessibility and reliability
 */
export class AdminPage extends BasePage {
    
    /**
     * Locators - Using getByRole() for accessibility-first selectors
     * 
     * Benefits of getByRole():
     * - More reliable than CSS selectors
     * - Better for accessibility testing
     * - Closer to how users actually interact with the page
     * - Built-in ARIA role support
     */
    
    // Page header
    private get adminHeader(): Locator {
        return this.page.getByRole('heading', { name: /🔧 Admin Panel/i });
    }

    // STEP 1: Invoices navigation link in admin panel
    private get invoicesButton(): Locator {
        return this.page.getByRole('button', { name: /Invoices/i });
    }

    // STEP 2: Invoices page indicator (to verify we're on invoices page)
    private get invoicesPageIndicator(): Locator {
        return this.page.getByRole('heading', { name: /🧾 Invoices/i });
    }

    // STEP 3: New Invoice button
    private get newInvoiceButton(): Locator {
        return this.page.getByRole('button', { name: /➕ New Invoice/i });
    }

    constructor(page: Page) {
        super(page); // Call BasePage constructor - REQUIRED when extending
    }

    /**
     * Wait for admin panel to load
     * Uses inherited basePageWaitForLoad and basePageWaitForElement methods
     */
    async waitForAdminPanel(): Promise<void> {
        await this.basePageWaitForLoad();
        await this.basePageWaitForElement(this.adminHeader, 10000);
    }

    /**
     * Verify we are on the admin panel page
     * Uses inherited basePageVerifyElementIsVisible method
     */
    async verifyOnAdminPanel(): Promise<void> {
        await this.basePageVerifyElementIsVisible(this.adminHeader);
    }

    /**
     * STEP 1: Click Invoices button from the admin panel
     * Uses inherited basePageClickElement and basePageWaitForLoad methods
     */
    async clickInvoicesButton(): Promise<void> {
        console.log('Step 1: Clicking Invoices button from Admin Panel');
        await this.basePageClickElement(this.invoicesButton);
        await this.basePageWaitForLoad();
        console.log('Invoices button clicked');
    }

    /**
     * STEP 2: Verify we are on the Invoices page
     * Uses inherited basePageWaitForElement method
     */
    async verifyOnInvoicesPage(): Promise<void> {
        console.log('Step 2: Verifying we are on the Invoices page');
        await this.basePageWaitForElement(this.invoicesPageIndicator, 10000);
        console.log('Verified we are on the Invoices page');
    }

    /**
     * STEP 3: Click New Invoice button
     * Uses inherited basePageClickElement and basePageWaitForLoad methods
     */
    async clickNewInvoiceButton(): Promise<void> {
        console.log('Step 3: Clicking New Invoice button');
        await this.basePageClickElement(this.newInvoiceButton);
        await this.basePageWaitForLoad();
        console.log(' New Invoice button clicked');
    }

    /**
     * Complete THREE-STEP flow to create a new invoice:
     * Step 1: Click Invoices button
     * Step 2: Verify we're on the Invoices page
     * Step 3: Click New Invoice button
     * 
     * @returns InvoicesPage - Returns an InvoicesPage object for method chaining
     * 
     * Usage:
     * const invoicesPage = await adminPage.navigateToNewInvoice();
     * await invoicesPage.fillInvoiceForm();
     */
    async navigateToNewInvoice(): Promise<InvoicePage> {
        console.log('Navigating to New Invoice...');
        
        // STEP 1: Click Invoices button from Admin Panel
        await this.clickInvoicesButton();
        
        // STEP 2: Verify we're on the Invoices page
        await this.verifyOnInvoicesPage();
        
        // STEP 3: Click New Invoice button
        await this.clickNewInvoiceButton();
        
        console.log('Successfully navigated to New Invoice');
        return new InvoicePage(this.page);
    }

    /**
     * Check if Invoices button is visible
     * @returns boolean - true if Invoices button is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isInvoicesButtonVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.invoicesButton);
    }

    /**
     * Check if New Invoice button is visible
     * @returns boolean - true if New Invoice button is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isNewInvoiceButtonVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.newInvoiceButton);
    }

    /**
     * Get the admin panel header text
     * @returns string - The header text
     * Uses inherited basePageGetElementText method
     */
    async getAdminHeaderText(): Promise<string> {
        return await this.basePageGetElementText(this.adminHeader);
    }
}