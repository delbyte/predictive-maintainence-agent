'use client';

import { useAnalysis } from '@/lib/context/analysis-context';
import AnomalyDisplay from '@/components/results/AnomalyDisplay';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnomaliesPage() {
    const { analysisResult } = useAnalysis();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {analysisResult ? (
                <AnomalyDisplay result={analysisResult} />
            ) : (
                <div className="h-[400px] w-full border border-border border-dashed bg-surface flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-background border border-border flex items-center justify-center mb-6">
                        <AlertTriangle className="w-6 h-6 text-foreground-muted" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No Active Reports</h3>
                    <p className="text-sm text-foreground-muted mt-1 max-w-sm">Run an analysis to generate anomaly reports.</p>
                </div>
            )}
        </motion.div>
    );
}
