'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, RotateCcw, Pause, CheckCircle2 } from 'lucide-react'
import { useRecommendations } from '@/hooks/use-api'
import { mockStretchExercises } from '@/lib/mock-data'
import { useState, useEffect, useRef } from 'react'

type Exercise = {
  id: string
  title: string
  description: string
  duration: number
  difficulty: string
  reps?: number
  target_area?: string
}

export default function StretchExercises() {
  const { recommendations } = useRecommendations()
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftRef = useRef(0)

  const apiExercises: Exercise[] = recommendations ?? []
  const fallback: Exercise[] = mockStretchExercises.map((e) => ({
    id: e.id,
    title: e.name,
    description: e.instructions,
    duration: e.duration,
    difficulty: e.difficulty,
    reps: e.reps,
    target_area: e.targetArea,
  }))
  const exercises: Exercise[] = apiExercises.length > 0 ? apiExercises : fallback

  // keep ref in sync so interval always reads latest value
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1
      if (next <= 0) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        timeLeftRef.current = 0
        setTimeLeft(0)
        setIsRunning(false)
        setDone(true)
      } else {
        timeLeftRef.current = next
        setTimeLeft(next)
      }
    }, 1000)
  }

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // cleanup on unmount
  useEffect(() => () => stopInterval(), [])

  const handleSelect = (exercise: Exercise) => {
    stopInterval()
    setSelectedExercise(exercise)
    setTimeLeft(exercise.duration)
    timeLeftRef.current = exercise.duration
    setIsRunning(false)
    setDone(false)
  }

  const handleStart = () => {
    if (done) {
      const dur = selectedExercise!.duration
      setTimeLeft(dur)
      timeLeftRef.current = dur
      setDone(false)
    }
    setIsRunning(true)
    startInterval()
  }

  const handlePause = () => {
    stopInterval()
    setIsRunning(false)
  }

  const handleBack = () => {
    stopInterval()
    setSelectedExercise(null)
    setIsRunning(false)
    setDone(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty.toLowerCase()
    if (d === 'easy') return 'bg-green-100/60 text-green-800 border-green-200'
    if (d === 'medium') return 'bg-amber-100/60 text-amber-800 border-amber-200'
    if (d === 'hard') return 'bg-red-100/60 text-red-800 border-red-200'
    return 'bg-muted text-foreground border-border'
  }

  const progress = selectedExercise
    ? Math.round(((selectedExercise.duration - timeLeft) / selectedExercise.duration) * 100)
    : 0

  return (
    <Card className="p-7 border-border/60">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Stretch Exercises</h3>
          <RotateCcw className="w-5 h-5 text-primary" />
        </div>

        {selectedExercise ? (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <button
              onClick={handleBack}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              ← Back to list
            </button>

            <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
              <h4 className="text-2xl font-bold text-foreground mb-4">{selectedExercise.title}</h4>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg border border-border/40">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-xl font-bold text-foreground">{selectedExercise.duration}s</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-border/40">
                  <Play className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Reps</p>
                  <p className="text-xl font-bold text-foreground">{selectedExercise.reps ?? '--'}x</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="text-sm font-bold text-foreground capitalize">{selectedExercise.target_area ?? 'General'}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-white p-6 rounded-xl border border-border/40 mb-6 text-center">
                {done ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-12 h-12 text-secondary" />
                    <p className="text-lg font-bold text-secondary">Exercise Complete!</p>
                    <p className="text-xs text-muted-foreground">Great job! Take a breath.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-5xl font-bold text-foreground mb-2">{timeLeft}s</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {isRunning ? 'Keep going...' : timeLeft === selectedExercise.duration ? 'Ready to start' : 'Paused'}
                    </p>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6 text-center">{selectedExercise.description}</p>

              <div className="space-y-3">
                {done ? (
                  <Button onClick={handleStart} className="w-full bg-primary hover:bg-primary/90 h-11">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Do Again
                  </Button>
                ) : isRunning ? (
                  <Button onClick={handlePause} variant="outline" className="w-full h-11">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={handleStart} className="w-full bg-primary hover:bg-primary/90 h-11">
                    <Play className="w-4 h-4 mr-2" />
                    {timeLeft < selectedExercise.duration ? 'Resume' : 'Start Exercise'}
                  </Button>
                )}
                <Button onClick={handleBack} variant="outline" className="w-full">
                  Choose Different Exercise
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleSelect(exercise)}
                className="p-5 border border-border/40 rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {exercise.title}
                  </h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{exercise.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {exercise.duration}s
                  </div>
                  {exercise.reps && (
                    <div className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                      {exercise.reps}x
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
