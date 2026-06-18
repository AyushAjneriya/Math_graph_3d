'use client';

import React from 'react';
import { useGraph } from '../../context/GraphContext';
import { ColorMap, RenderMode, ComplexMode } from '../../types/graph';
import { Palette, Eye, Grid, Compass, RotateCcw } from 'lucide-react';

export default function AestheticControls() {
  const { state, dispatch } = useGraph();
  const { plotMode, colorMap, renderMode, complexMode, opacity } = state.config;

  const handleColorMapChange = (val: ColorMap) => {
    dispatch({ type: 'SET_COLORMAP', payload: val });
  };

  const handleRenderModeChange = (val: RenderMode) => {
    dispatch({ type: 'SET_RENDER_MODE', payload: val });
  };

  const handleComplexModeChange = (val: ComplexMode) => {
    dispatch({ type: 'SET_COMPLEX_MODE', payload: val });
  };

  const handleOpacityChange = (val: number) => {
    dispatch({ type: 'SET_OPACITY', payload: val });
  };

  const colorMaps: { value: ColorMap; label: string; preview: string }[] = [
    { value: 'viridis', label: 'Viridis', preview: 'bg-gradient-to-r from-purple-800 via-teal-600 to-yellow-400' },
    { value: 'plasma', label: 'Plasma', preview: 'bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-300' },
    { value: 'inferno', label: 'Inferno', preview: 'bg-gradient-to-r from-black via-purple-900 via-orange-500 to-yellow-200' },
    { value: 'cool', label: 'Cool', preview: 'bg-gradient-to-r from-cyan-400 to-pink-500' },
    { value: 'rainbow', label: 'Rainbow', preview: 'bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600' },
    { value: 'monochromatic', label: 'Monochromatic', preview: 'bg-gradient-to-r from-slate-900 via-teal-700 to-slate-100' }
  ];

  return (
    <div className="space-y-4">
      {/* Colormap Color Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Palette size={10} className="text-cyan-400" />
          <span>Color Scheme</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {colorMaps.map((cm) => (
            <button
              key={cm.value}
              onClick={() => handleColorMapChange(cm.value)}
              className={`flex flex-col items-start gap-1 p-2 rounded-md transition-all text-[11px] font-medium text-left border ${
                colorMap === cm.value
                  ? 'bg-slate-900 border-cyan-500/80 shadow-md text-white shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <span>{cm.label}</span>
              <div className={`h-1.5 w-full rounded-sm ${cm.preview}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Render Mode Toggle Buttons */}
      <div className="space-y-2">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Grid size={10} className="text-cyan-400" />
          <span>Rendering Style</span>
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-950/40 border border-slate-800/80 rounded-lg p-1">
          {(['solid', 'wireframe', 'both'] as RenderMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleRenderModeChange(mode)}
              className={`py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all text-center ${
                renderMode === mode
                  ? 'bg-slate-900 border border-slate-700/30 text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Complex Plot Mode Toggle */}
      {plotMode === 'explicit' && (
        <div className="space-y-2">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass size={10} className="text-cyan-400" />
            <span>Complex Output Component</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/40 border border-slate-800/80 rounded-lg p-1">
            {[
              { value: 'real', label: 'Real Re(z)' },
              { value: 'imaginary', label: 'Imag Im(z)' },
              { value: 'magnitude', label: 'Mag |z|' }
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => handleComplexModeChange(mode.value as ComplexMode)}
                className={`py-1.5 rounded-md text-[10px] font-semibold transition-all text-center ${
                  complexMode === mode.value
                    ? 'bg-slate-900 border border-slate-700/30 text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Eye size={10} className="text-cyan-400" />
            <span>Surface Opacity</span>
          </label>
          <span className="text-[11px] font-mono text-cyan-400">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
        />
      </div>

      {/* Replay Animation Trigger */}
      <button
        onClick={() => dispatch({ type: 'TRIGGER_ANIMATION' })}
        className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-cyan-950/20 border border-cyan-400/20 transition-all cursor-pointer hover:shadow-cyan-500/10"
      >
        <RotateCcw size={14} />
        <span>Replay Formation</span>
      </button>
    </div>
  );
}
