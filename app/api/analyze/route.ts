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
            console.log('[API/analyze] Stream started');
            try {
                const formData = await request.formData();
                const file = formData.get('file') as File;
                const userEmail = formData.get('userEmail') as string;

                console.log('[API/analyze] Received file:', file?.name, 'size:', file?.size);
                console.log('[API/analyze] User email:', userEmail || 'none');

                if (!file) {
                    console.log('[API/analyze] ERROR: No file provided');
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'error',
                        message: 'No file provided'
                    })}\n\n`));
                    controller.close();
                    return;
                }

                console.log('[API/analyze] Processing file:', file.name, file.size);

                // Convert to proper File for Node.js
                const buffer = await file.arrayBuffer();
                const blob = new Blob([buffer], { type: file.type });
                const nodeFile = new File([blob], file.name, { type: file.type });

                console.log('[API/analyze] File converted, calling runMasterAgent...');

                // Stream events from master agent
                const result = await runMasterAgent(
                    nodeFile,
                    userEmail,
                    (event: AgentEvent) => {
                        console.log('[API/analyze] Agent event:', event.type, event.agentType);
                        // Send each event as SSE
                        controller.enqueue(encoder.encode(
                            `data: ${JSON.stringify({
                                type: 'agent_event',
                                event
                            })}\n\n`
                        ));
                    }
                );

                console.log('[API/analyze] Master agent completed, result:', result.error || 'success');

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
