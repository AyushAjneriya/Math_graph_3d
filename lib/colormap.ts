import { ColorMap } from '../types/graph';

// Simple RGB interpolation
const interpolate = (colorA: [number, number, number], colorB: [number, number, number], t: number): [number, number, number] => {
  return [
    colorA[0] + (colorB[0] - colorA[0]) * t,
    colorA[1] + (colorB[1] - colorA[1]) * t,
    colorA[2] + (colorB[2] - colorA[2]) * t,
  ];
};

// Viridis colormap approximation (Purple -> Blue -> Green -> Yellow)
const getViridis = (t: number): [number, number, number] => {
  if (t < 0.25) {
    return interpolate([0.267, 0.004, 0.329], [0.19, 0.272, 0.536], t / 0.25);
  } else if (t < 0.5) {
    return interpolate([0.19, 0.272, 0.536], [0.127, 0.566, 0.55], (t - 0.25) / 0.25);
  } else if (t < 0.75) {
    return interpolate([0.127, 0.566, 0.55], [0.368, 0.788, 0.382], (t - 0.5) / 0.25);
  } else {
    return interpolate([0.368, 0.788, 0.382], [0.993, 0.906, 0.143], (t - 0.75) / 0.25);
  }
};

// Plasma colormap approximation (Blue -> Purple -> Pink -> Orange -> Yellow)
const getPlasma = (t: number): [number, number, number] => {
  if (t < 0.25) {
    return interpolate([0.05, 0.03, 0.53], [0.45, 0.04, 0.67], t / 0.25);
  } else if (t < 0.5) {
    return interpolate([0.45, 0.04, 0.67], [0.76, 0.17, 0.5], (t - 0.25) / 0.25);
  } else if (t < 0.75) {
    return interpolate([0.76, 0.17, 0.5], [0.96, 0.47, 0.26], (t - 0.5) / 0.25);
  } else {
    return interpolate([0.96, 0.47, 0.26], [0.94, 0.9, 0.14], (t - 0.75) / 0.25);
  }
};

// Inferno colormap approximation (Black -> Purple -> Red -> Orange -> Yellow)
const getInferno = (t: number): [number, number, number] => {
  if (t < 0.2) {
    return interpolate([0.001, 0.001, 0.001], [0.15, 0.04, 0.29], t / 0.2);
  } else if (t < 0.4) {
    return interpolate([0.15, 0.04, 0.29], [0.47, 0.1, 0.35], (t - 0.2) / 0.2);
  } else if (t < 0.6) {
    return interpolate([0.47, 0.1, 0.35], [0.78, 0.23, 0.23], (t - 0.4) / 0.2);
  } else if (t < 0.8) {
    return interpolate([0.78, 0.23, 0.23], [0.96, 0.56, 0.14], (t - 0.6) / 0.2);
  } else {
    return interpolate([0.96, 0.56, 0.14], [0.98, 0.95, 0.12], (t - 0.8) / 0.2);
  }
};

// Cool colormap (Cyan to Magenta)
const getCool = (t: number): [number, number, number] => {
  return interpolate([0.0, 1.0, 1.0], [1.0, 0.0, 1.0], t);
};

// Rainbow colormap
const getRainbow = (t: number): [number, number, number] => {
  if (t < 0.2) {
    return interpolate([1.0, 0.0, 0.0], [1.0, 0.5, 0.0], t / 0.2); // Red to Orange
  } else if (t < 0.4) {
    return interpolate([1.0, 0.5, 0.0], [1.0, 1.0, 0.0], (t - 0.2) / 0.2); // Orange to Yellow
  } else if (t < 0.6) {
    return interpolate([1.0, 1.0, 0.0], [0.0, 1.0, 0.0], (t - 0.4) / 0.2); // Yellow to Green
  } else if (t < 0.8) {
    return interpolate([0.0, 1.0, 0.0], [0.0, 0.0, 1.0], (t - 0.6) / 0.2); // Green to Blue
  } else {
    return interpolate([0.0, 0.0, 1.0], [0.5, 0.0, 0.5], (t - 0.8) / 0.2); // Blue to Violet
  }
};

// Monochromatic (Sleek dark cyan to bright neon cyan-white)
const getMonochromatic = (t: number): [number, number, number] => {
  return interpolate([0.05, 0.15, 0.2], [0.2, 0.9, 1.0], t);
};

// Main function to get color based on map type and normalized value
export const getColorFromMap = (colorMap: ColorMap, t: number): [number, number, number] => {
  // Clamp value to [0, 1]
  const val = Math.max(0, Math.min(1, t));

  switch (colorMap) {
    case 'viridis':
      return getViridis(val);
    case 'plasma':
      return getPlasma(val);
    case 'inferno':
      return getInferno(val);
    case 'cool':
      return getCool(val);
    case 'rainbow':
      return getRainbow(val);
    case 'monochromatic':
      return getMonochromatic(val);
    default:
      return getViridis(val);
  }
};
