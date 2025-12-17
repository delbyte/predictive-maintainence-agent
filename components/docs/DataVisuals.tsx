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
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ScatterChart,
    Scatter,
    ZAxis,
    Legend
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

const radarData = [
    { subject: 'Vibration', A: 120, fullMark: 150 },
    { subject: 'Thermal', A: 98, fullMark: 150 },
    { subject: 'Acoustic', A: 86, fullMark: 150 },
    { subject: 'Magnetic', A: 99, fullMark: 150 },
    { subject: 'Pressure', A: 85, fullMark: 150 },
    { subject: 'Humidity', A: 65, fullMark: 150 },
];

const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
];

export default function DataVisuals() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart 1: Time Series Anomaly */}
            <div className="space-y-3">
                <div className="h-64 bg-[#0c0c0e] border border-white/10 p-4 relative">
                    <div className="absolute top-2 right-2 flex gap-2">
                        <div className="text-[10px] text-zinc-500 uppercase">Live Feed</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-1"></div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" fontSize={10} tickMargin={10} />
                            <YAxis stroke="#666" fontSize={10} />
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
                            <XAxis dataKey="name" stroke="#666" fontSize={10} tickMargin={10} />
                            <YAxis stroke="#666" fontSize={10} />
                            <Tooltip
                                cursor={{ fill: '#ffffff10' }}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-04: COMPONENT HEALTH SCORES</p>
            </div>

            {/* Chart 3: Sensor Radar */}
            <div className="space-y-3">
                <div className="h-64 bg-[#0c0c0e] border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Sensor Sensitivity"
                                dataKey="A"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="#10b981"
                                fillOpacity={0.3}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-05: MULTI-MODAL SENSOR PROFILE</p>
            </div>

            {/* Chart 4: Anomaly Scatter */}
            <div className="space-y-3">
                <div className="h-64 bg-[#0c0c0e] border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis type="number" dataKey="x" name="Severity" unit="%" stroke="#666" fontSize={10} />
                            <YAxis type="number" dataKey="y" name="Frequency" unit="hz" stroke="#666" fontSize={10} />
                            <ZAxis type="number" dataKey="z" range={[60, 400]} name="Impact" unit="pts" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }} itemStyle={{ color: '#fff' }} />
                            <Scatter name="Anomalies" data={scatterData} fill="#f43f5e" shape="cross" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-06: ANOMALY CLUSTERING (SEVERITY VS FREQ)</p>
            </div>
        </div>
    );
}
