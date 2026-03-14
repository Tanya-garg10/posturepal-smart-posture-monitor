'use client'

import { Card } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { useGamification } from '@/hooks/use-api'

export default function StreakDisplay() {
  const { gamification } = useGamification()
  const current = gamification?.current_streak ?? 0
  const longest = gamification?.longest_streak ?? 1
  const weeklyGoal = 7

  return (
    <Card className="p-7 border-border/60 bg-gradient-to-br from-orange-50/40 to-red-50/40">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Your Streak</h3>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Current Streak */}
          <div className="p-4 bg-white rounded-xl border border-orange-200/50 text-center hover:border-orange-300/50 transition-colors">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Current Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-3xl font-bold text-orange-600">{current}</p>
              <p className="text-sm text-muted-foreground">days</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Keep it going!</p>
          </div>

          {/* Longest Streak */}
          <div className="p-4 bg-gradient-to-br from-amber-100/50 to-yellow-100/50 rounded-xl border border-yellow-200/50 text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Longest Streak</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-3xl font-bold text-amber-700">{longest}</p>
              <p className="text-sm text-muted-foreground">days</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Personal best</p>
          </div>

          {/* Weekly Goal */}
          <div className="p-4 bg-white rounded-xl border border-primary-200/50 text-center hover:border-primary-300/50 transition-colors">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Weekly Goal</p>
            <div className="flex items-baseline justify-center gap-1">
              <p className="text-3xl font-bold text-primary">{current % 7}/{weeklyGoal}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This week</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Progress to Longest</p>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
              style={{ width: `${(current / longest) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{longest - current} days to go</p>
        </div>
      </div>
    </Card>
  )
}
