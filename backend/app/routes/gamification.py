from fastapi import APIRouter
from app.schemas import StreakUpdateRequest, BadgeUnlockRequest
from app.mock_data import gamification_store

router = APIRouter(prefix="/api/gamification", tags=["Gamification"])


@router.get("/status")
def get_gamification_status():
    return gamification_store


@router.post("/streak-update")
def update_streak(payload: StreakUpdateRequest):
    if payload.completed_day:
        gamification_store["current_streak"] += 1
        gamification_store["longest_streak"] = max(
            gamification_store["longest_streak"],
            gamification_store["current_streak"],
        )
    else:
        gamification_store["current_streak"] = 0
    return {"message": "Streak updated successfully", "data": gamification_store}


@router.post("/badge-unlock")
def unlock_badge(payload: BadgeUnlockRequest):
    if payload.badge_name not in gamification_store["badges"]:
        gamification_store["badges"].append(payload.badge_name)
    return {"message": "Badge processed successfully", "data": gamification_store}
