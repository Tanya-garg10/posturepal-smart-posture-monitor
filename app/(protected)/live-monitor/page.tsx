'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import CameraFeed, { CameraFeedHandle } from '@/components/live-monitor/camera-feed'
import StatusBadge from '@/components/live-monitor/status-badge'
import MetricsPanel from '@/components/live-monitor/metrics-panel'
import DetectedIssues from '@/components/live-monitor/detected-issues'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { alertsStore } from '@/lib/alerts-store'

const SEND_INTERVAL_MS = 4000

export default function LiveMonitorPage() {
  const cameraRef = useRef<CameraFeedHandle>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [liveMetrics, setLiveMetrics] = useState<{
    neckAngle: number
    backAngle: number
    shoulderAlignment: number
    eyeClosed: boolean
  } | null>(null)

  const sessionStart = useRef<number>(Date.now())
  const lastSend = useRef<number>(0)
  const latestMetrics = useRef(liveMetrics)

  useEffect(() => { latestMetrics.current = liveMetrics }, [liveMetrics])

  // called every frame by CameraFeed
  const handleMetrics = useCallback((m: typeof liveMetrics) => {
    setLiveMetrics(m)
    latestMetrics.current = m

    const now = Date.now()
    if (now - lastSend.current < SEND_INTERVAL_MS) return
    lastSend.current = now

    const sitting = Math.floor((now - sessionStart.current) / 60000)
    const payload = {
      neck_angle: Math.round((m?.neckAngle ?? 0) * 10) / 10,
      back_angle: Math.round((m?.backAngle ?? 0) * 10) / 10,
      shoulder_alignment: Math.round((m?.shoulderAlignment ?? 0) * 10) / 10,
      sitting_duration_minutes: sitting,
      eye_closed: m?.eyeClosed ?? false,
    }

    fetch('/api/posture/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) {
          setAnalysisResult(res.data)

          // push live alerts into the store
          const issues: { type: string; message: string; severity: 'low' | 'medium' | 'high' }[] = []
          const d = res.data
          if (d.detected_issues?.includes('Neck Bend Warning'))
            issues.push({ type: 'Neck Bend Warning', message: 'Your neck is bent too far forward. Adjust screen to eye level.', severity: 'medium' })
          if (d.detected_issues?.includes('Slouch Detected'))
            issues.push({ type: 'Slouch Detected', message: 'Slouching detected. Sit up straight and engage your core.', severity: 'high' })
          if (d.detected_issues?.includes('Shoulder Misalignment'))
            issues.push({ type: 'Shoulder Misalignment', message: 'Shoulders are uneven. Relax and align them evenly.', severity: 'medium' })
          if (d.detected_issues?.includes('Eye Fatigue Detected'))
            issues.push({ type: 'Eye Fatigue', message: 'Eyes closed too long. Look away for 20 seconds (20-20-20 rule).', severity: 'low' })
          if (d.detected_issues?.includes('Long Sitting Session'))
            issues.push({ type: 'Break Reminder', message: "You've been sitting for 45+ minutes. Take a short break.", severity: 'low' })

          if (issues.length > 0) alertsStore.push(issues)
        }
      })
      .catch(() => { })
  }, [])

  const handleStart = async () => {
    sessionStart.current = Date.now()
    lastSend.current = 0
    setAnalysisResult(null)
    setLiveMetrics(null)
    await cameraRef.current?.start()
    setIsMonitoring(true)
  }

  const handleStop = () => {
    cameraRef.current?.stop()
    setIsMonitoring(false)
  }

  const handleReset = () => {
    handleStop()
    setAnalysisResult(null)
    setLiveMetrics(null)
  }

  // build analysisData shape that MetricsPanel + DetectedIssues expect
  const analysisData = analysisResult
    ? {
      overallScore: analysisResult.correction_score,
      neckAngle: liveMetrics?.neckAngle?.toFixed(1) ?? '—',
      spineAlignment: analysisResult.correction_score,
      detectedIssues: {
        slouching: analysisResult.detected_issues?.includes('Slouch Detected'),
        neckStrain: analysisResult.detected_issues?.includes('Neck Bend Warning'),
        unevenShoulders: analysisResult.detected_issues?.includes('Shoulder Misalignment'),
      },
      suggestedFixes: analysisResult.suggested_fixes,
      status: analysisResult.posture_status,
    }
    : undefined

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Live Monitor</h1>
        <p className="text-lg text-muted-foreground">Real-time posture monitoring powered by AI — runs entirely in your browser</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera + controls */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border-border/60">
            <CameraFeed
              ref={cameraRef}
              isMonitoring={isMonitoring}
              onMetrics={handleMetrics}
            />
          </Card>

          {/* live angle HUD */}
          {isMonitoring && liveMetrics && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Neck', value: `${liveMetrics.neckAngle.toFixed(1)}°`, warn: liveMetrics.neckAngle > 30 },
                { label: 'Back', value: `${liveMetrics.backAngle.toFixed(1)}°`, warn: liveMetrics.backAngle > 25 },
                { label: 'Shoulders', value: liveMetrics.shoulderAlignment.toFixed(0), warn: liveMetrics.shoulderAlignment > 15 },
                { label: 'Eyes', value: liveMetrics.eyeClosed ? 'Closed' : 'Open', warn: liveMetrics.eyeClosed },
              ].map(({ label, value, warn }) => (
                <Card key={label} className={`p-3 text-center border ${warn ? 'border-red-300 bg-red-50/50' : 'border-border/40'}`}>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className={`text-lg font-bold ${warn ? 'text-red-600' : 'text-foreground'}`}>{value}</p>
                </Card>
              ))}
            </div>
          )}

          {/* controls */}
          <Card className="p-5 flex items-center justify-between border-border/60">
            <StatusBadge status={isMonitoring ? 'monitoring' : 'idle'} />
            <div className="flex gap-2">
              {!isMonitoring ? (
                <Button onClick={handleStart} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Monitoring
                </Button>
              ) : (
                <Button onClick={handleStop} variant="outline" className="gap-2">
                  <Pause className="w-4 h-4" />
                  Stop
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" size="icon">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* right panel */}
        <div className="space-y-4">
          <MetricsPanel analysisData={analysisData} />
          <DetectedIssues analysisData={analysisData} />

          {/* suggested fixes */}
          {analysisResult?.suggested_fixes?.length > 0 && (
            <Card className="p-5 border-border/60 space-y-3">
              <p className="text-sm font-semibold text-foreground">Suggested Fixes</p>
              {analysisResult.suggested_fixes.map((fix: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>{fix}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
