"""
AXIS ARCHITECTURE — Unified Platform Launcher
Boots both the FastAPI Computer Vision Microservice and Next.js Development Server concurrently.
"""

import sys
import subprocess
import time
import os
import signal

def run_platform():
    print("=" * 65)
    print("   AXIS ARCHITECTURE — UNIFIED FULL STACK LAUNCHER")
    print("=" * 65)
    print(" [1/2] Booting FastAPI Computer Vision Engine (Port 8000)...")

    # Start FastAPI CV server
    cv_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "cv_service:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=os.getcwd()
    )

    time.sleep(1.5)
    print(" [OK] CV Engine Online at: http://127.0.0.1:8000 (Swagger: /docs)")

    print("\n [2/2] Booting Next.js Web Platform (Port 3000)...")
    try:
        # Start Next.js dev server
        subprocess.run(["npm", "run", "dev"], shell=True, check=True)
    except KeyboardInterrupt:
        print("\n\nShutting down AxisArchitecture platform...")
    finally:
        print("Stopping background CV microservice...")
        cv_process.terminate()
        try:
            cv_process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            cv_process.kill()
        print("All services stopped cleanly.")

if __name__ == "__main__":
    run_platform()
