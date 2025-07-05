from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import os

router = APIRouter()

# Configure your IFC files directory
IFC_FILES_DIR = "data" 

@router.get("/api/ifc-file/{filename}")
async def get_ifc_file(filename: str):
    """
    Serve IFC file for 3D visualization
    Returns the raw IFC file with proper headers
    """
    # Security: Only allow .ifc files and prevent directory traversal
    if not filename.endswith('.ifc') or '..' in filename:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_path = Path(IFC_FILES_DIR) / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return file with proper headers for IFC files
    return FileResponse(
        path=file_path,
        media_type='application/x-step',  # Standard MIME type for IFC files
        filename=filename,
        headers={
            "Cache-Control": "no-cache",  # Prevent caching during development
            "Access-Control-Allow-Origin": "*",  # Allow CORS for frontend
        }
    )