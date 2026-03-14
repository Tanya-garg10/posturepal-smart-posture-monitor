'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Activity,
  BarChart3,
  Bell,
  Home,
  Settings,
  Lightbulb,
  AlertCircle,
  Zap,
  Crown,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Live Monitor',
    href: '/live-monitor',
    icon: Activity,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Recommendations',
    href: '/recommendations',
    icon: Lightbulb,
  },
  {
    label: 'Alerts',
    href: '/alerts',
    icon: AlertCircle,
  },
  {
    label: 'Premium Features',
    href: '/features',
    icon: Crown,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border/60">
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">PosturePal</h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
                isActive
                  ? 'bg-primary text-white shadow-md hover:shadow-lg'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/60">
        <div className="bg-gradient-to-br from-primary/12 to-secondary/12 rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-all">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Premium Active</p>
              <p className="text-xs text-muted-foreground mt-1">Advanced AI insights included</p>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md">
            Manage Plan
          </button>
        </div>
      </div>
    </aside>
  )
}
