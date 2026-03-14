'use client'

import { useState, useEffect } from 'react'
import AlertItem from './alert-item'
import { Card } from '@/components/ui/card'
import { useAlerts } from '@/hooks/use-api'

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

  const alerts: Alert[] = (rawAlerts ?? []).map((a: any) => ({
    id: String(a.id),
    type: a.type,
    message: a.message,
    timestamp: new Date(a.timestamp),
    severity: (['low', 'medium', 'high'].includes(a.severity) ? a.severity : 'low') as 'low' | 'medium' | 'high',
    resolved: a.resolved,
  }))

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unresolved') return !alert.resolved
    if (filter === 'critical') return alert.severity === 'high'
    if (filter === 'reminder') return alert.type.toLowerCase().includes('reminder')
    return true
  })

  if (filteredAlerts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No alerts found</p>
        <p className="text-sm text-muted-foreground mt-2">Great job! Keep up your good posture.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {filteredAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
