from pydantic import BaseModel
from typing import List, Optional


class PostureScoreResponse(BaseModel):
    score: int
    status: str
    alerts: int
    good_posture_minutes: int
    bad_posture_minutes: int
    improvement_percentage: float


class PostureHistoryItem(BaseModel):
    date: str
    score: int
    good_minutes: int
    bad_minutes: int


class NotificationItem(BaseModel):
    id: int
    title: str
    message: str
    priority: str
    read: bool
    timestamp: str
    category: str


class ExerciseItem(BaseModel):
    id: int
    name: str
    duration_seconds: int
    reps: int
    difficulty: str
    target_area: str
    tip: str


class DeskSetupItem(BaseModel):
    label: str
    current: str
    recommended: str
    status: str
    suggestion: str


class StreakUpdateRequest(BaseModel):
    user_id: str
    completed_day: bool


class BadgeUnlockRequest(BaseModel):
    user_id: str
    badge_name: str


class SettingsRequest(BaseModel):
    user_id: str
    smart_reminders: bool
    break_interval_minutes: int
    alert_sensitivity: str
    dark_mode: bool


class AnalyzePostureRequest(BaseModel):
    neck_angle: float
    back_angle: float
    shoulder_alignment: float
    sitting_duration_minutes: int
    eye_closed: Optional[bool] = False


class AnalyzePostureResponse(BaseModel):
    posture_status: str
    correction_score: int
    detected_issues: List[str]
    suggested_fixes: List[str]
