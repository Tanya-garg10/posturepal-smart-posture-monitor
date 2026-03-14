'use client'

import { Card } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { useGamification } from '@/hooks/use-api'

export default function StreakCard() {
  const { gamification } = useGamification()
  const current = gamification?.current_streak ?? '--'
  const longest = gamification?.longest_streak ?? '--'

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Streak</h3>
        <Flame className="w-6 h-6 text-amber-500" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-4xl font-bold text-amber-600">{current}</p>
        <p className="text-sm text-muted-foreground">Days in a row</p>
      </div>

      <div className="mt-6 pt-4 border-t border-amber-200 text-center">
        <p className="text-xs text-muted-foreground mb-2">Best streak</p>
        <p className="text-2xl font-bold text-amber-600">{longest} days</p>
      </div>

      <div className="mt-4 p-3 bg-white/50 rounded-lg text-center">
        <p className="text-xs text-muted-foreground">Keep up the good work!</p>
      </div>
    </Card>
  )
}
