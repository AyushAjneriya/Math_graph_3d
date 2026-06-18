import { evaluateFormula, evaluateFormulaComplex, evaluateFormulaParametric } from './mathParser';
import { getColorFromMap } from './colormap';
import { ColorMap, ComplexMode } from '../types/graph';

// Compute finite difference gradient at (x, y)
export const computeGradient = (
  compiled: math.EvalFunction,
  x: number,
  y: number,
  h = 0.001
): { dx: number; dy: number } => {
  // Use real part of complex evaluation for gradient slopes
  const zPlusX = evaluateFormulaComplex(compiled, x + h, y).re;
  const zMinusX = evaluateFormulaComplex(compiled, x - h, y).re;
  const zPlusY = evaluateFormulaComplex(compiled, x, y + h).re;
  const zMinusY = evaluateFormulaComplex(compiled, x, y - h).re;

  const dx = (zPlusX - zMinusX) / (2 * h);
  const dy = (zPlusY - zMinusY) / (2 * h);

  return {
    dx: isNaN(dx) || !isFinite(dx) ? 0 : dx,
    dy: isNaN(dy) || !isFinite(dy) ? 0 : dy
  };
};

export interface SurfaceData {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
  zMin: number;
  zMax: number;
  delays: Float32Array;
}

// Generate raw data for Three.js BufferGeometry (Explicit z = f(x, y))
export const generateSurfaceData = (
  compiled: math.EvalFunction,
  xRange: { min: number; max: number },
  yRange: { min: number; max: number },
  resolution: number,
  colorMap: ColorMap,
  complexMode: ComplexMode
): SurfaceData => {
  const N = Math.floor(resolution);
  const vertexCount = N * N;
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const delays = new Float32Array(vertexCount);
  
  const xMin = xRange.min;
  const xMax = xRange.max;
  const yMin = yRange.min;
  const yMax = yRange.max;

  const dx = (xMax - xMin) / (N - 1);
  const dy = (yMax - yMin) / (N - 1);

  let zMin = Infinity;
  let zMax = -Infinity;

  // 1. First pass: compute positions and find min/max Z
  for (let i = 0; i < N; i++) {
    const x = xMin + i * dx;
    for (let j = 0; j < N; j++) {
      const y = yMin + j * dy;
      const comp = evaluateFormulaComplex(compiled, x, y);
      
      let z = comp.re;
      if (complexMode === 'imaginary') {
        z = comp.im;
      } else if (complexMode === 'magnitude') {
        z = comp.abs;
      }

      const index = (i * N + j) * 3;
      // Coordinates mapping:
      // Three.js X = Math X
      // Three.js Y = Math Z (height)
      // Three.js Z = Math Y
      positions[index] = x;
      positions[index + 1] = z; // Three.js Y is height
      positions[index + 2] = y; // Three.js Z is Math Y

      // Precalculate delays for animation sweep based on normalized X coordinate
      const xNorm = (x - xMin) / (xMax - xMin);
      delays[i * N + j] = xNorm * 0.75;

      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }
  }

  // Handle case where surface is flat
  if (zMin === zMax) {
    zMin -= 0.5;
    zMax += 0.5;
  }

  const zDiff = zMax - zMin;

  // 2. Second pass: compute colors based on height
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const index = (i * N + j) * 3;
      const z = positions[index + 1]; // Height is Three.js Y (index + 1)
      
      // Normalize height to [0, 1]
      const t = (z - zMin) / zDiff;
      const rgb = getColorFromMap(colorMap, t);

      colors[index] = rgb[0];
      colors[index + 1] = rgb[1];
      colors[index + 2] = rgb[2];
    }
  }

  // 3. Generate index buffer for triangles
  const indicesCount = (N - 1) * (N - 1) * 6;
  const indices = new Uint32Array(indicesCount);
  let indexOffset = 0;

  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - 1; j++) {
      const v00 = i * N + j;
      const v01 = v00 + 1;
      const v10 = (i + 1) * N + j;
      const v11 = v10 + 1;

      // Triangle 1
      indices[indexOffset++] = v00;
      indices[indexOffset++] = v10;
      indices[indexOffset++] = v01;

      // Triangle 2
      indices[indexOffset++] = v01;
      indices[indexOffset++] = v10;
      indices[indexOffset++] = v11;
    }
  }

  return {
    positions,
    colors,
    indices,
    zMin,
    zMax,
    delays
  };
};

// Generate raw data for Three.js BufferGeometry (Parametric u, v)
export const generateParametricData = (
  compiledX: math.EvalFunction,
  compiledY: math.EvalFunction,
  compiledZ: math.EvalFunction,
  uRange: { min: number; max: number },
  vRange: { min: number; max: number },
  resolution: number,
  colorMap: ColorMap
): SurfaceData => {
  const N = Math.floor(resolution);
  const vertexCount = N * N;
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const delays = new Float32Array(vertexCount);
  
  const uMin = uRange.min;
  const uMax = uRange.max;
  const vMin = vRange.min;
  const vMax = vRange.max;

  const du = (uMax - uMin) / (N - 1);
  const dv = (vMax - vMin) / (N - 1);

  let zMin = Infinity;
  let zMax = -Infinity;

  // 1. First pass: compute positions and find min/max height (Math Z -> Three.js Y)
  for (let i = 0; i < N; i++) {
    const u = uMin + i * du;
    for (let j = 0; j < N; j++) {
      const v = vMin + j * dv;
      
      const xVal = evaluateFormulaParametric(compiledX, u, v);
      const yVal = evaluateFormulaParametric(compiledY, u, v);
      const zVal = evaluateFormulaParametric(compiledZ, u, v); // This is height in Math coordinate space

      const index = (i * N + j) * 3;
      // Coordinates mapping:
      // Three.js X = Math X
      // Three.js Y = Math Z (height)
      // Three.js Z = Math Y
      positions[index] = xVal;
      positions[index + 1] = zVal; // height -> Three.js Y
      positions[index + 2] = yVal; // y -> Three.js Z

      // Precalculate delays based on parameter u normalized
      const uNorm = uMax === uMin ? 0 : (u - uMin) / (uMax - uMin);
      delays[i * N + j] = uNorm * 0.75;

      if (zVal < zMin) zMin = zVal;
      if (zVal > zMax) zMax = zVal;
    }
  }

  // Handle case where surface is flat
  if (zMin === zMax) {
    zMin -= 0.5;
    zMax += 0.5;
  }

  const zDiff = zMax - zMin;

  // 2. Second pass: compute colors based on height
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const index = (i * N + j) * 3;
      const zVal = positions[index + 1]; // Three.js Y is height
      
      // Normalize height to [0, 1]
      const t = (zVal - zMin) / zDiff;
      const rgb = getColorFromMap(colorMap, t);

      colors[index] = rgb[0];
      colors[index + 1] = rgb[1];
      colors[index + 2] = rgb[2];
    }
  }

  // 3. Generate index buffer for triangles
  const indicesCount = (N - 1) * (N - 1) * 6;
  const indices = new Uint32Array(indicesCount);
  let indexOffset = 0;

  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - 1; j++) {
      const v00 = i * N + j;
      const v01 = v00 + 1;
      const v10 = (i + 1) * N + j;
      const v11 = v10 + 1;

      // Triangle 1
      indices[indexOffset++] = v00;
      indices[indexOffset++] = v10;
      indices[indexOffset++] = v01;

      // Triangle 2
      indices[indexOffset++] = v01;
      indices[indexOffset++] = v10;
      indices[indexOffset++] = v11;
    }
  }

  return {
    positions,
    colors,
    indices,
    zMin,
    zMax,
    delays
  };
};

