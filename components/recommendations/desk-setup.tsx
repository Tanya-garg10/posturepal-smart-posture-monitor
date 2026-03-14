'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import { mockDeskSetup } from '@/lib/mock-data'

export default function DeskSetupRecommendation() {
  const setup = mockDeskSetup

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'optimal':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/30',
          icon: CheckCircle2,
          iconColor: 'text-secondary',
          badge: 'bg-secondary/20 text-secondary',
        }
      case 'needs-adjustment':
        return {
          bg: 'bg-amber-50/40',
          border: 'border-amber-200/50',
          icon: AlertCircle,
          iconColor: 'text-amber-600',
          badge: 'bg-amber-200/40 text-amber-900',
        }
      case 'missing':
        return {
          bg: 'bg-red-50/40',
          border: 'border-red-200/50',
          icon: AlertCircle,
          iconColor: 'text-destructive',
          badge: 'bg-destructive/20 text-destructive',
        }
      default:
        return {
          bg: 'bg-muted/40',
          border: 'border-border/40',
          icon: CheckCircle2,
          iconColor: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground',
        }
    }
  }

  const measurements = [
    { label: 'Monitor Distance', ...setup.monitorDistance },
    { label: 'Monitor Height', ...setup.monitorHeight },
    { label: 'Chair Height', ...setup.chairHeight },
    { label: 'Keyboard Height', ...setup.keyboardHeight },
  ]

  return (
    <Card className="p-7 border-border/60">
      <h3 className="text-xl font-semibold text-foreground mb-6">Desk Setup Guide</h3>

      <div className="space-y-4">
        {measurements.map((item, idx) => {
          const colors = getStatusColor(item.status)
          const Icon = colors.icon
          const needsAdjustment = item.current !== item.recommended

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border transition-all ${colors.bg} ${colors.border} group hover:shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${colors.badge}`}>
                  <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm mb-2">{item.label}</p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current</p>
                      <p className="text-lg font-bold text-foreground">
                        {item.current}
                        <span className="text-xs ml-1">{item.unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recommended</p>
                      <p className="text-lg font-bold text-primary">
                        {item.recommended}
                        <span className="text-xs ml-1">{item.unit}</span>
                      </p>
                    </div>
                  </div>

                  {needsAdjustment && (
                    <div className="flex items-center gap-2 text-xs text-amber-900 p-2 bg-amber-100/50 rounded-lg">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>Adjust by {Math.abs(item.recommended - item.current)}{item.unit} {item.current < item.recommended ? 'up' : 'down'}</span>
                    </div>
                  )}

                  {!needsAdjustment && (
                    <div className="flex items-center gap-2 text-xs text-secondary p-2 bg-secondary/10 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      <span>Perfect position</span>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )
        })}

        {/* Foot Support */}
        <div className={`p-5 rounded-xl border transition-all ${getStatusColor('missing').bg} ${getStatusColor('missing').border}`}>
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${getStatusColor('missing').badge}`}>
              <AlertCircle className={`w-5 h-5 ${getStatusColor('missing').iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm mb-2">Foot Support</p>
              <p className="text-xs text-muted-foreground mb-3">
                {setup.footSupport.recommendation}
              </p>
              <div className="text-xs text-destructive p-2 bg-destructive/10 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>Missing - Could improve circulation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 p-3 bg-muted/40 rounded-lg text-center">
        Proper desk ergonomics prevent long-term strain and improve productivity.
      </p>
    </Card>
  )
}
