import { NextRequest, NextResponse } from 'next/server';
import { scheduleAppointment } from '@/lib/agents/scheduling-agent';

export const runtime = 'nodejs';

/**
 * API Route: /api/schedule
 * Handles appointment scheduling
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { preferredDate, anomalies, userEmail, vehicleInfo } = body;

        if (!preferredDate || !userEmail) {
            return NextResponse.json(
                { error: 'Preferred date and email are required' },
                { status: 400 }
            );
        }

        if (!anomalies || anomalies.length === 0) {
            return NextResponse.json(
                { error: 'No anomalies to schedule appointment for' },
                { status: 400 }
            );
        }

        // Call scheduling agent
        const result = await scheduleAppointment(
            preferredDate,
            anomalies,
            userEmail,
            vehicleInfo
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            appointmentDate: result.appointmentDate,
            message: result.message,
        });

    } catch (error) {
        console.error('Scheduling error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Scheduling failed' },
            { status: 500 }
        );
    }
}
