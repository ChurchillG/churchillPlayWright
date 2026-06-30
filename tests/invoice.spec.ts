// tests/invoice.spec.ts

import { test, expect } from '../src/fixtures/test-fixtures.js';
import { 
    readCsv,           // ✅ Exists - reads CSV as CsvRecord[]
    readCsvAsMap,      // ✅ Exists - reads CSV as Map
    csvRecordToType,   // ✅ Exists - converts one record to type
    readCsvAsType      // ✅ Exists - reads CSV as typed array
} from '../src/helpers/csv-reader.js';
import { InvoiceData } from '../src/pages/InvoicePage.js';

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
        
        // ============ METHOD 1: Using readCsvAsType (Recommended) ============
        
        // Get login data - automatically typed as LoginCredentials[]
        const loginData = readCsvAsType<LoginCredentials>('src/test-data/login-data.csv');
        const adminUser = loginData[0];
        console.log(`Username: ${adminUser.username}`); // TypeScript knows this!
        console.log(`Password: ${adminUser.password}`); // TypeScript knows this!
        
        // Get invoice data - automatically typed as InvoiceData[]
        const invoices = readCsvAsType<InvoiceData>('src/test-data/invoice-data.csv');
        const firstInvoice = invoices[0];
        console.log(`Client: ${firstInvoice.clientName}`);   // TypeScript knows this!
        console.log(`Amount: ${firstInvoice.totalAmount}`);  // TypeScript knows this!
        
        // ============ METHOD 2: Using readCsv + csvRecordToType ============
        
        // Read as generic CsvRecord first
        const rawData = readCsv('src/test-data/login-data.csv');
        
        // Then convert to typed object
        const adminLogin = csvRecordToType<LoginCredentials>(rawData[0]);
        console.log(`Role: ${adminLogin.role}`); // TypeScript knows this!
        
        // ============ METHOD 3: Using readCsvAsMap ============
        
        // Get as Map for quick lookup by username
        const loginMap = readCsvAsMap('src/test-data/login-data.csv', 'username');
        const admin = loginMap.get('admin');
        if (admin) {
            console.log(`Password: ${admin.password}`); // Still works but as CsvRecord
        }
        
        // ============ EXECUTE THE TEST ============
        
        // Login with admin credentials from CSV
        await loginPage.goto();
        await loginPage.loginAsAdmin(adminUser.username, adminUser.password);
        
        // Navigate to admin panel and invoices
        await homePage.navigateToAdminPanel();
        const invoicePageFromNav = await homePage.navigateToInvoices();
        await invoicePageFromNav.waitForInvoicePage();
        
        // Create invoice using data from CSV
        await invoicePageFromNav.clickCreateInvoice();
        await invoicePageFromNav.createCompleteInvoice(firstInvoice);
        
        // Validate
        await invoicePageFromNav.validateTotalAmount('R2800');
    });
});