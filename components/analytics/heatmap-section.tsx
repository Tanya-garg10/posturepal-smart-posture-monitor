'use client'

import { Card } from '@/components/ui/card'
import { mockHeatmapData } from '@/lib/mock-data'

export default function HeatmapSection({ historyData }: { historyData?: unknown[] }) {
  const getColor = (value: number) => {
    if (value >= 85) return 'bg-secondary'
    if (value >= 70) return 'bg-secondary/70'
    if (value >= 55) return 'bg-accent/50'
    if (value >= 40) return 'bg-amber-300/50'
    return 'bg-red-300/50'
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Weekly Heatmap</h3>
          <p className="text-sm text-muted-foreground">Posture quality by hour and day</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Days header */}
            <div className="flex gap-1 mb-2">
              <div className="w-12"></div>
              {days.map((day) => (
                <div key={day} className="w-16 text-center text-sm font-semibold text-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            <div className="space-y-1">
              {mockHeatmapData.slice(0, 12).map((row, idx) => (
                <div key={idx} className="flex gap-1 items-center">
                  <div className="w-12 text-xs text-muted-foreground text-right pr-2">
                    {row.hour}:00
                  </div>
                  {days.map((day) => {
                    const dayKey = day as keyof typeof row
                    const value = row[dayKey]
                    return (
                      <div
                        key={`${row.hour}-${day}`}
                        className={`w-16 h-8 rounded ${getColor(value as number)} transition-all hover:ring-2 hover:ring-primary cursor-pointer flex items-center justify-center text-xs font-semibold text-foreground/60`}
                        title={`${day} ${row.hour}:00 - Score: ${value}`}
                      >
                        {value}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300/50 rounded"></div>
            <span className="text-xs text-muted-foreground">Poor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-300/50 rounded"></div>
            <span className="text-xs text-muted-foreground">Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent/50 rounded"></div>
            <span className="text-xs text-muted-foreground">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary/70 rounded"></div>
            <span className="text-xs text-muted-foreground">Very Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded"></div>
            <span className="text-xs text-muted-foreground">Excellent</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
