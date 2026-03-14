'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Check, X, AlertCircle, Trophy, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getNotifications } from '@/lib/api'

type Notification = {
  id: string | number
  type?: string
  category?: string
  title: string
  message: string
  timestamp: string | Date
  read: boolean
  actionable?: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dismissed, setDismissed] = useState<(string | number)[]>([])

  useEffect(() => {
    getNotifications()
      .then((data: any[]) => {
        const normalized = data.map((n) => ({
          id: n.id,
          type: n.category ?? n.type ?? 'info',
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          read: n.read,
          actionable: !n.read,
        }))
        setNotifications(normalized)
      })
      .catch(() => { })
  }, [])

  const handleDismiss = (id: string | number) => {
    setDismissed([...dismissed, id])
  }

  const handleMarkRead = (id: string | number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const visibleNotifications = notifications.filter((n) => !dismissed.includes(n.id))
  const unreadCount = visibleNotifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    // backend sends category: posture | break | gamification
    if (type === 'posture' || type === 'slouch' || type === 'neck-bend') return AlertCircle
    if (type === 'break') return Clock
    if (type === 'gamification' || type === 'achievement') return Trophy
    return Bell
  }

  const getNotificationColor = (type: string) => {
    if (type === 'posture' || type === 'slouch' || type === 'neck-bend') return {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      badge: 'bg-destructive/20 text-destructive',
      icon: 'text-destructive',
    }
    if (type === 'break') return {
      bg: 'bg-amber-50/40',
      border: 'border-amber-300/30',
      badge: 'bg-amber-200/40 text-amber-900',
      icon: 'text-amber-600',
    }
    if (type === 'gamification' || type === 'achievement') return {
      bg: 'bg-secondary/10',
      border: 'border-secondary/30',
      badge: 'bg-secondary/20 text-secondary',
      icon: 'text-secondary',
    }
    return {
      bg: 'bg-blue-50/40',
      border: 'border-blue-300/30',
      badge: 'bg-blue-200/40 text-blue-900',
      icon: 'text-blue-600',
    }
  }

  return (
    <Card className="p-7 border-border/60">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          {visibleNotifications.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(notifications.map((n) => n.id))}
              className="text-xs h-8"
            >
              Clear All
            </Button>
          )}
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">All caught up!</p>
            <p className="text-xs text-muted-foreground">You're maintaining great posture.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {visibleNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type ?? '')
              const colors = getNotificationColor(notification.type ?? '')

              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${colors.bg} ${colors.border} ${!notification.read ? 'ring-1 ring-primary/20' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colors.badge}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-foreground text-sm">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>

                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {notification.actionable && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="text-xs h-7 px-3"
                            onClick={() => handleMarkRead(notification.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Got it
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-3"
                            onClick={() => handleDismiss(notification.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
