import { CSVData } from '@/lib/agents/types';
import { parseCSVFile, validateAutomobileCSV } from '@/lib/csv/parser';

export interface CSVAnalysisResult {
    success: boolean;
    data?: CSVData;
    validation?: {
        valid: boolean;
        missingFields?: string[];
    };
    error?: string;
    summary?: string;
}

/**
 * CSV Analysis Agent - Parses and validates CSV files
 */
export async function analyzeCSV(file: File): Promise<CSVAnalysisResult> {
    try {
        // Parse the CSV file
        const parseResult = await parseCSVFile(file);

        if (!parseResult.success || !parseResult.data) {
            return {
                success: false,
                error: parseResult.error || 'Failed to parse CSV file',
            };
        }

        const csvData = parseResult.data;

        // Validate automobile data
        const validation = validateAutomobileCSV(csvData);

        if (!validation.valid) {
            return {
                success: false,
                validation,
                error: `Invalid CSV format. Missing required fields: ${validation.missingFields?.join(', ')}`,
            };
        }

        // Generate summary
        const summary = generateDataSummary(csvData);

        return {
            success: true,
            data: csvData,
            validation,
            summary,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during CSV analysis',
        };
    }
}

/**
 * Generate a summary of the CSV data
 */
function generateDataSummary(data: CSVData): string {
    const vehicleCount = data.vehicleInfo?.length || 0;
    const columnCount = data.headers.length;

    const makes = new Set(data.vehicleInfo?.map(v => v.make).filter(Boolean));
    const years = data.vehicleInfo?.map(v => v.year).filter(Boolean);
    const avgYear = years && years.length > 0
        ? Math.round(years.reduce((a, b) => a! + b!, 0)! / years.length)
        : null;

    let summary = `CSV Analysis Summary:\n`;
    summary += `- Total vehicles: ${vehicleCount}\n`;
    summary += `- Total columns: ${columnCount}\n`;
    summary += `- Vehicle makes: ${makes.size > 0 ? Array.from(makes).join(', ') : 'N/A'}\n`;
    summary += `- Average year: ${avgYear || 'N/A'}\n`;
    summary += `- Data columns: ${data.headers.slice(0, 10).join(', ')}${data.headers.length > 10 ? '...' : ''}`;

    return summary;
}
