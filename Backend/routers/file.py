from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import os

router = APIRouter()

# Configure your IFC files directory
IFC_FILES_DIR = "data" 

# API endpoint to serve IFC files to the frontend
@router.get("/api/ifc-file/{filename}")
async def get_ifc_file(filename: str):
    file_path = Path(IFC_FILES_DIR) / filename
    # Ensure the directory exists
    if not file_path.exists():
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": f"File '{filename}' not found."}
        )
    # Ensure the file is an IFC file
    try:
        return FileResponse(
            path=file_path,
            media_type="application/octet-stream",
            filename=filename
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error reading file: {str(e)}"}
        )