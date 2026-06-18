'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGraph as useGraphContext } from '../../context/GraphContext';
import { generateSurfaceData, generateParametricData } from '../../lib/geometryUtils';
import * as THREE from 'three';

import { useFrame as useR3FFrame } from '@react-three/fiber';

export default function GraphSurface() {
  const { state } = useGraphContext();
  const {
    plotMode,
    xRange,
    yRange,
    uRange,
    vRange,
    resolution,
    colorMap,
    renderMode,
    complexMode,
    animationTrigger,
    opacity,
  } = state.config;
  const { compiled, compiledX, compiledY, compiledZ } = state;

  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const wireGeometryRef = useRef<THREE.BufferGeometry>(null);
  const scanLineRef = useRef<any>(null);

  const progressRef = useRef(0);
  const lastTriggerRef = useRef(animationTrigger);

  // Compute positions, colors, indices based on current state parameters
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

  // Recalculate vertex normals whenever geometry changes to ensure correct lighting calculations
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeVertexNormals();
    }
    if (wireGeometryRef.current) {
      wireGeometryRef.current.computeVertexNormals();
    }
  }, [surfaceData]);

  // Listen to animation triggers
  useEffect(() => {
    progressRef.current = 0; // Reset animation
    lastTriggerRef.current = animationTrigger;
  }, [animationTrigger]);

  // Also reset animation when formula, ranges or resolution change
  useEffect(() => {
    progressRef.current = 0;
  }, [
    plotMode,
    compiled,
    compiledX,
    compiledY,
    compiledZ,
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

  // Frame animation loop to update vertex heights and scan line position
  useR3FFrame((state, delta) => {
    // 1. Handle animation triggers
    if (animationTrigger !== lastTriggerRef.current) {
      progressRef.current = 0;
      lastTriggerRef.current = animationTrigger;
    }

    // 2. Increment progress (takes ~2 seconds for full formation)
    if (progressRef.current < 1.0) {
      progressRef.current = Math.min(1.0, progressRef.current + delta * 0.45);
    }

    const t = progressRef.current;

    // 3. Update vertex heights for the solid mesh
    if (geometryRef.current) {
      const posAttr = geometryRef.current.attributes.position;
      const positions = posAttr.array as Float32Array;
      const originalPositions = surfaceData.positions;
      const delays = surfaceData.delays;
      const count = originalPositions.length / 3;

      for (let i = 0; i < count; i++) {
        const z_actual = originalPositions[i * 3 + 1]; // Three.js Y is height
        const delay = delays[i];
        const localT = Math.max(0, Math.min(1.0, (t - delay) / 0.25));
        const easedT = localT * localT * (3.0 - 2.0 * localT);

        // Animate height (Three.js Y is height, mapped to index + 1 in positions array)
        positions[i * 3 + 1] = z_actual * easedT;
      }

      posAttr.needsUpdate = true;
    }

    // 4. Update vertex heights for the wireframe mesh
    if (wireGeometryRef.current) {
      const posAttr = wireGeometryRef.current.attributes.position;
      const positions = posAttr.array as Float32Array;
      const originalPositions = surfaceData.positions;
      const delays = surfaceData.delays;
      const count = originalPositions.length / 3;

      for (let i = 0; i < count; i++) {
        const z_actual = originalPositions[i * 3 + 1];
        const delay = delays[i];
        const localT = Math.max(0, Math.min(1.0, (t - delay) / 0.25));
        const easedT = localT * localT * (3.0 - 2.0 * localT);

        positions[i * 3 + 1] = z_actual * easedT;
      }

      posAttr.needsUpdate = true;
    }

    // 5. Update scan line indicator
    if (scanLineRef.current) {
      if (t < 1.0) {
        scanLineRef.current.visible = true;
        
        let rangeMin = xRange.min;
        let rangeMax = xRange.max;
        
        if (plotMode === 'parametric') {
          // Approximate bounding box of X coordinate for sweep line placement
          let minX = Infinity;
          let maxX = -Infinity;
          for (let k = 0; k < surfaceData.positions.length; k += 3) {
            const x = surfaceData.positions[k];
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
          rangeMin = isFinite(minX) ? minX : -5;
          rangeMax = isFinite(maxX) ? maxX : 5;
        }
        
        const sweepX = rangeMin + t * (rangeMax - rangeMin);
        scanLineRef.current.position.x = sweepX;
      } else {
        scanLineRef.current.visible = false;
      }
    }
  });

  // Unique key to force React to recreate the mesh when geometry parameters change
  const meshKey = useMemo(() => {
    return `${plotMode}_${xRange.min}_${xRange.max}_${yRange.min}_${yRange.max}_${uRange.min}_${uRange.max}_${vRange.min}_${vRange.max}_${resolution}_${colorMap}_${complexMode}`;
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
    colorMap,
    complexMode,
  ]);

  const showSolid = renderMode === 'solid' || renderMode === 'both';
  const showWireframe = renderMode === 'wireframe' || renderMode === 'both';

  return (
    <group>
      {/* 1. Solid Colored Surface */}
      {showSolid && (
        <mesh key={`solid-${meshKey}`} castShadow receiveShadow>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[surfaceData.positions.slice(), 3]} // Copy so original array is not mutated
              count={surfaceData.positions.length / 3}
              array={surfaceData.positions.slice()}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[surfaceData.colors, 3]}
              count={surfaceData.colors.length / 3}
              array={surfaceData.colors}
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
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.25}
            metalness={0.05}
            transparent
            opacity={opacity}
            flatShading={false}
          />
        </mesh>
      )}

      {/* 2. Wireframe Overlay / Standalone Wireframe */}
      {showWireframe && (
        <mesh key={`wire-${meshKey}`}>
          <bufferGeometry ref={wireGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[surfaceData.positions.slice(), 3]} // Copy so original array is not mutated
              count={surfaceData.positions.length / 3}
              array={surfaceData.positions.slice()}
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
          <meshBasicMaterial
            color={renderMode === 'both' ? '#080c14' : '#22d3ee'}
            wireframe
            transparent
            opacity={renderMode === 'both' ? 0.25 : opacity}
            side={THREE.DoubleSide}
            depthWrite={renderMode !== 'both'} // Prevents z-fighting on overlays
          />
        </mesh>
      )}

      {/* 3. Glowing Neon Scan Line */}
      <line {...({ ref: scanLineRef, visible: false } as any)}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0, -10, yRange.min,
                0, 10, yRange.max
              ]),
              3
            ]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" linewidth={4} />
      </line>
    </group>
  );
}
