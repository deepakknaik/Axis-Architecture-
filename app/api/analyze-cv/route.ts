import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imagePath, blueprintId, units = 'METRIC', scale = '1:100' } = body;

    // Check if FastAPI service is running locally on port 8000
    try {
      const fastApiResponse = await fetch('http://127.0.0.1:8000/health', {
        method: 'GET',
        signal: AbortSignal.timeout(600),
      });

      if (fastApiResponse.ok) {
        // Fast path: Delegate to FastAPI service
        const resolvedPath = imagePath
          ? path.resolve(process.cwd(), imagePath)
          : path.resolve(process.cwd(), 'public', 'blueprints', 'blueprint-bungalow-10x12.png');

        const serviceRes = await fetch(
          `http://127.0.0.1:8000/api/analyze-path?image_path=${encodeURIComponent(resolvedPath)}&units=${units}&scale=${scale}`,
          { method: 'POST' }
        );

        if (serviceRes.ok) {
          const cvData = await serviceRes.json();
          return NextResponse.json({
            success: true,
            source: 'FASTAPI_CV_ENGINE',
            data: cvData,
          });
        }
      }
    } catch {
      // FastAPI not running, fallback to direct python child process execution
    }

    // Direct Python Execution Path
    const scriptPath = path.resolve(process.cwd(), 'blueprint_cv_engine.py');
    const targetImage = imagePath
      ? path.resolve(process.cwd(), imagePath)
      : path.resolve(process.cwd(), 'public', 'blueprints', 'blueprint-bungalow-10x12.png');

    if (!fs.existsSync(targetImage)) {
      return NextResponse.json(
        { success: false, error: `Blueprint file not found at: ${targetImage}` },
        { status: 404 }
      );
    }

    const { stdout, stderr } = await execFileAsync('python', [scriptPath, targetImage], {
      maxBuffer: 10 * 1024 * 1024,
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
  }
}
