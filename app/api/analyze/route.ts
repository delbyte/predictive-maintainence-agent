import { NextRequest } from 'next/server';
import { runMasterAgent } from '@/lib/agents/master-agent';
import { AgentEvent } from '@/lib/agents/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * API Route: /api/analyze (Streaming)
 * Streams real-time agent workflow events using Server-Sent Events
 */
export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const formData = await request.formData();
                const file = formData.get('file') as File;
                const userEmail = formData.get('userEmail') as string;

                if (!file) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'error',
                        message: 'No file provided'
                    })}\n\n`));
                    controller.close();
                    return;
                }

                // Convert to proper File for Node.js
                const buffer = await file.arrayBuffer();
                const blob = new Blob([buffer], { type: file.type });
                const nodeFile = new File([blob], file.name, { type: file.type });

                // Stream events from master agent
                const result = await runMasterAgent(
                    nodeFile,
                    userEmail,
                    (event: AgentEvent) => {
                        // Send each event as SSE
                        controller.enqueue(encoder.encode(
                            `data: ${JSON.stringify({
                                type: 'agent_event',
                                event
                            })}\n\n`
                        ));
                    }
                );

                // Send final result
                const anomalyCount = result.anomalies?.length || 0;
                const criticalCount = result.anomalies?.filter(a => a.severity === 'critical').length || 0;

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'complete',
                    success: !result.error,
                    state: result,
                    anomalyCount,
                    criticalCount,
                    message: result.error || `Analyzed ${anomalyCount} anomalies (${criticalCount} critical)`,
                })}\n\n`));

                controller.close();

            } catch (error) {
                console.error('Analysis error:', error);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Analysis failed'
                })}\n\n`));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
