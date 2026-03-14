import RecommendationCards from '@/components/recommendations/recommendation-cards'
import AICoachCard from '@/components/recommendations/ai-coach-card'
import ProgressGoals from '@/components/recommendations/progress-goals'
import { Card } from '@/components/ui/card'

export default function RecommendationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Recommendations</h1>
        <p className="text-muted-foreground">Personalized exercises and tips for better posture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecommendationCards />
        </div>
        <div className="space-y-6">
          <AICoachCard />
          <ProgressGoals />
        </div>
      </div>
    </div>
  )
}
