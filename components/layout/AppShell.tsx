'use client';

import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Menu, X, Info, Layers } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the canvas with SSR disabled to prevent Node SSR errors with Three.js
const GraphCanvas = dynamic(() => import('../canvas/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
        <span className="text-sm font-medium tracking-wide">Initializing 3D Canvas...</span>
      </div>
    </div>
  ),
});

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.12),rgba(15,23,42,0))] pointer-events-none" />

      {/* Toggle Sidebar Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-cyan-400 shadow-lg border border-slate-700/50 backdrop-blur-md transition-all hover:bg-slate-800 hover:text-cyan-300 md:hidden"
        aria-label="Toggle settings"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Left Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative flex-1 h-full min-w-0">
        <GraphCanvas />

        {/* Info Overlay top right */}
        <div className="absolute top-4 right-4 z-30 pointer-events-none flex flex-col gap-2 items-end">
          <div className="glass-panel rounded-lg px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2 border border-white/5 shadow-md">
            <Layers size={14} className="text-cyan-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase font-title text-[10px]">MathGeo Engine v2.0</span>
          </div>
          <div className="hidden sm:flex glass-panel rounded-lg px-3 py-1.5 text-[10px] text-slate-400 gap-3 border border-white/5 shadow-md">
            <span>Left Click + Drag: Rotate</span>
            <span>Right Click + Drag: Pan</span>
            <span>Scroll: Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
