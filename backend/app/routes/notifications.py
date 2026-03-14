from fastapi import APIRouter
from app.schemas import NotificationItem
from app.mock_data import notifications_data

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=list[NotificationItem])
def get_notifications():
    return notifications_data
