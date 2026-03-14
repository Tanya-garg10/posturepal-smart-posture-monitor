'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

type HistoryItem = { date?: string; time?: string; score: number }

export default function DailyScoreGraph({ historyData }: { historyData?: HistoryItem[] }) {
  const chartData = historyData
    ? historyData.map((item) => ({ time: item.date ?? item.time ?? '', score: item.score }))
    : []

  const scores = chartData.map((d) => d.score)
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const highest = scores.length > 0 ? Math.max(...scores) : 0
  const lowest = scores.length > 0 ? Math.min(...scores) : 0
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Daily Score Trend</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#1a1a1a' }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#dailyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Average</p>
          <p className="text-lg font-bold text-foreground">{avg > 0 ? `${avg}%` : '--'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Highest</p>
          <p className="text-lg font-bold text-secondary">{highest > 0 ? `${highest}%` : '--'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Lowest</p>
          <p className="text-lg font-bold text-destructive">{lowest > 0 ? `${lowest}%` : '--'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Volatility</p>
          <p className="text-lg font-bold text-accent">{highest > 0 ? `±${Math.round((highest - lowest) / 2)}%` : '--'}</p>
        </div>
      </div>
    </Card>
  )
}
