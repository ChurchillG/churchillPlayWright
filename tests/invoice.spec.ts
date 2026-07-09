import { test, expect } from '../src/fixtures/test-fixtures.js';
import { 
    readCsv,           
    readCsvAsMap,      
    csvRecordToType,   
    readCsvAsType      
} from '../src/helpers/csv-reader.js';

// Define the login credentials interface
interface LoginCredentials {
    username: string;
    password: string;
    role: string;
    expectedRedirect: string;
}

test.describe('Invoice Management', () => {
    
    test('Create invoice using CSV data', async ({ 
        loginPage, 
        homePage, 
        invoicePage 
    }) => {
        
        // ============ Read Login Data from CSV ============
        
        // Method 1: Using readCsvAsType (Recommended)
        const loginData = readCsvAsType<LoginCredentials>('src/test-data/login-data.csv');
        const adminUser = loginData[0];
        console.log(`Username: ${adminUser.username}`);
        console.log(`Password: ${adminUser.password}`);
        console.log(`Role: ${adminUser.role}`);
        
        // Method 2: Using readCsv + csvRecordToType
        const rawData = readCsv('src/test-data/login-data.csv');
        const adminLogin = csvRecordToType<LoginCredentials>(rawData[0]);
        console.log(`Expected Redirect: ${adminLogin.expectedRedirect}`);
        
        // Method 3: Using readCsvAsMap
        const loginMap = readCsvAsMap('src/test-data/login-data.csv', 'username');
        const admin = loginMap.get('admin');
        if (admin) {
            console.log(`Admin password from map: ${admin.password}`);
        }
        
        // ============ EXECUTE THE TEST ============
        
        // STEP 1: Login with admin credentials from CSV
        await loginPage.goto();
        await loginPage.loginAsAdmin(adminUser.username, adminUser.password);
        
        // STEP 2: Navigate to Invoice page
        const invoicePageFromNav = await homePage.navigateToInvoices();
        
        // STEP 3: Wait for invoice page to load
        await invoicePageFromNav.waitForInvoicePage();
        
        // STEP 4: Create the invoice using the existing method
        // This uses the hardcoded data in the InvoicePage class
        await invoicePageFromNav.createInvoiceToYourself();
        
        // STEP 5: Validate the invoice was created successfully
        await invoicePageFromNav.validateTotalAmount('R2800');
        
        console.log('✓ Test completed successfully!');
    });
});