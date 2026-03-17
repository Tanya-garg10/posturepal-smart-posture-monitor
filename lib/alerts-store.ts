/**
 * In-memory live alerts store.
 * Live monitor pushes new alerts here; alert components read from here.
 */

export type LiveAlert = {
    id: string
    type: string
    message: string
    severity: 'low' | 'medium' | 'high'
    timestamp: string
    resolved: boolean
}

type Listener = () => void

let alerts: LiveAlert[] = []
const listeners = new Set<Listener>()

export const alertsStore = {
    getAlerts: () => alerts,

    push: (incoming: Omit<LiveAlert, 'id' | 'timestamp' | 'resolved'>[]) => {
        const now = new Date().toISOString()
        const newOnes: LiveAlert[] = incoming.map((a, i) => ({
            ...a,
            id: `live-${Date.now()}-${i}`,
            timestamp: now,
            resolved: false,
        }))
        // prepend, keep max 50
        alerts = [...newOnes, ...alerts].slice(0, 50)
        listeners.forEach((l) => l())
    },

    dismiss: (id: string) => {
        alerts = alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a))
        listeners.forEach((l) => l())
    },

    subscribe: (fn: Listener) => {
        listeners.add(fn)
        return () => listeners.delete(fn)
    },
}
