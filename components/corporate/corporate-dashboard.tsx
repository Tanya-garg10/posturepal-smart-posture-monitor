'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useCorporate } from '@/hooks/use-api'
import { Users, TrendingUp, Target, Heart } from 'lucide-react'
import { mockCorporateMode } from '@/lib/mock-data'

export default function CorporateDashboard() {
  const { corporate, isLoading } = useCorporate()

  // use mock data immediately while loading or if API fails
  const source = corporate ?? null

  const departmentData: { name: string; avgScore: number; employees: number }[] = source
    ? (source.departments ?? []).map((d: any) => ({
      name: d.name,
      avgScore: d.score ?? d.avgScore ?? 0,
      employees: d.employees ?? 20,
    }))
    : mockCorporateMode.departments.map((d) => ({
      name: d.name,
      avgScore: d.avgScore,
      employees: d.employees,
    }))

  const metrics = source
    ? {
      orgAvgScore: source.organization_average_score ?? source.dashboardMetrics?.orgAvgScore ?? 0,
      healthScore: source.health_score ?? source.dashboardMetrics?.healthScore ?? 0,
      complianceRate: source.compliance_rate ?? source.dashboardMetrics?.complianceRate ?? 0,
      activeUsers: source.participation_rate
        ? Math.round((source.participation_rate / 100) * 150)
        : source.dashboardMetrics?.activeUsers ?? 0,
      wellnessIndex: source.wellness_index ?? source.dashboardMetrics?.wellnessIndex ?? 0,
    }
    : mockCorporateMode.dashboardMetrics

  const data = {
    organizationName: source?.organizationName ?? mockCorporateMode.organizationName,
    organizationType: source?.organizationType ?? mockCorporateMode.organizationType,
    employees: source?.employees ?? mockCorporateMode.employees,
    departments: departmentData,
    dashboardMetrics: metrics,
  }

  const chartColors = ['#2563eb', '#059669', '#0891b2', '#d97706', '#dc2626']

  const metricsCards = [
    {
      title: 'Organization Avg Score',
      value: `${data.dashboardMetrics.orgAvgScore}%`,
      description: 'Overall posture health',
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Active Users',
      value: `${data.dashboardMetrics.activeUsers}/${data.employees}`,
      description: `${Math.round((data.dashboardMetrics.activeUsers / data.employees) * 100)}% participation`,
      icon: Users,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Health Score',
      value: `${data.dashboardMetrics.healthScore}/100`,
      description: 'Wellness index',
      icon: Heart,
      color: 'from-red-400 to-red-600',
    },
    {
      title: 'Compliance Rate',
      value: `${data.dashboardMetrics.complianceRate}%`,
      description: 'Program adherence',
      icon: Target,
      color: 'from-green-400 to-green-600',
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-7 border-border/60 bg-gradient-to-br from-purple-50/40 to-blue-50/40">
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{data.organizationName}</h2>
            <p className="text-muted-foreground capitalize">
              {data.organizationType} • Wellness Program Dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsCards.map((metric, idx) => {
              const Icon = metric.icon
              return (
                <div
                  key={idx}
                  className="p-5 bg-white rounded-xl border border-border/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Department Performance */}
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Department Performance</h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                }}
              />
              <Legend />
              <Bar dataKey="avgScore" fill="#2563eb" radius={[8, 8, 0, 0]} name="Avg Score" />
              <Bar dataKey="employees" fill="#059669" radius={[8, 8, 0, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Top Performers</p>
            {departmentData
              .sort((a, b) => b.avgScore - a.avgScore)
              .slice(0, 3)
              .map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">{dept.name}</span>
                  <span className="text-sm font-bold text-secondary">{dept.avgScore}%</span>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Largest Teams</p>
            {departmentData
              .sort((a, b) => b.employees - a.employees)
              .slice(0, 3)
              .map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <span className="text-sm text-foreground">{dept.name}</span>
                  <span className="text-sm font-bold text-primary">{dept.employees} staff</span>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Wellness Index */}
      <Card className="p-7 border-border/60">
        <h3 className="text-lg font-semibold text-foreground mb-6">Wellness Index</h3>

        <div className="flex items-center justify-center py-8">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: data.dashboardMetrics.wellnessIndex * 10 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  fill="#2563eb"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#f0f4f8" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-foreground">{data.dashboardMetrics.wellnessIndex.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">/10</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-4 bg-muted/40 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-2">PROGRAMS</p>
            <p className="text-xl font-bold text-foreground">5</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-2">EVENTS</p>
            <p className="text-xl font-bold text-foreground">12</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-2">TRAINED</p>
            <p className="text-xl font-bold text-foreground">98%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
