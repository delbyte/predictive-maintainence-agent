'use client';

import { Activity, Zap, Database, Server, Loader2 } from 'lucide-react';
import NotificationsList from '@/components/notifications/NotificationsList';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAnalysis } from '@/lib/context/analysis-context';

export default function DashboardOverview() {
    const { analysisResult } = useAnalysis();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard title="System Output" value="NOMINAL" icon={Activity} trend="+1.2%" />
                <KpiCard title="Active Agents" value="6" icon={Zap} trend="STABLE" />
                <KpiCard title="Processed Sets" value={analysisResult?.anomalies ? "COMPLETED" : "IDLE"} icon={Database} />
                <KpiCard title="Server Load" value="12%" icon={Server} trend="-0.5%" />
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-12 gap-6 h-[600px]">
                <div className="col-span-8 flex flex-col gap-6">
                    {/* Quick Action / Hero */}
                    <Link href="/dashboard/analysis" className="flex-1 bg-surface border border-border p-8 flex flex-col justify-center items-center cursor-pointer group hover:bg-surface-hover transition-colors border-dashed hover:border-solid hover:border-primary/50">
                        <div className="w-16 h-16 bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform group-hover:border-primary/50">
                            <Loader2 className="w-8 h-8 text-foreground-muted group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">New Analysis Session</h3>
                        <p className="text-sm text-foreground-muted max-w-sm text-center">Initialize a new predictive maintenance workflow by ingesting vehicle telemetry data.</p>
                        <span className="mt-6 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors">
                            Start Ingestion
                        </span>
                    </Link>
                </div>

                <div className="col-span-4 bg-surface border border-border flex flex-col">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-hover">
                        <span className="text-xs font-bold uppercase text-foreground-dim">Recent Logs</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 overflow-hidden p-0">
                        <NotificationsList />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function KpiCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) {
    return (
        <div className="p-4 bg-surface border border-border flex flex-col justify-between h-28 group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-wider">{title}</span>
                <Icon className="w-4 h-4 text-foreground-dim group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
                {trend && <span className={cn("text-[10px] font-mono", trend.startsWith('+') ? "text-success" : trend.startsWith('-') ? "text-success" : "text-foreground-muted")}>{trend}</span>}
            </div>
        </div>
    )
}
