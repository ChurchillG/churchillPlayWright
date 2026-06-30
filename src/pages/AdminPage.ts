// src/pages/AdminPage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';

/**
 * AdminPage - Represents the admin panel of the application
 * 
 * This page is accessible after clicking "Admin Panel" from the HomePage
 * Contains administrative features and settings
 */
export class AdminPage extends BasePage {
    
    // Page header
    private get adminHeader(): Locator {
        return this.page.locator('h1:has-text("Admin"), h2:has-text("Admin Panel"), [data-testid="admin-header"]');
    }

    // Navigation links within admin panel
    private get invoicesSection(): Locator {
        return this.page.locator('a:has-text("Invoices"), [data-testid="admin-invoices"]');
    }

    private get usersSection(): Locator {
        return this.page.locator('a:has-text("Users"), [data-testid="admin-users"]');
    }

    private get settingsSection(): Locator {
        return this.page.locator('a:has-text("Settings"), [data-testid="admin-settings"]');
    }

    constructor(page: Page) {
        super(page);
    }

    /**
     * Wait for admin panel to load
     */
    async waitForAdminPanel(): Promise<void> {
        await this.basePageWaitForLoad();
        await this.basePageWaitForElement(this.adminHeader);
    }

    /**
     * Verify we are on the admin panel page
     */
    async verifyOnAdminPanel(): Promise<void> {
        await this.basePageVerifyElementIsVisible(this.adminHeader);
    }
}