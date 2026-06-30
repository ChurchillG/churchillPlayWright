// src/helpers/csv-reader.ts

import fs from 'fs';
import { parse } from 'csv-parse/sync';

/**
 * Interface for CSV records
 * Each record is a key-value pair where:
 * - key: column header from the CSV file
 * - value: the cell data
 * 
 * @example
 * {
 *   username: 'admin',
 *   password: 'admin123',
 *   role: 'Administrator'
 * }
 */
export interface CsvRecord {
    [key: string]: string;
}

/**
 * Reads a CSV file and returns an array of objects
 * Each object represents a row in the CSV file
 * The column headers become the keys of each object
 * 
 * @param filePath - Path to the CSV file
 * @returns Array of CsvRecord objects
 * 
 * @example
 * // Read login data
 * const loginData = readCsv('src/test-data/login-data.csv');
 * // loginData[0] = { username: 'admin', password: 'admin123', role: 'Administrator' }
 * 
 * @example
 * // Use in a test
 * const data = readCsv('src/test-data/invoice-data.csv');
 * console.log(data[0].clientName);  // "Your Name Pty Ltd"
 * console.log(data[0].totalAmount); // "R2800"
 */
export function readCsv(filePath: string): CsvRecord[] {
    // Read the CSV file from the given path
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the CSV content into an array of objects
    return parse(fileContent, {
        columns: true,           // First row becomes column headers
        skip_empty_lines: true,  // Skip any empty lines in the file
        delimiter: ';'           // Semicolon delimiter (change to ',' if needed)
    });
}

/**
 * Reads a CSV file and returns a Map for easy lookup by a specific column
 * 
 * @param filePath - Path to the CSV file
 * @param keyColumn - The column name to use as the map key
 * @returns Map with the specified column as key and the row as value
 * 
 * @example
 * // Get login data as a Map keyed by username
 * const loginMap = readCsvAsMap('src/test-data/login-data.csv', 'username');
 * const adminData = loginMap.get('admin');
 * console.log(adminData.password); // 'admin123'
 */
export function readCsvAsMap(filePath: string, keyColumn: string): Map<string, CsvRecord> {
    const records = readCsv(filePath);
    const map = new Map<string, CsvRecord>();
    
    // Loop through each record and add to map
    records.forEach((record) => {
        if (record[keyColumn]) {
            map.set(record[keyColumn], record);
        }
    });
    
    return map;
}