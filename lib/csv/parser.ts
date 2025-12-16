import Papa from 'papaparse';
import { CSVData, VehicleInfo, SensorData } from '@/lib/agents/types';

export interface ParsedCSVResult {
    success: boolean;
    data?: CSVData;
    error?: string;
}

/**
 * Parse CSV file and extract automobile data
 */
export async function parseCSVFile(file: File): Promise<ParsedCSVResult> {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                try {
                    const headers = results.meta.fields || [];
                    const rows = results.data as Record<string, any>[];

                    if (rows.length === 0) {
                        resolve({
                            success: false,
                            error: 'CSV file is empty',
                        });
                        return;
                    }

                    // Extract vehicle information from CSV
                    const vehicleInfo: VehicleInfo[] = rows.map((row, index) => {
                        return extractVehicleInfo(row, index);
                    });

                    resolve({
                        success: true,
                        data: {
                            headers,
                            rows,
                            vehicleInfo,
                        },
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error instanceof Error ? error.message : 'Failed to parse CSV',
                    });
                }
            },
            error: (error) => {
                resolve({
                    success: false,
                    error: error.message,
                });
            },
        });
    });
}

/**
 * Extract vehicle information from a CSV row
 * Handles various common column name variations
 */
function extractVehicleInfo(row: Record<string, any>, index: number): VehicleInfo {
    // Common column name variations
    const getValue = (keys: string[]): any => {
        for (const key of keys) {
            const exactMatch = row[key];
            if (exactMatch !== undefined && exactMatch !== null) return exactMatch;

            // Case-insensitive match
            const lowerKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
            if (lowerKey && row[lowerKey] !== undefined && row[lowerKey] !== null) {
                return row[lowerKey];
            }
        }
        return undefined;
    };

    // Extract sensor data from remaining columns
    const sensorData: SensorData = {};
    const knownFields = ['vin', 'make', 'model', 'year', 'mileage', 'owner_name', 'owner_email', 'owner_phone', 'ownername', 'owneremail', 'ownerphone'];

    for (const [key, value] of Object.entries(row)) {
        if (!knownFields.includes(key.toLowerCase()) && value !== null && value !== undefined) {
            sensorData[key] = value;
        }
    }

    return {
        vin: getValue(['vin', 'VIN', 'vehicle_id', 'vehicleId']),
        make: getValue(['make', 'Make', 'manufacturer', 'brand']),
        model: getValue(['model', 'Model']),
        year: getValue(['year', 'Year', 'model_year']),
        mileage: getValue(['mileage', 'Mileage', 'miles', 'odometer']),
        ownerName: getValue(['owner_name', 'ownerName', 'owner', 'name']),
        ownerEmail: getValue(['owner_email', 'ownerEmail', 'email']),
        ownerPhone: getValue(['owner_phone', 'ownerPhone', 'phone', 'contact']),
        sensorData: Object.keys(sensorData).length > 0 ? sensorData : undefined,
    };
}

/**
 * Validate if CSV contains required fields for automobile data
 */
export function validateAutomobileCSV(data: CSVData): {
    valid: boolean;
    missingFields?: string[];
} {
    const headers = data.headers.map(h => h.toLowerCase());

    // At least one of these should be present
    const hasVehicleId = headers.some(h =>
        ['vin', 'vehicle_id', 'vehicleid'].includes(h)
    );

    // Should have some sensor/metrics data
    const hasSensorData = headers.length > 3; // More than just basic info

    if (!hasVehicleId) {
        return {
            valid: false,
            missingFields: ['VIN or Vehicle ID'],
        };
    }

    if (!hasSensorData) {
        return {
            valid: false,
            missingFields: ['Sensor/metrics data columns'],
        };
    }

    return { valid: true };
}
