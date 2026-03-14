# PosturePal

An AI-powered posture monitoring web app built with Next.js 16 and a FastAPI backend. Tracks posture in real-time, provides personalized recommendations, and gamifies healthy habits.

## Tech Stack

- **Frontend** — Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI** — shadcn/ui, Radix UI, Recharts, Lucide Icons
- **Data Fetching** — SWR
- **Backend** — FastAPI (Python), see [`backend/`](./backend/README.md)

## Features

- Real-time posture score & live monitoring
- AI Health Coach with actionable suggestions
- Break reminders with guided stretch timers
- Stretch exercises with interactive countdown
- Pose skeleton visualization
- Analytics — weekly charts, heatmap, daily insights
- Gamification — streaks, badges & achievements
- Smart notification center
- Desk setup recommendations
- Corporate wellness dashboard
- Settings & alert preferences

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Set `BACKEND_URL` to your FastAPI server (default: `http://127.0.0.1:8000`).

### 3. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Start the frontend

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> The app falls back to mock data automatically if the backend is unavailable.

## Project Structure

```
app/
  (public)/         # Landing page & login
  (protected)/      # Dashboard, analytics, features, settings, etc.
  api/              # Next.js API routes (proxy to FastAPI)
components/
  ai/               # Health coach, break reminder
  analytics/        # Charts, heatmap, insights
  corporate/        # Corporate wellness dashboard
  dashboard/        # Overview cards, score ring, timeline
  gamification/     # Streaks, badges
  live-monitor/     # Camera feed, metrics, pose detection
  recommendations/  # Stretch exercises, desk setup, AI coach card
  notifications/    # Notification center
  pose/             # Pose skeleton
  ui/               # shadcn/ui base components
hooks/              # SWR data hooks (use-api.ts)
lib/                # API client, mock data, utils
backend/            # FastAPI backend
```

## API Routes

All frontend API routes live under `app/api/` and proxy to the FastAPI backend.

| Route | Description |
|-------|-------------|
| `GET /api/posture/score` | Current posture score |
| `GET /api/posture/history` | 6-day history |
| `POST /api/posture/analyze` | Analyze posture angles |
| `GET /api/recommendations` | Stretch exercises |
| `GET /api/alerts` | Active alerts |
| `GET /api/gamification` | Streak & badges |
| `GET /api/corporate` | Corporate dashboard metrics |
| `GET /api/settings` | User settings |
| `POST /api/settings` | Update settings |
