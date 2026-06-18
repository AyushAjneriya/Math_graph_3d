# MathGeo 🌌

**MathGeo** is a high-performance, interactive 3D digital mathematics and geometry visualizer built with **Next.js 14 (App Router)**, **React Three Fiber (Three.js)**, **Math.js**, and **Tailwind CSS**. It features a futuristic **Digital HUD** aesthetic with glowing coordinates, neon grid planes, and custom mathematical equations.

🚀 **Live Visualizer at [http://localhost:3000](http://localhost:3000)** (when running locally)

---

## 📸 Features

- 🌀 **Dual Graphing Engines**:
  - **Explicit Functions**: Visualizes $z = f(x, y)$ equations, including support for imaginary terms, complex modulus, real/imaginary component extraction, and derivatives.
  - **Parametric Surfaces**: Plots coordinates using independent parametric functions $x(u,v)$, $y(u,v)$, and $z(u,v)$ over customized parameter bounds.
- ⚡ **Buttery Smooth 60 FPS Performance**:
  - **Isolated Render Layers**: Cursor hover coordinates are managed inside a decoupled local React layer (`HoverLayer`). Mouse-move tracking never triggers heavy mesh geometry rebuilds or parent container renders.
  - **Precalculated Animation Sweeps**: Transition delays are pre-allocated inside a Float32Array buffer, enabling smooth, zero-overhead sweep transitions.
  - **Optimized Lighting**: Eliminated CPU-bound normal calculations (`computeVertexNormals`) from the frame rendering loop.
- 🎮 **Interactive Controls**:
  - **Orbit Navigation**: Left-click to rotate, right-click to pan, scroll to zoom (snappy damping factor `0.12`).
  - **Precision Raycaster**: Casts pointer rays onto the surface mesh to display coordinates ($X, Y, Z$) and complex math properties in real-time.
  - **Aesthetics Panel**: Customize opacity, render styles (Solid, Wireframe, or Both), and color map schemes (Viridis, Plasma, Inferno, Cool, Rainbow, Monochromatic).
- 🪐 **Digital HUD Aesthetic**:
  - Sci-fi typography using **Orbitron** (headers) and **Share Tech Mono** (digital counters and terminal readouts).
  - Cybernetic panels featuring glowing cyan outlines and corner bracket details.
  - Glowing coordinate grid lines and neon-colored axes indicator tags (Rose, Emerald, Cyan).

---

## 🎨 Math Presets

MathGeo comes loaded with classic mathematical presets:

### Explicit Presets
- **Sombrero (Ripple)**: Wave ripple interference pattern.
- **Saddle (Hyperbolic Paraboloid)**: Classic saddle curve.
- **Normal Bell Curve (Gaussian)**: Bivariate normal probability curve.
- **Logarithmic Plane**: Offset logarithm demonstration.
- **Complex Sine Wave**: Trigonometric wave evaluated with imaginary inputs ($z = \sin(x + iy)$).

### Parametric Presets
- **Sphere**: Standard sphere mapping.
- **Torus**: Classic 3D donut ring.
- **Mobius Strip**: One-sided non-orientable band.
- **Klein Bottle**: Immersion projection of the Klein bottle.
- **Catenoid Minimal**: Soap film surface stretched between rings.
- **Dini's Sea Shell**: Spiral sea shell curve of constant negative curvature.
- **Enneper Surface**: Alfred Enneper's self-intersecting minimal surface.
- **Astroid Torus**: Torus featuring astroidal (star-like) contours.
- **Seashell Spiral**: Logarithmic winding spiral.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14.2](https://nextjs.org/) (App Router, static-optimized build pipeline)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Mathematical Computation**: [MathJS](https://mathjs.org/) (For safe, cached formula parsing and validation)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Installation & Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/mathgeo.git
   cd mathgeo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
