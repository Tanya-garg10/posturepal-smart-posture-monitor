import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET() {
    try {
        const res = await fetch(`${BACKEND}/api/gamification/status`)
        const data = await res.json()
        return NextResponse.json({ success: true, data })
    } catch {
        return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
    }
}
