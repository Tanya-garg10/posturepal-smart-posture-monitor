import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/settings`)
    const data = await res.json()
    return NextResponse.json({
      success: true,
      data: {
        profile: { name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', timezone: 'Asia/Kolkata' },
        notifications: { emailAlerts: true, pushNotifications: data.smart_reminders, weeklyReport: true, dailyReminders: data.smart_reminders },
        monitoring: { sensitivityLevel: data.alert_sensitivity === 'high' ? 9 : data.alert_sensitivity === 'low' ? 3 : 6, monitoringDuration: 480, autoStartMonitoring: false, breakFrequency: data.break_interval_minutes },
        display: { theme: data.dark_mode ? 'dark' : 'light', language: 'en', metricSystem: 'metric' },
        privacy: { dataRetention: 90, shareAnalytics: true, shareAnomalousData: false },
        devices: [{ id: 1, name: 'This Device', type: 'camera', status: 'connected', lastSync: new Date().toISOString() }],
        _raw: data,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = {
      user_id: 'demo-user',
      smart_reminders: body.notifications?.pushNotifications ?? true,
      break_interval_minutes: body.monitoring?.breakFrequency ?? 45,
      alert_sensitivity: body.monitoring?.sensitivityLevel > 7 ? 'high' : body.monitoring?.sensitivityLevel < 4 ? 'low' : 'medium',
      dark_mode: body.display?.theme === 'dark',
    }
    const res = await fetch(`${BACKEND}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return NextResponse.json({ success: true, message: 'Settings updated', data: body })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
