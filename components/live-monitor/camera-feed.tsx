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

const CameraFeed = forwardRef<CameraFeedHandle, Props>(({ isMonitoring, onMetrics }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const poseRef = useRef<any>(null)
  const faceMeshRef = useRef<any>(null)
  const lastPoseRef = useRef<any>(null)
  const lastFaceRef = useRef<any>(null)
  const eyeClosedSince = useRef<number | null>(null)

  // ── helpers ──────────────────────────────────────────────────────────────
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

  const angleWithVertical = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI
  }

  const ear = (lm: any[], top: number, bottom: number, left: number, right: number) => {
    const v = dist(lm[top], lm[bottom])
    const h = dist(lm[left], lm[right])
    return v / (h + 1e-6)
  }

  // ── draw skeleton on canvas ───────────────────────────────────────────────
  const drawSkeleton = (pose: any, face: any, w: number, h: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)

    if (pose?.poseLandmarks) {
      const lm = pose.poseLandmarks
      const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
        [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
        [25, 27], [26, 28],
      ]
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      connections.forEach(([a, b]) => {
        if (lm[a] && lm[b]) {
          ctx.beginPath()
          ctx.moveTo(lm[a].x * w, lm[a].y * h)
          ctx.lineTo(lm[b].x * w, lm[b].y * h)
          ctx.stroke()
        }
      })
      // joints
      lm.forEach((p: any) => {
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#10b981'
        ctx.fill()
      })
    }

    if (face?.multiFaceLandmarks?.[0]) {
      const lm = face.multiFaceLandmarks[0]
      // draw eye outlines
      const leftEyeIdx = [33, 160, 158, 133, 153, 144]
      const rightEyeIdx = [362, 385, 387, 263, 373, 380]
        ;[leftEyeIdx, rightEyeIdx].forEach((idxs) => {
          ctx.beginPath()
          idxs.forEach((i, n) => {
            const p = lm[i]
            n === 0 ? ctx.moveTo(p.x * w, p.y * h) : ctx.lineTo(p.x * w, p.y * h)
          })
          ctx.closePath()
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 1.5
          ctx.stroke()
        })
    }
  }

  // ── compute metrics ───────────────────────────────────────────────────────
  const computeMetrics = (pose: any, face: any) => {
    let neckAngle = 0, backAngle = 0, shoulderAlignment = 0, eyeClosed = false

    if (pose?.poseLandmarks) {
      const lm = pose.poseLandmarks
      const ls = lm[11], rs = lm[12]
      const lh = lm[23], rh = lm[24]
      const le = lm[7]  // left ear

      const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 }
      const midHip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 }

      neckAngle = angleWithVertical(le, ls)
      backAngle = angleWithVertical(midShoulder, midHip)
      shoulderAlignment = Math.abs(ls.y - rs.y) * 1000
    }

    if (face?.multiFaceLandmarks?.[0]) {
      const lm = face.multiFaceLandmarks[0]
      const leftEAR = ear(lm, 159, 145, 33, 133)
      const rightEAR = ear(lm, 386, 374, 362, 263)
      const avgEAR = (leftEAR + rightEAR) / 2

      if (avgEAR < 0.25) {
        if (!eyeClosedSince.current) eyeClosedSince.current = Date.now()
        else if (Date.now() - eyeClosedSince.current >= 2000) eyeClosed = true
      } else {
        eyeClosedSince.current = null
      }
    }

    return { neckAngle, backAngle, shoulderAlignment, eyeClosed }
  }

  // ── load mediapipe lazily ─────────────────────────────────────────────────
  const loadMediaPipe = async () => {
    const { Pose } = await import('@mediapipe/pose')
    const { FaceMesh } = await import('@mediapipe/face_mesh')
    const { Camera } = await import('@mediapipe/camera_utils')

    const pose = new Pose({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    })
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 })
    pose.onResults((r: any) => { lastPoseRef.current = r })

    const faceMesh = new FaceMesh({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    })
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 })
    faceMesh.onResults((r: any) => { lastFaceRef.current = r })

    poseRef.current = pose
    faceMeshRef.current = faceMesh

    return { pose, faceMesh, Camera }
  }

  const start = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    streamRef.current = stream
    video.srcObject = stream
    await video.play()

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const { pose, faceMesh } = await loadMediaPipe()

    let frameCount = 0
    const loop = async () => {
      if (!streamRef.current) return
      frameCount++

      // alternate pose / face every other frame to reduce load
      if (frameCount % 2 === 0) await pose.send({ image: video })
      else await faceMesh.send({ image: video })

      const w = canvas.width, h = canvas.height
      drawSkeleton(lastPoseRef.current, lastFaceRef.current, w, h)

      const metrics = computeMetrics(lastPoseRef.current, lastFaceRef.current)
      onMetrics?.(metrics)

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    lastPoseRef.current = null
    lastFaceRef.current = null
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  useImperativeHandle(ref, () => ({ start, stop }))

  useEffect(() => () => { stop() }, [])

  return (
    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
      {/* live video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* skeleton overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* idle placeholder */}
      {!isMonitoring && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">Camera ready</p>
          <p className="text-white/40 text-xs mt-1">Click Start Monitoring to begin</p>
        </div>
      )}

      {/* live badge */}
      {isMonitoring && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>
      )}

      {/* grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>
    </div>
  )
})

CameraFeed.displayName = 'CameraFeed'
export default CameraFeed
