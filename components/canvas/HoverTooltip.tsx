'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useGraph } from '../../context/GraphContext';
import { HoverInfo } from '../../types/graph';
import { Compass, Zap } from 'lucide-react';

interface HoverTooltipProps {
  hoverInfo: HoverInfo | null;
}

export default function HoverTooltip({ hoverInfo }: HoverTooltipProps) {
  const { state } = useGraph();
  const { plotMode } = state.config;

  if (!hoverInfo) return null;

  // Coordinates mapping:
  // Math X = Three.js X
  // Math Y = Three.js Z
  // Math Z = Three.js Y (height)
  const threeX = hoverInfo.x;
  const threeY = hoverInfo.z;
  const threeZ = hoverInfo.y;

  return (
    <group>
      {/* 1. Dynamic Cursor Indicator (Glowing Sphere) */}
      <mesh position={[threeX, threeY, threeZ]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* 2. Outer Halo ring for premium look */}
      <mesh position={[threeX, threeY, threeZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.16, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={2} />
      </mesh>

      {/* 3. HTML Tooltip Card anchored at the hovered vertex */}
      <Html
        position={[threeX, threeY + 0.3, threeZ]} // Elevate tooltip slightly above intersection point
        center
        distanceFactor={12} // Scale tooltip text relative to zoom/distance
        pointerEvents="none" // Ensure mouse actions pass through tooltip to canvas
      >
        <div className="glass-panel w-48 rounded-lg p-3 text-[10px] text-slate-100 shadow-2xl border border-cyan-500/20 pointer-events-none select-none animate-in fade-in zoom-in duration-100">
          {/* Header */}
          <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-1.5 mb-2 font-semibold text-cyan-400">
            <Compass size={12} />
            <span>Surface Coordinates</span>
          </div>

          {/* Coordinates grid */}
          <div className="grid grid-cols-2 gap-y-0.5 font-mono text-[10px] mb-1.5 border-b border-slate-800/40 pb-1.5">
            <span className="text-slate-400 font-sans">X:</span>
            <span className="text-right text-slate-200">{hoverInfo.x.toFixed(4)}</span>
            
            <span className="text-slate-400 font-sans">Y:</span>
            <span className="text-right text-slate-200">{hoverInfo.y.toFixed(4)}</span>

            {plotMode === 'parametric' && (
              <>
                <span className="text-cyan-400 font-sans font-bold">Z (Height):</span>
                <span className="text-right text-cyan-300 font-bold">{hoverInfo.z.toFixed(4)}</span>
              </>
            )}
          </div>

          {plotMode === 'explicit' && (
            <>
              <div className="grid grid-cols-2 gap-y-0.5 font-mono text-[10px] mb-2">
                <span className="text-slate-400 font-sans">Real Re(z):</span>
                <span className="text-right text-slate-200">{hoverInfo.re.toFixed(4)}</span>
                
                <span className="text-slate-400 font-sans">Imag Im(z):</span>
                <span className="text-right text-slate-200">{hoverInfo.im.toFixed(4)}i</span>
                
                <span className="text-cyan-400 font-sans font-bold">Mag |z|:</span>
                <span className="text-right text-cyan-300 font-bold">{hoverInfo.abs.toFixed(4)}</span>
              </div>

              {/* Local gradient slope values */}
              <div className="border-t border-slate-800/60 pt-1.5 mt-1">
                <div className="flex items-center gap-1 text-[9px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
                  <Zap size={10} />
                  <span>Local Derivatives</span>
                </div>
                <div className="grid grid-cols-2 gap-y-0.5 font-mono">
                  <span className="text-slate-500 font-sans">&part;z/&part;x (Slope X):</span>
                  <span className="text-right text-slate-300">{hoverInfo.dx.toFixed(4)}</span>
                  
                  <span className="text-slate-500 font-sans">&part;z/&part;y (Slope Y):</span>
                  <span className="text-right text-slate-300">{hoverInfo.dy.toFixed(4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Html>
    </group>
  );
}
