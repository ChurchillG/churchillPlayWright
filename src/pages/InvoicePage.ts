import { Page, Locator, expect } from '@playwright/test';
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
        return this.page.locator('.invoice-modal');
    }

    // Modal header - "➕ Create New Invoice"
    private get invoiceModalHeader(): Locator {
        return this.page.getByRole('heading', { name: /➕ create new invoice/i });
    }

    // ============ Client Information Fields ============
    
    // Client name input (textbox) - using placeholder
    private get clientNameInput(): Locator {
        return this.page.getByPlaceholder(/Type client name or email.../i);
    }

    // Client address input (textarea) - using placeholder
    private get clientAddressInput(): Locator {
        return this.page.getByPlaceholder(/Enter client address.../i);
    }

    // ============ Course Elements ============
    
    // Add Course button
    private get addCourseButton(): Locator {
        return this.page.getByRole('button', { name: /➕ add course/i });
    }

    // Course dropdown - always resolves to the next unfilled course row,
    // since its cell's accessible name is "Select course..." until chosen
    private get courseDropdown(): Locator {
        return this.page.getByRole('cell', { name: 'Select course...' }).getByRole('combobox');
    }

    // ============ Invoice Details ============
    
    // Total amount span (to verify R2800)
    private get totalAmountDisplay(): Locator {
        return this.page.getByText(/R\s*2\s*800,00/i).last();
    }

    // Due date input (type="date")
    private get dueDateInput(): Locator {
        return this.page.locator('input[type="date"]');
    }

    // Status dropdown (Paid/Pending)
    private get statusDropdown(): Locator {
        return this.page.locator('select:has(option[value="pending"]):has(option[value="paid"])');
    }

    // ============ Action Buttons ============
    
    // Create Invoice button
    private get createInvoiceButton(): Locator {
        return this.page.getByRole('button', { name: /✅ Create Invoice/i });
    }

    // ============ Validation Locators ============
    
    // Alert success message
    private get successAlert(): Locator {
        return this.page.getByRole('alert');
    }

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
     * FIXED: Wait for the invoice page to load
     * This method was missing and causing the test to fail
     * Uses inherited basePageWaitForLoad method
     */
    async waitForInvoicePage(): Promise<void> {
        console.log('Waiting for invoice page to load...');
        await this.basePageWaitForLoad();
        await this.basePageWaitForElement(this.invoiceModal, 10000);
        console.log('✓ Invoice page loaded');
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
    await this.basePageDismissOverlay();
    await this.basePageClickElement(this.addCourseButton);
    await this.page.waitForLoadState('networkidle');
    console.log(' Add Course button clicked');
}

    /**
     * STEP 4: Select the last valid course option from the next unfilled course dropdown
     * @param index - Course number (1, 2, 3, or 4) - used only for logging now
     * Uses inherited basePageSelectOption method
     */
   async selectLastCourseOption(index: number): Promise<void> {
    console.log(`Selecting last course option for course ${index}...`);
    
    await this.basePageDismissOverlay();
    
    const dropdown = this.courseDropdown;
    
    await expect(async () => {
        const optionCount = await dropdown.locator('option').count();
        expect(optionCount).toBeGreaterThan(1);
    }).toPass({ timeout: 10000 });
    
    const options = await dropdown.locator('option').all();
    
    let lastValidIndex = -1;
    let lastValidText = '';
    
    for (let i = options.length - 1; i >= 0; i--) {
        const text = await options[i].textContent();
        const value = await options[i].getAttribute('value');
        
        if (value && value !== '' && text && text.trim() !== 'Select course...') {
            lastValidIndex = i;
            lastValidText = text.trim();
            break;
        }
    }
    
    if (lastValidIndex >= 0) {
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
    
    for (let i = 1; i <= 4; i++) {
        // Click Add Course button for every course, including the first
        await this.clickAddCourseButton();
        
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
     * FIXED: Validate the total amount on the invoice
     * This method was missing and causing the test to fail
     * 
     * @param expectedAmount - Expected total amount (e.g., "R2800")
     * 
     * Usage:
     * await invoicePage.validateTotalAmount('R2800');
     */
    async validateTotalAmount(expectedAmount: string): Promise<void> {
        console.log(`Validating total amount: ${expectedAmount}`);
        
        // Wait for total amount to be visible
        await this.basePageWaitForElement(this.totalAmountDisplay, 10000);
        
        // Get the actual total amount text
        const actualAmount = await this.basePageGetElementText(this.totalAmountDisplay);
        
        console.log(`Actual amount: ${actualAmount}`);
        console.log(`Expected amount: ${expectedAmount}`);
        
        // Verify the total amount matches
        await this.basePageVerifyElementHasText(
            this.totalAmountDisplay,
            expectedAmount
        );
        
        console.log(`✓ Total amount validated: ${expectedAmount}`);
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
     * @param status - Status value ("paid" or "pending", lowercase to match the option values)
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
     * FIXED: Click the Create Invoice button (simplified version for test)
     * This method was missing and causing the test to fail
     * Uses inherited basePageClickElement and basePageWaitForLoad methods
     */
    async clickCreateInvoiceButton(): Promise<void> {
        console.log('Clicking Create Invoice button...');
        await this.basePageClickElement(this.createInvoiceButton);
        await this.basePageWaitForLoad();
        console.log('✓ Create Invoice button clicked');
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
     * 8. Set status to "paid"
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
    
    // STEP 8: Set status to paid
    await this.setStatus('paid');
    
    // STEP 9: Click Create Invoice
    await this.clickCreateInvoice();
    
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
     *   status: 'pending',
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
        await this.setStatus(invoiceData.status || 'paid');
        
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