import { NextRequest, NextResponse } from 'next/server';
import { runMasterAgent } from '@/lib/agents/master-agent';
import { AgentEvent } from '@/lib/agents/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * API Route: /api/analyze
 * Analyzes uploaded CSV file using the master agent workflow
 */
export async function POST(request: NextRequest) {
    const events: AgentEvent[] = [];

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userEmail = formData.get('userEmail') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        console.log('Processing file:', file.name, file.size);

        // Convert to proper File for Node.js
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer], { type: file.type });
        const nodeFile = new File([blob], file.name, { type: file.type });

        // Run master agent
        const result = await runMasterAgent(
            nodeFile,
            userEmail,
            (event) => {
                events.push(event);
                console.log('Agent event:', event.type, event.agentType, event.message);
            }
        );

        const anomalyCount = result.anomalies?.length || 0;
        const criticalCount = result.anomalies?.filter(a => a.severity === 'critical').length || 0;

        return NextResponse.json({
            success: !result.error,
            state: result,
            events,
            anomalyCount,
            criticalCount,
            message: result.error || `Analyzed ${anomalyCount} anomalies (${criticalCount} critical)`,
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Analysis failed',
                state: { error: error instanceof Error ? error.message : 'Unknown error' },
                events,
                anomalyCount: 0,
                criticalCount: 0,
            },
            { status: 500 }
        );
    }
}
