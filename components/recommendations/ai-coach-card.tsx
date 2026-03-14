'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, MessageCircle, Send, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'coach'; text: string }

const COACH_RESPONSES: Record<string, string> = {
  default: "I'm here to help! Ask me about posture tips, exercises, or your daily habits.",
  slouch: "Try sitting with your back fully against the chair. Engage your core slightly — it helps maintain the natural curve of your spine.",
  neck: "Position your monitor so the top of the screen is at eye level. This reduces neck strain significantly.",
  break: "The 20-20-20 rule works great: every 20 minutes, look at something 20 feet away for 20 seconds. Also stand up every 45 minutes.",
  exercise: "Start with neck rolls and shoulder shrugs — they're quick and very effective. Check the Stretch Exercises tab for guided routines.",
  score: "Your posture score improves when you maintain consistent sitting habits. Small corrections throughout the day add up!",
  back: "Lumbar support is key. Roll up a small towel and place it at your lower back if your chair doesn't have built-in support.",
  shoulder: "Keep your shoulders relaxed and level. Avoid hunching forward — your elbows should rest at roughly 90° when typing.",
}

function getCoachReply(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('slouch') || lower.includes('hunch')) return COACH_RESPONSES.slouch
  if (lower.includes('neck') || lower.includes('head')) return COACH_RESPONSES.neck
  if (lower.includes('break') || lower.includes('rest') || lower.includes('sit')) return COACH_RESPONSES.break
  if (lower.includes('exercise') || lower.includes('stretch') || lower.includes('workout')) return COACH_RESPONSES.exercise
  if (lower.includes('score') || lower.includes('improve') || lower.includes('better')) return COACH_RESPONSES.score
  if (lower.includes('back') || lower.includes('spine') || lower.includes('lumbar')) return COACH_RESPONSES.back
  if (lower.includes('shoulder')) return COACH_RESPONSES.shoulder
  return COACH_RESPONSES.default
}

export default function AICoachCard() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', text: "Hi! I'm your AI posture coach. Ask me anything about posture, exercises, or healthy habits." },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { role: 'user', text }
    const coachMsg: Message = { role: 'coach', text: getCoachReply(text) }
    setMessages((prev) => [...prev, userMsg, coachMsg])
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      {!open ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">AI Coach</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized guidance based on your posture patterns and goals
            </p>
          </div>
          <div className="space-y-2 text-left bg-white/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-primary text-lg flex-shrink-0">💡</span>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Today's Insight</p>
                <p className="text-muted-foreground text-xs mt-1">
                  You tend to slouch after long sessions. Try a 2-min stretch break every 45 minutes.
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="w-full gap-2 bg-primary hover:bg-primary/90">
            <MessageCircle className="w-4 h-4" />
            Chat with Coach
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">AI Coach</p>
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-border/40 text-foreground rounded-bl-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about posture, exercises..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-border/60 bg-white outline-none focus:border-primary transition-colors"
            />
            <Button size="sm" onClick={handleSend} className="px-3 bg-primary hover:bg-primary/90">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
