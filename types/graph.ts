export type PlotMode = 'explicit' | 'parametric';

export type ColorMap = 'viridis' | 'plasma' | 'inferno' | 'cool' | 'rainbow' | 'monochromatic';

export type RenderMode = 'solid' | 'wireframe' | 'both';

export type ComplexMode = 'real' | 'imaginary' | 'magnitude';

export interface Range {
  min: number;
  max: number;
}

export interface GraphConfig {
  plotMode: PlotMode;
  formula: string;
  formulaX: string;
  formulaY: string;
  formulaZ: string;
  xRange: Range;
  yRange: Range;
  uRange: Range;
  vRange: Range;
  resolution: number;
  colorMap: ColorMap;
  renderMode: RenderMode;
  complexMode: ComplexMode;
  animationTrigger: number;
  opacity: number;
}

export interface HoverInfo {
  x: number;
  y: number;
  z: number;
  re: number;
  im: number;
  abs: number;
  dx: number;
  dy: number;
}

export interface FunctionPreset {
  name: string;
  formula: string;
  xRange: Range;
  yRange: Range;
  resolution: number;
  description: string;
  plotMode?: PlotMode;
  formulaX?: string;
  formulaY?: string;
  formulaZ?: string;
  uRange?: Range;
  vRange?: Range;
}

