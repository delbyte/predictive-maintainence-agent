'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

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
    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest event
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    const agents = Object.keys(agentNames).map(id => {
        const agentEvents = events.filter(e => e.agentType === id);
        const lastEvent = agentEvents[agentEvents.length - 1];

        return {
            id: id as AgentType,
            name: agentNames[id as AgentType],
            status: lastEvent?.type === 'agent_completed' ? 'completed' :
                lastEvent?.type === 'agent_failed' ? 'failed' :
                    lastEvent?.type === 'agent_started' ? 'active' : 'pending'
        };
    });

    const currentAgent = events.length > 0 ? events[events.length - 1].agentType : null;

    return (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Agent Workflow</h2>

            {/* Agent Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                {agents.map((agent) => (
                    <motion.div
                        key={agent.id}
                        className={`p-3 rounded-lg border-2 transition-all ${agent.id === currentAgent
                            ? 'border-blue-500 bg-blue-50'
                            : agent.status === 'completed'
                                ? 'border-green-500 bg-green-50'
                                : agent.status === 'failed'
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                        animate={{
                            scale: agent.id === currentAgent ? 1.05 : 1,
                            boxShadow: agent.id === currentAgent
                                ? '0 0 20px rgba(59, 130, 246, 0.5)'
                                : '0 0 0 rgba(0, 0, 0, 0)',
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-xs font-medium text-gray-700">{agent.name}</div>
                        <div className="flex items-center mt-1">
                            {agent.status === 'pending' && (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            )}
                            {agent.status === 'active' && (
                                <motion.div
                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                />
                            )}
                            {agent.status === 'completed' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                            {agent.status === 'failed' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                            <span className="text-xs text-gray-600 ml-2 capitalize">
                                {agent.status}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Event Log - Auto-scrolling with Thinking Bubble */}
            <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
                <AnimatePresence>
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`mb-2 text-sm ${event.type === 'agent_thinking' ? 'font-normal' : 'font-mono'
                                } ${event.type === 'agent_failed' ? 'text-red-400' :
                                    event.type === 'agent_completed' ? 'text-green-400' :
                                        event.type === 'agent_started' ? 'text-blue-400' :
                                            event.type === 'agent_thinking' ? 'text-yellow-300' :
                                                'text-gray-400'
                                }`}
                        >
                            {event.type === 'agent_thinking' ? (
                                <span className="inline">{event.message}</span>
                            ) : (
                                <>
                                    <span className="text-gray-500">
                                        [{new Date(event.timestamp).toLocaleTimeString()}]
                                    </span>{' '}
                                    <span className="font-semibold">{event.agentType}:</span> {event.message}
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {/* Auto-scroll anchor */}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}
