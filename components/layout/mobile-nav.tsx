'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Home,
  Settings,
  Lightbulb,
  AlertCircle,
} from 'lucide-react'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Live Monitor', href: '/live-monitor', icon: Activity },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Recommendations', href: '/recommendations', icon: Lightbulb },
  { label: 'Alerts', href: '/alerts', icon: AlertCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
