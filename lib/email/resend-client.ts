import { Resend } from 'resend';
import { Anomaly } from '@/lib/agents/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailParams {
    to: string;
    subject: string;
    html: string;
    attachments?: {
        filename: string;
        content: string | Buffer;
    }[];
}

/**
 * Send email via Resend
 */
export async function sendEmail(params: EmailParams): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
            to: params.to,
            subject: params.subject,
            html: params.html,
            attachments: params.attachments,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}

/**
 * Generate HTML email template for anomaly notification
 */
export function generateAnomalyEmailHTML(anomalies: Anomaly[], vehicleInfo?: any): string {
    const severityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#dc2626';
            case 'high': return '#ea580c';
            case 'medium': return '#f59e0b';
            case 'low': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const anomalyRows = anomalies.map(anomaly => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px;">
        <div style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${severityColor(anomaly.severity)}; margin-right: 8px;"></span>
          <strong>${anomaly.type}</strong>
        </div>
      </td>
      <td style="padding: 12px;">${anomaly.severity.toUpperCase()}</td>
      <td style="padding: 12px;">${anomaly.description}</td>
      <td style="padding: 12px;">${anomaly.recommendation}</td>
    </tr>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: #111827; margin-top: 0;">⚠️ Vehicle Maintenance Alert</h1>
          
          ${vehicleInfo ? `
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
              <h3 style="margin-top: 0; color: #374151;">Vehicle Information</h3>
              <p style="margin: 4px 0;"><strong>VIN:</strong> ${vehicleInfo.vin || 'N/A'}</p>
              <p style="margin: 4px 0;"><strong>Make/Model:</strong> ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}</p>
              <p style="margin: 4px 0;"><strong>Year:</strong> ${vehicleInfo.year || 'N/A'}</p>
              <p style="margin: 4px 0;"><strong>Mileage:</strong> ${vehicleInfo.mileage || 'N/A'}</p>
            </div>
          ` : ''}

          <p style="color: #374151; line-height: 1.6;">
            Our predictive maintenance system has detected the following anomalies that require your attention:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Issue</th>
                <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Severity</th>
                <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Description</th>
                <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${anomalyRows}
            </tbody>
          </table>

          <div style="background-color: #eff6ff; padding: 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-top: 24px;">
            <p style="margin: 0; color: #1e40af; font-weight: 500;">
              📅 Schedule a maintenance appointment to address these issues.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 24px; text-align: center;">
            This is an automated notification from your Predictive Maintenance System.
          </p>
        </div>
      </body>
    </html>
  `;
}
