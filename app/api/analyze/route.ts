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
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userEmail = formData.get('userEmail') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload a CSV file.' },
                { status: 400 }
            );
        }

        // Store events for streaming response
        const events: AgentEvent[] = [];

        // Execute master agent workflow
        const result = await runMasterAgent(
            file,
            userEmail || undefined,
            (event) => {
                events.push(event);
            }
        );

        return NextResponse.json({
            success: !result.error,
            state: result,
            events,
            anomalyCount: result.anomalies?.length || 0,
            criticalCount: result.anomalies?.filter(a => a.severity === 'critical').length || 0,
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Analysis failed' },
            { status: 500 }
        );
    }
}
