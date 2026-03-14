'use client'

import WeeklyChart from '@/components/analytics/weekly-chart'
import DailyScoreGraph from '@/components/analytics/daily-score-graph'
import PostureDoughnut from '@/components/analytics/posture-doughnut'
import InsightsCards from '@/components/analytics/insights-cards'
import HeatmapSection from '@/components/analytics/heatmap-section'
import { usePostureScore, usePostureHistory } from '@/hooks/use-api'
import { LoadingState } from '@/components/state-components'

export default function AnalyticsPage() {
  const { score, isLoading: scoreLoading } = usePostureScore()
  const { history, isLoading: historyLoading } = usePostureHistory()

  if (scoreLoading || historyLoading) {
    return (
      <div className="p-8">
        <LoadingState text="Loading your analytics..." />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-lg text-muted-foreground">Detailed insights into your posture patterns and improvements</p>
      </div>

      <InsightsCards scoreData={score} historyData={history} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart historyData={history} />
        <PostureDoughnut scoreData={score} />
      </div>

      <DailyScoreGraph historyData={history} />

      <HeatmapSection historyData={history} />
    </div>
  )
}
