'use client';

import { Anomaly } from '@/lib/agents/types';
import { motion } from 'framer-motion';

interface AnomalyDisplayProps {
    anomalies: Anomaly[];
}

const severityConfig = {
    critical: { color: 'bg-red-100 border-red-500 text-red-900', icon: '🚨', label: 'CRITICAL' },
    high: { color: 'bg-orange-100 border-orange-500 text-orange-900', icon: '⚠️', label: 'HIGH' },
    medium: { color: 'bg-yellow-100 border-yellow-500 text-yellow-900', icon: '⚡', label: 'MEDIUM' },
    low: { color: 'bg-blue-100 border-blue-500 text-blue-900', icon: 'ℹ️', label: 'LOW' },
};

export default function AnomalyDisplay({ anomalies }: AnomalyDisplayProps) {
    if (anomalies.length === 0) {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-green-900">No Anomalies Detected</h3>
                <p className="text-sm text-green-700 mt-1">All vehicles appear to be in good condition</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Detected Anomalies ({anomalies.length})
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                    {Object.entries(
                        anomalies.reduce((acc, a) => {
                            acc[a.severity] = (acc[a.severity] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)
                    ).map(([severity, count]) => (
                        <span
                            key={severity}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig[severity as keyof typeof severityConfig].color}`}
                        >
                            {count} {severity}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {anomalies.map((anomaly, index) => {
                    const config = severityConfig[anomaly.severity];

                    return (
                        <motion.div
                            key={anomaly.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border-l-4 ${config.color} rounded-lg p-4`}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="text-2xl">{config.icon}</span>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{anomaly.type}</h4>
                                        <span className="text-xs font-medium px-2 py-1 bg-white rounded-full">
                                            {config.label}
                                        </span>
                                    </div>

                                    {anomaly.vin && (
                                        <p className="text-xs text-gray-600 mb-2">VIN: {anomaly.vin}</p>
                                    )}

                                    <p className="text-sm text-gray-700 mb-3">{anomaly.description}</p>

                                    <div className="bg-white bg-opacity-50 rounded p-3">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Recommendation:</p>
                                        <p className="text-sm text-gray-900">{anomaly.recommendation}</p>
                                    </div>

                                    {anomaly.affectedComponent && (
                                        <p className="text-xs text-gray-600 mt-2">
                                            Affected: {anomaly.affectedComponent}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
