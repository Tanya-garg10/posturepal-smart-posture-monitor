from fastapi import APIRouter
from app.schemas import (
    PostureScoreResponse,
    PostureHistoryItem,
    AnalyzePostureRequest,
    AnalyzePostureResponse,
)
from app.mock_data import posture_score_data, posture_history_data

router = APIRouter(prefix="/api/posture", tags=["Posture"])


@router.get("/score", response_model=PostureScoreResponse)
def get_posture_score():
    return posture_score_data


@router.get("/history", response_model=list[PostureHistoryItem])
def get_posture_history():
    return posture_history_data


@router.post("/analyze", response_model=AnalyzePostureResponse)
def analyze_posture(payload: AnalyzePostureRequest):
    issues = []
    fixes = []
    score = 100

    if payload.neck_angle > 25:
        issues.append("Neck Bend Warning")
        fixes.append("Keep your screen at eye level.")
        score -= 20

    if payload.back_angle > 20:
        issues.append("Slouch Detected")
        fixes.append("Straighten your back and sit deeper into the chair.")
        score -= 25

    if payload.shoulder_alignment > 15:
        issues.append("Shoulder Misalignment")
        fixes.append("Relax and align both shoulders evenly.")
        score -= 15

    if payload.sitting_duration_minutes >= 45:
        issues.append("Long Sitting Session")
        fixes.append("Take a 2-minute stretch break.")
        score -= 10

    if payload.eye_closed:
        issues.append("Eye Fatigue Detected")
        fixes.append("Look away from the screen for 20 seconds (20-20-20 rule).")
        score -= 15

    if not issues:
        posture_status = "Good Posture"
        fixes.append("Great job. Maintain this posture.")
    else:
        posture_status = "Needs Correction"

    return {
        "posture_status": posture_status,
        "correction_score": max(score, 0),
        "detected_issues": issues,
        "suggested_fixes": fixes,
    }
