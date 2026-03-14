import { Card } from '@/components/ui/card'
import { AlertCircle, Lightbulb } from 'lucide-react'
import { EmptyState } from '@/components/state-components'

export default function DetectedIssues({ analysisData }: { analysisData?: any }) {
  // Convert API issues to display format
  const issues = analysisData?.detectedIssues ? Object.entries(analysisData.detectedIssues)
    .filter(([_, detected]) => detected)
    .map(([issue, _]) => {
      const issueMap: Record<string, { issue: string; fix: string; severity: 'low' | 'medium' | 'high' }> = {
        slouching: {
          issue: 'Slouching Detected',
          fix: 'Sit up straight and engage your core muscles',
          severity: 'high',
        },
        neckStrain: {
          issue: 'Neck Strain Risk',
          fix: 'Adjust your screen position to eye level',
          severity: 'high',
        },
        unevenShoulders: {
          issue: 'Uneven Shoulders',
          fix: 'Level your shoulders and relax your neck',
          severity: 'medium',
        },
      }
      return issueMap[issue] || null
    })
    .filter(Boolean) : []

  const severityColors = {
    low: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    medium: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
    high: 'bg-destructive/8 border-destructive/30',
  }

  const severityIcons = {
    low: 'text-blue-600',
    medium: 'text-amber-600',
    high: 'text-destructive',
  }

  return (
    <Card className="p-6 border-border/60">
      <h3 className="font-semibold text-foreground mb-4">Detected Issues</h3>

      {issues.length === 0 ? (
        <EmptyState
          title="No issues detected"
          description="Your posture looks great! Keep it up."
          icon={AlertCircle}
        />
      ) : (
        <div className="space-y-3">
          {issues.map((issue: any, idx: number) => (
            <div key={idx} className={`p-4 border rounded-xl transition-colors ${severityColors[issue.severity as keyof typeof severityColors]}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${severityIcons[issue.severity as keyof typeof severityIcons]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{issue.issue}</p>
                  <div className="flex items-start gap-2 mt-2">
                    <Lightbulb className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{issue.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
