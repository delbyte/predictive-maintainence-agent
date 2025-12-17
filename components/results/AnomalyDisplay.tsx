'use client';

import { AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, ChevronDown, ChevronUp, Activity } from 'lucide-react';
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
            <div className="border border-dashed border-border p-12 bg-background flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-success/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-foreground font-semibold">System Nominal</h3>
                <p className="text-sm text-foreground-muted mt-1 max-w-sm">
                    No anomalies detected in the current dataset.
                </p>
                <div className="mt-6 pt-6 border-t border-border w-full max-w-md">
                    <div className="text-xs font-mono text-foreground-muted text-left bg-surface p-3 border border-border">
                        {summary}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background border border-border flex flex-col shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Detection Report
                    </h3>
                </div>
                <div className="flex gap-2">
                    {['critical', 'high', 'medium', 'low'].map(sev => {
                        const count = anomalies.filter(a => a.severity === sev).length;
                        if (count === 0) return null;
                        const s = sev as keyof typeof severityConfig;
                        return (
                            <span key={sev} className={cn("px-2 py-0.5 text-[10px] uppercase font-bold border", severityConfig[s].bg, severityConfig[s].color, severityConfig[s].border)}>
                                {count} {sev}
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-border bg-surface-hover text-[10px] font-bold text-foreground-dim uppercase tracking-wider">
                <div className="col-span-1">Sev</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Component</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-1 text-right">Action</div>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-background">
                {anomalies.map((anomaly) => {
                    const config = severityConfig[anomaly.severity];
                    const Icon = config.icon;
                    const isExpanded = expandedId === anomaly.id;

                    return (
                        <div key={anomaly.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors group">
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : anomaly.id)}
                                className="grid grid-cols-12 gap-4 px-6 py-3 items-center cursor-pointer text-sm"
                            >
                                <div className="col-span-1">
                                    <Icon className={cn("w-4 h-4", config.color)} />
                                </div>
                                <div className="col-span-2 font-medium text-foreground truncate text-xs font-mono">
                                    {anomaly.type}
                                </div>
                                <div className="col-span-3">
                                    <span className="text-xs bg-surface border border-border text-foreground-muted px-1.5 py-0.5 font-mono">
                                        {anomaly.affectedComponent || 'N/A'}
                                    </span>
                                </div>
                                <div className="col-span-5 text-foreground-muted truncate text-xs">
                                    {anomaly.description}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <ChevronUp className={cn("w-4 h-4 text-foreground-dim transition-transform duration-200", isExpanded ? "rotate-0" : "rotate-180")} />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-surface border-t border-dashed border-border"
                                    >
                                        <div className="px-6 py-4 grid grid-cols-2 gap-8 text-xs">
                                            <div>
                                                <span className="text-foreground-dim uppercase font-bold tracking-wider mb-2 block text-[10px]">Analysis</span>
                                                <p className="text-foreground leading-relaxed bg-background p-3 border border-border font-mono text-xs">{anomaly.description}</p>
                                            </div>
                                            <div>
                                                <span className="text-foreground-dim uppercase font-bold tracking-wider mb-2 block text-[10px]">Recommended Action</span>
                                                <p className="text-emerald-500 leading-relaxed bg-emerald-500/5 p-3 border border-emerald-500/20 font-mono text-xs">{anomaly.recommendation}</p>
                                                <button className="mt-3 w-full py-1.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-colors">
                                                    Initiate Dispatch
                                                </button>
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
