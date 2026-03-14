'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, LogOut, AlertCircle, Clock, Trophy } from 'lucide-react'
import { mockUser } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getNotifications } from '@/lib/api'

type Notif = {
  id: number
  title: string
  message: string
  priority: string
  read: boolean
  timestamp: string
  category: string
}

function getCategoryIcon(category: string) {
  if (category === 'posture') return AlertCircle
  if (category === 'break') return Clock
  if (category === 'gamification') return Trophy
  return Bell
}

function getCategoryColor(category: string) {
  if (category === 'posture') return 'text-destructive bg-destructive/10'
  if (category === 'break') return 'text-amber-600 bg-amber-100/60'
  if (category === 'gamification') return 'text-secondary bg-secondary/10'
  return 'text-primary bg-primary/10'
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [readIds, setReadIds] = useState<number[]>([])

  useEffect(() => {
    getNotifications()
      .then((data: Notif[]) => setNotifs(data))
      .catch(() => { })
  }, [])

  const unread = notifs.filter((n) => !n.read && !readIds.includes(n.id))

  const markAllRead = () => setReadIds(notifs.map((n) => n.id))

  return (
    <header className="h-16 bg-white border-b border-border/60 px-8 flex items-center justify-between gap-6">
      <div className="hidden lg:flex items-center flex-1 gap-4">
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all ${searchFocused ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-border'}`}>
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts, alerts..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground/50"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2.5 hover:bg-muted rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              {unread.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread.length}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unread.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifs.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
                {notifs.map((n) => {
                  const Icon = getCategoryIcon(n.category)
                  const iconCls = getCategoryColor(n.category)
                  const isRead = n.read || readIds.includes(n.id)
                  return (
                    <div
                      key={n.id}
                      onClick={() => setReadIds((prev) => [...prev, n.id])}
                      className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors ${!isRead ? 'bg-primary/3' : ''}`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 h-fit ${iconCls}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-foreground leading-tight">{n.title}</p>
                          {!isRead && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="border-t border-border/40 px-4 py-2.5">
              <a href="/alerts" className="text-xs text-primary hover:underline block text-center">
                View all alerts →
              </a>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border/40"></div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-muted rounded-xl">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-10 h-10 rounded-full object-cover border border-border/40"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="flex flex-col py-3">
              <span className="text-sm font-semibold text-foreground">{mockUser.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{mockUser.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer py-2">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
