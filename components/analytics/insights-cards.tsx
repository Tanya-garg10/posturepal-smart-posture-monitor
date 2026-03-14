import { Card } from '@/components/ui/card'
import { TrendingUp, Clock, AlertCircle, ArrowUp } from 'lucide-react'

type ScoreData = { today?: number; alerts?: number; good_posture_minutes?: number; improvement_percentage?: number }
type HistoryItem = { score: number }

export default function InsightsCards({ scoreData, historyData }: { scoreData?: ScoreData; historyData?: HistoryItem[] }) {
  const best = scoreData?.today ?? '--'
  const goodMin = scoreData?.good_posture_minutes ?? 0
  const hours = Math.floor(goodMin / 60)
  const mins = goodMin % 60
  const activeTime = goodMin > 0 ? `${hours}h ${mins}m` : '--'
  const alerts = scoreData?.alerts ?? '--'
  const improvement = scoreData?.improvement_percentage != null ? `+${scoreData.improvement_percentage}%` : '--'

  const insights = [
    { title: 'Peak Performance', value: best !== '--' ? `${best}%` : '--', description: 'Best posture score today', icon: 'trending-up' },
    { title: 'Active Time', value: activeTime, description: 'Time in good posture', icon: 'clock' },
    { title: 'Alerts', value: String(alerts), description: 'Alerts triggered today', icon: 'alert-circle' },
    { title: 'Improvement', value: improvement, description: 'vs last week', icon: 'arrow-up' },
  ]

  const iconMap = {
    'trending-up': TrendingUp,
    'clock': Clock,
    'alert-circle': AlertCircle,
    'arrow-up': ArrowUp,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight, idx) => {
        const Icon = iconMap[insight.icon as keyof typeof iconMap]

        return (
          <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{insight.title}</p>
                <h3 className="text-2xl font-bold text-foreground">{insight.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
