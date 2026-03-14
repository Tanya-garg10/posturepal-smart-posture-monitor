import { Card } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

export default function QuickTipsCard() {
  const tips = [
    'Keep your monitor at eye level',
    'Take a 5-minute break every hour',
    'Adjust your chair height properly',
    'Stretch your shoulders regularly',
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Quick Tips</h3>
      </div>

      <ul className="space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-bold flex-shrink-0 mt-0.5">•</span>
            <span className="text-foreground">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
