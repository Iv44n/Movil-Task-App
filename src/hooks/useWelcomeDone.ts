import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useWelcomeDone() {
  const [welcomeDone, setWelcomeDone] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWelcomeDone = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('welcomeDone')
      setWelcomeDone(value === 'true')
    } catch (err: any) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (mounted) await fetchWelcomeDone()
    }
    run()

    return () => {
      mounted = false
    }
  }, [fetchWelcomeDone])

  return { welcomeDone, isLoading, error }
}
