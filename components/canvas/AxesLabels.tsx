'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useGraph } from '../../context/GraphContext';
import * as THREE from 'three';

export default function AxesLabels() {
  const { state } = useGraph();
  const { xRange, yRange } = state.config;

  // Compute lengths based on domain range limits
  const xLength = Math.max(Math.abs(xRange.min), Math.abs(xRange.max)) + 2;
  const yLength = Math.max(Math.abs(yRange.min), Math.abs(yRange.max)) + 2;
  const zHeight = 8; // Constant height for vertical axis

  return (
    <group>
      {/* 1. Ground Grid (Three.js X-Z plane, which corresponds to Math X-Y) */}
      <gridHelper
        args={[xLength * 2, 30, '#06b6d4', '#082f49']}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      {/* 2. Math X-Axis (Three.js X, colored Neon Rose) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -xLength, 0, 0,
                xLength, 0, 0
              ]),
              3
            ]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f43f5e" linewidth={2} />
      </line>

      {/* Math X-Axis Labels */}
      <Html position={[xLength + 0.5, 0, 0]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-rose-950/90 border border-rose-500/50 text-rose-400 font-mono shadow-[0_0_8px_rgba(244,63,94,0.3)] select-none pointer-events-none uppercase tracking-widest">
          +X
        </span>
      </Html>
      <Html position={[-xLength - 0.5, 0, 0]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-rose-950/90 border border-rose-500/50 text-rose-400 font-mono shadow-[0_0_8px_rgba(244,63,94,0.3)] select-none pointer-events-none uppercase tracking-widest">
          -X
        </span>
      </Html>

      {/* 3. Math Y-Axis (Three.js Z, colored Neon Green) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0, 0, -yLength,
                0, 0, yLength
              ]),
              3
            ]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#10b981" linewidth={2} />
      </line>

      {/* Math Y-Axis Labels */}
      <Html position={[0, 0, yLength + 0.5]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-mono shadow-[0_0_8px_rgba(16,185,129,0.3)] select-none pointer-events-none uppercase tracking-widest">
          +Y
        </span>
      </Html>
      <Html position={[0, 0, -yLength - 0.5]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-mono shadow-[0_0_8px_rgba(16,185,129,0.3)] select-none pointer-events-none uppercase tracking-widest">
          -Y
        </span>
      </Html>

      {/* 4. Math Z-Axis / Height (Three.js Y, colored Neon Cyan) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0, -zHeight, 0,
                0, zHeight, 0
              ]),
              3
            ]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#06b6d4" linewidth={2} />
      </line>

      {/* Math Z-Axis Labels */}
      <Html position={[0, zHeight + 0.4, 0]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 font-mono shadow-[0_0_8px_rgba(6,182,212,0.3)] select-none pointer-events-none uppercase tracking-widest">
          +Z (Height)
        </span>
      </Html>
      <Html position={[0, -zHeight - 0.4, 0]} center>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 font-mono shadow-[0_0_8px_rgba(6,182,212,0.3)] select-none pointer-events-none uppercase tracking-widest">
          -Z
        </span>
      </Html>
    </group>
  );
}
