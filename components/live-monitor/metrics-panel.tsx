import { Card } from '@/components/ui/card'
import { Gauge, Activity, Zap } from 'lucide-react'
import { EmptyState } from '@/components/state-components'

export default function MetricsPanel({ analysisData }: { analysisData?: any }) {
  // Use API data if available, fallback to empty state
  const metrics = analysisData ? [
    {
      label: 'Current Score',
      value: `${analysisData.overallScore}%`,
      icon: Gauge,
      color: 'primary',
    },
    {
      label: 'Neck Angle',
      value: `${analysisData.neckAngle}°`,
      icon: Activity,
      color: 'secondary',
    },
    {
      label: 'Spine Alignment',
      value: `${analysisData.spineAlignment}%`,
      icon: Zap,
      color: 'accent',
    },
  ] : []

  return (
    <Card className="p-6 border-border/60">
      <h3 className="font-semibold text-foreground mb-4">Live Metrics</h3>

      {metrics.length === 0 ? (
        <EmptyState
          title="No data yet"
          description="Start monitoring to see live metrics here."
          icon={Activity}
        />
      ) : (
        <div className="space-y-2">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            const colorMap = {
              primary: 'bg-primary/10 text-primary',
              secondary: 'bg-secondary/10 text-secondary',
              accent: 'bg-accent/10 text-accent',
            }

            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorMap[metric.color as keyof typeof colorMap]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{metric.value}</span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
