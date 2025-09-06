import { useState, useEffect } from 'react'
import * as Network from 'expo-network'

export default function useNetworkState() {
  const [isOnline, setIsOnline] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const state = await Network.getNetworkStateAsync()
      setIsOnline(state.isConnected ?? false)
    })()

    const subscription = Network.addNetworkStateListener((state) => {
      setIsOnline(state.isConnected ?? false)
    })

    return () => subscription.remove()
  }, [])

  return isOnline
}
