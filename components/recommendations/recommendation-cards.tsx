'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockRecommendations } from '@/lib/mock-data'
import { Clock, Zap, Play, Pause, RotateCcw, CheckCircle2, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type Rec = typeof mockRecommendations[0]

export default function RecommendationCards() {
  const [active, setActive] = useState<Rec | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeRef = useRef(0)

  // keep ref in sync
  useEffect(() => { timeRef.current = timeLeft }, [timeLeft])
  // cleanup on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const getDurationSeconds = (duration: string) => {
    // e.g. "5 min" -> 300, "3 min" -> 180
    const match = duration.match(/(\d+)/)
    return match ? parseInt(match[1]) * 60 : 60
  }

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      const next = timeRef.current - 1
      if (next <= 0) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        timeRef.current = 0
        setTimeLeft(0)
        setIsRunning(false)
        setDone(true)
      } else {
        timeRef.current = next
        setTimeLeft(next)
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  const handleOpen = (rec: Rec) => {
    stopTimer()
    const secs = getDurationSeconds(rec.duration)
    setActive(rec)
    setTimeLeft(secs)
    timeRef.current = secs
    setIsRunning(false)
    setDone(false)
  }

  const handleStart = () => {
    if (done) {
      const secs = getDurationSeconds(active!.duration)
      setTimeLeft(secs)
      timeRef.current = secs
      setDone(false)
    }
    setIsRunning(true)
    startTimer()
  }

  const handlePause = () => { stopTimer(); setIsRunning(false) }

  const handleClose = () => { stopTimer(); setActive(null); setIsRunning(false); setDone(false) }

  const totalSecs = active ? getDurationSeconds(active.duration) : 1
  const progress = Math.round(((totalSecs - timeLeft) / totalSecs) * 100)

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockRecommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-40 overflow-hidden">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">{rec.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded ${rec.difficulty === 'Easy' ? 'bg-secondary/20 text-secondary' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {rec.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
              <div className="flex items-center gap-4 my-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {rec.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {rec.category}
                </div>
              </div>
              <Button
                onClick={() => handleOpen(rec)}
                className="w-full mt-auto bg-primary hover:bg-primary/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Exercise
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Exercise Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-1">{active.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{active.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-muted/40 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-bold text-foreground">{active.duration}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl text-center">
                <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
                <p className="font-bold text-foreground">{active.difficulty}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              {done ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle2 className="w-16 h-16 text-secondary" />
                  <p className="text-xl font-bold text-secondary">Exercise Complete!</p>
                  <p className="text-sm text-muted-foreground">Great work! Take a moment to breathe.</p>
                </div>
              ) : (
                <>
                  <p className="text-6xl font-bold text-foreground mb-2 tabular-nums">{fmt(timeLeft)}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isRunning ? 'Keep going...' : timeLeft === totalSecs ? 'Ready when you are' : 'Paused'}
                  </p>
                  {/* Progress ring */}
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3">
              {done ? (
                <Button onClick={handleStart} className="w-full h-12 bg-primary hover:bg-primary/90">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Do Again
                </Button>
              ) : isRunning ? (
                <Button onClick={handlePause} variant="outline" className="w-full h-12">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleStart} className="w-full h-12 bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  {timeLeft < totalSecs ? 'Resume' : 'Start Exercise'}
                </Button>
              )}
              <Button onClick={handleClose} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
