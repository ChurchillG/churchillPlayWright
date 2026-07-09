// src/pages/InvoicePage.ts

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../helpers/base-page';

/**
 * InvoicePage - Represents the invoice modal/page
 * 
 * EXTENDS BasePage:
 * This means InvoicePage inherits all methods from BasePage
 * Examples of inherited methods:
 * - this.basePageGoToUrl()
 * - this.basePageClickElement()
 * - this.basePageEnterText()
 * - this.basePageVerifyElementIsVisible()
 * - this.basePageWaitForElement()
 * - this.basePageIsElementVisible()
 * - this.basePageGetElementText()
 * 
 * This page handles invoice creation within a modal:
 * Step 1: Verify invoice modal is visible with header
 * Step 2: Fill in client name and address
 * Step 3: Click Add Course button 4 times
 * Step 4: For each course, select the last valid option from dropdown
 * Step 5: Verify total amount is R2800
 * Step 6: Set due date to last day of June
 * Step 7: Select status (Paid/Pending)
 * Step 8: Click Create Invoice button
 * Step 9: Verify alert success message
 * 
 * Uses getByRole() and getByPlaceholder() for better accessibility and reliability
 */
export class InvoicePage extends BasePage {
    
    /**
     * Locators - Using getByRole() and getByPlaceholder() for accessibility-first selectors
     * Using CSS selectors where ARIA roles are not available
     */
    
    // ============ Modal Locators ============
    
    // Invoice modal container
    private get invoiceModal(): Locator {
        // Using CSS selector for the modal
        return this.page.locator('.invoice-modal');
    }

    // Alternative: Using getByTestId
    // private get invoiceModal(): Locator {
    //     return this.page.getByTestId('invoice-modal');
    // }

    // Modal header - "➕ Create New Invoice"
    private get invoiceModalHeader(): Locator {
        // Using getByRole for heading
        return this.page.getByRole('heading', { name: /➕ create new invoice/i });
    }

    // Alternative: Using getByText
    // private get invoiceModalHeader(): Locator {
    //     return this.page.getByText(/create new invoice/i);
    // }

    // ============ Client Information Fields ============
    
    // Client name input (textbox) - using placeholder
    private get clientNameInput(): Locator {
        // Using getByPlaceholder for the input field
        return this.page.getByPlaceholder(/Type client name or email.../i);
    }

    // Alternative: Using getByPlaceholder with exact text
    // private get clientNameInput(): Locator {
    //     return this.page.getByPlaceholder('Type client name or email...');
    // }

    // Client address input (textarea) - using placeholder
    private get clientAddressInput(): Locator {
        // Using getByPlaceholder for the textarea
        return this.page.getByPlaceholder(/Enter client address.../i);
    }

    // Alternative: Using getByPlaceholder with exact text
    // private get clientAddressInput(): Locator {
    //     return this.page.getByPlaceholder('Enter client address...');
    // }

    // Alternative: Using CSS selector for textarea
    // private get clientAddressInput(): Locator {
    //     return this.page.locator('textarea[placeholder*="Enter client address" i]');
    // }

    // ============ Course Elements ============
    
    // Add Course button
    private get addCourseButton(): Locator {
        // Using getByRole for button
        return this.page.getByRole('button', { name: /➕ add course/i });
    }

    // Alternative: Using getByTestId
    // private get addCourseButton(): Locator {
    //     return this.page.getByTestId('add-course');
    // }

    // Course dropdown - for each course row
    private getCourseDropdown(index: number): Locator {
        // Using CSS selector with nth-of-type for select elements
        return this.page.locator(`select:nth-of-type(${index})`);
    }

    // Alternative: Using getByTestId with index
    // private getCourseDropdown(index: number): Locator {
    //     return this.page.getByTestId(`course-select-${index}`);
    // }

    // ============ Invoice Details ============
    
    // Total amount span (to verify R2800)
    private get totalAmountDisplay(): Locator {
        // Using getByText to find the span with total
        return this.page.getByText(/R 2 800,00/i);
    }

    // Alternative: Using CSS selector
    // private get totalAmountDisplay(): Locator {
    //     return this.page.locator('span.total-amount, .total-amount');
    // }

    // Alternative: Using getByTestId
    // private get totalAmountDisplay(): Locator {
    //     return this.page.getByTestId('total-amount');
    // }

    // Due date input (type="date")
    private get dueDateInput(): Locator {
        // Using CSS selector for date input
        return this.page.locator('input[type="date"]');
    }

    // Alternative: Using getByLabel
    // private get dueDateInput(): Locator {
    //     return this.page.getByLabel(/due date/i);
    // }

    // Alternative: Using getByTestId
    // private get dueDateInput(): Locator {
    //     return this.page.getByTestId('due-date');
    // }

    // Status dropdown (Paid/Pending)
    private get statusDropdown(): Locator {
    // More specific - targets select with options "Pending" and "Paid"
    return this.page.locator('select:has(option[value="pending"]):has(option[value="paid"])');
}

    // Alternative: Using getByTestId
    // private get statusDropdown(): Locator {
    //     return this.page.getByTestId('status-select');
    // }

    // Alternative: Using CSS selector
    // private get statusDropdown(): Locator {
    //     return this.page.locator('select[name="status"]');
    // }

    // ============ Action Buttons ============
    
    // Create Invoice button
    private get createInvoiceButton(): Locator {
        // Using getByRole for button
        return this.page.getByRole('button', { name: /✅ Create Invoice/i });
    }

    // Alternative: Using getByTestId
    // private get createInvoiceButton(): Locator {
    //     return this.page.getByTestId('create-invoice');
    // }

    // ============ Validation Locators ============
    
    // Alert success message
    private get successAlert(): Locator {
        // Using getByRole for alert
        return this.page.getByRole('alert');
    }

    // Alternative: Using getByText
    // private get successAlert(): Locator {
    //     return this.page.getByText(/invoice created successfully/i);
    // }

    // Alternative: Using CSS selector
    // private get successAlert(): Locator {
    //     return this.page.locator('.alert-success, .success-message');
    // }

    constructor(page: Page) {
        super(page); // Call BasePage constructor - REQUIRED when extending
    }

    // ============ Page Actions ============

    /**
     * STEP 1: Wait for the invoice modal to load and verify header is visible
     * Uses inherited basePageWaitForElement and basePageWaitForLoad methods
     */
    async waitForInvoiceModal(): Promise<void> {
        console.log('Waiting for invoice modal to load...');
        await this.basePageWaitForLoad();
        await this.basePageWaitForElement(this.invoiceModal, 10000);
        await this.basePageWaitForElement(this.invoiceModalHeader, 10000);
        console.log(' Invoice modal is visible');
    }

    /**
     * STEP 1: Verify the invoice modal header is visible
     * Uses inherited basePageVerifyElementIsVisible method
     */
    async verifyModalHeader(): Promise<void> {
        console.log('Verifying "➕ Create New Invoice" header is visible...');
        await this.basePageVerifyElementIsVisible(this.invoiceModalHeader);
        console.log(' Modal header is visible');
    }

    /**
     * STEP 2: Fill in the client's name and address
     * @param clientName - Client's full name (e.g., "churchill@gmail.com")
     * @param clientAddress - Client's address (e.g., "birdswood")
     * Uses inherited basePageEnterText methods
     */
    async fillClientInformation(clientName: string, clientAddress: string): Promise<void> {
        console.log(`Filling client info - Name: ${clientName}`);
        await this.basePageEnterText(this.clientNameInput, clientName);
        await this.basePageEnterText(this.clientAddressInput, clientAddress);
        console.log(' Client information filled');
    }

    /**
     * STEP 3: Click the Add Course button
     * Uses inherited basePageClickElement method
     */
    async clickAddCourseButton(): Promise<void> {
        console.log('Clicking Add Course button...');
        await this.basePageClickElement(this.addCourseButton);
        await this.page.waitForTimeout(500); // Wait for DOM update
        console.log(' Add Course button clicked');
    }

    /**
     * STEP 4: Select the last valid course option from a dropdown
     * @param index - Course number (1, 2, 3, or 4)
     * Uses inherited basePageSelectOption method
     */
    async selectLastCourseOption(index: number): Promise<void> {
        console.log(`Selecting last course option for course ${index}...`);
        
        // Get the dropdown for this course
        const dropdown = this.getCourseDropdown(index);
        
        // Get all options from the dropdown
        const options = await dropdown.locator('option').all();
        
        // Find the last valid option (skip placeholder)
        let lastValidIndex = -1;
        let lastValidText = '';
        
        for (let i = options.length - 1; i >= 0; i--) {
            const text = await options[i].textContent();
            const value = await options[i].getAttribute('value');
            
            // Skip the placeholder option
            if (value && value !== 'select course...' && text && text.trim() !== 'select course...') {
                lastValidIndex = i;
                lastValidText = text.trim();
                break;
            }
        }
        
        if (lastValidIndex >= 0) {
            // Select by index
            await dropdown.selectOption({ index: lastValidIndex });
            console.log(` Selected course option: ${lastValidText}`);
        } else {
            console.log('No valid course options found in dropdown');
        }
    }

    /**
     * STEP 3 & 4: Add 4 courses by clicking Add Course button 4 times
     * and selecting the last valid option from each dropdown
     */
    async addFourCourses(): Promise<void> {
        console.log('Adding 4 courses...');
        
        // Click Add Course button and select last option for each course
        for (let i = 1; i <= 4; i++) {
            if (i > 1) {
                // Click Add Course button for courses 2, 3, and 4
                await this.clickAddCourseButton();
            }
            
            // Select the last valid option from the dropdown
            await this.selectLastCourseOption(i);
        }
        
        console.log(' All 4 courses added');
    }

    /**
     * STEP 5: Verify the total amount is R2800
     * Uses inherited basePageVerifyElementIsVisible method
     */
    async verifyTotalAmount(): Promise<void> {
        console.log('Verifying total amount is R2800...');
        await this.basePageWaitForElement(this.totalAmountDisplay, 10000);
        await this.basePageVerifyElementIsVisible(this.totalAmountDisplay);
        console.log('Total amount is R2800');
    }

    /**
     * STEP 6: Set the due date to the last day of June
     * @param date - Due date in YYYY-MM-DD format (default: "2026-06-30")
     * Uses inherited basePageEnterText method
     */
    async setDueDate(date: string = '2026-06-30'): Promise<void> {
        console.log(`Setting due date to: ${date}`);
        await this.basePageEnterText(this.dueDateInput, date);
        console.log(' Due date set');
    }

    /**
     * STEP 7: Set the status of the invoice
     * @param status - Status value ("Paid" or "Pending")
     * Uses inherited basePageSelectOption method
     */
    async setStatus(status: string): Promise<void> {
        console.log(`Setting status to: ${status}`);
        await this.basePageSelectOption(this.statusDropdown, status);
        console.log(' Status set');
    }

    /**
     * STEP 8: Click the Create Invoice button
     * Uses inherited basePageClickElement and basePageWaitForLoad methods
     */
    async clickCreateInvoice(): Promise<void> {
        console.log('Clicking Create Invoice button...');
        await this.basePageClickElement(this.createInvoiceButton);
        await this.basePageWaitForLoad();
        console.log(' Create Invoice button clicked');
    }

    /**
     * STEP 9: Verify the alert success message
     * Uses inherited basePageWaitForElement and basePageVerifyElementIsVisible methods
     */
    async verifySuccessAlert(): Promise<void> {
        console.log('Verifying success alert...');
        await this.basePageWaitForElement(this.successAlert, 10000);
        await this.basePageVerifyElementIsVisible(this.successAlert);
        console.log('Invoice creation success alert displayed');
    }

    /**
     * Complete flow to create an invoice with all steps
     * 
     * Steps:
     * 1. Verify modal header is visible
     * 2. Fill client name: "churchill@gmail.com"
     * 3. Fill client address: "birdswood"
     * 4. Click Add Course button (4 times)
     * 5. For each course, select the last valid option from dropdown
     * 6. Verify total amount is R2800
     * 7. Set due date to last day of June (2026-06-30)
     * 8. Set status to "Paid"
     * 9. Click Create Invoice
     * 10. Verify success alert
     * 
     * Usage:
     * await invoicePage.createInvoiceToYourself();
     */
    async createInvoiceToYourself(): Promise<void> {
        console.log('=== Starting Invoice Creation Flow ===');
        
        // STEP 1: Verify modal header is visible
        await this.verifyModalHeader();
        
        // STEP 2 & 3: Fill client information
        await this.fillClientInformation('churchill@gmail.com', 'birdswood');
        
        // STEP 4 & 5: Add 4 courses
        await this.addFourCourses();
        
        // STEP 6: Verify total amount is R2800
        await this.verifyTotalAmount();
        
        // STEP 7: Set due date to last day of June
        await this.setDueDate('2026-06-30');
        
        // STEP 8: Set status to Paid
        await this.setStatus('Paid');
        
        // STEP 9: Click Create Invoice
        await this.clickCreateInvoice();
        
        // STEP 10: Verify success alert
        await this.verifySuccessAlert();
        
        console.log('=== Invoice Creation Completed Successfully ===');
    }

    /**
     * Complete flow to create an invoice with custom data
     * @param invoiceData - Custom invoice data
     * 
     * Usage:
     * await invoicePage.createInvoice({
     *   clientName: 'john@gmail.com',
     *   clientAddress: 'cape town',
     *   status: 'Pending',
     *   dueDate: '2026-07-15'
     * });
     */
    async createInvoice(invoiceData: {
        clientName?: string;
        clientAddress?: string;
        status?: string;
        dueDate?: string;
    } = {}): Promise<void> {
        console.log('=== Starting Custom Invoice Creation ===');
        
        // STEP 1: Verify modal header is visible
        await this.verifyModalHeader();
        
        // STEP 2 & 3: Fill client information (with defaults)
        await this.fillClientInformation(
            invoiceData.clientName || 'churchill@gmail.com',
            invoiceData.clientAddress || 'birdswood'
        );
        
        // STEP 4 & 5: Add 4 courses
        await this.addFourCourses();
        
        // STEP 6: Verify total amount is R2800
        await this.verifyTotalAmount();
        
        // STEP 7: Set due date (with default)
        await this.setDueDate(invoiceData.dueDate || '2026-06-30');
        
        // STEP 8: Set status (with default)
        await this.setStatus(invoiceData.status || 'Paid');
        
        // STEP 9: Click Create Invoice
        await this.clickCreateInvoice();
        
        // STEP 10: Verify success alert
        await this.verifySuccessAlert();
        
        console.log('=== Custom Invoice Creation Completed Successfully ===');
    }

    /**
     * Check if invoice modal is visible
     * @returns boolean - true if modal is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isInvoiceModalVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.invoiceModal);
    }

    /**
     * Check if modal header is visible
     * @returns boolean - true if header is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isModalHeaderVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.invoiceModalHeader);
    }

    /**
     * Get the modal header text
     * @returns string - The header text
     * Uses inherited basePageGetElementText method
     */
    async getModalHeaderText(): Promise<string> {
        return await this.basePageGetElementText(this.invoiceModalHeader);
    }

    /**
     * Get the success alert text
     * @returns string - The alert text
     * Uses inherited basePageGetElementText method
     */
    async getSuccessAlertText(): Promise<string> {
        return await this.basePageGetElementText(this.successAlert);
    }

    /**
     * Check if success alert is visible
     * @returns boolean - true if alert is visible
     * Uses inherited basePageIsElementVisible method
     */
    async isSuccessAlertVisible(): Promise<boolean> {
        return await this.basePageIsElementVisible(this.successAlert);
    }
}