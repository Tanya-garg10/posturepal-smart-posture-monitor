'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { useAlerts } from '@/hooks/use-api'
import { LoadingState, ErrorState, EmptyState } from '@/components/state-components'
import { alertsStore, LiveAlert } from '@/lib/alerts-store'

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

export default function AlertsList() {
  const { alerts, isLoading, isError, error, mutate } = useAlerts()

  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>(() => alertsStore.getAlerts())
  useEffect(() => alertsStore.subscribe(() => setLiveAlerts([...alertsStore.getAlerts()])), [])

  const backendRecent = alerts?.slice(0, 3) ?? []
  // show live alerts first (max 3 total)
  const recentAlerts = [...liveAlerts.slice(0, 3), ...backendRecent].slice(0, 3)

  if (isLoading) {
    return (
      <Card className="p-6 border-border/60">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recent Alerts</h3>
        <LoadingState text="Loading alerts..." />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-6 border-border/60">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recent Alerts</h3>
        <ErrorState
          title="Failed to load alerts"
          description={error || 'Unable to fetch your alerts. Please try again.'}
          onRetry={() => mutate()}
        />
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Alerts</h3>
        <Link href="/alerts">
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {recentAlerts.length === 0 ? (
        <EmptyState
          title="No alerts yet"
          description="Your posture is looking great! Keep it up."
          icon={AlertCircle}
        />
      ) : (
        <div className="space-y-3">
          {recentAlerts.map((alert: any) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${alert.resolved
                ? 'bg-secondary/8 border-secondary/30 hover:bg-secondary/12'
                : 'bg-destructive/8 border-destructive/30 hover:bg-destructive/12'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {alert.resolved ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{alert.type}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold flex-shrink-0 ${alert.severity === 'high'
                        ? 'bg-destructive/20 text-destructive'
                        : alert.severity === 'medium'
                          ? 'bg-amber-200/40 text-amber-900'
                          : 'bg-blue-200/40 text-blue-900'
                        }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
