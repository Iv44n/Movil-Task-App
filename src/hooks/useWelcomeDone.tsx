import { useState, useEffect } from 'react'
import { Storage } from 'expo-sqlite/kv-store'

interface UseWelcomeDoneResult {
  welcomeDone: boolean | null;
  isLoading: boolean;
  error: Error | null;
}

export function useWelcomeDone(): UseWelcomeDoneResult {
  const [welcomeDone, setWelcomeDone] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchWelcomeDone() {
      try {
        const value = await Storage.getItem('welcomeDone')
        if (!mounted) return
        setWelcomeDone(value === 'true')
      } catch (err: any) {
        if (!mounted) return
        setError(err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchWelcomeDone()

    return () => {
      mounted = false
    }
  }, [])

  return { welcomeDone, isLoading, error }
}
