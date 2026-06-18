'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GraphConfig, HoverInfo, ColorMap, RenderMode, ComplexMode, PlotMode, Range, FunctionPreset } from '../types/graph';
import { getCompiledFormula, validateFormula, validateFormulaParametric, PRESETS } from '../lib/mathParser';
import * as math from 'mathjs';

interface State {
  config: GraphConfig;
  compiled: math.EvalFunction;
  compiledX: math.EvalFunction;
  compiledY: math.EvalFunction;
  compiledZ: math.EvalFunction;
  error: string | null;
  hoverInfo: HoverInfo | null;
}

type Action =
  | { type: 'SET_FORMULA'; payload: string }
  | { type: 'SET_PLOT_MODE'; payload: PlotMode }
  | { type: 'SET_FORMULA_X'; payload: string }
  | { type: 'SET_FORMULA_Y'; payload: string }
  | { type: 'SET_FORMULA_Z'; payload: string }
  | { type: 'SET_X_RANGE'; payload: Range }
  | { type: 'SET_Y_RANGE'; payload: Range }
  | { type: 'SET_U_RANGE'; payload: Range }
  | { type: 'SET_V_RANGE'; payload: Range }
  | { type: 'SET_RESOLUTION'; payload: number }
  | { type: 'SET_COLORMAP'; payload: ColorMap }
  | { type: 'SET_RENDER_MODE'; payload: RenderMode }
  | { type: 'SET_COMPLEX_MODE'; payload: ComplexMode }
  | { type: 'SET_OPACITY'; payload: number }
  | { type: 'SET_HOVER_INFO'; payload: HoverInfo | null }
  | { type: 'TRIGGER_ANIMATION' }
  | { type: 'LOAD_PRESET'; payload: FunctionPreset };

const defaultPreset = PRESETS[0]; // Sombrero

const initialState: State = {
  config: {
    plotMode: 'explicit',
    formula: defaultPreset.formula,
    formulaX: 'cos(u) * sin(v) * 4',
    formulaY: 'sin(u) * sin(v) * 4',
    formulaZ: 'cos(v) * 4',
    xRange: defaultPreset.xRange,
    yRange: defaultPreset.yRange,
    uRange: { min: 0, max: 6.28 },
    vRange: { min: 0, max: 3.14 },
    resolution: defaultPreset.resolution,
    colorMap: 'viridis',
    renderMode: 'solid',
    complexMode: 'real',
    animationTrigger: 0,
    opacity: 0.9,
  },
  compiled: getCompiledFormula(defaultPreset.formula),
  compiledX: getCompiledFormula('cos(u) * sin(v) * 4'),
  compiledY: getCompiledFormula('sin(u) * sin(v) * 4'),
  compiledZ: getCompiledFormula('cos(v) * 4'),
  error: null,
  hoverInfo: null,
};

const graphReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FORMULA': {
      const validation = validateFormula(action.payload);
      if (validation.valid) {
        try {
          const compiled = getCompiledFormula(action.payload);
          return {
            ...state,
            config: { 
              ...state.config, 
              formula: action.payload,
              animationTrigger: state.config.animationTrigger + 1
            },
            compiled,
            error: null,
          };
        } catch (err: any) {
          return {
            ...state,
            config: { ...state.config, formula: action.payload },
            error: err.message || 'Compilation failed',
          };
        }
      }
      return {
        ...state,
        config: { ...state.config, formula: action.payload },
        error: validation.error || 'Invalid formula',
      };
    }
    case 'SET_PLOT_MODE':
      return {
        ...state,
        config: {
          ...state.config,
          plotMode: action.payload,
          animationTrigger: state.config.animationTrigger + 1
        },
        error: null,
        hoverInfo: null
      };
    case 'SET_FORMULA_X': {
      const validation = validateFormulaParametric(action.payload);
      if (validation.valid) {
        try {
          const compiledX = getCompiledFormula(action.payload);
          return {
            ...state,
            config: { 
              ...state.config, 
              formulaX: action.payload,
              animationTrigger: state.config.animationTrigger + 1
            },
            compiledX,
            error: null,
          };
        } catch (err: any) {
          return {
            ...state,
            config: { ...state.config, formulaX: action.payload },
            error: err.message || 'Compilation failed for X',
          };
        }
      }
      return {
        ...state,
        config: { ...state.config, formulaX: action.payload },
        error: validation.error || 'Invalid formula for X',
      };
    }
    case 'SET_FORMULA_Y': {
      const validation = validateFormulaParametric(action.payload);
      if (validation.valid) {
        try {
          const compiledY = getCompiledFormula(action.payload);
          return {
            ...state,
            config: { 
              ...state.config, 
              formulaY: action.payload,
              animationTrigger: state.config.animationTrigger + 1
            },
            compiledY,
            error: null,
          };
        } catch (err: any) {
          return {
            ...state,
            config: { ...state.config, formulaY: action.payload },
            error: err.message || 'Compilation failed for Y',
          };
        }
      }
      return {
        ...state,
        config: { ...state.config, formulaY: action.payload },
        error: validation.error || 'Invalid formula for Y',
      };
    }
    case 'SET_FORMULA_Z': {
      const validation = validateFormulaParametric(action.payload);
      if (validation.valid) {
        try {
          const compiledZ = getCompiledFormula(action.payload);
          return {
            ...state,
            config: { 
              ...state.config, 
              formulaZ: action.payload,
              animationTrigger: state.config.animationTrigger + 1
            },
            compiledZ,
            error: null,
          };
        } catch (err: any) {
          return {
            ...state,
            config: { ...state.config, formulaZ: action.payload },
            error: err.message || 'Compilation failed for Z',
          };
        }
      }
      return {
        ...state,
        config: { ...state.config, formulaZ: action.payload },
        error: validation.error || 'Invalid formula for Z',
      };
    }
    case 'SET_X_RANGE':
      return {
        ...state,
        config: { ...state.config, xRange: action.payload },
      };
    case 'SET_Y_RANGE':
      return {
        ...state,
        config: { ...state.config, yRange: action.payload },
      };
    case 'SET_U_RANGE':
      return {
        ...state,
        config: { ...state.config, uRange: action.payload },
      };
    case 'SET_V_RANGE':
      return {
        ...state,
        config: { ...state.config, vRange: action.payload },
      };
    case 'SET_RESOLUTION':
      return {
        ...state,
        config: { ...state.config, resolution: action.payload },
      };
    case 'SET_COLORMAP':
      return {
        ...state,
        config: { ...state.config, colorMap: action.payload },
      };
    case 'SET_RENDER_MODE':
      return {
        ...state,
        config: { ...state.config, renderMode: action.payload },
      };
    case 'SET_COMPLEX_MODE':
      return {
        ...state,
        config: { ...state.config, complexMode: action.payload },
      };
    case 'SET_OPACITY':
      return {
        ...state,
        config: { ...state.config, opacity: action.payload },
      };
    case 'SET_HOVER_INFO':
      return {
        ...state,
        hoverInfo: action.payload,
      };
    case 'TRIGGER_ANIMATION':
      return {
        ...state,
        config: { ...state.config, animationTrigger: state.config.animationTrigger + 1 },
      };
    case 'LOAD_PRESET': {
      const preset = action.payload;
      try {
        const plotMode = preset.plotMode || 'explicit';
        if (plotMode === 'parametric') {
          const compiledX = getCompiledFormula(preset.formulaX || 'u');
          const compiledY = getCompiledFormula(preset.formulaY || 'v');
          const compiledZ = getCompiledFormula(preset.formulaZ || '0');
          return {
            ...state,
            config: {
              ...state.config,
              plotMode: 'parametric',
              formulaX: preset.formulaX || 'u',
              formulaY: preset.formulaY || 'v',
              formulaZ: preset.formulaZ || '0',
              uRange: preset.uRange || { min: 0, max: 6.28 },
              vRange: preset.vRange || { min: 0, max: 6.28 },
              resolution: preset.resolution,
              animationTrigger: state.config.animationTrigger + 1,
            },
            compiledX,
            compiledY,
            compiledZ,
            error: null,
            hoverInfo: null,
          };
        } else {
          const compiled = getCompiledFormula(preset.formula || '0');
          return {
            ...state,
            config: {
              ...state.config,
              plotMode: 'explicit',
              formula: preset.formula || '0',
              xRange: preset.xRange || { min: -5, max: 5 },
              yRange: preset.yRange || { min: -5, max: 5 },
              resolution: preset.resolution,
              animationTrigger: state.config.animationTrigger + 1,
            },
            compiled,
            error: null,
            hoverInfo: null,
          };
        }
      } catch (err: any) {
        const plotMode = preset.plotMode || 'explicit';
        return {
          ...state,
          config: {
            ...state.config,
            plotMode,
            formula: preset.formula || '',
            formulaX: preset.formulaX || '',
            formulaY: preset.formulaY || '',
            formulaZ: preset.formulaZ || '',
            xRange: preset.xRange || state.config.xRange,
            yRange: preset.yRange || state.config.yRange,
            uRange: preset.uRange || state.config.uRange,
            vRange: preset.vRange || state.config.vRange,
            resolution: preset.resolution,
          },
          error: err.message || 'Preset compilation failed',
        };
      }
    }
    default:
      return state;
  }
};

const GraphContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(graphReducer, initialState);

  return (
    <GraphContext.Provider value={{ state, dispatch }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};
