import ics from 'ics';
import { format } from 'date-fns';

export interface AppointmentDetails {
    title: string;
    description: string;
    location?: string;
    startDate: Date;
    durationMinutes?: number;
    attendeeEmail?: string;
}

/**
 * Generate ICS calendar file for maintenance appointment
 */
export function generateICSFile(details: AppointmentDetails): { success: boolean; data?: string; error?: string } {
    try {
        const start = details.startDate;
        const duration = details.durationMinutes || 60;

        const event: ics.EventAttributes = {
            start: [
                start.getFullYear(),
                start.getMonth() + 1,
                start.getDate(),
                start.getHours(),
                start.getMinutes(),
            ],
            duration: { minutes: duration },
            title: details.title,
            description: details.description,
            location: details.location || 'TBD',
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: 'Predictive Maintenance System', email: process.env.RESEND_FROM_EMAIL || 'noreply@example.com' },
            attendees: details.attendeeEmail ? [{ name: 'Vehicle Owner', email: details.attendeeEmail }] : [],
        };

        const { error, value } = ics.createEvent(event);

        if (error) {
            return { success: false, error: error.message || 'Failed to create ICS file' };
        }

        return { success: true, data: value };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate calendar file',
        };
    }
}

/**
 * Format appointment details as human-readable text
 */
export function formatAppointmentText(details: AppointmentDetails): string {
    return `
Appointment Scheduled:
- Date/Time: ${format(details.startDate, 'PPPP \'at\' p')}
- Duration: ${details.durationMinutes || 60} minutes
- Location: ${details.location || 'TBD'}
- Purpose: ${details.title}

${details.description}
  `.trim();
}
