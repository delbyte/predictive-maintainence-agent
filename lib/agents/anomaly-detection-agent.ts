import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Anomaly, CSVData, VehicleInfo, SensorData } from '@/lib/agents/types';
import { v4 as uuidv4 } from 'uuid';

const model = new ChatGoogleGenerativeAI({
    modelName: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.3,
});

export interface AnomalyDetectionResult {
    anomalies: Anomaly[];
    analysis: string;
}

/**
 * Anomaly Detection Agent - Analyzes vehicle data for potential issues
 */
export async function detectAnomalies(csvData: CSVData): Promise<AnomalyDetectionResult> {
    const vehicleInfo = csvData.vehicleInfo || [];

    if (vehicleInfo.length === 0) {
        return {
            anomalies: [],
            analysis: 'No vehicle data available for analysis',
        };
    }

    const prompt = `You are an expert automotive diagnostics AI. Analyze the following vehicle sensor data and identify any anomalies or potential maintenance issues.

For each vehicle, you have:
- Basic info (VIN, make, model, year, mileage)
- Sensor readings (engine temperature, oil pressure, brake wear, tire pressure, battery voltage, etc.)

Vehicle Data:
${JSON.stringify(vehicleInfo, null, 2)}

Instructions:
1. Analyze each vehicle's sensor data for anomalies
2. Compare readings against typical acceptable ranges
3. Identify severity levels: low, medium, high, critical
4. Provide specific recommendations

Return your analysis in the following JSON format:
{
  "anomalies": [
    {
      "vehicleId": "index or VIN",
      "vin": "VIN if available",
      "type": "specific issue type (e.g., 'High Engine Temperature', 'Low Oil Pressure')",
      "severity": "low|medium|high|critical",
      "description": "detailed description of the issue",
      "recommendation": "specific action to take",
      "affectedComponent": "component name"
    }
  ],
  "summary": "overall analysis summary"
}

Be thorough and precise. If no anomalies are detected, return an empty anomalies array.`;

    try {
        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response (handle markdown code blocks)
        let jsonContent = content;
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
        }

        const result = JSON.parse(jsonContent);

        // Add IDs and timestamps to anomalies
        const anomalies: Anomaly[] = result.anomalies.map((anomaly: any) => ({
            id: uuidv4(),
            vehicleId: anomaly.vehicleId || anomaly.vin || 'unknown',
            vin: anomaly.vin,
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.description,
            recommendation: anomaly.recommendation,
            affectedComponent: anomaly.affectedComponent,
            detectedAt: Date.now(),
        }));

        return {
            anomalies,
            analysis: result.summary || 'Analysis complete',
        };
    } catch (error) {
        console.error('Anomaly detection error:', error);
        return {
            anomalies: [],
            analysis: `Error during analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

/**
 * Get typical ranges for common sensor types (for reference)
 */
export const TYPICAL_SENSOR_RANGES = {
    engineTemp: { min: 195, max: 220, unit: '°F' },
    oilPressure: { min: 20, max: 60, unit: 'PSI' },
    brakeWear: { min: 0, max: 30, unit: '%' }, // 0% = new, 100% = completely worn
    tirePressure: { min: 30, max: 35, unit: 'PSI' },
    batteryVoltage: { min: 12.4, max: 12.8, unit: 'V' },
};
