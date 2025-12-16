import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { CSVData, Anomaly, AgentEvent } from '@/lib/agents/types';
import { v4 as uuidv4 } from 'uuid';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.3,
});

export interface AnomalyDetectionResult {
    success: boolean;
    anomalies: Anomaly[];
    summary?: string;
    error?: string;
}

/**
 * Anomaly Detection Agent - Uses Gemini to analyze any CSV data for anomalies
 * NOW WITH REAL-TIME TOKEN STREAMING!
 */
export async function detectAnomalies(
    csvData: CSVData,
    onEvent?: (event: Omit<AgentEvent, 'timestamp'>) => void
): Promise<AnomalyDetectionResult> {
    try {
        // Convert CSV data to a format Gemini can analyze
        const dataPreview = csvData.rows.slice(0, 10).map(row => JSON.stringify(row)).join('\n');

        const prompt = `You are an expert data analyst. Analyze the following CSV data and identify any anomalies, issues, or patterns that might indicate problems.

CSV Headers: ${csvData.headers.join(', ')}

Sample Data (first 10 rows):
${dataPreview}

Total Rows: ${csvData.rows.length}

Instructions:
1. Analyze the data for any anomalies, unusual patterns, or potential issues
2. Identify severity: critical, high, medium, or low
3. Provide recommendations for each issue found

Respond in JSON format:
{
  "anomalies": [
    {
      "type": "Brief anomaly type",
      "severity": "critical|high|medium|low",
      "description": "Detailed description",
      "recommendation": "What to do about it",
      "affectedRows": "number or 'multiple'"
    }
  ],
  "summary": "Overall analysis summary"
}`;

        // Stream the response token-by-token
        let fullResponse = '';
        const stream = await model.stream(prompt);

        for await (const chunk of stream) {
            const token = chunk.content.toString();
            fullResponse += token;

            // Emit each token as it arrives
            if (onEvent) {
                onEvent({
                    type: 'agent_thinking',
                    agentType: 'anomaly_detection',
                    message: token,
                    data: { fullResponse }
                });
            }
        }

        // Extract JSON from response
        let jsonContent = fullResponse;
        const jsonMatch = fullResponse.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
        }

        const result = JSON.parse(jsonContent);

        // Convert to our Anomaly format
        const anomalies: Anomaly[] = (result.anomalies || []).map((a: any, index: number) => ({
            id: uuidv4(),
            vehicleId: `row-${index}`,
            type: a.type,
            severity: a.severity,
            description: a.description,
            recommendation: a.recommendation,
            detectedAt: Date.now(),
            affectedComponent: a.affectedRows || 'data',
        }));

        return {
            success: true,
            anomalies,
            summary: result.summary || `Found ${anomalies.length} potential issues`,
        };
    } catch (error) {
        console.error('Anomaly detection error:', error);
        return {
            success: false,
            anomalies: [],
            error: error instanceof Error ? error.message : 'Anomaly detection failed',
        };
    }
}
