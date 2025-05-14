import { initDatabase } from '@/database'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

export default function Index() {
  useEffect(() => {
    initDatabase()
  }, [])

  return (
    <View >
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style='auto' />
    </View>
  )
}
