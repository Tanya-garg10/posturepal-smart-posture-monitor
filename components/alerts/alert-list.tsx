'use client'

import { useState, useEffect } from 'react'
import AlertItem from './alert-item'
import { Card } from '@/components/ui/card'
import { useAlerts } from '@/hooks/use-api'
import { alertsStore, LiveAlert } from '@/lib/alerts-store'

type Alert = {
  id: string
  type: string
  message: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
}

export default function AlertList({ filter = 'all' }: { filter?: string }) {
  const { alerts: rawAlerts } = useAlerts()

  // live alerts from store — re-render on every push
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>(() => alertsStore.getAlerts())
  useEffect(() => { return alertsStore.subscribe(() => setLiveAlerts([...alertsStore.getAlerts()])) }, [])

  const backendAlerts: Alert[] = (rawAlerts ?? []).map((a: any) => ({
    id: String(a.id),
    type: a.type,
    message: a.message,
    timestamp: new Date(a.timestamp),
    severity: (['low', 'medium', 'high'].includes(a.severity) ? a.severity : 'low') as Alert['severity'],
    resolved: a.resolved,
  }))

  const liveFormatted: Alert[] = liveAlerts.map((a) => ({
    ...a,
    timestamp: new Date(a.timestamp),
  }))

  // live alerts first, then backend (dedupe by type+time not needed — live are always newer)
  const all: Alert[] = [...liveFormatted, ...backendAlerts]

  const filtered = all.filter((a) => {
    if (filter === 'unresolved') return !a.resolved
    if (filter === 'critical') return a.severity === 'high'
    if (filter === 'reminder') return a.type.toLowerCase().includes('reminder')
    return true
  })

  if (filtered.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No alerts found</p>
        <p className="text-sm text-muted-foreground mt-2">Great job! Keep up your good posture.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={alert.id.startsWith('live-') ? () => alertsStore.dismiss(alert.id) : undefined}
        />
      ))}
    </div>
  )
}
