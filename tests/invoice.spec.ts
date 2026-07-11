import { test, expect } from '../src/fixtures/test-fixtures';
import { readCsvAsType } from '../src/helpers/csv-reader';

// Define the login credentials interface
interface LoginCredentials {
    username: string;
    password: string;
}

test.describe('Invoice Management', () => {
    
    test('Create invoice using CSV data', async ({ 
        loginPage, 
        homePage, 
        invoicePage 
    }) => {
        
        // ============ Read Login Data from CSV ============
        
        const loginData = readCsvAsType<LoginCredentials>('src/test-data/login-data.csv');
        const adminUser = loginData[0];
        console.log(`Username: ${adminUser.username}`);
        
        // ============ EXECUTE THE TEST ============
        
        // STEP 1: Login with admin credentials from CSV
        await loginPage.goto();
        await loginPage.loginAsAdmin(adminUser.username, adminUser.password);
        
        // STEP 2: Navigate to Invoice page
        const invoicePageFromNav = await homePage.navigateToInvoices();
        
        // STEP 3: Wait for invoice page to load
        await invoicePageFromNav.waitForInvoicePage();
        
        // STEP 4: Create the invoice using the existing method
        await invoicePageFromNav.createInvoiceToYourself();
        
        console.log('✓ Test completed successfully!');
    });
});