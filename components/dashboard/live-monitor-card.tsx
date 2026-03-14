import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, ArrowRight } from 'lucide-react'

export default function LiveMonitorCard() {
  return (
    <Card className="p-7 bg-gradient-to-br from-primary/8 via-card to-secondary/6 border-border/60 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 bg-primary/15 rounded-xl flex items-center justify-center">
            <Activity className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Monitor</h3>
            <p className="text-xs text-muted-foreground">Real-time posture analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/15 rounded-full">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-secondary">Active</span>
        </div>
      </div>

      <div className="aspect-video bg-gradient-to-br from-muted to-muted/60 rounded-xl mb-6 flex items-center justify-center border border-border/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted-foreground/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Activity className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Camera feed appears here</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-secondary/8 rounded-xl text-center hover:bg-secondary/12 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Status</p>
          <p className="text-base font-bold text-secondary">Good</p>
        </div>
        <div className="p-3 bg-primary/8 rounded-xl text-center hover:bg-primary/12 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Score</p>
          <p className="text-base font-bold text-primary">82%</p>
        </div>
        <div className="p-3 bg-accent/8 rounded-xl text-center hover:bg-accent/12 transition-colors">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Duration</p>
          <p className="text-base font-bold text-accent">2m 15s</p>
        </div>
      </div>

      <Link href="/live-monitor">
        <Button className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
          Open Live Monitor
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  )
}
