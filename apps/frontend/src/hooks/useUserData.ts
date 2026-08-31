'use client'

import { useState, useCallback } from 'react'
import { getUserData, type UserData } from '@/actions/user-data'

export function useUserData(initialData: UserData | null = null) {
  const [userData, setUserData] = useState<UserData | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    return getUserData()
      .then(setUserData)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  return { userData, loading, error, refetch }
}