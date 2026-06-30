// src/pages/HomePage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';
import { InvoicePage } from './InvoicePage';

/**
 * HomePage - Represents the dashboard/home page after login
 * 
 * This is where users land after successful login.
 * From here, users can navigate to different sections.
 * 
 * Key navigation methods:
 * - navigateToAdminPanel() -> Admin Page
 * - navigateToInvoices() -> Invoice Page (returns InvoicePage for chaining)
 */
export class HomePage extends BasePage {
    
    // Navigation links
    private get adminPanelLink(): Locator {
        return this.page.locator('a:has-text("Admin"), a:has-text("Admin Panel"), [data-testid="admin-link"]');
    }

    private get invoicesLink(): Locator {
        return this.page.locator('a:has-text("Invoices"), a[href*="invoice"], [data-testid="invoices-link"]');
    }

    // Page indicators
    private get welcomeMessage(): Locator {
        return this.page.locator('h1:has-text("Welcome"), .welcome-message, [data-testid="welcome"]');
    }

    private get dashboardContent(): Locator {
        return this.page.locator('.dashboard-content, [data-testid="dashboard-content"], .main-content');
    }

    // User information
    private get userNameDisplay(): Locator {
        return this.page.locator('.user-name, [data-testid="user-name"], .profile-name');
    }

    constructor(page: Page) {
        super(page);
    }

    /**
     * Wait for the home page to fully load
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
     */
    async verifyOnHomePage(): Promise<void> {
        await this.page.waitForURL('**/dashboard**', { timeout: 10000 });
        await this.waitForHomePage();
    }

    /**
     * Navigate to the Admin Panel
     * Clicks the admin link and waits for page to load
     */
    async navigateToAdminPanel(): Promise<void> {
        console.log('Navigating to Admin Panel...');
        await this.basePageClickElement(this.adminPanelLink);
        await this.basePageWaitForLoad();
    }

    /**
     * Navigate to the Invoices section
     * @returns InvoicePage - Returns an InvoicePage object for method chaining
     * 
     * Method chaining means you can do:
     * const invoicePage = await homePage.navigateToInvoices();
     * await invoicePage.clickCreateInvoice();
     */
    async navigateToInvoices(): Promise<InvoicePage> {
        console.log('Navigating to Invoices...');
        await this.basePageClickElement(this.invoicesLink);
        await this.basePageWaitForLoad();
        return new InvoicePage(this.page);
    }

    /**
     * Get the name of the logged-in user
     * @returns The user's name
     */
    async getLoggedInUserName(): Promise<string> {
        return await this.basePageGetElementText(this.userNameDisplay);
    }

    /**
     * Check if the user has admin access
     * @returns true if admin panel link is visible
     */
    async hasAdminAccess(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.adminPanelLink);
    }
}