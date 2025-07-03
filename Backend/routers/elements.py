from fastapi import APIRouter

router = APIRouter(prefix="/api/elements", tags=["Elements"])

@router.get("/")
def get_elements():
    return {"status": "Elements route working"}