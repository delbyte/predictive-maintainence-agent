'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AgentVisualizationProps {
    events: AgentEvent[];
}

const agentConfig: Record<AgentType, { name: string; color: string; icon: string; description: string }> = {
    master: { name: 'Master Control', color: '#8b5cf6', icon: '🧠', description: 'Orchestrator' },
    csv_analysis: { name: 'Data Analyst', color: '#3b82f6', icon: '📊', description: 'Parser & Validator' },
    anomaly_detection: { name: 'Anomaly Detector', color: '#f59e0b', icon: '🔍', description: 'Gemini AI Analysis' },
    notification: { name: 'Notifier', color: '#10b981', icon: '📡', description: 'Alert Dispatch' },
    scheduling: { name: 'Scheduler', color: '#ec4899', icon: '📅', description: 'Calendar Manager' },
    chatbot: { name: 'Assistant', color: '#6366f1', icon: '🤖', description: 'User Interface' },
};

// Layout configuration
const positions = {
    master: { x: 50, y: 15 },
    csv_analysis: { x: 15, y: 65 },
    anomaly_detection: { x: 32, y: 65 },
    notification: { x: 50, y: 65 },
    scheduling: { x: 68, y: 65 },
    chatbot: { x: 85, y: 65 },
};

export default function AgentVisualization({ events }: AgentVisualizationProps) {
    const logEndRef = useRef<HTMLDivElement>(null);
    const [activeAgent, setActiveAgent] = useState<AgentType | 'idle'>('idle');
    const [packet, setPacket] = useState<{ from: AgentType, to: AgentType, type: 'request' | 'response' } | null>(null);

    // Auto-scroll log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    // Handle Animation Logic based on latest event
    useEffect(() => {
        if (events.length === 0) return;
        const lastEvent = events[events.length - 1];

        // Update active agent state
        if (['agent_started', 'agent_progress', 'agent_thinking'].includes(lastEvent.type)) {
            setActiveAgent(lastEvent.agentType);
        } else if (['agent_completed', 'agent_failed'].includes(lastEvent.type)) {
            // When an agent completes, it sends data back to master (unless it IS master)
            if (lastEvent.agentType !== 'master') {
                setPacket({ from: lastEvent.agentType, to: 'master', type: 'response' });
                setTimeout(() => setPacket(null), 1000);
            }
            setActiveAgent('master'); // Control returns to master usually
        }

        // Animate packet FROM master when a sub-agent starts
        if (lastEvent.type === 'agent_started' && lastEvent.agentType !== 'master') {
            setPacket({ from: 'master', to: lastEvent.agentType, type: 'request' });
            setTimeout(() => setPacket(null), 1000);
        }

    }, [events, events.length]);

    // Helper to get agent status from events history
    const getAgentStatus = (type: AgentType) => {
        const agentEvents = events.filter(e => e.agentType === type);
        if (agentEvents.length === 0) return 'idle';
        const last = agentEvents[agentEvents.length - 1];
        if (last.type === 'agent_failed') return 'failed';
        if (last.type === 'agent_completed') return 'completed';
        return 'active';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            {/* Visual Graph View */}
            <div className="glass-panel rounded-xl relative overflow-hidden bg-[#0a0a0c] lg:col-span-1">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Define gradients */}
                    <defs>
                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                        </linearGradient>
                    </defs>

                    {Object.keys(positions).filter(k => k !== 'master').map((key) => {
                        const start = positions.master;
                        const end = positions[key as AgentType];
                        return (
                            <line
                                key={key}
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${end.x}%`}
                                y2={`${end.y}%`}
                                stroke="url(#line-gradient)"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Active Packet Animation */}
                    {packet && (
                        <motion.circle
                            r="4"
                            fill={agentConfig[packet.to].color}
                            initial={{
                                cx: `${positions[packet.from].x}%`,
                                cy: `${positions[packet.from].y}%`
                            }}
                            animate={{
                                cx: `${positions[packet.to].x}%`,
                                cy: `${positions[packet.to].y}%`
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
                        </motion.circle>
                    )}
                </svg>

                {/* Nodes */}
                {Object.entries(positions).map(([id, pos]) => {
                    const agentId = id as AgentType;
                    const config = agentConfig[agentId];
                    const status = getAgentStatus(agentId);
                    const isActive = activeAgent === agentId;

                    return (
                        <div
                            key={id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 transition-all duration-500"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            {/* Node Circle */}
                            <motion.div
                                className={`
                                    relative w-16 h-16 rounded-full flex items-center justify-center
                                    border-2 transition-all duration-300 z-10 bg-[#0a0a0c]
                                    ${isActive ? 'border-primary shadow-[0_0_30px_rgba(94,106,210,0.3)] scale-110' :
                                        status === 'completed' ? 'border-success opacity-80' :
                                            status === 'failed' ? 'border-error' :
                                                'border-white/10 opacity-50'}
                                `}
                            >
                                <span className="text-2xl">{config.icon}</span>

                                {/* Thinking Ring */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-[-4px] rounded-full border border-primary/50 border-dashed"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </motion.div>

                            {/* Label */}
                            <div className={`mt-3 text-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">{config.name}</div>
                                <div className="text-[8px] text-foreground-muted hidden sm:block">{config.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Terminal View */}
            <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-full">
                <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-foreground-muted uppercase">System Log</span>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group"
                            >
                                <div className="flex items-baseline space-x-2 opacity-60 mb-1">
                                    <span className="text-[10px] text-primary">{agentConfig[event.agentType].name}</span>
                                    <span className="text-[8px] text-foreground-muted">
                                        {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`
                                    pl-3 border-l-2 py-1
                                    ${event.type === 'agent_failed' ? 'border-error text-error' :
                                        event.type === 'agent_completed' ? 'border-success text-success' :
                                            event.type === 'agent_thinking' ? 'border-warning/50 text-warning/90 italic' :
                                                'border-primary/30 text-foreground/80'}
                                `}>
                                    {event.type === 'agent_thinking' ? (
                                        <span>{event.message} <span className="animate-pulse">_</span></span>
                                    ) : (
                                        event.message
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
}
