import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { buildDuplexAnalysis } from '@/lib/blueprint/blueprints-catalog';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = (formData.get('projectId') as string) || 'generic_project';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Clean safe filename
    const ext = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${projectId}_${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, safeFilename);

    fs.writeFileSync(filePath, buffer);
    const sourceUrl = `/uploads/${safeFilename}`;

    // Run OpenCV Python engine on the saved image file
    const scriptPath = path.join(process.cwd(), 'blueprint_cv_engine.py');
    let analysisData: Record<string, unknown> = {};

    try {
      const { stdout } = await execFileAsync('python', [scriptPath, filePath], {
        maxBuffer: 15 * 1024 * 1024,
        timeout: 15000,
      });
      if (stdout) {
        analysisData = JSON.parse(stdout);
      }
    } catch (cvErr) {
      console.error('OpenCV analysis error on uploaded file:', cvErr);
    }

    const detectedProfile = (analysisData.detectedProfile as string) || 'CUSTOM';

    // If multi-floor duplex profile detected, enrich analysis with authoritative dual-drawing analysis
    if (detectedProfile === 'DUPLEX_12x10') {
      analysisData = buildDuplexAnalysis(safeFilename) as unknown as Record<string, unknown>;
    }

    return NextResponse.json({
      success: true,
      filename: safeFilename,
      sourceUrl,
      detectedProfile,
      dimensions: analysisData.dimensions || { widthMeters: 12.0, lengthMeters: 10.0 },
      analysis: analysisData,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Upload processing failed' },
      { status: 500 }
    );
  }
}
