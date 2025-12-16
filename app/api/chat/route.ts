import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/agents/chatbot-agent';
import { AgentMessage } from '@/lib/agents/types';

export const runtime = 'nodejs';

/**
 * API Route: /api/chat
 * Handles chatbot conversations
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory, anomalies, vehicleInfo } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Call chatbot agent
        const response = await chat(message, {
            conversationHistory: conversationHistory || [],
            anomalies: anomalies || [],
            vehicleInfo: vehicleInfo,
        });

        return NextResponse.json({
            success: true,
            response: response.message,
            intent: response.intent,
            extractedDate: response.extractedDate,
        });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Chat failed' },
            { status: 500 }
        );
    }
}
