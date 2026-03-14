import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface Alert {
  id: string
  type: string
  message: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
}

function formatTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function AlertItem({ alert }: { alert: Alert }) {
  const bgColorMap = {
    low: 'bg-blue-50 border-blue-200',
    medium: 'bg-amber-50 border-amber-200',
    high: 'bg-red-50 border-red-200',
  }

  const iconColorMap = {
    low: 'text-blue-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  }

  const severityLabelMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'Critical',
  }

  return (
    <Card className={`p-4 border ${bgColorMap[alert.severity]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          {alert.resolved ? (
            <CheckCircle2 className={`w-6 h-6 text-secondary`} />
          ) : (
            <AlertCircle className={`w-6 h-6 ${iconColorMap[alert.severity]}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-foreground">{alert.type}</p>
              <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 whitespace-nowrap ${
              alert.severity === 'high'
                ? 'bg-red-200 text-red-700'
                : alert.severity === 'medium'
                ? 'bg-amber-200 text-amber-700'
                : 'bg-blue-200 text-blue-700'
            }`}>
              {severityLabelMap[alert.severity]}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTime(alert.timestamp)}
            </div>

            {!alert.resolved && (
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
