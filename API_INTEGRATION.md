# PosturePal API Integration Guide

This document outlines the frontend-ready API integration structure for PosturePal. All endpoints are mocked and ready for backend connection.

## API Endpoints

### 1. POST `/api/posture/analyze`
Real-time posture analysis endpoint.

**Request:**
```javascript
const { analyze } = usePostureAnalyze()
const result = await analyze()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-03-14T10:30:00Z",
    "neckAngle": 25,
    "spineAlignment": 85,
    "shoulderLevel": 5,
    "overallScore": 82,
    "status": "good",
    "detectedIssues": {
      "slouching": false,
      "neckStrain": true,
      "unevenShoulders": false
    }
  }
}
```

### 2. GET `/api/posture/history`
Fetches 24-hour posture history data for timeline visualization.

**Request:**
```javascript
const { history, isLoading, isError, mutate } = usePostureHistory()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-03-14T09:00:00Z",
      "hour": "09:00",
      "score": 78,
      "minutesMonitored": 45,
      "alerts": 2
    }
  ]
}
```

### 3. GET `/api/posture/score`
Retrieves overall posture scores for dashboard display.

**Request:**
```javascript
const { score, isLoading, isError, mutate } = usePostureScore()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "today": 82,
    "week": 78,
    "month": 75,
    "allTime": 72,
    "best": 95,
    "worst": 58,
    "streak": 5,
    "lastUpdated": "2024-03-14T10:30:00Z",
    "trend": "up",
    "percentageChange": 3.2
  }
}
```

### 4. GET `/api/recommendations`
Fetches personalized posture recommendations.

**Request:**
```javascript
const { recommendations, isLoading, isError, mutate } = useRecommendations()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Neck Stretch - 30 seconds",
      "category": "stretch",
      "description": "Gently stretch your neck muscles",
      "duration": 30,
      "difficulty": "Easy",
      "priority": "high",
      "instructions": [...]
    }
  ]
}
```

### 5. GET `/api/alerts`
Retrieves all user alerts.

**Request:**
```javascript
const { alerts, isLoading, isError, mutate } = useAlerts()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "Slouching Detected",
      "message": "Your posture has slouched",
      "severity": "high",
      "timestamp": "2024-03-14T10:25:00Z",
      "resolved": false,
      "category": "posture"
    }
  ]
}
```

### 6. GET/POST `/api/settings`
Manages user settings.

**GET Request:**
```javascript
const { settings, isLoading, updateSettings } = useSettings()
```

**POST Request:**
```javascript
const result = await updateSettings({
  notifications: { emailAlerts: true },
  monitoring: { sensitivityLevel: 7 }
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {...},
    "notifications": {...},
    "monitoring": {...},
    "display": {...},
    "privacy": {...},
    "devices": [...]
  }
}
```

## State Management with SWR

All hooks use SWR for automatic caching, deduplication, and revalidation:

```javascript
import { usePostureScore } from '@/hooks/use-api'

export function MyComponent() {
  const { score, isLoading, isError, error, mutate } = usePostureScore()

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={() => mutate()} />
  
  return <div>{score.today}%</div>
}
```

## State Components

### LoadingState
```typescript
<LoadingState text="Loading data..." />
```

### ErrorState
```typescript
<ErrorState
  title="Failed to load"
  description="Error message"
  onRetry={() => mutate()}
/>
```

### EmptyState
```typescript
<EmptyState
  title="No data"
  description="Start monitoring..."
  icon={ActivityIcon}
  action={{ label: "Start Now", onClick: () => {} }}
/>
```

## Component Integration Examples

### Dashboard with API Data
```typescript
'use client'

import { usePostureScore, useAlerts } from '@/hooks/use-api'
import { LoadingState, ErrorState } from '@/components/state-components'

export default function DashboardPage() {
  const { score, isLoading, isError, error, mutate } = usePostureScore()
  const { alerts } = useAlerts()

  if (isLoading) return <LoadingState text="Loading dashboard..." />
  if (isError) return <ErrorState onRetry={mutate} />

  return (
    <div>
      <h1>Today's Score: {score.today}%</h1>
      <p>Alerts: {alerts?.length}</p>
    </div>
  )
}
```

### Live Monitor with Real-time Analysis
```typescript
'use client'

import { usePostureAnalyze } from '@/hooks/use-api'
import { useState } from 'react'

export default function LiveMonitor() {
  const [analysis, setAnalysis] = useState(null)
  const { analyze } = usePostureAnalyze()

  const handleAnalyze = async () => {
    try {
      const result = await analyze()
      setAnalysis(result.data)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleAnalyze}>Start Analysis</button>
      {analysis && <MetricsDisplay data={analysis} />}
    </div>
  )
}
```

## Error Handling

All hooks include error handling:

```javascript
const { data, isError, error, mutate } = usePostureScore()

if (isError) {
  console.error('API Error:', error)
  return <ErrorState onRetry={mutate} />
}
```

## Revalidation & Caching

Configure cache duration per endpoint:

```javascript
// Cache for 60 seconds
const { score } = usePostureScore() // 60000ms default

// Custom interval
export async function GET() {
  await new Promise(r => setTimeout(r, 200)) // Simulate delay
  return NextResponse.json({ data: ... })
}
```

## Backend Connection

To connect real backend:

1. Replace mock data generation in `/app/api/*/route.ts`
2. Add database queries or external API calls
3. Keep response structure identical for frontend compatibility
4. Update error handling as needed

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Batch API requests
- [ ] Offline support with IndexedDB
- [ ] Request caching optimization
- [ ] Rate limiting and throttling
- [ ] Advanced error recovery
