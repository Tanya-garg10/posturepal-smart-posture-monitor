import { Video } from 'lucide-react'

export default function CameraFeed() {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
      {/* Skeleton Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

      {/* Camera Icon */}
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Video className="w-10 h-10 text-primary" />
        </div>
        <p className="text-white/60 text-sm">Camera feed live</p>
        <p className="text-white/40 text-xs mt-1">Click Start to begin monitoring</p>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <span className="text-white/80 text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Pose Skeleton Placeholder */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="320" cy="100" r="20" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Neck */}
        <line x1="320" y1="120" x2="320" y2="160" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Shoulders */}
        <line x1="280" y1="160" x2="360" y2="160" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Left Arm */}
        <line x1="280" y1="160" x2="240" y2="240" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        <line x1="240" y1="240" x2="220" y2="320" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Right Arm */}
        <line x1="360" y1="160" x2="400" y2="240" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        <line x1="400" y1="240" x2="420" y2="320" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Spine */}
        <line x1="320" y1="160" x2="320" y2="300" stroke="#10b981" strokeWidth="3" opacity="0.5" />

        {/* Left Leg */}
        <line x1="320" y1="300" x2="300" y2="400" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        <line x1="300" y1="400" x2="295" y2="470" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Right Leg */}
        <line x1="320" y1="300" x2="340" y2="400" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        <line x1="340" y1="400" x2="345" y2="470" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />

        {/* Joints */}
        <circle cx="320" cy="100" r="6" fill="#3b82f6" opacity="0.7" />
        <circle cx="320" cy="160" r="6" fill="#10b981" opacity="0.7" />
        <circle cx="280" cy="160" r="6" fill="#3b82f6" opacity="0.7" />
        <circle cx="360" cy="160" r="6" fill="#3b82f6" opacity="0.7" />
      </svg>
    </div>
  )
}
