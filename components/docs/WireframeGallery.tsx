'use client';

export default function WireframeGallery() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wireframe 1: Dashboard */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-4 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                        <div className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                    <div className="mt-6 flex h-full gap-4">
                        <div className="w-16 h-3/4 bg-zinc-800/50 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="w-full h-8 bg-zinc-800/50" />
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-zinc-800/30" />
                                <div className="aspect-square bg-zinc-800/30" />
                                <div className="aspect-square bg-zinc-800/30" />
                            </div>
                            <div className="w-full h-24 bg-zinc-800/30" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors pointer-events-none" />
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-01: COMMAND CENTER LAYOUT</p>
            </div>

            {/* Wireframe 2: Mobile View */}
            <div className="space-y-3">
                <div className="aspect-video bg-zinc-900 border border-zinc-800 p-4 flex justify-center items-center relative overflow-hidden group">
                    <div className="w-24 h-40 border border-zinc-700 rounded-xl p-2 space-y-2 bg-black">
                        <div className="w-8 h-1 bg-zinc-700 rounded-full mx-auto" />
                        <div className="w-full h-2 bg-zinc-800 rounded-sm" />
                        <div className="space-y-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-4 bg-zinc-900 border border-zinc-800 rounded-sm" />)}
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors pointer-events-none" />
                </div>
                <p className="text-xs text-zinc-500 text-center font-mono">FIG-02: MOBILE RESPONSIVE ADAPTATION</p>
            </div>
        </div>
    );
}
