from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
from services.parser import load_ifc_elements, generate_element_summary

router = APIRouter(prefix="/api/elements", tags=["Elements"])

# Resolve absolute path to IFC file
IFC_FILE_PATH = os.path.abspath("data/rstadvancedsampleproject.ifc")


# Rendering the entire Element Quantity Table
@router.get("/")
def get_elements():
    elements = load_ifc_elements(IFC_FILE_PATH)
    if not elements:
        return {"error": "No elements found in the IFC file."} 
    summary = generate_element_summary(elements)
    return {"summary": summary}

# This router returns a list of element IDs that belong to the given type
@router.get("/by-type/{type}")
def get_elements_by_type(type: str):
    elements = load_ifc_elements(IFC_FILE_PATH)
    if not elements:
        return {"error": "No elements found in the IFC file."}
    # Filter elements by the specified type
    filtered_elements = [element for element in elements if element["type"].strip().lower() == type.strip().lower()]
    return {"elements": filtered_elements}



# This router returns a list of element IDs that are located in a specific level
@router.get("/by-level/{level}")
def get_elements_by_level(level: str):
    elements = load_ifc_elements(IFC_FILE_PATH)
    if not elements:
        return {"error": "No elements found in the IFC file."}
    # Filter elements by the specified level
    filtered_elements = [element for element in elements if element["level"].lower() == level.lower()]
    if not filtered_elements:
        return {"error": f"No elements found in level: {level}"}    
    return {"elements": filtered_elements}