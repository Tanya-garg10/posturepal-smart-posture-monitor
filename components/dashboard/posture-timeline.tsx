'use client'

import { Card } from '@/components/ui/card'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { usePostureHistory } from '@/hooks/use-api'
import { LoadingState, ErrorState } from '@/components/state-components'

export default function PostureTimeline() {
  const { history, isLoading, isError, error, mutate } = usePostureHistory()

  if (isLoading) {
    return (
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Today's Timeline</h3>
        <LoadingState text="Loading timeline data..." />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Today's Timeline</h3>
        <ErrorState
          title="Failed to load timeline"
          description={error || 'Unable to fetch posture history.'}
          onRetry={() => mutate()}
        />
      </Card>
    )
  }

  const chartData: { score: number; time?: string; date?: string }[] = history || []
  const avgScore = chartData.length > 0 ? Math.round(chartData.reduce((sum: number, d) => sum + d.score, 0) / chartData.length) : 0
  const bestScore = chartData.length > 0 ? Math.max(...chartData.map((d) => d.score)) : 0
  const worstScore = chartData.length > 0 ? Math.min(...chartData.map((d) => d.score)) : 0

  return (
    <Card className="p-7 border-border/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Today's Timeline</h3>
        <div className="flex gap-2 bg-muted/40 p-1 rounded-lg">
          <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white transition-all hover:shadow-md">24h</button>
          <button className="px-4 py-1.5 text-xs font-semibold rounded-lg hover:bg-white/50 text-foreground transition-colors">Week</button>
          <button className="px-4 py-1.5 text-xs font-semibold rounded-lg hover:bg-white/50 text-foreground transition-colors">Month</button>
        </div>
      </div>

      <div className="h-72 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              }}
              labelStyle={{ color: '#0f1419' }}
              formatter={(value) => `${value}%`}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-4 bg-muted/40 rounded-lg text-center hover:bg-muted/60 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Average</p>
          <p className="text-xl font-bold text-foreground">{avgScore}%</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg text-center hover:bg-secondary/15 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Best</p>
          <p className="text-xl font-bold text-secondary">{bestScore}%</p>
        </div>
        <div className="p-4 bg-destructive/10 rounded-lg text-center hover:bg-destructive/15 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Worst</p>
          <p className="text-xl font-bold text-destructive">{worstScore}%</p>
        </div>
      </div>
    </Card>
  )
}
