'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGraph } from '../../context/GraphContext';
import GraphSurface from './GraphSurface';
import RaycasterHandler from './RaycasterHandler';
import HoverTooltip from './HoverTooltip';
import AxesLabels from './AxesLabels';
import { HoverInfo } from '../../types/graph';

// Localized hover interaction layer to isolate mouse-move state updates.
// This prevents heavy mesh, canvas, and controls re-renders on every pixel of mouse move.
function HoverLayer() {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  return (
    <>
      <RaycasterHandler setHoverInfo={setHoverInfo} />
      <HoverTooltip hoverInfo={hoverInfo} />
    </>
  );
}

export default function GraphCanvas() {
  const { state } = useGraph();

  return (
    <div className="h-full w-full bg-slate-950">
      <Canvas
        camera={{ position: [14, 12, 14], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        className="h-full w-full"
      >
        {/* Sleek deep space color background */}
        <color attach="background" args={['#030712']} />
        
        {/* Soft fog for deep field view */}
        <fog attach="fog" args={['#030712', 30, 80]} />

        {/* Cinematic lights setup */}
        <ambientLight intensity={0.5} />
        
        {/* High contrast key light */}
        <directionalLight 
          position={[10, 20, 15]} 
          intensity={0.9} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        {/* Back-fill soft blue glow */}
        <pointLight position={[-15, -15, -15]} intensity={0.4} color="#06b6d4" />
        
        {/* Secondary warm ambient filler */}
        <pointLight position={[15, -10, 15]} intensity={0.25} color="#f43f5e" />

        {/* 3D Graph Surface */}
        {!state.error && <GraphSurface />}

        {/* Custom Grid and Axes system with labels */}
        <AxesLabels />

        {/* Localized Hover & Tooltip Interaction Layer */}
        {!state.error && <HoverLayer />}

        {/* Orbit Controls with snappier damping for responsive dragging */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.12}
          minDistance={3}
          maxDistance={70}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
