'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type HistoryItem = { date?: string; time?: string; score: number }

export default function WeeklyChart({ historyData }: { historyData?: HistoryItem[] }) {
  const chartData = historyData
    ? historyData.slice(-7).map((item) => ({
      day: item.date ? item.date.slice(5) : (item.time ?? ''),
      score: item.score,
    }))
    : []

  const avg = chartData.length > 0 ? Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length) : 0
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#1a1a1a' }}
            />
            <Legend />
            <Bar dataKey="score" fill="#3b82f6" name="Posture Score" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Average Score</p>
          <p className="text-xl font-bold text-foreground">{avg > 0 ? `${avg}%` : '--'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Improvement</p>
          <p className="text-xl font-bold text-secondary">+12%</p>
        </div>
      </div>
    </Card>
  )
}
