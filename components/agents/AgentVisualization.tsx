'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    BrainCircuit,
    FileSpreadsheet,
    AlertTriangle,
    Bell,
    Calendar,
    MessageSquare,
    Terminal,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';

interface AgentVisualizationProps {
    events: AgentEvent[];
}

const agentConfig = {
    master: { name: 'ORCHESTRATOR', color: '#8b5cf6', icon: BrainCircuit },
    csv_analysis: { name: 'DATA_INGEST', color: '#3b82f6', icon: FileSpreadsheet },
    anomaly_detection: { name: 'INFERENCE_ENGINE', color: '#f59e0b', icon: AlertTriangle },
    notification: { name: 'DISPATCHER', color: '#10b981', icon: Bell },
    scheduling: { name: 'SCHEDULER', color: '#ec4899', icon: Calendar },
    chatbot: { name: 'INTERFACE', color: '#6366f1', icon: MessageSquare },
};

export default function AgentVisualization({ events }: AgentVisualizationProps) {
    const logEndRef = useRef<HTMLDivElement>(null);
    const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);

    // Auto-scroll
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    // Active State Logic
    useEffect(() => {
        if (events.length === 0) return;
        const last = events[events.length - 1];
        if (['agent_started', 'agent_progress', 'agent_thinking'].includes(last.type)) {
            setActiveAgent(last.agentType);
        } else {
            setActiveAgent('master');
        }
    }, [events]);

    const getStatus = (type: AgentType) => {
        const evs = events.filter(e => e.agentType === type);
        if (evs.length === 0) return 'idle';
        const last = evs[evs.length - 1];
        if (last.type === 'agent_failed') return 'failed';
        if (last.type === 'agent_completed') return 'completed';
        return 'active';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#27272a] rounded-lg bg-[#09090b] overflow-hidden h-[600px]">

            {/* Left: Network Graph (2 cols) */}
            <div className="lg:col-span-2 relative p-8 bg-[#09090b] flex items-center justify-center border-r border-[#27272a]">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Central Master Node */}
                <div className="relative w-full h-full max-w-lg mx-auto flex flex-col justify-between py-12">

                    {/* Master (Top) */}
                    <div className="flex justify-center z-20">
                        <Node
                            id="master"
                            isActive={activeAgent === 'master'}
                            status={getStatus('master')}
                        />
                    </div>

                    {/* Sub Agents (Bottom Row) */}
                    <div className="flex justify-between items-end z-20 pt-20">
                        {['csv_analysis', 'anomaly_detection', 'notification', 'scheduling', 'chatbot'].map((id) => (
                            <Node
                                key={id}
                                id={id as AgentType}
                                isActive={activeAgent === id}
                                status={getStatus(id as AgentType)}
                            />
                        ))}
                    </div>

                    {/* Connecting Lines (SVG Overlay) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        {['csv_analysis', 'anomaly_detection', 'notification', 'scheduling', 'chatbot'].map((id, index) => {
                            // Calculated strict geometric paths
                            return (
                                <motion.path
                                    key={id}
                                    d={`M 50% 120px L ${10 + (index * 20)}% 85%`} // Simple approximation
                                    stroke={activeAgent === id || activeAgent === 'master' ? "#5e6ad2" : "#27272a"}
                                    strokeWidth="1"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                />
                            )
                        })}
                    </svg>
                </div>
            </div>

            {/* Right: Terminal Log (1 col) */}
            <div className="bg-[#0c0c0e] flex flex-col h-full font-mono text-xs">
                <div className="px-4 py-3 border-b border-[#27272a] bg-[#18181b] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="font-semibold text-zinc-300">SYSTEM_LOG</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {events.map((e, i) => (
                        <div key={i} className="flex gap-3 group">
                            <div className="w-8 text-zinc-600 shrink-0 text-[10px] pt-1">
                                {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm",
                                        "bg-zinc-800 text-zinc-300"
                                    )}>
                                        {agentConfig[e.agentType].name}
                                    </span>
                                    {e.type === 'agent_failed' && <span className="text-red-500 text-[10px] font-bold">ERROR</span>}
                                </div>
                                <p className={cn(
                                    "leading-relaxed transition-colors",
                                    e.type === 'agent_thinking' ? "text-amber-400" :
                                        e.type === 'agent_failed' ? "text-red-400" :
                                            e.type === 'agent_completed' ? "text-emerald-400" :
                                                "text-zinc-400 group-hover:text-zinc-200"
                                )}>
                                    {e.message}
                                    {e.type === 'agent_thinking' && <span className="animate-pulse">_</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
}

function Node({ id, isActive, status }: { id: AgentType, isActive: boolean, status: string }) {
    const config = agentConfig[id];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center gap-3 relative group">
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 bg-[#09090b] z-20",
                isActive
                    ? "border-primary text-primary shadow-[0_0_20px_rgba(94,106,210,0.2)]"
                    : status === 'completed'
                        ? "border-emerald-900 text-emerald-500"
                        : "border-[#27272a] text-zinc-600"
            )}>
                <Icon className="w-5 h-5" />
            </div>

            <div className={cn(
                "absolute -bottom-8 whitespace-nowrap px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[10px] font-bold text-zinc-400 tracking-wider transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                {config.name}
            </div>

            {/* Ripple when active */}
            {isActive && (
                <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" />
            )}
        </div>
    );
}
