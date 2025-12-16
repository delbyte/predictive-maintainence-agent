'use client';

import { AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnomalyDisplayProps {
    result: AnomalyDetectionResult;
}

const severityConfig = {
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertOctagon },
    high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle },
    medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
    low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info },
};

export default function AnomalyDisplay({ result }: AnomalyDisplayProps) {
    const { anomalies, summary } = result;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (anomalies.length === 0) {
        return (
            <div className="border border-[#27272a] rounded-lg p-12 bg-[#09090b] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-zinc-200 font-semibold">No Anomalies Detected</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                    System metrics are within nominal ranges. No actionable maintenance required at this time.
                </p>
                <div className="mt-6 pt-6 border-t border-[#27272a] w-full max-w-md">
                    <div className="text-xs font-mono text-zinc-500 text-left bg-[#18181b] p-3 rounded">
                        {summary}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#09090b] border border-[#27272a] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Detection Report</h3>
                    <p className="text-xs text-zinc-500 mt-1">Found {anomalies.length} potential issues requiring attention.</p>
                </div>
                <div className="flex gap-2">
                    {['critical', 'high', 'medium'].map(sev => {
                        const count = anomalies.filter(a => a.severity === sev).length;
                        if (count === 0) return null;
                        const s = sev as keyof typeof severityConfig;
                        return (
                            <span key={sev} className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border", severityConfig[s].bg, severityConfig[s].color, severityConfig[s].border)}>
                                {count} {sev}
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#27272a] bg-[#0c0c0e] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <div className="col-span-1">Sev</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-3">Component</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-1 text-right">Details</div>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {anomalies.map((anomaly, index) => {
                    const config = severityConfig[anomaly.severity];
                    const Icon = config.icon;
                    const isExpanded = expandedId === anomaly.id;

                    return (
                        <div key={anomaly.id} className="border-b border-[#27272a] last:border-0 hover:bg-[#18181b] transition-colors">
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : anomaly.id)}
                                className="grid grid-cols-12 gap-4 px-6 py-3 items-center cursor-pointer text-sm"
                            >
                                <div className="col-span-1">
                                    <Icon className={cn("w-4 h-4", config.color)} />
                                </div>
                                <div className="col-span-3 font-medium text-zinc-200 truncate">
                                    {anomaly.type}
                                </div>
                                <div className="col-span-3">
                                    <code className="text-xs bg-[#27272a] text-zinc-300 px-1.5 py-0.5 rounded border border-[#3f3f46]">
                                        {anomaly.affectedComponent || 'N/A'}
                                    </code>
                                </div>
                                <div className="col-span-4 text-zinc-500 truncate text-xs">
                                    {anomaly.description}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[#0c0c0e]"
                                    >
                                        <div className="px-6 py-4 border-t border-[#27272a] grid grid-cols-2 gap-8 text-xs">
                                            <div>
                                                <span className="text-zinc-500 uppercase font-bold tracking-wider mb-2 block text-[10px]">Full Description</span>
                                                <p className="text-zinc-300 leading-relaxed">{anomaly.description}</p>
                                            </div>
                                            <div>
                                                <span className="text-zinc-500 uppercase font-bold tracking-wider mb-2 block text-[10px]">Recommendation</span>
                                                <p className="text-emerald-400 leading-relaxed">{anomaly.recommendation}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
