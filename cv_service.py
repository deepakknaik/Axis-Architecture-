"""
AXIS ARCHITECTURE — FastAPI Computer Vision Microservice
Runs on port 8000 (or custom) and provides high-speed real-time blueprint analysis endpoints.
"""

import os
import tempfile
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from blueprint_cv_engine import analyze_blueprint_image

app = FastAPI(
    title="AxisArchitecture CV Engine",
    description="Real-time Computer Vision & OCR spatial extraction for architectural drawings",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "AxisArchitecture Computer Vision Engine",
        "status": "ONLINE",
        "version": "1.0.0",
        "capabilities": ["contour_extraction", "hough_walls", "room_partitioning", "scale_resolution"]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_uploaded_file(
    file: UploadFile = File(...),
    units: str = Query("METRIC", enum=["METRIC", "IMPERIAL"]),
    scale: str = Query("1:100")
):
    try:
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".png"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        result = analyze_blueprint_image(tmp_path, target_units=units, default_scale=scale)
        result["blueprintId"] = file.filename or "uploaded_blueprint"

        # Cleanup temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-path")
def analyze_path(
    image_path: str = Query(..., description="Path to local image file"),
    units: str = Query("METRIC", enum=["METRIC", "IMPERIAL"]),
    scale: str = Query("1:100")
):
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail=f"File not found: {image_path}")
    try:
        return analyze_blueprint_image(image_path, target_units=units, default_scale=scale)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
