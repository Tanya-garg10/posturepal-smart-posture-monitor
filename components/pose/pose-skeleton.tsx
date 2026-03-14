'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockPoseSkeleton } from '@/lib/mock-data'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PosePoint { x: number; y: number; confidence: number }
interface PoseSkeleton { [key: string]: PosePoint }

const CONNECTIONS = [
  ['nose', 'leftEye'], ['nose', 'rightEye'],
  ['leftEye', 'leftEar'], ['rightEye', 'rightEar'],
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
  ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
]

// Simulate slight pose movement
function jitter(base: PoseSkeleton, frame: number): PoseSkeleton {
  const result: PoseSkeleton = {}
  Object.entries(base).forEach(([key, pt]) => {
    result[key] = {
      x: pt.x + Math.sin(frame * 0.05 + pt.x) * 1.5,
      y: pt.y + Math.cos(frame * 0.04 + pt.y) * 1.2,
      confidence: pt.confidence,
    }
  })
  return result
}

function drawPose(ctx: CanvasRenderingContext2D, pose: PoseSkeleton, w: number, h: number) {
  const scale = 0.9
  const ox = (w - 640 * scale) / 2
  const oy = (h - 500 * scale) / 2 - 20

  const sp = (p: PosePoint) => ({ x: p.x * scale + ox, y: p.y * scale + oy })

  ctx.clearRect(0, 0, w, h)

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#f0f4ff')
  bg.addColorStop(1, '#f5f0ff')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Connections
  CONNECTIONS.forEach(([from, to]) => {
    const a = sp(pose[from])
    const b = sp(pose[to])
    const conf = (pose[from].confidence + pose[to].confidence) / 2
    ctx.globalAlpha = conf * 0.85
    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  })

  ctx.globalAlpha = 1

  // Joints
  Object.values(pose).forEach((pt) => {
    const { x, y } = sp(pt)
    ctx.fillStyle = `rgba(37,99,235,0.2)`
    ctx.beginPath()
    ctx.arc(x, y, 9, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
  })
}

export default function PoseSkeleton() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [fps, setFps] = useState(0)
  const lastTimeRef = useRef(0)
  const fpsCountRef = useRef(0)

  const base = mockPoseSkeleton as PoseSkeleton

  const drawFrame = (timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    frameRef.current += 1
    fpsCountRef.current += 1

    if (timestamp - lastTimeRef.current >= 1000) {
      setFps(fpsCountRef.current)
      fpsCountRef.current = 0
      lastTimeRef.current = timestamp
    }

    const pose = jitter(base, frameRef.current)
    drawPose(ctx, pose, canvas.width, canvas.height)

    rafRef.current = requestAnimationFrame(drawFrame)
  }

  const drawStatic = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawPose(ctx, base, canvas.width, canvas.height)
  }

  useEffect(() => {
    drawStatic()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handleToggle = () => {
    if (isLive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      setIsLive(false)
      setFps(0)
      drawStatic()
    } else {
      setIsLive(true)
      lastTimeRef.current = performance.now()
      fpsCountRef.current = 0
      rafRef.current = requestAnimationFrame(drawFrame)
    }
  }

  const handleReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    frameRef.current = 0
    setIsLive(false)
    setFps(0)
    drawStatic()
  }

  return (
    <Card className="p-7 border-border/60 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">AI Pose Skeleton</h3>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <canvas
            ref={canvasRef}
            width={520}
            height={420}
            className="max-w-full rounded-xl border border-border/40 shadow-sm"
          />

          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={handleToggle} className={`gap-2 ${isLive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}>
              {isLive ? <><Pause className="w-4 h-4" /> Stop Live</> : <><Play className="w-4 h-4" /> Start Live</>}
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-primary/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Pose Points</p>
            <p className="text-lg font-bold text-primary">17</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-secondary/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-secondary">96%</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-accent/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">FPS</p>
            <p className="text-lg font-bold text-accent">{isLive ? fps : '--'}</p>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-muted/40 rounded-lg">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Live Analysis:</p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              Good Posture Detected - Spine Aligned
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              Shoulders Level - Minimal Tension
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Screen Distance: 55cm — Optimal
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
