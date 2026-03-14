const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(`${BASE_URL}${path}`, options)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
}

// Posture
export const getPostureScore = () => apiFetch('/api/posture/score')
export const getPostureHistory = () => apiFetch('/api/posture/history')
export const analyzePosture = (payload: {
    neck_angle: number
    back_angle: number
    shoulder_alignment: number
    sitting_duration_minutes: number
}) =>
    apiFetch('/api/posture/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

// Notifications
export const getNotifications = () => apiFetch('/api/notifications')

// Recommendations
export const getExercises = () => apiFetch('/api/recommendations/exercises')
export const getDeskSetup = () => apiFetch('/api/recommendations/desk-setup')

// Gamification
export const getGamificationStatus = () => apiFetch('/api/gamification/status')
export const updateStreak = (user_id: string, completed_day: boolean) =>
    apiFetch('/api/gamification/streak-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, completed_day }),
    })
export const unlockBadge = (user_id: string, badge_name: string) =>
    apiFetch('/api/gamification/badge-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, badge_name }),
    })

// Corporate
export const getCorporateDashboard = () => apiFetch('/api/corporate/dashboard')

// Settings
export const getSettings = () => apiFetch('/api/settings')
export const updateSettings = (payload: {
    user_id: string
    smart_reminders: boolean
    break_interval_minutes: number
    alert_sensitivity: string
    dark_mode: boolean
}) =>
    apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
