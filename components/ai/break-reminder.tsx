'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Play, Pause, CheckCircle2, RotateCcw, Timer } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const STRETCHES = [
  { id: 1, name: 'Neck Stretch', duration: 30 },
  { id: 2, name: 'Shoulder Rolls', duration: 20 },
  { id: 3, name: 'Walk Around', duration: 60 },
]

export default function BreakReminder() {
  const [breakTaken, setBreakTaken] = useState(false)
  const [activeStretch, setActiveStretch] = useState<typeof STRETCHES[0] | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [stretchDone, setStretchDone] = useState(false)
  const [completedIds, setCompletedIds] = useState<number[]>([])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeRef = useRef(0)

  useEffect(() => { timeRef.current = timeLeft }, [timeLeft])
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

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
        setStretchDone(true)
        setCompletedIds((prev) => activeStretch ? [...prev, activeStretch.id] : prev)
      } else {
        timeRef.current = next
        setTimeLeft(next)
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  const handleStartStretch = (stretch: typeof STRETCHES[0]) => {
    stopTimer()
    setActiveStretch(stretch)
    setTimeLeft(stretch.duration)
    timeRef.current = stretch.duration
    setIsRunning(true)
    setStretchDone(false)
    startTimer()
  }

  const handlePause = () => { stopTimer(); setIsRunning(false) }

  const handleResume = () => { setIsRunning(true); startTimer() }

  const handleCloseStretch = () => {
    stopTimer()
    setActiveStretch(null)
    setIsRunning(false)
    setStretchDone(false)
  }

  const handleBreakTaken = () => {
    stopTimer()
    setBreakTaken(true)
    setActiveStretch(null)
    setTimeout(() => { setBreakTaken(false); setCompletedIds([]) }, 4000)
  }

  const sitDuration = 50
  const recommendedBreak = 2
  const progress = activeStretch
    ? Math.round(((activeStretch.duration - timeLeft) / activeStretch.duration) * 100)
    : 0

  return (
    <Card className={`p-7 border-border/60 transition-all ${breakTaken
        ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-secondary/30'
        : 'bg-gradient-to-br from-amber-50/40 to-orange-50/40 border-amber-300/30'
      }`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Break Time</h3>
          <Clock className={`w-6 h-6 ${breakTaken ? 'text-secondary' : 'text-orange-500'}`} />
        </div>

        {breakTaken ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="w-16 h-16 text-secondary" />
            <p className="text-xl font-bold text-secondary">Great work!</p>
            <p className="text-sm text-muted-foreground">Your break streak is growing 🔥</p>
          </div>
        ) : activeStretch ? (
          /* Active stretch timer */
          <div className="space-y-4">
            <div className="text-center p-6 bg-white rounded-xl border border-border/40">
              <p className="text-sm font-semibold text-foreground mb-1">{activeStretch.name}</p>
              {stretchDone ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <CheckCircle2 className="w-10 h-10 text-secondary" />
                  <p className="text-sm font-bold text-secondary">Done!</p>
                </div>
              ) : (
                <>
                  <p className="text-5xl font-bold text-foreground tabular-nums mb-3">{timeLeft}s</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRunning ? 'Keep going...' : 'Paused'}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {stretchDone ? (
                <Button onClick={handleCloseStretch} className="flex-1 bg-secondary hover:bg-secondary/90">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Next
                </Button>
              ) : isRunning ? (
                <Button onClick={handlePause} variant="outline" className="flex-1">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleResume} className="flex-1 bg-orange-500 hover:bg-orange-600">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button onClick={handleCloseStretch} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 bg-white rounded-xl border border-amber-200/50">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    You've been sitting for {sitDuration} minutes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time for a {recommendedBreak}-minute stretch break
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/40 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Sitting Duration</p>
                <p className="text-xl font-bold text-foreground">{sitDuration}m</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Recommended Break</p>
                <p className="text-xl font-bold text-secondary">{recommendedBreak}m</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Tap to start a stretch:
              </p>
              <div className="space-y-2">
                {STRETCHES.map((s) => {
                  const done = completedIds.includes(s.id)
                  return (
                    <button
                      key={s.id}
                      onClick={() => !done && handleStartStretch(s)}
                      className={`w-full text-xs p-3 rounded-lg border flex items-center justify-between transition-all ${done
                          ? 'bg-secondary/10 border-secondary/30 text-secondary cursor-default'
                          : 'bg-white border-border/40 hover:border-orange-300 hover:bg-orange-50/40 cursor-pointer'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                          : <Play className="w-3.5 h-3.5 text-orange-500" />
                        }
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <span className="text-muted-foreground">{s.duration}s</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button onClick={handleBreakTaken} className="w-full bg-orange-500 hover:bg-orange-600">
              <Timer className="w-4 h-4 mr-2" />
              I'm Taking a Break
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
