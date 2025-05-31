import { Colors } from '@/constants/colors'
import { initDatabase } from '@/database'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import { fontFamily } from '@/constants/fontFamily'
import { StyleSheet } from 'react-native'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.extraLight]: require('../assets/fonts/Manrope-ExtraLight.ttf'),
    [fontFamily.light]: require('../assets/fonts/Manrope-Light.ttf'),
    [fontFamily.regular]: require('../assets/fonts/Manrope-Regular.ttf'),
    [fontFamily.medium]: require('../assets/fonts/Manrope-Medium.ttf'),
    [fontFamily.semiBold]: require('../assets/fonts/Manrope-SemiBold.ttf'),
    [fontFamily.bold]: require('../assets/fonts/Manrope-Bold.ttf'),
    [fontFamily.extraBold]: require('../assets/fonts/Manrope-ExtraBold.ttf')
  })

  useEffect(() => {
    async function prepare() {
      await initDatabase()

      if (fontError) {
        console.warn('Font loading error:', fontError)
      }

      await SplashScreen.hideAsync()
    }

    prepare()
  }, [fontError, fontsLoaded])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='inverted' />
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  }
})
