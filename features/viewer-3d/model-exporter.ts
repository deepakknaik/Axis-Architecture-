'use client';

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export interface ExportModelOptions {
  fileName?: string;
  binary?: boolean; // true = .glb (recommended), false = .gltf
  embedImages?: boolean;
}

/**
 * Exports a Three.js Object3D / Group to a downloadable .GLB or .GLTF file.
 * Compatible with Revit, Blender, AutoCAD, Unreal Engine, and Web 3D viewers.
 */
export async function exportBuildingModelToGLB(
  target: THREE.Object3D,
  options: ExportModelOptions = {}
): Promise<void> {
  const {
    fileName = 'axis-architectural-model.glb',
    binary = true,
    embedImages = true,
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const exporter = new GLTFExporter();

      exporter.parse(
        target,
        (gltf) => {
          try {
            let blob: Blob;
            if (gltf instanceof ArrayBuffer) {
              blob = new Blob([gltf], { type: 'model/gltf-binary' });
            } else {
              const output = JSON.stringify(gltf, null, 2);
              blob = new Blob([output], { type: 'application/json' });
            }

            const downloadUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = fileName.endsWith('.glb') || fileName.endsWith('.gltf')
              ? fileName
              : `${fileName}.${binary ? 'glb' : 'gltf'}`;

            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            setTimeout(() => {
              URL.revokeObjectURL(downloadUrl);
            }, 2000);

            resolve();
          } catch (blobErr) {
            reject(blobErr);
          }
        },
        (error) => {
          console.error('Failed to parse model with GLTFExporter:', error);
          reject(error);
        },
        {
          binary,
          embedImages,
          onlyVisible: true,
          truncateDrawRange: true,
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
