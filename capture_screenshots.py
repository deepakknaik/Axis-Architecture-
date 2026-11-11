import subprocess
import os
import time

urls = [
    ("screenshot_blueprint.png", "http://localhost:3000/projects/proj_villa_north/blueprint"),
    ("screenshot_analysis.png", "http://localhost:3000/projects/proj_villa_north/analysis"),
    ("screenshot_review.png", "http://localhost:3000/projects/proj_villa_north/analysis/review"),
    ("screenshot_workspace.png", "http://localhost:3000/projects/proj_villa_north/workspace"),
]

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

for filename, url in urls:
    outpath = os.path.abspath(filename)
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=4000",
        "--window-size=1600,1000",
        f"--screenshot={outpath}",
        url
    ]
    print(f"Capturing {filename} from {url}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(outpath):
        print(f"  OK: {filename} ({os.path.getsize(outpath)} bytes)")
    else:
        print(f"  FAILED: {filename}")
print("Finished capturing screenshots.")
