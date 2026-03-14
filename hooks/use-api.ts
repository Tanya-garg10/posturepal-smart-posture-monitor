import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePostureScore() {
  const { data, error, isLoading, mutate } = useSWR('/api/posture/score', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })
  return { score: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}

export function usePostureHistory() {
  const { data, error, isLoading, mutate } = useSWR('/api/posture/history', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })
  return { history: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}

export function usePostureAnalyze() {
  const analyze = async (payload?: {
    neck_angle?: number
    back_angle?: number
    shoulder_alignment?: number
    sitting_duration_minutes?: number
  }) => {
    const response = await fetch('/api/posture/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload ?? {}),
    })
    return response.json()
  }
  return { analyze }
}

export function useRecommendations() {
  const { data, error, isLoading, mutate } = useSWR('/api/recommendations', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  })
  return { recommendations: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}

export function useAlerts() {
  const { data, error, isLoading, mutate } = useSWR('/api/alerts', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  })
  return { alerts: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/settings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  })
  const updateSettings = async (updatedSettings: unknown) => {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings),
    })
    const result = await response.json()
    mutate()
    return result
  }
  return { settings: data?.data, isLoading, isError: !!error, error: error?.message, updateSettings, mutate }
}

export function useGamification() {
  const { data, error, isLoading, mutate } = useSWR('/api/gamification', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })
  return { gamification: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}

export function useCorporate() {
  const { data, error, isLoading, mutate } = useSWR('/api/corporate', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  })
  return { corporate: data?.data, isLoading, isError: !!error, error: error?.message, mutate }
}