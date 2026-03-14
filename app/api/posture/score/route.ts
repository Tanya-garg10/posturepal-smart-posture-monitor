import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/posture/score`)
    const data = await res.json()
    // Normalize to shape frontend expects: { success, data: { today, ... } }
    return NextResponse.json({
      success: true,
      data: {
        today: data.score,
        week: data.score,
        month: data.score,
        allTime: data.score,
        best: data.score,
        worst: data.score,
        streak: 0,
        lastUpdated: new Date().toISOString(),
        trend: 'up',
        percentageChange: data.improvement_percentage,
        status: data.status,
        alerts: data.alerts,
        good_posture_minutes: data.good_posture_minutes,
        bad_posture_minutes: data.bad_posture_minutes,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
