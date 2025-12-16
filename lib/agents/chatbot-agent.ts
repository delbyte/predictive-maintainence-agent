import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Anomaly, AgentMessage } from '@/lib/agents/types';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.7,
});

export interface ChatContext {
    anomalies?: Anomaly[];
    vehicleInfo?: any;
    conversationHistory: AgentMessage[];
}

export interface ChatResponse {
    message: string;
    intent?: 'question' | 'schedule_request' | 'general';
    extractedDate?: string;
}

/**
 * Chatbot Agent - Handles natural language conversations with users
 */
export async function chat(userMessage: string, context: ChatContext): Promise<ChatResponse> {
    try {
        // Build context for the chatbot
        const systemContext = buildSystemContext(context);

        // Build conversation history
        const conversationHistory = context.conversationHistory
            .slice(-10) // Keep last 10 messages
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content} `)
            .join('\n');

        const prompt = `You are a helpful automotive assistant for a predictive maintenance system.Your role is to:
1. Explain detected vehicle issues in simple, clear language
2. Answer questions about the anomalies and recommendations
3. Help users schedule maintenance appointments
4. Provide general automotive advice

${systemContext}

Conversation History:
${conversationHistory || 'No previous conversation'}

User: ${userMessage}

Instructions:
- Be friendly, clear, and concise
    - Explain technical terms when necessary
        - If the user wants to schedule an appointment, ask for their preferred date / time
            - If they provide a date, acknowledge it and confirm

Respond in JSON format:
{
    "message": "your response to the user",
        "intent": "question|schedule_request|general",
            "extractedDate": "ISO date string if user mentioned a specific date, otherwise null"
} `;

        const response = await model.invoke(prompt);
        const content = response.content.toString();

        // Extract JSON from response
        let jsonContent = content;
        const jsonMatch = content.match(/```json\n ? ([\s\S] *?) \n ? ```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
        }

        const result = JSON.parse(jsonContent);

        return {
            message: result.message,
            intent: result.intent || 'general',
            extractedDate: result.extractedDate,
        };
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
