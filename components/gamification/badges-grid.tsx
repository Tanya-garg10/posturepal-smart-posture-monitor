'use client'

import { Card } from '@/components/ui/card'
import { Award, Zap, Sunrise, Shield, Activity, Lock } from 'lucide-react'
import { useGamification } from '@/hooks/use-api'

const BADGE_META: Record<string, { icon: any; color: string; description: string }> = {
  'Early Bird': { icon: Sunrise, color: 'from-blue-400 to-cyan-400', description: 'Good posture before 8 AM for 5 days' },
  'No Slouch': { icon: Shield, color: 'from-green-400 to-emerald-400', description: '0 slouch detections in a day' },
  'Perfect Week': { icon: Award, color: 'from-purple-400 to-pink-400', description: '7 consecutive days of 80+ score' },
  'Stretch Champion': { icon: Zap, color: 'from-yellow-400 to-orange-400', description: 'Completed 50 stretch exercises' },
  'Marathon Sitter': { icon: Activity, color: 'from-red-400 to-rose-400', description: '30+ hours of monitoring' },
}

export default function BadgesGrid() {
  const { gamification } = useGamification()
  const earnedNames: string[] = gamification?.badges ?? []

  const allBadgeNames = Array.from(new Set([...Object.keys(BADGE_META), ...earnedNames]))

  const badges = allBadgeNames.map((name) => {
    const meta = BADGE_META[name] ?? { icon: Lock, color: 'from-gray-400 to-slate-400', description: 'Special achievement' }
    return { name, ...meta, earned: earnedNames.includes(name) }
  })

  return (
    <Card className="p-7 border-border/60">
      <h3 className="text-xl font-semibold text-foreground mb-6">Badges & Achievements</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map((badge, idx) => {
          const Icon = badge.icon
          const isEarned = badge.earned
          const progress = 0

          return (
            <div
              key={idx}
              className={`relative group ${!isEarned ? 'opacity-50' : ''
                }`}
            >
              <div
                className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${isEarned
                  ? `bg-gradient-to-br ${badge.color} border-transparent shadow-lg hover:shadow-xl`
                  : 'bg-muted border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                  }`}
              >
                <div className="flex justify-center mb-3">
                  <div
                    className={`p-3 rounded-lg ${isEarned
                      ? 'bg-white/30'
                      : 'bg-muted-foreground/10'
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                </div>
                <p className={`text-xs font-bold mb-1 ${isEarned ? 'text-white' : 'text-foreground'}`}>
                  {badge.name}
                </p>
                <p className={`text-xs ${isEarned ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {badge.description}
                </p>
              </div>

              {!isEarned && progress > 0 && (
                <div className="absolute bottom-2 left-2 right-2 mt-2">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-1 font-semibold">{progress}%</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Unlock more badges by achieving milestones and maintaining healthy posture habits.
      </p>
    </Card>
  )
}
