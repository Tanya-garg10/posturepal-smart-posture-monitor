# PosturePal Backend

FastAPI backend for PosturePal frontend.

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
| POST | /api/posture/analyze | Analyze posture angles |
| GET | /api/notifications | All notifications |
| GET | /api/recommendations/exercises | Stretch exercises |
| GET | /api/recommendations/desk-setup | Desk setup guide |
| GET | /api/gamification/status | Streak & badges |
| POST | /api/gamification/streak-update | Update streak |
| POST | /api/gamification/badge-unlock | Unlock badge |
| GET | /api/corporate/dashboard | Corporate metrics |
| GET | /api/settings | User settings |
| POST | /api/settings | Update settings |
