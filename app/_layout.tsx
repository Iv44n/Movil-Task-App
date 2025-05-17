import { initDatabase } from '@/database'
import { Slot } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Layout() {
  useEffect(() => {
    initDatabase()
  }, [])

  return (
    <View style={styles.container}>
      <Slot/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
