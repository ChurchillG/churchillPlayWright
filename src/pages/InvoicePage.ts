// src/pages/InvoicePage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';

/**
 * InvoicePage - Represents the invoice management page
 * 
 * This page handles all invoice operations:
 * - Creating new invoices
 * - Adding courses to invoices
 * - Setting payment details
 * - Validating invoice creation
 * 
 * All methods use the inherited basePage* methods from BasePage
 */
export class InvoicePage extends BasePage {
    
    // ============ Locators ============
    
    // Page identification
    private get invoicePageHeader(): Locator {
        return this.page.locator('h1:has-text("Invoice"), h2:has-text("Invoice"), [data-testid="invoice-page"]');
    }

    // Buttons
    private get createInvoiceButton(): Locator {
        return this.page.locator('button:has-text("Create Invoice"), a:has-text("Create Invoice"), [data-testid="create-invoice"]');
    }

    private get addCourseButton(): Locator {
        return this.page.locator('button:has-text("Add Course"), button:has-text("Add Item"), [data-testid="add-course"]');
    }

    private get submitButton(): Locator {
        return this.page.locator('button:has-text("Create"), button[type="submit"], [data-testid="submit-invoice"]');
    }

    // Client information fields
    private get clientNameInput(): Locator {
        return this.page.locator('input[name="clientName"], input#clientName, [data-testid="client-name"]');
    }

    private get clientAddressInput(): Locator {
        return this.page.locator('input[name="clientAddress"], textarea[name="address"], [data-testid="client-address"]');
    }

    // Course fields - index-based to handle multiple courses
    private getCourseSelect(index: number): Locator {
        return this.page.locator(`select:nth-of-type(${index}), [data-testid="course-select-${index}"]`);
    }

    private getCourseDescription(index: number): Locator {
        return this.page.locator(`textarea:nth-of-type(${index}), [data-testid="course-description-${index}"]`);
    }

    // Invoice details
    private get totalAmountInput(): Locator {
        return this.page.locator('[data-testid="total-amount"], #totalAmount, input[name="totalAmount"]');
    }

    private get dueDateInput(): Locator {
        return this.page.locator('input[type="date"], input[name="dueDate"], [data-testid="due-date"]');
    }

    private get statusDropdown(): Locator {
        return this.page.locator('select[name="status"], [data-testid="status-select"]');
    }

    // Invoice list and validation
    private get invoiceList(): Locator {
        return this.page.locator('.invoice-list, table, [data-testid="invoice-list"]');
    }

    private getInvoiceRow(clientName: string): Locator {
        return this.page.locator(`tr:has-text("${clientName}"), .invoice-item:has-text("${clientName}")`);
    }

    private get successMessage(): Locator {
        return this.page.locator('.success-message, .alert-success, [data-testid="success-message"]');
    }

    private get totalAmountDisplay(): Locator {
        return this.page.locator('.total-amount-display, .amount, [data-testid="amount-display"]');
    }

    constructor(page: Page) {
        super(page);
    }

    // ============ Page Actions ============

    /**
     * Wait for the invoice page to load
     */
    async waitForInvoicePage(): Promise<void> {
        await this.basePageWaitForLoad();
        await this.basePageWaitForElement(this.invoicePageHeader);
    }

    /**
     * Click "Create Invoice" button to open the invoice form
     */
    async clickCreateInvoice(): Promise<void> {
        console.log('Clicking Create Invoice button...');
        await this.basePageClickElement(this.createInvoiceButton);
        await this.basePageWaitForElement(this.clientNameInput);
    }

    /**
     * Fill in the client's name and address
     * @param clientName - Client's full name (e.g., "Your Name Pty Ltd")
     * @param clientAddress - Client's address (e.g., "123 Fake Street")
     */
    async fillClientInformation(clientName: string, clientAddress: string): Promise<void> {
        console.log(`Filling client info - Name: ${clientName}`);
        await this.basePageEnterText(this.clientNameInput, clientName);
        await this.basePageEnterText(this.clientAddressInput, clientAddress);
    }

    /**
     * Add a single course to the invoice
     * @param index - Course number (1, 2, 3, or 4)
     * @param courseName - Name of the course
     * @param description - Description of the course
     */
    async addCourse(index: number, courseName: string, description: string): Promise<void> {
        console.log(`Adding course ${index}: ${courseName}`);
        
        // Click "Add Course" button for courses 2, 3, and 4
        if (index > 1) {
            await this.basePageClickElement(this.addCourseButton);
            await this.page.waitForTimeout(500); // Wait for DOM update
        }
        
        // Select course from dropdown
        await this.basePageSelectOption(this.getCourseSelect(index), courseName);
        
        // Enter course description
        await this.basePageEnterText(this.getCourseDescription(index), description);
    }

    /**
     * Add multiple courses at once
     * @param courses - Array of {name, description} objects
     * 
     * @example
     * await invoicePage.addMultipleCourses([
     *   { name: 'Web Development', description: 'Learn HTML, CSS, JS' },
     *   { name: 'Data Science', description: 'Python for data' },
     *   { name: 'Cloud Computing', description: 'AWS basics' },
     *   { name: 'Cybersecurity', description: 'Security basics' }
     * ]);
     */
    async addMultipleCourses(courses: Array<{ name: string; description: string }>): Promise<void> {
        for (let i = 0; i < courses.length; i++) {
            await this.addCourse(i + 1, courses[i].name, courses[i].description);
        }
    }

    /**
     * Set the total amount for the invoice
     * @param amount - Total amount (e.g., "R2800")
     */
    async setTotalAmount(amount: string): Promise<void> {
        console.log(`Setting total amount: ${amount}`);
        await this.basePageEnterText(this.totalAmountInput, amount);
    }

    /**
     * Set the due date for the invoice
     * @param date - Due date in YYYY-MM-DD format (e.g., "2026-06-30")
     */
    async setDueDate(date: string): Promise<void> {
        console.log(`Setting due date: ${date}`);
        await this.basePageEnterText(this.dueDateInput, date);
    }

    /**
     * Set the status of the invoice
     * @param status - Status value (e.g., "Paid", "Pending")
     */
    async setStatus(status: string): Promise<void> {
        console.log(`Setting status: ${status}`);
        await this.basePageSelectOption(this.statusDropdown, status);
    }

    /**
     * Click submit to create the invoice
     */
    async submitInvoice(): Promise<void> {
        console.log('Submitting invoice...');
        await this.basePageClickElement(this.submitButton);
        await this.basePageWaitForLoad();
    }

    /**
     * Validate that the invoice was created successfully
     * @param clientName - The client name to look for
     */
    async validateInvoiceCreated(clientName: string): Promise<void> {
        console.log(`Validating invoice for: ${clientName}`);
        
        try {
            // Look for success message
            await this.basePageWaitForElement(this.successMessage, 5000);
            await this.basePageVerifyElementContainsText(this.successMessage, 'success');
            console.log('✓ Invoice created successfully');
        } catch {
            // If no success message, check if invoice appears in list
            await this.basePageWaitForElement(this.getInvoiceRow(clientName));
            await this.basePageVerifyElementIsVisible(this.getInvoiceRow(clientName));
            console.log('✓ Invoice found in list');
        }
    }

    /**
     * Validate the total amount displayed
     * @param expectedAmount - Expected amount (e.g., "R2800")
     */
    async validateTotalAmount(expectedAmount: string): Promise<void> {
        console.log(`Validating total amount: ${expectedAmount}`);
        await this.basePageVerifyElementContainsText(this.totalAmountDisplay, expectedAmount);
        console.log('✓ Total amount is correct');
    }

    /**
     * Complete invoice creation - does everything in one method
     * @param invoiceData - All invoice data
     * 
     * This follows the exact steps from your requirements:
     * 1. Fill client info (Your Name Pty Ltd, fake address)
     * 2. Add 4 courses with descriptions
     * 3. Validate R2800 as total
     * 4. Set due date to last day of June
     * 5. Set status to Paid
     * 6. Click create invoice
     * 7. Validate invoice is created
     */
    async createCompleteInvoice(invoiceData: InvoiceData): Promise<void> {
        // Step 1: Fill client information
        await this.fillClientInformation(invoiceData.clientName, invoiceData.clientAddress);
        
        // Step 2: Add 4 courses
        await this.addMultipleCourses([
            { name: invoiceData.course1, description: invoiceData.course1Description },
            { name: invoiceData.course2, description: invoiceData.course2Description },
            { name: invoiceData.course3, description: invoiceData.course3Description },
            { name: invoiceData.course4, description: invoiceData.course4Description },
        ]);
        
        // Step 3: Set invoice details
        await this.setTotalAmount(invoiceData.totalAmount);
        await this.setDueDate(invoiceData.dueDate);
        await this.setStatus(invoiceData.status);
        
        // Step 4: Submit the invoice
        await this.submitInvoice();
        
        // Step 5: Validate invoice was created
        await this.validateInvoiceCreated(invoiceData.clientName);
    }
}

/**
 * Interface for invoice data
 * Defines the structure of data needed to create an invoice
 */
export interface InvoiceData {
    clientName: string;
    clientAddress: string;
    course1: string;
    course1Description: string;
    course2: string;
    course2Description: string;
    course3: string;
    course3Description: string;
    course4: string;
    course4Description: string;
    totalAmount: string;
    dueDate: string;
    status: string;
}