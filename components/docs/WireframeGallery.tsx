'use client';

import { motion } from "framer-motion";

export default function WireframeGallery() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wireframe 1: Command Center */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 text-[8px] text-zinc-600 font-mono">DASHBOARD_V2</div>

                    <div className="absolute inset-x-0 top-0 h-4 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                        <div className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                    <div className="mt-6 flex h-full gap-4">
                        <div className="w-12 h-3/4 bg-zinc-800/50 flex flex-col gap-2 p-1">
                            <div className="w-full h-4 bg-zinc-700/50 rounded-sm" />
                            <div className="w-full h-4 bg-zinc-700/50 rounded-sm" />
                            <div className="w-full h-4 bg-zinc-700/50 rounded-sm" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="w-full h-8 bg-zinc-800/50 flex items-center px-2 gap-2">
                                <div className="w-1/3 h-4 bg-zinc-700/30 rounded-sm" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-zinc-800/30 border border-zinc-700/30 relative">
                                    <div className="absolute bottom-2 left-2 right-2 h-1/2 bg-zinc-700/20" />
                                </div>
                                <div className="aspect-square bg-zinc-800/30 border border-zinc-700/30 relative">
                                    <div className="absolute inset-2 border-2 border-zinc-700/20 rounded-full" />
                                </div>
                                <div className="aspect-square bg-zinc-800/30 border border-zinc-700/30" />
                            </div>
                            <div className="w-full h-24 bg-zinc-800/30 border border-zinc-700/30 p-2">
                                <div className="w-full h-2 bg-zinc-700/20 mb-1" />
                                <div className="w-2/3 h-2 bg-zinc-700/20 mb-1" />
                                <div className="w-5/6 h-2 bg-zinc-700/20" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors pointer-events-none" />
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-01: COMMAND CENTER LAYOUT</p>
            </div>

            {/* Wireframe 2: Mobile Adaptation */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 flex justify-center items-center relative overflow-hidden group">
                    <div className="absolute top-2 right-2 text-[8px] text-zinc-600 font-mono">MOBILE_WEAPON</div>
                    <div className="w-24 h-40 border border-zinc-700 rounded-xl p-2 space-y-2 bg-black relative shadow-xl">
                        <div className="w-8 h-1 bg-zinc-700 rounded-full mx-auto" />
                        <div className="w-full h-2 bg-zinc-800 rounded-sm" />
                        <div className="space-y-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-4 bg-zinc-900 border border-zinc-800 rounded-sm" />)}
                        </div>

                        {/* Drawer Simulation */}
                        <div className="absolute inset-y-0 left-0 w-16 bg-zinc-800 border-r border-zinc-700 transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-500 shadow-2xl z-10 flex flex-col gap-1 p-1">
                            <div className="w-full h-2 bg-zinc-600 rounded-sm mb-2" />
                            <div className="w-full h-2 bg-zinc-700/50 rounded-sm" />
                            <div className="w-full h-2 bg-zinc-700/50 rounded-sm" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors pointer-events-none" />
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-02: MOBILE RESPONSIVE ADAPTATION</p>
            </div>

            {/* Wireframe 3: Data Detail (Modal) */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900 opacity-50" />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        className="relative z-10 w-2/3 h-3/4 bg-zinc-950 border border-zinc-700 shadow-2xl p-3 flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <div className="w-1/2 h-2 bg-zinc-700 rounded-sm" />
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-zinc-900/50 border border-zinc-800" />
                            <div className="bg-zinc-900/50 border border-zinc-800 space-y-1 p-1">
                                <div className="w-full h-1 bg-zinc-800" />
                                <div className="w-full h-1 bg-zinc-800" />
                                <div className="w-2/3 h-1 bg-zinc-800" />
                            </div>
                        </div>
                        <div className="h-6 flex gap-2 justify-end">
                            <div className="w-16 h-full bg-zinc-800 rounded-sm" />
                            <div className="w-16 h-full bg-indigo-900/50 border border-indigo-500/30 rounded-sm" />
                        </div>
                    </motion.div>
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-03: ANOMALY DETAIL VIEW</p>
            </div>

            {/* Wireframe 4: Logic Configuration */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group">
                    <div className="w-full h-full flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-2">
                            <div className="w-20 h-2 bg-zinc-700 rounded-sm" />
                            <div className="w-4 h-2 bg-green-500/20 rounded-full" />
                        </div>
                        <div className="space-y-1 p-2 bg-zinc-900/30 border border-zinc-800/50 flex-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-800/50 last:border-0">
                                    <div className="w-24 h-1.5 bg-zinc-700/50 rounded-sm" />
                                    <div className="w-8 h-3 bg-zinc-800 rounded-full relative">
                                        <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-zinc-500 ${i % 2 === 0 ? 'right-0.5 bg-indigo-500' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                            <div className="mt-2 w-full h-1 bg-zinc-800 rounded-full">
                                <div className="w-1/3 h-full bg-indigo-500/50 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none" />
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-04: PREDICTION LOGIC CONFIGURATION</p>
            </div>

        </div>
    );
}
