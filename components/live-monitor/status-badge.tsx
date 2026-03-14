import { CheckCircle2 } from 'lucide-react'

export default function StatusBadge({ status }: { status?: string }) {
  const isMonitoring = status === 'monitoring'
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full animate-pulse ${isMonitoring ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
      <div>
        <p className="text-sm font-semibold text-foreground">Status: {isMonitoring ? 'Monitoring' : 'Idle'}</p>
        <p className="text-xs text-muted-foreground">{isMonitoring ? 'Analyzing posture...' : 'Click Start to begin'}</p>
      </div>
    </div>
  )
}
