from fastapi import APIRouter
from app.mock_data import corporate_dashboard_data

router = APIRouter(prefix="/api/corporate", tags=["Corporate"])


@router.get("/dashboard")
def get_corporate_dashboard():
    return corporate_dashboard_data
