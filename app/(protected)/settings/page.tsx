'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockUser } from '@/lib/mock-data'
import { Save, Camera, Bell, Sliders, Smartphone, Eye, Lock, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: mockUser.name,
    email: mockUser.email,
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReport: true,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = useState({
    alertSensitivity: 70,
    monitoringHours: '8:00 AM - 6:00 PM',
    breakInterval: 60,
  })

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Profile Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <Button className="gap-2" variant="outline">
                <Camera className="w-4 h-4" />
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-10"
              />
            </div>

            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>

        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Desktop notifications for alerts' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get your weekly posture summary' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive product updates and offers' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    [item.key]: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Monitoring Preferences
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Alert Sensitivity: {preferences.alertSensitivity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.alertSensitivity}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  alertSensitivity: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Higher values = more sensitive alerts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Monitoring Hours
            </label>
            <Input
              value={preferences.monitoringHours}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  monitoringHours: e.target.value,
                })
              }
              className="h-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Break Interval (minutes)
            </label>
            <Input
              type="number"
              value={preferences.breakInterval}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  breakInterval: parseInt(e.target.value),
                })
              }
              className="h-10"
            />
          </div>
        </div>
      </Card>

      {/* Connected Devices */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Connected Devices
        </h2>

        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">This Device</p>
              <p className="text-sm text-muted-foreground">Last active now</p>
            </div>
            <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Security
        </h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Lock className="w-4 h-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Eye className="w-4 h-4" />
            Privacy Policy
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
