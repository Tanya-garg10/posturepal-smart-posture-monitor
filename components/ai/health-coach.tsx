'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import { mockCoachSuggestions } from '@/lib/mock-data'
import { useState } from 'react'

export default function HealthCoach() {
  const [applied, setApplied] = useState<string[]>([])

  const suggestions = mockCoachSuggestions

  const handleApply = (id: string) => {
    setApplied((prev) => [...prev, id])
  }

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-destructive/30 bg-destructive/8'
    if (priority === 'medium') return 'border-amber-300/30 bg-amber-50/40'
    return 'border-blue-300/30 bg-blue-50/40'
  }

  const getPriorityBadgeColor = (priority: string) => {
    if (priority === 'high') return 'bg-destructive/20 text-destructive'
    if (priority === 'medium') return 'bg-amber-200/40 text-amber-900'
    return 'bg-blue-200/40 text-blue-900'
  }

  const doneCount = applied.length
  const total = suggestions.filter((s) => s.actionable).length

  return (
    <Card className="p-7 border-border/60 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Health Coach</h3>
              <p className="text-xs text-muted-foreground">Real-time posture guidance</p>
            </div>
          </div>
          {doneCount > 0 && (
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
              {doneCount}/{total} fixed
            </span>
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fixes applied</span>
              <span>{Math.round((doneCount / total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const isApplied = applied.includes(suggestion.id)
            return (
              <div
                key={suggestion.id}
                className={`p-4 rounded-xl border transition-all ${isApplied
                    ? 'border-secondary/30 bg-secondary/8 opacity-70'
                    : getPriorityColor(suggestion.priority)
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isApplied ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    ) : (
                      <AlertCircle className={`w-5 h-5 ${suggestion.priority === 'high' ? 'text-destructive'
                          : suggestion.priority === 'medium' ? 'text-amber-600'
                            : 'text-blue-600'
                        }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`font-semibold text-sm ${isApplied ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {suggestion.message}
                      </p>
                      {!isApplied && (
                        <span className={`px-2.5 py-0.5 text-xs rounded-full font-semibold flex-shrink-0 ${getPriorityBadgeColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {suggestion.details}
                    </p>
                    {suggestion.actionable && !isApplied && (
                      <Button
                        size="sm"
                        className="text-xs h-7 px-3 bg-primary hover:bg-primary/90"
                        onClick={() => handleApply(suggestion.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Apply Fix
                      </Button>
                    )}
                    {isApplied && (
                      <p className="text-xs text-secondary font-medium">✓ Applied</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {doneCount === total && total > 0 ? (
          <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg text-center">
            <p className="text-sm font-semibold text-secondary">All fixes applied! Great posture ahead 🎉</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center p-3 bg-muted/40 rounded-lg">
            Follow these suggestions to improve your posture and prevent discomfort.
          </p>
        )}
      </div>
    </Card>
  )
}
