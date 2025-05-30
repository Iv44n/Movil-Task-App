import { Colors } from '@/constants/colors'
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style='inverted' />
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}
