import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/notifications`)
    const data: Array<{
      id: number
      title: string
      message: string
      priority: string
      read: boolean
      timestamp: string
      category: string
    }> = await res.json()
    // Normalize notifications → alerts shape
    const normalized = data.map((n) => ({
      id: String(n.id),
      type: n.title,
      message: n.message,
      severity: n.priority === 'high' ? 'high' : n.priority === 'medium' ? 'medium' : 'low',
      timestamp: n.timestamp,
      resolved: n.read,
      category: n.category,
    }))
    return NextResponse.json({ success: true, data: normalized })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
