import fs from 'fs';

/**
 * Interface for CSV records
 * Each record is a key-value pair where:
 * - key: column header from the CSV file
 * - value: the cell data
 */
export interface CsvRecord {
    [key: string]: string;
}

/**
 * Internal CSV parser
 * Parses CSV content string into an array of objects
 */
function parseCSV(csvContent: string, delimiter: string = ';'): CsvRecord[] {
    const lines = csvContent.trim().split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    
    if (nonEmptyLines.length === 0) {
        return [];
    }
    
    const headers = nonEmptyLines[0].split(delimiter).map(header => header.trim());
    const records: CsvRecord[] = [];
    
    for (let i = 1; i < nonEmptyLines.length; i++) {
        const values = nonEmptyLines[i].split(delimiter).map(value => value.trim());
        const record: CsvRecord = {};
        
        headers.forEach((header, index) => {
            record[header] = values[index] || '';
        });
        
        records.push(record);
    }
    
    return records;
}

/**
 * Reads a CSV file and returns an array of CsvRecord objects
 * 
 * @param filePath - Path to the CSV file
 * @param delimiter - CSV delimiter character (default: ';')
 * @returns Array of CsvRecord objects
 * 
 * @example
 * const data = readCsv('src/test-data/login-data.csv');
 * console.log(data[0].username); // 'admin'
 */
export function readCsv(filePath: string, delimiter: string = ';'): CsvRecord[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parseCSV(fileContent, delimiter);
}

/**
 * Reads a CSV file and returns a Map for easy lookup
 * 
 * @param filePath - Path to the CSV file
 * @param keyColumn - The column name to use as the map key
 * @param delimiter - CSV delimiter character (default: ';')
 * @returns Map with specified column as key and row object as value
 * 
 * @example
 * const loginMap = readCsvAsMap('src/test-data/login-data.csv', 'username');
 * const adminData = loginMap.get('admin');
 * console.log(adminData.password); // 'admin123'
 */
export function readCsvAsMap(
    filePath: string, 
    keyColumn: string, 
    delimiter: string = ';'
): Map<string, CsvRecord> {
    const records = readCsv(filePath, delimiter);
    const map = new Map<string, CsvRecord>();
    
    records.forEach((record) => {
        if (record[keyColumn]) {
            map.set(record[keyColumn], record);
        }
    });
    
    return map;
}

/**
 * Converts a CsvRecord to a typed object
 * This bridges the gap between dynamic CSV data and typed TypeScript interfaces
 * 
 * @param record - The CSV record to convert
 * @returns The record cast to type T
 * 
 * @example
 * const csvData = readCsv('data.csv');
 * const invoiceData = csvRecordToType<InvoiceData>(csvData[0]);
 * // Now TypeScript recognizes invoiceData.clientName, etc.
 */
export function csvRecordToType<T>(record: CsvRecord): T {
    return record as unknown as T;
}

/**
 * Reads CSV and automatically converts to the specified type
 * This is the easiest way to get typed data from CSV files
 * 
 * @param filePath - Path to the CSV file
 * @param delimiter - CSV delimiter character (default: ';')
 * @returns Array of typed objects
 * 
 * @example
 * interface InvoiceData {
 *     clientName: string;
 *     totalAmount: string;
 * }
 * 
 * const invoices = readCsvAsType<InvoiceData>('src/test-data/invoice-data.csv');
 * console.log(invoices[0].clientName); // TypeScript knows this exists!
 */
export function readCsvAsType<T>(filePath: string, delimiter: string = ';'): T[] {
    const records = readCsv(filePath, delimiter);
    return records.map(record => csvRecordToType<T>(record));
}