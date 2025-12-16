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
    anomaly_detection: { name: 'INFERENCE', color: '#f59e0b', icon: AlertTriangle },
    notification: { name: 'DISPATCH', color: '#10b981', icon: Bell },
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

    const subAgents: AgentType[] = ['csv_analysis', 'anomaly_detection', 'notification', 'scheduling', 'chatbot'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#27272a] bg-[#09090b] overflow-hidden h-[600px] shadow-2xl">

            {/* Left: Network Graph (2 cols) */}
            <div className="lg:col-span-2 relative p-0 bg-[#09090b] border-r border-[#27272a]">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Visualization Container */}
                <div className="relative w-full h-full flex flex-col items-center justify-center p-12">

                    {/* SVG Layer for Lines - ABSOLUTE POSITIONED OVERLAY */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#5e6ad2" />
                            </marker>
                        </defs>
                        {subAgents.map((id, index) => {
                            // Dynamic calculation for line coordinates
                            // Master is always center top (50% width, 25% height)
                            // Subagents are distributed along bottom (15% to 85% width, 75% height)

                            const startX = "50%";
                            const startY = "25%";

                            const spacing = 80 / (subAgents.length - 1); // Spread across 80% width
                            const endX = `${10 + (index * spacing)}%`;
                            const endY = "75%";

                            const isActiveConnection = activeAgent === id || (activeAgent === 'master' && events[events.length - 1]?.agentType === id);

                            return (
                                <motion.path
                                    key={id}
                                    d={`M ${startX} ${startY} L ${endX} ${endY}`}
                                    stroke={isActiveConnection ? "#5e6ad2" : "#27272a"}
                                    strokeWidth={isActiveConnection ? "2" : "1"}
                                    fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    markerEnd={isActiveConnection ? "url(#arrowhead)" : undefined}
                                />
                            )
                        })}
                    </svg>

                    {/* Master Node (Top Center) */}
                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <Node
                            id="master"
                            isActive={activeAgent === 'master'}
                            status="active" // Master is always active essentially
                        />
                    </div>

                    {/* Sub Agents (Bottom Row) */}
                    {subAgents.map((id, index) => {
                        const spacing = 80 / (subAgents.length - 1);
                        const leftPos = 10 + (index * spacing);

                        return (
                            <div
                                key={id}
                                className="absolute top-[75%] -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{ left: `${leftPos}%` }}
                            >
                                <Node
                                    id={id as AgentType}
                                    isActive={activeAgent === id}
                                    status="idle" // We could pipe real status here
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right: Terminal Log (1 col) */}
            <div className="bg-[#0c0c0e] flex flex-col h-full font-mono text-xs border-l border-[#27272a]">
                <div className="px-4 py-3 border-b border-[#27272a] bg-[#18181b] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-zinc-300 tracking-wider">SYSTEM_LOG</span>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] text-emerald-500 font-bold">ONLINE</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#09090b]">
                    {events.map((e, i) => (
                        <div key={i} className="flex gap-3 group">
                            <div className="w-16 text-zinc-600 shrink-0 text-[10px] pt-1 font-mono">
                                {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div className="flex-1 border-l border-[#27272a] pl-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-none",
                                        "bg-zinc-900 border border-zinc-800 text-zinc-300"
                                    )}>
                                        {agentConfig[e.agentType].name}
                                    </span>
                                    {e.type === 'agent_failed' && <span className="text-red-500 text-[10px] font-bold bg-red-500/10 px-1">ERROR</span>}
                                </div>
                                <p className={cn(
                                    "text-sm leading-relaxed transition-colors font-medium", // Increased font size here
                                    e.type === 'agent_thinking' ? "text-amber-400" :
                                        e.type === 'agent_failed' ? "text-red-400" :
                                            e.type === 'agent_completed' ? "text-emerald-400" :
                                                "text-zinc-400 group-hover:text-zinc-200"
                                )}>
                                    {e.message}
                                    {e.type === 'agent_thinking' && <span className="animate-pulse ml-1">_</span>}
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
        <div className="flex flex-col items-center gap-4 relative group">
            <div className={cn(
                "w-16 h-16 flex items-center justify-center border-2 transition-all duration-300 bg-[#09090b] z-20", // Square/Sharp nodes for industrial feel, or keep circle? User said "radius 0".
                // Let's make nodes sharp squares or hexagons? Standard sharp square for now.
                "rounded-none",
                isActive
                    ? "border-primary text-primary shadow-[0_0_30px_rgba(94,106,210,0.3)] bg-[#1e2030]"
                    : "border-[#27272a] text-zinc-600 bg-[#09090b]"
            )}>
                <Icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} />
            </div>

            <div className={cn(
                "absolute -bottom-8 whitespace-nowrap px-3 py-1 bg-[#18181b] border border-[#27272a] text-[10px] font-bold text-zinc-400 tracking-widest transition-opacity uppercase",
                isActive ? "opacity-100 text-white border-primary/30" : "opacity-70"
            )}>
                {config.name}
            </div>

            {/* Ripple when active - Square ripple */}
            {isActive && (
                <span className="absolute inset-0 border border-primary/30 animate-ping opacity-20" />
            )}
        </div>
    );
}
