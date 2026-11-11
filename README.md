# AxisArchitecture

> **Real-Time 2D Blueprint Analysis & 3D Spatial Reconstruction Engine**  
> AI/ML Engineering Capstone & Architectural Intelligence Platform.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-blue?style=flat&logo=three.js)](https://docs.pmnd.rs/react-three-fiber)
[![OpenCV](https://img.shields.io/badge/OpenCV-Python-5C3EE8?style=flat&logo=opencv)](https://opencv.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Key Features

1. **Deterministic Computer Vision Pipeline (`OpenCV` + `NumPy`)**:
   - Automated binarization and Gaussian noise reduction on 2D floor plans.
   - Morphological directional line kernel filtering for structural wall isolation.
   - Polygon room contour extraction with automatic metric area ($\text{m}^2$) and perimeter computation.
   - Classification between exterior load-bearing envelopes ($0.23\text{m}$) and interior partitions ($0.15\text{m}$).

2. **Interactive 3D Spatial Reconstruction (`Three.js` / `React Three Fiber`)**:
   - Real-time WebGL rendering of parametric building assemblies (walls, window fenestrations, doors, stairs, columns, and roofs).
   - Dual viewports: **3rd-Person Orbit Inspection** and **1st-Person Immersive Walkthrough** (with keyboard WASD and on-screen touch D-pads).
   - In-scene real-time dimensional measurement overlay (`Ruler` tool).
   - Dynamic 3D floating room labels and procedural interior fixtures.

3. **1-Click BIM / CAD Model Export (`.glb` / `.gltf`)**:
   - Export reconstructed 3D buildings directly to binary `.glb` format using Three.js `GLTFExporter`.
   - Native compatibility with **Autodesk Revit**, **AutoCAD**, **Blender**, and **Unreal Engine**.

4. **Automated Presentation Suite (Python)**:
   - Programmatically builds a formatted 15-slide institutional defense deck matching VTU / M S Engineering College standards.

---

## 🚀 Quick Start

### Option 1: One-Click Full Stack Launch (Recommended)

Run the unified launcher to start both the **FastAPI Computer Vision Engine** (Port 8000) and **Next.js Web App** (Port 3000) together:

```powershell
python start_platform.py
```
*Or simply double-click `launch.bat` in Windows Explorer.*

* **Web Application**: [http://localhost:3000](http://localhost:3000)
* **CV Service API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Option 2: Running Components Individually

#### 1. Next.js Frontend
```powershell
npm install
npm run dev
```

#### 2. FastAPI Computer Vision Microservice
```powershell
npm run cv:serve
# or: uvicorn cv_service:app --reload --port 8000
```

#### 3. Standalone Blueprint Analyzer CLI
```powershell
python blueprint_cv_engine.py public/blueprints/blueprint-bungalow-10x12.png output.json
```

---

## 📂 Project Architecture

```
AxisArchitecture/
├── app/                        # Next.js 14 App Router
│   ├── api/analyze-cv/         # Full-stack bridge to Python CV engine
│   ├── dashboard/              # Project activity & stats dashboard
│   ├── projects/[projectId]/   # Analysis, review, and 3D workspace routes
│   └── (auth)/login/           # Architectural login visual
│
├── features/                   # Core Feature Engines
│   └── viewer-3d/              # Three.js / R3F 3D spatial viewer & walkthrough
│       ├── viewer-canvas.tsx   # Viewport HUD & 1-click GLB export toolbar
│       ├── model-exporter.ts   # Three.js GLTFExporter binary integration
│       └── building-scene.tsx  # Architectural parametric mesh groups
│
├── components/                 # Reusable UI primitives & inspection panels
│   ├── blueprint/              # 2D canvas, dimension editor & review queue
│   └── reconstruction/         # 3D model panel & comparison drawer
│
├── blueprint_cv_engine.py      # Core OpenCV wall & room extraction algorithm
├── cv_service.py               # FastAPI microservice for real-time analysis
├── start_platform.py           # Unified multi-process platform launcher
└── launch.bat                  # Windows double-click shortcut
```

---

## 🧪 Testing & Verification

```powershell
# TypeScript Type Check
npx tsc --noEmit

# ESLint Code Quality
npm run lint

# Production Build
npm run build
```

---

## 📄 License
MIT License. Developed for research & architectural spatial analysis.
