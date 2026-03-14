import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND}/api/posture/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        neck_angle: body.neck_angle ?? 10,
        back_angle: body.back_angle ?? 10,
        shoulder_alignment: body.shoulder_alignment ?? 5,
        sitting_duration_minutes: body.sitting_duration_minutes ?? 30,
      }),
    })
    const data = await res.json()
    // Normalize to shape frontend expects
    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        neckAngle: body.neck_angle ?? 10,
        spineAlignment: data.correction_score,
        shoulderLevel: body.shoulder_alignment ?? 5,
        overallScore: data.correction_score,
        status: data.posture_status.toLowerCase().includes('good') ? 'good' : 'fair',
        detectedIssues: {
          slouching: data.detected_issues.some((i: string) => i.toLowerCase().includes('slouch')),
          neckStrain: data.detected_issues.some((i: string) => i.toLowerCase().includes('neck')),
          unevenShoulders: data.detected_issues.some((i: string) => i.toLowerCase().includes('shoulder')),
        },
        detected_issues: data.detected_issues,
        suggested_fixes: data.suggested_fixes,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 502 })
  }
}
