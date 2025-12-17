import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { CSVData, Anomaly, AgentEvent, AnomalyDetectionResult } from '@/lib/agents/types';
import { v4 as uuidv4 } from 'uuid';

// Timeout for the entire streaming operation (45 seconds)
const STREAM_TIMEOUT_MS = 45000;

/**
 * Create model instance lazily to ensure API key is available at runtime
 */
function createModel() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    console.log('[AnomalyAgent] Creating model instance...');
    console.log('[AnomalyAgent] API Key present:', !!apiKey);
    console.log('[AnomalyAgent] API Key length:', apiKey?.length || 0);

    if (!apiKey) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    }

    return new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey,
        temperature: 0.3,
    });
}

/**
 * Anomaly Detection Agent - Uses Gemini to analyze any CSV data for anomalies
 * NOW WITH REAL-TIME TOKEN STREAMING!
 */
export async function detectAnomalies(
    csvData: CSVData,
    onEvent?: (event: Omit<AgentEvent, 'timestamp'>) => void
): Promise<AnomalyDetectionResult> {
    console.log('[AnomalyAgent] Starting anomaly detection...');
    console.log('[AnomalyAgent] CSV rows:', csvData.rows.length);
    console.log('[AnomalyAgent] CSV headers:', csvData.headers);

    try {
        // Create model lazily
        const model = createModel();
        console.log('[AnomalyAgent] Model created successfully');

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

        console.log('[AnomalyAgent] Prompt prepared, starting stream...');

        // Wrap streaming in a timeout
        const streamWithTimeout = async (): Promise<string> => {
            let fullResponse = '';

            console.log('[AnomalyAgent] Calling model.stream()...');
            const stream = await model.stream(prompt);
            console.log('[AnomalyAgent] Stream obtained, iterating...');

            for await (const chunk of stream) {
                const token = chunk.content.toString();
                fullResponse += token;
                console.log('[AnomalyAgent] Received token:', token.substring(0, 50));

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

            console.log('[AnomalyAgent] Stream complete. Total response length:', fullResponse.length);
            return fullResponse;
        };

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Streaming timeout after ${STREAM_TIMEOUT_MS / 1000} seconds`));
            }, STREAM_TIMEOUT_MS);
        });

        // Race between streaming and timeout
        const fullResponse = await Promise.race([streamWithTimeout(), timeoutPromise]);

        console.log('[AnomalyAgent] Parsing response...');

        // Extract JSON from response
        let jsonContent = fullResponse;
        const jsonMatch = fullResponse.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
            console.log('[AnomalyAgent] Extracted JSON from code block');
        }

        const result = JSON.parse(jsonContent);
        console.log('[AnomalyAgent] JSON parsed successfully');

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

        console.log('[AnomalyAgent] Detected', anomalies.length, 'anomalies');

        return {
            success: true,
            anomalies,
            summary: result.summary || `Found ${anomalies.length} potential issues`,
        };
    } catch (error) {
        console.error('[AnomalyAgent] ERROR:', error);
        console.error('[AnomalyAgent] Error name:', (error as Error)?.name);
        console.error('[AnomalyAgent] Error message:', (error as Error)?.message);
        console.error('[AnomalyAgent] Error stack:', (error as Error)?.stack);

        return {
            success: false,
            anomalies: [],
            error: error instanceof Error ? error.message : 'Anomaly detection failed',
        };
    }
}
