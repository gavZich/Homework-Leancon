from fastapi import FastAPI
from routers import elements, file
# import ifcopenshell
# print(ifcopenshell.version)
# model = ifcopenshell.file()


app = FastAPI()

app.include_router(elements.router)
app.include_router(file.router)


@app.get("/api/")
def root():
    return {"message": "API is running"}