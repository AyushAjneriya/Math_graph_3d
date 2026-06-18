'use client';

import React from 'react';
import FormulaInput from './FormulaInput';
import RangeSliders from './RangeSliders';
import AestheticControls from './AestheticControls';
import { Sigma, Sliders, Palette, HelpCircle, X } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="glass-panel flex h-full w-full flex-col border-r border-slate-800/80 bg-slate-950/80 text-slate-100">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/60 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sigma size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-title">
              MathGeo
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">3D Digital Visualizer</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Sidebar Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Section 1: Formula & Presets */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sigma size={14} className="text-cyan-500" />
            <span>Function Input</span>
          </div>
          <FormulaInput />
        </div>

        <hr className="border-slate-800/60" />

        {/* Section 2: Range & Resolution */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sliders size={14} className="text-cyan-500" />
            <span>Grid Settings</span>
          </div>
          <RangeSliders />
        </div>

        <hr className="border-slate-800/60" />

        {/* Section 3: Aesthetics & Render Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Palette size={14} className="text-cyan-500" />
            <span>Aesthetics</span>
          </div>
          <AestheticControls />
        </div>
      </div>

      {/* Sidebar Footer / Info */}
      <div className="border-t border-slate-800/60 p-4 bg-slate-950/40 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <HelpCircle size={13} className="text-cyan-400" />
          <span>Double-click Canvas to reset view</span>
        </div>
      </div>
    </aside>
  );
}
