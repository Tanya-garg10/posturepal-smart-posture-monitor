import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/posture/history`)
    const data: Array<{ date: string; score: number; good_minutes: number; bad_minutes: number }> = await res.json()
    // Normalize to shape frontend expects: { time, score, ... }
    const normalized = data.map((item) => ({
      timestamp: item.date,
      time: item.date,
      score: item.score,
      minutesMonitored: item.good_minutes + item.bad_minutes,
      good_minutes: item.good_minutes,
      bad_minutes: item.bad_minutes,
      alerts: 0,
    }))
    return NextResponse.json({ success: true, data: normalized })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
