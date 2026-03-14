'use client'

import { useState } from 'react'
import AlertList from '@/components/alerts/alert-list'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'

export default function AlertsPage() {
  const [filter, setFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Alerts' },
    { id: 'unresolved', label: 'Unresolved' },
    { id: 'critical', label: 'Critical' },
    { id: 'reminder', label: 'Reminders' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground">Manage your posture alerts and notifications</p>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="ml-auto flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Alerts List */}
      <AlertList filter={filter} />
    </div>
  )
}
