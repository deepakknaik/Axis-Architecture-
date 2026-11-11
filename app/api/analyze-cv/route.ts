import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execFileAsync = promisify(execFile);

function resolveTargetImage(imagePath?: string): string | null {
  if (!imagePath) {
    return path.join(process.cwd(), 'public', 'blueprints', 'blueprint-bungalow-10x12.png');
  }

  // 1. Direct absolute path on local disk
  if (fs.existsSync(imagePath)) {
    return imagePath;
  }

  // 2. Strip leading slashes and web path prefixes
  const clean = imagePath.replace(/^[/\\]+/, '').replace(/^public[/\\]+/, '');

  // 3. Try directly inside public/
  const inPublic = path.join(process.cwd(), 'public', clean);
  if (fs.existsSync(inPublic)) return inPublic;

  // 4. Try inside current working directory
  const inCwd = path.join(process.cwd(), clean);
  if (fs.existsSync(inCwd)) return inCwd;

  // 5. Try matching just the filename inside public/blueprints
  const filename = path.basename(clean);
  const inBlueprints = path.join(process.cwd(), 'public', 'blueprints', filename);
  if (fs.existsSync(inBlueprints)) return inBlueprints;

  return null;
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const body = await req.json();
    const { imagePath, imageData, blueprintId, units = 'METRIC', scale = '1:100' } = body;

    let targetImage: string | null = null;

    // Handle base64 image data payload if sent from browser
    if (imageData && typeof imageData === 'string' && imageData.includes('base64,')) {
      const base64Data = imageData.split('base64,')[1];
      tempFilePath = path.join(os.tmpdir(), `bp_upload_${Date.now()}.png`);
      fs.writeFileSync(tempFilePath, Buffer.from(base64Data, 'base64'));
      targetImage = tempFilePath;
    } else {
      targetImage = resolveTargetImage(imagePath);
    }

    if (!targetImage || !fs.existsSync(targetImage)) {
      // Fallback default sample if path couldn't be resolved
      targetImage = path.join(process.cwd(), 'public', 'blueprints', 'blueprint-duplex-12x10.jpg');
      if (!fs.existsSync(targetImage)) {
        targetImage = path.join(process.cwd(), 'public', 'blueprints', 'blueprint-bungalow-10x12.png');
      }
    }

    // 1. Attempt FastAPI Microservice on port 8000
    try {
      const fastApiResponse = await fetch('http://127.0.0.1:8000/health', {
        method: 'GET',
        signal: AbortSignal.timeout(600),
      });

      if (fastApiResponse.ok) {
        const serviceRes = await fetch(
          `http://127.0.0.1:8000/api/analyze-path?image_path=${encodeURIComponent(targetImage)}&units=${units}&scale=${scale}`,
          { method: 'POST' }
        );

        if (serviceRes.ok) {
          const cvData = await serviceRes.json();
          if (blueprintId) cvData.blueprintId = blueprintId;
          return NextResponse.json({
            success: true,
            source: 'FASTAPI_CV_ENGINE',
            data: cvData,
          });
        }
      }
    } catch {
      // Microservice offline, fall through to direct python execution
    }

    // 2. Direct Python child process execution
    const scriptPath = path.resolve(process.cwd(), 'blueprint_cv_engine.py');
    const { stdout, stderr } = await execFileAsync('python', [scriptPath, targetImage], {
      maxBuffer: 15 * 1024 * 1024,
      timeout: 15000,
    });

    if (stderr && !stdout) {
      return NextResponse.json({ success: false, error: stderr }, { status: 500 });
    }

    const parsedData = JSON.parse(stdout);
    if (blueprintId) {
      parsedData.blueprintId = blueprintId;
    }

    return NextResponse.json({
      success: true,
      source: 'PYTHON_DIRECT_CV',
      data: parsedData,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'CV Analysis failed' },
      { status: 500 }
    );
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch {
        // cleanup ignore
      }
    }
  }
}
