'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AgentVisualizationProps {
    events: AgentEvent[];
}

const agentColors: Record<AgentType, string> = {
    master: '#8b5cf6',
    csv_analysis: '#3b82f6',
    anomaly_detection: '#f59e0b',
    notification: '#10b981',
    scheduling: '#ec4899',
    chatbot: '#6366f1',
};

const agentNames: Record<AgentType, string> = {
    master: 'Master Agent',
    csv_analysis: 'CSV Analysis',
    anomaly_detection: 'Anomaly Detection',
    notification: 'Notification',
    scheduling: 'Scheduling',
    chatbot: 'Chatbot',
};

export default function AgentVisualization({ events }: AgentVisualizationProps) {
    const [activeAgents, setActiveAgents] = useState<Set<AgentType>>(new Set());

    useEffect(() => {
        const active = new Set<AgentType>();
        events.forEach(event => {
            if (event.type === 'agent_started' || event.type === 'agent_progress') {
                active.add(event.agentType);
            }
        });
        setActiveAgents(active);
    }, [events]);

    const allAgents: AgentType[] = ['master', 'csv_analysis', 'anomaly_detection', 'notification'];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Workflow</h3>

            {/* Agent Flow Diagram */}
            <div className="flex items-center justify-between mb-8 relative">
                {allAgents.map((agentType, index) => (
                    <div key={agentType} className="flex items-center">
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: activeAgents.has(agentType) ? 1.1 : 1,
                                opacity: 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className={`
                  w-20 h-20 rounded-full flex items-center justify-center
                `}
                                style={{
                                    backgroundColor: agentColors[agentType] + '20',
                                    borderColor: agentColors[agentType],
                                    borderWidth: '2px',
                                    boxShadow: activeAgents.has(agentType) ? `0 0 0 4px ${agentColors[agentType]}40` : 'none',
                                }}
                            >
                                <span className="text-2xl">
                                    {agentType === 'master' && '🎯'}
                                    {agentType === 'csv_analysis' && '📊'}
                                    {agentType === 'anomaly_detection' && '🔍'}
                                    {agentType === 'notification' && '📧'}
                                </span>
                            </div>

                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700">
                                {agentNames[agentType]}
                            </div>

                            {activeAgents.has(agentType) && (
                                <motion.div
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                />
                            )}
                        </motion.div>

                        {index < allAgents.length - 1 && (
                            <div className="flex-1 h-0.5 bg-gray-300 mx-2">
                                <motion.div
                                    className="h-full"
                                    style={{ backgroundColor: agentColors[agentType] }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: activeAgents.has(allAgents[index + 1]) ? '100%' : '0%' }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Event Log */}
            <div className="mt-12 space-y-2 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Activity Log</h4>
                <AnimatePresence>
                    {events.slice().reverse().slice(0, 10).map((event, index) => (
                        <motion.div
                            key={event.timestamp + index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                            <div
                                className="w-2 h-2 rounded-full mt-1.5"
                                style={{ backgroundColor: agentColors[event.agentType] }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: agentColors[event.agentType] }}
                                    >
                                        {agentNames[event.agentType]}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-0.5">{event.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
