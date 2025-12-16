import { StateGraph, END } from '@langchain/langgraph';
import { AgentState, AgentEvent, AgentLog } from '@/lib/agents/types';
import { analyzeCSV } from './csv-analysis-agent';
import { detectAnomalies } from './anomaly-detection-agent';
import { sendAnomalyNotifications } from './notification-agent';

/**
 * Master Agent - Coordinates all sub-agents using LangGraph
 * 
 * Workflow:
 * 1. CSV Analysis Agent - Parse and validate data
 * 2. Anomaly Detection Agent - Analyze for issues
 * 3. Notification Agent - Send alerts
 */

export class MasterAgent {
    private eventCallback?: (event: AgentEvent) => void;

    constructor(onEvent?: (event: AgentEvent) => void) {
        this.eventCallback = onEvent;
    }

    /**
     * Emit event to frontend for real-time visualization
     */
    private emitEvent(event: Omit<AgentEvent, 'timestamp'>) {
        const fullEvent: AgentEvent = {
            ...event,
            timestamp: Date.now(),
        };

        if (this.eventCallback) {
            this.eventCallback(fullEvent);
        }
    }

    /**
     * Execute the complete analysis workflow
     */
    async executeWorkflow(file: File, userEmail?: string): Promise<AgentState> {
        this.emitEvent({
            type: 'agent_started',
            agentType: 'master',
            message: 'Master agent initiated workflow',
            data: { fileName: file.name },
        });

        // Initialize state
        const state: AgentState = {
            messages: [],
            userEmail,
            currentAgent: 'master',
        };

        try {
            // Step 1: CSV Analysis
            this.emitEvent({
                type: 'agent_started',
                agentType: 'csv_analysis',
                message: 'Analyzing CSV file...',
            });

            const csvResult = await analyzeCSV(file);

            if (!csvResult.success || !csvResult.data) {
                state.error = csvResult.error || 'CSV analysis failed';
                this.emitEvent({
                    type: 'agent_failed',
                    agentType: 'csv_analysis',
                    message: state.error,
                });
                return state;
            }

            state.csvData = csvResult.data;

            this.emitEvent({
                type: 'agent_completed',
                agentType: 'csv_analysis',
                message: csvResult.summary || 'CSV analysis complete',
                data: { vehicleCount: csvResult.data.vehicleInfo?.length || 0 },
            });

            // Step 2: Anomaly Detection
            this.emitEvent({
                type: 'agent_started',
                agentType: 'anomaly_detection',
                message: 'Detecting anomalies in vehicle data...',
            });

            const anomalyResult = await detectAnomalies(csvResult.data);
            state.anomalies = anomalyResult.anomalies;

            this.emitEvent({
                type: 'agent_completed',
                agentType: 'anomaly_detection',
                message: anomalyResult.analysis,
                data: {
                    anomalyCount: anomalyResult.anomalies.length,
                    criticalCount: anomalyResult.anomalies.filter(a => a.severity === 'critical').length,
                },
            });

            // Step 3: Send Notifications (if anomalies found)
            if (anomalyResult.anomalies.length > 0 && (userEmail || csvResult.data.vehicleInfo?.some(v => v.ownerEmail))) {
                this.emitEvent({
                    type: 'agent_started',
                    agentType: 'notification',
                    message: 'Sending email notifications...',
                });

                const notificationResult = await sendAnomalyNotifications(
                    anomalyResult.anomalies,
                    csvResult.data.vehicleInfo || [],
                    userEmail
                );

                this.emitEvent({
                    type: notificationResult.success ? 'agent_completed' : 'agent_failed',
                    agentType: 'notification',
                    message: notificationResult.success
                        ? `Created ${notificationResult.notificationsCreated} notification(s)`
                        : `Failed to create notifications: ${notificationResult.errors?.join(', ')}`,
                    data: { notificationsCreated: notificationResult.notificationsCreated },
                });
            } else {
                this.emitEvent({
                    type: 'agent_completed',
                    agentType: 'notification',
                    message: 'No notifications needed - no anomalies detected',
                });
            }

            this.emitEvent({
                type: 'agent_completed',
                agentType: 'master',
                message: 'Workflow completed successfully',
                data: {
                    anomaliesFound: anomalyResult.anomalies.length,
                },
            });

            return state;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            state.error = errorMessage;

            this.emitEvent({
                type: 'agent_failed',
                agentType: 'master',
                message: `Workflow failed: ${errorMessage}`,
            });

            return state;
        }
    }
}

/**
 * Create and execute the master agent workflow
 */
export async function runMasterAgent(
    file: File,
    userEmail?: string,
    onEvent?: (event: AgentEvent) => void
): Promise<AgentState> {
    const master = new MasterAgent(onEvent);
    return master.executeWorkflow(file, userEmail);
}
