'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

export type CameraFeedHandle = {
  start: () => Promise<void>
  stop: () => void
}

type Props = {
  isMonitoring: boolean
  onMetrics?: (m: {
    neckAngle: number
    backAngle: number
    shoulderAlignment: number
    eyeClosed: boolean
  }) => void
}

const LM = {
  NOSE: 0,
  LEFT_EYE_INNER: 1, LEFT_EYE: 2, LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4, RIGHT_EYE: 5, RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7, RIGHT_EAR: 8,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
}

const CONNECTIONS = [
  [LM.LEFT_EAR, LM.LEFT_SHOULDER], [LM.RIGHT_EAR, LM.RIGHT_SHOULDER],
  [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
  [LM.LEFT_SHOULDER, LM.LEFT_HIP], [LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.LEFT_KNEE], [LM.RIGHT_HIP, LM.RIGHT_KNEE],
  [LM.LEFT_KNEE, LM.LEFT_ANKLE], [LM.RIGHT_KNEE, LM.RIGHT_ANKLE],
]

const CameraFeed = forwardRef<CameraFeedHandle, Props>(({ isMonitoring, onMetrics }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const runningRef = useRef(false)
  const poseRef = useRef<any>(null)
  const onMetricsRef = useRef(onMetrics)
  const eyeClosedSince = useRef<number | null>(null)

  // keep onMetrics ref fresh so closure inside onResults always has latest
  useEffect(() => { onMetricsRef.current = onMetrics }, [onMetrics])

  // ── helpers ───────────────────────────────────────────────────────────────
  const isVis = (lm: any[], i: number) => (lm[i]?.visibility ?? 0) > 0.35

  const angleVertical = (a: { x: number, y: number }, b: { x: number, y: number }) => {
    const dx = b.x - a.x, dy = b.y - a.y
    return (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI
  }

  // ── draw skeleton ─────────────────────────────────────────────────────────
  const draw = (lm: any[], w: number, h: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, w, h)

    // bones
    CONNECTIONS.forEach(([a, b]) => {
      if (!isVis(lm, a) || !isVis(lm, b)) return
      ctx.beginPath()
      ctx.moveTo(lm[a].x * w, lm[a].y * h)
      ctx.lineTo(lm[b].x * w, lm[b].y * h)
      ctx.strokeStyle = 'rgba(59,130,246,0.85)'
      ctx.lineWidth = 2.5
      ctx.stroke()
    })

    // spine guide line
    if (isVis(lm, 11) && isVis(lm, 12) && isVis(lm, 23) && isVis(lm, 24)) {
      const mx1 = ((lm[11].x + lm[12].x) / 2) * w
      const my1 = ((lm[11].y + lm[12].y) / 2) * h
      const mx2 = ((lm[23].x + lm[24].x) / 2) * w
      const my2 = ((lm[23].y + lm[24].y) / 2) * h
      ctx.beginPath()
      ctx.moveTo(mx1, my1); ctx.lineTo(mx2, my2)
      ctx.strokeStyle = 'rgba(251,191,36,0.75)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([])
    }

    // joints
    lm.forEach((p: any, i: number) => {
      if (!isVis(lm, i)) return
      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#10b981'; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke()
    })
  }

  // ── compute metrics from landmarks ───────────────────────────────────────
  const computeMetrics = (lm: any[]) => {
    const W = 640, H = 480
    const px = (p: any) => ({ x: p.x * W, y: p.y * H })

    let neckAngle = 0, backAngle = 0, shoulderAlignment = 0, eyeClosed = false

    if (isVis(lm, 11) && isVis(lm, 12)) {
      const ls = px(lm[11]), rs = px(lm[12])
      const mShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 }

      // shoulder drop (pixels)
      shoulderAlignment = Math.abs(ls.y - rs.y)

      // neck: ear → shoulder angle from vertical
      const earPts: { x: number, y: number }[] = []
      if (isVis(lm, LM.LEFT_EAR)) earPts.push(px(lm[LM.LEFT_EAR]))
      if (isVis(lm, LM.RIGHT_EAR)) earPts.push(px(lm[LM.RIGHT_EAR]))
      if (earPts.length > 0) {
        const avgEar = {
          x: earPts.reduce((s, p) => s + p.x, 0) / earPts.length,
          y: earPts.reduce((s, p) => s + p.y, 0) / earPts.length,
        }
        neckAngle = angleVertical(avgEar, mShoulder)
      }

      // slouch: nose-to-shoulder distance normalised by shoulder width
      // good posture → nose well above shoulders → low backAngle
      // slouching → nose closer to shoulder level → higher backAngle
      if (isVis(lm, LM.NOSE)) {
        const nose = px(lm[LM.NOSE])
        const shoulderWidth = Math.abs(ls.x - rs.x)
        if (shoulderWidth > 10) {
          const noseAboveShoulder = mShoulder.y - nose.y  // positive = nose above shoulder
          const ratio = noseAboveShoulder / shoulderWidth
          // ratio ~1.5 = good posture, ratio ~0.5 = slouching
          backAngle = Math.max(0, Math.min(45, (1.5 - ratio) * 30))
        }
      }
    }

    // eye closed detection using eye-to-nose vertical ratio
    if (isVis(lm, LM.LEFT_EYE) && isVis(lm, LM.RIGHT_EYE) && isVis(lm, LM.NOSE)) {
      const le = lm[LM.LEFT_EYE], re = lm[LM.RIGHT_EYE], nose = lm[LM.NOSE]
      const eyeSpan = Math.abs(lm[LM.LEFT_EYE_OUTER].x - lm[LM.RIGHT_EYE_OUTER].x)
      const avgEyeY = (le.y + re.y) / 2
      const eyeNoseDist = Math.abs(avgEyeY - nose.y)
      const isClosed = eyeSpan > 0 && (eyeNoseDist / eyeSpan) < 0.12

      if (isClosed) {
        if (!eyeClosedSince.current) eyeClosedSince.current = Date.now()
        else if (Date.now() - eyeClosedSince.current >= 2000) eyeClosed = true
      } else {
        eyeClosedSince.current = null
      }
    }

    return { neckAngle, backAngle, shoulderAlignment, eyeClosed }
  }

  // ── load pose + wire onResults → draw + metrics ───────────────────────────
  const loadPose = async (video: HTMLVideoElement) => {
    const { Pose } = await import('@mediapipe/pose')
    const pose = new Pose({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    })
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    pose.onResults((results: any) => {
      if (!runningRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      const lm: any[] = results.poseLandmarks ?? []
      draw(lm, canvas.width, canvas.height)
      if (lm.length > 0) {
        const metrics = computeMetrics(lm)
        onMetricsRef.current?.(metrics)
      }
    })

    poseRef.current = pose
  }

  // ── main loop: send frames to pose at ~15fps ──────────────────────────────
  const start = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
    })
    streamRef.current = stream
    video.srcObject = stream
    await video.play()

    // wait for real dimensions
    await new Promise<void>((resolve) => {
      if (video.videoWidth > 0) { resolve(); return }
      video.addEventListener('loadedmetadata', () => resolve(), { once: true })
    })
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    await loadPose(video)
    runningRef.current = true

    const INTERVAL_MS = 1000 / 15  // 15 fps
    const sendFrame = async () => {
      if (!runningRef.current) return
      const pose = poseRef.current
      if (pose) {
        try { await pose.send({ image: video }) } catch (_) { }
      }
      setTimeout(sendFrame, INTERVAL_MS)
    }
    sendFrame()
  }

  const stop = () => {
    runningRef.current = false
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    poseRef.current = null
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  useImperativeHandle(ref, () => ({ start, stop }))
  useEffect(() => () => { stop() }, [])

  return (
    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />

      {!isMonitoring && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">Camera ready</p>
          <p className="text-white/40 text-xs mt-1">Click Start Monitoring to begin</p>
        </div>
      )}

      {isMonitoring && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>
      )}

      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  )
})

CameraFeed.displayName = 'CameraFeed'
export default CameraFeed
