'use client';

import React, { useState, useEffect } from 'react';
import { useGraph } from '../../context/GraphContext';
import { PRESETS, validateFormula, validateFormulaParametric } from '../../lib/mathParser';
import { AlertCircle, Check, BookOpen, Layers } from 'lucide-react';

export default function FormulaInput() {
  const { state, dispatch } = useGraph();
  const { plotMode } = state.config;

  const [localFormula, setLocalFormula] = useState(state.config.formula);
  const [localFormulaX, setLocalFormulaX] = useState(state.config.formulaX);
  const [localFormulaY, setLocalFormulaY] = useState(state.config.formulaY);
  const [localFormulaZ, setLocalFormulaZ] = useState(state.config.formulaZ);

  // Keep local input fields in sync when a preset is loaded
  useEffect(() => {
    setLocalFormula(state.config.formula);
    setLocalFormulaX(state.config.formulaX);
    setLocalFormulaY(state.config.formulaY);
    setLocalFormulaZ(state.config.formulaZ);
  }, [state.config.formula, state.config.formulaX, state.config.formulaY, state.config.formulaZ]);

  const handleFormulaChange = (val: string) => {
    setLocalFormula(val);
    dispatch({ type: 'SET_FORMULA', payload: val });
  };

  const handleFormulaXChange = (val: string) => {
    setLocalFormulaX(val);
    dispatch({ type: 'SET_FORMULA_X', payload: val });
  };

  const handleFormulaYChange = (val: string) => {
    setLocalFormulaY(val);
    dispatch({ type: 'SET_FORMULA_Y', payload: val });
  };

  const handleFormulaZChange = (val: string) => {
    setLocalFormulaZ(val);
    dispatch({ type: 'SET_FORMULA_Z', payload: val });
  };

  const selectPreset = (presetName: string) => {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      dispatch({ type: 'LOAD_PRESET', payload: preset });
    }
  };

  const setPlotMode = (mode: 'explicit' | 'parametric') => {
    dispatch({ type: 'SET_PLOT_MODE', payload: mode });
  };

  // Determine current preset name based on state formulas
  const currentPreset = PRESETS.find(p => {
    if (plotMode === 'parametric') {
      return p.plotMode === 'parametric' &&
             p.formulaX === state.config.formulaX &&
             p.formulaY === state.config.formulaY &&
             p.formulaZ === state.config.formulaZ;
    } else {
      return p.plotMode !== 'parametric' && p.formula === state.config.formula;
    }
  });

  // Local real-time validation checks for individual status marks
  const isExplicitValid = validateFormula(localFormula).valid;
  const isXValid = validateFormulaParametric(localFormulaX).valid;
  const isYValid = validateFormulaParametric(localFormulaY).valid;
  const isZValid = validateFormulaParametric(localFormulaZ).valid;

  return (
    <div className="space-y-4">
      {/* 1. Plot Mode Segmented Buttons */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Layers size={10} className="text-cyan-400" />
          <span>Graph Build Method</span>
        </label>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-800/50">
          <button
            type="button"
            onClick={() => setPlotMode('explicit')}
            className={`rounded-md py-1.5 text-xs font-semibold transition-all ${
              plotMode === 'explicit'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Explicit: f(x, y)
          </button>
          <button
            type="button"
            onClick={() => setPlotMode('parametric')}
            className={`rounded-md py-1.5 text-xs font-semibold transition-all ${
              plotMode === 'parametric'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parametric: (u, v)
          </button>
        </div>
      </div>

      {/* 2. Preset Selector Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <BookOpen size={10} className="text-cyan-400" />
          <span>Select Preset</span>
        </label>
        <select
          onChange={(e) => selectPreset(e.target.value)}
          value={currentPreset?.name || ''}
          className="w-full rounded-md glass-input px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-cyan-500 focus:outline-none"
        >
          <option value="" disabled>-- Custom Formula --</option>
          {PRESETS.filter(p => (p.plotMode || 'explicit') === plotMode).map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        {/* Preset Description */}
        {currentPreset && (
          <p className="text-[10px] text-slate-400 italic leading-relaxed px-1">
            {currentPreset.description}
          </p>
        )}
      </div>

      {/* 3. Conditional Equation Inputs */}
      {plotMode === 'explicit' ? (
        /* Explicit Equation (z = f(x, y)) */
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Equation (z = f(x, y))
          </label>
          <div className="relative">
            <textarea
              value={localFormula}
              onChange={(e) => handleFormulaChange(e.target.value)}
              className="w-full h-20 rounded-md glass-input px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
              placeholder="e.g. sin(x) * cos(y)"
              spellCheck={false}
            />
            
            {/* Real-time status indicator inside textarea */}
            <div className="absolute right-2.5 bottom-2.5">
              {!isExplicitValid || state.error ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400" title={state.error || 'Invalid formula'}>
                  <AlertCircle size={14} />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400" title="Valid formula">
                  <Check size={14} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Parametric Equations (x(u,v), y(u,v), z(u,v)) */
        <div className="space-y-3">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
            Parametric Coordinates
          </span>
          
          {/* X(u, v) Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] text-slate-500 font-medium">X coordinate function: x(u, v)</label>
              {!isXValid && (
                <span className="text-[9px] text-red-400 flex items-center gap-0.5 font-sans"><AlertCircle size={10} /> Invalid</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={localFormulaX}
                onChange={(e) => handleFormulaXChange(e.target.value)}
                className={`w-full rounded-md glass-input px-3 py-1.5 text-xs font-mono focus:ring-1 focus:outline-none pr-8 ${
                  !isXValid ? 'border-red-500/50 focus:ring-red-500' : 'focus:ring-cyan-500'
                }`}
                placeholder="e.g. cos(u) * sin(v)"
                spellCheck={false}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {isXValid ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={12} className="text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Y(u, v) Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] text-slate-500 font-medium">Y coordinate function: y(u, v)</label>
              {!isYValid && (
                <span className="text-[9px] text-red-400 flex items-center gap-0.5 font-sans"><AlertCircle size={10} /> Invalid</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={localFormulaY}
                onChange={(e) => handleFormulaYChange(e.target.value)}
                className={`w-full rounded-md glass-input px-3 py-1.5 text-xs font-mono focus:ring-1 focus:outline-none pr-8 ${
                  !isYValid ? 'border-red-500/50 focus:ring-red-500' : 'focus:ring-cyan-500'
                }`}
                placeholder="e.g. sin(u) * sin(v)"
                spellCheck={false}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {isYValid ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={12} className="text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Z(u, v) Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[9px] text-slate-500 font-medium">Z coordinate function: z(u, v)</label>
              {!isZValid && (
                <span className="text-[9px] text-red-400 flex items-center gap-0.5 font-sans"><AlertCircle size={10} /> Invalid</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={localFormulaZ}
                onChange={(e) => handleFormulaZChange(e.target.value)}
                className={`w-full rounded-md glass-input px-3 py-1.5 text-xs font-mono focus:ring-1 focus:outline-none pr-8 ${
                  !isZValid ? 'border-red-500/50 focus:ring-red-500' : 'focus:ring-cyan-500'
                }`}
                placeholder="e.g. cos(v)"
                spellCheck={false}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {isZValid ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={12} className="text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {state.error && (
        <div className="flex gap-2 rounded-md bg-red-950/40 border border-red-900/50 p-2.5 text-xs text-red-200">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Syntax Error</span>
            <p className="text-[10px] text-red-300/95 font-mono leading-normal break-all">
              {state.error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
