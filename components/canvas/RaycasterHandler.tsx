'use client';

import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGraph } from '../../context/GraphContext';
import { generateSurfaceData, generateParametricData, computeGradient } from '../../lib/geometryUtils';
import { evaluateFormulaComplex } from '../../lib/mathParser';
import { ThreeEvent } from '@react-three/fiber';
import { HoverInfo } from '../../types/graph';
import * as THREE from 'three';

interface RaycasterHandlerProps {
  setHoverInfo: (info: HoverInfo | null) => void;
}

export default function RaycasterHandler({ setHoverInfo }: RaycasterHandlerProps) {
  const { state } = useGraph();
  const {
    plotMode,
    xRange,
    yRange,
    uRange,
    vRange,
    resolution,
    colorMap,
    complexMode,
  } = state.config;
  const { compiled, compiledX, compiledY, compiledZ } = state;

  // Re-generate same geometry structure for accurate raycasting hits
  const surfaceData = useMemo(() => {
    if (plotMode === 'parametric') {
      return generateParametricData(
        compiledX,
        compiledY,
        compiledZ,
        uRange,
        vRange,
        resolution,
        colorMap
      );
    } else {
      return generateSurfaceData(
        compiled,
        xRange,
        yRange,
        resolution,
        colorMap,
        complexMode
      );
    }
  }, [
    plotMode,
    compiled,
    compiledX,
    compiledY,
    compiledZ,
    xRange,
    yRange,
    uRange,
    vRange,
    resolution,
    colorMap,
    complexMode,
  ]);

  // Unique key to rebuild intersection mesh when bounds change
  const meshKey = useMemo(() => {
    return `${plotMode}_${xRange.min}_${xRange.max}_${yRange.min}_${yRange.max}_${uRange.min}_${uRange.max}_${vRange.min}_${vRange.max}_${resolution}_${complexMode}`;
  }, [
    plotMode,
    xRange.min,
    xRange.max,
    yRange.min,
    yRange.max,
    uRange.min,
    uRange.max,
    vRange.min,
    vRange.max,
    resolution,
    complexMode,
  ]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    
    if (e.intersections.length === 0) return;
    
    // Get the exact intersection point in 3D space
    const point = e.intersections[0].point;
    
    // Coordinates mapping:
    // Math X = Three.js X
    // Math Y = Three.js Z
    // Math Z = Three.js Y (height)
    const mathX = point.x;
    const mathY = point.z;
    const mathZ = point.y;
    
    let re = mathZ;
    let im = 0;
    let abs = Math.abs(mathZ);
    let dx = 0;
    let dy = 0;

    if (plotMode === 'explicit') {
      const comp = evaluateFormulaComplex(compiled, mathX, mathY);
      re = comp.re;
      im = comp.im;
      abs = comp.abs;
      
      const grad = computeGradient(compiled, mathX, mathY);
      dx = grad.dx;
      dy = grad.dy;
    }

    setHoverInfo({
      x: mathX,
      y: mathY,
      z: mathZ, // This represents Math Z (height)
      re,
      im,
      abs,
      dx,
      dy,
    });
  };

  const handlePointerOut = () => {
    setHoverInfo(null);
  };

  return (
    <mesh
      key={`raycast-${meshKey}`}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[surfaceData.positions, 3]}
          count={surfaceData.positions.length / 3}
          array={surfaceData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          args={[surfaceData.indices, 1]}
          count={surfaceData.indices.length}
          array={surfaceData.indices}
          itemSize={1}
        />
      </bufferGeometry>
      {/* Completely invisible mesh, only used for mouse raycast hits */}
      <meshBasicMaterial 
        visible={false} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}
