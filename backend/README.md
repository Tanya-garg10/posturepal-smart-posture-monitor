# PosturePal Backend

FastAPI backend for PosturePal. Serves posture scores, alerts, recommendations, gamification, corporate dashboard, and settings.

## Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger UI: http://127.0.0.1:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/posture/score | Current posture score |
| GET | /api/posture/history | 6-day history |
| POST | /api/posture/analyze | Analyze posture + eye state |
| GET | /api/notifications | All notifications |
| GET | /api/recommendations/exercises | Stretch exercises |
| GET | /api/recommendations/desk-setup | Desk setup guide |
| GET | /api/gamification/status | Streak & badges |
| POST | /api/gamification/streak-update | Update streak |
| POST | /api/gamification/badge-unlock | Unlock badge |
| GET | /api/corporate/dashboard | Corporate metrics |
| GET | /api/settings | User settings |
| POST | /api/settings | Update settings |

## /api/posture/analyze

**POST** — called by `posture_detector.py` every few seconds.

Request:
```json
{
  "neck_angle": 27.5,
  "back_angle": 22.0,
  "shoulder_alignment": 11.3,
  "sitting_duration_minutes": 48,
  "eye_closed": false
}
```

Response:
```json
{
  "posture_status": "Needs Correction",
  "correction_score": 55,
  "detected_issues": ["Neck Bend Warning", "Slouch Detected"],
  "suggested_fixes": ["Keep your screen at eye level.", "Straighten your back."]
}
```

Thresholds:
- `neck_angle > 25` → Neck Bend Warning (-20 pts)
- `back_angle > 20` → Slouch Detected (-25 pts)
- `shoulder_alignment > 15` → Shoulder Misalignment (-15 pts)
- `sitting_duration_minutes >= 45` → Long Sitting Session (-10 pts)
- `eye_closed: true` → Eye Fatigue Detected (-15 pts)
