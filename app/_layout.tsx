import { initDatabase } from '@/database'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Layout() {
  useEffect(() => {
    initDatabase()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <StatusBar style='inverted' />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </SafeAreaView>
  )
}
