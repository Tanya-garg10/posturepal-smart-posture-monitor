'use client'

import StreakDisplay from '@/components/gamification/streak-display'
import BadgesGrid from '@/components/gamification/badges-grid'
import HealthCoach from '@/components/ai/health-coach'
import BreakReminder from '@/components/ai/break-reminder'
import DeskSetupRecommendation from '@/components/recommendations/desk-setup'
import StretchExercises from '@/components/recommendations/stretch-exercises'
import PoseSkeleton from '@/components/pose/pose-skeleton'
import NotificationCenter from '@/components/notifications/notification-center'
import CorporateDashboard from '@/components/corporate/corporate-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Flame, Lightbulb, Clock, Zap, Bell, Users,
  Crown, Sparkles, ShieldCheck, TrendingUp, Brain, Building2,
} from 'lucide-react'

const FEATURE_HIGHLIGHTS = [
  { icon: Brain, label: 'AI-Powered', desc: 'Real-time posture analysis', color: 'text-purple-500 bg-purple-50' },
  { icon: ShieldCheck, label: 'Health First', desc: 'Prevent long-term injury', color: 'text-green-500 bg-green-50' },
  { icon: TrendingUp, label: 'Track Progress', desc: 'Streaks, badges & goals', color: 'text-blue-500 bg-blue-50' },
  { icon: Building2, label: 'Team Ready', desc: 'Corporate dashboard', color: 'text-orange-500 bg-orange-50' },
]

const TABS = [
  { id: 'gamification', label: 'Gamification', icon: Flame },
  { id: 'ai-coach', label: 'AI Coach', icon: Lightbulb },
  { id: 'setup', label: 'Desk Setup', icon: Clock },
  { id: 'exercises', label: 'Stretches', icon: Zap },
  { id: 'pose', label: 'Pose AI', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'corporate', label: 'Corporate', icon: Users },
]

export default function FeaturesPage() {
  return (
    <div className="p-8 space-y-10 max-w-7xl">

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-300" />
              <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/30 text-xs font-semibold tracking-wide">
                PREMIUM PLAN
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              All Premium Features
            </h1>
            <p className="text-white/75 text-base max-w-lg">
              Everything you need to build better posture habits — AI coaching, gamification, real-time pose detection, and team tools.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Highlights Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {FEATURE_HIGHLIGHTS.map(({ icon: Icon, label, desc, color }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:shadow-sm transition-shadow">
            <div className={`p-2.5 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="gamification" className="w-full">
        <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full h-auto gap-2 bg-transparent p-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex flex-col items-center gap-2 px-3 py-2.5 text-xs rounded-xl border border-border/40 bg-card hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md transition-all"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="gamification" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreakDisplay />
            <BadgesGrid />
          </div>
        </TabsContent>

        <TabsContent value="ai-coach" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthCoach />
            <BreakReminder />
          </div>
        </TabsContent>

        <TabsContent value="setup" className="mt-8">
          <DeskSetupRecommendation />
        </TabsContent>

        <TabsContent value="exercises" className="mt-8">
          <StretchExercises />
        </TabsContent>

        <TabsContent value="pose" className="mt-8">
          <PoseSkeleton />
        </TabsContent>

        <TabsContent value="notifications" className="mt-8">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="corporate" className="mt-8">
          <CorporateDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
