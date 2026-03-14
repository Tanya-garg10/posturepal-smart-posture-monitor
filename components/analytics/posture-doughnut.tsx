'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

type ScoreData = { good_posture_minutes?: number; bad_posture_minutes?: number }

export default function PostureDoughnut({ scoreData }: { scoreData?: ScoreData }) {
  const good = scoreData?.good_posture_minutes ?? 68
  const bad = scoreData?.bad_posture_minutes ?? 42
  const total = good + bad
  const fair = Math.round(total * 0.15)
  const goodPct = total > 0 ? Math.round((good / total) * 100) : 68
  const badPct = total > 0 ? Math.round((bad / total) * 100) : 10
  const fairPct = 100 - goodPct - badPct

  const data = [
    { name: 'Good Posture', value: goodPct },
    { name: 'Fair Posture', value: Math.max(fairPct, 0) },
    { name: 'Poor Posture', value: badPct },
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Posture Distribution</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#1a1a1a' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
