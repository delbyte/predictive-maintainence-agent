import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Anomaly, AgentMessage } from '@/lib/agents/types';

/**
 * Create model instance lazily to ensure API key is available at runtime
 */
function createModel() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    }

    return new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey,
        temperature: 0.7,
    });
}

export interface ChatContext {
    anomalies?: Anomaly[];
    vehicleInfo?: any;
    conversationHistory: AgentMessage[];
}

export interface ChatResponse {
    message: string;
    intent: 'scheduling' | 'schedule_request' | 'question' | 'general' | 'status';
    extractedDate?: string;
    response?: string;  // For fallback
    suggestedActions?: string[];  // For recommendations
}

/**
 * Chatbot Agent - Handles natural language conversations with users
 */
export async function chat(userMessage: string, context: ChatContext): Promise<ChatResponse> {
    try {
        const model = createModel();
        // Build context for the chatbot
        const systemContext = buildSystemContext(context);

        // Build conversation history
        const conversationHistory = context.conversationHistory
            .slice(-10) // Keep last 10 messages
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content} `)
            .join('\n');

        const prompt = `You are a helpful automotive assistant for a predictive maintenance system. Your role is to:
1. Explain detected vehicle issues in simple, clear language
2. Answer questions about the anomalies and recommendations
3. Help users schedule maintenance appointments
4. Provide general automotive advice

${systemContext}

Current Date: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
ZEIT: ${new Date().toISOString()}

Conversation History:
${conversationHistory || 'No previous conversation'}

User: ${userMessage}

Instructions:
- Be friendly, clear, and concise.
- Explain technical terms when necessary.
- CRITICAL: If the user has anomalies (especially High/Critical severity), YOU MUST STRONGLY ADVISE scheduling maintenance.
- Proactively ASK: "Would you like to schedule a service appointment? I can book that for you now."
- If the user agrees and provides a date, extract it in the JSON response.

Respond in JSON format:
{
    "message": "your response to the user",
    "intent": "question|schedule_request|general",
    "extractedDate": "ISO date string if user mentioned a specific date, otherwise null"
} `;

        // Timeout wrapper to prevent hanging
        const CHAT_TIMEOUT_MS = 30000;

        const invokeWithTimeout = async (): Promise<string> => {
            const response = await model.invoke(prompt);
            return response.content.toString();
        };

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Chat timeout after ${CHAT_TIMEOUT_MS / 1000} seconds`));
            }, CHAT_TIMEOUT_MS);
        });

        const content = await Promise.race([invokeWithTimeout(), timeoutPromise]);


        // Extract JSON from response (handle markdown code blocks)
        let jsonContent = content;
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
        } else {
            // Try to find JSON object directly
            const jsonObjMatch = content.match(/\{[\s\S]*\}/);
            if (jsonObjMatch) {
                jsonContent = jsonObjMatch[0];
            }
        }

        try {
            const result = JSON.parse(jsonContent);


            // The requested change implies a different return structure,
            // mapping to the existing ChatResponse interface as best as possible.
            return {
                message: result.response || result.message || content, // Prioritize 'response', then 'message', then raw content
                intent: result.intent || 'general',
                extractedDate: result.extractedDate,
                response: result.response || content, // New field
                suggestedActions: result.suggestedActions || [], // New field
            };
        } catch (error) {
            console.error('Failed to parse chatbot JSON, using raw content:', error);
            // Fallback to raw content if JSON parsing fails
            return {
                message: content,
                intent: 'general', // Default intent on error
                response: content,
                suggestedActions: [],
            };
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        return {
            message: "I apologize, but I encountered an error processing your message. Could you please rephrase that?",
            intent: 'general',
        };
    }
}

/**
 * Build system context from anomalies and vehicle info
 */
function buildSystemContext(context: ChatContext): string {
    let systemContext = '';

    if (context.anomalies && context.anomalies.length > 0) {
        systemContext += `\nDetected Anomalies: \n`;
        context.anomalies.forEach(anomaly => {
            systemContext += `- ${anomaly.type} (${anomaly.severity} severity): ${anomaly.description} \n`;
            systemContext += `  Recommendation: ${anomaly.recommendation} \n`;
        });
    }

    if (context.vehicleInfo) {
        systemContext += `\nVehicle Information: \n`;
        systemContext += `- VIN: ${context.vehicleInfo.vin || 'N/A'} \n`;
        systemContext += `- Make / Model: ${context.vehicleInfo.make || ''} ${context.vehicleInfo.model || ''} \n`;
        systemContext += `- Year: ${context.vehicleInfo.year || 'N/A'} \n`;
        systemContext += `- Mileage: ${context.vehicleInfo.mileage || 'N/A'} \n`;
    }

    return systemContext || 'No anomalies detected yet.';
}
