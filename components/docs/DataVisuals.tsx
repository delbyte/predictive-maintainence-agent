'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';

const data = [
    { time: '00:00', load: 4000, anomaly: 2400 },
    { time: '04:00', load: 3000, anomaly: 1398 },
    { time: '08:00', load: 2000, anomaly: 9800 },
    { time: '12:00', load: 2780, anomaly: 3908 },
    { time: '16:00', load: 1890, anomaly: 4800 },
    { time: '20:00', load: 2390, anomaly: 3800 },
    { time: '24:00', load: 3490, anomaly: 4300 },
];

const barData = [
    { name: 'Motor A', value: 85 },
    { name: 'Motor B', value: 92 },
    { name: 'Motor C', value: 45 }, // Anomaly
    { name: 'Motor D', value: 88 },
];

export default function DataVisuals() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart 1: Time Series Anomaly */}
            <div className="space-y-3">
                <div className="h-64 bg-[#0c0c0e] border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="anomaly" stroke="#8884d8" fillOpacity={1} fill="url(#colorAnomaly)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-03: VIBRATION HARMONICS OVER TIME</p>
            </div>

            {/* Chart 2: Health Distribution */}
            <div className="space-y-3">
                <div className="h-64 bg-[#0c0c0e] border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                cursor={{ fill: '#ffffff10' }}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-04: COMPONENT HEALTH SCORES</p>
            </div>
        </div>
    );
}
