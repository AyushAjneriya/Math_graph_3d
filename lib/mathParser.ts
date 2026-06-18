import * as math from 'mathjs';

export interface ComplexResult {
  re: number;
  im: number;
  abs: number;
  arg: number;
}

// Parse and compile formula, caching compiled expressions for speed
const compileCache = new Map<string, math.EvalFunction>();

export const getCompiledFormula = (formula: string): math.EvalFunction => {
  const cached = compileCache.get(formula);
  if (cached) return cached;

  const parsed = math.parse(formula);
  const compiled = parsed.compile();
  compileCache.set(formula, compiled);
  return compiled;
};

// Validate the user's expression (including complex numbers)
export const validateFormula = (formula: string): { valid: boolean; error?: string } => {
  if (!formula || formula.trim() === '') {
    return { valid: false, error: 'Formula cannot be empty' };
  }

  try {
    const parsed = math.parse(formula);
    const compiled = parsed.compile();
    
    // Test evaluation with sample coordinates
    const testVal = compiled.evaluate({ x: 1, y: 1 });
    const isComplex = testVal && typeof testVal === 'object' && 're' in testVal && 'im' in testVal;
    
    if (typeof testVal !== 'number' && typeof testVal !== 'boolean' && !math.isNumeric(testVal) && !isComplex) {
      return { valid: false, error: 'Expression must return a numeric or complex value' };
    }

    if (isNaN(Number(testVal)) && !isComplex) {
      return { valid: false, error: 'Expression results in undefined/NaN value' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Invalid mathematical syntax' };
  }
};

// Validate the user's parametric expression
export const validateFormulaParametric = (formula: string): { valid: boolean; error?: string } => {
  if (!formula || formula.trim() === '') {
    return { valid: false, error: 'Formula cannot be empty' };
  }

  try {
    const parsed = math.parse(formula);
    const compiled = parsed.compile();
    
    // Test evaluation with sample parameters u, v
    const testVal = compiled.evaluate({ u: 1, v: 1 });
    const isComplex = testVal && typeof testVal === 'object' && 're' in testVal && 'im' in testVal;
    
    if (typeof testVal !== 'number' && typeof testVal !== 'boolean' && !math.isNumeric(testVal) && !isComplex) {
      return { valid: false, error: 'Expression must return a numeric or complex value' };
    }

    if (isNaN(Number(testVal)) && !isComplex) {
      return { valid: false, error: 'Expression results in undefined/NaN value' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Invalid mathematical syntax' };
  }
};

// Safely evaluate a compiled expression returning a standard number (Real part)
export const evaluateFormula = (compiled: math.EvalFunction, x: number, y: number): number => {
  try {
    const result = compiled.evaluate({ x, y });
    
    if (result && typeof result === 'object' && 're' in result) {
      return Number(result.re) || 0;
    }

    if (typeof result === 'boolean') {
      return result ? 1 : 0;
    }
    
    const num = Number(result);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  } catch {
    return 0;
  }
};

// Safely evaluate a compiled parametric expression returning a standard number (Real part)
export const evaluateFormulaParametric = (compiled: math.EvalFunction, u: number, v: number): number => {
  try {
    const result = compiled.evaluate({ u, v });
    
    if (result && typeof result === 'object' && 're' in result) {
      return Number(result.re) || 0;
    }

    if (typeof result === 'boolean') {
      return result ? 1 : 0;
    }
    
    const num = Number(result);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  } catch {
    return 0;
  }
};

// Safely evaluate a compiled expression returning full complex structure
export const evaluateFormulaComplex = (compiled: math.EvalFunction, x: number, y: number): ComplexResult => {
  try {
    const result = compiled.evaluate({ x, y });
    
    // Check if result is a complex number
    if (result && typeof result === 'object' && 're' in result && 'im' in result) {
      const re = Number(result.re);
      const im = Number(result.im);
      const abs = Math.sqrt(re * re + im * im);
      const arg = Math.atan2(im, re);
      return {
        re: isNaN(re) || !isFinite(re) ? 0 : re,
        im: isNaN(im) || !isFinite(im) ? 0 : im,
        abs: isNaN(abs) || !isFinite(abs) ? 0 : abs,
        arg: isNaN(arg) || !isFinite(arg) ? 0 : arg,
      };
    }
    
    // If it's a standard number
    if (typeof result === 'boolean') {
      const val = result ? 1 : 0;
      return { re: val, im: 0, abs: val, arg: 0 };
    }
    
    const num = Number(result);
    const val = isNaN(num) || !isFinite(num) ? 0 : num;
    return { re: val, im: 0, abs: Math.abs(val), arg: val < 0 ? Math.PI : 0 };
  } catch {
    return { re: 0, im: 0, abs: 0, arg: 0 };
  }
};

// Standard presets for the Sidebar (including complex and daily functions)
export const PRESETS = [
  {
    name: 'Sombrero (Ripple)',
    formula: 'sin(sqrt(x^2 + y^2)) / (sqrt(x^2 + y^2) + 0.001)',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    resolution: 80,
    description: 'A classic wave ripple interference pattern representing a sombrero hat shape.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Sphere (Parametric)',
    formula: '',
    formulaX: 'cos(u) * sin(v) * 4',
    formulaY: 'sin(u) * sin(v) * 4',
    formulaZ: 'cos(v) * 4',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: 0, max: 3.14 },
    resolution: 60,
    description: 'A parametric sphere. u controls horizontal angle [0, 2π], v controls vertical angle [0, π].',
    plotMode: 'parametric' as const
  },
  {
    name: 'Torus (Parametric)',
    formula: '',
    formulaX: '(4 + 1.5 * cos(v)) * cos(u)',
    formulaY: '(4 + 1.5 * cos(v)) * sin(u)',
    formulaZ: '1.5 * sin(v)',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: 0, max: 6.28 },
    resolution: 60,
    description: 'A standard donut shape. u wraps around the tube axis, v wraps around the tube ring.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Mobius Strip (Parametric)',
    formula: '',
    formulaX: '(3 + v * cos(u / 2)) * cos(u)',
    formulaY: '(3 + v * cos(u / 2)) * sin(u)',
    formulaZ: 'v * sin(u / 2)',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: -1, max: 1 },
    resolution: 60,
    description: 'A one-sided non-orientable surface. u controls the twist [0, 2π], v controls width [-1, 1].',
    plotMode: 'parametric' as const
  },
  {
    name: 'Helicoid Spiral (Parametric)',
    formula: '',
    formulaX: 'v * cos(u)',
    formulaY: 'v * sin(u)',
    formulaZ: 'u * 0.5',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: -3, max: 3 },
    resolution: 50,
    description: 'A minimal surface resembling a spiral ramp. u controls the height/rotation, v controls the radius.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Klein Bottle (Parametric)',
    formula: '',
    formulaX: '(2 + cos(u/2) * sin(v) - sin(u/2) * sin(2*v)) * cos(u) * 2',
    formulaY: '(2 + cos(u/2) * sin(v) - sin(u/2) * sin(2*v)) * sin(u) * 2',
    formulaZ: '(sin(u/2) * sin(v) + cos(u/2) * sin(2*v)) * 2',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: 0, max: 6.28 },
    resolution: 60,
    description: 'A 3D projection of the Klein bottle, a non-orientable surface with self-intersection.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Catenoid Minimal (Parametric)',
    formula: '',
    formulaX: 'cosh(v) * cos(u) * 1.5',
    formulaY: 'cosh(v) * sin(u) * 1.5',
    formulaZ: 'v * 1.5',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: -2, max: 2 },
    resolution: 50,
    description: 'A minimal surface generated by rotating a catenary curve. Represents a soap film between rings.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Dini\'s Sea Shell (Parametric)',
    formula: '',
    formulaX: 'cos(u) * sin(v) * 3',
    formulaY: 'sin(u) * sin(v) * 3',
    formulaZ: '(cos(v) + log(tan(v / 2) + 0.001) + 0.2 * u) * 1.5',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 12.56 },
    vRange: { min: 0.01, max: 2.0 },
    resolution: 75,
    description: 'A surface of constant negative curvature, visually resembling a spiral sea shell.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Enneper Surface (Parametric)',
    formula: '',
    formulaX: '(u - u^3 / 3 + u * v^2) * 1.5',
    formulaY: '(v - v^3 / 3 + v * u^2) * 1.5',
    formulaZ: '(u^2 - v^2) * 1.5',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: -2, max: 2 },
    vRange: { min: -2, max: 2 },
    resolution: 55,
    description: 'A self-intersecting minimal surface introduced by Alfred Enneper.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Astroid Torus (Parametric)',
    formula: '',
    formulaX: '(4 + cos(v)^3) * cos(u)^3',
    formulaY: '(4 + cos(v)^3) * sin(u)^3',
    formulaZ: 'sin(v)^3 * 2',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: 0, max: 6.28 },
    vRange: { min: 0, max: 6.28 },
    resolution: 60,
    description: 'A torus shape with astroidal cross-sections, creating sharp ridges/star-like contours.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Seashell Spiral (Parametric)',
    formula: '',
    formulaX: '1.1^u * (2 + cos(v)) * cos(u) * 2',
    formulaY: '1.1^u * (2 + cos(v)) * sin(u) * 2',
    formulaZ: '(1.1^u * sin(v) + 1.2 * u) * 2',
    xRange: { min: -10, max: 10 },
    yRange: { min: -10, max: 10 },
    uRange: { min: -6, max: 4 },
    vRange: { min: 0, max: 6.28 },
    resolution: 80,
    description: 'A logarithmic spiral seashell. u controls height/winding size, v wraps around the tube.',
    plotMode: 'parametric' as const
  },
  {
    name: 'Hyperbolic Paraboloid (Saddle)',
    formula: '(x^2 / 4) - (y^2 / 4)',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 60,
    description: 'A classic saddle shape. Positive curvature along X, negative curvature along Y.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Elliptic Paraboloid (Bowl)',
    formula: 'x^2 + y^2',
    xRange: { min: -4, max: 4 },
    yRange: { min: -4, max: 4 },
    resolution: 50,
    description: 'A standard bowl paraboloid, commonly used in optimization and quadratic models.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Standard Sine Wave (Trig)',
    formula: 'sin(x) * 3',
    xRange: { min: -6.28, max: 6.28 },
    yRange: { min: -6.28, max: 6.28 },
    resolution: 60,
    description: 'A pure sine wave extruded along the Y axis, showcasing periodic trigonometric behavior.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Gaussian Bell Curve (Normal)',
    formula: 'exp(-(x^2 + y^2)/5) * 5',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 70,
    description: 'The bivariate normal distribution bell curve used in probability and statistics.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Logarithmic Plane: log(x + 6)',
    formula: 'log(x + 6) + log(y + 6)',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 60,
    description: 'A combination of logarithmic curves. Offset by +6 to keep coordinates positive.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Absolute Value Pyramid',
    formula: 'abs(x) + abs(y)',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 60,
    description: 'An absolute value function creating a four-sided inverted pyramid shape.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Linear Flat Plane',
    formula: '0.5 * x + 0.5 * y',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 40,
    description: 'A simple linear plane equation, representing basic linear algebra planes.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Complex Sine Wave: sin(x + i*y)',
    formula: 'sin(x + i * y)',
    xRange: { min: -4, max: 4 },
    yRange: { min: -4, max: 4 },
    resolution: 70,
    description: 'The complex sine function. Illustrates exponential growth along the imaginary axis (Y).',
    plotMode: 'explicit' as const
  },
  {
    name: 'Complex Square Root: sqrt(x + i*y)',
    formula: 'sqrt(x + i * y)',
    xRange: { min: -5, max: 5 },
    yRange: { min: -5, max: 5 },
    resolution: 80,
    description: 'Branch cut behavior of the complex square root function.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Complex Logarithm: log(x + i*y)',
    formula: 'log(x + i * y)',
    xRange: { min: -3, max: 3 },
    yRange: { min: -3, max: 3 },
    resolution: 70,
    description: 'The natural logarithm of a complex number. Singular at the origin.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Eggcrate (Peaks)',
    formula: 'sin(x) * cos(y)',
    xRange: { min: -6.28, max: 6.28 },
    yRange: { min: -6.28, max: 6.28 },
    resolution: 80,
    description: 'Grid of peaks and valleys, looking like an egg carton.',
    plotMode: 'explicit' as const
  },
  {
    name: 'Complex Cosine Modulation',
    formula: 'cos(x * y * i)',
    xRange: { min: -2, max: 2 },
    yRange: { min: -2, max: 2 },
    resolution: 60,
    description: 'Cosine function evaluated with purely imaginary inputs, equivalent to cosh(x * y).',
    plotMode: 'explicit' as const
  }
];

