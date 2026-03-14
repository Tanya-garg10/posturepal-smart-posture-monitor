import OverviewCards from '@/components/dashboard/overview-cards'
import LiveMonitorCard from '@/components/dashboard/live-monitor-card'
import PostureScoreRing from '@/components/dashboard/posture-score-ring'
import PostureTimeline from '@/components/dashboard/posture-timeline'
import AlertsList from '@/components/dashboard/alerts-list'
import QuickTipsCard from '@/components/dashboard/quick-tips-card'
import StreakCard from '@/components/dashboard/streak-card'
import RecommendationCard from '@/components/dashboard/recommendation-card'

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome back! Here's your posture overview for today.</p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <LiveMonitorCard />
          <PostureTimeline />
          <AlertsList />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PostureScoreRing />
          <StreakCard />
          <QuickTipsCard />
          <RecommendationCard />
        </div>
      </div>
    </div>
  )
}
