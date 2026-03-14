import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/recommendations/exercises`)
    const data: Array<{
      id: number
      name: string
      duration_seconds: number
      reps: number
      difficulty: string
      target_area: string
      tip: string
    }> = await res.json()
    const normalized = data.map((e) => ({
      id: String(e.id),
      title: e.name,
      category: 'stretch',
      description: e.tip,
      duration: e.duration_seconds,
      difficulty: e.difficulty,
      priority: 'medium',
      instructions: [e.tip],
      reps: e.reps,
      target_area: e.target_area,
    }))
    return NextResponse.json({ success: true, data: normalized })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
