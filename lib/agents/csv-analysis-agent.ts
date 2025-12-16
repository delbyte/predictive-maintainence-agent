import { parseCSVFile } from '@/lib/csv/parser';
import { CSVData } from '@/lib/agents/types';

export interface CSVAnalysisResult {
    success: boolean;
    data?: CSVData;
    error?: string;
    message?: string;
}

/**
 * CSV Analysis Agent - Parses CSV files (any format!)
 */
export async function analyzeCSV(file: File): Promise<CSVAnalysisResult> {
    try {
        const parseResult = await parseCSVFile(file);

        if (!parseResult.success || !parseResult.data) {
            return {
                success: false,
                error: parseResult.error || 'Failed to parse CSV file',
            };
        }

        const csvData = parseResult.data;

        console.log(`Parsed CSV with ${csvData.rows.length} rows and ${csvData.headers.length} columns`);

        return {
            success: true,
            data: csvData,
            message: `Successfully parsed ${csvData.rows.length} rows`,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'CSV analysis failed',
        };
    }
}
