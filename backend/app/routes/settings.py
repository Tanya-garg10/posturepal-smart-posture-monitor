from fastapi import APIRouter
from app.schemas import SettingsRequest
from app.mock_data import settings_store

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("")
def get_settings():
    return settings_store


@router.post("")
def update_settings(payload: SettingsRequest):
    settings_store["user_id"] = payload.user_id
    settings_store["smart_reminders"] = payload.smart_reminders
    settings_store["break_interval_minutes"] = payload.break_interval_minutes
    settings_store["alert_sensitivity"] = payload.alert_sensitivity
    settings_store["dark_mode"] = payload.dark_mode
    return {"message": "Settings updated successfully", "data": settings_store}
