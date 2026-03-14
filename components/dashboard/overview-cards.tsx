'use client'

import { Card } from '@/components/ui/card'
import { usePostureScore, useGamification } from '@/hooks/use-api'
import { TrendingUp, Flame, Target, Clock } from 'lucide-react'

export default function OverviewCards() {
  const { score } = usePostureScore()
  const { gamification } = useGamification()

  const goodMin = score?.good_posture_minutes ?? 0
  const hours = Math.floor(goodMin / 60)
  const mins = goodMin % 60
  const activeTime = goodMin > 0 ? `${hours}h ${mins}m` : '--'

  const cards = [
    {
      title: 'Average Score',
      value: score ? `${score.today}%` : '--',
      icon: Target,
      color: 'primary',
      description: 'Your overall posture score',
    },
    {
      title: 'Today\'s Best',
      value: score ? `${score.best}%` : '--',
      icon: TrendingUp,
      color: 'secondary',
      description: 'Best score today',
    },
    {
      title: 'Current Streak',
      value: gamification ? `${gamification.current_streak} days` : '--',
      icon: Flame,
      color: 'accent',
      description: 'Keep it going!',
    },
    {
      title: 'Active Time',
      value: activeTime,
      icon: Clock,
      color: 'primary',
      description: 'Good posture time today',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon
        const colorClasses = {
          primary: 'bg-primary/12 text-primary',
          secondary: 'bg-secondary/12 text-secondary',
          accent: 'bg-accent/12 text-accent',
        }

        return (
          <Card key={idx} className="p-6 border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{card.title}</p>
                <h3 className="text-3xl font-bold text-foreground mb-3">{card.value}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
              <div className={`p-3 rounded-xl ${colorClasses[card.color as keyof typeof colorClasses]} group-hover:shadow-md transition-all`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
