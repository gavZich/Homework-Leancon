from fastapi import FastAPI
from routers import elements, file
# import ifcopenshell
# print(ifcopenshell.version)
# model = ifcopenshell.file()

# Create FastAPI app instance
app = FastAPI()

# Include routers for elements and file handling
app.include_router(elements.router)
app.include_router(file.router)

# Root endpoint to check if the API is running
@app.get("/api/")
def root():
    return {"message": "API is running"}