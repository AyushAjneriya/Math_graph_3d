'use client';

import React from 'react';
import { useGraph } from '../../context/GraphContext';

export default function RangeSliders() {
  const { state, dispatch } = useGraph();
  const { plotMode, xRange, yRange, uRange, vRange, resolution } = state.config;

  const handleXMinChange = (val: number) => {
    dispatch({ type: 'SET_X_RANGE', payload: { ...xRange, min: val } });
  };

  const handleXMaxChange = (val: number) => {
    dispatch({ type: 'SET_X_RANGE', payload: { ...xRange, max: val } });
  };

  const handleYMinChange = (val: number) => {
    dispatch({ type: 'SET_Y_RANGE', payload: { ...yRange, min: val } });
  };

  const handleYMaxChange = (val: number) => {
    dispatch({ type: 'SET_Y_RANGE', payload: { ...yRange, max: val } });
  };

  const handleUMinChange = (val: number) => {
    dispatch({ type: 'SET_U_RANGE', payload: { ...uRange, min: val } });
  };

  const handleUMaxChange = (val: number) => {
    dispatch({ type: 'SET_U_RANGE', payload: { ...uRange, max: val } });
  };

  const handleVMinChange = (val: number) => {
    dispatch({ type: 'SET_V_RANGE', payload: { ...vRange, min: val } });
  };

  const handleVMaxChange = (val: number) => {
    dispatch({ type: 'SET_V_RANGE', payload: { ...vRange, max: val } });
  };

  const handleResolutionChange = (val: number) => {
    dispatch({ type: 'SET_RESOLUTION', payload: val });
  };

  return (
    <div className="space-y-4">
      {plotMode === 'explicit' ? (
        <>
          {/* X Range Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">X Range Domain</span>
              <span className="text-[11px] font-mono text-cyan-400">
                [{xRange.min.toFixed(1)}, {xRange.max.toFixed(1)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Min (X)</span>
                <input
                  type="range"
                  min="-20"
                  max="0"
                  step="0.5"
                  value={xRange.min}
                  onChange={(e) => handleXMinChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Max (X)</span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={xRange.max}
                  onChange={(e) => handleXMaxChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Y Range Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Y Range Domain</span>
              <span className="text-[11px] font-mono text-cyan-400">
                [{yRange.min.toFixed(1)}, {yRange.max.toFixed(1)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Min (Y)</span>
                <input
                  type="range"
                  min="-20"
                  max="0"
                  step="0.5"
                  value={yRange.min}
                  onChange={(e) => handleYMinChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Max (Y)</span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={yRange.max}
                  onChange={(e) => handleYMaxChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* U Range Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">u parameter range</span>
              <span className="text-[11px] font-mono text-cyan-400">
                [{uRange.min.toFixed(2)}, {uRange.max.toFixed(2)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Min (u)</span>
                <input
                  type="range"
                  min="-10"
                  max="0"
                  step="0.1"
                  value={uRange.min}
                  onChange={(e) => handleUMinChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Max (u)</span>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={uRange.max}
                  onChange={(e) => handleUMaxChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* V Range Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">v parameter range</span>
              <span className="text-[11px] font-mono text-cyan-400">
                [{vRange.min.toFixed(2)}, {vRange.max.toFixed(2)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Min (v)</span>
                <input
                  type="range"
                  min="-10"
                  max="0"
                  step="0.1"
                  value={vRange.min}
                  onChange={(e) => handleVMinChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-medium">Max (v)</span>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={vRange.max}
                  onChange={(e) => handleVMaxChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Resolution Density Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Grid Resolution</span>
          <span className="text-[11px] font-mono text-cyan-400">{resolution} &times; {resolution}</span>
        </div>
        <input
          type="range"
          min="15"
          max="120"
          step="1"
          value={resolution}
          onChange={(e) => handleResolutionChange(parseInt(e.target.value))}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-[8px] text-slate-500 font-medium px-0.5">
          <span>Low (Fast)</span>
          <span>Medium</span>
          <span>High (Detailed)</span>
        </div>
      </div>
    </div>
  );
}
