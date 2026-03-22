import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

function computeLocally(body: any) {
  const neck = body.neck_angle ?? 0
  const back = body.back_angle ?? 0
  const shoulder = body.shoulder_alignment ?? 0
  const sitting = body.sitting_duration_minutes ?? 0
  const eyeClosed = body.eye_closed ?? false

  const issues: string[] = []
  const fixes: string[] = []
  let score = 100

  if (neck > 25) { issues.push('Neck Bend Warning'); fixes.push('Keep your screen at eye level.'); score -= 20 }
  if (back > 15) { issues.push('Slouch Detected'); fixes.push('Straighten your back and sit deeper into the chair.'); score -= 25 }
  if (shoulder > 20) { issues.push('Shoulder Misalignment'); fixes.push('Relax and align both shoulders evenly.'); score -= 15 }
  if (sitting >= 45) { issues.push('Long Sitting Session'); fixes.push('Take a 2-minute stretch break.'); score -= 10 }
  if (eyeClosed) { issues.push('Eye Fatigue Detected'); fixes.push('Look away from the screen for 20 seconds.'); score -= 15 }
  if (!issues.length) fixes.push('Great job. Maintain this posture.')

  const finalScore = Math.max(score, 0)
  return {
    posture_status: issues.length === 0 ? 'Good Posture' : 'Needs Correction',
    correction_score: finalScore,
    detected_issues: issues,
    suggested_fixes: fixes,
  }
}

function normalize(body: any, data: any) {
  return {
    timestamp: new Date().toISOString(),
    neckAngle: body.neck_angle ?? 0,
    spineAlignment: data.correction_score,
    shoulderLevel: body.shoulder_alignment ?? 0,
    overallScore: data.correction_score,
    status: data.posture_status.toLowerCase().includes('good') ? 'good' : 'fair',
    detectedIssues: {
      slouching: data.detected_issues.some((i: string) => i.toLowerCase().includes('slouch')),
      neckStrain: data.detected_issues.some((i: string) => i.toLowerCase().includes('neck')),
      unevenShoulders: data.detected_issues.some((i: string) => i.toLowerCase().includes('shoulder')),
    },
    detected_issues: data.detected_issues,
    suggested_fixes: data.suggested_fixes,
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const res = await fetch(`${BACKEND}/api/posture/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        neck_angle: body.neck_angle ?? 10,
        back_angle: body.back_angle ?? 10,
        shoulder_alignment: body.shoulder_alignment ?? 5,
        sitting_duration_minutes: body.sitting_duration_minutes ?? 30,
        eye_closed: body.eye_closed ?? false,
      }),
    })
    const data = await res.json()
    return NextResponse.json({ success: true, data: normalize(body, data) })
  } catch {
    // backend unavailable — compute locally so the UI still works
    const data = computeLocally(body)
    return NextResponse.json({ success: true, data: normalize(body, data) })
  }
}
