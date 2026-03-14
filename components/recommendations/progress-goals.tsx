import { Card } from '@/components/ui/card'
import { mockGoals } from '@/lib/mock-data'
import { CheckCircle2, Target } from 'lucide-react'

export default function ProgressGoals() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Goals
      </h3>

      <div className="space-y-4">
        {mockGoals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{goal.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Due {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
              {goal.status === 'completed' && (
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              )}
            </div>

            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  goal.status === 'completed'
                    ? 'bg-secondary'
                    : 'bg-primary'
                }`}
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>

            <p className="text-xs text-muted-foreground text-right">{goal.progress}%</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
