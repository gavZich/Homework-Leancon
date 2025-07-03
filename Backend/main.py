from fastapi import FastAPI
from routers import elements  # Will create soon
# import ifcopenshell
# print(ifcopenshell.version)
# model = ifcopenshell.file()

app = FastAPI()

app.include_router(elements.router)

@app.get("/")
def root():
    return {"message": "API is running"}