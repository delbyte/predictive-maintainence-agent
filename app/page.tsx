'use client';

import SignInForm from '@/components/auth/SignInForm';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, BrainCircuit, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 overflow-hidden font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-wider text-sm">AUTOMOBILE<span className="text-indigo-500">.AI</span></span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 bg-indigo-500 rounded-none animate-pulse" />
              System V2.0 Operational
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Autonomous <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                Fleet Intelligence
              </span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
              Deploy agentic AI to predict mechanical failures before they occur.
              Real-time telemetry analysis, automated scheduling, and zero-downtime operations.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <a href="/auth" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors flex items-center gap-2">
                Start Demo <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/docs" className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white/5 transition-colors">
                Documentation
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50ms</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Latency</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="relative z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30 blur-2xl" />
            <div className="relative bg-[#09090b] border border-white/10 p-1">
              <div className="p-8 border border-white/5 bg-[#0c0c0e]">
                <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-indigo-900/20 border border-indigo-500/20 mx-auto flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Secure Access</h3>
                  <p className="text-sm text-zinc-500 mt-2">Enter credentials to access command center</p>
                </div>
                <SignInForm />
              </div>
            </div>
          </div>
        </div>

        {/* Background Asset */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          {/* We rely on the layout or global CSS for the background image, or we can use an img tag here with the uploaded asset */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="absolute right-0 top-0 w-2/3 h-full bg-[url('/industrial_bg.png')] bg-cover bg-center opacity-20 grayscale brightness-50" />
          {/* Note: I will instruct the user or system to ensure the image is available at this path or use the artifact path logic if next.js allows */}
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-32 px-6 border-b border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Feature
              icon={BrainCircuit}
              title="Neural Analysis"
              desc="Gemini-powered agents analyze sensor data in real-time to detect complex anomaly patterns."
            />
            <Feature
              icon={Zap}
              title="Instant Action"
              desc="Automated workflows trigger maintenance tickets and notifications within milliseconds."
            />
            <Feature
              icon={Activity}
              title="Live Telemetry"
              desc="Visualize fleet health with high-frequency data streaming and interactive dashboards."
            />
          </div>
        </div>
      </div>

    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group hover:bg-white/5 p-8 border border-white/10 transition-colors">
      <div className="mb-6 w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/50 transition-colors">
        <Icon className="w-6 h-6 text-zinc-300 group-hover:text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  )
}
