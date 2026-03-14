'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { usePostureScore } from '@/hooks/use-api'
import { LoadingState, ErrorState } from '@/components/state-components'

export default function PostureScoreRing() {
  const { score: scoreData, isLoading, isError, error, mutate } = usePostureScore()
  const score = scoreData?.today || 0

  if (isLoading) {
    return (
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Today's Score</h3>
        <LoadingState text="Loading your score..." />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Today's Score</h3>
        <ErrorState
          title="Failed to load score"
          description={error || 'Unable to fetch your posture score.'}
          onRetry={() => mutate()}
        />
      </Card>
    )
  }

  const data = [
    { name: 'score', value: score },
    { name: 'remaining', value: 100 - score },
  ]

  const getColor = (value: number) => {
    if (value >= 80) return '#059669'
    if (value >= 60) return '#d97706'
    return '#dc2626'
  }

  return (
    <Card className="p-7 border-border/60">
      <h3 className="text-lg font-semibold text-foreground mb-6">Today's Score</h3>

      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                <Cell fill={getColor(score)} />
                <Cell fill="#f0f4f8" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-foreground">{score}%</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">Good</p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Good posture</span>
          </div>
          <span className="font-semibold text-foreground text-sm">68%</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Fair posture</span>
          </div>
          <span className="font-semibold text-foreground text-sm">22%</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-destructive rounded-full"></div>
            <span className="text-sm text-muted-foreground">Poor posture</span>
          </div>
          <span className="font-semibold text-foreground text-sm">10%</span>
        </div>
      </div>
    </Card>
  )
}
